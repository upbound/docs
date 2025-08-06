---
title: Create an Intelligent Control Plane
sidebar_position: 1
---

:::important

This guide requires an Upbound control plane instance running UXP v2.0 or later

:::

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore LLM -->
Upbound Crossplane provides AI-powered pipelines to your infrastructure in LLM
enabled Operation functions. This tutorial walks through installing,
configuring, and exploring your Intelligent Control Planes.

<!-- vale gitlab.Uppercase = YES -->
## Prerequisites

Before you begin make sure you have:

* An Upbound Account
* The `up` CLI installed
* An Anthropic key
* An AWS account

## Set up your environment
Create a new profile logged into the upbound org so you can get private packages. Make sure your current kube context is not a Space (so up will use the local project runner).

```shell
    up login --profile=upbound-dev --organization=upbound-dev --token='<MY_ROBOT_TOKEN_HERE>'
    kubectl config unset current-context
```



## Initialize a local project with AI dependencies
Next, we will initialize a local project with AI dependencies.

```shell
    up project init ai-demo

    cd ai-demo

    #installs provider aws iam
    up dep add xpkg.upbound.io/upbound/provider-aws-iam:v1.22.0

    #installs provider aws sfn
    up dep add xpkg.upbound.io/upbound/provider-aws-sfn:v1.22.0

    #installs function-claude-status-transformer
    up dep add xpkg.upbound.io/upbound/function-claude-status-transformer
```

## Launch the local UXP cluster
Run the local UXP cluster

```shell
    up project run --local
```

## Configure credentials and runtime settings
Go configure your Anthropic or OpenAI API Key, and then export it as an environment variable. Then create the Anthropic API key secret for the control plane to use:

### AI Provider credentials

```shell
    export ANTHROPIC_API_KEY=<your super secret key here>

    kubectl -n crossplane-system create secret generic api-key-anthropic --from-literal=key="${ANTHROPIC_API_KEY}" --from-literal=ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"
```

### Configure AWS credentials
Create a text file containing the AWS account aws_access_key_id and aws_secret_access_key.

```shell
    [default]
    aws_access_key_id = <aws_access_key_id>
    aws_secret_access_key = <aws_secret_access_key>
```

Then create a Kubernetes secret with your AWS credentials

```shell
    kubectl create secret \
    generic aws-secret \
    -n crossplane-system \
    --from-file=creds=./aws-credentials.txt
```

Verify that your secret looks correct
```shell
    kubectl describe secret aws-secret -n crossplane-system
    
    Name:         aws-secret
    Namespace:    crossplane-system
    Labels:       <none>
    Annotations:  <none>

    Type:  Opaque

    Data
    ====
    creds:  114 bytes
```

Create a ProviderConfig for ProviderAWS
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

## Deploy a status transformer
We’re going to create a new Go templating composition that creates a bunch of resources, with some baked in errors.

```shell
    up example generate --type claim --api-group example.upbound.io --api-version v1alpha1 --kind Network --name example
```

Edit the generated example to match the mocked example:
```shell
    apiVersion: example.upbound.io/v1alpha1
    kind: Network
    metadata:
        name: example
        namespace: default
    spec:
        simulateFailures: true
        region: "us-east-1"
```

Generate the XRD and composition from the example:
```shell
    up xrd generate examples/network/example.yaml
    up composition generate apis/xnetworks/definition.yaml
```

Edit the generated composition to match the mocked example:
```shell
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

Next, create a new go-templating embedded function:
```shell
    up function generate --language=go-templating test-function apis/xnetworks/composition.yaml
```

Edit the generated Go template composition function to match the mocked composition:
```shell
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

## See the Intelligence in Action
Apply the example:

```shell
    kubectl apply -f ./examples/network/example.yaml
```

Now, open the WebUI with the following command:

```shell
    up uxp web-ui open
```

In the WebUI, go to the Network MR objects. Watch the intelligence embedded error message describing the problem between the nested set of resources.

Now modify the claim so that it is now working correctly:
```shell
    kubectl edit network example
    
    #Update the spec.simulateFailures to false
    simulateFailures: false
```

Now, wait for a bit. Watch the intelligence embedded error message describing the problem evolve as the errors in the Network object begins to resolve.