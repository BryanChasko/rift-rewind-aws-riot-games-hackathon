"""
Rift Rewind AWS Lambda Function

This Lambda function integrates with Riot Games APIs to provide League of Legends
champion and tournament data for the Rift Rewind hackathon project.

Features:
- Secure API key management via AWS SSM Parameter Store
- Multiple Riot API endpoint integration with fallback handling
- Detailed API attempt tracking for educational transparency
- Cost-effective architecture with curated data as primary source

Author: Bryan Chasko (@bryanChasko)
Project: AWS Rift Rewind Hackathon
"""

import json
import boto3
import urllib.request
import urllib.parse
from typing import Dict, Any, List, Optional
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
import traceback
import time

# Enable X-Ray tracing for all AWS SDK calls
patch_all()

# Constants for better maintainability
SSM_PARAMETER_NAME = '/rift-rewind/riot-api-key'
RIOT_API_HEADER = 'X-Riot-Token'
DATA_DRAGON_VERSION = '15.20.1'

def handle_contests_endpoint(api_attempts: List[Dict[str, Any]], year: str = '2024') -> Dict[str, Any]:
    """
    Handle contests endpoint - demonstrates uniform interface for tournament data.
    """
    all_contests = {
        '2024': [
            {'id': 'worlds2024', 'name': 'Worlds Championship 2024', 'status': 'completed', 'winner': 'T1'},
            {'id': 'msi2024', 'name': 'Mid-Season Invitational 2024', 'status': 'completed', 'winner': 'Gen.G'}
        ],
        '2023': [
            {'id': 'worlds2023', 'name': 'Worlds Championship 2023', 'status': 'completed', 'winner': 'T1'},
            {'id': 'msi2023', 'name': 'Mid-Season Invitational 2023', 'status': 'completed', 'winner': 'JDG'}
        ],
        '2022': [
            {'id': 'worlds2022', 'name': 'Worlds Championship 2022', 'status': 'completed', 'winner': 'DRX'},
            {'id': 'msi2022', 'name': 'Mid-Season Invitational 2022', 'status': 'completed', 'winner': 'RNG'}
        ],
        '2021': [
            {'id': 'worlds2021', 'name': 'Worlds Championship 2021', 'status': 'completed', 'winner': 'EDG'},
            {'id': 'msi2021', 'name': 'Mid-Season Invitational 2021', 'status': 'completed', 'winner': 'DK'}
        ]
    }
    
    contests_data = all_contests.get(year, all_contests['2024'])
    
    api_attempts.append({
        'endpoint': 'Contests API',
        'status': 'Success',
        'method': 'GET',
        'url': 'lambda://contests',
        'auth': 'None (demo data)',
        'result': 'Recent contests loaded',
        'data_count': len(contests_data)
    })
    
    trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Trace-Id': trace_id
        },
        'body': json.dumps({
            'data': contests_data,
            'source': 'CONTESTS',
            'api_attempts': api_attempts,
            'xray_trace_id': trace_id
        })
    }

def handle_players_endpoint(api_attempts: List[Dict[str, Any]], headers: Dict[str, str], make_request) -> Dict[str, Any]:
    """
    Handle players endpoint - demonstrates uniform interface for player data.
    """
    challenger_url = "https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5"
    challenger_data, status_code, error_details = make_request(challenger_url, headers)
    
    if challenger_data and 'entries' in challenger_data:
        top_players = challenger_data['entries'][:5]
        players_data = [{
            'summonerId': player.get('summonerId', 'unknown'),
            'summonerName': player.get('summonerName', 'Unknown'),
            'leaguePoints': player.get('leaguePoints', 0),
            'rank': player.get('rank', 'I'),
            'wins': player.get('wins', 0),
            'losses': player.get('losses', 0)
        } for player in top_players]
        
        api_attempts.append({
            'endpoint': 'Challenger League API',
            'status': 'Success',
            'method': 'GET',
            'url': challenger_url,
            'auth': 'X-Riot-Token required',
            'result': f'Retrieved {len(players_data)} challenger players',
            'status_code': status_code,
            'data_count': len(players_data)
        })
    else:
        players_data = []
        api_attempts.append({
            'endpoint': 'Challenger League API',
            'status': 'Failed',
            'method': 'GET',
            'url': challenger_url,
            'auth': 'X-Riot-Token required',
            'result': error_details,
            'status_code': status_code,
            'data_count': 0
        })
    
    trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Trace-Id': trace_id
        },
        'body': json.dumps({
            'data': players_data,
            'source': 'PLAYERS',
            'api_attempts': api_attempts,
            'xray_trace_id': trace_id
        })
    }

def get_endpoint_url(source: str) -> str:
    """
    Get the endpoint URL for display purposes in the frontend.
    
    Args:
        source (str): The data source identifier
        
    Returns:
        str: Human-readable endpoint description
    """
    endpoints = {
        'T1_CHAMPIONS': 'Curated T1 Worlds 2023 Champions data',
        'FEATURED_GAMES': 'https://na1.api.riotgames.com/lol/spectator/v5/featured-games',
        'CHAMPION_MASTERY': 'https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{id}',
        'CHALLENGER_LEAGUE': 'https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
        'DATA_DRAGON': f'https://ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json'
    }
    return endpoints.get(source, 'Unknown endpoint')

