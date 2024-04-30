---
title: "What is Upbound?"
weight: -1
description: "Create your first Upbound Managed Control Plane and connect it to your cloud provider."
---

Upbound is the a scalable and fully automated Crossplane service. Organizations can use Upbound's control plane to build consistent and dependable cloud infrastructure abstractions.

Upbound leverages a managed implementation of Crossplane's open source control plane framework.

## When to use Upbound

If your organization needs a cloud infrastructure platform to manage your environments, cloud, accounts, and cloud service providers, Upbound can deliver.

With Upbound, you can use the operational power of Crossplane without managing your own control planes. Upbound manages the underlying components for you, giving you more time to focus on your deployments.

## Benefits

The following table describes some benefits of using Upbound as your managed Crossplane platform:

|                              |                                                                                                                                                                                                                                                                     |   |   |   |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|---|---|
| Platform management          | Fully-managed infrastructure. Managed upgrade experience with release channels to improve security, reliability, and compliance. Automatic scaling of Crossplane based on the number of CRDs in the control plane. Single-tenant and multi-tenant deployment modes. |   |   |   |
| Improved security posture    | Built-in security measures. Automatic upgrades to new Crossplane versions. Built-in logging and monitoring.                                                                                                                                                         |   |   |   |
| Cost optimization            | Pay only for loop usage, not hosting infrastructure costs. Minimized operational overhead because Upbound manages the core aspects of Crossplane.                                                                                                                   |   |   |   |
| Reliability and availability | >99% monthly uptime `SLO`. Highly available control planes                                                                                                                                                                                                            |   |   |   |

### When to use Upbound

Organizations in finance, automotive, retail, healthcare, and more trust Upbound to manage their platforms. Some examples of these workflows are:

- [Internal Developer Portals](https://www.upbound.io/solutions/internal-developer-platform)
- [Cloud Native infrastructure management](https://www.upbound.io/solutions/cloud-native-infrastructure-management)
- Customized cloud service-as-a-service, such as Kubernetes [cluster-as-a-service](https://www.upbound.io/solutions/cluster-as-a-service) or [database-as-a-service](https://www.upbound.io/solutions/dbaas)

## How Upbound works

<!-- vale Upbound.Spelling = NO -->
An Upbound organization contains groups of control planes called managed control planes (MCPs). These MCPs are fully isolated virtual Crossplane instances treated as an entity within the organization. You configure MCPs with the Crossplane API to deploy your Crossplane Configurations with Crossplane Providers(AWS, Splunk, etc.). Crossplane lets you create infrastructure abstractions called Composite Resource Definitions (XRDs) and compositions and deploy them to your MCPs. The Crossplane API with the MCP communicates with your infrastructure abstractions to administer, operate, and monitor your infrastructure.
<!-- vale Upbound.Spelling = YES -->


Crossplane control planes run a set of pods for the Crossplane system components as well as each provider and composition function you deploy. Upbound manages the system components for you with automatic component upgrades, high availability, and data integrity in the control plane's persistent storage volume.

For more information, refer to [Managed Control Plane Architecture](https://docs.google.com/document/d/1ls7oILQvh4JWOXyLYZL52CsCcl5VgneG83I4byJkWiM/edit#heading=h.2fgx68fu1z4b).

Control plane groups run in a Space, which are hosting environments in Upbound. Upbound offers both Upbound-managed multi-tenant Cloud Spaces or self-deployed Connected Spaces in your own infrastructure.

For more information, refer to [Upbound Architecture](https://docs.google.com/document/d/1ls7oILQvh4JWOXyLYZL52CsCcl5VgneG83I4byJkWiM/edit#heading=h.b3whfjack6gs).

### Crossplane versions and features

Upbound automatically upgrades Crossplane system components on MCPs to new Crossplane versions for updated features and improvements in the open source project. Auto upgrades choose the stable version in your chosen UXP release channel when you create the MCP. You can also choose to manually upgrade your control plane to a different Crossplane version. For detailed information on versions and upgrades, refer to the release notes and Upbound's versioning and upgrades documentation. If you don't enroll in an MCP release channel, Upbound doesn't apply automatic upgrades.

## Managed control plane architecture

![Managed control plane architecture](/content/images/mcp.png)

Along with underlying infrastructure, Upbound manages the Crossplane system components. You don't need to manage the Crossplane API server or core resource controllers because Upbound manages your MCP lifecycle from creation to deletion.

### Crossplane API

Each MCP offers a unified endpoint. You interact with your MCP through Kubernetes and Crossplane API calls. Each MCP runs a Kubernetes API server to handle API requests. You can make API calls in the following ways:

- Direct calls: HTTP/gRPC
- Indirect calls: the up CLI, Kubernetes clients such as kubectl, or the Upbound Console.

Like in Kubernetes, the API server is the hub for all communication for the MCP. All internal components such as system processes and provider controllers act as clients of the API server.

Your API requests tell Crossplane your desired state for the resources your MCP manages. Crossplane attempts to constantly maintain that state. Crossplane lets you configure objects in the API either imperatively or declaratively.

## Upbound architecture

![Upbound architecture](/content/images/up.png)

Upbound includes a Global Console, with complementary API and CLI, that operates over two types of Spaces: Cloud Spaces and Connected Spaces.

### Cloud spaces

Cloud Spaces are multi-tenant deployments of Upbound, operated inside the Upbound cloud environments. With Cloud Spaces, Upbound fully manages your MCPs as well as the hosting infrastructure, persistent storage, and backup and restore operations.

Upbound's Cloud Spaces give you a ready-to-go managed Crossplane experience. Upbound hosts Cloud Spaces in multiple cloud service providers which gives you a flexible, fully managed SaaS experience wherever you need to run Crossplane.

### Connected spaces

A Connected Space is a single-tenant deployment of Upbound within your infrastructure, like AWS or Azure. With Connected Spaces, you can use the same Console, CLI, and API that Upbound offers, with the benefit of running entirely on your own infrastructure.

<!-- vale write-good.TooWordy = no -->
The Upbound Helm chart packages the settings you need to deploy and operate MCPs in your own infrastructure. You can control the aspects of your deployment with enhanced support and additional security guarantees.
<!-- vale write-good.TooWordy = YES -->

Connected Spaces goes beyond an on-prem control plane deployment. With Connected Spaces, you get access to the experts on the Upbound team as you build a fully managed and custom Crossplane solution. The Upbound team is on-call for your control plane needs.

### Upbound API

Upbound offers a unified endpoint. You interact with Upbound through API calls, and you can make API calls in the following ways:

- Direct calls: HTTP/gRPC
- Indirect calls: the Upbound Console or the up CLI
