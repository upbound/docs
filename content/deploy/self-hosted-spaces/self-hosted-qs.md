aliases:
---
title: Local Quickstart
weight: 1
description: A  quickstart guide for Upbound Spaces
aliases:
    - /spaces/kind-quickstart
    - /kind-quickstart
    - /deploy/disconnected-spaces/quickstart
    - all-spaces/self-hosted-spaces/quickstart
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster with a local `kind` cluster.

Self-hosted Spaces allow you to host managed control planes in your preferred environment.

## Prerequisites

To get started deploying your own self-hosted Space, you need:

- An Upbound Account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- `kind` installed locally

{{< hint "important" >}}
Self-hosted Spaces are a business critical feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Upbound with self-hosted Spaces.
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
export SPACES_VERSION={{< spaces_version >}}
```
<!-- vale off -->
## Install the Spaces software
<!-- vale on -->

The [up CLI]({{<ref "reference/cli/">}}) gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward. This guide requires CLI version `v0.33.0` or newer.

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
up ctx ./default/controlplane1
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
Learn how to use the up CLI to navigate around Upbound by reading the [up ctx command reference]({{<ref "reference/cli/contexts">}}).
{{< /hint >}}
<!-- vale Google.Headings = NO -->
## Connect your Space to Upbound
<!-- vale Google.Headings = YES -->

[Upbound]({{<ref "console">}}) allows you to connect self-hosted Spaces and enables a streamlined operations and debugging experience in your Console.

Before you begin, make sure you have:

- An existing Upbound [organization]({{<ref "operate/accounts/identity-management/organizations.md">}}) in Upbound SaaS.
- The `up` CLI installed and logged into your organization
- `kubectl` installed with the kubecontext of your self-hosted Space cluster.
- A `token.json` license, provided by your Upbound account representative.
<!-- vale Google.Headings = NO -->
### Enable the Query API
<!-- vale Google.Headings = YES -->

Connecting a Space requires that you enable the Query API.

Upbound's Query API allows users to inspect objects and resources within their
control planes. The read-only `up alpha query` and `up alpha get` CLI commands
allow you to gather information on your control planes in a fast and efficient
package. These commands follow the [`kubectl`
conventions](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/)
for filtering, sorting, and retrieving information from your Space.

To enable,
set `features.alpha.apollo.enabled=true` and
`features.alpha.apollo.storage.postgres.create=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=true"
```

These flags create a PostgreSQL cluster handled by [CloudNativePG](https://cloudnative-pg.io).

Users can also provide their own instance if needed, by setting `features.alpha.apollo.storage.postgres.create=false` and providing all the required information at `features.alpha.apollo.storage.postgres.connection`.

<!-- vale Google.Headings = NO -->
### Connect your Space
<!-- vale Google.Headings = YES -->

Create a new `UPBOUND_SPACE_NAME`. If you don't create a name, `up` automatically generates one for you:

{{< editCode >}}
```ini
export UPBOUND_SPACE_NAME=$@your-self-hosted-space$@
```
{{< /editCode >}}

#### With up CLI

Log into Upbound SaaS with the `up` CLI. Update `<org-account>` with your
organization account name:

```shell
up login -a <org-account>
```


Connect the Space to the Console:

```bash
up space connect "${UPBOUND_SPACE_NAME}"
```

This command installs a Connect agent, creates a service account, and configures permissions in your Upbound cloud organization in the `upbound-system` namespace of your Space.

#### With Helm

Export your Upbound org account name to an environment variable called `UPBOUND_ORG_NAME`. You can see this value by running `up org list` after logging on to Upbound.

{{< editCode >}}
```ini
export UPBOUND_ORG_NAME=$@your-org-name$@
```
{{< /editCode >}}

Create a new robot token and export it to an environment variable called `UPBOUND_TOKEN`:

```bash
up robot create "${UPBOUND_SPACE_NAME}" --description="Robot used for authenticating Space '${UPBOUND_SPACE_NAME}' with Upbound Connect"
export UPBOUND_TOKEN=$(up robot token create "${UPBOUND_SPACE_NAME}" "${UPBOUND_SPACE_NAME}" --output=-| awk -F': ' '/Token:/ {print $2}')
```

Create a secret containing the robot token:

```bash
kubectl create secret -n upbound-system generic connect-token --from-literal=token=${UPBOUND_TOKEN}
```

Specify your username and password for the helm OCI registry:

{{< editCode >}}
```bash
jq -r .token $SPACES_TOKEN_PATH | helm registry login xpkg.upbound.io -u $(jq -r .accessId $SPACES_TOKEN_PATH) --password-stdin
```
{{< /editCode >}}

In the same cluster where you installed the Spaces software, install the Upbound connect agent with your token secret.

```bash
helm -n upbound-system upgrade --install agent \
  oci://xpkg.upbound.io/spaces-artifacts/agent \
  --version "0.0.0-441.g68777b9" \
  --set "image.repository=xpkg.upbound.io/spaces-artifacts/agent" \
  --set "registration.image.repository=xpkg.upbound.io/spaces-artifacts/register-init" \
  --set "imagePullSecrets[0].name=upbound-pull-secret" \
  --set "registration.enabled=true" \
  --set "space=${UPBOUND_SPACE_NAME}" \
  --set "organization=${UPBOUND_ORG_NAME}" \
  --set "tokenSecret=connect-token" \
  --wait
```

<!-- vale Google.Headings = NO -->
#### View your Space in the Console
<!-- vale Google.Headings = YES -->

Go to the [Upbound Console](https://console.upbound.io), log in, and choose the newly connected Space from the Space selector dropdown.

{{<img src="deploy/spaces/images/attached-space.png" alt="A screenshot of the Upbound Console space selector dropdown">}}

{{< hint "note" >}}
You can only connect a self-hosted Space to a single organization at a time.
{{< /hint >}}
