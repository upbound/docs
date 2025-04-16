---
title: Data residency
weight: 100
description: "Information about Upbound's data residency policies."
---

By default, Upbound stores data for Upbound Cloud in the USA. When you purchase an enterprise or business critical subscription to Upbound, you can choose where your organization's control planes and data get stored.

The available regions are:

- The United States
- The EU

To get data residency for your organization, contact [Upbound's Sales team](https://www.upbound.io/contact).

## Data stored in your region

Upbound stores the following data for your organization within your chosen region.

{{< table >}}
| Description of data | Examples |
| ---- | ---- |
| Customer content, including text, metadata, and other data available on the service | Control planes, including control plane names<br>user-created content such as Crossplane compositions<br>structured or blob storage |
| Data or logs that identify your organization | Data for business continuity and disaster recovery (BCDR) |
| Data or logs that identify a person | Email address<br>username<br>First or last name |
{{< /table >}}

## Data stored outside your region

To successfully operate our service, Upbound may store the following data for your organization outside your chosen region.

{{< table >}}
| Description of data | Examples |
| ---- | ---- |
| Information that Upbound needs to administer a subscription | Todo |
| Support and feedback data | Support requests or case notes<br>phone conversations |
{{< /table >}}

## Data transfers

Upbound documents reasons for the transfer of data out of your organization's region, but doesn't notify you when transfers occur.

## Data residency and Upbound Marketplace

The Upbound Marketplace, which includes the web portal at `marketplace.upbound.io` and the underlying OCI registry `xpkg.upbound.io` are served from the United States.

If you wish to pull images hosted in the Marketplace from within an EU data boundary, Upbound recommends mirroring these images to your own OCI registry.