---
title: Managed Control Planes
weight: 1
description: An introduction to the Managed Control Planes feature of Upbound
aliases:
    - concepts/mcp
---

Managed control planes (MCPs) are fully isolated Crossplane control plane instances that Upbound manages for you. This means:

- the underlying lifecycle of infrastructure (compute, memory, and storage) required to power your instance.
- scaling of the infrastructure,
- the maintenance of the core Crossplane components that make up a managed control plane.

This lets users focus on building their APIs and operating their control planes, while Upbound handles the rest. Each managed control plane has its own dedicated API server connecting users to their control plane.

## Managed control plane architecture

{{<img src="images/mcp.png" alt="Managed Control Plane Architecture" align="center" size="small" unBlur="true" >}}

Along with underlying infrastructure, Upbound manages the Crossplane system components. You don't need to manage the Crossplane API server or core resource controllers because Upbound manages your MCP lifecycle from creation to deletion.

### Crossplane API

Each MCP offers a unified endpoint. You interact with your MCP through Kubernetes and Crossplane API calls. Each MCP runs a Kubernetes API server to handle API requests. You can make API calls in the following ways:

- Direct calls: HTTP/gRPC
- Indirect calls: the up CLI, Kubernetes clients such as kubectl, or the Upbound Console.

Like in Kubernetes, the API server is the hub for all communication for the MCP. All internal components such as system processes and provider controllers act as clients of the API server.

Your API requests tell Crossplane your desired state for the resources your MCP manages. Crossplane attempts to constantly maintain that state. Crossplane lets you configure objects in the API either imperatively or declaratively.

### Crossplane versions and features

Upbound automatically upgrades Crossplane system components on MCPs to new Crossplane versions for updated features and improvements in the open source project. With [automatic upgrades]({{<ref "auto-upgrade" >}}), you choose the cadence that Upbound automatically upgrades the system components in your control plane. You can also choose to manually upgrade your control plane to a different Crossplane version. 

For detailed information on versions and upgrades, refer to the [release notes](https://github.com/upbound/universal-crossplane/releases) and the automatic upgrade documentation. If you don't enroll an MCP in a release channel, Upbound doesn't apply automatic upgrades.

Features considered "alpha" in Crossplane are by default not supported in a managed control plane unless otherwise specified.

### Hosting environments

Every managed control plane in Upbound belongs to a [control plane group]({{<ref "groups" >}}). Control plane groups are a logical grouping of one or more control planes with shared objects (such as secrets or backup configuration). Every group resides in a [Space]({{<ref "all-spaces" >}}) in Upbound, which are hosting environments for managed control planes.

Think of a Space as being conceptually the same as an AWS, Azure, or GCP region. Regardless of the Space type you run a managed control plane in, the core experience is identical.

## Management

### Create an MCP

You can create a new managed control plane from the Upbound Console, [up CLI]({{<ref "reference/cli/command-reference#controlplane-create" >}}), or [provider-upbound](https://marketplace.upbound.io/providers/upbound/provider-upbound/latest).

{{< tabs >}}

{{< tab "up CLI" >}}
To use the CLI, run the following:

```shell
up ctp create <name-of-control-plane>
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

Each MCP offers a unified endpoint. You interact with your MCP through Kubernetes and Crossplane API calls. Each MCP runs a Kubernetes API server to handle API requests. 

You can connect to a managed control plane's API server directly via the up CLI. Use the [`up ctx`]({{<ref "reference/cli/command-reference#alpha-ctx" >}}) command to set your kubeconfig's current context to a managed control plane:

```shell
# Example: acmeco/upbound-gcp-us-west-1/default/ctp1
up ctx ${yourOrganization}/${yourSpace}/${yourGroup}/${yourControlPlane}
```

To disconnect from your control plane and revert your kubeconfig's current context to the previous entry, run the following:

```shell
up ctx ..
```

You can also generate a `kubeconfig` file for a managed control plane with [`up ctx -f`]({{<ref "reference/cli/command-reference#alpha-ctx" >}}).

```shell
up ctx ${yourOrganization}/${yourSpace}/${yourGroup}/${yourControlPlane} -f ctp-kubeconfig.yaml
```

{{< hint "tip" >}}
To learn more about how to use `up ctx` to navigate different contexts in Upbound, read the [CLI documentation]({{<ref "reference/cli/contexts" >}}).
{{< /hint >}}

## Configuration

When you create a new managed control plane, Upbound provides you with a fully isolated instance of Crossplane. Configure your control plane by installing packages that extend its capabilities, like to create and manage the lifecycle of new types of infrastructure resources. 

You're encourage to install any available Crossplane package type (Providers, Configurations, Functions) available in the [Upbound Marketplace](https://marketplace.upbound.io) on your managed control planes.

### Install packages

Below are a couple ways to install Crossplane packages on your managed control plane.

{{< tabs >}}

{{< tab "up CLI" >}}

Use the `up` CLI to install Crossplane packages from the [Upbound Marketplace](https://marketplace.upbound.io) on your managed control planes. Connect directly to your control plane via `up ctx`. Then, to install a provider:

```shell
up ctp provider install xpkg.upbound.io/providers/provider-family-aws
```

To install a Configuration:

```shell
up ctp configuration install xpkg.upbound.io/providers/provider-family-aws
```
{{< /tab >}}
{{< tab "kubectl" >}}
You can use kubectl to directly apply any Crossplane manifest. Below is an example for installing a Crossplane provider:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    org: foo
  name: my-awesome-ctp
  namespace: default
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-my-awesome-ctp
```

{{< /tab >}}

{{< tab "Continuous Delivery Engine" >}}

For production-grade scenarios, it's recommended you configure your control plane declaratively via Git plus a Continuous Delivery (CD) Engine such as Argo. For guidance on this topic, read [GitOps with control planes]({{<ref "gitops" >}}).

{{< /tab >}}


{{< /tabs >}}

### Configure Crossplane ProviderConfigs

#### ProviderConfigs with OpenID Connect

Use OpenID Connect (`OIDC`) to authenticate to Upbound managed control planes without credentials. OIDC lets your managed control plane exchange short-lived tokens directly with your cloud provider. Read how to [connect managed control planes to external services]({{<ref "oidc" >}}) to learn more.

#### Generic ProviderConfigs

The Upbound Console doesn't allow direct editing of ProviderConfigs that don't support `Upbound` authentication. To edit these ProviderConfigs on your managed control plane, connect to the MCP directly by following the instructions in the previous section and using `kubectl`.

### Configure secrets

Upbound gives users the ability to configure the synchronization of secrets from external stores into control planes. Configure this capability at the group-level, explained in the [Spaces documentation]({{<ref "/all-spaces/disconnected-spaces/secrets-management" >}}).

### Configure backups

Upbound gives users the ability to configure backup schedules, take impromptu backups, and conduct self-service restore operations. Configure this capability at the group-level, explained in the [Spaces documentation]({{<ref "/all-spaces/disconnected-spaces/backup-and-restore" >}}).

### Configure telemetry

<!-- vale off -->
Upbound gives users the ability to configure the collection of telemetry (logs, metrics, and traces) in their managed control planes. Using Upbound's built-in [OTEL](https://otel.com) support, you can stream this data out to your preferred observability solution. Configure this capability at the group-level, explained in the [Spaces documentation]({{<ref "/all-spaces/disconnected-spaces/observability" >}}).
<!-- vale on -->
