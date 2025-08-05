---
title: Dynamically scale an RDS Instance
---

:::important

This guide requires an Upbound control plane instance running UXP v2.0 or later

:::

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore LLM -->
[Upbound Crossplane][upbound-crossplane] is capable of running [Intelligent Controllers][intelligent-controllers], which define AI-augmented functions to perform tasks. This guide walks through a use case for using AI to intelligently scale an AWS RDS database instance.

<!-- vale gitlab.Uppercase = YES -->
## Prerequisites

Before you begin make sure you have:

* An Upbound Account
* The `up` CLI installed
* An Anthropic API key
* An AWS account

## Set up your environment

Clone the repository [upbound/configuration-aws-database-ai][guide-repo] to your machine:

```shell
git clone git@github.com:upbound/configuration-aws-database-ai.git
```

This repository contains a [control plane project][project] that defines a fully managed AWS database instances. This database instance is implemented with an [Intelligent Composition][intelligent-composition] function that scales a database in relation to performance metrics sourced from AWS CloudWatch.

## Launch the local UXP cluster

In the root of the project directory, launch the control plane locally:

```shell
up project run --local
```

## Configure credentials and runtime settings



### AI Provider credentials

### Configure AWS credentials

## Deploy a status transformer

## View in the Web UI

## Clean up

## Next steps

[upbound-crossplane]: /manuals/uxp/overview
[intelligent-controllers]: /manuals/uxp/features/intelligent-controllers
[guide-repo]: https://github.com/upbound/configuration-aws-database-ai
[project]: /manuals/cli/concepts/projects
[intelligent-composition]: /manuals/uxp/concepts/composition/intelligent-compositions