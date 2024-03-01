---
title: Management
weight: 2
description: Common operations in Spaces
---

## Spaces management

### Create a Space

To install an Upbound Space into a cluster, it's recommended you dedicate an entire Kubernetes cluster for the Space. You can use [up space init]({{<ref "reference/cli/command-reference.md#space-init">}}) to install an Upbound Space. Below is an example:

```bash
up space init "v1.1.0"
```

{{< hint "tip" >}}
For a full guide to get started with Spaces, read one of the [quickstart]({{<ref "spaces/quickstart">}}) guides:
{{< /hint >}}

You can also install the helm chart for Spaces directly. In order for a Spaces install to succeed, you must install some prerequisites first and configure them. This includes:

- UXP
- provider-helm and provider-kubernetes
- cert-manager

Furthermore, the Spaces chart requires a pull secret, which Upbound must provide to you.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "v1.0.1" \
  --set "ingress.host=your-host.com" \
  --set "clusterType=eks" \
  --set "account=your-upbound-account" \
  --wait
```

For a complete tutorial of the helm install, read one of the [quickstarts]({{<ref "spaces/quickstart/#install-cert-manager">}}) which covers the step-by-step process.

### Upgrade a Space

To upgrade a Space from one version to the next, use [up space upgrade]({{<ref "reference/cli/command-reference.md#space-upgrade">}}). Spaces supports upgrading from version `ver x.N.*` to version `ver x.N+1.*`.

```bash
up space upgrade "v1.1.0"
```

### Downgrade a Space

To rollback a Space from one version to the previous, use [up space upgrade]({{<ref "reference/cli/command-reference.md#space-upgrade">}}). Spaces supports downgrading from version `ver x.N.*` to version `ver x.N-1.*`.

```bash
up space upgrade --rollback
```

### Uninstall a Space

To uninstall a Space from a Kubernetes cluster, use [up space destroy]({{<ref "reference/cli/command-reference.md#space-destroy">}}). A destroy operation uninstalls core components and orphans control planes and their associated resources.

```bash
up space destroy
```

## Control plane management

You can manage control planes in a Space via the [up CLI]({{<ref "reference/cli/command-reference.md#controlplane">}}) or the Spaces-local Kubernetes API. When you install a Space, it defines new a API type, `kind: Controlplane`, that you can use to create and manage control planes in the Space.

### Create a managed control plane

To create a managed control plane in a Space using `up`, run the following:

```bash
up ctp create ctp1
```

You can also declare a new managed control plane like the example below and apply it to your Spaces cluster:

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

To connect to a managed control plane in a Space using `up`, run the following:

```bash
up ctp connect new-control-plane
```

The command changes your kubeconfig's current context to the managed control plane you specify. If you want to change your kubeconfig back to a previous context, run:

```bash
up ctp disconnect
```

If you configured your managed control plane to publish connection details, you can also access it this way. Once the control plane is ready, use the secret (containing connection details) to connect to the API server of your managed control plane.

```bash
kubectl get secret <control-plane-connection-secret-name> -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/<ctp-name>.yaml
```

Reference the kubeconfig whenever you want to interact directly with the API server of the control plane (vs the Space's API server):

```bash
kubectl get providers --kubeconfig=/tmp/<ctp-name>.yaml
```

### Configure a managed control plane

Spaces offers a built-in feature that allows you to connect a control plane to a Git source. This experience is like when a managed control plane runs in [Upbound's SaaS environment]({{<ref "concepts/control-plane-configurations.md">}}). Upbound recommends using the built-in Git integration to drive configuration of your control planes in a Space.

Learn more in the [Spaces Git integration]({{<ref "spaces/git-integration.md">}}) documentation.

### List managed control planes

To list all managed control planes in a Space using `up`, run the following:

```bash
up ctp list
```

Or you can use Kubernetes-style semantics to list the control plane:

```bash
kubectl get controlplanes
```


### Delete a managed control plane

To delete a managed control plane in a Space using `up`, run the following:

```bash
up ctp delete ctp1
```

Or you can use Kubernetes-style semantics to delete the control plane:

```bash
kubectl delete controlplane ctp1
```
