---
title: Disconnected Spaces
weight: 2
description: A guide to Upbound Spaces
---

Upbound Spaces are self-hosted environments for Upbound's managed Crossplane control planes. All that's required to bootstrap a Space is a Kubernetes cluster. Popular managed Kubernetes services including Amazon EKS, Google GKE, and Microsoft AKS are fully supported.

## Spaces and Upbound

Think of an Upbound Space as a self-managed slice of the Upbound platform in your own environment. Whether that's a hyper scale cloud provider or on-prem, Spaces supplements Upbound's SaaS service by enabling a new deployment option. Now you can have control planes that run in your preferred hosting environment and Upbound's own SaaS.

{{<img src="/spaces/images/mcps-everywhere.png" alt="Managed control planes can run anywhere, thanks to Spaces">}}

Spaces lets you:

- Increase scale and cost efficiency by running 50 or more control planes per Kubernetes Cluster instead of just 1.
- Manage each control plane configuration in source control.
- Integrate with Kubernetes ecosystem tooling to manage the full lifecycle of the control planes.

The boundary of a single Upbound Space is within the confines of a single Kubernetes cluster. Spaces are regional hosting environments within a single cloud provider. You can deploy multiple Spaces (as long as each Space deploys in its own cluster). Upbound recommends deploying a Space for each region and cloud provider you want to operate managed control planes in.

## System requirements

Spaces require a Kubernetes cluster as a hosting environment. Upbound validates the Spaces software runs on [AWS EKS](https://aws.amazon.com/eks/), [Google Cloud GKE](https://cloud.google.com/kubernetes-engine), and [Microsoft AKS](https://azure.microsoft.com/en-us/products/kubernetes-service). For dev/test scenarios, you can run a Space on a [kind](https://kind.sigs.k8s.io/) cluster. You can install Spaces into Kubernetes clusters v1.25 or later.

<!-- vale write-good.TooWordy = NO -->
### Minimum requirements

The minimum host Kubernetes cluster configuration Upbound recommends is a 2 worker node setup. By default, Upbound recommends one node for operating the Spaces management pods, leaving the remaining worker nodes to host your control planes.

The minimum recommended node pool VM configuration for each cloud provider is:

{{< table >}}
| Cloud Provider | VM configuration | Cores | Memory |
| ---- | ---- | ---- |  ---- |
| AWS | m5.large | 2 | 8 |
| Azure | Standard_D2_v3 | 2 | 8 |
| GCP | e2-standard-2 | 2 | 8 |
{{< /table >}}

<!-- vale write-good.TooWordy = YES -->

### Recommended requirements

As mentioned in the preceding section, Upbound recommends designating a node to run the Spaces management pods. How large you size your node pool depends on these factors:

- The number of control planes you plan to run in the Space.
- The number of managed resources you plan each control plane to reconcile.
- The Crossplane providers you plan to install in each control plane.

Read the [deployment guide]({{<ref "deployment.md">}}) for comprehensive guidance for rightsizing your Space clusters.

## Upbound requirements

You must have an [Upbound account](https://www.upbound.io/register/a). Spaces is a feature only available for paying customers in the **Business Critical** tier of Upbound.

## Next steps

Get started with Spaces in your own environment by visiting the quickstart guide.
