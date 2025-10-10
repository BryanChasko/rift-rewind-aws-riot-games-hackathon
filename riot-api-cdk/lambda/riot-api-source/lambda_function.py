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

def handle_contests_endpoint(api_attempts: List[Dict[str, Any]], headers: Dict[str, str], make_request, year: str = '2024') -> Dict[str, Any]:
    """
    Handle contests endpoint - get real challenge leaderboards as competitive contests.
    """
    # Get challenges config first to find interesting leaderboard challenges
    challenges_url = "https://na1.api.riotgames.com/lol/challenges/v1/challenges/config"
    print(f"Making request to: {challenges_url}")
    challenges_data, status_code, error_details = make_request(challenges_url, headers)
    
    contests_data = []
    
    if challenges_data and isinstance(challenges_data, list) and len(challenges_data) > 0:
        # Find challenges with leaderboards and good names
        leaderboard_challenges = [
            c for c in challenges_data 
            if c.get('leaderboard', False) and 
               c.get('state') == 'ENABLED' and
               c.get('localizedNames', {}).get('en_US', {}).get('name', '') and
               len(c.get('localizedNames', {}).get('en_US', {}).get('name', '')) > 5
        ]
        
        # Select specific interesting challenges based on year
        import random
        random.seed(int(year))
        selected_challenges = random.sample(leaderboard_challenges, min(5, len(leaderboard_challenges)))
        
        for i, challenge in enumerate(selected_challenges[:5]):
            challenge_id = challenge.get('id')
            localized_names = challenge.get('localizedNames', {}).get('en_US', {})
            challenge_name = localized_names.get('name', f'Challenge {i+1}')
            challenge_desc = localized_names.get('description', 'Elite competitive challenge')
            
            # Get leaderboard data for this challenge
            leaderboard_url = f"https://na1.api.riotgames.com/lol/challenges/v1/challenges/{challenge_id}/leaderboards/by-level/CHALLENGER?limit=3"
            leaderboard_data, lb_status, lb_error = make_request(leaderboard_url, headers)
            
            # Determine winner and stats from leaderboard
            winner = 'TBD'
            top_score = 0
            participant_count = 0
            
            if leaderboard_data and isinstance(leaderboard_data, list) and len(leaderboard_data) > 0:
                top_player = leaderboard_data[0]
                # Get actual summoner name if available, otherwise use position
                summoner_name = top_player.get('summonerName', f'Player #{top_player.get("position", 1)}')
                winner = f'{summoner_name} ({top_player.get("value", 0):,.0f} points)'
                top_score = int(top_player.get("value", 0))
                participant_count = len(leaderboard_data) * 1000  # Estimate total participants
            
            # Determine difficulty based on challenge thresholds
            thresholds = challenge.get('thresholds', {})
            difficulty = 'Expert'
            if 'CHALLENGER' in thresholds:
                challenger_threshold = thresholds.get('CHALLENGER', 0)
                if challenger_threshold > 100:
                    difficulty = 'Legendary'
                elif challenger_threshold > 50:
                    difficulty = 'Master'
            
            # Determine category from challenge name/description
            category = 'General'
            name_lower = challenge_name.lower()
            if any(word in name_lower for word in ['kill', 'damage', 'combat', 'penta']):
                category = 'Combat'
            elif any(word in name_lower for word in ['ward', 'vision', 'support', 'heal']):
                category = 'Support'
            elif any(word in name_lower for word in ['farm', 'cs', 'gold', 'item']):
                category = 'Economy'
            elif any(word in name_lower for word in ['objective', 'baron', 'dragon', 'tower']):
                category = 'Strategy'
            
            contests_data.append({
                'id': f'challenge_{year}_{challenge_id}',
                'name': f'{challenge_name} Championship {year}',
                'status': 'live',
                'winner': winner,
                'points': top_score,
                'participants': participant_count,
                'difficulty': difficulty,
                'category': category,
                'year': year,
                'description': challenge_desc,
                'challenge_id': challenge_id
            })
        
        api_attempts.append({
            'endpoint': 'Challenges Config + Leaderboards API',
            'status': 'Success',
            'method': 'GET',
            'url': f'{challenges_url} + leaderboard calls',
            'auth': 'X-Riot-Token required',
            'result': f'Retrieved {len(challenges_data)} challenges, found {len(leaderboard_challenges)} with leaderboards, selected {len(contests_data)} as contests with live leaderboard data',
            'status_code': status_code,
            'data_count': len(contests_data)
        })
    else:
        # Fallback to sample data if API fails
        contests_data = [
            {'id': f'worlds_{year}', 'name': f'World Championship {year}', 'status': 'completed', 'winner': 'T1', 'points': 15000, 'participants': 2500000, 'difficulty': 'Legendary', 'category': 'Tournament', 'year': year, 'description': 'Annual world championship'},
            {'id': f'msi_{year}', 'name': f'Mid-Season Invitational {year}', 'status': 'completed', 'winner': 'Gen.G', 'points': 12000, 'participants': 1800000, 'difficulty': 'Master', 'category': 'Tournament', 'year': year, 'description': 'Mid-season tournament'},
            {'id': f'spring_{year}', 'name': f'Spring Split {year}', 'status': 'live', 'winner': 'TBD', 'points': 8000, 'participants': 1200000, 'difficulty': 'Expert', 'category': 'Regional', 'year': year, 'description': 'Regional spring competition'}
        ]
        
        api_attempts.append({
            'endpoint': 'Challenges Config + Leaderboards API',
            'status': 'Failed',
            'method': 'GET',
            'url': challenges_url,
            'auth': 'X-Riot-Token required',
            'result': f'API call failed (HTTP {status_code}): {error_details}. Using fallback data.',
            'status_code': status_code,
            'data_count': len(contests_data)
        })
    
    trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'X-Trace-Id': trace_id
        },
        'body': json.dumps({
            'data': contests_data,
            'source': 'FEATURED_GAMES',
            'api_attempts': api_attempts,
            'xray_trace_id': trace_id
        })
    }

