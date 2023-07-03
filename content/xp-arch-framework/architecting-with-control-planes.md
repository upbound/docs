---
title: "Architecting with Control Planes"
weight: 3
description: "A guide for how to build with control planes"
---

Crossplane is a framework that gives users the ability to create their own Kubernetes-style APIs without needing to write code. When a user creates an instance of Crossplane and installs their custom APIs on it, we call this a `control plane` because the user now has an entity by which they can perform controlling actions--creating, reading, updating, or deleting resources exposed by their APIs.

How you choose to architect a solution on Crossplane varies wildly depending on your business goals, platform requirements, where you want to offer services powered by Crossplane, and more. The architectures described in this guide provide a minimum recommended baseline for how to build a solution on Crossplane and integrate it with a set of common 3rd-party integrations. 

## Baseline Control Plane Architecture

This reference architecture provides a recommended baseline to deploy a single Crossplane control plane. This architecture isn't focused on a workload or role to be served by the control plane, rather it concentrates on the control plane itself. The information here is the minimum recommended baseline for most Crossplane control planes.

{{< hint "note" >}}
💡 An implementation of this architecture is available on GitHub: <link to a configuration on Marketplace>. You can use it as a starting point and are encouraged to tweak it according to your needs.
{{< /hint >}}

### Diagram 

{{<img src="xp-arch-framework/images/baseline-arch.png" alt="Baseline architecture for a single Crossplane control plane" size="medium" quality="100" align="center">}}

### Configure compute for hosting Crossplane

Because Crossplane is built on the foundation of Kubernetes, you need a Kubernetes cluster to install Crossplane into. 

Crossplane providers create new Kubernetes APIs to represent external cloud APIs. These APIs are Kubernetes Custom Resource Definitions (CRDs). Crossplane providers are the implementation and delivery vehicle for these CRDs. Crossplane providers vary in the number of CRDs they define; some only define a few, while others may define hundreds. With consideration to large Crossplane providers, installing many CRDs creates significant CPU and memory pressure on the API Server of your control plane. Therefore, failure to size the Kubernetes control plane nodes can lead to API timeouts or control plane pods, including UXP, to restart or fail.

In managed Kubernetes environments such as AWS EKS or GCP GKE, you don’t control the Kubernetes control plane nodes. As a result, each managed Kubernetes provider handles the resource needs of Upbound providers differently.

<What is the specific configuration recommendation? How many nodes in a node pool, how big of nodes?>

### Configure your control plane’s API

Once you have Crossplane installed into a Kubernetes cluster, you need to configure it to expose the APIs you want. You do this by installing Crossplane providers, configurations, and your own compositions. Read the [building APIs](./building-apis.md) portion of the framework for guidance on building custom APIs with Crossplane.

While control planes can be configured by applying these objects directly using `kubectl`, we recommend as a best practice using a single git repo as the source of truth to hold the entire definition of your control plane's configuration. This allows you to use a GitOps tool such as Flux or ArgoCD to continuously apply the latest definition of your control plane configuration.

### Tenant Isolation

Many users create control planes that have multiple consumers. Suppose you are building a platform that has 10 teams who will use your control plane to create resources. In this example, each consuming team is a "tenant". It is security best practice to avoid showing information of other teams and isolation each team 

In this baseline single control plane architecture, if you want to isolate tenants, you must use Kubernetes namespaces.

### Add secrets management

Secrets in Kubernetes are objects that hold sensitive data like passwords, tokens and keys. Crossplane uses Secrets to store sensitive information, such as credentials for Crossplane providers, inputs to managed resources, or connection details. If you do not configure Crossplane to use an external secrets store, these secrets will be written to a namespace in a control plane. Just as with Kubernetes, reliance on in-cluster secrets are not considered a best practice. Therefore, our architecture baseline recommends configuring your control plane to use an external secrets store.

{{< hint "note" >}}
💡 External secret store feature support was introduced as an alpha feature in XP v1.17 and later. Our archicture's recommendation assumes you are running this version of Crossplane or later.
{{< /hint >}}

### Authentication & Authorization

Most enterprise users have a central Identity Provider they use to federate their org’s access to cloud resources. Most cloud providers’ Kubernetes identity integrations allow them to integrate their roles with Kubernetes-native RBAC.

### Add policy engines

