# Rift Rewind AWS Riot Games Hackathon

![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20CDK%20%7C%20S3-orange)
![React](https://img.shields.io/badge/React-18+-blue)
![Vite](https://img.shields.io/badge/Vite-5+-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)
![Hackathon](https://img.shields.io/badge/Hackathon-Rift%20Rewind-red)

> **AWS serverless Riot Games API integration with React + Vite frontend, CDK infrastructure, and Cloudscape Design System**

## Project Status: 🚀 DEPLOYED TO AWS

### ✅ Live Infrastructure
- **🚀 Frontend**: React 18 + Vite 5 + Cloudscape Design System
- **⚡ Backend**: AWS Lambda with Function URL + Python 3.11
- **🏗️ Infrastructure**: AWS CDK (TypeScript) - Lambda + SSM + IAM
- **🔒 Security**: API keys in SSM Parameter Store (encrypted)
- **🌐 Hosting**: Ready for S3 Static Website + CloudFront
- **🤖 AI Integration**: Agentic AI workshop with Amazon Bedrock

### 📁 Project Structure
```
├── rift-rewind-hackathon-aws/     # Frontend React app
│   ├── src/RiftRewindDashboard.tsx # Main component with Riot API integration
│   └── src/App.tsx                # Cloudscape shell
├── riot-api-cdk/                  # AWS CDK infrastructure
│   ├── lib/riot-api-cdk-stack.ts  # Infrastructure definition
│   └── lambda/riot-api-source/     # Python Lambda function
└── awsaerospace-core/              # Reference components (DO NOT EDIT - pulled from https://github.com/BryanChasko/rgc3-CloudscapeDesignSystem-website)
```

## 🔑 Final Setup Step
**Add Riot API Key via CLI**:
```bash
aws ssm put-parameter \
  --name "/rift-rewind/riot-api-key" \
  --value "YOUR_RIOT_API_KEY_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile aerospaceug-admin
```
Get your key from https://developer.riotgames.com/

## 🎯 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React + Vite  │───▶│  AWS Lambda      │───▶│  Riot Games API │
│   Cloudscape UI │    │  Function URL    │    │  Live Data      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ S3 Static Site  │    │ SSM Parameter    │
│ CloudFront CDN  │    │ Encrypted Keys   │
└─────────────────┘    └──────────────────┘
```

## 🚀 Quick Start
```bash
# Deploy Infrastructure
cd riot-api-cdk && npx cdk deploy

# Build Frontend
cd rift-rewind-hackathon-aws && yarn build

# Add API Key
aws ssm put-parameter --name "/rift-rewind/riot-api-key" --value "YOUR_KEY" --type "SecureString"
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite 5** - Lightning-fast build tool and dev server
- **TypeScript** - Type-safe JavaScript development
- **Cloudscape Design System** - AWS-native UI components
- **Yarn PnP** - Efficient package management

### Backend & Infrastructure
- **AWS Lambda** - Serverless compute with Function URLs
- **AWS CDK** - Infrastructure as Code (TypeScript)
- **Python 3.11** - Lambda runtime for API integration
- **AWS SSM Parameter Store** - Secure secrets management
- **AWS IAM** - Fine-grained access control

### Deployment & Hosting
- **AWS S3** - Static website hosting
- **AWS CloudFront** - Global CDN distribution
- **Dual URL Access** - Subdomain + path routing

### AI & Integrations
- **Amazon Bedrock** - Claude 4.0 Sonnet integration
- **Riot Games API** - Live League of Legends data
- **Agentic AI Patterns** - Intelligent API orchestration

## ✨ Features

- 🎮 **Live Match Data** - Real-time League of Legends statistics
- 🔒 **Secure by Design** - No hardcoded secrets, encrypted storage
- ⚡ **Serverless Architecture** - Auto-scaling, pay-per-use
- 🌍 **Global Distribution** - CloudFront edge locations
- 📱 **Responsive UI** - Cloudscape Design System
- 🤖 **AI-Powered** - Intelligent data processing
- 🛠️ **Infrastructure as Code** - Reproducible deployments
- 📊 **Real-time Analytics** - Player performance insights

## Workshop Reference
Workshop: https://catalog.us-east-1.prod.workshops.aws/join?access-code=5c39-0e3d60-5e

### How to Participate

Complete the tasks for each challenge

At the end of the challenge, create an AWS Builder Center article that includes:Your live website link

Your unique twist on the site design

Key learnings and "aha!" moments

Screenshots of your AWS implementation

Tips for future builders

Important! Tag your article with #rift-rewind-challenge-1 or #rift-rewind-challenge-2

Create a unique theme for your site

Add creative CSS animations

Include an interactive element

Implement a unique layout

Add extra features within Free Tier limits

Share an innovative use case for your site

#### Attribution

^.^
https://builder.aws.com/community/@bryanChasko

AWS and Riot Games Content Copyright Amazon where noted,
 and inferred where not. All contributions by Bryan are
 Open Source under MIT license.
 