# Rift Rewind Frontend

**React 18 + TypeScript + Vite + Cloudscape Design System**

Cost-effective educational frontend for REST API demonstrations using League of Legends data. Features local test data by default to minimize AWS Lambda costs.

## 🚀 Live Demo
**https://awsaerospace.org/learning/api/**

## ✨ Key Features
- **Local Test Data**: Comprehensive fallback data for cost-effective demonstrations
- **Dual Lambda Integration**: Main API + Summoner Lookup Lambda functions
- **REST Education**: Interactive demonstrations of all 6 REST architectural constraints
- **X-Ray Diagnostics**: Real-time AWS tracing and error reporting
- **Cloudscape UI**: Professional AWS-native design system
- **Cost Optimization**: User-initiated API calls only

## 🏗️ Architecture
- **Frontend Responsibility**: Provides all test data locally to minimize Lambda costs
- **Lambda Integration**: Only calls AWS services when user explicitly requests live data
- **Error Handling**: Graceful degradation with detailed diagnostics
- **Security**: No hardcoded secrets, environment variable configuration

## 🛠️ Development Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 🔧 Environment Configuration

Create `.env.local` with Lambda URLs:
```bash
# Main Lambda Function URL
VITE_API_URL=https://your-main-lambda-url.lambda-url.us-east-2.on.aws/

# Summoner Lookup Lambda URL
VITE_SUMMONER_LOOKUP_URL=https://your-summoner-lambda-url.lambda-url.us-east-2.on.aws/
```

## 📁 Project Structure
```
src/
├── components/
│   ├── RestConstraints/        # Individual REST constraint components
│   ├── RestOverview.tsx        # Landing page
│   ├── RiotApiCheatSheet.tsx   # API documentation
│   └── ProjectResources.tsx    # GitHub links
├── data/
│   └── testData.ts            # Local fallback data
├── services/
│   └── ApiService.ts          # Lambda integration
├── RiftRewindDashboard.tsx    # Main application
└── App.tsx                    # Cloudscape shell
```

## 🎯 Cost-Effective Design
- **Test Data First**: All demonstrations work without Lambda calls
- **User-Initiated APIs**: Explicit buttons for live data fetching
- **Smart Fallbacks**: Always provides meaningful content
- **Transparent Costs**: Users understand when triggering billable services

## 🔗 Integration
- **Main Lambda**: Challenger League data and API validation
- **Summoner Lambda**: Riot ID lookup and champion mastery
- **X-Ray Tracing**: Real-time diagnostics and error reporting
- **CI/CD**: Automated deployment via GitHub Actions

## 🎓 Educational Value
Interactive demonstrations of REST architectural constraints:
1. **Uniform Interface** - Consistent API patterns
2. **Client-Server** - Architectural separation with summoner lookup
3. **Stateless** - Self-contained requests with champion mastery
4. **Cacheable** - CDN optimization strategies
5. **Layered System** - Infrastructure transparency
6. **Code on Demand** - Dynamic UI configuration

## 🚀 Deployment
Automatically deployed via GitHub Actions to S3 + CloudFront:
- **S3 Bucket**: `awsaerospace.org/learning/api/`
- **CloudFront**: Global CDN with cache invalidation
- **CI/CD**: Triggered on `rift-rewind-hackathon-aws/` changes