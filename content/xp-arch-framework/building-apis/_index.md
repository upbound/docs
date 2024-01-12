---
title: "Building APIs"
weight: 20
description: "how to build APIs"
---

Creating your own, customized API is a core differentiating feature of Crossplane and is a critical step in your Crossplane journey. This guide defines the best practices to follow when developing custom APIs using Crossplane's core building blocks. 

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/master/concepts/) documentation.
{{< /hint >}}

## Extend the Kubernetes API

Crossplane gives you the tools to extend the Kubernetes API without needing to write code. According to the [Kubernetes docs](https://kubernetes.io/docs/concepts/overview/kubernetes-api/), "The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes. For example: Pods, Namespaces, ConfigMaps, and Events." 

{{<img src="xp-arch-framework/images/kubernetes-resources.png" alt="Depiction of default Kubernetes resources" size="small" unBlur="true">}}

Customers use Crossplane because they want to declaratively create and manage resources in an external service. "Resources in an external service" can vary:

- a traditional cloud resource like an IAM role or a VM instance
- a Kafka topic or ACL
- a database in a SQL server instance

To put this into context, Kubernetes has a component called the `API Server`. It's the front door you must go through to interact with various objects in Kubernetes. The API Server needs to know how to interact with resources which exist outside of a Kubernetes cluster.

{{<img src="xp-arch-framework/images/kubernetes-custom-resources.png" alt="Depiction of how Kubernetes cant talk to custom resources by default" size="medium" unBlur="true">}}

## How Crossplane enables managing resources in an external service

In the preceding example, each resource has an API to interact with it. You can teach Crossplane how to interact with those APIs. **Crossplane providers** are the building blocks that you can install into Crossplane to teach it how to talk to these resources' APIs. Crossplane providers are packages which bundle and define new Kubernetes custom resources and their associated controllers. Controllers contain the logic for interacting with the external resource's APIs. Collectively, Crossplane calls these `managed resources (MRs)`.

{{<img src="xp-arch-framework/images/kubernetes-crossplane-mrs.png" alt="Depiction of how Crossplane facilitates talking to external resources" size="medium" unBlur="true">}}

Managed resources are Kubernetes objects, complete with manifests that are like any other Kubernetes object--They support versions, labels, metadata, etc. An example manifest of the `Server` resource courtesy of the Crossplane provider-azure. 

```yaml
apiVersion: dbforpostgresql.azure.upbound.io/v1beta1
kind: Server
metadata:
  name: azurepostgresql
spec:
  forProvider:
     administratorLogin: sqladmin
    location: West Europe
    skuName: GP_Gen5_2
    sslEnforcementEnabled: true
    version: "9.6"
  writeConnectionSecretToRef:
    namespace: upbound-system
    name: azure-postgresql-conn
```

Crossplane managed resources attempt to be a 1:1 representation of an external resource in Kubernetes. Installing managed resources into a Crossplane via a Crossplane provider doesn't constitute a custom API. You create a custom API in Crossplane by defining `composite resource (XRs)`, a unique concept to Crossplane.

{{< hint "important" >}}
📢 Just like any Kubernetes object, you can create new Crossplane managed resources directly. We advise **against** doing this in favor of always using Crossplane composite resources, explained below.
{{< /hint >}}

## Custom APIs with Crossplane

As the [upstream Crossplane](https://docs.crossplane.io/master/concepts/) documentation calls out, when it comes to building custom APIs with Crossplane, there are some components involved:

1. A **Composite Resource Definition (XRD)**
2. A **Composition** or **Compositions**
3. A **Configuration** Package

{{<img src="xp-arch-framework/images/xp-building-blocks.png" alt="Depiction of Crossplane building blocks" size="medium" unBlur="true">}}

A Composite Resource Definition and composition together give Crossplane enough information to be able to form Composite Resources (XRs).

### Composite resources

Composite resources are Kubernetes objects that you can create without needing to write any code. They define a new API abstraction that incorporates Crossplane managed resources. Composite resources are user-defined. While managed resources are powerful, there are some limitations:

- High-fidelity APIs mean there are a lot of things to configure in each Managed Resource. Could you pre-configure some resources?
- In most cloud deployments, you need to create multiple managed resources. Can you combine them into a single Resource?
- Oftentimes, you'd like to abstract the resource. Can users ask for a Database instead of a cloud-provider specific DB?

Composite Resources solve these problems. A composite resource requires:

- Someone authors a  **Composite Resource Definition (XRD)**.
- Someone authors a **composition**, which is the implementation component of your composite resource against the XRD (which is the definition). You can have multiple compositions for an XRD, but 1 implementation is always selected when creating a new instance of the composite resource.

{{<img src="xp-arch-framework/images/xrd.png" alt="Depiction of an XRD" size="medium" unBlur="true">}}

For example, you could define a custom API called `StorageBucket` and you could have three different implementations of this resource, one for each public cloud provider.

{{<img src="xp-arch-framework/images/xr.png" alt="Depiction of an XR" size="medium" unBlur="true">}}

### Composing resources

You should never create managed resources directly. Instead, create them indirectly as part of composing them with Composite Resources. This allows you to craft a custom API for the managed resource. It also lets you create a relationship between multiple related managed resources, stitch values between them if needed, adds RBAC capabilities and lifecycle management controls.

## Configure APIs on a control plane

A new instance of Crossplane is like a blank slate: there are no custom APIs installed. You need to install packages that deliver custom APIs which have the capabilities you meed. This could be a package someone else authored or it could be a package that you have authored yourself. `Control plane configurations` are one of the core building blocks defined by Crossplane and are the recommended package format for distributing APIs onto a control plane. To learn about using configuration packages, read [creating control plane configurations]({{< ref "xp-arch-framework/building-apis/building-apis-configurations.md" >}}).

## Next steps

Read [Authoring XRDs]({{< ref "xp-arch-framework/building-apis/building-apis-xrds.md" >}}) to learn about how to approach defining your own XRDs and incorporate best practices.