#!/bin/bash
# Fix root index.html by copying from home directory

echo "🔧 Fixing root index.html..."

# Copy the correct index.html from home to root
aws s3 cp s3://awsaerospace.org/home/index.html s3://awsaerospace.org/index.html --region us-east-1

# Invalidate CloudFront cache for root
aws cloudfront create-invalidation --distribution-id ECC3LP1BL2CZS --paths "/" --region us-east-1

echo "✅ Root index.html restored"