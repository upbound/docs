---
title: Manage external resources with providers
sidebar_position: 2
---

Upbound Crossplane is the AI-native distribution of Crossplane. Control planes
are the only way to build and support an autonomous infrastructure platform for
the age of autonomous systems, service both humans and AI. One of the advantages
of Crossplane is the extensive library of managed resources you can use to
manage almost any cloud provider or cloud native software.

:::tip
This quickstart is suitable for users who want to manage external
services using ready-made custom resources.

For users who want to build workflows for templating resources and exposing
them as simplified resource abstraction, read the [Get Started with Composition
guide][composition]

:::


## Prerequisites

This quickstart takes around 10 minutes to complete. You should be familiar with
cloud concepts.

For this quickstart, you need:

- the [Upbound CLI](up) installed.
- a Docker-compatible container runtime installed on your system and running.
- an AWS account


## Install the provider

Crossplane provides a library of pre-built managed resources that you can use to
manage external services.


https://marketplace.upbound.io/providers/upbound/provider-aws-s3/v1.23.1/resources/s3.aws.upbound.io/Bucket/v1beta2


### Create provider credentials

### Configure the provider

## Create a managed resource

## Clean up

## Next Steps

In this guide, you created a local Upbound Crossplane instance, and deployed
managed resources.

Next, learn more about how Crossplane can deploy cloud resources and manage
external services:

* [Create a custom GCP resource type][gcp]
* [Perform an operation on a resource][operations]
* [Manage external resources with composition][composition-qs]

[up]: up
[marketplace]: https://marketplace.upbound.io
[functions]: /uxp/composition/composite-resource-definitions
[aws]: /uxp/quickstart/aws-composition 
[azure]: /uxp/quickstart/azure-composition 
[gcp]:  /uxp/quickstart/gcp-composition
[operations]:  /uxp/quickstart/operation
[providers]:  /uxp/quickstart/external-resources
[composition]: link
<!--- TODO(tr0njavolta): links --->

## Next Steps

TODO
