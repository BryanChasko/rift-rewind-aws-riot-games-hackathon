#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RiotApiCdkStack } from '../lib/riot-api-cdk-stack';

// Set default environment if not provided
process.env.CDK_DEFAULT_ACCOUNT = process.env.CDK_DEFAULT_ACCOUNT || '211125425201';
process.env.CDK_DEFAULT_REGION = process.env.CDK_DEFAULT_REGION || 'us-east-2';

const app = new cdk.App();
new RiotApiCdkStack(app, 'RiotApiCdkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});