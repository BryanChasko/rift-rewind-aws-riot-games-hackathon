# Module 1: Agentic AI Workshop

**Workshop**: Agentic AI with AWS  
**Instructor**: Sabrina, Solutions Architect (AWS)  
**Date**: Oct 3, 2025  
**Project Context**: Rift Rewind Hackathon - League API + AWS AI Services  
**Hackathon**: <https://riftrewind.devpost.com/>

---

## Workshop Overview

**Focus**: [Fill in during workshop]
**Duration**: [Fill in during workshop]
**Sandbox Account**: [Fill in during workshop]

---

Agentic AI Building Blocks using Amazon Bedrock
This is a Level 100 workshop suitable for beginners to AI and AWS
Welcome to this hands-on workshop where you'll learn how to build Agentic AI from the ground up using just Python and the AWS SDK! No complex frameworks or libraries - we'll show you the core building blocks using basic tools. In just one hour, you'll understand what makes AI "agentic" and build your own weather assistant using fundamental programming concepts.

What You'll Build
You'll create an AI agent using pure Python and AWS SDK that:

Thinks: Interfaces directly with Claude 4.0 Sonnet through simple API calls
Acts: Makes HTTP requests to the National Weather Service API using standard Python libraries
Processes: Handles JSON data processing with basic Python data structures
Responds: Communicates through simple command-line and web interfaces
Workshop Structure
What is Agentic AI? (10 min) - Core concepts without the buzzwords
Basic Python Setup (12 min) - Setting up Python and AWS SDK
Understanding the Code (8 min) - Simple, readable architecture
Building from Scratch (23 min) - Line-by-line coding
Basic Web Interface (5 min) - Simple Streamlit application
Key Takeaways (2 min) - Foundation for advanced development
Prerequisites
No prior AI/ML experience required!
Basic Python knowledge (variables, functions, if-statements)
AWS account (for individual setup) or provided workshop environment
Learning Objectives
By the end of this workshop, you will:

✅ Understand Agentic AI without framework abstractions
✅ Build an AI agent using pure Python and boto3
✅ Make direct API calls without additional libraries
✅ Create basic interfaces using standard Python
✅ Learn patterns for scaling to more complex applications
Let's start building your first AI agent from scratch! 🚀

What is Agentic AI?
Traditional Approach: Question → Answer
Traditional AI systems are like very smart encyclopedias. They provide information based on their training data:

User: "What is the weather like in New York?"
Traditional AI: "Sorry, I can't provide live weather information! Weather refers to atmospheric conditions including temperature,
               humidity, precipitation, and wind patterns..."
Limitations: Static responses, no real-time data, can't take actions

Agentic AI: Problem → Plan → Action → Result
Agentic AI systems can think, plan, and act to solve problems:

User: "What's the weather forecast for New York this weekend?"
Agentic AI:
1. THINKS: "I need current weather data for New York coordinates"
2. PLANS: "I'll get NYC coordinates and call the National Weather Service API"
3. ACTS: Generates and executes NWS API call for NYC location
4. PROCESSES: Analyzes real-time forecast data from weather stations
5. RESPONDS: "This weekend in New York: Saturday will be sunny with
                  highs of 75°F, Sunday partly cloudy with 20% chance of rain..."

Key Characteristics of Agentic AI

1. Autonomy 🤖

Makes decisions without constant human guidance
Chooses appropriate tools and methods
Adapts to different scenarios

1. Reactivity ⚡

Responds to changes in environment
Handles errors and unexpected situations
Adjusts strategy based on results

1. Proactivity 🎯

Takes initiative to achieve goals
Plans multi-step processes
Anticipates user needs
Our Weather Assistant Agent Example
Today we're building an agent that demonstrates all three characteristics:

The Challenge: Users want to know about weather conditions, but:

Weather data requires specific coordinates and API endpoints
Different locations require different search strategies
Raw API responses are complex and technical
Our Agent's Solution:

Understands the user's location (any format - city, zip code, coordinates)
Maps it to the correct latitude/longitude coordinates
Generates the proper National Weather Service API calls
Fetches real-time weather forecast data
Processes complex JSON into readable weather summaries
Presents results in user-friendly format
Real-World Applications
Agentic AI is transforming industries:

Weather Services: Forecast assistants that analyze conditions and provide alerts
Travel Planning: Agents that check weather, book flights, and adjust itineraries
Agriculture: Weather agents that monitor conditions and recommend farming actions
Event Planning: Assistants that track weather and suggest venue changes
Emergency Management: Agents that monitor severe weather and coordinate responses
Why Amazon Bedrock for Agentic AI?
Amazon Bedrock provides the perfect foundation for agentic systems:

Multiple AI Models: Access Claude, Nova, Llama, and other leading models
Managed Infrastructure: No servers to manage
Enterprise Security: Built-in compliance and data protection
Easy Integration: Works seamlessly with other AWS services
Cost Effective: Pay only for what you use
Claude Sonnet specifically excels at:

Complex reasoning and planning
Processing structured data
Generating human-like responses
What Makes This Workshop Special?
You'll experience the "aha moment" of agentic AI by:

Building from scratch: Understand every component
Seeing it work: Watch your agent make real API calls
Comparing approaches: CLI vs. web interface
Learning patterns: Reusable techniques for other projects
Ready to build your first AI agent? Let's set up your environment! 🚀

Before we start building our AI agent, we need to set up your development environment. The setup process depends on how you're accessing this workshop.

Choose Your Setup Path
Select the appropriate setup path based on your situation:

🏢 AWS Facilitated Event
If you're attending an AWS-hosted workshop or event, you'll have access to a pre-configured VS Code Online IDE with AWS credentials already set up.

What you'll get:

✅ VS Code Online IDE with pre-installed Python
✅ AWS credentials pre-configured
✅ All necessary permissions for Bedrock
✅ Terminal access for running commands
What you'll need to do:

Enable Claude 4.0 Sonnet in Amazon Bedrock
Set up Python virtual environment
Install workshop dependencies
→ Go to AWS Facilitated Event Setup

🏠 Your Own AWS Account
If you're running this workshop independently using your own AWS account, you'll need to set up everything from scratch.

