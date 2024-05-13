---
title: Cloud Quickstart
weight: 2
description: A  quickstart guide for Upbound Spaces in AWS, Azure, or GCP
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster in AWS, GCP, or Azure.

Disconnected Spaces allows you to host managed control planes in your preferred environment.

## Prerequisites

To get started deploying your own Disconnected Space, you need:

- An Upbound organization account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- An AWS, Azure, or GCP account with corresponding CLI tools

{{< hint "important" >}}
Disconnected Spaces are a business critical feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Upbound with Disconnected Spaces.
{{< /hint >}}

## Provision the hosting environment

A Disconnected Space requires a cloud Kubernetes or `kind` cluster as a hosting environment. For your first time set up or a development environment, Upbound recommends starting with a [`kind` cluster](../kind-quickstart/).

### Create a cluster

{{< tabs >}}

{{< tab "AWS EKS" >}}


Configure the name and target region you want the EKS cluster deployed to.

```ini
export SPACES_CLUSTER_NAME=upbound-space-quickstart
export SPACES_REGION=us-east-1
```

Provision a 3-node cluster using eksctl.

```bash
cat <<EOF | eksctl create cluster -f -
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${SPACES_CLUSTER_NAME}
  region: ${SPACES_REGION}
  version: "1.29"
managedNodeGroups:
  - name: ng-1
    instanceType: m5.xlarge
    desiredCapacity: 3
    volumeSize: 100
    iam:
      withAddonPolicies:
        ebs: true
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: efs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        efsCSIController: true
addons:
  - name: vpc-cni
    attachPolicyARNs:
      - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
  - name: aws-ebs-csi-driver
    wellKnownPolicies:
      ebsCSIController: true
EOF
```

{{< /tab >}}

{{< tab "Azure AKS" >}}


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

{{< /tab >}}

{{< tab "GCP GKE" >}}

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

{{< /tab >}}

{{< /tabs >}}


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
export SPACES_VERSION=1.3.1
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

{{< tabs >}}

{{< tab "AWS EKS" >}}

```ini
export SPACES_CLUSTER_TYPE=eks
```

{{< /tab >}}

{{< tab "Azure AKS" >}}


```ini
export SPACES_CLUSTER_TYPE=aks
```

{{< /tab >}}

{{< tab "GCP GKE" >}}


```ini
export SPACES_CLUSTER_TYPE=gke
```

{{< /tab >}}

{{< /tabs >}}

<!-- vale off -->
## Install the Spaces software
<!-- vale on -->

{{< tabs >}}

{{< tab "Up CLI" >}}

The [up CLI]({{<ref "reference/cli/">}}) gives you a "batteries included" experience. It automatically detects which prerequisites aren't met and prompts you to install them to move forward.

{{< hint "tip" >}}
Make sure your kubectl context is set to the cluster you want to install Spaces into.
{{< /hint >}}

Install the Spaces software.

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --public-ingress=true \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}"
```

If you chose to create a public ingress, you also need to [create a DNS record](#create-a-dns-record) for the load balancer of the public facing ingress. Do this before you create your first control plane.

You are ready to [create your first managed control plane](#create-your-first-managed-control-plane) in your Disconnected Space.

{{< /tab >}}

{{< tab "Helm" >}}


Whereas the up CLI handles installation of the pre-requisites, with Helm you need to install them on your own. This gives you more control over the installation process.

### Install cert-manager

Install cert-manager.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.3/cert-manager.yaml
kubectl wait deployment -n cert-manager cert-manager-webhook --for condition=Available=True --timeout=360s
```

### Install ALB Load Balancer

{{< hint "important" >}} AWS Only {{< /hint >}}

```bash
helm install aws-load-balancer-controller aws-load-balancer-controller --namespace kube-system \
  --repo https://aws.github.io/eks-charts \
  --set clusterName=${SPACES_CLUSTER_NAME} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --wait
```

### Install ingress-nginx

Install ingress-nginx.

{{< tabs >}}

{{< tab "AWS EKS" >}}

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-type=external' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-scheme=internet-facing' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-nlb-target-type=ip' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-protocol=http' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-path=/healthz' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-port=10254' \
  --wait
```

{{< /tab >}}

{{< tab "Azure AKS" >}}


```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path=/healthz' \
  --wait
```

{{< /tab >}}

{{< tab "GCP GKE" >}}


```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --wait
```

{{< /tab >}}

{{< /tabs >}}

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
  package: "crossplane-contrib/provider-kubernetes:v0.12.1"
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
  package: "crossplane-contrib/provider-helm:v0.17.0"
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

<!-- vale off -->
If your company uses a proxied environment with mirrored registries, please update the specified registry to your internal registry.
<!-- vale on -->


```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "authentication.hubIdentities=true" \
  --set "authorization.hubRBAC=true" \
  --set "registry=registry.company.corp/us-west1-docker.pkg.dev/orchestration-build/upbound-environments" \
  --set "controlPlanes.uxp.registryOverride=registry.company.corp/xpkg.upbound.io" \
  --set "controlPlanes.uxp.repository=registry.company.corp/charts.upbound.io/stable" \
  --wait
```

{{< /tab >}}

{{< /tabs >}}


### Create a DNS record

{{< hint "important" >}}If you chose to create a public ingress, you also need to create a DNS record for the load balancer of the public facing ingress. Do this before you create your first control plane.{{< /hint >}}

Create a DNS record for the load balancer of the public facing ingress. To get the address for the Ingress, run the following:

{{< tabs >}}

{{< tab "AWS EKS" >}}

```bash
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

{{< /tab >}}

{{< tab "Azure AKS" >}}


```bash
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

{{< /tab >}}

{{< tab "GCP GKE" >}}


```bash
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

{{< /tab >}}

{{< /tabs >}}

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
Learn how to use the up CLI to navigate around Upbound by reading the [up ctx command reference]({{<ref "reference/cli/command-reference#alpha-ctx">}}).
{{< /hint >}}