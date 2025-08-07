---
title: Create an AI-powered control plane
description: "Use Upbound Crossplane to build and manage an AI-powered control
plane"
sidebar_position: 4
---

Upbound Crossplane enhances the control plane workflow with AI-powered
pipelines. You can add LLM enabled Operations functions to your control plane
and improve your platform experience.

In this tutorial, you'll learn how to install and configure an intelligent
function in your control plane. This tutorial is suitable users new to control
planes. If you're already familiar with control plane operations, checkout our
intelligent control plane solutions guide.

This tutorial assumes you have:

* Basic cloud provider concepts in AWS, Azure, or GCP
* AI, LLM, and MCP concepts

## Prerequisites

Before you begin, make sure you have:

* a control plane running (use the previous guide)
* an AI API key

## Configure your environment

First, login to Upbound and unset your current `kubeconfig` context. This allows
you to pull the function from the marketplace and use your local control plane
as the current context:


```shell
up login
kubectl config unset current-context
```

If you don't have a running control plane, create a new control plane project
from scratch:

```shell
up project init uxp-ai && cd uxp-ai
```

Next, export your Anthropic API key as an environment variable:

## Add your AI dependencies

Upbound Crossplane provides several intelligent control plane functions to help
you build and manage your infrastructure. You have to add these functions to
your control plane project as dependencies.


In your running control plane, add the new function and the providers as dependencies:

```shell
up dep add xpkg.upbound.io/upbound/function-claude-status-transformer

up dep add xpkg.upbound.io/upbound/provider-aws-iam

up dep add xpkg.upbound.io/upbound/provider-aws-sfn
```

## Generate your composition

You need to deploy some resources with a composition to see the function
utility. Generate a new composite resource (XR) file:

```shell
up example generate --type xr --api-group example.upbound.io --api-version
v1alpha1 --kind Network --name example
```

Next, edit your XR example to simulate errors in the composition:


```yaml
apiVersion: example.upbound.io/v1alpha1
kind: Network
metadata:
  name: example
  namespace: default
spec:
  simulateFailures: true
  region: "us-east-1"
```

Generate your XRD and composition from your XR:

```shell
up xrd generate 
up composition generate 
```

Generate your function:

```shell
up function generate --language=go-templating test-function 
```

Open your function file and paste the function below:

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


## Run and configure your AI features

Run your project with the new configuration information:


```shell
up project run --local
```

With your new project information, you need to create a Kubernetes secret that
references your API key:

```shell
kubectl -n crossplane-system create secret generic api-key-anthropic \
  --from-literal=key="${ANTHROPIC_API_KEY}" \
  --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
```

Set up your AWS credentials and create a `ProviderConfig` that references your
AWS secret key. For more information on how to create an `aws-secret`, follow
the [Provider Authentication docs][auth-docs].

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

## Apply and use your AI-powered control plane

When you created your XR file, we intentionally added a failing component to see
the status transformer in action. Apply the XR to your control plane:


```shell
kubectl apply --filename examples/network/example.yaml
```


Open the Web UI:

```shell
up uxp web-ui open
```


Navigate to the URL to see your control plane web UI.
