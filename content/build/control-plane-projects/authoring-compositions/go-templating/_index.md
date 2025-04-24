---
title: "Build with Go Templating"
weight: 1
---

Upbound supports defining your control plane APIs using YAML with [Go
templates](https://pkg.go.dev/text/template).

Go templating functions can make use of all built-in Go templating features and
anything supported by Crossplane's
[function-go-templating](https://github.com/crossplane-contrib/function-go-templating?tab=readme-ov-file#function-go-templating).

Templates can be written in multiple files with an arbitrary directory
structure, as long as all files have the `.gotmpl` file extension. Templates
will be read in lexical order and concatenated with YAML separators (`---`)
between them.

## Prerequisites

To define your control plane APIs using Go templating you need the YAML Visual
Studio Code extension and optionally the Modelines extension. Refer to the
[Visual Studio Code Extensions documentation]({{<ref
"reference/vscode-extensions">}}) to learn how to install them.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.

{{< content-selector options="Function,XRD,Composition" default="Function" >}}

<!-- Function -->

The `01-compose.yaml.gotmpl` file below takes a composite resource (XR) as
input. It produces a Bucket managed resource (MR) from the [S3
provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

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

Expand the example below to see a more advanced Go templating function.

{{<expand "A more advanced Go templating function">}}

The files below take a composite resource (XR) as input and produces managed
resources (MRs) from the [S3
provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters. The templates are split across multiple files for
readability.

The function always composes an S3 bucket. When the S3 bucket exists, it also
composes a bucket access control list (ACL). The ACL references the bucket by
name.

If the composite resource's `spec.versioning` field is `true`, the function
enables versioning by composing a bucket versioning configuration. Like the ACL,
the versioning configuration references the bucket by name.

Note that we place Go templating flow control (`if` statements, loops, variable
assignments, etc.) in YAML comments. This is not strictly necessary, but makes
the YAML editor extension work better.

## 00-prelude.yaml.gotmpl

This file contains generated boilerplate to place the observed composite
resource and its parameters in Go templating variables, for use by subsequent
templates.

```yaml
#{{ $xr := getCompositeResource . }}
#{{ $params := $xr.spec.parameters }}
```

## 01-bucket.yaml.gotmpl

This file creates the `Bucket` MR, then checks whether its external name has
been set (i.e., it has been processed by Crossplane) and places the external
name in a Go templating variable if available.

<!-- TODO This should be yaml, but markdown barfs on it. -->

```text
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
    region: "{{ $params.region }}"

# The desired ACL, encryption, and versioning resources all need to refer to the
# bucket by its external name, which is stored in its external name
# annotation. Fetch the external name into a variable so subsequent templates
# can use it.
#
#{{ $bucket := getComposedResource . "bucket" }}
#{{ $bucket_external_name := "" }}
#{{ if $bucket }}
#{{ $bucket_external_name = get $bucket.metadata.annotations "crossplane.io/external-name" }}
#{{ end }}
```

## 02-acl.yaml.gotmpl

This file creates the `BucketACL` MR. Since this MR requires the bucket's
external name, the template produces the MR only when the external name is
available.

```text
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

# Don't create the ACL until the bucket name is available.
#{{ if $bucket_external_name }}
---
apiVersion: s3.aws.upbound.io/v1beta1
kind: BucketACL
metadata:
  annotations:
    {{ setResourceNameAnnotation "acl" }}
spec:
  forProvider:
    region: "{{ $params.region }}"
    bucket: "{{ $bucket_external_name }}"
    acl: "{{ $params.acl }}"
#{{ end }}
```

## 03-versioning.yaml.gotmpl

This file creates the `BucketVersioning` MR when the XR has versioning
enabled. Like the `BucketACL`, this MR requires the bucket's external name, so
the template produces the MR only after the external name is available.

```text
# code: language=yaml
# yaml-language-server: $schema=../../.up/json/models/index.schema.json

#{{ if $params.versioning }}
# Don't create the BucketVersioning until the bucket name is available.
#{{ if $bucket_external_name }}
---
apiVersion: s3.aws.upbound.io/v1beta1
kind: BucketVersioning
metadata:
  annotations:
    {{ setResourceNameAnnotation "versioning" }}
spec:
  forProvider:
    region: "{{ $params.region }}"
    bucket: "{{ $bucket_external_name }}"
    versioningConfiguration:
      - status: Enabled

#{{ end }}
#{{ end }}
```

{{</expand>}}

<!-- /Function -->

<!-- XRD -->

The Go templates operate on an XR that looks like this:

```yaml
apiversion: platform.example.com
kind: XStorageBucket
metadata:
  name: example-bucket
spec:
  region: us-west-1
  acl: private
  versioning: true
```

The following is the composite resource definition (XRD) for this example, which
generated the `v1alpha1.XStorageBucket` type used in the embedded function.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xstoragebuckets.platform.example.com
spec:
  claimNames:
    kind: StorageBucket
    plural: storagebuckets
  group: platform.example.com
  names:
    categories:
    - crossplane
    kind: XStorageBucket
    plural: xstoragebuckets
  versions:
  - name: v1alpha1
    referenceable: true
    schema:
      openAPIV3Schema:
        description: StorageBucket is the Schema for the StorageBucket API.
        properties:
          spec:
            description: StorageBucketSpec defines the desired state of StorageBucket.
            properties:
              acl:
                type: string
              region:
                type: string
              versioning:
                type: boolean
            type: object
          status:
            description: StorageBucketStatus defines the observed state of StorageBucket.
            type: object
        required:
        - spec
        type: object
    served: true
```

<!-- /XRD -->

<!-- Composition -->

The composition invokes the function to compose resources for an XR, then
invokes [`function-auto-ready`](https://marketplace.upbound.io/functions/crossplane-contrib/function-auto-ready/v0.3.0).
`function-auto-ready` automatically marks the XR as ready when the composed MRs
are ready.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xstoragebuckets.platform.example.com
spec:
  compositeTypeRef:
    apiVersion: platform.example.com/v1alpha1
    kind: XStorageBucket
  mode: Pipeline
  pipeline:
  - functionRef:
      name: upbound-example-project-awscompose-bucket-go-templating
    step: compose-bucket-go-templating
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

<!-- /Composition -->

{{< /content-selector >}}

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound.

<!--- TODO(tr0njavolta): add link to control plane projects --->

Upbound builds embedded Go templating functions on top of Crossplane's
[function-go-templating](https://github.com/crossplane-contrib/function-go-templating),
offering a simplified, Upbound-specific development experience.
