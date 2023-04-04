---
title: GitOps with MCP Connector
weight: 6
description: An introduction to doing GitOps with MCP Connector
---

Upbound's Managed Control Plane Connector (MCP Connector) allows you to connect application clusters running outside of Upbound to your managed control planes running in Upbound, so you can do GitOps flows and use Git to drive interactions with your MCPs.

## Overview

In a traditional Crossplane environment, when you install Crossplane to a Kubernetes cluster, all claim APIs you
define via `CompositeResourceDefinition`s are available alongside workload APIs
like `Pod`. With Upbound, Crossplane does not run in your Kubernetes app clusters--instead it runs in Upbound. The MCP Connector allows you to make
all the claim APIs in your managed control planes available in as many Kubernetes clusters
as you want, providing the same experience as if Crossplane is installed locally in your
app cluster.

{{<img src="concepts/images/GitOps-Up-MCP_Marketecture_Dark_1440w.png" alt="Illustration of MCP Connector" quality="100" lightbox="true">}}

## How it works

The way MCP Connector works is that it creates an `APIService` resource in your
cluster for every claim API in your control plane. This resource makes your
Kubernetes cluster proxy every request for that API to the MCP Connector, which
in turn makes the request to the control plane it is connected to.

As a result, the claim APIs are available in your Kubernetes cluster just like
all native Kubernetes API - you can use ArgoCD, kubectl and all other cloud
native tooling installed in your cluster to interact with the claims.

### Connecting

First, you need to make sure `up` CLI is logged in.
```bash
up login
```

In order to connect, your default kubeconfig should point to your cluster, i.e.
when you run `kubectl` queries, they should go to your Kubernetes cluster.

Connect your cluster to a namespace in an Upbound Control Plane. This command
will create a user token and install MCP Connector to your cluster which will
use the token to communicate with the control plane.
```bash
# Note that you need to supply your organization name with --account flag if
# it was not specified during login.
up controlplane connect my-control-plane my-app-ns-1 --account my-org-name
```

Now, you can check what APIs are available in your Kubernetes cluster. You
should find your claim APIs in the list.
```bash
kubectl api-resources
```

### Usage

Let's say you have created your control plane using [Configuration
EKS](https://github.com/upbound/configuration-eks) and `KubernetesCluster` is
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

After connecting your cluster, you can create the exact same object in your
Kubernetes cluster, but it will actually reside in your control plane!

```bash
# Applying the claim YAML above.
# kubectl is set up to talk with your Kubernetes cluster.
kubectl apply -f claim.yaml
```

{{<img src="concepts/images/ClaimInCluster.png" alt="Claim in cluster" size="medium" lightbox="true">}}

Once the object is created, go check the console to see your object.

{{<img src="concepts/images/ClaimInConsole.png" alt="Claim by connector in console" size="large" lightbox="true">}}

Note that you can **interact with the object through your cluster just as if it
lives in your cluster**, meaning all clients like ArgoCD, Helm and others that
you have set up for your cluster would work without knowing it actually resides
in your control plane! This is possible thanks to [Kubernetes API Aggregation
Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
technology we are using under the hood.

## Multi-Cluster Architectures

MCP Connector matches a cluster with a namespace in the control plane. This
means that all claims you create in your Kubernetes cluster end up stored in a
single namespace with a unique name in the control plane. For every cluster you
connect, a new namespace is used.

{{<img src="concepts/images/ConnectorMulticlusterArch.png" alt="Multi-cluster architecture with managed control plane connector" size="medium" lightbox="true">}}

The advantage of this architecture is that infinite number of clusters can be
connected to a single control plane. The operator of the control plane will be
able to see all infrastructure in a central control plane which would give them
the ability to audit, diagnose, optimize their cloud infrastructure.

Without using Managed Control Planes and MCP Connector, users have to install
Crossplane and various cloud providers to every cluster as well as configure the
providers with necessary credentials to let them authenticate to cloud
providers. With a single control plane where many clusters connected through
Upbound tokens, you don't need to give out any cloud credentials to the
clusters.
