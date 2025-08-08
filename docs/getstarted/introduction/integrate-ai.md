---
title: Create an AI-augmented operation
description: "Use Upbound Crossplane to build and manage an AI-powered control plane"
sidebar_position: 2
---

Upbound Crossplane transforms infrastructure management by integrating AI-powered pipelines directly into your control plane operations. Through LLM-enabled Operation functions, you can build intelligent infrastructure platforms that automatically diagnose issues, suggest fixes, and provide contextual insights about resource health and dependencies.

In this tutorial, you'll learn how to install and configure an intelligent
operation to detect common issues related to managing apps on Kubernetes, including pods running out-of-memory and getting stuck in a _CrashLoopBackOff_.

## Prerequisites

* This tutorial continues from the previous step where you defined your [first control plane project][project].
* The operations you'll create use the Large Language Model Claude by Anthropic. You'll need an Anthropic API key.

## Grant additional permissions

Make sure you have a running control plane so you can grant it additional permissions. If you stopped your control plane previously, you can launch it again by running the following command in the root of your project directory:

```shell
up project run --local
```

:::tip

The `project run` command builds and deploys any changes. If you don't have a control plane running yet, it creates one, otherwise it'll target your existing control plane.

:::

Create the roles and bindings below to give your control plane the ability to create the necessary Kubernetes resource:

```yaml
---
# log-and-event-reader provides sufficient yet narrow scoped permissions for
# reading pod logs and events related to the pod.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: log-and-event-reader
rules:
# controlplane-mcp-server needs get/list on pods, pods/log, and events
# in order to retrieve information for analysis.
- apiGroups:
  - ""
  resources:
  - events
  - pods
  - pods/log
  verbs:
  - get
  - list
---
# Bind the above ClusterRole to the function's service account.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: log-and-event-reader
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: log-and-event-reader
subjects:
- kind: ServiceAccount
  name: function-pod-analyzer
  namespace: crossplane-system
---
# log-and-event-reader provides sufficient yet narrow scoped permissions for
# reading pod logs and events related to the pod.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: analyses-collaborator
rules:
# function-pod-analyzer needs these permissions if it wants to work with
# Analysis resources.
- apiGroups:
  - ops.upbound.io
  resources:
  - analyses
  verbs:
  - get
  - list
  - watch
  - create
---
# Bind the above ClusterRole to the function's service account.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: analyses-collaborator
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: analyses-collaborator
subjects:
- kind: ServiceAccount
  name: function-pod-analyzer
  namespace: crossplane-system
- kind: ServiceAccount
  name: function-analysis-gate
  namespace: crossplane-system
---
# crossplane needs permissions to manage Analyses for correspinding 
# WatchOperations.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: crossplane:aggregate-to-crossplane:analysis-collaborator
  labels:
    rbac.crossplane.io/aggregate-to-crossplane: "true"
rules:
- apiGroups:
  - ops.upbound.io
  resources:
  - analyses
  verbs:
  - get
  - list
  - watch
  - patch
  - update
  - create
---
# log-and-event-reader provides sufficient yet narrow scoped permissions for
# reading pod logs and events related to the pod.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: remediation-collaborator
rules:
# function-pod-analyzer needs these permissions if it wants to work with
# Analysis resources.
- apiGroups:
  - ops.upbound.io
  resources:
  - remediations
  verbs:
  - get
  - list
  - watch
---
# Bind the above ClusterRole to the function's service account.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: remediation-collaborator
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: remediation-collaborator
subjects:
- kind: ServiceAccount
  name: function-remediation-gate
  namespace: crossplane-system
---
# crossplane needs permissions to watch Remediations for correspinding 
# WatchOperations.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: crossplane:aggregate-to-crossplane:remediation-collaborator
  labels:
    rbac.crossplane.io/aggregate-to-crossplane: "true"
rules:
- apiGroups:
  - ops.upbound.io
  resources:
  - remediations
  verbs:
  - get
  - list
  - watch
---
# crossplane needs permissions to watch Remediations for correspinding 
# WatchOperations.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: crossplane:aggregate-to-crossplane:event-watcher
  labels:
    rbac.crossplane.io/aggregate-to-crossplane: "true"
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - get
  - list
  - watch
```

Save as `permissions.yaml` and apply it:

```shell
kubectl apply -f permissions.yaml
```

## Enable _Analysis_ and _Remediation_ APIs

Upbound Crossplane implements two resource types that complement AI operations and let you have human-in-the-loop intervention. You need to enable these resource types. Run the following command on your cluster:

```shell
kubectl -n crossplane-system patch deployment upbound-controller-manager --type='json' -p='[{"op": "add", "path": "/spec/template/spec/containers/0/args/-", "value": "--enable-analysis-and-remediation"}]'
```

