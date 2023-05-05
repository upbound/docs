---
title: Sizing UXP
weight: 300
description: Recommendations on sizing UXP deployments
---

[Upbound providers](https://marketplace.upbound.io/providers) create new
Kubernetes APIs to represent external cloud APIs. These APIs are [Kubernetes
Custom Resource
Definitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
(CRDs).

Some providers install hundreds or thousands of CRDs. This creates significant
CPU and memory pressure on the Kubernetes API Server. Failure to size
the Kubernetes control plane node can lead to API timeouts or control plane
pods, including UXP, to restart or fail.

The following guide provides guidance on sizing your Kubernetes control plane
nodes when deploying UXP and Upbound providers.

{{<hint "tip" >}}
Upbound [Managed Control Planes]({{<ref "/concepts/managed-control-planes" >}})
automatically manage scaling and sizing.
{{< /hint >}}

## Self-hosted Kubernetes clusters

When deploying UXP on a self-hosted Kubernetes cluster the number of CRDs
installed by the providers determines the resource requirements. 

For example, Provider AWS version v0.34.0 installs 901 CRDs.

{{<img src="uxp/images/aws-crd-count.png" alt="Use the Upbound Marketplace to view the number of CRDs a Provider installs." align="center" >}}

Each CRD installed requires about 4 MB of memory in the control plane pod. 

For this version of Provider AWS, the Kubernetes control plane requires at least
3.6 GB of free memory.

{{< hint "tip" >}}
Use the same calculations when installing multiple providers.
{{< /hint >}}

### CPU usage considerations

{{< hint "important" >}}
Upbound recommends at least four to eight CPU cores, depending on the provider.
Reference the provider's documentation for specific recommendations. 
{{< /hint >}}

The CPU impact of UXP depends on the number of Crossplane resources and how
fast they're updated on changes. 

Crossplane resources include claims, composite resources and managed resources.
UXP consumes CPU cycles when periodically checking the status of each resource.

When changes occur UXP aggressively checks the status of the changed resources to
make them `READY` as soon as possible. 

<!-- vale gitlab.SentenceLength = NO -->
<!-- length calc is wrong because of the ref link -->
The UXP pod and individual providers offer [configuration options]({{<ref
"#uxp-and-provider-configuration-options" >}}) to reduce
CPU load, at the cost of slower startup and recovery times.
<!-- vale gitlab.SentenceLength = YES -->

## Managed Kubernetes clusters

In managed Kubernetes environments you don't control the control plane node. As
a result each managed Kubernetes provider handles the resource needs of Upbound
providers differently. 

### Amazon Elastic Kubernetes Service

Amazon Elastic Kubernetes Service (EKS) doesn't require any
configuration when running Upbound providers. Amazon automatically scales
control plane node without any required changes.

### Google Kubernetes Engine

Google Kubernetes Engine (GKE) sizes their control plane nodes based on the
total number of nodes deployed in a cluster. Testing by Upbound finds that GKE
clusters configured with at least 20 nodes don't have issues.

Smaller clusters take at least 40 minutes to stabilize. During this time the
Kubernetes API server may be unavailable to handle new requests. 

### Microsoft Azure Kubernetes Service

Microsoft Azure Kubernetes Service (AKS) doesn't require any configuration when
running Upbound providers. Microsoft automatically scales
control plane node without any required changes.

## UXP and provider configuration options

UXP and providers provide configuration options to reduce CPU or memory
usage at the trade-off of slower resource updates. 

### Max reconcile rate

The `--max-reconcile-rate` setting configures the number of times per second UXP
or a provider attempts to correct a resource. The default value is 10 times per
second.

Increasing the `--max-reconcile-rate`, by making it smaller, reduces CPU
load but increases the amount of time until all resources are `READY`.

### Poll interval

UXP and the providers periodically poll resources to ensure they're in the
desired state. A common example of a polled resource are provider's managed
resources. The provider makes an cloud provider API call to get the current
state of the managed resource.

The default polling rate is 1 minute. Adjust the polling rate with the 
`--poll-interval` argument.

### Sync interval

<!-- vale Google.WordList = NO -->
<!-- allow "check" -->
UXP and providers look at all resources to confirm they're in the desired
state. Configure the `--sync-interval` to change how often UXP and providers
check their resources. The default is 1 hour.
<!-- vale Google.WordList = YES -->

## Apply configuration settings

You can apply settings to the UXP or provider pods by [editing the
Kubernetes `Deployment`]({{<ref "#edit-the-uxp-deployment">}}) object or 
[applying a `ControllerConfig`]({{<ref "#configure-a-controllerconfig">}}) to a 
Provider.

### Edit the UXP deployment

To change the settings of an installed Crossplane pod, edit the `crossplane`
deployment in the `upbound-system` namespace with the command

`kubectl edit deployment crossplane --namespace upbound-system`

{{< hint "warning" >}}
Updating the Crossplane deployment restarts the Crossplane pod.
{{< /hint >}}

Add Crossplane pod arguments to the 
{{<hover label="args" line="9" >}}spec.template.spec.containers[].args{{< /hover >}}
section of the deployment.

For example, to change the `sync-interval` add 
{{<hover label="args" line="12" >}}--sync-interval=30m{{< /hover >}}.

```yaml {label="args", copy-lines="1"}
kubectl edit deployment crossplane --namespace upbound-system
apiVersion: apps/v1
kind: Deployment
spec:
# Removed for brevity
  template:
    spec:
      containers:
      - args:
        - core
        - start
        - --sync-interval=30m
```

### Configure a ControllerConfig

{{< hint "important" >}}
The Crossplane community deprecated the `ControllerConfig` type in v1.11.
Applying a Controller configuration generates a deprecation warning. 

Controller configurations are still supported until there is a replacement type
in a future Crossplane version.
{{< /hint >}}

Applying a Crossplane `ControllerConfig` to a Provider changes the settings of
the Provider's pod. Each Provider determines their supported set of `args`.

For example, to change the `--max-reconcile-rate` for the Upbound AWS Provider,
create a {{<hover label="cc" line="2">}}ControllerConfig{{</hover >}} and add 
{{<hover label="cc" line="7" >}}--max-reconcile-rate=1{{</hover >}}.

```yaml {label=cc,copy-lines="all"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: example-aws-controllerconfig
spec:
  args: 
    - --max-reconcile-rate=1
```

Apply the new `ControllerConfig` object to the `Provider` object with the 
{{<hover label="provider" line="7" >}}controllerConfigRef{{</hover >}} setting.

```yaml {label="provider"}
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws
spec:
  package: xpkg.upbound.io/upbound/provider-aws:v0.32.1
  controllerConfigRef:
    name: example-aws-controllerconfig
```