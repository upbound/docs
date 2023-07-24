---
title: "Single Control Plane Architecture"
weight: 11
description: "A guide for how to build with control planes"
---

This reference architecture provides a recommended baseline scoped to deploying a single Crossplane control plane. This architecture isn't focused on a workload or role to be served by the control plane, rather it concentrates on the control plane itself. The information here is the minimum recommended baseline for most Crossplane control planes.

{{< hint "note" >}}
💡 An implementation of this architecture is coming soon! You will be able to use it as a starting point and will be encouraged to tweak it according to your needs.
{{< /hint >}}

## Diagram 

{{<img src="xp-arch-framework/images/baseline-arch.png" alt="Baseline architecture for a single Crossplane control plane" size="medium" quality="100" align="center">}}

## Configure compute for hosting Crossplane

Because Crossplane is built on the foundation of Kubernetes, you need a Kubernetes cluster to install Crossplane into. 

Crossplane providers create new Kubernetes APIs to represent external cloud APIs. These APIs are Kubernetes Custom Resource Definitions (CRDs). Crossplane providers are the implementation and delivery vehicle for these CRDs. Crossplane providers vary in terms of the number of CRDs they define; some only define a few, while others may define hundreds. With consideration to large Crossplane providers, installing many CRDs creates significant CPU and memory pressure on the API Server of your control plane. Therefore, failure to size the Kubernetes control plane nodes can lead to API timeouts or control plane pods, including UXP, to restart or fail.

### Managed Kubernetes clusters

In managed Kubernetes environments such as AWS EKS or GCP GKE, you don’t control the Kubernetes control plane nodes. As a result, each managed Kubernetes provider handles the resource needs of Upbound providers differently. 

#### Amazon Elastic Kubernetes Service

Amazon Elastic Kubernetes Service (EKS) doesn't require any configuration when running Upbound providers. Amazon automatically scales control plane node without any required changes.

#### Google Kubernetes Engine

Google Kubernetes Engine (GKE) sizes their control plane nodes based on the total number of nodes deployed in a cluster. Testing by Upbound finds that GKE clusters configured with at least 20 nodes don't have issues.

Smaller clusters take at least 40 minutes to stabilize. During this time the Kubernetes API server may be unavailable to handle new requests.

#### Microsoft Azure Kubernetes Service

Microsoft Azure Kubernetes Service (AKS) doesn't require any configuration when running Upbound providers. Microsoft automatically scales control plane node without any required changes.

### Self-hosted Kubernetes clusters

When deploying UXP on a self-hosted Kubernetes cluster, you have control over the resource allocations to the nodes where your Kubernetes cluster control plane runs.

#### Memory usage considerations

the number of CRDs installed by the providers determines the resource requirements. Each CRD installed requires about 4 MB of memory in the control plane pod. For example, Provider AWS version v0.34.0 installs 901 CRDs. The calculation is the following:

```bash
num_of_managed_resources x 4MB = Crossplane memory requirements

# Example for provider-aws v0.34.0
901 x 4MB = 3604 MB or 3.51 GB
```

This is the amount of memory you should allocate to the node _in addition to_ the normal amount of memory you plan to allocate to your node.

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

Upbound recommends using a git repo hosted on a version control service as the single source of truth containing the definition for your control plane's configuration. In this repo, you will place all configurations applicable to your control plane. At a high level, you can think about the configuration of your control plane as boiling down to:

- your platform API
- resource claims against those APIs
- integrations, and the configuration of those integrations
- runtime configuration, such as ProviderConfigs or EnvironmentConfigs

We will first cover what it means to configure each of these, what "integrations" mean in the context of your control plane, and finally we'll suggest how to structure your repo source of truth.

### Configure API definition 

