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

This repository contains a [control plane project][project] that defines a fully managed AWS database instances. This database instance is implemented with an [Intelligent Composition][intelligent-composition] function that scales the database in relation to performance metrics fetched from AWS CloudWatch.

## Launch the local UXP cluster

In the root of the project directory, launch the control plane locally:

```shell
up project run --local
```

## Configure credentials and runtime settings

Create a secret on the control plane which contains an Anthropic API key:

```shell
kubectl create secret generic claude \
  --from-literal=ANTHROPIC_API_KEY=<your-api-key> \
  -n crossplane-system
```

Create a second secret on the control plane which contains credentials for your AWS account:

```shell
kubectl create secret \
  generic aws-creds \
  -n crossplane-system \
  --from-file=aws-creds=./aws-credentials.txt
```

## Create a database

Deploy a network and database:

```shell
kubectl apply -f examples/network-intelligent.yaml -f mariadb-xr-intelligent.yaml
```

The database gets created, the control plane periodically fetches performance metrics for it from AWS CloudWatch, and dynamically scales the database size accordingly. 

To validate the intelligent scaling system, you can stress test the RDS instance to trigger high CPU utilization and observe AI-driven scaling decisions. The command below performs a stress test to mimic real usage:

```shell
# Trigger high CPU load with multiple concurrent MD5 hash computations
for i in {1..8}; do
    mysql \
      --host=your-rds-endpoint.region.rds.amazonaws.com \
      --user=masteruser \
      --password=your-password \
      --default-auth=mysql_native_password \
      --execute="SELECT BENCHMARK(1000000000, MD5('trigger_scaling_$i'));" &
done
```

## Clean up

Clean up the local control plane to prevent it from continuing to invoke your LLM. Run the following command:

```shell
up project stop
```

## Next steps

Read the concept documentation for [Intelligent Controllers][intelligent-controllers] to learn more about using AI-powered functions in your function pipelines.

[upbound-crossplane]: /manuals/uxp/overview
[intelligent-controllers]: /manuals/uxp/features/intelligent-controllers
[guide-repo]: https://github.com/upbound/configuration-aws-database-ai
[project]: /manuals/cli/concepts/projects
[intelligent-composition]: /manuals/uxp/concepts/composition/intelligent-compositions