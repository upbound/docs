---
title: GitOps with Control Planes
weight: 6
description: An introduction to doing GitOps with control planes on Upbound
---

[GitOps]({{<ref "xp-arch-framework/interface-integrations/git-and-gitops.md" >}}) is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. Upbound's managed control planes are compatible with this pattern and it's strongly recommended you integrate GitOps in the platforms you build on Upbound.

## Integrate with Argo CD and Flux

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) and [Flux](https://fluxcd.io/) are two examples of projects in the Kubernetes ecosystem commonly used for GitOps. You can use them in tandem with Upbound managed control planes to achieve GitOps flows. The sections below explain how to integrate these tools with Upbound.

### Argo CD

{{< hint "important" >}}
Argo CD is currently unable to target a managed control plane as an external cluster.  Argo CD must be able to create a service account on the target cluster, and this is a permission Upbound disallows on managed control planes. Upbound is working to fix this gap; the documentation in this article will be updated once it has been fixed.
{{< /hint >}}

<!-- You can use Argo to sync claims to your managed control planes. To do this, you need to have an instance of Argo running externally to Upbound, since you can't install Argo locally in Upbound. Assuming you are running Argo _elsewhere_ outside of Upbound, the steps to use Argo to sync claims are the following:

1. Fetch your managed control plane's API server endpoint so you can provide it to Argo. In the step below, use the [up CLI]({{<ref "concepts/managed-control-planes.md#connect-directly-to-your-mcp" >}}) to fetch the kubeconfig of your MCP and write it to a file.

```bash
up ctp kubeconfig get -a <account> <control-plane-name> --token <token> -f mcp-kubeconfig.yaml
```

2. Save the kubeconfig as a secret on the external Kubernetes cluster where you installed Argo.
3. Define a new Argo `Application` resource representing your managed control plane.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: managed-control-plane
spec:
  destination:
    server: <cluster-api-url>
    namespace: <namespace-in-controlplane-to-sync-to>
  project: default
  source:
    path: claims
    repoURL: <your-controlplane-repo-source>
    targetRevision: main
    directory:
      recurse: true
  syncPolicy:
    automated: {}
```

4. Create claims in the Git repository that Argo is monitoring and observe how they're transmitted to your managed control plane in Upbound.-->

### Flux

You can use Flux to sync claims to your managed control planes. To do this, you need to have an instance of Flux running externally to Upbound, since you can't install Flux locally in Upbound. Assuming you are running Flux _elsewhere_ outside of Upbound, the steps to use Flux to sync claims are the following:

1. Fetch your managed control plane's API server endpoint so you can provide it to Flux. In the step below, use the [up CLI]({{<ref "concepts/managed-control-planes.md#connect-directly-to-your-mcp" >}}) to fetch the kubeconfig of your MCP and write it to a file.

```bash
up ctp kubeconfig get -a <account> <control-plane-name> --token <token> -f mcp-kubeconfig.yaml
```

2. Create a secret on the external Kubernetes cluster where you installed Flux. This secret should contain the kubeconfig from the previous step.

```bash
kubectl create secret generic controlplane-kubeconfig --from-file=value=./mcp-kubeconfig.yaml -n flux-system
```

3. Define a new Flux `Kustomization` resource representing your managed control plane and apply to your Flux cluster. The example manifest below assumes you store claims in your Git repository under a `claims` folder.

```yaml
# xp-kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: claim-sync
  namespace: flux-system
spec:
  interval: 5m0s
  path: ./claims
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  kubeConfig:
    secretRef:
      name: controlplane-kubeconfig
```

4. Apply a `Kustomization` to tell Flux about this resource

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- xp-kustomization.yaml
```

5. Create claims in the Git repository that Flux is monitoring and observe how they're transmitted to your managed control plane in Upbound.

{{< hint "note" >}}
The secret defined in the `.spec.kubeConfig.secretRef.Name` kubeConfig.SecretRef must exist in the same namespace as the Kustomization. See the [Flux documentation](https://fluxcd.io/flux/components/kustomize/kustomization/#kubeconfig-reference) for more information.
{{< /hint >}}


## Control plane connector

Upbound's Managed Control Plane Connector (MCP Connector) is another way you can set up GitOps flows with Upbound managed control planes. MCP Connector is for users coming from open source Crossplane and who treat Crossplane as an add-on to an existing Kubernetes application cluster. In that world, users could interact with Crossplane APIs from the same cluster they deploy their applications to. This model breaks when users move their Crossplane instances into a managed solution in Upbound.

MCP Connector connects Kubernetes application clusters---running outside of Upbound--to your managed control planes running in Upbound. This allows you to interact with your managed control plane's API right from the app cluster. The claim APIs you define via `CompositeResourceDefinition`s are available alongside Kubernetes workload APIs like `Pod`. In effect, MCP Connector providers the same experience as a locally installed Crossplane.

{{<img src="concepts/images/GitOps-Up-MCP_Marketecture_Dark_1440w.png" alt="Illustration of MCP Connector" quality="100" lightbox="true">}}

### Managed control plane connector operations

The MCP Connector creates an `APIService` resource in your
Kubernetes cluster for every claim API in your control plane. Your
Kubernetes cluster sends every request for the claim API to the MCP Connector. The MCP Connector
makes the request to the Upbound control plane it's connected to.

The claim APIs are available in your Kubernetes cluster just like
all native Kubernetes API.

#### Connecting to managed control planes

Log in with the `up` CLI
```bash
up login
```

Connect your cluster to a namespace in an Upbound Control Plane with `up controlplane connect <control plane name> <namespace>`. This command
creates a user token and installs the MCP Connector to your cluster.

{{<hint "note" >}}
Note that you need to supply your organization name with `--account` if it wasn't specified during login.
{{< /hint >}}

```bash {copy-lines="3"}
up controlplane connect my-control-plane my-app-ns-1 --account my-org-name
```

The Claim APIs are now visible in the cluster with `kubectl api-resources`.
```bash
kubectl api-resources
```

#### Example usage

This example creates a control plane using [Configuration
EKS](https://github.com/upbound/configuration-eks). `KubernetesCluster` is
available as a claim API in your control plane. The following is [an
example](https://github.com/upbound/configuration-eks/blob/9f86b6d/.up/examples/cluster.yaml)
object you can create in your control plane.
```yaml
apiVersion: k8s.starter.org/v1alpha1
kind: KubernetesCluster
metadata:
  name: my-cluster
  namespace: default
spec:
  id: my-cluster
  parameters:
    nodes:
      count: 3
      size: small
    services:
      operators:
        prometheus:
          version: "34.5.1"
  writeConnectionSecretToRef:
    name: my-cluster-kubeconfig
```

After connecting your Kubernetes cluster to the MCP, you can create the `KubernetesCluster` object in your
Kubernetes cluster. Although your local cluster has an Object, the actual resources is in your control plane inside Upbound.

```bash {copy-lines="3"}
# Applying the claim YAML above.
# kubectl is set up to talk with your Kubernetes cluster.
kubectl apply -f claim.yaml
```

{{<img src="concepts/images/ClaimInCluster.png" alt="Claim in cluster" size="medium" lightbox="true">}}

Once Kubernetes creates the object, view the console to see your object.

{{<img src="concepts/images/ClaimInConsole.png" alt="Claim by connector in console" size="large" lightbox="true">}}

You can interact with the object through your cluster just as if it
lives in your cluster. 

{{<hint "note" >}}
Upbound uses the [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) to allow tools to interact with the remote object as if it was local.
{{< /hint >}}

### Interface with multiple app clusters

Claims are store in a unique namespace in the Upbound managed control plane. 
Every cluster creates a new MCP namespace.

{{<img src="concepts/images/ConnectorMulticlusterArch.png" alt="Multi-cluster architecture with managed control plane connector" size="medium" lightbox="true">}}

There's no limit on the number of clusters connected to a single control plane. 
Control plane operators can see all their infrastructure in a central control plane.

Without using managed control planes and MCP Connector, users have to install
Crossplane and providers for cluster. Each cluster requires configuration for 
providers with necessary credentials. With a single control plane where multiple clusters connected through
Upbound tokens, you don't need to give out any cloud credentials to the
clusters.