The first thing you should configure on your control plane is its API. You do this by installing Crossplane [providers](https://docs.crossplane.io/v1.12/concepts/providers/), [configurations](https://docs.crossplane.io/v1.12/concepts/packages/#configuration-packages), and your own user-defined [compositions](https://docs.crossplane.io/v1.12/concepts/composition/). 

{{< hint "note" >}}
Read the [building APIs](../../building-apis) portion of the framework for guidance on building custom APIs with Crossplane.
{{< /hint >}}

By using a git repo as the single source of truth for a control plane, it gives you a single point of control. Then, you can use a GitOps tool such as Flux or ArgoCD to continuously apply the latest definition of your control plane configuration. Furthermore, we recommend using a "root" Crossplane configuration to encapsulate your APIs, depndencies on other Crossplane configurations, and dependencies on Crossplane providers.

### Add secrets management

Secrets in Kubernetes are objects that hold sensitive data like passwords, tokens and keys. Crossplane uses Secrets to store sensitive information, such as credentials for Crossplane providers, inputs to managed resources, or connection details. 

If you do not configure Crossplane to use an external secrets store, when you configure a managed resource to write a secret (such as when you configure the object to use `writeConnectionSecretToRef: ...`), that secret gets written in the control plane. Most organizations have security requirements that recommend storing all secrets in a centrally managed key-value store (such as Vault, AWS Secrets Manager, etc); reliance on in-cluster secrets are not considered a best practice. Therefore, our architecture baseline recommends configuring your control plane to use an external secrets store.

For a complete guide to integrating secrets management in your control plane, see the [Interface Integrations > Secrets Management](/xp-arch-framework/interface-integrations/secrets-management) topic in this framework.

### Add policy engines

An effective way to supplement Crossplane is to enforce governance through policies. Any Kubernetes-compatible policy engine–-such as [Open Policy Agent Gatekeeper](https://github.com/open-policy-agent/gatekeeper) or [Kyverno](https://github.com/kyverno/kyverno)–-can be used with Crossplane. This allows users to write custom policies to enforce against Crossplane resources. 

There is some overlap in terms of what you can implement and achieve by using a policy engine vs what you define with Crossplane's compositions capability. For a complete guide to integrating policies in your control plane, see the [Interface Integrations > Policy Engines](/xp-arch-framework/interface-integrations/policy-engines) topic in this framework.

{{< hint "note" >}}
If you are unsure whether you need to integrate a policy engine with your control plan, you can always start out by _not_ having a policy engine and add one later once it makes sense. We do explain in the guide on interface integrations how you can use policies to supplement what you can do out-of-the-box with Crossplane compositions (since there is some overlap).
{{< /hint >}}

### Monitor and collect metrics

Crossplane can be configured to emit Prometheus metrics at install-time, so users can install Prometheus to sit alongside Crossplane and configure it to scrape metrics for the core Crossplane component and provider pods. Users can integrate these metrics with Grafana or other dashboarding solutions to visualize metrics, logs, and alerts. 

For a complete guide to monitoring & observability in your control plane see the [Interface Integrations > Monitoring & Observability](/xp-arch-framework/interface-integrations/monitoring-and-observability) topic in this framework.

### Platform continuity

To maintain platform continuity, define the Service Level Agreement for your control plane. An effective tool to help you achieve your control plane's SLA commitment is with [Velero](https://velero.io/). Velero allows users to capture and backup the state of their infrastructure’s configuration on their control plane. In a disaster scenario–such as if the control plane were to go offline–users can provision a new instance of Crossplane and restore the last known state up to the time of the most recent backup. 

For a complete guide to monitoring & observability in your control plane see the [Platform Continuity](/xp-arch-framework/interface-integrations/platform-continuity) topic in this framework.

### Repository Structure

Given the above explanation of which integrations you should consider using with your control plane, we recommend you structure the repo defining your control plane's configuration as follows:

```bash
.
├── platform-api/ # Your root configuration is defined here
│   └── configuration.yaml
├── claims/ # All claims against your APIs go here
│   ├── claim-team1-db.yaml
│   └── claim-team2-bucket.yaml
├── integrations/ # Each integration's configuration is defined in its own folder
│   ├── secretstore/ # Declare external secret stores here
│   │   ├── vault-keystore.yaml
│   │   └── azure-keyvault.yaml
│   ├── policies/ # Whatever policies you define go here
│   │   ├── no-public-bucket-access.yaml
│   │   └── prod-compute-size.yaml
│   └── velero/ # Configure your control plane's backup schedule
│       ├── hourly-schedule.yaml
│       ├── daily-schedule.yaml
│       └── weekly-schedule.yaml
└── runtime/ # ProviderConfigs, EnvironmentConfigs, etc go here
    ├── providerconf-aws-account1.yaml
    ├── providerconf-aws-account2.yaml
    └── providerconf-azure-sub1.yaml
```

## Tenancy on your control plane

Many users create control planes that have multiple consumers. Suppose you are building a platform that has 10 teams who will use your control plane to create resources. In this example, each consuming team is a "tenant". The Kubernetes documentation on [multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) does a thorough job covering this topic for Kubernetes generally. We will cover how it maps to Crossplane specifically.

Sharing control planes can save cost and simplify administrative overhead. However, much like a shared Kubernetes cluster, shared control planes introduce security and performance considerations that need to  be carefully evaluated.

{{< hint "tip" >}}
Best Practice: If you have security requirements to ensure certain teams are only able to create resources in certain cloud accounts, we strongly recommend adopting a [multi-control plane architecture](../architecture-baseline-multi) that segments teams to their own control planes. Discrete control planes will always be a stronger isolation boundary than namespaces.
{{< /hint >}}

If you are comfortable with tenants on a control plane being able to have read-only visibility of other tenants' resources, you should feel confident using Kubernetes' and Crossplane's built-in tenancy capabilities.

{{< table "table table-sm" >}}
| Crossplane concept | Scope |
| ---- | ---- |
| Claim | namespace |
| Managed Resource | cluster |
| Composite Resource | cluster |
| Providers | cluster | 
| ProviderConfig | cluster |
{{< /table >}}

### Control Plane APIs

In Crossplane, Composite Resources are always cluster-scoped. While you _can_ limit whether a Composite Resource is claimable, this only limits the ability for tenants in a namespace to create a resource. If a composite resource is claimable, then _all_ tenants across all namespaces can create resource claims against that composite resource. It's not possible in Crossplane to install APIs for only some teams using your control plane. 

### Managed Resources are cluster-scoped

In Crossplane, Managed Resources are also cluster-scoped. While we recommend against exposing managed resources to your consumer teams (instead, you should always use claimable composite resources), if you give users RBAC to manage the managed resource objects directly, you are giving them the ability to use any credentials to do so (since managed resources tell your Crossplane provider which `ProviderConfig` to use to resolve requests).

### ProviderConfigs are cluster-scoped

A Crossplane provider's `ProviderConfig` is a cluster-scoped resource. That means if you have `ProviderConfig-team-A` and `ProviderConfig-team-B` on a control plane--each associated with different cloud accounts--, it is conceivable that teams in different namespaces could inadvertantly create resource requests using ProviderConfigs they're not supposed to (whether if you gave them RBAC over managed resources directly or you create a field in your XRD that allows users to request a certain ProviderConfig directly).

## Consume control plane APIs

Your control plane’s API can be consumed in a variety of ways. For users who are building an Internal Developer Platform (IDP), this typically involves having a UI-based form experiences to collect information to send along to a control plane to action upon. If you read and follow the instructions for [building APIs with compositions](/xp-arch-framework/building-apis/building-apis-compositions). this means you need to create Crossplane claims on the control plane.

While you could directly create claims on your control plane via it's API server, this baseline architecture recommends designating a git repo to be the source for all Crossplane claims that should exist on a control plane. Similar to configuring the definition for your control plane’s configuration, this pattern allows you to use GitOps tools like ArgoCD or Flux to continuously sync the resources that are desired from your control plane. For this architecture to function properly, the interfaces to your control plane need to be able to create Crossplane claim .yamls and submit it to the repos being monitored by your GitOps tooling.

For a complete guide to integrating frontend interfaces with your control plane see the [Interface Integrations > Platform Frontends](/xp-arch-framework/interface-integrations/platform-frontends) topic in this framework.

## Control plane causality dilemma

Commonly referred to as the "chicken or the egg", if a user wants to use Crossplane to drive their entire platform, that means you need _some_ control plane by which to drive your platform. But who makes the first control plane? There are three ways you can create a first control plane (from which you can then provision everything else):

1. Use a solution such as [Upbound](https://upbound.io/product/upbound), which provides a service (an API) by which you can request your first control plane.
2. Bootstrap a local Crossplane environment, such as Crossplane installed on [KinD](https://github.com/kubernetes-sigs/kind), configured so you can create your first cloud control plane in your desired hyperscale cloud provider. Once the cloud control plane has been provisioned, you can spin down your local Crossplane environment.
3. Use an IaC tool like Terraform to do the initial bootstrap of your first cloud control plane.

## Next Steps

Now that we've explained the baseline architecture recommendation for a single control plane, you may want to understand when its appropriate to consider running more than one control plane. Read [Architecture > Multi-Control Planes](../architecture-baseline-multi) to learn about what [circumstances](../architecture-baseline-multi#specialized-spoke-control-planes) we recommend using a multi-control plane architecture.
