---
title: Managed Control Planes
weight: 3
description: An introduction to the Managed Control Planes feature of Upbound
---

Managed control planes (MCPs) are Crossplane control plane environments that are fully managed by Upbound. Upbound manages:

- the underlying lifecycle of infrastructure hosting the MCP
- scaling of the infrastructure
- the maintenance of the core Crossplane components that make up a managed control plane. 

This lets users focus on building their APIs and operating their control planes, while Upbound handles the rest. Each managed control plane has its own dedicated API server that customers can connect to directly and use typical Kubernetes tooling — like kubectl — to interact with their MCP.

## Architecture

Open source Crossplane is usually installed into a manage Kubernetes service like Azure's AKS, AWS EKS, or GCP GKE. Due to how those public cloud providers offer their managed services, users running OSS Crossplane face scalability limitations when attempting to create control planes that can manage across many resources.

{{<img src="concepts/images/mcp-arch.png" alt="an architecture of XP with Upbound" size="large" quality="100" lightbox="true">}}

With Upbound managed control planes, these limitations do not apply. MCPs can easily scale to >1000 CRDs without a performance degradation.

## Versioning

MCPs are powered by Upbound Universal Crossplane (UXP), Upbound's enterprise-grade open source distribution of Crossplane. A user's managed control plane installation of UXP is fully managed by Upbound.

Alpha features of Crossplane are not enabled by default in Upbound.

## Control plane backups

Upbound automatically captures snapshots of an MCP state every ~24 hours. These backups are not yet available for users to use directly. Once available, customers will be able to rely on these backups to mitigate disasters and enable recovery scenarios of their control plane state.

## Create an MCP

You can create a new managed control plane from the Upbound Console or the `up` CLI. To use the CLI, run the following, specifying which configuration to install on the control plane and what the name should be.

```shell 
up ctp create --configuration-name=<configuration> <name-of-control-plane>
```

To learn more about control plane-related commands in `up`, go to the [CLI reference]({{<ref "cli/command-reference#controlplane-create" >}}) documentation.

## Configure OpenID Connect for your MCP

Upbound's managed control planes can be configured to support credential-less authentication in the form of OpenID Connect. This lets your managed control plane exchange short-lived tokens directly from your cloud provider. To learn how to configure a managed control plane with OIDC, read the [Knowledge Base]({{<ref "knowledge-base/oidc.md" >}}) documentation.