What you'll need:

✅ Python 3.7+ installed locally
✅ AWS account with appropriate permissions
✅ AWS CLI configured with your credentials
✅ Access to enable Bedrock models
What you'll set up:

AWS credentials and CLI configuration
Claude 4.0 Sonnet model access in Bedrock
Python development environment
Workshop dependencies
→ Go to Your Own AWS Account Setup

What We'll Build
Regardless of your setup path, by the end of the environment setup you'll have:

✅ Python Environment: Virtual environment with all required packages
✅ AWS Access: Configured credentials for Bedrock API calls
✅ Claude 4.0 Sonnet: Enabled and ready to use
✅ Development Tools: Terminal access and code editor
✅ Workshop Directory: Clean workspace for building your agent
Time Estimate
AWS Facilitated Event: ~6 minutes
Your Own AWS Account: ~12 minutes
Choose your path above and let's get your environment ready for building an AI agent! 🚀

Atending an AWS-hosted workshop with pre-configured resources:

Step 1: Access Your VS Code Online IDE
Find your VS Code URL and Password in the workshop landing page provided by your facilitator
Open the URL in your browser
Open a terminal in VS Code (Terminal → New Terminal)
You should now see a VS Code interface with a terminal at the bottom.

Step 2: Enable Claude 4.0 Sonnet in Amazon Bedrock
Even in facilitated events, you need to enable model access:

Open AWS Console in a new browser tab (click the link to AWS Console on the workshop landing page)
Navigate to Amazon Bedrock (search for "Bedrock" in the services)
Go to Model Access in the left sidebar
Click "Modify model access"
Find "Claude 4.0 Sonnet" and click "Request access"
Wait for approval (usually a couple of mins)
Model access is required even in facilitated environments. This step cannot be skipped!
Step 3: Set Up Your Python Environment
In your VS Code terminal, run these commands:

## Create a new directory for our workshop

mkdir agentic-ai-workshop
cd agentic-ai-workshop

## Create a Python virtual environment

python -m venv .venv

## Activate the virtual environment

source .venv/bin/activate

## You should see (.venv) in your terminal prompt now

Step 4: Install Dependencies
Create a requirements file and install packages:

## Create requirements.txt file

cat > requirements.txt << EOF
boto3>=1.34.0
streamlit>=1.28.0
requests>=2.31.0
Pillow>=10.0.0
EOF

## Install all dependencies

pip install -r requirements.txt

This will take a minute or two to download and install all the packages.

Step 5: Verify Your Setup
Test that everything is working:


## Test Python and boto3

python -c "import boto3; print('✅ boto3 installed successfully')"

## Test Streamlit

python -c "import streamlit; print('✅ Streamlit installed successfully')"

## Test AWS credentials (should show your account info)

aws sts get-caller-identity

You should see output showing your AWS account details. If you get an error, ask your workshop facilitator for help.

🔧 Troubleshooting
"AWS credentials not found"
Ask your workshop facilitator - credentials should be pre-configured
Virtual environment issues
In your VS Code terminal, run these commands:


## If activation fails, try

python -m venv --clear .venv
source .venv/bin/activate

Package installation fails
In your VS Code terminal, run these commands:

1
2
3

## Try upgrading pip first

pip install --upgrade pip
pip install -r requirements.txt

✅ Setup Complete!
You should now have:

