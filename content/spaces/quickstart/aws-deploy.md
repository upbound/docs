---
title: Deploy a Space on AWS
weight: 10
description: A guide for deploying an Upbound Space in AWS
---

Get started with Upbound Spaces on an Amazon EKS cluster.

## Prerequisites

This quickstart requires:

- You have an account on AWS and have installed both the [AWS](https://aws.amazon.com/cli/) CLI and [eksctl](https://eksctl.io/).
- An Upbound Account string, provided by your Upbound account representative
- A license key in the form of a `key.json`, provided by your Upbound account representative

{{< hint "important" >}}
Upbound Spaces is a paid feature of Upbound and requires a license key to successfully complete the installation. Contact Upbound if you want to try out Spaces. 
{{< /hint >}}

## Provision the hosting environment

### Create an EKS cluster

Configure the name and target region you want the EKS cluster deployed to.

```bash
export CLUSTER_NAME=upbound-space-quickstart
export REGION=us-east-1
```

Provision a 3-node cluster using eksctl.

```bash
cat <<EOF | eksctl create cluster -f -
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${CLUSTER_NAME}
  region: ${REGION}
  version: "1.26"
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
# TODO: Replace this with a domain that you own!
export ROUTER_HOST=<proxy.example.com>
```

{{< hint "important" >}}
You need to add DNS entries for this domain to point to the load balancer deployed by the ingress controller, so make sure you use a domain that you own.
{{< /hint >}}

The `CLUSTER_TYPE` is the Kubernetes cluster provider you're deploying Spaces into. This quickstart targets `kind`.

```bash
export CLUSTER_TYPE=kind
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

#### Install ALB Load Balancer

Install ALB Load Balancer.

```bash
helm install aws-load-balancer-controller aws-load-balancer-controller --namespace kube-system \
  --repo https://aws.github.io/eks-charts \
  --set clusterName=${CLUSTER_NAME} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --wait
```

#### Install ingress-nginx

Install ingress-nginx.

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

#### Create a DNS record

Create a DNS record for the load balancer of the public facing ingress. To get the address for the Ingress, run the following:

```bash
# For EKS
kubectl get ingress \
  -n upbound-system mxe-router-ingress \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
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