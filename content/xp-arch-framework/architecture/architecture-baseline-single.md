---
title: "Single Control Plane Architecture"
weight: 11
description: "A guide for how to build with control planes"
---

This reference architecture provides a recommended baseline scoped to deploying a single Crossplane control plane. This architecture isn't focused on a workload or specific role for the control plane, rather it concentrates on the control plane itself. The information below is the recommended baseline for most Crossplane control planes.

{{< hint "note" >}}
💡 An implementation of this architecture is coming soon! You will be able to use it as a starting point and will be encouraged to tweak it according to your needs.
{{< /hint >}}

## Diagram 

{{<img src="xp-arch-framework/images/baseline-arch.png" alt="Baseline architecture for a single Crossplane control plane" size="large" unBlur="true" align="center">}}

## Configure compute for hosting Crossplane

Because Crossplane builds on the foundation of Kubernetes, you need a Kubernetes cluster to install Crossplane into. 

Crossplane providers create new Kubernetes APIs to represent external cloud APIs. These APIs are Kubernetes Custom Resource Definitions (CRDs). Crossplane providers are the implementation and delivery vehicle for these CRDs. Crossplane providers vary in the number of CRDs they define; some only define a ten, while others may define hundreds. With consideration to large Crossplane providers, installing a lot of CRDs creates significant CPU and memory pressure on the API Server of your control plane. Failure to size the Kubernetes control plane nodes can lead to API timeouts or control plane pods, including UXP, to restart or fail.

