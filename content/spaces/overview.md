---
title: Overview
weight: 1
description: A guide to Upbound Spaces
aliases: 
  - /concepts/upbound-spaces
---

Upbound Spaces are self-hosted environments for Upbound's managed Crossplane control planes. All that's required to bootstrap a Space is a Kubernetes cluster. Popular managed Kubernetes services including Amazon EKS, Google GKE, and Microsoft AKS are fully supported. 

## Spaces and Upbound

Think of an Upbound Space as a self-managed slice of the Upbound platform in your own environment. Whether that's a hyper scale cloud provider or on-prem, Spaces supplements Upbound's SaaS service by enabling a new deployment option. Now you can have control planes that run in your preferred hosting environment and Upbound's own SaaS. 

{{<img src="spaces/images/mcps-everywhere.png" alt="Managed control planes can run anywhere, thanks to Spaces" quality="100" lightbox="true">}}

Spaces lets you:

- Increase scale and cost efficiency by running 50 or more control planes per Kubernetes Cluster instead of just 1.
- Each control plane configuration is fully managed from Git.
- Integrate with Kubernetes ecosystem tooling to manage the full lifecycle of the control planes.

## Next steps

Get started with Spaces in your own environment by visiting the quickstart:

- [Deploy on AWS]({{<ref "spaces/quickstart/aws-deploy.md">}})
- [Deploy on Azure]({{<ref "spaces/quickstart/azure-deploy.md">}})
- [Deploy on GCP]({{<ref "spaces/quickstart/gcp-deploy.md">}})
- [Deploy on a local kind cluster]({{<ref "spaces/quickstart/kind-deploy.md">}})