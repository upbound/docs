---
title: Managed Control Planes
weight: 3
description: An introduction to the Managed Control Planes feature of Upbound
---

Managed control planes (MCPs) are Crossplane control plane environments that are fully managed by Upbound. Upbound manages:

- the underlying lifecycle of infrastructure hosting the managed control plane
- scaling of the infrastructure
- the maintenance of the core Crossplane components that make up a managed control plane. 

This lets users focus on building their APIs and operating their control planes, while Upbound handles the rest. Each managed control plane has its own dedicated API server connecting users to their control plane.

## Architecture

Users running open source Crossplane may face scalability limitations when attempting to create control planes that can manage lots of resources. Kubernetes clusters running Crossplane install hundreds or thousands of Kubernetes Custom Resource Definitions (`CRD`s) increasing the CPU and memory requirements of the Kubernetes API server. 

{{<hint "tip" >}}
The [Upbound blog](https://blog.upbound.io/scaling-kubernetes-to-thousands-of-crds/) describes the technical details of these limitations and some of the work Upbound has contributed to the Kubernetes project to improve performance. 
{{< /hint >}}

With Upbound managed control planes, these limitations don't apply. Managed control planes scale to >1000 CRDs without any performance degradation. Upbound has complete control over the lifecycle management of a control plane. Upbound ensures that the control plane is right-sized and given the appropriate memory and CPU for the required CRDs. 

{{<img src="concepts/images/mcp-arch.png" alt="an architecture of XP with Upbound" size="large" quality="100" lightbox="true">}}

## Crossplane versioning

Managed control planes use Upbound [Universal Crossplane (UXP)]({{<ref "uxp" >}}), Upbound's enterprise-grade open source distribution of Crossplane. Upbound fully manages the UXP installation. Whenever Upbound releases a new version of UXP, Upbound automatically upgrade your MCP to the latest version.

{{< hint "important">}}
Alpha features of Crossplane aren't enabled by default in Upbound.
{{< /hint >}}

## MCP management

### Create an MCP

You can create a new managed control plane from the Upbound Console, [up CLI]({{<ref "reference/cli/command-reference#controlplane-create" >}}), or [provider-upbound](https://marketplace.upbound.io/providers/upbound/provider-upbound/latest). 

{{< tabs >}}

{{< tab "up CLI" >}}
To use the CLI, run the following, specifying which configuration to install on the control plane and what the name should be.

```shell 
up ctp create --configuration-name=<configuration> <name-of-control-plane>
```

To learn more about control plane-related commands in `up`, go to the [CLI reference]({{<ref "reference/cli/command-reference#controlplane-create" >}}) documentation.
{{< /tab >}}

{{< tab "provider-upbound" >}}
You can declaratively create managed control planes in Upbound with provider-upbound. Provider-upbound is a Crossplane provider for interacting with the Upbound SaaS APIs. As with any Crossplane provider, you need to have:

- installed the provider on a control plane. This can be a managed control plane or a control plane running outside of Upbound. 
- created a valid ProviderConfig

Create a managed control plane by creating the following resource:

```yaml
#controlplane-a.yaml
apiVersion: mcp.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: controlplane-a
spec:
  forProvider:
    configuration: your-config
    description: controlplane-a
    organizationName: your-organization
```

You need to specify your organization name and a valid configuration that you created prior in Upbound. Apply it to the management control plane where you installed provider-upbound:

```bash
kubectl apply -f controlplane-a.yaml
```

{{< hint "tip" >}}
For more details on how to use provider-upbound, read the [provider-upbound](https://marketplace.upbound.io/providers/upbound/provider-upbound/latest) page on the Marketplace.
{{< /hint >}}

{{< /tab >}}

{{< /tabs >}}

### Connect directly to your MCP

All managed control planes have a deterministic Kubernetes API server endpoint
in the following form:

```
https://proxy.upbound.io/v1/controlPlanes/<upbound-org-account-name>/<control-plane-name>/k8s
```

You can connect to a managed control plane directly in a couple ways. Use the [up CLI command]({{<ref "reference/cli/command-reference#controlplane-connect" >}}) to set your kubeconfig's current context to a managed control plane:

```shell
up ctp connect <control-plane-name> --token=<api-token>
```

The token required for this command is an API token. The `up` CLI uses personal access tokens to authenticate to Upbound. You can [generate a personal access token]({{<ref "concepts/console#create-a-personal-access-token" >}}) from the Upbound Console. To disconnect from your control plane and revert your kubeconfig's current context to the previous entry, run the following:

```shell
up ctp disconnect
```

You can also generate a `kubeconfig` file for a managed control plane with the following [up CLI command]({{<ref "reference/cli/command-reference#controlplane-kubeconfig-get" >}}). Make sure to login to the `up` CLI before you execute the command.

```shell
up ctp kubeconfig get -a <upbound-org-account-name> <control-plane-name> -f <kubeconfig-file> --token=<api-token>
```

Like `up ctp connect`, this command also requires an API token, which you can [generate from the Upbound console]({{<ref "concepts/console#create-a-personal-access-token" >}}).

{{< hint "warning" >}} The token you provide _must_ be an API token, not a robot token. If you receive an error like `up: error: kubeconfig.getCmd.Run(): the server could not find the requested resource`, this indicates you provided an incorrect token. {{< /hint >}}

### Configure Crossplane providers on your MCP

#### ProviderConfigs with OpenID Connect

Use OpenID Connect (`OIDC`) to authenticate to Upbound managed control planes without credentials. OIDC lets your managed control plane exchange short-lived tokens directly with your cloud provider. Read how to [connect managed control planes to external services]({{<ref "concepts/mcp/oidc.md" >}}) to learn more.

#### Generic ProviderConfigs

The Upbound Console doesn't allow direct editing of ProviderConfigs that don't offer `Upbound` authentication. To edit these ProviderConfigs on your managed control plane, connect to the MCP directly by following the instructions in the [previous section]({{<ref "concepts/mcp/_index.md#connect-directly-to-your-mcp" >}}). 

## Control plane backups

Upbound automatically captures snapshots of an MCP state every 24 hours. These backups aren't directly available to users. Contact [Upbound Support](mailto:support@upbound.io) to restore a backup.
