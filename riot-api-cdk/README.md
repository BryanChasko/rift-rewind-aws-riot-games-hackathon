# Rift Rewind AWS Infrastructure

**AWS CDK + TypeScript + Dual Lambda Architecture**

Infrastructure as Code for the Rift Rewind educational REST API project. Deploys dual Lambda functions with secure API key management and comprehensive monitoring.

## 🏗️ Architecture Overview
- **Main Lambda**: Challenger League data retrieval and API validation
- **Summoner Lambda**: Riot ID lookup and champion mastery data
- **SSM Parameter Store**: Encrypted API key storage
- **X-Ray Tracing**: Distributed tracing and performance monitoring
- **Function URLs**: Direct HTTPS endpoints with CORS support

## 🚀 Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm
- Riot Games API key from https://developer.riotgames.com/

### Quick Deploy
```bash
# Install dependencies
npm install

# Bootstrap CDK (first time only)
npx cdk bootstrap --profile your-aws-profile

# Deploy infrastructure
npx cdk deploy --profile your-aws-profile

# Add API key to SSM
aws ssm put-parameter \
  --name "/rift-rewind/riot-api-key" \
  --value "RGAPI-your-key-here" \
  --type "SecureString" \
  --profile your-aws-profile
```

## 📁 Project Structure
```
lib/
└── riot-api-cdk-stack.ts      # CDK stack definition
lambda/
├── riot-api-source/
│   └── lambda_function.py     # Main Lambda function
└── summoner-lookup-source/
    └── summoner_lookup.py     # Summoner lookup Lambda
bin/
└── riot-api-cdk.ts          # CDK app entry point
```

## 🔧 Lambda Functions

### Main Lambda (`riot-api-source/`)
- **Endpoint**: Challenger League API
- **Features**: API key validation, error handling, X-Ray tracing
- **Response**: Real challenger rankings with performance metrics

### Summoner Lambda (`summoner-lookup-source/`)
- **Endpoint**: Riot ID to summoner data conversion
- **Features**: Multi-step API calls, champion mastery, region routing
- **Response**: Summoner details with top 3 champions

## 🔒 Security Features
- **Zero Hardcoded Secrets**: All API keys in encrypted SSM Parameter Store
- **Least Privilege IAM**: Minimal required permissions for each Lambda
- **CORS Configuration**: Secure cross-origin resource sharing
- **X-Ray Tracing**: Comprehensive request tracking and diagnostics

## 🛠️ Development Commands
```bash
# Compile TypeScript
npm run build

# Watch for changes
npm run watch

# Run tests
npm run test

# Deploy stack
npx cdk deploy --profile your-aws-profile

# View differences
npx cdk diff --profile your-aws-profile

# Generate CloudFormation template
npx cdk synth
```

## 📊 Monitoring & Debugging
- **CloudWatch Logs**: Automatic log group creation for both Lambda functions
- **X-Ray Tracing**: Distributed tracing with trace ID in responses
- **Error Handling**: Comprehensive error classification and reporting
- **API Transparency**: Detailed attempt tracking for educational purposes

## 🔄 CI/CD Integration
Automatically deployed via GitHub Actions:
- **Trigger**: Changes to `riot-api-cdk/` directory
- **Security**: GitLeaks scanning and OIDC authentication
- **Validation**: Both Lambda functions validated post-deployment
- **Outputs**: Function URLs exported for frontend integration

## 🎯 Cost Optimization
- **On-Demand Pricing**: Pay only for actual Lambda invocations
- **Function URLs**: No API Gateway costs
- **Efficient Runtime**: Python 3.11 with optimized cold start patterns
- **User-Initiated**: Frontend controls when Lambda functions are called

## 🔗 Stack Outputs
After deployment, the stack provides:
- `LambdaFunctionUrl`: Main Lambda endpoint
- `SummonerLookupUrl`: Summoner lookup endpoint

These URLs are automatically used by the frontend and CI/CD pipeline.