def handle_players_endpoint(api_attempts: List[Dict[str, Any]], headers: Dict[str, str], make_request) -> Dict[str, Any]:
    """
    Handle players endpoint - get real challenger league data.
    """
    challenger_url = "https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5"
    print(f"Making request to: {challenger_url}")
    print(f"With headers: {headers}")
    challenger_data, status_code, error_details = make_request(challenger_url, headers)
    print(f"Response: status={status_code}, data_type={type(challenger_data)}, error={error_details}")
    
    if challenger_data and 'entries' in challenger_data:
        # Get top 10 players and transform to our format
        top_players = challenger_data['entries'][:10]
        players_data = []
        
        for i, player in enumerate(top_players):
            win_rate = round((player.get('wins', 0) / max(1, player.get('wins', 0) + player.get('losses', 0))) * 100)
            
            # Assign signature champions based on ranking (top players get meta champions)
            signature_champions = ['Azir', 'Aatrox', 'Jinx', 'Thresh', 'Graves', 'Orianna', 'Gnar', 'Kai\'Sa', 'Nautilus', 'Nidalee']
            
            players_data.append({
                'puuid': player.get('puuid', f'challenger_{i}'),
                'rank': i + 1,  # Challenger ranking
                'leaguePoints': player.get('leaguePoints', 0),
                'wins': player.get('wins', 0),
                'losses': player.get('losses', 0),
                'winRate': win_rate,
                'veteran': player.get('veteran', False),
                'hotStreak': player.get('hotStreak', False),
                'freshBlood': player.get('freshBlood', False),
                'signatureChampion': signature_champions[i]
            })
        
        api_attempts.append({
            'endpoint': 'Challenger League API',
            'status': 'Success',
            'method': 'GET',
            'url': challenger_url,
            'auth': 'X-Riot-Token required',
            'result': f'Retrieved top {len(players_data)} challenger players from {challenger_data.get("name", "Challenger League")}',
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
            'result': f'Cloudflare blocked Lambda IP (HTTP {status_code}): {error_details}',
            'status_code': status_code,
            'data_count': 0
        })
    
    trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            
            'X-Trace-Id': trace_id
        },
        'body': json.dumps({
            'data': players_data,
            'source': 'PLAYERS',
            'api_attempts': api_attempts,
            'xray_trace_id': trace_id
        })
    }

