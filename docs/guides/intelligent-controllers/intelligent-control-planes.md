---
title: Build Intelligent Control Planes with AI-Powered Operations
description: "Advanced guide for implementing AI-powered control planes using Upbound Crossplane with intelligent functions and automated error resolution"
sidebar_position: 1
---
<!-- vale gitlab.Uppercase = NO --> 
<!-- ignore LLM -->
:::important
This guide requires an Upbound control plane instance running UXP v2.0 or later
and targets users with existing control plane experience. 
:::

Upbound Crossplane transforms infrastructure management by integrating
AI-powered pipelines directly into your control plane operations. Through
LLM-enabled Operation functions, you can build intelligent infrastructure
platforms that automatically diagnose issues, suggest fixes, and provide
contextual insights about resource health and dependencies.

This comprehensive guide demonstrates how to architect, deploy, and operate
intelligent control planes that leverage Claude AI for enhanced operational
intelligence.

Intelligent control planes extend traditional Crossplane functionality with:

- **AI-powered status transformers** that analyze resource states and provide intelligent diagnostics
- **Contextual error analysis** that understands resource relationships and dependencies  
- **Automated remediation suggestions** based on infrastructure patterns and best practices
- **Real-time operational insights** that help platform teams understand complex system states

## Prerequisites

Before implementing an intelligent control plane, ensure you have:

- **Platform Experience**: Familiarity with Crossplane compositions, XRDs, and function pipelines
- **Infrastructure Access**: AWS account with appropriate IAM permissions
- **AI Integration**: Anthropic API key for Claude integration
- **Development Environment**: 
  - Upbound Account with access to private packages
  - `up` CLI installed and configured
  - Local Kubernetes development environment

## Environment setup

Login to your Upbound organization:

```shell
# Configure authenticated access to Upbound packages
up login --token='<ROBOT_TOKEN>'

# Ensure local project context (not Space-based)
kubectl config unset current-context
```

Next, create a new project with AI-enhanced dependencies:

```shell
# Initialize project with intelligent capabilities
up project init intelligent-platform && cd intelligent-platform

# Add core AWS providers for infrastructure management
up dep add xpkg.upbound.io/upbound/provider-aws-iam:v1.22.0
up dep add xpkg.upbound.io/upbound/provider-aws-sfn:v1.22.0

# Add Claude AI status transformer for intelligent operations
up dep add xpkg.upbound.io/upbound/function-claude-status-transformer
```

## Run your project

Launch your intelligent control plane locally:

```shell
up project run --local
```

## Configure AI and cloud credentials

Configure Claude API access for intelligent functions:

```shell
# Set your Anthropic API key
export ANTHROPIC_API_KEY="<your-anthropic-api-key>"

# Create Kubernetes secret for AI function access
kubectl -n crossplane-system create secret generic api-key-anthropic \
  --from-literal=key="${ANTHROPIC_API_KEY}" \
  --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
```

### AWS provider configuration

Set up AWS credentials for infrastructure provisioning:

```shell
# Create AWS credentials file
cat > aws-credentials.txt << EOF
[default]
aws_access_key_id = <your-access-key>
aws_secret_access_key = <your-secret-key>
EOF

# Create Kubernetes secret
kubectl create secret generic aws-secret \
  -n crossplane-system \
  --from-file=creds=./aws-credentials.txt

# Verify secret creation
kubectl describe secret aws-secret -n crossplane-system
```

Configure the AWS ProviderConfig:

```shell
kubectl apply -f - <<EOF
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-secret
      key: creds
EOF
```

## Create your intelligent composition

Generate your composite resource structure:

```shell
# Create example claim with error simulation capabilities
up example generate --type claim --api-group example.upbound.io \
  --api-version v1alpha1 --kind Network --name example
```

Configure the example with intelligent error simulation:

```yaml
# examples/network/example.yaml
apiVersion: example.upbound.io/v1alpha1
kind: Network
metadata:
  name: example
  namespace: default
spec:
  simulateFailures: true  # Enables AI-powered error analysis
  region: "us-east-1"
```

Next, generate composite resource definition:

```shell
up xrd generate examples/network/example.yaml
up composition generate apis/xnetworks/definition.yaml
```

Edit the composition to include AI-powered pipeline steps:

```yaml
# apis/xnetworks/composition.yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xnetworks.example.upbound.io
spec:
  compositeTypeRef:
    apiVersion: example.upbound.io/v1alpha1
    kind: XNetwork
  mode: Pipeline
  pipeline:
  # Resource generation step
  - functionRef:
      name: upbound-ai-demotest-function
    step: resource-generation
  
  # AI-powered status analysis step
  - functionRef:
      name: upbound-function-claude-status-transformer
    input:
      apiVersion: function-claude-status-transformer.fn.crossplane.io/v1beta1
      kind: StatusTransformation
      additionalContext: "Analyze AWS IAM policy and Step Function dependencies"
    step: intelligent-status-analysis
    credentials:
    - name: claude
      source: Secret
      secretRef:
        namespace: crossplane-system
        name: api-key-anthropic
  
  # Auto-ready resolution step
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: resource-readiness
```

