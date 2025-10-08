# CDK Deployment Steps

## Prerequisites
1. Configure AWS credentials:
   ```bash
   aws configure
   ```
   Or set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_DEFAULT_REGION=us-east-1
   ```

## Deployment Commands

1. **Bootstrap CDK (first time only):**
   ```bash
   npx cdk bootstrap
   ```

2. **Deploy the stack:**
   ```bash
   npx cdk deploy --require-approval never
   ```

3. **After deployment, update the SSM parameter:**
   - Go to AWS Systems Manager Console
   - Navigate to Parameter Store
   - Find `/rift-rewind/riot-api-key`
   - Edit and replace `PLACEHOLDER_KEY` with your actual Riot API key

## ✅ Deployment Complete!
Function URL: `https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/`

## ✅ Frontend Updated
The frontend has been updated with the real Function URL and will automatically use live API calls.

## 🔑 Next: Add Your Riot API Key
1. Go to AWS Systems Manager Console
2. Navigate to Parameter Store
3. Find `/rift-rewind/riot-api-key`
4. Edit and replace `PLACEHOLDER_KEY` with your actual Riot API key from https://developer.riotgames.com/