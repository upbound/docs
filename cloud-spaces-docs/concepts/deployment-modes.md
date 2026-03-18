---
title: Deployment Modes
sidebar_position: 10
description: Cloud Spaces deployment modes
---

Upbound Cloud Spaces come in two deployment modes:

- **Cloud Spaces:** Multi-tenant Upbound-hosted, Upbound-managed Space environment. Cloud Spaces provide a typical SaaS experience. All customers have access to Cloud Spaces by default.
- **[Dedicated Spaces][dedicated-spaces]:** Single-tenant Upbound-hosted, Upbound-managed Space environment. Dedicated Spaces provide a SaaS experience, with additional isolation guarantees that your workloads run in a fully isolated context.

The Upbound platform uses a federated model to connect each Space back to a
central service called the [Upbound Console][console], which is deployed and
managed by Upbound.

:::info Looking for self-hosted options?
For customer-hosted deployments, see the [Self-Hosted Spaces documentation](/cloud-spaces/concepts/deployment-modes/).
Self-Hosted Spaces include Managed Spaces (Upbound-managed, customer-hosted) and
Self-Hosted Spaces (customer-managed, customer-hosted).
:::


## Dedicated Spaces

Dedicated Spaces offer the following benefits:

- **Single-tenancy** A control plane space where Upbound guarantees you're the only tenant operating in the environment.
- **Connectivity to your private network** Establish secure network connections between your Dedicated Cloud Space running in Upbound and your own resources behind your private network.
- **Reduced Overhead.** Offload day-to-day operational burdens to Upbound while focusing on your job of building your platform.

## Architecture

A Dedicated Space is a deployment of the Upbound Spaces software inside an
Upbound-controlled cloud account and network. The control planes you run.

The diagram below illustrates the high-level architecture of Upbound Dedicated Spaces:

![Upbound Managed Spaces arch](/img/managed-arch-gcp.png)

## How to get access to Dedicated Spaces

If you have an interest in Upbound Dedicated Spaces, contact
[Upbound][contact-us]. The Upbound team can discuss your
requirements and determine if Dedicated Spaces fit your needs.

[contact-us]: https://www.upbound.io/contact-us

## Supported clouds

You can use host Upbound Spaces on Amazon Web Services (AWS), Microsoft Azure,
and Google Cloud Platform (GCP). Regardless of the hosting platform, you can use
Spaces to deploy control planes that manage the lifecycle of your resources.

## Supported regions

This table lists the cloud service provider regions supported by Upbound.

### GCP

| Region | Location |
| --- | --- |
| `us-west-1` | Western US (Oregon)
| `us-central-1` | Central US (Iowa)
| `eu-west-3` | Eastern Europe (Frankfurt)

### AWS

| Region | Location |
| --- | --- |
| `us-east-1` | Eastern US (Northern Virginia)

### Azure

| Region | Location |
| --- | --- |
| `us-east-1` | Eastern US (Iowa)

[dedicated-spaces]: /cloud-spaces/howtos/dedicated-spaces-deployment
[console]: /manuals/console/upbound-console/
