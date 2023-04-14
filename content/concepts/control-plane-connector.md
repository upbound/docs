---
title: GitOps with MCP Connector
weight: 6
description: An introduction to doing GitOps with MCP Connector
---

Upbound's Managed Control Plane Connector (MCP Connector) connects application clusters running outside of Upbound to your managed control planes running in Upbound. You can do GitOps flows and use Git to drive interactions with your MCPs.

<!-- vale write-good.Weasel = NO -->
<!-- ignore "many"  -->
When you install Crossplane in your Kubernetes cluster, all claim APIs you
define via `CompositeResourceDefinition`s are available alongside workload APIs
like `Pod`. With Upbound, Crossplane doesn't run in your Kubernetes app clusters. Crossplane runs inside Upbound. The MCP Connector allows you to make
all the claim APIs available in as many Kubernetes clusters
as you want. This provides the same experience as locally installed Crossplane.
<!-- vale write-good.Weasel = YES -->

{{<img src="concepts/images/GitOps-Up-MCP_Marketecture_Dark_1440w.png" alt="Illustration of MCP Connector" quality="100" lightbox="true">}}

## Managed control plane connector operations

The MCP Connector creates an `APIService` resource in your
Kubernetes cluster for every claim API in your control plane. Your
Kubernetes cluster sends every request for the claim API to the MCP Connector. The MCP Connector
makes the request to the Upbound control plane it's connected to.

The claim APIs are available in your Kubernetes cluster just like
all native Kubernetes API.

### Connecting to managed control planes

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

### Example usage

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

## Multi-cluster architectures

Claims are store in a unique namespace in the Upbound Managed Control Plane. 
Every cluster creates a new MCP namespace.

{{<img src="concepts/images/ConnectorMulticlusterArch.png" alt="Multi-cluster architecture with managed control plane connector" size="medium" lightbox="true">}}

There's no limit on the number of clusters connected to a single control plane. 
Control plane operators can see all their infrastructure in a central control plane.

Without using Managed Control Planes and MCP Connector, users have to install
Crossplane and providers for cluster. Each cluster requires configuration for 
providers with necessary credentials. With a single control plane where multiple clusters connected through
Upbound tokens, you don't need to give out any cloud credentials to the
clusters.
