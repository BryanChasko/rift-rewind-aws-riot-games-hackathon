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
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'data': contests_data,
            'source': 'CONTESTS',
            'api_attempts': api_attempts
        })
    }

def handle_players_endpoint(api_attempts: List[Dict[str, Any]], headers: Dict[str, str], make_request) -> Dict[str, Any]:
    """
    Handle players endpoint - demonstrates uniform interface for player data.
    """
    # Try Challenger League API for top players
    try:
        challenger_url = "https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5"
        challenger_data = make_request(challenger_url, headers)
        
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
                'url': 'na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
                'auth': 'X-Riot-Token required',
                'result': f'Top {len(players_data)} challenger players',
                'data_count': len(players_data)
            })
        else:
            raise Exception("No challenger data available")
            
    except Exception as e:
        # Fallback to demo data
        players_data = [
            {'summonerId': 'demo1', 'summonerName': 'Faker', 'leaguePoints': 1500, 'rank': 'I', 'wins': 150, 'losses': 50},
            {'summonerId': 'demo2', 'summonerName': 'Canyon', 'leaguePoints': 1450, 'rank': 'I', 'wins': 140, 'losses': 60},
            {'summonerId': 'demo3', 'summonerName': 'Showmaker', 'leaguePoints': 1400, 'rank': 'I', 'wins': 130, 'losses': 70}
        ]
        
        api_attempts.append({
            'endpoint': 'Challenger League API',
            'status': 'Failed',
            'method': 'GET',
            'url': 'na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
            'auth': 'X-Riot-Token required',
            'result': f'API failed, using demo data: {str(e)}',
            'data_count': len(players_data)
        })
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'data': players_data,
            'source': 'PLAYERS',
            'api_attempts': api_attempts
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
        ssm = boto3.client('ssm')
        api_key = ssm.get_parameter(
            Name=SSM_PARAMETER_NAME,
            WithDecryption=True
        )['Parameter']['Value']
        
        # Prepare headers for Riot API authentication
        headers = {RIOT_API_HEADER: api_key}
        
        def make_request(url: str, headers: Optional[Dict[str, str]] = None) -> Optional[Dict[str, Any]]:
            """
            Helper function to make HTTP requests with proper error handling.
            
            Args:
                url (str): The URL to request
                headers (Optional[Dict[str, str]]): HTTP headers to include
                
            Returns:
                Optional[Dict[str, Any]]: Parsed JSON response or None if failed
            """
            req = urllib.request.Request(url)
            if headers:
                for key, value in headers.items():
                    req.add_header(key, value)
            
            try:
                with urllib.request.urlopen(req) as response:
                    return json.loads(response.read().decode())
            except Exception as e:
                # Log error for CloudWatch monitoring
                print(f"Request failed for {url}: {e}")
                return None
        
        # Initialize tracking structures for educational transparency
        # These provide detailed information about API calls for learning purposes
        api_attempts: List[Dict[str, Any]] = []
        live_data: List[Dict[str, Any]] = []
        
        # PRIMARY DATA SOURCE: T1 Worlds 2023 Champions
        # This curated data ensures the application always has meaningful content
        # and reduces dependency on external API availability
        t1_champions = [
            {'champion': 'Azir', 'title': 'The Emperor of Shurima', 'performance': 89},
            {'champion': 'Aatrox', 'title': 'The Darkin Blade', 'performance': 92}, 
            {'champion': 'Jinx', 'title': 'The Loose Cannon', 'performance': 87},
            {'champion': 'Thresh', 'title': 'The Chain Warden', 'performance': 85},
            {'champion': 'Graves', 'title': 'The Outlaw', 'performance': 83}
        ]
        
        # Track the curated data source for transparency
        api_attempts.append({
            'endpoint': 'T1 Champions Data',
            'status': 'Success',
            'method': 'INTERNAL',
            'url': 'lambda://curated-data',
            'auth': 'None (internal data)',
            'result': 'T1 Worlds 2023 championship data loaded',
            'data_count': len(t1_champions)
        })
        
        # Transform curated champion data into match-like format for frontend consumption
        # Performance scores are converted to game-like statistics for educational display
        for champ in t1_champions:
            live_data.append({
                'matchId': champ['title'],  # Champion lore title
                'kills': champ['performance'] // 5,  # Attack power derived from performance
                'deaths': (100 - champ['performance']) // 10,  # Defense rating (inverse)
                'assists': champ['performance'] // 6,  # Speed rating
                'win': champ['performance'] > 85,  # S-Tier vs A-Tier classification
                'champion': champ['champion']  # Champion name
            })
        
        # SECONDARY DATA SOURCE: Riot Games Featured Games API
        # This endpoint provides live high-level matches but requires special access
        # Note: This endpoint has been deprecated (HTTP 410) as of recent API changes
        try:
            featured_url = "https://na1.api.riotgames.com/lol/spectator/v5/featured-games"
            featured_data = make_request(featured_url, headers)
            
            # Handle successful response with game list
            if featured_data and 'gameList' in featured_data:
                api_attempts.append({
                    'endpoint': 'Featured Games API',
                    'status': 'Success',
                    'method': 'GET',
                    'url': 'na1.api.riotgames.com/lol/spectator/v5/featured-games',
                    'auth': 'X-Riot-Token required',
                    'result': f"Live matches ({len(featured_data.get('gameList', []))} games)",
                    'data_count': len(featured_data.get('gameList', []))
                })
            # Handle deprecated endpoint response (HTTP 410)
            elif featured_data and 'status' in featured_data:
                api_attempts.append({
                    'endpoint': 'Featured Games API',
                    'status': 'Deprecated',
                    'method': 'GET',
                    'url': 'na1.api.riotgames.com/lol/spectator/v5/featured-games',
                    'auth': 'X-Riot-Token required',
                    'result': f"HTTP {featured_data.get('status', {}).get('status_code', 410)}: {featured_data.get('status', {}).get('message', 'Gone')}",
                    'data_count': 0
                })
            # Handle empty or malformed response
            else:
                api_attempts.append({
                    'endpoint': 'Featured Games API',
                    'status': 'No Data',
                    'method': 'GET',
                    'url': 'na1.api.riotgames.com/lol/spectator/v5/featured-games',
                    'auth': 'X-Riot-Token required',
                    'result': 'Empty response or invalid format',
                    'data_count': 0
                })
        except Exception as e:
            # Handle network errors and API failures gracefully
            error_msg = str(e)
            # Detect deprecated endpoint (HTTP 410 Gone)
            if '410' in error_msg or 'Gone' in error_msg:
                status = 'Deprecated'
                result = 'Endpoint no longer available (HTTP 410)'
            else:
                status = 'Failed'
                result = f'Request failed: {error_msg}'
            
            api_attempts.append({
                'endpoint': 'Featured Games API',
                'status': status,
                'method': 'GET',
                'url': 'na1.api.riotgames.com/lol/spectator/v5/featured-games',
                'auth': 'X-Riot-Token required',
                'result': result,
                'data_count': 0
            })
        
        # TERTIARY DATA SOURCE: Riot Data Dragon API
        # This is a public CDN that provides static game data without authentication
        # It's highly reliable and doesn't count against API rate limits
        try:
            champions_url = f"https://ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json"
            champions_data = make_request(champions_url)  # No auth headers needed
            
            # Handle successful Data Dragon response
            if champions_data and 'data' in champions_data:
                api_attempts.append({
                    'endpoint': 'Data Dragon API',
                    'status': 'Success',
                    'method': 'GET',
                    'url': f'ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json',
                    'auth': 'Public (no auth required)',
                    'result': f"Champion metadata loaded successfully",
                    'data_count': len(champions_data['data'])
                })
            # Handle empty or malformed Data Dragon response
            else:
                api_attempts.append({
                    'endpoint': 'Data Dragon API',
                    'status': 'No Data',
                    'method': 'GET',
                    'url': f'ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json',
                    'auth': 'Public (no auth required)',
                    'result': 'Empty response or invalid JSON format',
                    'data_count': 0
                })
        except Exception as e:
            # Handle Data Dragon API failures (rare but possible)
            api_attempts.append({
                'endpoint': 'Data Dragon API',
                'status': 'Failed',
                'method': 'GET',
                'url': f'ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json',
                'auth': 'Public (no auth required)',
                'result': f'Request failed: {str(e)}',
                'data_count': 0
            })
        
        # Handle different endpoint types for uniform interface demonstration
        if endpoint_type == 'contests':
            year = query_params.get('year', '2024')
            return handle_contests_endpoint(api_attempts, year)
        elif endpoint_type == 'players':
            return handle_players_endpoint(api_attempts, headers, make_request)
        else:
            # Default champions endpoint - add detailed API request information
            champions_api_details = {
                'expected_url': f'https://ddragon.leagueoflegends.com/cdn/{DATA_DRAGON_VERSION}/data/en_US/champion.json',
                'expected_response': 'HTTP 200 OK with JSON containing champion metadata',
                'actual_status': 'Success' if any(attempt['status'] == 'Success' and 'Data Dragon' in attempt['endpoint'] for attempt in api_attempts) else 'Failed',
                'actual_response': next((attempt['result'] for attempt in api_attempts if 'Data Dragon' in attempt['endpoint']), 'No Data Dragon attempt found'),
                'data_source': 'Riot Games Data Dragon CDN (Public API)',
                'authentication': 'None required (public endpoint)',
                'rate_limits': 'No rate limits (CDN cached)',
                'response_format': 'JSON with champion objects containing id, name, title, stats'
            }
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'data': live_data,
                    'source': 'T1_CHAMPIONS',
                    'api_attempts': api_attempts,
                    'champions_api_details': champions_api_details
                })
            }
        
    except Exception as e:
        # Handle any unexpected errors gracefully
        # Log error for CloudWatch monitoring and debugging
        print(f"Lambda function error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'message': 'Internal server error - check CloudWatch logs for details'
            })
        }