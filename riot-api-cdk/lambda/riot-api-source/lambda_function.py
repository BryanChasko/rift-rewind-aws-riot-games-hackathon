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
        event (Dict[str, Any]): Lambda event object (unused in this implementation)
        context (Any): Lambda context object (unused in this implementation)
        
    Returns:
        Dict[str, Any]: HTTP response with status code and JSON body containing:
            - data: List of champion/match data
            - source: Data source identifier
            - api_attempts: Detailed tracking of all API calls made
    """
    try:
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
        
        # Return successful response with all data and transparency information
        return {
            'statusCode': 200,
            'body': json.dumps({
                'data': live_data,  # Primary champion/match data for frontend
                'source': 'T1_CHAMPIONS',  # Indicates primary data source used
                'api_attempts': api_attempts  # Educational transparency about API calls
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