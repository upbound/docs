---
title: Composite Resources
sidebar_position: 2
description: Composite resources, an XR or XRs, represent a collection of related
  cloud resources.
---

A composite resource, or XR, represents a set of resources as a
single object. Crossplane creates composite resources when users
access a custom API, defined in the CompositeResourceDefinition. 

:::tip
Composite resources are a _composite_ of resources.  
A _Composition_ defines how to _compose_ the resources together.
:::

<details>
  <summary>What are XRs, XRDs and Compositions?</summary>
  A composite resource or XR (this page) is a custom API.

You use two Crossplane types to create a new custom API:

* A [Composite Resource Definition][xrds]
  (XRD) - Defines the XR's schema.
* A [Composition][composition] - Configures how the XR creates
  other resources.
</details>

[xrds]: /manuals/uxp/concepts/composition/composite-resource-definitions/
[xrs]: /manuals/uxp/concepts/composition/composite-resources/
[composition]: /manuals/uxp/concepts/composition/compositions/
[k8s]: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
