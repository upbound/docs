---
title: "Pipeline inputs and outputs"
weight: 25
---

Functions require inputs and outputs to process requests and return values to
your control plane.

{{<hint "tip">}}

See the Crossplane [function-go-templating
documentation](https://github.com/crossplane-contrib/function-go-templating?tab=readme-ov-file#function-go-templating)
for the full set of inputs, outputs, and other features supported by Go
templating.

{{</hint>}}

## Inputs

Compositions execute in a pipeline of one or more sequential functions. A
function updates desired resource state and returns it to Crossplane. Function
requests and values rely on three pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function pipeline's context.

Each composition pipeline provides this information as _inputs_ into the function.

Function inputs are available to Go templates in the following template inputs,
which templates can access directly or with helper functions:

* Observed state: `.observed`
  * The `getCompositeResource` helper function fetches the observed composite resource.
  * The `getComposedResource` helper function looks up an observed composed resource.
* Desired state: `.desired`
* Pipeline context: `.context`

## Outputs

To add resources to the pipeline's desired composed resources, define them in
the template. Use the `gotemplating.fn.crossplane.io/composition-resource-name`
annotation to define unique names for each resource. This allows you to update a
resource rather than create a new one on subsequent functions runs. The
`setResourceNameAnnotation` helper function will set this annotation:

```yaml
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

---
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  annotations:
    {{ setResourceNameAnnotation "bucket" }}
spec:
  forProvider:
    region: "{{ $xr.spec.parameters.region }}"
```

To update the composite resource's status, have your templates output a resource
of the composite's type _without_ the `composition-resource-name` annotation:

```yaml
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

---
apiVersion: devexdemo.upbound.io/v1alpha1
kind: XBucket
status:
  someInformation: cool-status
```

To set conditions on the claim and composite, you can add a `ClaimConditions`
resource to your templates:

```yaml
apiVersion: meta.gotemplating.fn.crossplane.io/v1alpha1
kind: ClaimConditions
conditions:
- type: BucketReady
  status: "True"
  reason: Ready
  message: Bucket is ready
  target: CompositeAndClaim
```
