"""
Summoner Lookup Lambda Function

Fetches summoner data and champion mastery using Riot ID.
"""

import json
import boto3
import urllib.request
import urllib.parse
from typing import Dict, Any
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import traceback

# Enable X-Ray tracing
patch_all()

SSM_PARAMETER_NAME = '/rift-rewind/riot-api-key'
RIOT_API_HEADER = 'X-Riot-Token'

def get_routing_value(region: str) -> str:
    """Map platform region to routing value for Riot ID API"""
    routing_map = {
        'na1': 'americas',
        'br1': 'americas',
        'la1': 'americas',
        'la2': 'americas',
        'euw1': 'europe',
        'eun1': 'europe',
        'tr1': 'europe',
        'ru': 'europe',
        'kr': 'asia',
        'jp1': 'asia',
        'oc1': 'sea'
    }
    return routing_map.get(region, 'americas')

@xray_recorder.capture('lambda_handler')
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for summoner lookup by Riot ID.
    Expected input: {"summonerName": "GameName#TAG", "region": "na1"}
    """
    try:
        # Parse request
        body = json.loads(event.get('body', '{}'))
        summoner_name = body.get('summonerName', '').strip()
        region = body.get('region', 'na1')
        
        # Validate input
        if not summoner_name or '#' not in summoner_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Please use Riot ID format: GameName#TAG (e.g., Doublelift#NA1)'
                })
            }
        
        # Get API key from SSM
        with xray_recorder.capture('ssm_get_parameter'):
            ssm = boto3.client('ssm')
            api_key = ssm.get_parameter(
                Name=SSM_PARAMETER_NAME,
                WithDecryption=True
            )['Parameter']['Value']
        
        headers = {RIOT_API_HEADER: api_key}
        
        # Parse Riot ID
        game_name, tag_line = summoner_name.split('#', 1)
        game_name = urllib.parse.quote(game_name)
        tag_line = urllib.parse.quote(tag_line)
        
        # Step 1: Get PUUID from Riot ID
        routing_value = get_routing_value(region)
        account_url = f"https://{routing_value}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
        
        with xray_recorder.capture('get_account'):
            req = urllib.request.Request(account_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                if response.status == 404:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'error': 'Riot ID not found. Check spelling and region.'
                        })
                    }
                account_data = json.loads(response.read().decode())
        
        puuid = account_data['puuid']
        
        # Step 2: Get summoner data
        summoner_url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
        
        with xray_recorder.capture('get_summoner'):
            req = urllib.request.Request(summoner_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                summoner_data = json.loads(response.read().decode())
        
        # Step 3: Get top 3 champion masteries
        mastery_url = f"https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top?count=3"
        
        mastery_data = []
        try:
            with xray_recorder.capture('get_mastery'):
                req = urllib.request.Request(mastery_url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    mastery_data = json.loads(response.read().decode())
        except:
            pass  # Mastery data is optional
        
        # Get X-Ray trace ID
        trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
        
        # Format response
        response_data = {
            'summoner': {
                'name': f"{account_data['gameName']}#{account_data['tagLine']}",
                'level': summoner_data['summonerLevel'],
                'puuid': puuid
            },
            'topChampions': mastery_data[:3],
            'xray_trace_id': trace_id
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Trace-Id': trace_id
            },
            'body': json.dumps(response_data)
        }
        
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if hasattr(e, 'read') else str(e)
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'API error {e.code}: {error_body}'
            })
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        traceback.print_exc()
        
        trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Trace-Id': trace_id
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'xray_trace_id': trace_id
            })
        }