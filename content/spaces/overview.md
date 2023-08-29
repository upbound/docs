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

Read the [deployment guide]({{<ref "spaces/deployment.md">}}) for comprehensive guidance for rightsizing your Space clusters.

## Upbound requirements

You must have an [Upbound account](https://www.upbound.io/register/a). Spaces is a feature only available for paying customers in the **Business Critical** tier of Upbound.

## Spaces management

### Create a Space

To install an Upbound Space into a cluster, it's recommended you dedicate an entire Kubernetes cluster for the Space. You can use [up space init]({{<ref "reference/cli/command-reference.md#space-init">}}) to install an Upbound Space. This command attempts an install into the current cluster context of your kubeconfig.

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

## Control plane management

Managing control planes in a Space works differently than it does when interacting with Upbound's SaaS service (explained in the [concepts]({{<ref "concepts/mcp/_index.md">}}) docs). The [up CLI ctp]({{<ref "reference/cli/command-reference.md#controlplane">}}) commands don't work in a Spaces context. All control plane management must happen through a Spaces-local API. When you install a Space, it defines new a API type, `kind: Controlplane`, that you can use to create and manage control planes in the Space.

### Create a control plane

To create a control plane, declare a new managed control plane like the example below:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: ctp1
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp1
    namespace: default
```

This manifest:

- Creates a new managed control plane in the space called `ctp1`.
- Publishes the kubeconfig to connect to the control plane to a secret in the Spaces cluster, called `kubeconfig-ctp1`

### Connect to a managed control plane

You need to tell the Space to publish the connection details for the control plane as indicated in the preceding section. Once the control plane is ready, you can use the contents of the secret to connect to it.

```bash
kubectl get secret kubeconfig-ctp1 -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/ctp1.yaml
```

Reference the kubeconfig whenever you want to interact directly with the API server of the control plane (vs the Space's API server):

```bash
kubectl get providers --kubeconfig=/tmp/ctp1.yaml
```

### Configure a control plane

Spaces offers a built-in feature that allows you to connect a control plane to a Git source. This experience is like when a managed control plane runs in [Upbound's SaaS environment]({{<ref "concepts/control-plane-configurations.md">}}). Upbound recommends using the built-in Git integration to drive configuration of your control planes in a Space. 

Learn more in the [Spaces Git integration]({{<ref "spaces/git-integration.md">}}) documentation.

### Delete a managed control plane

To delete a managed control plane in the Space, delete the manifest in your Spaces cluster that represents the control plane. Remember, you can get a list of control planes in your Space by issuing the following command:

```bash
kubectl get ctp
```

## Next steps

Get started with Spaces in your own environment by visiting the quickstart:

- [Deploy on AWS]({{<ref "spaces/quickstart/aws-deploy.md">}})
- [Deploy on Azure]({{<ref "spaces/quickstart/azure-deploy.md">}})
- [Deploy on GCP]({{<ref "spaces/quickstart/gcp-deploy.md">}})
- [Deploy on a local kind cluster]({{<ref "spaces/quickstart/kind-deploy.md">}})