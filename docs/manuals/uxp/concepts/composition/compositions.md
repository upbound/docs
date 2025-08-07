---
title: Compositions
sidebar_position: 3
description: Compositions are a template for creating composite resources
---

Compositions are declarative templates that allow you to create multiple
resources as a _composite resource_ in a single file. 

Compositions define how your individual resources should be created and managed.
When a user or system requests a resources that matches a composition, your
control plane:

- Parses the composition to understand what resources to create
- Provisions the resources according to the rules and definitions in your XRD.
- Links the resources it creates together to define them as a single unit.

A Composition _composes_ individual resources together into a larger, reusable,
solution. An example Composition may combine a virtual machine, storage
resources and networking policies. A Composition template links all these
individual resources together.

Here's an example Composition. When you create an
<Hover label="intro" line="8">AcmeBucket</Hover> composite resource
(XR) that uses this Composition, Crossplane uses the template to create the
Amazon S3 <Hover label="intro" line="18">Bucket</Hover> managed
resource.

<div id="intro">
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: example
spec:
  compositeTypeRef:
    apiVersion: custom-api.example.org/v1alpha1
    kind: AcmeBucket
  mode: Pipeline
  pipeline:
  - step: patch-and-transform
    functionRef:
      name: function-patch-and-transform
    input:
      apiVersion: pt.fn.crossplane.io/v1beta1
      kind: Resources
      resources:
      - name: storage-bucket
        base:
          apiVersion: s3.aws.m.upbound.io/v1beta1
          kind: Bucket
          spec:
            forProvider:
              region: "us-east-2"
```
</div>

<details>
  <summary>What are XRs, XRDs and Compositions?</summary>
  A [composite resource][xrs] or XR is a custom API.

You use two Crossplane types to create a new custom API:

* A [Composite Resource Definition][xrds]
  (XRD) - Defines the XR's schema.
* A Composition - This page. Configures how the XR creates
  other resources.
</details>

[xrds]: /manuals/uxp/concepts/composition/composite-resource-definitions/
[xrs]: /manuals/uxp/concepts/composition/composite-resources/
[composition]: /manuals/uxp/concepts/composition/compositions/
[k8s]: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/