## Modify your control plane project

Next, you'll add the functions to your project definition and define the logic to analyze pod events for distress.

### Add functions

Use the up CLI to add the following functions to your control plane project:

```shell
up dep add xpkg.upbound.io/upbound/function-claude:v0.2.0
up dep add xpkg.upbound.io/upbound/function-analysis-gate:v0.0.0-20250804021106-1692dfd80975
up dep add xpkg.upbound.io/upbound/function-remediation-gate:v0.0.0-20250803235634-0bc0b559a335
up dep add xpkg.upbound.io/upbound/function-event-filter:v0.0.0-20250808182639-7c0d692f8efd
```

### Generate the operations

[Operations][operations-concept] lets you build workflows using function pipelines that execute tasks on resources under management by your control plane. Operations run once to completion and then stop. You'll create two operations that detect, analyze, and propose remediations for pods in a bad state.

Use the up CLI to generate the operations:

```shell
up operation generate remediate-oom
up operation generate analyze-events-for-pod-distress
```

Replace the contents of the generated file
`getting-started/operations/remediate-oom/operation.yaml` with the following:

```yaml title="getting-started/operations/remediate-oom/operation.yaml"
apiVersion: ops.crossplane.io/v1alpha1
kind: WatchOperation
metadata:
  name: remediate-oom
spec:
  watch:
    apiVersion: ops.upbound.io/v1alpha1
    kind: Remediation
    namespace: crossplane-system
  concurrencyPolicy: Forbid
  successfulHistoryLimit: 2
  failedHistoryLimit: 1
  operationTemplate:
    spec:
      mode: Pipeline
      pipeline:
      - step: can-attempt-remediation
        functionRef:
          name: upbound-function-remediation-gate
        input:
          apiVersion: gate.remediation.fn.upbound.io/v1alpha1
          kind: Input
```

Replace the contents of the generated file
`getting-started/operations/analyze-events-for-pod-distress/operation.yaml` with the following:

```yaml title="getting-started/operations/analyze-events-for-pod-distress/operation.yaml"
apiVersion: ops.crossplane.io/v1alpha1
kind: WatchOperation
metadata:
  name: analyze-events-for-pod-distress
spec:
  watch:
    apiVersion: v1
    kind: Event
    namespace: crossplane-system
  concurrencyPolicy: Forbid
  successfulHistoryLimit: 2
  failedHistoryLimit: 1
  operationTemplate:
    spec:
      mode: Pipeline
      pipeline:
      - step: filter-noisy-events
        functionRef:
          name: upbound-function-event-filter
        input:
          apiVersion: filter.event.fn.upbound.io/v1alpha1
          kind: Input
          type: Warning
          count: 2
      - step: analysis-gate
        functionRef:
          name: upbound-function-analysis-gate
        input:
          apiVersion: gate.analysis.fn.upbound.io/v1alpha1
          kind: Input
      - step: analyze
        functionRef:
          name: upbound-function-claude
        input:
          apiVersion: claude.fn.upbound.io/v1alpha1
          kind: Prompt
          systemPrompt: |
            You are a Kubernetes infrastructure monitoring expert tasked with analyzing 
            pod logs and events to identify potential deployment issues.
            
            You will be provided with an event that includes an involvedObject that will
            include the namespace and name of the pod to examine.
          userPrompt: |
            You should use the tools available to you to look up events and logs related
            to the pod in order to identify what is wrong.

            REQUIRED OUTPUT FORMAT:
            { 
              "apiVersion": "ops.upbound.io/v1alpha1",
              "kind": "Analysis",
              "metadata": {
                "name": <the name of the pod>,
            	  "namespace": <the namespace of the pod>
              },
              "spec": {
                "involvedObjectRef: {
                  "kind": "Pod",
                  "apiVersion": "v1",
                  "namespace": <the namespace of the pod>,
                  "name": <the name of the pod>,
                  "uid": <the uid of the pod>
                },
                "analysis": "<The analysis of the issues with the pod.>",
                "remediations": [
                  {
                    "name": "<A name for the remediation that is unique to the remediations array. The name must be alphanumeric and must be no longer than 10 characters.>", 
                    "description": "< a short description for the remediation steps that will follow>",
                    "steps": [
                      {
                        "name": "<a unique name for the step>",
                		    "instruction": "<The instruction for this step>"
                      }
                    ]
                  }
                ]
              }
            }

            You can suggest multiple remediation strategies. Each array item in the 
            "remediations" array above will correspond to a strategy. Each strategy must 
            have a short description and a set of steps to fix the identified issue.

            Begin analysis now using the available tools.

            Event Spec:
            {{ .Resources }}
        credentials:
        - name: claude
          source: Secret
          secretRef:
            namespace: crossplane-system
            name: claude
```

