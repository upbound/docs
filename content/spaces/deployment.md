---
title: Deployment
weight: 900
description: A guide for deploying an Upbound Space in production
---

Upbound recommends devoting a Kubernetes cluster to run a Spaces deployment. You can install Spaces into any Kubernetes cluster, version v1.25 or later. Upbound validates the Spaces software runs on [AWS EKS](https://aws.amazon.com/eks/), [Google Cloud GKE](https://cloud.google.com/kubernetes-engine), and [Microsoft AKS](https://azure.microsoft.com/en-us/products/kubernetes-service).

## Deployment requirements

Spaces requires three things:

1. A Kubernetes cluster.
2. You've configured the Kubernetes cluster with the required prerequisites.
3. You must have an [Upbound account](https://www.upbound.io/register/a). Spaces is a feature only available for paying customers in the **Business Critical** tier of Upbound.

This guide helps you think through all steps needed to deploy Spaces for production workloads.

## Sizing a Space

In a Space, the managed control planes you create get scheduled as pods across the cluster's node pools. The hyper scale cloud providers all offer managed Kubernetes services that can support hundreds of nodes. The number of control planes you can run in a single Space is on the order hundreds--if not more.

Rightsizing a Space for a production deployment depends on several factors:

1. The number of control planes you plan to run in the Space.
2. The number of managed resources you plan each control plane to reconcile.
3. The Crossplane providers you plan to install in each control plane.

### Memory considerations

#### Control plane empty state memory usage

An idle, empty managed control plane consumes about 640 MB of memory. This encompasses the 13 or so pods that constitute a managed control plane. 

#### Managed resource memory usage

In Upbound's testing, memory usage isn't influenced by the number of managed resources under management by a control plane. Memory usage is flat in this regard. Whether you are managing 100 MRs or 1000 MRs, you don't need to account for an increase in memory usage on this axis. 

#### Provider memory usage

When you install Crossplane providers on a control plane, memory gets consumed according to the number of custom resources it defines. Upbound [Official Provider families]({{<ref "providers/provider-families.md" >}}) provide finer-grained controls to platform teams to install providers for only the resources they need, reducing bloat of needlessly installing unused custom resources. Still, you must factor provider memory usage into your calculations to ensure you've rightsized your the memory available in your Spaces cluster. 

Upbound's analysis estimates each custom resource definition consumes ~3 MB of memory. The calculation is:

```bash
number_of_managed_resources_in_provider x 3 MB = memory_required
```

For example, if you plan to use [provider-aws-ec2](https://marketplace.upbound.io/providers/upbound/provider-aws-ec2), [provider-aws-s3](https://marketplace.upbound.io/providers/upbound/provider-aws-s3), and [provider-aws-iam](https://marketplace.upbound.io/providers/upbound/provider-aws-iam), the resulting calculation is:

```bash
98 x 3 MB = 294 MB
23 x 3 MB = 69 MB
22 x 3 MB = 66 MB
---
429 MB
```

You would want to set aside ~430 MB of memory for provider usage on this control plane. Do this calculation for each provider you plan to install on your control plane.

#### Total memory usage

Add the memory usage from the previous sections. Given the preceding examples, they result in a recommendation to budget ~1 GB memory for each control plane you plan to run in the Space.

{{< hint "important" >}}
The 1 GB number mentioned above is derived from the numbers used in the examples above. You should input your own provider requirements to arrive at a final number.
{{< /hint >}}

### CPU considerations

#### Managed resource CPU usage

You must be mindful of the number of managed resources you plan a control plane to manage. This number is the first and most important variable you must consider when rightsizing your Space for CPU.

{{< hint "important" >}}
Be careful not to conflate `managed resource` with `custom resource definition`. The former is an "instance" of an external resource in Crossplane, while the latter defines the API schema of that resource.
{{< /hint >}}

CPU usage scales linearly according to the number of managed resources under management by your control plane. In Upbound's testing, CPU usage requirements _does_ vary from provider to provider. Specifically:

{{< table >}}
| Provider | MR create operation (CPU core seconds) | MR update operation (CPU core seconds) |
| ---- | ---- | ---- | 
| provider-aws | 10 | 2 to 3 | 
| provider-gcp | 7 | 1.5 | 
| provider-azure | 7 to 10 | 1.5 to 3 | 
{{< /table >}}

By default, each Crossplane provider uses a 10 minute poll interval. A 16 core machine has `16x10x60 =  9600` CPU core seconds available. Since `provider-aws` has the highest recorded numbers, you can use that as a high bar in your calculations.

A single control plane that needs to create 100 MRs concurrently would consume 1000 CPU core seconds, or about 1.5 cores. A single control plane that continuously reconciles 100 MRs would consume 300 CPU core seconds, or a little under half a core.

Using these calculations and extrapolating values, given a 16 core machine, it's recommended you don't exceed a single control plane managing 1000 MRs. Suppose you plan to run 10 control planes, each managing 1000 MRs. You want to make sure your node pool has capacity for 160 cores. 

#### Cloud API latency

Oftentimes, you are using Crossplane providers to talk to external cloud APIs. Those external cloud APIs often have global API rate limits (examples: [Azure limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/request-limits-and-throttling), [AWS EC2 limits](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/throttling.html#throttling-limits-rate-based)).

For Crossplane providers built on [Upjet](https://github.com/upbound/upjet) (such as Upbound Official Provider families), these providers use Terraform under the covers. They expose some knobs (such as `--max-reconcile-rate`) you can use to tweak reconciliation rates, described in more detail in the [Upjet sizing guide](https://github.com/upbound/upjet/blob/main/docs/sizing-guide.md)

## Deploying more than one Space

You are welcome to deploy more than one Space. You just need to make sure you have a 1:1 mapping of Space to Kubernetes clusters. Spaces are by their nature constrained to a single Kubernetes Cluster, which are regional entities. If you want to offer managed control planes in multiple cloud environments or multiple public clouds entirely, these are justifications for deploying >1 Spaces.