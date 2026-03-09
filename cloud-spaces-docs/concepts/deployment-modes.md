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
For customer-hosted deployments, see the [Self-Hosted Spaces documentation](/spaces/concepts/deployment-modes/).
Self-Hosted Spaces include Managed Spaces (Upbound-managed, customer-hosted) and
Self-Hosted Spaces (customer-managed, customer-hosted).
:::

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
