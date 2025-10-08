import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as path from 'path';

export class RiotApiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SSM Parameter for Riot API Key
    const apiKeyParameter = new ssm.StringParameter(this, 'RiotApiKey', {
      parameterName: '/rift-rewind/riot-api-key',
      stringValue: 'PLACEHOLDER_KEY',
      description: 'Riot Games API Key for Rift Rewind application'
    });

    // Create IAM Role for Lambda
    const lambdaRole = new iam.Role(this, 'RiotApiLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    // Grant Lambda permission to read the SSM parameter
    apiKeyParameter.grantRead(lambdaRole);

    // Create Lambda Function
    const riotApiFunction = new lambda.Function(this, 'RiotApiFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/riot-api-source')),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      environment: {
        PARAMETER_NAME: apiKeyParameter.parameterName
      }
    });

    // Create Function URL with CORS
    const functionUrl = riotApiFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'], // In production, restrict to your CloudFront domain
        allowedMethods: [lambda.HttpMethod.GET],
        allowedHeaders: ['Content-Type'],
        maxAge: cdk.Duration.seconds(300)
      }
    });

    // Output the Function URL
    new cdk.CfnOutput(this, 'RiotApiFunctionUrl', {
      value: functionUrl.url,
      description: 'URL for the Riot API Lambda Function'
    });
  }
}
