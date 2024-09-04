---
title: Self-Hosted Spaces
weight: 2
description: A guide to Upbound Self-Hosted Spaces
aliases:
    - /spaces
---

# Connected Spaces

[Upbound]({{<ref "console">}}) allows you to connect self-hosted Spaces and enables a streamlined operations and debugging experience in your Console.

To get a Connected Space create a Disconnected Space first as described below, then [attach]({{<ref "all-spaces/self-hosted-spaces/attach-detach">}}) it.

# Disconnected Spaces

A Disconnected Space is a single-tenant deployment of Upbound within your infrastructure. This could be your Amazon Web Services (AWS) cloud account, Microsoft Azure subscription, or other hosting environment. Disconnected Spaces don't have connectivity to the rest of the Upbound product. You're limited to a command-line interface to interact within a single Space context.

Upbound has packaged the core parts of the Upbound product into a Helm chart. You can deploy and operate it on your own infrastructure. This brings you the best of SaaS with the added benefit of extra security guarantees and a deployment free of noisy neighbors.

## System requirements

Spaces require a Kubernetes cluster as a hosting environment. Upbound validates the Spaces software runs on [AWS EKS](https://aws.amazon.com/eks/), [Google Cloud GKE](https://cloud.google.com/kubernetes-engine), and [Microsoft AKS](https://azure.microsoft.com/en-us/products/kubernetes-service). For dev/test scenarios, you can run a Space on a [kind](https://kind.sigs.k8s.io/) cluster.

{{<hint "note">}} We support installing Spaces into Kubernetes clusters running one of the 3 most recent [minor release versions](https://kubernetes.io/releases/). {{< /hint >}}


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

Get started with Spaces in your own environment by visiting the [quickstart guide]({{<ref "/quickstart.md">}}).