✅ VS Code Online IDE running
✅ Python virtual environment activated (you'll see (.venv) in your prompt)
✅ All required packages installed
✅ AWS credentials configured and tested
✅ Claude 4.0 Sonnet access enabled
✅ Working directory created (agentic-ai-workshop)
Perfect! Your environment is ready. Let's move on to understanding how our AI agent architecture works! 🏗️

→ Next: Understanding the Architecture

Previous
Next

© 2008 - 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Privacy policy
Terms of use
Cookie preferences

Workshop Studio

Bryan Chasko

Event ends in 2 days 23 hours 22 minutes.

Event dashboard
Understanding Our Agent Architecture
Event dashboard
Understanding Our Agent Architecture
Understanding Our Agent Architecture
How Our Weather Agent Works
Our weather assistant follows a simple 4-step process: User Input → AI Planning → API Calls → AI Summary → Response

👤 User Input
Location: Seattle, 90210, etc.
Amazon Bedrock
🧠 Claude 4.0 Sonnet
AI Planning & Analysis
AI Decision Making
📍 Generate Coordinates
lat: 47.6062, lon: -122.3321
🔗 Plan API Call Sequence

1. Points API
2. Forecast API
🌐 NWS Points API Call

api.weather.gov/points/lat,lon
📋 Points Response
Forecast Office & Grid Info
🌤️ NWS Forecast API Call
gridpoints/SEW/124,67/forecast
📊 Raw JSON Weather Data
Temperature, Wind, Conditions
Amazon Bedrock
🧠 Claude 4.0 Sonnet
Data Processing & Summary
💬 Human-Readable Response
Today: Partly cloudy, 72°F
Wind: West 5-10 mph
Understanding the Flow
The diagram shows how our agent processes weather requests:

User provides a location (city name, ZIP code, or coordinates)
Claude AI analyzes the input and determines what coordinates and API calls are needed
Two API calls happen: First to get forecast office info, then to get actual weather data
Claude processes the raw weather data and converts it into a friendly response
User gets a clear weather forecast
The 4 Steps in Detail
Step 1: User Input 📝
Users can enter locations in many formats:

City names: "Seattle" or "Seattle, WA"
ZIP codes: "90210"
Informal descriptions: "downtown Portland"
Coordinates: "47.6062, -122.3321"
The AI handles all these variations automatically.

Step 2: AI Planning 🧠
Claude analyzes the input and creates a plan:

Determines the coordinates for the location
Identifies the correct National Weather Service API endpoints
Plans the sequence of API calls needed
Example: For "Seattle", the AI knows to use coordinates 47.6062°N, 122.3321°W and call the NWS points API first.

Step 3: API Calls 🔗
The agent makes two API calls to the National Weather Service:

Points API: <https://api.weather.gov/points/{lat},{lon}>
Gets forecast office and grid coordinates
Forecast API: Uses the returned URL for detailed weather data
Example: <https://api.weather.gov/gridpoints/SEW/124,67/forecast>
Step 4: AI Summary 📊
Claude converts the raw JSON weather data into a human-friendly format:

Raw data (complex JSON with technical details) ↓ Friendly response: "Today: Partly cloudy with a high of 72°F. Wind: West at 5-10 mph"

Why This Architecture Works
Intelligent: The AI figures out coordinates and API calls instead of hardcoding them Flexible: Handles different location formats and weather data variations Reliable: Includes error handling for network issues and invalid locations Scalable: The same pattern works for other APIs and domains

What Makes This "Agentic"?
Traditional approach requires hardcoding every possible location and API call. Our agentic approach lets the AI figure it out dynamically:

## Traditional: Hardcoded and brittle

if location == "Seattle":
    api_url = "<https://api.weather.gov/gridpoints/SEW/124,67/forecast>"

## Agentic: AI figures it out

ai_prompt = f"Generate NWS API calls for: {location}"
api_urls = claude_4_sonnet(ai_prompt)

The AI agent reasons about the problem, plans the solution, and adapts to new situations - making it truly "agentic" rather than just following pre-programmed rules.

Previous
Next

© 2008 - 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Privacy policy
Terms of use
Cookie preferences

Workshop Studio

Bryan Chasko

Event ends in 2 days 23 hours 22 minutes.

Event dashboard
Building the Command-Line Agent
Event dashboard
Building the Command-Line Agent
Building the Command-Line Agent
Now let's build our AI agent step by step! We'll create a python program that demonstrates all the core agentic AI patterns.

Step 1: Amazon Bedrock Connection (8 minutes)
First, let's create the foundation - connecting to Claude 4.0 Sonnet.

Inside the folder created in the environment setup i.e. agentic-ai-workshop, create a new file called weather_agent_cli.py and add this code:


## Import necessary libraries

import boto3        # AWS SDK for Python - allows us to interact with AWS services
import json         # For handling JSON data
import subprocess   # For running system commands like curl
import time         # For adding delays and timing operations
from datetime import datetime  # For timestamps and date operations

def call_claude_sonnet(prompt):
    """
    This function sends a prompt to Claude 4.0 Sonnet and gets a response.
    This is the "brain" of our agent - where the AI thinking happens.

    Args:
        prompt (str): The question or instruction we want to send to Claude

    Returns:
        tuple: (success: bool, response: str) - success status and Claude's response or error message
    """
    # Create a connection to Amazon Bedrock service
    # Bedrock is AWS's service for accessing AI models like Claude
    bedrock = boto3.client(
        service_name='bedrock-runtime',  # Specify we want the runtime version for making AI calls
        region_name='us-west-2'          # AWS region - using us-west-2 as specified
    )

    try:
        # Send our prompt to Claude and get a response
        response = bedrock.converse(
            # Specify which version of Claude we want to use
            modelId='us.anthropic.claude-sonnet-4-20250514-v1:0',  # Claude 4.0 Sonnet

            # Format our message - Claude expects messages in a specific structure
            messages=[
                {
                    "role": "user",                    # We are the user asking a question
                    "content": [{"text": prompt}]      # Our actual question/prompt
                }
            ],

            # Configure how Claude should respond
            inferenceConfig={
                "maxTokens": 2000,    # Maximum length of response (tokens ≈ words)
                "temperature": 0.7,   # Creativity level (0=very focused, 1=very creative)
                "topP": 0.9          # Another creativity control parameter
            }
        )

        # Extract the actual text response from Claude's response structure
        # The response comes nested in a complex structure, so we dig down to get the text
        return True, response['output']['message']['content'][0]['text']

    except Exception as e:
        # If something goes wrong, return an error message
        return False, f"Error calling Claude: {str(e)}"

## Test our connection to Claude

if **name** == "**main**":
    print("🧪 Testing connection to Claude 4.0 Sonnet...")
    success, response = call_claude_sonnet("Hello! Are you working today?")

    if success:
        print("✅ Connection successful!")
        print(f"Claude says: {response}")
    else:
        print("❌ Connection failed!")
        print(f"Error: {response}")

Test this code:

Now, in the terminal window, run this:

1
python weather_agent_cli.py

You should see Claude's response confirming the connection works!

🔍 What's Happening Here?
Amazon Bedrock Client: We create a connection to Amazon Bedrock in us-west-2
Model Selection: We specify Claude 4.0 Sonnet as our AI model
Message Format: We structure our prompt in the format Claude expects
Configuration: We set parameters for response length and creativity
Error Handling: We catch and handle any connection issues
Step 2: Building Agent Logic (10 minutes)
IMPORTANT: Make sure to REMOVE the code underneath # Test our connection to Claude from the previous step before pasting the code below!
Now let's add the core agent functionality. Add these functions to your weather_agent_cli.py file:

def execute_curl_command(url):
    """
    Execute a curl command to fetch data from an API.
    This is how our agent "acts" in the real world - making HTTP requests.

    Args:
        url (str): The URL to fetch data from

    Returns:
        tuple: (success: bool, response: str) - success status and API response or error message
    """
    try:
        # Use curl command to make HTTP request
        # curl is a command-line tool for making HTTP requests
        result = subprocess.run(
            ['curl', '-s', url],  # -s flag makes curl silent (no progress info)
            capture_output=True,   # Capture the output so we can process it
            text=True,            # Return output as text (not bytes)
            timeout=30            # Give up after 30 seconds
        )

        # Check if the command was successful
        if result.returncode == 0:
            return True, result.stdout
        else:
            return False, f"Curl command failed: {result.stderr}"

    except subprocess.TimeoutExpired:
        return False, "Request timed out after 30 seconds"
    except Exception as e:
        return False, f"Error executing curl: {str(e)}"

def generate_weather_api_calls(location):
    """
    Use Claude to intelligently generate National Weather Service API calls for a given location.
    This is where the "agentic" magic happens - AI planning the API calls.

    Args:
        location (str): The location provided by the user

    Returns:
        tuple: (success: bool, api_calls: list) - success status and list of API URLs or error message
    """
    # Create a detailed prompt that teaches Claude how to generate NWS API calls
    prompt = f"""
You are an expert at working with the National Weather Service (NWS) API.

Your task: Generate the proper sequence of NWS API calls to get weather forecast data for "{location}".

Instructions:
1. First, determine the approximate latitude and longitude coordinates for this location
2. Use the NWS Points API: <https://api.weather.gov/points/{{lat}},{{lon}}>
3. The Points API will return a forecast URL in the response
4. You need to make TWO API calls in sequence:
   - First: Points API to get forecast office and grid coordinates
   - Second: The forecast URL returned from the Points API

For the coordinates, use your knowledge to estimate:
- Major cities: Use well-known coordinates
- ZIP codes: Estimate based on the area
- States: Use approximate center coordinates

Example for Seattle:
1. <https://api.weather.gov/points/47.6062,-122.3321>
2. (This will return a forecast URL like: <https://api.weather.gov/gridpoints/SEW/124,67/forecast>)

Now generate the FIRST API call (Points API) for "{location}".
Return ONLY the complete Points API URL, nothing else.
Format: <https://api.weather.gov/points/LAT,LON>
"""

    print(f"🧠 AI is analyzing '{location}' and generating weather API calls...")
    success, response = call_claude_sonnet(prompt)

    if success:
        # Clean up the response - sometimes Claude adds extra text
        api_url = response.strip()
        # Make sure we got a valid URL
        if api_url.startswith('https://api.weather.gov/points/'):
            return True, [api_url]  # Return as list for consistency
        else:
            return False, f"AI generated invalid URL: {api_url}"
    else:
        return False, response

def get_forecast_url_from_points_response(points_json):
    """
    Extract the forecast URL from the NWS Points API response.

    Args:
        points_json (str): JSON response from the Points API

    Returns:
        tuple: (success: bool, forecast_url: str) - success status and forecast URL or error message
    """
    try:
        data = json.loads(points_json)
        forecast_url = data['properties']['forecast']
        return True, forecast_url
    except (json.JSONDecodeError, KeyError) as e:
        return False, f"Error parsing Points API response: {str(e)}"

def process_weather_response(raw_json, location):
    """
    Use Claude to convert raw NWS API JSON into a human-readable weather summary.
    This is where AI processes complex data into useful information.

    Args:
        raw_json (str): Raw JSON response from NWS API
        location (str): Original location for context

    Returns:
        tuple: (success: bool, summary: str) - success status and processed summary or error message
    """
    prompt = f"""
You are a weather information specialist. I have raw National Weather Service forecast data for "{location}" that needs to be converted into a clear, helpful summary for a general audience.

Raw NWS API Response:
{raw_json}

Please create a weather summary that includes:
1. A brief introduction with the location
2. Current conditions and today's forecast
3. The next 2-3 days outlook with key details (temperature, precipitation, wind)
4. Any notable weather patterns or alerts
5. Format the response to be easy to read and understand

Make it informative and practical for someone planning their activities. Focus on being helpful and clear.
"""

    print(f"📊 AI is processing weather data and creating summary...")
    success, response = call_claude_sonnet(prompt)

    return success, response

🔍 What's Happening Here?
execute_curl_command(): Our agent's "hands" - executes HTTP requests
generate_weather_api_calls(): Our agent's "planning brain" - figures out the right API calls
get_forecast_url_from_points_response(): Extracts forecast URL from Points API response
process_weather_response(): Our agent's "analysis brain" - makes sense of complex weather data
Step 3: Main Agent Workflow (5 minutes)
Now let's tie everything together with the main agent workflow. Add this to your file:

def run_weather_agent():
    """
    Main function that orchestrates our AI agent.
    This demonstrates the complete agentic workflow.
    """
    print("🌤️ Welcome to the Weather AI Agent!")
    print("This agent uses Claude 4.0 Sonnet to help you get weather forecasts.")
    print("=" * 60)

    while True:
        # Get user input
        location = input("\n🔍 Enter a location (or 'quit' to exit): ").strip()

        if location.lower() in ['quit', 'exit', 'q']:
            print("👋 Thanks for using the Weather Agent!")
            break

        if not location:
            print("❌ Please enter a location.")
            continue

        print(f"\n🚀 Starting weather analysis for '{location}'...")
        print("-" * 40)

        # Step 1: AI generates the Points API URL
        print("Step 1: 🧠 AI Planning Phase")
        success, api_calls = generate_weather_api_calls(location)

        if not success:
            print(f"❌ Failed to generate API calls: {api_calls}")
            continue

        points_url = api_calls[0]
        print(f"✅ Generated Points API URL: {points_url}")

        # Step 2: Execute the Points API call
        print("\nStep 2: 🔗 Points API Execution")
        print("Fetching location data from National Weather Service...")
        success, points_response = execute_curl_command(points_url)

        if not success:
            print(f"❌ Failed to fetch points data: {points_response}")
            continue

        print(f"✅ Received points data")

        # Step 3: Extract forecast URL from Points response
        print("\nStep 3: 📍 Extracting Forecast URL")
        success, forecast_url = get_forecast_url_from_points_response(points_response)

        if not success:
            print(f"❌ Failed to extract forecast URL: {forecast_url}")
            continue

        print(f"✅ Forecast URL: {forecast_url[:60]}...")

        # Step 4: Execute the Forecast API call
        print("\nStep 4: 🌦️ Forecast API Execution")
        print("Fetching weather forecast data...")
        success, forecast_response = execute_curl_command(forecast_url)

        if not success:
            print(f"❌ Failed to fetch forecast data: {forecast_response}")
            continue

        print(f"✅ Received {len(forecast_response)} characters of forecast data")

        # Step 5: AI processes the response
        print("\nStep 5: 📊 AI Analysis Phase")
        success, summary = process_weather_response(forecast_response, location)

        if not success:
            print(f"❌ Failed to process data: {summary}")
            continue

        # Step 6: Display results
        print("\nStep 6: 💬 Weather Forecast")
        print("=" * 60)
        print(summary)
        print("=" * 60)

        print(f"\n✅ Weather analysis complete for '{location}'!")

## Run the agent when the script is executed

if **name** == "**main**":

    # Remove the test code and replace with the main agent

    run_weather_agent()

🔍 Complete Agent Workflow
Our agent now demonstrates the full agentic AI pattern:

Planning: AI analyzes the location and plans the API calls
Action: Agent executes the planned API calls in sequence
Processing: AI analyzes the raw weather data and creates insights
Response: Agent presents results to the user
Test Your Agent!
Now, in the terminal window, run your completed agent:

python weather_agent_cli.py

Try these test cases:

"Seattle" (should work well - major city)
"90210" (tests ZIP code recognition)
"New York City" (tests city name variations)
Congratulations! You've built a working AI agent that demonstrates all the key agentic AI patterns! 🎉

If you had any issues with the step-by-step code snippets above, here's the complete `weather_agent_cli.py` file for reference:
Next, let's see this same functionality in a beautiful web interface!

Previous
Next

© 2008 - 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Privacy policy
Terms of use
Cookie preferences

Workshop Studio

Bryan Chasko

Event ends in 2 days 23 hours 22 minutes.

Event dashboard
Running the Web Application
Event dashboard
Running the Web Application
Running the Web Application
Now let's see your AI agent in action through a beautiful web interface! We'll create a Streamlit application that uses the same agentic AI logic but with an interactive user experience.

Create the Web Application
Inside the folder created in the environment setup i.e. agentic-ai-workshop, create a new file called weather_agent_web.py and copy this complete code:

import streamlit as st
import boto3
import subprocess
import json
import time
from datetime import datetime
from PIL import Image
import os

## Page configuration

st.set_page_config(
    page_title="Weather AI Agent",
    page_icon="🌤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

## Custom CSS for better styling

st.markdown("""
<style>
    .step-container {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 20px;
        margin: 10px 0;
        background-color: #f9f9f9;
    }
    .step-header {
        font-size: 18px;
        font-weight: bold;
        color: #1f77b4;
        margin-bottom: 10px;
    }
    .success-box {
        border-left: 5px solid #28a745;
        background-color: #d4edda;
        padding: 10px;
        margin: 10px 0;
        color: #000000;
    }
    .error-box {
        border-left: 5px solid #dc3545;
        background-color: #f8d7da;
        padding: 10px;
        margin: 10px 0;
        color: #000000;
    }
    .info-box {
        border-left: 5px solid #17a2b8;
        background-color: #d1ecf1;
        padding: 10px;
        margin: 10px 0;
        color: #000000;
    }
</style>
""", unsafe_allow_html=True)

def call_claude_sonnet(prompt):
    """
    Connect to Claude 4.0 Sonnet via Amazon Bedrock
    """
    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-west-2'
    )

    try:
        response = bedrock.converse(
            modelId='us.anthropic.claude-sonnet-4-20250514-v1:0',
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ],
            inferenceConfig={
                "maxTokens": 2000,
                "temperature": 0.7,
                "topP": 0.9
            }
        )

        return True, response['output']['message']['content'][0]['text']

    except Exception as e:
        return False, f"Error calling Claude: {str(e)}"

