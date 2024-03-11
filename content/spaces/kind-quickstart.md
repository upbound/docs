---
title: Local Quickstart
weight: 1
description: A  quickstart guide for Upbound Spaces
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster with a local `kind` cluster.

Upbound Spaces allows you to host managed control planes in your preferred environment.

## Prerequisites

To get started with Upbound Spaces, you need:

- An Upbound Account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- `kind` installed locally

{{< hint "important" >}}
Upbound Spaces is a paid feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Spaces.
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

Set the version of Spaces software you want to install.

```ini
export SPACES_VERSION=1.2.3
```


## Install a Space

The [up CLI]({{<ref "reference/cli/">}}) gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward. The up CLI introduced Spaces-related commands in `v0.19.0`. Make sure you use this version or newer.

{{< hint "tip" >}}
Make sure your kubectl context is set to the cluster you want to install Spaces into.
{{< /hint >}}

Install Spaces.

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

The connection details for your managed control plane should now exist in a secret. You can fetch the connection details with the following command:

```shell
up ctp connect controlplane1
```

You can use the kubeconfig to interact with your managed control plane directly:

```shell
kubectl get crds
```
