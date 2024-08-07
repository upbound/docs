---
title: GCP Deployment Guide
weight: 4
description: A  quickstart guide for Upbound Spaces in GCP
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster in GCP.

Disconnected Spaces allows you to host managed control planes in your preferred environment.

## Prerequisites

To get started deploying your own Disconnected Space, you need:

- An Upbound organization account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- An GCP account and the GCP CLI

{{< hint "important" >}}
Disconnected Spaces are a business critical feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Upbound with Disconnected Spaces.
{{< /hint >}}

## Provision the hosting environment

### Create a cluster

Configure the name and target region you want the GKE cluster deployed to.

```ini
export SPACES_PROJECT_NAME=upbound-spaces-project
export SPACES_CLUSTER_NAME=upbound-spaces-quickstart
export SPACES_LOCATION=us-west1-a
```

Create a new project and set it as the current project.

```bash
gcloud projects create ${SPACES_PROJECT_NAME}
gcloud config set project ${SPACES_PROJECT_NAME}
```

Provision a 3-node cluster.

```bash
gcloud container clusters create ${SPACES_CLUSTER_NAME} \
  --enable-network-policy \
  --num-nodes=3 \
  --zone=${SPACES_LOCATION} \
  --machine-type=e2-standard-4
```

Get the kubeconfig of your GKE cluster.

```bash
gcloud container clusters get-credentials ${SPACES_CLUSTER_NAME} --zone=${SPACES_LOCATION}
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
export SPACES_VERSION=1.5.0
```

Set the router host and cluster type. The `SPACES_ROUTER_HOST` is the domain name that's used to access the control plane instances. It's used by the ingress controller to route requests.

{{< editCode >}}
```ini
export SPACES_ROUTER_HOST="$@proxy.upbound-127.0.0.1.nip.io$@"
```
{{< /editCode >}}

{{< hint "important" >}}
Make sure to replace the placeholder text in `SPACES_ROUTER_HOST` and provide a real domain that you own.
{{< /hint >}}

The `SPACES_CLUSTER_TYPE` is the Kubernetes cluster provider you configured in the previous step.


```ini
export SPACES_CLUSTER_TYPE=gke
```


<!-- vale off -->
## Install the Spaces software
<!-- vale on -->

### Install cert-manager

Install cert-manager.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
kubectl wait deployment -n cert-manager cert-manager-webhook --for condition=Available=True --timeout=360s
```

### Install ingress-nginx

Install ingress-nginx.

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --wait
```

### Install UXP

Install Upbound Universal Crossplane (UXP)

```bash
helm upgrade --install crossplane universal-crossplane \
  --repo https://charts.upbound.io/stable \
  --namespace upbound-system --create-namespace \
  --version v1.15.2-up.1 \
  --set "args={--enable-usages,--max-reconcile-rate=1000}" \
  --set resourcesCrossplane.requests.cpu="500m" --set resourcesCrossplane.requests.memory="1Gi" \
  --set resourcesCrossplane.limits.cpu="1000m" --set resourcesCrossplane.limits.memory="2Gi" \
  --wait
```

<!-- vale off -->
If your company uses a proxied environment with mirrored registries, please update the specified registry to your internal registry.
<!-- vale on -->

```bash
helm upgrade --install crossplane universal-crossplane \
  --repo https://charts.upbound.io/stable \
  --namespace upbound-system --create-namespace \
  --version v1.15.2-up.1 \
  --set "args={--enable-usages,--max-reconcile-rate=1000,--registry=registry.company.corp/xpkg.upbound.io}" \
  --set resourcesCrossplane.requests.cpu="500m" --set resourcesCrossplane.requests.memory="1Gi" \
  --set resourcesCrossplane.limits.cpu="1000m" --set resourcesCrossplane.limits.memory="2Gi" \
  --wait
```

<!-- vale gitlab.Substitutions = NO -->
### Install provider-helm and provider-kubernetes
<!-- vale gitlab.Substitutions = YES -->

Install Provider Helm and Provider Kubernetes. Spaces uses these providers internally to manage resources in the cluster. You need to install these providers and grant necessary permissions to create resources.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: "crossplane-contrib/provider-kubernetes:v0.14.0"
  runtimeConfigRef:
    name: provider-kubernetes
---
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: provider-kubernetes
spec:
  serviceAccountTemplate:
    metadata:
      name: provider-kubernetes
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-helm
spec:
  package: "crossplane-contrib/provider-helm:v0.19.0"
  runtimeConfigRef:
    name: provider-helm
---
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: provider-helm
spec:
  serviceAccountTemplate:
    metadata:
      name: provider-helm
EOF
```

Grant the provider pods permissions to create resources in the cluster.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: provider-kubernetes-cluster-admin
subjects:
  - kind: ServiceAccount
    name: provider-kubernetes
    namespace: upbound-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: provider-helm-cluster-admin
subjects:
  - kind: ServiceAccount
    name: provider-helm
    namespace: upbound-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
EOF
```

Wait until the providers are ready.

```bash
kubectl wait provider.pkg.crossplane.io/provider-helm \
  --for=condition=Healthy \
  --timeout=360s
kubectl wait provider.pkg.crossplane.io/provider-kubernetes \
  --for=condition=Healthy \
  --timeout=360s
```

### Configure the providers

Create `ProviderConfigs` that configure the providers to use the cluster they're deployed into.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: helm.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
  name: upbound-cluster
spec:
 credentials:
    source: InjectedIdentity
---
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: upbound-cluster
spec:
  credentials:
    source: InjectedIdentity
EOF
```

### Install Upbound Spaces software

Create an image pull secret so that the cluster can pull Upbound Spaces images.

```bash
kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
  --docker-server=https://us-west1-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat $SPACES_TOKEN_PATH)"
```

Log in with Helm to be able to pull chart images for the installation commands.

```bash
cat $SPACES_TOKEN_PATH | helm registry login us-west1-docker.pkg.dev -u _json_key --password-stdin
```

Install the Spaces software.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "authentication.hubIdentities=true" \
  --set "authorization.hubRBAC=true" \
  --wait
```

### Create a DNS record

{{< hint "important" >}}If you chose to create a public ingress, you also need to create a DNS record for the load balancer of the public facing ingress. Do this before you create your first control plane.{{< /hint >}}

Create a DNS record for the load balancer of the public facing ingress. To get the address for the Ingress, run the following:


```bash
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```


If the preceding command doesn't return a load balancer address then your provider may not have allocated it yet. Once it's available, add a DNS record for the `ROUTER_HOST` to point to the given load balancer address. If it's an IPv4 address, add an A record. If it's a domain name, add a CNAME record.

You are ready to [create your first managed control plane](#create-your-first-managed-control-plane) in your Space.

## Create your first managed control plane

With your kubeconfig pointed at the Kubernetes cluster where you installed the Upbound Space software, create a managed control plane:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: ctp1
  namespace: default
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp1
    namespace: default
EOF
```

The first managed control plane you create in a Space takes around 5 minutes to get into a `condition=READY` state. Wait until it's ready using the following command:

```bash
kubectl wait controlplane ctp1 --for condition=Ready=True --timeout=360s
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
Learn how to use the up CLI to navigate around Upbound by reading the [up ctx command reference]({{<ref "reference/cli/command-reference#ctx">}}).
{{< /hint >}}