def execute_curl_command(url):
    """
    Execute curl command to fetch API data
    """
    try:
        result = subprocess.run(
            ['curl', '-s', url],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            return True, result.stdout
        else:
            return False, f"Curl command failed: {result.stderr}"

    except subprocess.TimeoutExpired:
        return False, "Request timed out after 30 seconds"
    except Exception as e:
        return False, f"Error executing curl: {str(e)}"

def generate_weather_api_calls(location):
    """
    Use Claude to generate NWS API calls
    """
    prompt = f"""
You are an expert at working with the National Weather Service (NWS) API.

Your task: Generate the proper sequence of NWS API calls to get weather forecast data for "{location}".

Instructions:
1. First, determine the approximate latitude and longitude coordinates for this location
2. Use the NWS Points API: <https://api.weather.gov/points/{{lat}},{{lon}}>
3. The Points API will return a forecast URL in the response
4. You need to make TWO API calls in sequence:
   - First: Points API to get forecast office and grid coordinates
   - Second: The forecast URL returned from the Points API

For the coordinates, use your knowledge to estimate:
- Major cities: Use well-known coordinates
- ZIP codes: Estimate based on the area
- States: Use approximate center coordinates

Example for Seattle:
1. <https://api.weather.gov/points/47.6062,-122.3321>
2. (This will return a forecast URL like: <https://api.weather.gov/gridpoints/SEW/124,67/forecast>)

Now generate the FIRST API call (Points API) for "{location}".
Return ONLY the complete Points API URL, nothing else.
Format: <https://api.weather.gov/points/LAT,LON>
"""

    success, response = call_claude_sonnet(prompt)

    if success:
        api_url = response.strip()
        if api_url.startswith('https://api.weather.gov/points/'):
            return True, [api_url]
        else:
            return False, f"AI generated invalid URL: {api_url}"
    else:
        return False, response

def get_forecast_url_from_points_response(points_json):
    """
    Extract forecast URL from Points API response
    """
    try:
        data = json.loads(points_json)
        forecast_url = data['properties']['forecast']
        return True, forecast_url
    except (json.JSONDecodeError, KeyError) as e:
        return False, f"Error parsing Points API response: {str(e)}"

def process_weather_response(raw_json, location):
    """
    Use Claude to process NWS API response
    """
    prompt = f"""
You are a weather information specialist. I have raw National Weather Service forecast data for "{location}" that needs to be converted into a clear, helpful summary for a general audience.

Raw NWS API Response:
{raw_json}

Please create a weather summary that includes:
1. A brief introduction with the location
2. Current conditions and today's forecast
3. The next 2-3 days outlook with key details (temperature, precipitation, wind)
4. Any notable weather patterns or alerts
5. Format the response to be easy to read and understand

Make it informative and practical for someone planning their activities. Focus on being helpful and clear.
"""

    success, response = call_claude_sonnet(prompt)
    return success, response

## Sidebar with information

st.sidebar.title("🤖 About This Agent")
st.sidebar.markdown("""
This AI agent demonstrates **Agentic AI** principles:

**🧠 Intelligence**: Uses Claude 4.0 Sonnet to understand locations and plan API calls

**🔗 Action**: Automatically calls the National Weather Service API

**📊 Processing**: Converts complex weather data into readable forecasts

**💬 Response**: Provides helpful, practical weather information
""")

st.sidebar.markdown("---")
st.sidebar.markdown("### 🏗️ Architecture")
st.sidebar.markdown("""

1. **User Input** → Location name
2. **AI Planning** → Generate API calls
3. **Points API** → Get forecast office  
4. **Forecast API** → Get weather data
5. **AI Processing** → Create summary
6. **Display Results** → Show to user
""")

## Main application

st.title("🌤️ Weather AI Agent")
st.markdown("### Powered by Claude 4.0 Sonnet on Amazon Bedrock")

st.markdown("""
This intelligent agent helps you get weather forecasts using the National Weather Service API.
Enter any location below and watch the AI agent work through its reasoning process!
""")

## Initialize session state for results

if 'show_results' not in st.session_state:
    st.session_state.show_results = False

## Input section

st.markdown("---")
location = st.text_input(
    "🔍 Enter a location:",
    placeholder="e.g., Seattle, 90210, New York City",
    help="You can enter city names, ZIP codes, or state names"
)

## Create columns for the buttons

button_col1, button_col2 = st.columns([2, 1])

with button_col1:
    get_forecast = st.button("🚀 Get Weather Forecast", type="primary")

with button_col2:
    clear_results = st.button("🗑️ Clear Results", type="secondary")

## Clear results functionality

if clear_results:
    st.session_state.show_results = False
    st.success("🗑️ Results cleared! Enter a new location to get a fresh forecast.")

if get_forecast:
    st.session_state.show_results = True

if st.session_state.show_results and get_forecast:
    if not location:
        st.error("❌ Please enter a location.")
    else:

        # Create columns for better layout

        col1, col2 = st.columns([2, 1])

        with col1:
            st.markdown(f"## Weather Analysis for: **{location}**")

            # Step 1: AI Planning
            with st.container():
                st.markdown('<div class="step-container">', unsafe_allow_html=True)
                st.markdown('<div class="step-header">🧠 Step 1: AI Planning Phase</div>', unsafe_allow_html=True)

                with st.spinner("Claude is analyzing the location and planning the API calls..."):
                    success, api_calls = generate_weather_api_calls(location)

                if success:
                    points_url = api_calls[0]
                    st.markdown('<div class="success-box">✅ Points API URL generated successfully!</div>', unsafe_allow_html=True)
                    st.code(points_url, language="text")
                else:
                    st.markdown(f'<div class="error-box">❌ Failed to generate API calls: {api_calls}</div>', unsafe_allow_html=True)
                    st.stop()

                st.markdown('</div>', unsafe_allow_html=True)

            # Step 2: Points API Execution
            with st.container():
                st.markdown('<div class="step-container">', unsafe_allow_html=True)
                st.markdown('<div class="step-header">🔗 Step 2: Points API Execution</div>', unsafe_allow_html=True)

                with st.spinner("Fetching location data from National Weather Service..."):
                    success, points_response = execute_curl_command(points_url)

                if success:
                    st.markdown('<div class="success-box">✅ Received location data from NWS</div>', unsafe_allow_html=True)

                    # Show a preview of the raw data
                    with st.expander("🔍 View Raw Points API Response (first 500 characters)"):
                        st.code(points_response[:500] + "..." if len(points_response) > 500 else points_response, language="json")
                else:
                    st.markdown(f'<div class="error-box">❌ Failed to fetch points data: {points_response}</div>', unsafe_allow_html=True)
                    st.stop()

                st.markdown('</div>', unsafe_allow_html=True)

            # Step 3: Extract Forecast URL
            with st.container():
                st.markdown('<div class="step-container">', unsafe_allow_html=True)
                st.markdown('<div class="step-header">📍 Step 3: Extracting Forecast URL</div>', unsafe_allow_html=True)

                success, forecast_url = get_forecast_url_from_points_response(points_response)

                if success:
                    st.markdown('<div class="success-box">✅ Forecast URL extracted successfully!</div>', unsafe_allow_html=True)
                    st.code(forecast_url, language="text")
                else:
                    st.markdown(f'<div class="error-box">❌ Failed to extract forecast URL: {forecast_url}</div>', unsafe_allow_html=True)
                    st.stop()

                st.markdown('</div>', unsafe_allow_html=True)

            # Step 4: Forecast API Execution
            with st.container():
                st.markdown('<div class="step-container">', unsafe_allow_html=True)
                st.markdown('<div class="step-header">🌦️ Step 4: Forecast API Execution</div>', unsafe_allow_html=True)

                with st.spinner("Fetching weather forecast data..."):
                    success, forecast_response = execute_curl_command(forecast_url)

                if success:
                    st.markdown(f'<div class="success-box">✅ Received {len(forecast_response):,} characters of forecast data</div>', unsafe_allow_html=True)

                    # Show a preview of the raw data
                    with st.expander("🔍 View Raw Forecast API Response (first 500 characters)"):
                        st.code(forecast_response[:500] + "..." if len(forecast_response) > 500 else forecast_response, language="json")
                else:
                    st.markdown(f'<div class="error-box">❌ Failed to fetch forecast data: {forecast_response}</div>', unsafe_allow_html=True)
                    st.stop()

                st.markdown('</div>', unsafe_allow_html=True)

            # Step 5: AI Processing
            with st.container():
                st.markdown('<div class="step-container">', unsafe_allow_html=True)
                st.markdown('<div class="step-header">📊 Step 5: AI Analysis Phase</div>', unsafe_allow_html=True)

                with st.spinner("Claude is processing the weather data and creating a summary..."):
                    success, summary = process_weather_response(forecast_response, location)

                if success:
                    st.markdown('<div class="success-box">✅ Weather analysis complete!</div>', unsafe_allow_html=True)
                else:
                    st.markdown(f'<div class="error-box">❌ Failed to process data: {summary}</div>', unsafe_allow_html=True)
                    st.stop()

                st.markdown('</div>', unsafe_allow_html=True)

            # Step 6: Results
            st.markdown("---")
            st.markdown("## 🌤️ Weather Forecast")
            st.markdown(summary)

        with col2:
            # Real-time status updates
            st.markdown("### 📊 Process Status")

            status_container = st.container()
            with status_container:
                st.markdown("""
                <div class="info-box">
                <strong>🔄 Agent Workflow:</strong><br>
                ✅ Planning Phase<br>
                ✅ Points API Call<br>
                ✅ URL Extraction<br>
                ✅ Forecast API Call<br>
                ✅ Data Processing<br>
                ✅ Results Generated
                </div>
                """, unsafe_allow_html=True)

            st.markdown("### 🎯 What Makes This Agentic?")
            st.markdown("""
- **🧠 Reasoning**: AI understands location formats
- **📋 Planning**: Generates appropriate API call sequences
- **🔧 Action**: Executes real-world API requests
- **📊 Processing**: Converts raw data to insights
- **🔄 Adaptation**: Handles different location types
            """)

## Footer

st.markdown("---")
st.markdown("""

## 🔬 About This Demo

This application demonstrates **Agentic AI** principles using:
- **Amazon Bedrock** with Claude 4.0 Sonnet for intelligent reasoning
- **National Weather Service API** for real-time weather data
- **Streamlit** for interactive web interface

**⚠️ Important**: This uses official NWS data for educational purposes. For critical weather decisions, consult official sources.
""")

## Add some example queries

st.markdown("### 💡 Try These Examples:")
st.markdown("""
**Suggested locations to test:**

- **Seattle** - Major city (tests city name recognition)
- **90210** - ZIP code (tests postal code handling)  
- **New York** - Multi-word city (tests complex location parsing)
- **Miami, FL** - City with state (tests state abbreviations)
- **Chicago** - Another major city (tests different coordinates)

Simply copy any of these into the location input above and click "Get Weather Forecast"!
""")

Run Your Web Application
Now, in the terminal window, let's run the Streamlit web interface:

1
streamlit run weather_agent_web.py

You should see output like:

  You can now view your Streamlit app in your browser.

  Local URL: <http://localhost:8501>
  Network URL: <http://192.168.1.100:8501>
Streamlit app

Explore the Web Interface
🎯 Key Features to Try:
Interactive Input: Enter different locations and see real-time processing

Step-by-Step Visualization: Watch each phase of the agentic workflow:

AI Planning Phase
Points API Execution Phase
URL Extraction Phase
Forecast API Execution Phase
AI Analysis Phase
Results Display
Raw Data Inspection: Expand the "View Raw API Response" sections to see the complex JSON data your agent processes

Real-time Status: Monitor the agent's progress in the sidebar

Example Queries: Try the suggested examples (Seattle, 90210, New York)

Streamlit app

Streamlit app

🔍 What to Observe:
Planning Intelligence: Notice how the AI:

Recognizes "Seattle" and maps to coordinates
Handles ZIP codes like "90210"
Generates different API calls for different location types
Data Processing: See how the AI:

Converts complex JSON with multiple forecast periods
Identifies the most relevant weather information
Creates human-readable summaries
Adds appropriate context and recommendations
Error Handling: Try entering:

Invalid locations
Misspelled city names
International locations (NWS only covers US)
Compare CLI vs Web Experience
You now have both versions of your AI agent:

Command-Line Version (weather_agent_cli.py)
✅ Direct, focused interaction
✅ Great for automation and scripting
✅ Shows raw workflow steps
✅ Perfect for developers
Web Version (weather_agent_web.py)
✅ Visual, interactive experience
✅ Better for non-technical users
✅ Real-time progress indicators
✅ Professional presentation
Both versions use identical agentic AI logic - the same Claude 4.0 Sonnet reasoning, the same NWS API integration, and the same data processing pipeline!

🎉 Congratulations!
You've successfully:

Built a command-line AI agent from scratch
Created a beautiful web interface for the same agent
Demonstrated all key agentic AI principles
Integrated real-world APIs with AI reasoning
Processed complex data into useful insights
🚀 Next Steps
Now that you understand agentic AI fundamentals, you could extend this pattern to:

Different APIs: News, financial data, social media
Multiple Tools: Combine several APIs in one agent
Conversation Memory: Remember previous queries
Advanced Reasoning: Multi-step problem solving
Ready to wrap up and discuss key takeaways? Let's conclude the workshop! 🎯

Previous
Next

© 2008 - 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.
Privacy policy
Terms of use
Cookie preferences

Workshop Studio

Bryan Chasko

Event ends in 2 days 23 hours 21 minutes.

Event dashboard
Key Takeaways & Next Steps
Event dashboard
Key Takeaways & Next Steps
Key Takeaways & Next Steps
🎉 What You've Accomplished
Congratulations! In just one hour, you've built an agent that demonstrates the fundamental principles of agentic AI. Let's reflect on what makes your creation special.

🧠 What Makes This "Agentic"?
Your weather assistant agent exhibits all three key characteristics of agentic AI:

1. Autonomy

Your agent makes independent decisions:

Location Analysis: Automatically determines coordinates from various location formats
API Strategy: Chooses appropriate API call sequences
Data Processing: Decides what weather information is most relevant
Error Recovery: Handles failures without human intervention

1. Reactivity

Your agent responds to its environment:

User Input: Adapts to different location formats (cities, ZIP codes, coordinates)
API Responses: Processes varying data structures from NWS
Network Issues: Handles timeouts and connection problems
Data Quality: Works with incomplete or inconsistent weather information

1. Proactivity

Your agent takes initiative:

Planning: Generates complete API strategies from minimal input
Execution: Takes concrete actions in the real world
Analysis: Proactively identifies the most important weather insights
Communication: Presents results in user-friendly formats
🔑 Core Patterns You've Learned
The Agentic AI Workflow
Input → AI Planning → Action → AI Processing → Response
This pattern is reusable across countless applications:

Travel Planning: Location → Plan → Check Weather/Flights → Analyze → Recommend
Emergency Response: Alert → Plan → Gather Data → Assess → Coordinate
Agriculture: Conditions → Plan → Monitor Weather → Analyze → Advise
Prompt Engineering for Agents
You learned to create prompts that:

Teach the AI about APIs and data structures
Provide examples of expected outputs
Set constraints for safety and accuracy
Request specific formats for downstream processing
Error-Resilient Architecture
Your agent handles failures gracefully:

Network timeouts → Retry logic
Invalid responses → Error messages
Unexpected data → Adaptive processing
User errors → Helpful guidance
🌟 Real-World Applications
The patterns you've learned apply to many domains:

Weather & Environmental Services
Forecast Assistants: Analyze conditions, provide alerts, suggest activities
Climate Monitoring: Track patterns, predict changes, recommend adaptations
Disaster Response: Monitor conditions, coordinate resources, issue warnings
Travel & Transportation
Trip Planning: Check weather, book flights, adjust itineraries based on conditions
Route Optimization: Monitor weather, traffic, and conditions for optimal routing
Event Management: Track forecasts, suggest venue changes, coordinate logistics
Business & Finance
Market Analysis: Gather data, identify trends, create investment strategies
Customer Support: Understand issues, search knowledge bases, provide solutions
Risk Assessment: Collect information, analyze patterns, recommend actions
Software Development
Code Assistants: Understand requirements, generate code, run tests
DevOps Automation: Monitor systems, diagnose issues, implement fixes
Documentation: Analyze codebases, generate explanations, create guides
Research & Education
Literature Review: Search papers, summarize findings, identify gaps
Data Analysis: Process datasets, identify patterns, generate insights
Personalized Learning: Assess knowledge, adapt content, track progress
🛠️ Technical Skills Gained
Amazon Bedrock Integration
✅ Connecting to Claude 4.0 Sonnet
✅ Configuring inference parameters
✅ Handling API responses and errors
✅ Managing costs and rate limits
API Integration Patterns
✅ Dynamic URL generation using AI
✅ Sequential API call execution and chaining
✅ JSON data processing and transformation
✅ Real-time data integration from multiple sources
Prompt Engineering
✅ Structured prompts for specific tasks
✅ Context preservation across interactions
✅ Output format specification
✅ Error handling through prompts
Application Architecture
✅ Modular function design
✅ Separation of concerns
✅ User interface development
✅ Error handling and logging
🚀 Next Steps for Learning
Immediate Extensions (Next 1-2 hours)
Add More APIs: Try international weather services, air quality, or traffic data
Improve Error Handling: Add retry logic and better error messages
Add Memory: Store previous weather queries and learn from patterns
Enhance UI: Add weather maps, charts, or more interactive elements
Intermediate Projects (Next few weeks)
Multi-Agent Systems: Create agents that work together (weather + travel + events)
Tool Integration: Add calculators, databases, or notification systems
Conversation Flow: Build agents that maintain context across weather discussions
Custom Models: Fine-tune models for specific weather or location domains
Advanced Concepts (Next few months)
Production Deployment: Scale your agents with Lambda, ECS, or EKS
Security & Compliance: Add authentication, encryption, and audit logs
Performance Optimization: Implement caching, parallel processing
Enterprise Integration: Connect to existing business systems
📚 Recommended Resources
AWS Documentation
Amazon Bedrock User Guide
Claude Model Documentation
AWS SDK for Python (Boto3)
Agentic AI Concepts
Anthropic's Guide to Claude
Prompt Engineering Guide
LangChain Documentation  (for more complex agents)
API Integration
National Weather Service API
OpenWeatherMap API  (for international weather)
RESTful API Design Principles
Streamlit Development
Streamlit Documentation
Streamlit Gallery  (for inspiration)
Streamlit Components  (for advanced UI)
🎯 Key Principles to Remember

Start Simple, Iterate Quickly

Your agent began with basic functionality and grew more sophisticated. This approach works for all AI projects.

AI as a Reasoning Engine

Use AI for decision-making and planning, not just text generation. Your agent demonstrates AI's ability to understand locations, plan API sequences, and adapt to different data formats.

Human-AI Collaboration

The best agents augment human capabilities rather than replacing them. Your agent provides weather information that helps humans make better decisions about their activities and plans.

Error Handling is Critical

Real-world systems fail. Your agent's graceful error handling makes it reliable and user-friendly.

User Experience Matters

The same underlying AI can be presented through different interfaces (CLI vs web) for different use cases and audiences.

🤝 Community and Support
AWS Community
AWS rePost  - Technical Q&A community
AWS AI/ML Blog  - Latest updates and tutorials
🎊 Final Thoughts
You've just experienced the power of agentic AI - systems that can think, plan, and act to solve real-world problems. The weather assistant agent you built demonstrates that with the right tools and patterns, anyone can create intelligent systems that provide genuine value.

The future of AI isn't just about chatbots or text generation - it's about agents that can take meaningful actions in the world. You now have the foundational knowledge to build these systems.

What's Your Next Agent?
Think about problems in your domain that could benefit from an AI agent:

What APIs could your agent call?
What decisions could it make autonomously?
How could it help users accomplish their goals?
The patterns you've learned today are your building blocks for creating the next generation of intelligent applications.

Welcome to the world of agentic AI!


Workshop Clean-up
This section applies only if you completed this workshop using your own AWS account.

Infrastructure Resources
The good news is that this workshop uses serverless, pay-as-you-go services, so there are no persistent infrastructure resources that need to be deleted. The main service we used was Amazon Bedrock's Claude model, which only charges for actual API calls made during the workshop.

Security Resources Review
You should review the following security resources that were created during the Environment Setup and decide whether to keep or remove them:

IAM Roles: Review the IAM roles created for this workshop and remove them if they're no longer needed
Access Keys: Consider rotating or deleting any access keys that were created specifically for this workshop
Policies: Remove any custom IAM policies that were created if they're no longer required
Cost Monitoring
While the workshop uses minimal resources, you may want to:

Check your AWS billing dashboard for any charges related to Amazon Bedrock usage
Set up billing alerts if you haven't already to monitor future usage
Next Steps
If you plan to continue experimenting with agentic AI patterns, you may want to keep the IAM roles and policies in place for future development work.

Workshop Contributors
This workshop was developed by:

Ramakrishna Natarajan - Sr. Partner Solutions Architect, AWS

© 2008 - 2025, Amazon Web Services, Inc. or its affiliates. All rights reserved.