---
title: Deploy a Space on Azure
weight: 20   
description: A guide for deploying an Upbound Space in Microsoft Azure
---

Get started with Upbound Spaces on a Microsoft Azure AKS cluster.

## Prerequisites

This quickstart requires:

- You have an account on Azure and have installed the [Azure](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) CLI.
- An Upbound Account string, provided by your Upbound account representative
- A license token in the form of a `token.json`, provided by your Upbound account representative

{{< hint "important" >}}
Upbound Spaces is a paid feature of Upbound and requires a license token to successfully complete the installation. Contact Upbound if you want to try out Spaces. 
{{< /hint >}}

## Provision the hosting environment

### Create an AKS cluster

Configure the name and target region you want the AKS cluster deployed to.

```ini
export SPACES_RESOURCE_GROUP_NAME=upbound-space-quickstart
export SPACES_CLUSTER_NAME=upbound-space-quickstart
export SPACES_LOCATION=westus
```

Provision a new Azure resource group.

```bash
az group create --name ${SPACES_RESOURCE_GROUP_NAME} --location ${SPACES_LOCATION}
```

Provision a 3-node cluster.

```bash
az aks create -g ${SPACES_RESOURCE_GROUP_NAME} -n ${SPACES_CLUSTER_NAME} \
  --enable-managed-identity \
  --node-count 3 \
  --node-vm-size Standard_D4s_v4 \
  --enable-addons monitoring \
  --enable-msi-auth-for-monitoring \
  --generate-ssh-keys \
  --network-plugin kubenet \
  --network-policy calico
```

Get the kubeconfig of your AKS cluster.

```bash
az aks get-credentials --resource-group ${SPACES_RESOURCE_GROUP_NAME} --name ${SPACES_CLUSTER_NAME}
```

## Configure the pre-install

### Set your Upbound account details

Set your Upbound Account string as an environment variable for use in future steps

{{< editCode >}}
```ini
export UPBOUND_ACCOUNT=$@<your upbound account>$@
```
{{< /editCode >}}

### Set up pre-install configurations

Export the path of the license token JSON file provided by your Upbound account representative.

{{< editCode >}}
```ini
# Change the path to where you saved the token.
export SPACES_TOKEN_PATH="$@/path/to/token.json$@"
```
{{< /editCode >}}

Set the version of Spaces software you want to install.

```ini
export SPACES_VERSION=1.0.0
```

Set the router host and cluster type. The `SPACES_ROUTER_HOST` is the domain name that's used to access the control plane instances. It's used by the ingress controller to route requests. 

{{< editCode >}}
```ini
# TODO: Replace this with a domain that you own!
export SPACES_ROUTER_HOST=$@<proxy.example.com>$@
```
{{< /editCode >}}

{{< hint "important" >}}
Make sure to replace the placeholder text in `SPACES_ROUTER_HOST` and provide a real domain that you own
{{< /hint >}}

The `SPACES_CLUSTER_TYPE` is the Kubernetes cluster provider you're deploying Spaces into. This quickstart targets `aks`.

```ini
export SPACES_CLUSTER_TYPE=aks
```

## Install a Space

### With the up CLI

The [up CLI]({{<ref "reference/cli/">}}) gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward. The up CLI introduced Spaces-related commands in `v0.19.0`. Make sure you use this version or newer.

{{< hint "tip" >}}
Make sure your kubectl context is set to the cluster you want to install Spaces into.
{{< /hint >}}

By default, Spaces install skips setting up a public ingress. The Spaces install can setup public ingress as a convenience if you append the `--public-ingress=true` option in the command below. 

{{< hint "warning" >}}
If you elect to configure a public ingress, be careful since it exposes your Spaces API server to the external network.
{{< /hint >}}

Install the Space.

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}"
```

If you chose to create a public ingress, you also need to [create a DNS record](#create-a-dns-record) for the load balancer of the public facing ingress. Do this before you create your first control plane.

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
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path=/healthz' \
  --wait
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
  --docker-password="$(cat $SPACES_TOKEN_PATH)"
```

Log in with Helm to be able to pull chart images for the installation commands.

```bash
cat $SPACES_TOKEN_PATH | helm registry login us-west1-docker.pkg.dev -u _json_key --password-stdin
```

Install Spaces.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --wait
```

#### Create a DNS record

Create a DNS record for the load balancer of the public facing ingress. To get the address for the Ingress, run the following:

```bash
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

If the preceding command doesn't return a load balancer address then your provider may not have allocated it yet. Once it's available, add a DNS record for the `ROUTER_HOST` to point to the given load balancer address. If it's an IPv4 address, add an A record. If it's a domain name, add a CNAME record.

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

The first managed control plane you create in a Space takes around 5 minutes to get into a `condition=READY` state. Wait until it's ready using the following command:

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