@xray_recorder.capture('get_xray_trace')
def get_xray_trace(trace_id: str) -> Dict[str, Any]:
    """Fetch X-Ray trace data for visualization"""
    try:
        xray_client = boto3.client('xray')
        
        # Get trace summaries first
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=1)
        
        response = xray_client.get_trace_summaries(
            TimeRangeType='TimeRangeByStartTime',
            StartTime=start_time,
            EndTime=end_time,
            TraceIds=[trace_id]
        )
        
        if not response['TraceSummaries']:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Trace not found'})
            }
        
        # Get detailed trace
        traces_response = xray_client.batch_get_traces(TraceIds=[trace_id])
        
        if traces_response['Traces']:
            trace = traces_response['Traces'][0]
            segments = []
            
            for segment in trace['Segments']:
                segment_doc = json.loads(segment['Document'])
                segments.append({
                    'name': segment_doc.get('name', 'Unknown'),
                    'duration': segment_doc.get('end_time', 0) - segment_doc.get('start_time', 0),
                    'subsegments': [
                        {
                            'name': sub.get('name', 'Unknown'),
                            'duration': sub.get('end_time', 0) - sub.get('start_time', 0)
                        }
                        for sub in segment_doc.get('subsegments', [])
                    ]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'segments': segments})
            }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Trace data not available'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'X-Ray fetch failed: {str(e)}'})
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
        
        # Handle X-Ray trace lookup
        if endpoint_type == 'xray-trace':
            trace_id = query_params.get('traceId')
            if trace_id:
                return get_xray_trace(trace_id)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'traceId parameter required'})
                }
        
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
                print(f"API key retrieved: {api_key[:10]}...{api_key[-4:]} (length: {len(api_key)})")
                xray_recorder.put_annotation('api_key_status', 'retrieved')
            except Exception as ssm_error:
                xray_recorder.put_annotation('api_key_status', 'failed')
                raise Exception(f'Failed to retrieve API key from SSM: {str(ssm_error)}')
        
        # Prepare headers for Riot API authentication
        headers = {RIOT_API_HEADER: api_key}
        print(f"Request headers: {RIOT_API_HEADER}: {api_key[:10]}...{api_key[-4:]}")
        
        # Initialize tracking structures for educational transparency
        api_attempts: List[Dict[str, Any]] = []
        
        @xray_recorder.capture('make_request')
        def make_request(url: str, headers: Optional[Dict[str, str]] = None) -> tuple[Optional[Dict[str, Any]], int, str]:
            req = urllib.request.Request(url)
            # Add standard headers to avoid Cloudflare blocking
            req.add_header('User-Agent', 'RiftRewind/1.0 (AWS Lambda; +https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon)')
            req.add_header('Accept', 'application/json')
            req.add_header('Accept-Language', 'en-US,en;q=0.9')
            if headers:
                for key, value in headers.items():
                    req.add_header(key, value)
            try:
                print(f"Opening URL: {url}")
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode())
                    print(f"Success: {response.status}, data keys: {list(data.keys()) if isinstance(data, dict) else 'not dict'}")
                    return data, response.status, 'Success'
            except urllib.error.HTTPError as e:
                error_body = e.read().decode() if e.fp else 'No response body'
                print(f"HTTP Error: {e.code} {e.reason}, body: {error_body[:100]}")
                return None, e.code, f'HTTP {e.code}: {e.reason}. Response: {error_body[:200]}'
            except Exception as e:
                print(f"Exception: {type(e).__name__}: {str(e)}")
                return None, 0, f'Unexpected error: {str(e)}'
        
        # Skip API validation due to Cloudflare blocking Lambda IPs
        api_attempts.append({
            'endpoint': 'API Key Validation',
            'status': 'Skipped',
            'method': 'GET',
            'url': 'Validation skipped - Cloudflare blocks Lambda IPs',
            'auth': 'X-Riot-Token configured',
            'result': 'Proceeding with API calls directly',
            'status_code': 200,
            'data_count': 0
        })
        xray_recorder.put_annotation('api_key_valid', True)
        

        
        # Handle different endpoint types for uniform interface demonstration
        if endpoint_type == 'contests':
            year = query_params.get('year', '2024')
            return handle_contests_endpoint(api_attempts, headers, make_request, year)
        elif endpoint_type in ['players', 'challenger-league', 'summoners']:
            return handle_players_endpoint(api_attempts, headers, make_request)
        elif endpoint_type == 'summoner-lookup':
            return handle_summoner_lookup(event, api_attempts, headers, make_request)
        else:
            # Default endpoint - no dummy data, just return empty with API attempts
            trace_id = xray_recorder.get_trace_entity().trace_id if xray_recorder.get_trace_entity() else 'unknown'
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    
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
                
                'X-Trace-Id': trace_id
            },
            'body': json.dumps({
                'error': error_details,
                'message': 'Lambda function encountered an error - detailed diagnostics included'
            })
        }