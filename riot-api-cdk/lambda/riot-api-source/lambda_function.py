import json
import boto3
import requests
from typing import Dict, Any

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        # Get API key from Parameter Store
        ssm = boto3.client('ssm')
        api_key = ssm.get_parameter(
            Name='/rift-rewind/riot-api-key',
            WithDecryption=True
        )['Parameter']['Value']
        
        # Extract summoner name from path or query parameters
        summoner_name = event.get('queryStringParameters', {}).get('summoner', 'Doublelift')
        
        # Get PUUID from summoner name
        summoner_url = f"https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}"
        headers = {"X-Riot-Token": api_key}
        
        summoner_response = requests.get(summoner_url, headers=headers)
        if summoner_response.status_code != 200:
            return {
                'statusCode': summoner_response.status_code,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({'error': 'Summoner not found'})
            }
        
        puuid = summoner_response.json()['puuid']
        
        # Get match history
        matches_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?count=5"
        matches_response = requests.get(matches_url, headers=headers)
        
        if matches_response.status_code != 200:
            return {
                'statusCode': matches_response.status_code,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({'error': 'Failed to fetch matches'})
            }
        
        match_ids = matches_response.json()
        matches_data = []
        
        # Get match details for each match
        for match_id in match_ids[:3]:  # Limit to 3 matches
            match_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{match_id}"
            match_response = requests.get(match_url, headers=headers)
            
            if match_response.status_code == 200:
                match_data = match_response.json()
                # Find participant data for our summoner
                for participant in match_data['info']['participants']:
                    if participant['puuid'] == puuid:
                        matches_data.append({
                            'matchId': match_id,
                            'kills': participant['kills'],
                            'deaths': participant['deaths'],
                            'assists': participant['assists'],
                            'win': participant['win'],
                            'champion': participant['championName']
                        })
                        break
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(matches_data)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'error': str(e)})
        }