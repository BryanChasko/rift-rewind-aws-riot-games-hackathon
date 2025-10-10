#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RiotApiCdkStack } from '../lib/riot-api-cdk-stack';

const app = new cdk.App();
new RiotApiCdkStack(app, 'RiotApiCdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '211125425201',
    region: process.env.CDK_DEFAULT_REGION || 'us-east-2'
  }
});