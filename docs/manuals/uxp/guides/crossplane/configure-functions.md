---
title: Install and Configure Composition Functions
draft: true
---

This guide explains how to install composition functions and configure them in
your Composition pipelines to template Crossplane resources.

## Prerequisites

Before you continue, make sure you have:

-   A Crossplane control plane running
-   `kubectl` installed
-   Reviewed the Composition concepts page

## Install a composition function

When you install a Function, you're creating a function pod on your Crossplane
cluster. Crossplane sends requests to this pod when you create a composite
resource.

First, create the function object.

Create a new file called `function.yaml` and paste the function below:

```yaml
function - tabs?
```

Use `kubectl` to apply the function:

```shell
kubectl apply -f function.yaml
```

You can verify the health of the function with `kubectl`:

```shell
kubectl get functions
```

When `INSTALLED` and `HEALTHY` are `True`, Crossplane successfully installed your
function.

## Configure your function

You need to create a `Composition` object in `Pipeline` mode and define your
pipeline steps.

Create a new file called `composition.yaml` and paste the configuration below:

```yaml
composition object -tabs
```

## Use multiple functions in a pipeline

Crossplane calls functions in sequence and passes results from one function to
the next. You can add multiple pipeline steps in your `Composition` object
`pipeline`:

```yaml
example - tabs
```

## Composed resource access

For non-provider resources, you can create RBAC permissions for Crossplane to
manage them.

Create a ClusterRole:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
 kind: ClusterRole
 metadata:
   name: cnpg:aggregate-to-crossplane
   labels:
     rbac.crossplane.io/aggregate-to-crossplane: "true"
 rules:
 - apiGroups:
   - postgresql.cnpg.io
.   resources:
.   - clusters
.   verbs:
.   - "*"
```

Apply the ClusterRole:

```shell
kubectl apply -f clusterrole.yaml
```

The `rbac.crossplane.io/aggregate-to-crossplane: "true"` label is critical for
aggregating to Crossplane's primary cluster role.
