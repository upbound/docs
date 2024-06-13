---
title: Local Quickstart
weight: 1
description: A  quickstart guide for Upbound Spaces
aliases:
    - /spaces/kind-quickstart
    - /kind-quickstart
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster with a local `kind` cluster.

Disconnected Spaces allows you to host managed control planes in your preferred environment.

## Prerequisites

To get started deploying your own Disconnected Space, you need:

- An Upbound Account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- `kind` installed locally

{{< hint "important" >}}
Disconnected Spaces are a business critical feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Upbound with Disconnected Spaces.
{{< /hint >}}

## Provision the hosting environment

Upbound Spaces requires a cloud Kubernetes or `kind` cluster as a hosting environment. For your first time set up or a development environment, Upbound recommends starting with a `kind` cluster.

### Create a cluster

Provision a new kind cluster.

```yaml
cat <<EOF | kind create cluster --wait 5m --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```

## Configure the pre-install

### Set your Upbound organization account details

Set your Upbound organization account string as an environment variable for use in future steps

{{< editCode >}}
```ini
export UPBOUND_ACCOUNT=$@<your-upbound-org>$@
```
{{< /editCode >}}

### Set up pre-install configurations

Export the path of the license token JSON file provided by your Upbound account representative.

{{< editCode >}}
```ini {copy-lines="2"}
# Change the path to where you saved the token.
export SPACES_TOKEN_PATH="$@/path/to/token.json$@"
```
{{< /editCode >}}

Set the version of the Spaces software you want to install.

```ini
export SPACES_VERSION=1.4.0
```
<!-- vale off -->
## Install the Spaces software
<!-- vale on -->

The [up CLI]({{<ref "reference/cli/">}}) gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward. The up CLI introduced Spaces-related commands in `v0.19.0`. Make sure you use this version or newer.

{{< hint "tip" >}}
Make sure your kubectl context is set to the cluster you want to install the Spaces software into.
{{< /hint >}}

Install the Spaces software.

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}"
```

You are ready to [create your first managed control plane](#create-your-first-managed-control-plane) in your Space.

## Create your first managed control plane

With your kubeconfig pointed at the Kubernetes cluster where you installed the Upbound Space, create a managed control plane:

```shell
up ctp create controlplane1
```

The first managed control plane you create in a Space takes around 5 minutes to get into a `condition=READY` state. To report the control plane status, use the following command:

```shell
up ctp list
```

## Connect to your managed control plane

Connect to your managed control plane with the `up ctx` command. With your kubeconfig still pointed at the Kubernetes cluster where you installed the Upbound Space, run the following:

```bash
up ctx default/ctp1
```

This command updates your current kubecontext. You're now connected to your managed control plane directly. Confirm this is the case by trying to list the CRDs in your managed control plane:

```bash
kubectl get crds
```

To disconnect from your managed control plane and switch back to your previous context:

```bash
up ctx -
```

{{< hint "tip" >}}
Learn how to use the up CLI to navigate around Upbound by reading the [up ctx command reference]({{<ref "reference/cli/command-reference#alpha-ctx">}}).
{{< /hint >}}