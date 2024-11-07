---
title: "Authoring an API in your Control Plane Projects"
weight: 3
description: "Define your first API in your control plane project"
---

Your control plane relies on an API to communicate with your external resources.
You can create an API with a Composite Resource Definition (XRD). XRDs are API
schemas that define the structure of your desired resources. You provide the
fields and acceptable values and your control plane can communicate with your
external systems based on that structure.

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
## Generate an XRD from a XRC
<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->

Instead of creating an XRD from scratch, you can create an XRD that's based on a
Claim (XRC). Claims serve as the primary interface through which users provision
resources. They define the minimal input parameters required from users, which
the `up` CLI then interprets to generate a comprehensive resource
configuration schema.

### Generate an example claim

In the root folder of your control plane project, run the [up example generate]({{< ref
"reference/cli/command-reference" >}}) command.
<!--- TODO(tr0njavolta): update CLI link --->

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

After following the interactive steps, you should have an empty claim generated under `examples/bucket/example.yaml`. Next, open the claim file you generated, and paste in the content below.

```yaml
apiVersion: devexdemo.upbound.io/v1alpha1
kind: Bucket
metadata:
  name: example
  namespace: default
parameters:
  versioning: true
  encrypted: true
  visibility: public
```

It's a Crossplane best practice to contain the configuration parameters for a
claim in a `parameters` object rather than at the top level of the
`spec`. Crossplane adds its own fields to the spec when it processes the XRD
at installation time.

<!-- vale Google.Headings = NO -->
### Generate the XRD
<!-- vale Google.Headings = YES -->

Next, run the `up xrd generate` command with the path to your example claim.

```shell
up xrd generate examples/bucket/example.yaml
```

The `up` CLI automatically generates the XRD and places it in
`apis/xbuckets/definition.yaml` in your directory. Open the XRD to examine the structure.

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
              parameters:
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
status:
  controllers:
    compositeResourceClaimType:
      apiVersion: ""
      kind: ""
    compositeResourceType:
      apiVersion: ""
      kind: ""
```