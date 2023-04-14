---
title: Managed Control Planes
weight: 3
description: An introduction to the Managed Control Planes feature of Upbound
---

Managed control planes (MCPs) are Crossplane control plane environments that are fully managed by Upbound. Upbound manages:

- the underlying lifecycle of infrastructure hosting the MCP
- scaling of the infrastructure
- the maintenance of the core Crossplane components that make up a managed control plane. 

This lets users focus on building their APIs and operating their control planes, while Upbound handles the rest. Each managed control plane has its own dedicated API server connecting users to their MCP.

## Architecture

Users running open source Crossplane may face scalability limitations when attempting to create control planes that can manage lots of resources. Kubernetes clusters running Crossplane install hundreds or thousands of Kubernetes Custom Resource Definitions (`CRD`s) increasing the CPU and memory requirements of the Kubernetes API server. 

{{<hint "tip" >}}
The [Upbound blog](https://blog.upbound.io/scaling-kubernetes-to-thousands-of-crds/) describes the technical details of these limitations and some of the work Upbound has contributed to the Kubernetes project to improve performance. 
{{< /hint >}}

With Upbound managed control planes, these limitations don't apply. MCPs scale to >1000 CRDs without a performance degradation. Upbound has complete control over the lifecycle management of a control plane. Upbound ensures that the control plane is right-sized and given the appropriate memory and CPU for the required CRDs. 

{{<img src="concepts/images/mcp-arch.png" alt="an architecture of XP with Upbound" size="large" quality="100" lightbox="true">}}

## Versioning

MCPs use Upbound [Universal Crossplane (UXP)]({{<ref "uxp" >}}), Upbound's enterprise-grade open source distribution of Crossplane. Upbound fully manages the UXP installation. Whenever Upbound releases a new version of UXP, Upbound automatically upgrade your MCP to the latest version.

{{< hint "important">}}
Alpha features of Crossplane aren't enabled by default in Upbound.
{{< /hint >}}

## MCP management

### Create an MCP

You can create a new managed control plane from the Upbound Console or the `up` CLI. To use the CLI, run the following, specifying which configuration to install on the control plane and what the name should be.

```shell 
up ctp create --configuration-name=<configuration> <name-of-control-plane>
```

To learn more about control plane-related commands in `up`, go to the [CLI reference]({{<ref "cli/command-reference#controlplane-create" >}}) documentation.

### Connect directly to your MCP

All managed control planes have a deterministic Kubernetes API server endpoint
in the following form:

```
https://proxy.upbound.io/v1/controlPlanes/<account>/<control-plane-name>/k8s
```

Generate a `kubeconfig` file for a managed control plane
with the following [up CLI command]({{<ref "cli/command-reference#controlplane-kubeconfig-get" >}}).

```shell
up ctp kubeconfig get -a <account> <control-plane-name> -f <kubeconfig-file> --token <token>
```

{{< hint "tip" >}}
The `up` CLI uses personal access tokens to authenticate to Upbound. You can [generate a personal access token]({{<ref "concepts/console#create-a-personal-access-token-pat" >}}) from the Upbound Console.
{{< /hint >}}

### Configure Crossplane providers on your MCP

#### ProviderConfigs with OpenID Connect

Use OpenID Connect (`OIDC`) to authenticate to Upbound managed control planes without credentials. OIDC lets your managed control plane exchange short-lived tokens directly with your cloud provider. To learn how to configure a Crossplane Provider on managed control plane to use Upbound's OIDC, read the [Knowledge Base]({{<ref "knowledge-base/oidc.md" >}}) documentation.

#### Generic ProviderConfigs

The Upbound Console can't edit ProviderConfigs. To edit ProviderConfigs on your managed control plane, connect to the MCP directly by following the previous instructions on [connecting directly to an MCP]({{<ref "concepts/managed-control-planes#connect-directly-to-your-mcp" >}}). 

## Control plane backups

Upbound automatically captures snapshots of an MCP state every 24 hours. These backups aren't directly available to users. Contact [Upbound Support](mailto:support@upbound.io) to restore a backup.
