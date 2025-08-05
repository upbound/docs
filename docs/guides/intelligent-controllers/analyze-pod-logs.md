---
title: Analyze pod crashes
---

:::important

This guide requires an Upbound control plane instance running UXP v2.0 or later

:::

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore LLM -->
[Upbound Crossplane][upbound-crossplane] is capable of running [Intelligent Controllers][intelligent-controllers], which define AI-augmented functions to perform tasks. This guide walks through a use case for using AI to analyze and remediate issues for app deployments, such as out-of-memory and pods stuck in a _crashloopbackoff_.

<!-- vale gitlab.Uppercase = YES -->
## Prerequisites

Before you begin make sure you have:

* An Upbound Account
* The `up` CLI installed
* An Anthropic API key
* An AWS account

## Set up your environment

Clone the repository [upbound/configuration-deployment-analysis][guide-repo] to your machine:

```shell
git clone git@github.com:upbound/configuration-deployment-analysis.git
```

This repository contains a [control plane project][project] that defines [watch operations][watch-operations]. These watch operations define workflows for:

- watching for events emitted by pods in a cluster
- analyzing them using LLMs and suggesting remediations
- the remediations are gated by a human-in-the-loop
- if the suggested remediation is approved, it gets applied to address the issues
 database in relation to performance metrics sourced from AWS CloudWatch.

## Configure credentials and runtime settings

In the project directory, edit the `operations/init-operation/operation.yaml` and update the function's `input.spec.anthropicApiKey` to provide an API key from Anthropic. This operation runs whenever you launch the control plane and configures all the required runtime settings.

## Launch the local UXP cluster

In the root of the project directory, launch the control plane locally:

```shell
up project run --local
```

After the control plane gets created, apply a _ClusterRole_ to give Crossplane admin access, so it can create all the Kubernetes resources it needs on the cluster. This object is already defined in the `examples` folder of the project directory:

```shell
kubectl apply -f examples/admin.yaml
```

## Apply example deployments and watch for issues

Apply the examples to demonstrate flows for catching and remediating out-of-memory and _crashloopbackoff_ issues:

```shell
kubectl apply -f examples/oomkilled.yaml -f crashloopbackoff.yaml
```

These workloads intentionally cause the deployed pods to exhibit respective errors.

## Observe analyses and remediations

The operation function pipeline creates _Analysis_ and _Remediation_ resources based on observed behaviors. Fetch an analysis object to observe suggestions for remediation made by the LLM:

```shell
kubectl get Analysis -n crossplane-system
kubectl describe Analysis -n crossplane-system <your-analysis-object>
```

## Clean up

Clean up the local control plane to prevent it from continuing to invoke your LLM. Run the following command:

```shell
up project stop
```

## Next steps

Read the concept documentation for [Intelligent Controllers][intelligent-controllers] to learn more about using AI-powered functions in your function pipelines.

[upbound-crossplane]: /manuals/uxp/overview
[watch-operations]: /manuals/uxp/concepts/operations/watch-operation
[intelligent-controllers]: /manuals/uxp/features/intelligent-controllers
[guide-repo]: https://github.com/upbound/configuration-deployment-analysis
[project]: /manuals/cli/concepts/projects
[intelligent-composition]: /manuals/uxp/concepts/composition/intelligent-compositions