An effective way to manage Crossplane is to enforce governance through policies. Any Kubernetes-compatible policy engine–-such as [Open Policy Agent](https://github.com/open-policy-agent/opa) or [Kyverno](https://github.com/kyverno/kyverno)–-can be installed into Crossplane. This allows users to write custom policies to enforce against Crossplane resources. 

When setting policies, apply them based on the requirements of the control plane. Do you want to Audit or Deny the action? In Audit mode, the action is allowed but it's flagged as Non-Compliant. Have processes to check non-compliant states at a regular cadence and take necessary action. In Deny mode, the action is blocked because it violates the policy. Be careful in choosing this mode because it can be too restrictive for the workload to function.

Don't apply custom policies directly to the control plane. These policies are part of your control plane’s total configuration and should instead be defined in your control plane’s git repo source of truth (recommended earlier) and administered control plane that way. To learn more about creating custom policies, see [Create and assign custom policy definitions]().

### Consume control plane APIs

Your control plane’s API can be consumed in a variety of ways. For users who are building an Internal Developer Platform (IDP), they typically have UI-based form experiences to collect information that needs to be passed over to a control plane to action upon. Other users may want to have ServiceNow be their frontend interface. If you read and follow [the guide]() for building custom APIs, this means you need to create Crossplane claims on the control plane.

The baseline architecture recommends designating a git repo to be the source for all Crossplane claims that should exist on a control plane. Similar to configuring the definition for your control plane’s configuration, this pattern allows you to use GitOps tools like ArgoCD or Flux to continuously sync the resources that are desired from your control plane. For this architecture to function properly, the interfaces to your control plane need to be able to create Crossplane claim .yamls and submit it to the repos being monitored by your GitOps tooling.

To learn more about integrating frontend interfaces to your control plane, see [frontend integrations]().

### Monitor and collect metrics

Crossplane is capable of emitting Prometheus metrics, so users can install Prometheus to sit alongside Crossplane and configure it to scrape metrics for the core Crossplane component and provider pods. Users can integrate these metrics with Grafana to visualize metrics, logs, and alerts. 

There’s a lot of missing knowledge in the community for how to interpret these metrics, though. Same goes for debugging issues in Crossplane.

### Business continuity

To maintain business continuity, define the Service Level Agreement for your control plane. An effective tool to help you achieve your SLAs is through Velero. Velero allows users to capture and backup the state of their infrastructure’s configuration on their control plane. In a disaster scenario–such as if the control plane were to go offline–users can provision a new instance of Crossplane and restore the last known state up to the time of the most recent backup. 

To learn more about using Velero to achieve disaster recovery, read [backup and restore control planes with Velero].

## Control Planes at Scale Architecture

This reference architecture provides a recommended baseline to deploy many Crossplane control planes. This architecture isn't focused on a workload or role to be served by the control plane, rather it concentrates on the control plane itself. The information here is the minimum recommended baseline for most Crossplane control planes.

This reference architecture provides a recommended baseline to deploy many Crossplane control planes.  When users choose to adopt a control plane architecture that involves multiple control planes, those control planes usually have specialized roles. There are two things that need to be considered when running many control planes:

1. What are the boundaries that cause you to specialize a control plane's purpose?
2. How do you bootstrap and manage the infrastructure that supports each control plane? 

If your requirements lead you to needing more than a few control planes to power your platform, we recommend a hub-and-spoke architecture: use a central (hub) control plane whose job is to create specialized control planes (spokes). This pattern is also sometimes called “control plane of control planes”.

Just like the baseline single control plane architecture, your solution must be influenced by your business requirements, and as a result it can vary depending on what you are trying to achieve. It should be considered as your starting point for pre-production and production stages.

{{< hint "note" >}}
💡 An implementation of this architecture is available on GitHub: <link to a configuration on Marketplace>. You can use it as a starting point and are encouraged to tweak it according to your needs.
{{< /hint >}}

### Diagram 

{{<img src="xp-arch-framework/images/cp-of-cp-arch.png" alt="Control Plane of Control Planes Architecture" size="medium" quality="100" align="center">}}

### Specialized control planes

When we say “specialized control plane”, we mean your platform is composed of several control planes, each having a specialized role to serve (as opposed to having a single control plane that manages everything). How you choose to specialize control planes will vary depending on your business requirements. Here are some common ones:

- [Cross-cloud requirements](#specialize-control-planes-by-cloud)
- [Isolation requirements](#specialize-control-planes-by-tenant)
- [Cross-environment requirements](#specialize-control-planes-by-environment)
- [Cloud account segmentation](#specialize-control-planes-by-cloud-account)

#### Configuration

For each individual control plane, this architecture applies the same recommendations as what you can find in the [baseline single control plane architecture](#baseline-control-plane-architecture). The difference is that once you have your hub control plane created, you can use it to declaratively create all ensuing specialized control planes.

#### Specialize control planes by environment

This approach means you create a control plane on a per software environment basis. For users who follow software development best practices and deploy their software across non-prod and prod environments, we recommend deploying an instance of Crossplane for each of your environments (dev, staging, prod, etc). Each control plane has a specialized responsibility to only manage resources in its designated environment.

#### Specialize control planes by Cloud

This approach means you create a control plane on a per hyperscale cloud provider basis. For example, if you needed your platform to operate in both AWS and Azure, you would create two control planes:

- a control plane whose responsibility is for handling AWS-related resources
- a control plane whose responsibility is for handling Azure-related resources

#### Specialize control planes by Cloud Account

This approach means you create a control plane on per cloud account basis. Crossplane is able to communicate with external APIs only after a Crossplane provider has been installed in the control plane. Crossplane providers themselves rely on `ProviderConfig` objects to configure & provide authentication details for how to interact with the external service. It is possible for a single control plane to have multiple ProviderConfigs--each configured to point to a single cloud account--and use that to provision resources across multiple accounts.

However, it is possible to specialize control planes and configure them so they can only talk to resources associated with a single cloud account.

#### Specialize control planes by Tenant