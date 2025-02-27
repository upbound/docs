---
title: Consumer portal
weight: 10
description: An introduction to the Consumer Portal feature of Upbound
aliases:
    - /all-spaces/spaces/consumer-portal
    - all-spaces/spaces/consumer-portal
---

Upbound offers the browser-based Consumer portal tool that lets you manage resources on your control planes through a graphical interface. Use the Consumer Portal to manage your resources if you prefer using a user-interface through the browser.

As an alternative, you can use Kubernetes-compatible [RESTful API]({{<ref "operate#connect-directly-to-your-mcp">}}) offered by each control plane.

## Consumer portal features

The Consumer Portal provides:

<!-- vale alex.Condescending = NO -->
<!-- vale Upbound.Spelling = NO -->
- Access to all your control planes on Upbound
- A dashboard showing recent created composite resource claims (XRCs) for a selected control plane
- Easy access to all composite resource claim APIs on your control plane
<!-- vale alex.Condescending = YES -->
<!-- vale Upbound.Spelling = YES -->

The Consumer portal shows composite resource claim types only. If a composite resource isn't claimable, it isn't selectable in the Consumer portal. When a user selects from available composite resource claim types, the portal shows a list view of all claims associated with that type.

{{<img src="deploy/spaces/images/portal-xrc-listview.png" alt="Upbound Consumer portal list view" lightbox="true">}}

The Consumer portal offers a dynamic create form-based experience for each composite resource claim type. The form experience is dynamically created based on the schema of the composite resource's definition (XRD).

{{<img src="deploy/spaces/images/portal-xrc-crud.png" alt="Upbound Consumer portal crud" lightbox="true">}}

## Generate Kubernetes object manifests

When you create a resource using the Consumer portal, Upbound shows the Kubernetes object YAML request that's used to create this resource. You can use the portal form as a way to:

- view a sample YAML-based object request
- build your own YAML object request using a graphical interface
- copy the YAML request and use it in GitOps pipelines

<!-- vale Google.Headings = NO -->
## Design an XRD for the Consumer portal
<!-- vale Google.Headings = YES -->

To explain how the Consumer portal form dynamically renders, consider a composite resource claim with a shape like below:

```yaml
apiVersion: platform.acme.co/v1alpha1
kind: Cluster
metadata:
  name: my-cluster
  namespace: default
spec:
  parameters:
    initialNodeCount: 1
    location: eu-west-1
    networkRef:
      name: network-ref-team1
    project: my-project
```

### Resource basics

Composite resource claims are namespace-scoped objects. Every composite resource claims requires a name (`.metadata.name`) and namespace (`.metadata.namespace`). The form presents these fields in the first step of the form under a section titled **Resource basics**.

### Dynamic form steps

<!-- vale write-good.Passive = NO -->
The form experience uses `.spec.parameters` as a reserved field to dynamically generate the remaining steps in the form. Basic types defined under `.spec.parameters` are generated in the form under a section titled **General**. The fields `initialNodeCount`, `location`, and `project` are examples of this.

Object types defined under `.spec.parameters` cause new steps to be generated under their own section titled the same as the object type name. The field `networkRef` is an example of this.

The Consumer portal form only creates new steps for immediate objects under `.spec.parameters`. Nested object types are rendered as sub-sections in a step under the parent object.
<!-- vale write-good.Passive = YES -->

{{<hint "important" >}}
The Consumer portal form experience uses `.spec.parameters` as a reserved field to dynamically generate the form. Upbound recommends not using this field for any purpose other than grouping your desired user-facing inputs.
{{< /hint >}}

### Advanced

Crossplane appends a set of built-in fields onto a composite resource claim. These fields are:

- `compositeDeletePolicy`
- `compositionRef`
- `compositionRevisionRef`
- `compositionRevisionSelector`
- `compositionSelector`
- `publishConnectionDetailsTo`
- `resourceRef`
- `writeConnectionSecretToRef`

<!-- vale write-good.Passive = NO -->
These fields are advanced fields that aren't used often by most users. These fields are grouped in the final step of the form under a section titled **Advanced**.
<!-- vale write-good.Passive = YES -->

{{<hint "tip" >}}
If your composite resource definition **doesn't** use `.spec.parameters` to group user-facing inputs, the fields are collected and rendered in the Advanced section.
{{< /hint >}}
