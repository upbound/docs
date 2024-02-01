---
title: Deploy a Space locally
weight: 1
description: A guide for deploying an Upbound Space locally in kind
---

Get started with Upbound Spaces on a local machine.

## Prerequisites

This quickstart requires:

- You have installed [kind](https://kind.sigs.k8s.io/).
- You have installed the [up]({{<ref "reference/cli/">}}) CLI.
- An Upbound Account string, provided by your Upbound account representative
- A license token in the form of a `token.json`, provided by your Upbound account representative

Running Spaces on a local machine can be resource-intensive. It's recommended you set aside at least `8GB` of memory to the hosting environment of your kind cluster. To calculate how much Space your local machine needs, plan `4GB` of memory per control plane. For example: 4 control planes in a local kind cluster should run in an environment with `16GB` allocated to it.

{{< hint "important" >}}
Upbound Spaces is a paid feature of Upbound and requires a license token to successfully complete the installation. Contact Upbound if you want to try out Spaces. 
{{< /hint >}}

## Provision the hosting environment

### Create a kind cluster
Provision a new kind cluster.

```yaml
cat <<EOF | kind create cluster --wait 5m --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  image: kindest/node:v1.27.3@sha256:3966ac761ae0136263ffdb6cfd4db23ef8a83cba8a463690e98317add2c9ba72
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

{{< hint "tip" >}}
Make sure you provision your kind cluster with the `ingress-ready=true` node label as above. The Space installation flow requires it.
{{< /hint >}}

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
export SPACES_VERSION=1.2.0
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

After you install a Space, `up` sets the current profile to a context pointing at your Space. Use the `up` CLI to create a managed control plane. 

```bash
up ctp create controlplane1
```

The first managed control plane you create in a Space takes around 5 minutes to get into a `condition=READY` state. 


{{< hint "tip" >}}
Check the status of your control plane by running `up ctp list`
{{< /hint >}}

## Connect to your managed control plane

You can connect directly to your new control plane with the `up ctp connect` command. This commands adds an entry to your kubeconfig and sets it to the current context.

```bash
up ctp connect controlplane1
```

You can now query information directly from your new control plane.

```bash
kubectl get crds
```