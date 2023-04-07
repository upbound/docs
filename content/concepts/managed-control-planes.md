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

With Upbound managed control planes, these limitations do not apply. MCPs can easily scale to >1000 CRDs without a performance degradation. Upbound has complete control over the lifecycle management of a control plane, including ensuring that the control plane is right-sized and fed the appropriate memory and CPU to manage across all the cloud services you want it to manage.

## Versioning

MCPs are powered by Upbound [Universal Crossplane (UXP)]({{<ref "uxp" >}}), Upbound's enterprise-grade open source distribution of Crossplane. All of the machinery of UXP is fully managed by Upbound. Whenever Upbound releases a new version of UXP, Upbound will automatically upgrade your MCP to the latest version.

Alpha features of Crossplane are not enabled by default in Upbound.

## Interacting with MCPs

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

Credentials for this control plane are supplied in the form of a personal access
token (PAT). A `kubeconfig` file can be generated for any managed control plane
with the following [up CLI command]({{<ref "cli/command-reference#controlplane-kubeconfig-get" >}}).

```shell
up ctp kubeconfig get -a <account> <control-plane-name> -f <kubeconfig-file> --token <token>
```

{{< hint "tip" >}}
You can [generate a personal access token]({{<ref "concepts/console#create-a-personal-access-token-pat" >}}) from the Upbound Console.
{{< /hint >}}

### Configure Crossplane Providers on your MCP

#### ProviderConfigs with OIDC

Upbound's managed control planes can be configured to support credential-less authentication in the form of OpenID Connect. This lets your managed control plane exchange short-lived tokens directly from your cloud provider. To learn how to configure a Crossplane Provider on managed control plane to use Upbound's OIDC, read the [Knowledge Base]({{<ref "knowledge-base/oidc.md" >}}) documentation.

#### Generic ProviderConfigs

Upbound does not currently expose flows to directly modify ProviderConfigs from the Upbound Console. If you need to configure ProviderConfigs on your managed control plane, we recommend you connect directly by following the instructions [above]({{<ref "concepts/managed-control-planes#connect-directly-to-your-mcp" >}}). 

## Control plane backups

Upbound automatically captures snapshots of an MCP state every ~24 hours. These backups are not yet available for users to use directly. Once available, customers will be able to rely on these backups to mitigate disasters and enable recovery scenarios of their control plane state.

