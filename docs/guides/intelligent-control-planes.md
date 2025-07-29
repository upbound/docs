---
title: Create an Intelligent Control Plane
---

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore LLM -->
Upbound Crossplane provides AI-powered pipelines to enhance your control plane's
intelligence with LLM-enabled Operation functions. 

This tutorial walks through how to create a new control plane and install
Operation Functions to give your Upbound Crossplane deployment an AI edge.

You'll work with:

* [`function-claude-status-transformer`][func-claude] - designed to identify issues with your Composed Resources.
* [`function-changelog-analyzer`][func-changelog] - 
<!-- vale gitlab.Uppercase = YES -->
## Prerequisites

Before you begin make sure you have:

* An Upbound Account
* The `up` CLI installed
* An Anthropic or OpenAPI key
* An AWS account

## Set up your environment

First, create a control plane and compose some resources.


### Create a new project

Use the `up` CLI and create a new project:

```yaml
up project init ai-demo && cd ai-demo
```

### Add your project dependencies

Next, you need to add the functions and providers necessary for your Intelligent
Control Plane. You can add these dependencies with the `up` CLI:


```shell
#installs the K8s MCP Server wrapped as a controller
up dep add xpkg.upbound.io/upbound/controller-mcp-kubernetes:v0.0.0-60.g2eb9f8d

#installs provider kubernetes
up dep add xpkg.upbound.io/upbound/provider-kubernetes:v0.18.0

#installs function-changelog-analyzer
up dep add xpkg.upbound.io/upbound/function-changelog-analyzer:sha256:408f8571bb2aa01ef8b47bfdfcff1db156e7552a53164aeebb4ef9db8b650a92

#installs provider aws iam
up dep add xpkg.upbound.io/upbound/provider-aws-iam:v1.22.0

#installs provider aws sfn
up dep add xpkg.upbound.io/upbound/provider-aws-sfn:v1.22.0

#installs function-claude-status-transformer
up dep add xpkg.upbound.io/upbound/function-claude-status-transformer:v0.1.2
```
## Create an Operation

Next, create a new Operation function:

```shell
up operation generate --name analyze-changelogs --cron '*/3 * * * *'
```

Open the Operation function file:

```yaml
failureLimit: 5
pipeline:
  - step: Analysis
    functionRef:
      name: upbound-function-changelog-analyzer
    input:
      apiVersion: changelog.fn.crossplane.io/v1beta1
      kind: Prompt
      timeWindow: "3m"
      frequencyThreshold: "40 per minute"
      model: claude-sonnet-4-20250514
      mcpServerURLs:
        - http://mcp-kubernetes.mcp:8080/sse
    credentials:
      - name: api-key-anthropic
        source: Secret
        secretRef:
          namespace: crossplane-system
          name: api-key-anthropic
```


## Create a resource function

For this tutorial, you need to create a function with some purposeful errors.
Generate a new composition function:

```shell
up example generate --type claim --api-group example.upbound.io --api-version v1alpha1 --kind Network --name example
```

## Configure credentials and runtime settings

### AI Provider credentials

Your control plane project requires your LLM API key to authenticate. This
tutorial uses Claude, so create a Claude Code API Key and export it as an
environment variable:

<EditCode language="shell">
{`
export ANTHROPIC_API_KEY=$@YOUR_API_KEY$@
`}
</EditCode>

Create a new control plane secret with this exported value:

```shell
kubectl create secret generic api-key-anthropic \
    -n crossplane-system \
    --from-literal=key="${ANTHROPIC_API_KEY}" \
    --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
```

### Configure AWS credentials

Your control plane project requires authentication with your cloud provider.
This tutorial uses AWS, so generate a secret key pair and create a static
credential configuration:

```shell
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```


Create a `ProviderConfig` to use this new secret:


```yaml
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
      key: my-aws-secret
```

Apply your secret to your control plane:

```shell
kubectl create secret generic aws-secret \
    -n crossplane-system \
    --from-file=my-aws-secret=./aws-credentials.txt
```

