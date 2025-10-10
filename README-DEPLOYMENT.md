# Production Deployment Setup

## GitHub Secrets Required

Add these secrets to your GitHub repository:

1. **AWS_ACCESS_KEY_ID** - AWS access key for deployment
2. **AWS_SECRET_ACCESS_KEY** - AWS secret key for deployment  
3. **S3_BUCKET** - S3 bucket name for frontend hosting
4. **CLOUDFRONT_DISTRIBUTION_ID** - CloudFront distribution ID for cache invalidation

## How It Works

1. **CDK Deploy**: GitHub Actions deploys infrastructure first
2. **Extract URL**: Gets Lambda Function URL from CDK outputs
3. **Build Frontend**: Injects real API URL into build via `VITE_API_URL`
4. **Deploy Frontend**: Uploads to S3 with dynamic configuration

## Local Development

```bash
# Uses fallback URL from code
npm run dev
```

## Production Deployment

```bash
# Triggered automatically on push to main
git push origin main
```

The production build will have the real Lambda URL injected at build time, keeping it out of source code while maintaining security.