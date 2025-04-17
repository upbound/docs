---
title: Dedicated Spaces
weight: 2
description: A guide to Upbound Dedicated Spaces
---

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.Headings = NO -->
<!-- vale Google.We = NO -->
<!-- vale gitlab.SentenceLength= NO -->
**Upbound Dedicated Spaces** is a single-tenant deployment of a Cloud Space. With Dedicated Spaces, Upbound hosts and manages the Space for you, while providing guarantees 

A Dedicated Space is a single-tenant deployment of an Upbound Cloud Space. Dedicated Spaces are for organizations that require additional isolation while still benefiting from professional
management. With Dedicated Spaces, you can use the same API, CLI, and Console that
Upbound offers.

{{< hint "tip" >}}
If you would rather Upbound deploy the Space in your own cloud
account and manage the software on your behalf, that is available with [Managed Spaces]({{< ref
"deploy/managed-spaces" >}}). {{< /hint >}}

## Benefits

Dedicated Spaces provide the following benefits:

- **Single-tenancy** A control plane space where Upbound guarantees you're the only tenant operating in the environment.
- **Connectivity to your private network** Establish secure network connections between your Dedicated Cloud Space running in Upbound and your own resources behind your private network.
- **Reduced Overhead.** Offload day-to-day operational burdens to Upbound while focusing on your job of building your platform.

## Architecture

A Dedicated Space is a deployment of the Upbound Spaces software inside an
Upbound-controlled cloud account and network. The control planes you run.

The diagram below illustrates the high-level architecture of Upbound Dedicated Spaces:

{{<img src="/deploy/dedicated-spaces/images/managed-arch-aws.png" alt="Upbound Dedicated Spaces arch" unBlur="true">}}

## How to get access to Dedicated Spaces

If you have an interest in Upbound Dedicated Spaces, contact
[Upbound](https://www.upbound.io/support/contact). We can chat more about your
requirements and see if Dedicated Spaces are a good fit for you.

<!-- vale Google.We = YES -->
<!-- vale Google.Headings = YES -->
<!-- vale gitlab.SentenceLength = YES -->
<!-- vale Microsoft.Headings = YES -->