@xray_recorder.capture('lambda_handler')
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler function for Riot Games API integration.
    
    This function:
    1. Retrieves secure API keys from AWS SSM Parameter Store
    2. Attempts multiple Riot API endpoints with proper error handling
    3. Provides curated T1 Worlds 2023 championship data as primary source
    4. Returns detailed API attempt tracking for educational transparency
    
    Args:
        event (Dict[str, Any]): Lambda event object with queryStringParameters
        context (Any): Lambda context object (unused in this implementation)
        
    Returns:
        Dict[str, Any]: HTTP response with status code and JSON body containing:
            - data: List of champion/match data
            - source: Data source identifier
            - api_attempts: Detailed tracking of all API calls made
    """
    try:
        # Parse query parameters to determine endpoint
        query_params = event.get('queryStringParameters') or {}
        endpoint_type = query_params.get('endpoint', 'champions')
        
        print(f"Lambda invoked with endpoint: {endpoint_type}")
        # Retrieve encrypted API key from AWS Systems Manager Parameter Store
        # This follows AWS security best practices by not hardcoding secrets
        with xray_recorder.capture('ssm_get_parameter'):
            ssm = boto3.client('ssm')
            try:
                api_key = ssm.get_parameter(
                    Name=SSM_PARAMETER_NAME,
                    WithDecryption=True
                )['Parameter']['Value']
                xray_recorder.put_annotation('api_key_status', 'retrieved')
            except Exception as ssm_error:
                xray_recorder.put_annotation('api_key_status', 'failed')
                raise Exception(f'Failed to retrieve API key from SSM: {str(ssm_error)}')
        
        # Prepare headers for Riot API authentication
        headers = {RIOT_API_HEADER: api_key}
        
        @xray_recorder.capture('make_request')
        def make_request(url: str, headers: Optional[Dict[str, str]] = None) -> tuple[Optional[Dict[str, Any]], int, str]:
            """
            Helper function to make HTTP requests with detailed error reporting.
            
            Returns:
                tuple: (response_data, status_code, error_details)
            """
            req = urllib.request.Request(url)
            if headers:
                for key, value in headers.items():
                    req.add_header(key, value)
            
            try:
                with urllib.request.urlopen(req) as response:
                    return json.loads(response.read().decode()), response.status, 'Success'
            except urllib.error.HTTPError as e:
                error_body = e.read().decode() if e.fp else 'No response body'
                return None, e.code, f'HTTP {e.code}: {e.reason}. Response: {error_body[:200]}'
            except urllib.error.URLError as e:
                return None, 0, f'Network error: {str(e.reason)}'
            except json.JSONDecodeError as e:
                return None, 200, f'Invalid JSON response: {str(e)}'
            except Exception as e:
                return None, 0, f'Unexpected error: {str(e)}'
        
        # Initialize tracking structures for educational transparency
        # These provide detailed information about API calls for learning purposes
        api_attempts: List[Dict[str, Any]] = []
        live_data: List[Dict[str, Any]] = []
        
        # Remove dummy data - focus on real API calls only
        
        # Remove non-essential API calls - focus on challenger league only
        
        # Handle different endpoint types for uniform interface demonstration
        if endpoint_type == 'contests':
            year = query_params.get('year', '2024')
            return handle_contests_endpoint(api_attempts, year)
        elif endpoint_type == 'players':
            return handle_players_endpoint(api_attempts, headers, make_request)
        elif endpoint_type == 'challenger-league':
            return handle_players_endpoint(api_attempts, headers, make_request)
        else:
            # Default endpoint - no dummy data, just return empty with API attempts
            trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Trace-Id': trace_id
                },
                'body': json.dumps({
                    'data': [],
                    'source': 'EMPTY',
                    'api_attempts': api_attempts,
                    'xray_trace_id': trace_id,
                    'xray_console_url': f'https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/{trace_id}' if trace_id != 'unknown' else None
                })
            }
        
    except Exception as e:
        # Handle any unexpected errors gracefully with detailed diagnostics
        trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
        
        error_details = {
            'error_type': type(e).__name__,
            'error_message': str(e),
            'traceback': traceback.format_exc(),
            'timestamp': int(time.time()),
            'lambda_request_id': context.aws_request_id if context else 'unknown',
            'xray_trace_id': trace_id,
            'xray_console_url': f'https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/{trace_id}' if trace_id != 'unknown' else None,
            'event_details': {
                'query_params': event.get('queryStringParameters', {}),
                'headers': event.get('headers', {}),
                'method': event.get('httpMethod', 'unknown')
            },
            'troubleshooting': {
                'github_repo': 'https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon',
                'common_causes': [
                    'API key expired or invalid in SSM Parameter Store',
                    'Riot API rate limits exceeded',
                    'Network connectivity issues',
                    'Lambda timeout or memory limits'
                ],
                'next_steps': [
                    'Check CloudWatch logs for detailed error traces',
                    'Verify API key in SSM Parameter Store',
                    f'View X-Ray trace: {trace_id}' if trace_id != 'unknown' else 'X-Ray trace not available',
                    'Contact Bryan Chasko via GitHub issues'
                ]
            }
        }
        
        # Log comprehensive error details for CloudWatch
        print(f"LAMBDA ERROR: {json.dumps(error_details, indent=2)}")
        
        # Add X-Ray annotations for error tracking
        xray_recorder.put_annotation('error_type', type(e).__name__)
        xray_recorder.put_annotation('endpoint', event.get('queryStringParameters', {}).get('endpoint', 'unknown'))
        xray_recorder.put_annotation('error_occurred', True)
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Trace-Id': trace_id
            },
            'body': json.dumps({
                'error': error_details,
                'message': 'Lambda function encountered an error - detailed diagnostics included'
            })
        }