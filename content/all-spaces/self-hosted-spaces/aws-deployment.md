---
title: AWS Deployment Guide
weight: 2
description: A  quickstart guide for Upbound Spaces in AWS
aliases:
    - /spaces/quickstart
    - /all-spaces/disconnected-spaces/aws-deployment
---

Get started with Upbound Spaces. This guide deploys a self-hosted Upbound cluster in AWS.

Disconnected Spaces allows you to host managed control planes in your preferred environment.

## Prerequisites

To get started deploying your own Disconnected Space, you need:

- An Upbound organization account string, provided by your Upbound account representative
- A `token.json` license, provided by your Upbound account representative
- An AWS account and the AWS CLI

{{< hint "important" >}}
Disconnected Spaces are a business critical feature of Upbound and requires a license token to successfully complete the installation. [Contact Upbound](https://www.upbound.io/contact) if you want to try out Upbound with Disconnected Spaces.
{{< /hint >}}

## Provision the hosting environment

### Create a cluster


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
export SPACES_VERSION={{< spaces_version >}}
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

<!-- vale off -->
## Install the Spaces software
<!-- vale on -->

### Install cert-manager

Install cert-manager.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
kubectl wait deployment -n cert-manager cert-manager-webhook --for condition=Available=True --timeout=360s
```

### Install ALB Load Balancer

```bash
helm install aws-load-balancer-controller aws-load-balancer-controller --namespace kube-system \
  --repo https://aws.github.io/eks-charts \
  --set clusterName=${SPACES_CLUSTER_NAME} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --wait
```

### Install ingress-nginx

_Note_: Starting with Spaces v1.10.0, you need to configure the ingress-nginx
controller to allow the SSL-passthrough mode. You can do so by passing the
`--enable-ssl-passthrough=true` command-line option to the controller.
The following command achieves this via the `controller.extraArgs` Helm
parameter.

Install ingress-nginx.

```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --create-namespace --namespace ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --version 4.7.1 \
  --set 'controller.service.type=LoadBalancer' \
  --set 'controller.extraArgs.enable-ssl-passthrough=true' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-type=external' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-scheme=internet-facing' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-nlb-target-type=ip' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-protocol=http' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-path=/healthz' \
  --set 'controller.service.annotations.service\.beta\.kubernetes\.io/aws-load-balancer-healthcheck-port=10254' \
  --wait
```

### Install Upbound Spaces software

Create an image pull secret so that the cluster can pull Upbound Spaces images.

```bash
kubectl create ns upbound-system
kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
  --docker-server=https://xpkg.upbound.io \
  --docker-username="$(jq -r .accessId $SPACES_TOKEN_PATH)" \
  --docker-password="$(jq -r .token $SPACES_TOKEN_PATH)"
```

Log in with Helm to be able to pull chart images for the installation commands.

```bash
jq -r .token $SPACES_TOKEN_PATH | helm registry login xpkg.upbound.io -u $(jq -r .accessId $SPACES_TOKEN_PATH) --password-stdin
```

Install the Spaces software.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://xpkg.upbound.io/spaces-artifacts/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
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
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
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