### Create your intelligent function

Create the Go template function that demonstrates intelligent error analysis:

```shell
up function generate --language=go-templating resource-generation apis/xnetworks/composition.yaml
```

Open your function file and paste the following function:

```yaml
# functions/resource-generation.yaml
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

---
# IAM Policy with conditional error simulation
apiVersion: iam.aws.upbound.io/v1beta1
kind: Policy
metadata:
  annotations:
    {{ setResourceNameAnnotation "application-policy" }}
  labels:
    policy: application
    component: security
spec:
  forProvider:
    {{- if $xr.spec.simulateFailures }}
    # Intentionally malformed JSON for AI analysis
    policy: |
      {
        "Version": "2012-10-17"
        "Statement": [
        {
          "Effect": "Allow",
          "Action": "s3:GetObject",
          "Resource": "*"
        }
        ]
      }
    {{- else }}
    # Correct JSON when not simulating failures
    policy: |
      {
        "Version": "2012-10-17",
        "Statement": [
        {
          "Effect": "Allow",
          "Action": ["s3:GetObject", "s3:ListBucket"],
          "Resource": ["arn:aws:s3:::my-bucket/*", "arn:aws:s3:::my-bucket"]
        }
        ]
      }
    {{- end }}
  providerConfigRef:
    name: default

---
# IAM Role with policy dependency
apiVersion: iam.aws.upbound.io/v1beta1
kind: Role
metadata:
  annotations:
    {{ setResourceNameAnnotation "application-role" }}
  labels:
    role: application
    component: security
spec:
  forProvider:
    assumeRolePolicy: |
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": ["lambda.amazonaws.com", "states.amazonaws.com"]
            },
            "Action": "sts:AssumeRole"
          }
        ]
      }
    managedPolicyArnsSelector:
      matchLabels:
        policy: application
  providerConfigRef:
    name: default

---
# Step Function with role dependency
apiVersion: sfn.aws.upbound.io/v1beta2
kind: StateMachine
metadata:
  annotations:
    {{ setResourceNameAnnotation "workflow-state-machine" }}
  labels:
    component: orchestration
spec:
  forProvider:
    definition: |
      {
        "Comment": "Intelligent workflow with error handling",
        "StartAt": "ProcessData",
        "States": {
          "ProcessData": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:{{ $xr.spec.region }}:123456789012:function:data-processor",
            "Retry": [
              {
                "ErrorEquals": ["Lambda.ServiceException", "Lambda.AWSLambdaException"],
                "IntervalSeconds": 2,
                "MaxAttempts": 6,
                "BackoffRate": 2
              }
            ],
            "End": true
          }
        }
      }
    region: {{ $xr.spec.region }}
    roleArnSelector:
      matchLabels:
        role: application
  providerConfigRef:
    name: default

---
# Healthy baseline policy for comparison
apiVersion: iam.aws.upbound.io/v1beta1
kind: Policy
metadata:
  annotations:
    {{ setResourceNameAnnotation "baseline-policy" }}
  labels:
    policy: baseline
    component: security
spec:
  forProvider:
    policy: |
      {
        "Version": "2012-10-17",
        "Statement": [
        {
          "Effect": "Allow",
          "Action": "logs:CreateLogGroup",
          "Resource": "arn:aws:logs:*:*:*"
        }
        ]
      }
  providerConfigRef:
    name: default
```

## Deploy and observe error analysis

Apply your intelligent composition:

```shell
kubectl apply -f ./examples/network/example.yaml
```

Launch the WebUI to observe AI-powered insights:

```shell
up uxp web-ui open
```

Navigate to your Network managed resources and observe:

- **Intelligent Error Messages**: Claude analyzes the malformed JSON policy and explains the missing comma syntax error
- **Dependency Analysis**: AI identifies how the IAM policy error cascades to affect the Role and Step Function
- **Contextual Recommendations**: Specific suggestions for fixing the policy syntax and improving resource definitions

Test the intelligent resolution workflow:

```shell
# Edit the claim to disable error simulation
kubectl edit network example

# Change simulateFailures to false in the spec
spec:
  simulateFailures: false
  region: "us-east-1"
```

Observe in the WebUI how:
- AI detects the configuration change
- Status messages evolve from error analysis to success confirmation
- Resource dependency health improves across the entire composite

These intelligent control plane patterns help you transform your infrastructure
platforms from reactive to proactive.

<!-- vale gitlab.Uppercase = YES--> 
