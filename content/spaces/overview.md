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

The boundary of a single Upbound Space is within the confines of a single Kubernetes cluster. Spaces are regional hosting environments within a single cloud provider. You are allowed to deploy multiple Spaces (as long as each Space deploys in its own cluster). Upbound recommends deploying a Space for each region and cloud provider you want to operate managed control planes in.

## Spaces management

### Create a Space

To install an Upbound Space into a cluster, it's recommended you dedicate an entire Kubernetes cluster for the Space. Use [up space init]({{<ref "reference/cli/command-reference.md#space-init">}}) to install an Upbound Space. This command attempts an install into the current cluster context of your kubeconfig.

```bash
up space init "v1.0.0"
```

You can also install the helm chart for Spaces directly. In order for a Spaces install to succeed, you must install some prerequisites first and configure them. This includes:

- UXP
- provider-helm and provider-kubernetes
- cert-manager

Furthermore, the Spaces chart requires a pull secret, which Upbound must provide to you.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "v1.0.0" \
  --set "ingress.host=your-host.com" \
  --set "clusterType=eks" \
  --set "account=your-upbound-account" \
  --wait
```

For a complete tutorial of the helm install, read one of the [quickstarts]({{<ref "spaces/quickstart/aws-deploy.md#with-helm">}}) which covers the step-by-step process.

### Upgrade a Space

To upgrade a Space from one version to the next, use [up space upgrade]({{<ref "reference/cli/command-reference.md#space-upgrade">}}). Spaces supports upgrading from version `ver x.N.*` to version `ver x.N+1.*`.

```bash
up space upgrade "v1.0.0"
```

### Downgrade a Space

To rollback a Space from one version to the previous, use [up space upgrade]({{<ref "reference/cli/command-reference.md#space-upgrade">}}). Spaces supports downgrading from version `ver x.N.*` to version `ver x.N-1.*`.

```bash
up space upgrade --rollback
```

### Uninstall a Space

To uninstall a Space from a Kubernetes cluster, use [up space destory]({{<ref "reference/cli/command-reference.md#space-destroy">}}). A destroy operation uninstalls core components and orphans control planes and their associated resources.

```bash
up space destroy
```

## Next steps

Get started with Spaces in your own environment by visiting the quickstart:

- [Deploy on AWS]({{<ref "spaces/quickstart/aws-deploy.md">}})
- [Deploy on Azure]({{<ref "spaces/quickstart/azure-deploy.md">}})
- [Deploy on GCP]({{<ref "spaces/quickstart/gcp-deploy.md">}})
- [Deploy on a local kind cluster]({{<ref "spaces/quickstart/kind-deploy.md">}})