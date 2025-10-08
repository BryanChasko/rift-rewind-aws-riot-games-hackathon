# Agentic AI Setup for Rift Rewind Project

## Overview
Replicate the workshop's agentic AI patterns for your League of Legends application using the Riot Games API.

## Your Own AWS Account Setup

### Step 1: Development Environment
Use your existing VS Code setup with Python extension.

### Step 2: Python Environment
```bash
# Navigate to your project root
cd /path/to/your/rift-rewind-project

# Create virtual environment
python -m venv .venv

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install boto3>=1.34.0 requests>=2.31.0 python-dotenv>=1.0.0
```

### Step 3: AWS Credentials
```bash
# Configure AWS CLI
aws configure

# Test connection
aws sts get-caller-identity
```

### Step 4: Enable Claude 4.0 Sonnet
1. AWS Console → Amazon Bedrock (us-west-2 region)
2. Model Access → Request model access
3. Enable "Claude 4.0 Sonnet"

### Step 5: Environment Variables
Create `.env` file:
```env
AWS_REGION=us-west-2
RIOT_API_KEY=your_riot_api_key_here
```

### Step 6: Required AWS Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:Converse",
                "bedrock:ListFoundationModels"
            ],
            "Resource": "*"
        }
    ]
}
```

## Agentic AI Architecture for League of Legends

### Core Pattern: Input → AI Planning → Action → AI Processing → Response

**Example Flow:**
1. **Input**: "Show me my best champions this season"
2. **AI Planning**: Claude determines API sequence (PUUID → Summoner → Champion Mastery)
3. **Action**: Execute Riot API calls
4. **AI Processing**: Claude analyzes champion data
5. **Response**: "Your top 3 champions are Jinx (M7, 89% WR), Caitlyn (M6, 76% WR)..."

### Implementation Files Structure
```
rift-rewind-project/
├── .env
├── .venv/
├── agents/
│   ├── __init__.py
│   ├── league_agent.py      # Main agentic AI agent
│   └── riot_api.py          # Riot API integration
├── frontend/                # Your existing Next.js app
└── backend/                 # Your existing Lambda functions
```

## Next Steps
1. Run the setup commands above
2. Create the agent files using the patterns from weather_agent_cli.py
3. Test with your Riot API key
4. Integrate with your existing Rift Rewind application

## Key Adaptations from Weather Workshop
- Replace NWS API with Riot Games API
- Replace location analysis with summoner/champion analysis
- Replace weather forecasting with player performance insights
- Maintain the same agentic AI workflow pattern