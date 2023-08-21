---
title: Deploy a Space locally
weight: 1
description: A guide for deploying an Upbound Space locally in kind
---

Get started with Upbound Spaces on a local machine.

## Prerequisites

This quickstart requires:

- You have installed [kind](https://kind.sigs.k8s.io/).
- An Upbound Account string, provided by your Upbound account representative
- A license key in the form of a `key.json`, provided by your Upbound account representative

{{< hint "important" >}}
Upbound Spaces is a paid feature of Upbound and requires a license key to successfully complete the installation. Contact Upbound if you want to try out Spaces. 
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

### Set your Upbound account details

Set your Upbound Account string as an environment variable for use in future steps

```bash
export UPBOUND_ACCOUNT=<your upbound account>
```

### Set up pre-install configurations

First, you need to create image pull secrets with the Google Service Account tokens you have received. Export the path of the service account token JSON file.

```bash
# Change the path to where you saved the token.
export GCP_TOKEN_PATH="THE PATH TO YOUR GCRTOKEN FILE"
```

Set the version of Spaces software you want to install.

```bash
export VERSION_NUM=1.0.0-rc.1
```

Set the router host and cluster type. The `ROUTER_HOST` is the domain name that's used to access the control plane instances. It's used by the ingress controller to route requests.

```bash
export ROUTER_HOST=proxy.upbound-127.0.0.1.nip.io
```

The `CLUSTER_TYPE` is the Kubernetes cluster provider you're deploying Spaces into. This quickstart targets `eks`.

```bash
export CLUSTER_TYPE=eks
```

## Install a Space

### With the up CLI

The up CLI today gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward. 

{{< hint "tip" >}}
Make sure your kubectl context is set to the cluster you want to install Spaces into.
{{< /hint >}}

Create an image pull secret so that the cluster can pull Upbound Spaces images.

```bash
kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
  --docker-server=https://us-west1-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat $GCP_TOKEN_PATH)"
```

Log in with Helm to be able to pull chart images for the installation commands.

```bash
cat $GCP_TOKEN_PATH | helm registry login us-west1-docker.pkg.dev -u _json_key --password-stdin
```

Install Spaces.

```bash
up space init --token-file=key.json "v${VERSION_NUM}" \
  --set "ingress.host=${ROUTER_HOST}" \
  --set "clusterType=${CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}"
```

You are ready to [create your first managed control plane](#create-your-first-managed-control-plane) in your Space.

### With Helm

Whereas the up CLI handles installation of the pre-requisites, with Helm you need to install them on your own. This gives you more control over the installation process.

#### Install cert-manager

Install cert-manager.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.3/cert-manager.yaml
kubectl wait deployment -n cert-manager cert-manager-webhook --for condition=Available=True --timeout=360s
```

#### Install ingress-nginx

Install ingress-nginx.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s 
```

#### Install UXP

Install Upbound Universal Crossplane (UXP)

```bash
helm upgrade --install crossplane universal-crossplane \
  --repo https://charts.upbound.io/stable \
  --namespace upbound-system --create-namespace \
  --version v1.13.2-up.1 \
  --wait
```

<!-- vale gitlab.Substitutions = NO -->
#### Install provider-helm and provider-kubernetes
<!-- vale gitlab.Substitutions = YES -->

Install Provider Helm and Provider Kubernetes. Spaces uses these providers internally to manage resources in the cluster. We need to install these providers and grant necessary permissions to create resources.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: "xpkg.upbound.io/crossplane-contrib/provider-kubernetes:v0.9.0"
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-helm
spec:
  package: "xpkg.upbound.io/crossplane-contrib/provider-helm:v0.15.0"
EOF
```

Grant the provider pods permissions to create resources in the cluster.

```bash
PROVIDERS=(provider-kubernetes provider-helm)
for PROVIDER in ${PROVIDERS[@]}; do
  cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: $PROVIDER
  namespace: upbound-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: $PROVIDER
subjects:
  - kind: ServiceAccount
    name: $PROVIDER
    namespace: upbound-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: $PROVIDER-hub
spec:
  serviceAccountName: $PROVIDER
EOF
  kubectl patch provider.pkg.crossplane.io "${PROVIDER}" --type merge -p "{\"spec\": {\"controllerConfigRef\": {\"name\": \"$PROVIDER-hub\"}}}"
done
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

#### Configure the providers

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

#### Install Upbound Spaces

Create an image pull secret so that the cluster can pull Upbound Spaces images.

```bash
kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
  --docker-server=https://us-west1-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat $GCP_TOKEN_PATH)"
```

Log in with Helm to be able to pull chart images for the installation commands.

```bash
cat $GCP_TOKEN_PATH | helm registry login us-west1-docker.pkg.dev -u _json_key --password-stdin
```

Install Spaces.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${VERSION_NUM}" \
  --set "ingress.host=${ROUTER_HOST}" \
  --set "clusterType=${CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --wait
```

You are ready to [create your first managed control plane](#create-your-first-managed-control-plane) in your Space.

## Create your first managed control plane

With your kubeconfig pointed at the Kubernetes cluster where you installed the Upbound Space, create a managed control plane:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: ControlPlane
metadata:
  name: ctp1
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp1
    namespace: default
EOF
```

Wait until it's ready.

```bash
kubectl wait controlplane ctp1 --for condition=Ready=True --timeout=360s
```

## Connect to your managed control plane

The connection details for your managed control plane should now exist in a secret. You can fetch the connection details with the following command:

```bash
kubectl get secret kubeconfig-ctp1 -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/ctp1.yaml
```

You can use the kubeconfig to interact with your managed control plane directly:

```bash
kubectl get xrd --kubeconfig=/tmp/ctp1.yaml
```