{{< hint "tip" >}}
With [provider families](https://blog.crossplane.io/crd-scaling-provider-families/) supported starting in Crossplane v1.12 and [Upbound Official Provider Families](https://blog.upbound.io/new-provider-families) released, we strongly recommend users adopt these providers. They help you avoid installing CRDs that you don't need on your control plane and mitigates concerns about Crossplane being CRD-hungry.
{{< /hint >}}

### Managed Kubernetes clusters

In managed Kubernetes environments such as AWS EKS or GCP GKE, you don't control the Kubernetes control plane nodes. As a result, each managed Kubernetes provider handles the resource needs of Upbound providers differently. 

#### Amazon Elastic Kubernetes Service

Amazon Elastic Kubernetes Service (EKS) doesn't require any configuration when running Upbound providers. Amazon automatically scales control plane node without any required changes.

#### Google Kubernetes Engine

Google Kubernetes Engine (GKE) sizes their control plane nodes based on the total number of nodes deployed in a cluster. Testing by Upbound finds that GKE clusters configured with at least 20 nodes don't have issues.

Smaller clusters take at least 40 minutes to stabilize. During this time the Kubernetes API server may be unavailable to handle new requests.

#### Microsoft Azure Kubernetes Service

Microsoft Azure Kubernetes Service (AKS) doesn't require any configuration when running Upbound providers. Microsoft automatically scales control plane node without any required changes.

### Self-hosted Kubernetes clusters

If you deploy Crossplane on a self-hosted Kubernetes cluster, you have control over the resource allocations. You can right-size the nodes where your Kubernetes cluster control plane runs.

#### Memory usage considerations

the number of CRDs installed by the providers determines the resource requirements. Each CRD installed requires about 4 MB of memory in the control plane pod. For example, the Upbound [provider-aws-ec2](https://marketplace.upbound.io/providers/upbound/provider-aws-ec2/latest) installs 98 CRDs. The calculation is the following:

```bash
num_of_managed_resources x 4MB = Crossplane memory requirements

# Example for provider-aws v0.34.0
98 x 4MB = 392 MB
```

The preceding calculation is the amount of memory you should give to the node _on top of_ the normal amount you plan to give.

{{< hint "tip" >}} Use the same calculations when installing multiple providers. {{< /hint >}}

#### CPU usage considerations

The CPU impact of UXP depends on:

- the number of Crossplane resources
- the number of resources changing (reconciling)
- how fast Crossplane updates resources on changes.

Crossplane resources include claims, composite resources and managed resources. UXP consumes CPU cycles when periodically checking the status of each resource. When changes occur, UXP aggressively checks the status of the changed resources to make them `READY` as soon as possible.

The UXP pod and individual providers offer configuration options to reduce CPU load, at the cost of slower startup and recovery times.

{{< hint "important" >}} Upbound recommends at least four to eight CPU cores, depending on the provider. Reference the provider's documentation for specific recommendations. {{< /hint >}}

## Configure your control plane

Upbound recommends using a Git repository hosted on a version control service as the single source of truth. The Git repository should contain the definition for your control plane's configuration. In this repository, you should put all configurations applicable to your control plane. At a high level, you can think about the configuration of your control plane as boiling down to:

- your platform API
- resource claims against those APIs
- integrations, and the configuration of those integrations
- runtime configuration, such as ProviderConfigs or EnvironmentConfigs

The section below covers what it means to configure each of these. It also covers what "integrations" mean in the context of your control plane. It provides suggestions for structuring your repository source of truth.

### Configure API definition 

The first thing you should configure on your control plane is its API. You do this by installing Crossplane [providers](https://docs.crossplane.io/master/concepts/providers/), [configurations](https://docs.crossplane.io/master/concepts/packages/#configuration-packages), and your own user-defined [compositions](https://docs.crossplane.io/master/concepts/composition/). 

{{< hint "note" >}}
Read the [building APIs]({{< ref "xp-arch-framework/building-apis" >}})  portion of the framework for guidance on building custom APIs with Crossplane.
{{< /hint >}}

By using a Git repository as the single source of truth for a control plane, it gives you a single point of control. Then, you can use a GitOps tool such as Flux or ArgoCD to continuously apply the latest definition of your control plane configuration. Furthermore, it's recommended you use a "root" Crossplane configuration to encapsulate:

- your APIs.
- dependencies on other Crossplane configurations.
- dependencies on Crossplane providers.

### Add secrets management

Secrets in Kubernetes are objects that hold sensitive data like passwords, tokens and keys. Crossplane uses Secrets to store sensitive information, such as credentials for Crossplane providers, inputs to managed resources, or connection details. 

By default, Crossplane writes managed resource-generated secrets (such as when you configure the object to use `writeConnectionSecretToRef: ...`), in the cluster. Most organizations have security requirements that recommend storing all secrets in a centrally managed secret management service. Reliance on in-cluster secrets aren't considered a best practice. The architecture baseline recommends configuring your control plane to use an external secrets store.

For a complete guide to integrating secrets management in your control plane, see the [Interface Integrations > Secrets Management]({{< ref "xp-arch-framework/interface-integrations/secrets-management.md" >}}) topic in this framework.

### Add policy engines

An effective way to supplement Crossplane is to enforce governance through policies. Any Kubernetes-compatible policy engine, such as [Open Policy Agent Gatekeeper](https://github.com/open-policy-agent/gatekeeper) or [Kyverno](https://github.com/kyverno/kyverno), is compatible with Crossplane. This allows users to write custom policies to enforce against Crossplane resources. 
Policy engines have some overlap of its capabilities relative to what you define with Crossplane's compositions capability. For a complete guide to integrating policies in your control plane, see the [Interface Integrations > Policy Engines]({{< ref "xp-arch-framework/interface-integrations/policy-engines.md" >}}) topic in this framework.

{{< hint "note" >}}
Crossplane supports integration with policy engines, but policy engines are not required to use Crossplane. If you are unsure whether you need to integrate a policy engine with your control plan, you can always start out by _not_ having a policy engine and add one later once it makes sense. Read the interface integration guide above to see how a policy engine can add value.
{{< /hint >}}

### Watch and collect metrics

Crossplane is configurable to emit Prometheus metrics at install-time. Users can install Prometheus to sit alongside Crossplane and configure it to scrape metrics for the core Crossplane component and provider pods. Users can integrate these metrics with a dashboard solution such as Datadog, Grafana or New Relic to visualize metrics, logs, and alerts. 

For a complete guide to monitoring and observability in your control plane see the [Interface Integrations > Monitoring and Observability]({{< ref "xp-arch-framework/interface-integrations/monitoring-and-observability.md" >}}) topic in this framework.

### Platform continuity

To maintain platform continuity, define the Service Level Agreement for your control plane. An effective tool to help you achieve your control plane's SLA commitment is with [Velero](https://velero.io/). Velero allows users to capture and backup the state of their infrastructure's configuration on their control plane. In a disaster scenario—such as if the control plane were to go offline—users can provision a new instance of Crossplane. Then, restore the last known state up to the time of the most recent backup. 

For a complete guide to disaster recovery for your control plane see the [Platform Continuity]({{< ref "xp-arch-framework/interface-integrations/platform-continuity.md" >}}) topic in this framework.

{{< hint "note" >}}
A loss of the control plane does not take infrastructure offline, but it will block infrastructure management operations. In the event of a controlplane outage, the cloud provider continues to operate infra while control plane DR is carried out.
{{< /hint >}}

### Repository structure

The preceding section explains which integrations you may want to consider with Crossplane. Given those, the recommended structure for your repository containing your control plane's configuration is:

```bash
.
├── platform-api/ # Your root configuration is defined.
│   └── configuration.yaml
├── claims/ # All claims against your APIs.
│   ├── claim-team1-db.yaml
│   └── claim-team2-bucket.yaml
├── integrations/ # Each integration's configuration is defined in its own folder.
│   ├── secretstore/ # Declare external secret stores.
│   │   ├── vault-keystore.yaml
│   │   └── azure-keyvault.yaml
│   ├── policies/ # Whatever policies you define.
│   │   ├── no-public-bucket-access.yaml
│   │   └── prod-compute-size.yaml
│   └── velero/ # Configure your control plane's backup schedule.
│       ├── hourly-schedule.yaml
│       ├── daily-schedule.yaml
│       └── weekly-schedule.yaml
└── runtime/ # ProviderConfigs, EnvironmentConfigs, etc.
    ├── providerconf-aws-account1.yaml
    ├── providerconf-aws-account2.yaml
    └── providerconf-azure-sub1.yaml
```

## Tenancy on your control plane

Most users want to create control planes that have multiple consumers. Suppose you are building a platform that has 10 teams using your control plane to create resources. In this example, each consuming team is a "tenant." The Kubernetes documentation on [multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) does a thorough job covering this topic for Kubernetes. The section below explains how it maps to Crossplane specifically.

Sharing control planes can save cost and simplify administrative overhead. But, much like a shared Kubernetes cluster, shared control planes introduce security and performance considerations that need evaluation.

{{< hint "tip" >}}
Best Practice: If you have security requirements to ensure certain teams are only able to create resources in certain cloud accounts, we strongly recommend adopting a [multi-control plane architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md" >}})  that segments teams to their own control planes. Discrete control planes will always be a stronger isolation boundary than namespaces.
{{< /hint >}}

Are you comfortable with tenants on a control plane being able to have read-only visibility of other tenants' resources? If so, you should feel confident using Kubernetes' and Crossplane's built-in tenancy capabilities.

{{< table "table table-sm" >}}
| Crossplane concept | Scope |
| ---- | ---- |
| Claim | namespace |
| Managed Resource | cluster |
| Composite Resource | cluster |
| Providers | cluster | 
| ProviderConfig | cluster |
{{< /table >}}

### Control plane APIs

In Crossplane, Composite Resources are always cluster-scoped. While you _can_ limit whether a Composite Resource is claimable, this only limits the ability for tenants in a namespace to create a resource. If a composite resource is claimable, then _all_ tenants across all namespaces can create resource claims against that composite resource. It's impossible in Crossplane to install APIs for only some teams using your control plane. But you can use Kubernetes [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) to restrict access to a specific API for target groups, users, or service accounts within a given namespace.

### Managed Resources are cluster-scoped

In Crossplane, Managed Resources are also cluster-scoped. It's recommended you don't expose managed resources to your consumer teams. Instead, you should always use claimable composite resources. Managed resources tell your Crossplane provider which `ProviderConfig` to use to resolve requests. If you give users RBAC to manage the managed resource objects directly, you are giving them the ability to use any credentials to do so. 

### ProviderConfigs are cluster-scoped

A Crossplane provider's `ProviderConfig` is a cluster-scoped resource. Suppose you have `ProviderConfig-team-A` and `ProviderConfig-team-B` on a control plane, each associated with different cloud accounts. It's conceivable that teams in different namespaces could create resource requests using ProviderConfigs they're not supposed to by accident. This can happen if you gave them RBAC over managed resources directly. It could happen if you create a field in your XRD that allows users to request a certain ProviderConfig directly.

## Consume control plane APIs

You can consume your control plane's API in a variety of ways. For users who are building an Internal Developer Platform (IDP), this typically involves having a UI-based form experience. The form collects information to send along to a control plane to act upon. The information collected by the form needs to translate to Crossplane claims on your control plane.

The baseline architecture recommends designating a Git repository to be the source for all Crossplane claims that should exist on a control plane. This pattern allows you to use GitOps tools like ArgoCD or Flux to continuously sync the desired resources from your control plane. It's the same approach to configuring the definition for your control plane's configuration. To achieve this, the interfaces to your control plane need to be able to create Crossplane claim files. Then, it must submit the files to the repositories watched by your GitOps tooling.

For a complete guide to integrating frontend interfaces with your control plane see the [Interface Integrations > Platform Frontends]({{< ref "xp-arch-framework/interface-integrations/platform-frontends.md" >}}) topic in this framework.

## Control plane causality dilemma

If a user wants to use Crossplane to drive their entire platform, that means you need _some_ control plane by which to drive your platform. It's commonly referred to as the "chicken or the egg." Who makes the first control plane? You can create your first control plane (from which you can then provision everything else) in four ways:

1. Use a solution such as [Upbound](https://upbound.io/product/upbound), which provides a service (an API) by which you can request your first control plane.
2. Bootstrap a local Crossplane environment, such as Crossplane installed on [KinD](https://github.com/kubernetes-sigs/kind), configured so you can create your first cloud control plane in your desired hyper scale cloud provider. Once the control plane provisions, you can spin down your local Crossplane environment.
3. Use an IaC tool like Terraform to do the initial bootstrap of your first cloud control plane.
4. Use any other tool to do the initial bootstrap of your first cloud control plane.

## Next steps

You may want to understand when its appropriate to consider running more than one control plane. Read [Architecture > Multi-Control Planes]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md" >}}) to learn about what [circumstances]({{< ref "xp-arch-framework/architecture/architecture-baseline-multi.md#specialized-spoke-control-planes" >}}) it's recommended you use a multi-control plane architecture.
