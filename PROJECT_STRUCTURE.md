# Project Structure

## Directory Overview

```
rift-rewind-aws-riot-games-year-3/
├── rift-rewind-hackathon-aws/     # Main project - React + Vite frontend
│   ├── src/
│   │   ├── RiftRewindDashboard.tsx # Riot API integration component
│   │   └── App.tsx                # Cloudscape Design System shell
│   └── package.json               # Dependencies and scripts
├── riot-api-cdk/                  # AWS CDK infrastructure as code
│   ├── lib/riot-api-cdk-stack.ts  # Infrastructure definition
│   ├── lambda/riot-api-source/     # Python Lambda function
│   └── DEPLOYMENT_STEPS.md        # Deployment instructions
├── awsaerospace-core/              # Reference implementation
└── documentation files
```

## Important Notes

### awsaerospace-core Directory
**⚠️ DO NOT EDIT** - This directory contains reference components pulled directly from:
https://github.com/BryanChasko/rgc3-CloudscapeDesignSystem-website

Any changes to this directory will be overwritten. Use it as reference only for styling and component patterns.

### Active Development Directories
- **rift-rewind-hackathon-aws/**: Main frontend application
- **riot-api-cdk/**: Infrastructure deployment code

### Security Notes
- No sensitive information (API keys, account numbers, URLs) stored in code
- All secrets managed through AWS SSM Parameter Store
- Infrastructure deployed using CDK with proper IAM roles