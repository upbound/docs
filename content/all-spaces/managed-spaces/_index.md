---
title: Managed Spaces
weight: 2
description: A guide to Upbound Managed Spaces
---

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.Headings = NO -->
<!-- vale Google.We = NO -->

**Upbound Managed Spaces** is a deployment mode that combines the control and security of a self-hosted environment with the operational ease of a managed service. With Managed Spaces, you deploy Upbound's platform in your own cloud account while granting Upbound's operations team the access needed to maintain your environment.

A Managed Space is a single-tenant deployment of Upbound into your own AWS, Azure, or GCP account. Managed Spaces are for organizations that require strict data residency or compliance while still benefiting from professional management. In this deployment model, you keep full control of your cloud infrastructure. Upbound takes on the responsibility of routine maintenance, upgrades, backups, and monitoring—all without compromising your security or autonomy.
With Managed Spaces, you can use the same API, CLI, and Console that Upbound offers, with the benefit of running entirely in a cloud account that you own and Upbound manages for you.

{{< hint "tip" >}}
If you would rather Upbound deploy the Managed Space in Upbound's own cloud account and manage the infrastructure, that is available as a configuration option as well.
{{< /hint >}}

## Benefits

Managed Spaces provide the following benefits:

- **Single-tenancy in your own Cloud account.** A control plane space gets deployed into your own cloud account.
- **Enhanced Security and Compliance.** Keep your data in your own cloud account while meeting regulatory or internal compliance requirements. Upbound's access gets limited to management operations.
- **Seamless Integration.** Integrate Managed Spaces with your existing cloud infrastructure, maintaining your preferred region and networking configurations.
- **Reduced Overhead.** Offload day-to-day operational burdens to Upbound while focusing on your job of building your platform.

## Architecture

A Managed Space is a deployment of the Upbound Spaces software inside an Upbound-controlled sub-account in your cloud environment. The Spaces software runs in this sub-account, orchestrated by Kubernetes. Backups and billing data get stored inside bucket or blob storage in the same sub-account. The managed control planes deployed and controlled by the Spaces software runs on the Kubernetes cluster which gets deployed into the sub-account.

The diagram below illustrates the high-level architecture of Upbound Managed Spaces:

{{<img src="/all-spaces/managed-spaces/images/managed-arch-aws.png" alt="Upbound Managed Spaces arch" unBlur="true">}}

Upbound doesn't have access to other sub-accounts nor your organization-level settings in your cloud environment. Outside of your cloud organization, Upbound runs the Upbound Console, which includes the Upbound API and web application, including the dashboard you see at `console.upbound.io`.

## How to get access to Managed Spaces

If you have an interest in Upbound Managed Spaces, contact [Upbound](https://www.upbound.io/support/contact). We can chat more about your requirements and see if Managed Spaces are a good fit for you.

<!-- vale Google.We = YES -->
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.Headings = YES -->
