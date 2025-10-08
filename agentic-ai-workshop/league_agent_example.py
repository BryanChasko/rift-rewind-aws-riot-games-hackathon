# League of Legends Agentic AI Agent
# Adapted from the weather workshop pattern by Claude 4.0 Sonnet

import boto3
import json
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def call_claude_sonnet(prompt):
    """
    Send prompt to Claude 4.0 Sonnet - the AI brain of our agent.
    """
    bedrock = boto3.client(
        service_name="bedrock-runtime", region_name=os.getenv("AWS_REGION", "us-west-2")
    )

    try:
        response = bedrock.converse(
            modelId="us.anthropic.claude-sonnet-4-20250514-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt}]}],
            inferenceConfig={"maxTokens": 2000, "temperature": 0.7, "topP": 0.9},
        )
        return True, response["output"]["message"]["content"][0]["text"]
    except Exception as e:
        return False, f"Error calling Claude: {str(e)}"


def execute_riot_api_call(url, headers):
    """
    Execute Riot Games API call - our agent's action in the real world.
    """
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            return True, response.json()
        else:
            return False, f"API call failed: {response.status_code} - {response.text}"
    except Exception as e:
        return False, f"Error executing API call: {str(e)}"


def generate_riot_api_strategy(player_query):
    """
    Use Claude to plan the Riot API call sequence based on user query.
    This demonstrates AI autonomy - deciding what APIs to call.
    """
    prompt = f"""
You are an expert at the Riot Games API for League of Legends.

User Query: "{player_query}"

Based on this query, determine the API call sequence needed. The typical flow is:
1. Get PUUID: /riot/account/v1/accounts/by-riot-id/{{gameName}}/{{tagLine}}
2. Get Summoner: /lol/summoner/v4/summoners/by-puuid/{{puuid}}
3. Get specific data based on query:
   - Champion Mastery: /lol/champion-mastery/v4/champion-masteries/by-puuid/{{puuid}}
   - Match History: /lol/match/v5/matches/by-puuid/{{puuid}}/ids
   - Ranked Stats: /lol/league/v4/entries/by-summoner/{{summonerId}}

Extract the player name and tag from the query (format: "PlayerName#TAG").
If no specific player mentioned, ask for clarification.

Return a JSON response with:
{{
    "player_name": "extracted_name",
    "tag_line": "extracted_tag", 
    "api_sequence": ["step1", "step2", "step3"],
    "data_focus": "what_data_to_highlight"
}}
"""

    print(f"🧠 AI is analyzing query and planning API strategy...")
    success, response = call_claude_sonnet(prompt)

    if success:
        try:
            # Parse Claude's JSON response
            strategy = json.loads(response.strip())
            return True, strategy
        except json.JSONDecodeError:
            return False, f"AI returned invalid JSON: {response}"
    else:
        return False, response


def process_league_data(raw_data, query, data_type):
    """
    Use Claude to convert raw Riot API data into human-readable insights.
    This demonstrates AI processing and analysis capabilities.
    """
    prompt = f"""
You are a League of Legends data analyst. Convert this raw Riot API data into helpful insights.

Original Query: "{query}"
Data Type: {data_type}
Raw API Data: {json.dumps(raw_data, indent=2)}

Create a clear, engaging summary that:
1. Answers the user's original question
2. Highlights key statistics and achievements
3. Provides actionable insights or recommendations
4. Uses League terminology appropriately
5. Formats the response to be easy to read

Focus on being helpful and informative for a League player.
"""

    print(f"📊 AI is analyzing League data and creating insights...")
    success, response = call_claude_sonnet(prompt)
    return success, response


def run_league_agent():
    """
    Main agentic AI workflow for League of Legends queries.
    """
    print("🎮 Welcome to the League of Legends AI Agent!")
    print("Ask questions about player stats, champion mastery, or match history.")
    print("=" * 60)

    riot_api_key = os.getenv("RIOT_API_KEY")
    if not riot_api_key:
        print("❌ RIOT_API_KEY not found in environment variables!")
        return

    headers = {"X-Riot-Token": riot_api_key}

    while True:
        query = input("\n🔍 Enter your League query (or 'quit' to exit): ").strip()

        if query.lower() in ["quit", "exit", "q"]:
            print("👋 Thanks for using the League AI Agent!")
            break

        if not query:
            print("❌ Please enter a query.")
            continue

        print(f"\n🚀 Processing: '{query}'...")
        print("-" * 40)

        # Step 1: AI Planning Phase
        print("Step 1: 🧠 AI Strategy Planning")
        success, strategy = generate_riot_api_strategy(query)

        if not success:
            print(f"❌ Failed to generate strategy: {strategy}")
            continue

        print(f"✅ Strategy: {strategy['api_sequence']}")

        # Step 2: Execute API calls based on strategy
        print("\nStep 2: 🔗 Riot API Execution")

        # Example: Get PUUID first
        if strategy.get("player_name") and strategy.get("tag_line"):
            puuid_url = f"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{strategy['player_name']}/{strategy['tag_line']}"
            print(
                f"Fetching PUUID for {strategy['player_name']}#{strategy['tag_line']}..."
            )

            success, puuid_data = execute_riot_api_call(puuid_url, headers)
            if not success:
                print(f"❌ Failed to get PUUID: {puuid_data}")
                continue

            puuid = puuid_data["puuid"]
            print(f"✅ Got PUUID: {puuid[:8]}...")

            # Step 3: Get additional data based on strategy
            print("\nStep 3: 📊 Fetching Player Data")
            if "champion-mastery" in str(strategy["api_sequence"]):
                mastery_url = f"https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}"
                success, mastery_data = execute_riot_api_call(mastery_url, headers)

                if success:
                    print(
                        f"✅ Retrieved mastery data for {len(mastery_data)} champions"
                    )

                    # Step 4: AI Analysis
                    print("\nStep 4: 🤖 AI Analysis")
                    success, insights = process_league_data(
                        mastery_data[:5], query, "champion_mastery"
                    )

                    if success:
                        print("\nStep 5: 💬 Player Insights")
                        print("=" * 60)
                        print(insights)
                        print("=" * 60)
                    else:
                        print(f"❌ Failed to analyze data: {insights}")
                else:
                    print(f"❌ Failed to get mastery data: {mastery_data}")
        else:
            print("❌ Could not extract player name and tag from query")
            print("💡 Try: 'Show champion mastery for PlayerName#TAG'")


if __name__ == "__main__":
    run_league_agent()
