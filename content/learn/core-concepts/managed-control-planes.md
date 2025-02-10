---
title: Managed Control Planes
weight: 2
description: Fully isolated Crossplane control plane instances that Upbound manages for you
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

Every managed control plane in Upbound belongs to a [control plane group]({{<ref "groups" >}}). Control plane groups are a logical grouping of one or more control planes with shared objects (such as secrets or backup configuration). Every group resides in a [Space]({{<ref "deploy" >}}) in Upbound, which are hosting environments for managed control planes.

Think of a Space as being conceptually the same as an AWS, Azure, or GCP region. Regardless of the Space type you run a managed control plane in, the core experience is identical.