Deploy these changes to your control plane by using the up CLI:

```shell
up project run --local
```

### Configure the deployed functions

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: ctp-mcp
spec:
  serviceAccountTemplate:
    metadata:
      name: function-pod-analyzer
  deploymentTemplate:
    spec:
      selector: {}
      template:
        spec:
          containers:
          - name: package-runtime
            args:
            - --debug
            env:
            - name: MCP_SERVER_TOOL_CTP1_TRANSPORT
              value: http-stream
            - name: MCP_SERVER_TOOL_CTP1_BASEURL
              value: http://localhost:8080/mcp
          - name: controlplane-mcp-server
            image: xpkg.upbound.io/upbound/controlplane-mcp-server:v0.0.0-19.g36b5527
            args:
            - --debug
---
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: analysis-perms
spec:
  serviceAccountTemplate:
    metadata:
      name: function-analysis-gate
  deploymentTemplate:
    spec:
      selector: {}
      template:
        spec:
          containers:
          - name: package-runtime
            args:
            - --debug
---
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: remediation-perms
spec:
  serviceAccountTemplate:
    metadata:
      name: function-remediation-gate
  deploymentTemplate:
    spec:
      selector: {}
      template:
        spec:
          containers:
          - name: package-runtime
            args:
            - --debug
---
apiVersion: pkg.crossplane.io/v1
kind: Function
metadata:
  name: upbound-function-claude
spec:
  package: xpkg.upbound.io/upbound/function-claude:v0.2.0
  runtimeConfigRef:
    name: ctp-mcp
---
apiVersion: pkg.crossplane.io/v1
kind: Function
metadata:
  name: upbound-function-analysis-gate
spec:
  package: xpkg.upbound.io/upbound/function-analysis-gate:v0.0.0-20250804021106-1692dfd80975
  runtimeConfigRef:
    name: analysis-perms
---
apiVersion: pkg.crossplane.io/v1
kind: Function
metadata:
  name: upbound-function-remediation-gate
spec:
  package: xpkg.upbound.io/upbound/function-remediation-gate:v0.0.0-20250803235634-0bc0b559a335
  runtimeConfigRef:
    name: remediation-perms
---
apiVersion: pkg.crossplane.io/v1
kind: Function
metadata:
  name: upbound-function-event-filter
spec:
  package: xpkg.upbound.io/upbound/function-event-filter:v0.0.0-20250808182225-b635e1cbfbb8
```

Save as `deploymentruntimeconfigs.yaml` and apply it:

```shell
kubectl apply -f deploymentruntimeconfigs.yaml
```

These configs associate the permissions you created in the previous step to the functions deployed on your control plane, so the functions can create and interact with _Analysis_ and _Remediation_ types.

### Provide an Anthropic API key

Function-claude, which you added as a function in a previous step, sends all requests to your Anthropic account. It needs an Anthropic API key to work. Create an [Anthropic API key][anthropic-key] and add it as a secret to your control plane:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: claude
  namespace: crossplane-system
stringData:
  ANTHROPIC_API_KEY: "your-api-key"
```

Save as `claude.yaml` and apply it:

```shell
kubectl apply -f claude.yaml
```

## Deploy a bad workload

Deploy a _WebApp_ with the below image provided by Upbound. This image contains a simple workload that intentionally gets into an out-of-memory state:

```yaml title="oomkilled.yaml"
apiVersion: platform.example.com/v1alpha1
kind: WebApp
metadata:
  name: oomkilled
  namespace: default
spec:
  parameters:
    image: xpkg.upbound.io/upbound/pod-oom:v0.1.0
    port: 8080
    replicas: 1
    service:
      enabled: false
    ingress:
      enabled: false
    serviceAccount: default
    resources:
      limits:
        memory: 5Mi
        cpu: 100m
      requests:
        memory: 1Mi
        cpu: 100m
```

Save as `oomkilled.yaml` and apply it:

```shell
kubectl apply -f oomkilled.yaml
```

Get the pods and observe that it's in an `OOMKilled` state:

```shell
kubectl get pods
```

These events trigger the `analyze-pod-events-for-distress` operation to occur. Get the operations and observe that they're created:

```shell
kubectl get operations
```

Get the analysis objects and observe they're created:

```shell
kubectl get analysis -A
```

## Next steps

Now that your control plane is running locally, you're ready to package it as a
[Configuration][Configuration] image and push it to the Upbound Marketplace.

Check out the [Build and push your first Configuration][buildAndPush] tutorial
to continue.

[project]: /getstarted/introduction/project
[operations-concept]: /manuals/uxp/concepts/operations/overview/
[anthropic-key]: https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key
[Configuration]: /manuals/uxp/concepts/packages/configurations
[buildAndPush]: /getstarted/introduction/build-and-push
