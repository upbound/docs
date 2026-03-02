---
title: Deployment Modes
sidebar_position: 10
description: An overview of deployment modes for Spaces
---

Upbound Spaces support several deployment modes:

- **Cloud Spaces:** Multi-tenant Upbound-hosted, Upbound-managed Space environment. Cloud Spaces provide a typical SaaS experience. 
- **[Dedicated Spaces][dedicated-spaces]:** Single-tenant Upbound-hosted, Upbound-managed Space environment. Dedicated Spaces provide a SaaS experience, with additional isolation guarantees that your workloads run in a fully isolated context.
- **[Managed Spaces][managed-spaces]:** Single-tenant customer-hosted, Upbound-managed Space environment. Managed Spaces provide a SaaS-like experience, with the guarantee that all hosting infrastructure runs from your own cloud account. 
- **[Self-Hosted Spaces][self-hosted-spaces]:** Single-tenant customer-hosted, customer-managed Space environment. You run Spaces fully self-hosted and self-managed. Upbound delivers the Spaces software and you manage the implementation. 

The Upbound platform uses a federated model to connect each Space back to the
[Upbound Console][console], a central service Upbound deploys and manages.

By default, customers have access to a set of Cloud Spaces.

## Supported clouds

You can use host Upbound Spaces on Amazon Web Services (AWS), Microsoft Azure,
and Google Cloud Platform (GCP). Regardless of the hosting platform, you can use
Spaces to deploy control planes that manage the lifecycle of your resources.

## Supported regions

This table lists the cloud service provider regions supported by Upbound.

### GCP
| Region | Location |
| --- | --- |
| `us-west-1` | Western United States (Oregon)
| `us-central-1` | Central United States (Iowa)
| `eu-west-3` | Eastern Europe (Frankfurt)

### AWS

| Region | Location |
| --- | --- |
| `us-east-1` | Eastern United States (Northern Virginia)

### Azure

| Region | Location |
| --- | --- |
| `us-east-1` | Eastern United States (Iowa)

[dedicated-spaces]: /manuals/spaces/howtos/cloud-spaces/dedicated-spaces-deployment
[managed-spaces]: /manuals/spaces/howtos/self-hosted/managed-spaces-deployment
[self-hosted-spaces]: /manuals/spaces/howtos/self-hosted/self-hosted-spaces-deployment
[console]: /manuals/console/upbound-console/
