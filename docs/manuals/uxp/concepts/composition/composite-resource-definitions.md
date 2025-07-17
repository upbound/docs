---
title: Composite Resource Definitions
sidebar_position: 4
description: Composite Resource Definitions or XRDs define custom API schemas
---
<!--- TODO(tr0njavolta): uxp v2 - control plane project xrd creation --->
Composite resource definitions (`XRDs`) define the schema for a custom API.  
Users create composite resources (`XRs`) using the API schema defined by an
XRD.


<details>
<summary> "What are XRs, XRDs and Compositions?" </summary>
<!--- TODO(tr0njavolta): link --->
<!-- A [composite resource](/crossplane/composite-resources) or XR is a custom API. -->

You use two Crossplane types to create a new custom API:

* A Composite Resource Definition (XRD) - This page. Defines the XR's schema. 
* A [Composition](/crossplane/compositions) - Configures how the XR creates
  other resources.
</details>

Crossplane XRDs are like 
[Kubernetes custom resource definitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/). 
XRDs require fewer fields and add options related to Crossplane, like connection
secrets. 


