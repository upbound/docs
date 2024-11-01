---
title: "Authoring your APIs within Control Plane Projects"
weight: 3
description: "Define your first API in your control plane project"
---

Let's author your first API within your control plane project. APIs are defined by XRDs (composite resource definitions). The easiest way to generate an XRD is to start with a claim (XRC), then use the Up CLI to generate an XRD from it.


## Generating an XRD from a XRC
In the root folder of your control plane project, run the [up example generate]() command.

```shell
up example generate

What do you want to create?: 
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: Bucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/bucket/example.yaml
```

After following the interactive steps, you should have an empty claim generated under examples/bucket/example.yaml. Next, open the claim file you generated, and paste in the content below.

```yaml
apiVersion: devexdemo.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
spec:
  versioning: true
  encrypted: true
  visibility: public
```

Next, run the following command

```shell
up xrd generate examples/bucket/example.yaml
```

Your XRD will be automatically generated for you inside `apis/xbuckets/definition.yaml`. You can check the contents of the XRD below.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xbuckets.devexdemo.upbound.io
spec:
  claimNames:
    kind: Bucket
    plural: buckets
  group: devexdemo.upbound.io
  names:
    categories:
    - crossplane
    kind: XBucket
    plural: xbuckets
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: Bucket is the Schema for the Bucket API.
        properties:
          spec:
            description: BucketSpec defines the desired state of Bucket.
            properties:
              encrypted:
                type: boolean
              versioning:
                type: boolean
              visibility:
                type: string
            type: object
          status:
            description: BucketStatus defines the observed state of Bucket.
            type: object
        required:
        - spec
        type: object
    served: true
```