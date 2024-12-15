#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AuthStack } from '../lib/stacks/auth-stack';
import { Environment } from 'aws-cdk-lib';

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT || 'null',
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

const app = new cdk.App();
new AuthStack(app, 'AllRiskCRM-AuthStack', { env });