Apply your `ProviderConfig`:
```shell
kubectl apply -f provider-config.yaml
```

## Deploy your AI functionality

Now that your control plane is running and authenticated with your LLM and
cloud provider, you're ready to deploy your resources.

### Changelog operation
```shell
up operation generate --name analyze-changelogs --cron '*/3 * * * *'

```


```yaml
failureLimit: 5
pipeline:
  - step: Analysis
    functionRef:
      name: upbound-function-changelog-analyzer
    input:
      apiVersion: changelog.fn.crossplane.io/v1beta1
      kind: Prompt
      timeWindow: "3m"
      frequencyThreshold: "40 per minute"
      model: claude-sonnet-4-20250514
      mcpServerURLs:
        - http://mcp-kubernetes.mcp:8080/sse
    credentials:
      - name: api-key-anthropic
        source: Secret
        secretRef:
          namespace: crossplane-system
          name: api-key-anthropic
```

### Create a status transformer function

```yaml
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
  - functionRef:
      name: upbound-ai-demotest-function
    step: test-function
  - functionRef:
      name: upbound-function-claude-status-transformer
    input:
      apiVersion: function-claude-status-transformer.fn.crossplane.io/v1beta1
      kind: StatusTransformation
      additionalContext: ""
    step: upbound-function-claude-status-transformer
    credentials:
    - name: claude
      source: Secret
      secretRef:
        namespace: crossplane-system
        name: api-key-anthropic
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready

```


```yaml
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

---
# IAM Policy - Bad when simulateFailures=true
apiVersion: iam.aws.upbound.io/v1beta1
kind: Policy
metadata:
    annotations:
        {{ setResourceNameAnnotation "bad-policy" }}
    labels:
        policy: bad
spec:
    forProvider:
        {{- if $xr.spec.simulateFailures }}
        # Invalid JSON - missing comma after Version
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
        # Valid JSON when not simulating failures
        policy: |
            {
                "Version": "2012-10-17",
                "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "s3:GetObject",
                    "Resource": "*"
                }
                ]
            }
        {{- end }}
    providerConfigRef:
        name: default

---
# IAM Role - References the policy above
apiVersion: iam.aws.upbound.io/v1beta1
kind: Role
metadata:
    annotations:
        {{ setResourceNameAnnotation "demo-role" }}
    labels:
        role: demo-role
spec:
    forProvider:
        assumeRolePolicy: |
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "Service": "lambda.amazonaws.com"
                        },
                        "Action": "sts:AssumeRole"
                    }
                ]
            }
        managedPolicyArnsSelector:
            matchLabels:
                policy: bad
    providerConfigRef:
        name: default

---
# Step Function - References the role above
apiVersion: sfn.aws.upbound.io/v1beta2
kind: StateMachine
metadata:
    annotations:
        {{ setResourceNameAnnotation "demo-state-machine" }}
spec:
    forProvider:
        definition: >
            {
                "Comment": "A Hello World example of the Amazon States Language using an AWS Lambda Function",
                "StartAt": "HelloWorld",
                "States": {
                    "HelloWorld": {
                        "Type": "Task",
                        "Resource": "arn:aws:lambda:us-west-1:609897127049:function:example",
                        "End": true
                    }
                }
            }
        region: {{ $xr.spec.region }}
        roleArnSelector:
            matchLabels:
                role: demo-role

---
# Healthy IAM Policy - Always succeeds
apiVersion: iam.aws.upbound.io/v1beta1
kind: Policy
metadata:
    annotations:
        {{ setResourceNameAnnotation "healthy-policy" }}
    labels:
        policy: healthy
spec:
    forProvider:
        policy: |
            {
                "Version": "2012-10-17",
                "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "logs:CreateLogGroup",
                    "Resource": "*"
                }
                ]
            }
    providerConfigRef:
        name: default


```
### Apply your operation and function

```shel
up project run --local

```

```shell
kubectl apply -f FILE.YAML
```

## View in the Web UI

## Clean up

## Next steps

[func-claude]:
[func-changelog]:
