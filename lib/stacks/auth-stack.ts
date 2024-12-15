import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { APP_PREFIX } from '../config/constants';

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a Cognito User Pool
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      userPoolName: APP_PREFIX,
      selfSignUpEnabled: false, // Allow users to sign up
      signInAliases: {
        email: true, // Allow email as an alias for signing in
      },
      autoVerify: { email: true }, // Verify email addresses
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    // Add an App Client for your frontend
    const userPoolClient = new cognito.UserPoolClient(this, `${APP_PREFIX}-client`, {
      userPool,
      generateSecret: false, // Typically set to false for frontend integrations
      authFlows: {
        userPassword: true,
      },
    });

    // Create user groups
    const adminGroup = new cognito.CfnUserPoolGroup(this, 'AdminsGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Admins',
      description: 'Group for Admin users with elevated permissions and views'
    });
    const brokerGroup = new cognito.CfnUserPoolGroup(this, 'BrokerGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'Brokers',
      description: 'Group for Brokers managing insurance clients and policies with inidividual views'
    });
    const csrGroup = new cognito.CfnUserPoolGroup(this, 'CSRGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'CSRs',
      description: 'Group for Customer Service Reps with limited client and policy views'
    });

    // Output the User Pool ID and Client ID
    new cdk.CfnOutput(this, `${APP_PREFIX}-UserPoolId`, {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, `${APP_PREFIX}-UserPoolClientId`, {
      value: userPoolClient.userPoolClientId,
    });
  }
}
