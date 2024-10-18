---
title: "Self-hosted Architecture"
weight: 30
description: "A guide for how to build with self-hosted components in Upbound"
---


## Configure compute for hosting Crossplane

Because Crossplane is built on the foundation of Kubernetes, you need a Kubernetes cluster to install Crossplane into. 

Crossplane providers create new Kubernetes APIs to represent external cloud APIs. These APIs are Kubernetes Custom Resource Definitions (CRDs). Crossplane providers are the implementation and delivery vehicle for these CRDs. Crossplane providers vary in terms of the number of CRDs they define; some only define a few, while others may define hundreds. With consideration to large Crossplane providers, installing many CRDs creates significant CPU and memory pressure on the API Server of your control plane. Therefore, failure to size the Kubernetes control plane nodes can lead to API timeouts or control plane pods, including UXP, to restart or fail.

{{< hint "tip" >}}
With [provider families](https://blog.crossplane.io/crd-scaling-provider-families/) supported starting in Crossplane v1.12 and [Upbound Official Provider Families](https://blog.upbound.io/new-provider-families) released, we strongly recommend users adopt these providers. They help you avoid installing CRDs that you don't need on your control plane and mitigates concerns about Crossplane being CRD-hungry.
{{< /hint >}}

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

the number of CRDs installed by the providers determines the resource requirements. Each CRD installed requires about 4 MB of memory in the control plane pod. For example, the Upbound [provider-aws-ec2](https://marketplace.upbound.io/providers/upbound/provider-aws-ec2/latest) installs 98 CRDs. The calculation is the following:

```bash
num_of_managed_resources x 4MB = Crossplane memory requirements

# Example for provider-aws v0.34.0
98 x 4MB = 392 MB
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
