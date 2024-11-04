---
title: "Overview"
weight: 1
---

Upbound supports defining your control plane APIs in the
[Python](https://www.python.org) language.

## Prerequisites

Install the following:

- [Python 3](https://www.python.org/downloads/)
- [Python VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

The Python VSCode extension includes the
[Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)
language server, so you do not need to install a language server separately.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.

{{< tabs >}}

{{< tab "Embedded Function" >}}

The function file below takes a composite resource (XR) as input and produces
managed resources (MRs) from the [S3
provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.com.example.platform.xstoragebucket import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
from .model.io.upbound.aws.s3.bucketversioning import v1beta1 as verv1beta1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    xr_name = observed_xr.metadata.name
    bucket_name = xr_name + "-bucket"

    bucket = bucketv1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        metadata=metav1.ObjectMeta(
            name=bucket_name,
        ),
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=observed_xr.spec.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources[bucket.metadata.name], bucket)

    acl = aclv1beta1.BucketACL(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketACL",
        metadata=metav1.ObjectMeta(
            name=xr_name + "-acl",
        ),
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                region=observed_xr.spec.region,
                bucketRef=aclv1beta1.BucketRef(
                    name = bucket_name,
                ),
                acl=observed_xr.spec.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources[acl.metadata.name], acl)

    if observed_xr.spec.versioning:
        versioning = verv1beta1.BucketVersioning(
            apiVersion="s3.aws.upbound.io/v1beta1",
            kind="BucketVersioning",
            metadata=metav1.ObjectMeta(
                name=xr_name + "-versioning",
            ),
            spec=verv1beta1.Spec(
                forProvider=verv1beta1.ForProvider(
                    region=observed_xr.spec.region,
                    bucketRef=verv1beta1.BucketRef(
                        name=bucket_name,
                    ),
                    versioningConfiguration=[
                        verv1beta1.VersioningConfigurationItem(
                            status="Enabled",
                        ),
                    ],
                ),
            )
        )
        resource.update(rsp.desired.resources[versioning.metadata.name], versioning)
```

{{< /tab >}}

{{< tab "XRD" >}}

The following is the composite resource definition (XRD) for this example. This
definition was used to generate the `v1alpha1.XStorageBucket` type used in the
embedded function.

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

{{< /tab >}}

{{< tab "Composition" >}}

The composition invokes the function to compose resources for an XR, then
invokes
[`function-auto-ready`](https://marketplace.upbound.io/functions/crossplane-contrib/function-auto-ready/v0.3.0)
to automatically set the XR status based on the status of the generated MRs.

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
      name: upbound-example-project-awscompose-bucket-python
    step: compose-bucket-python
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

{{< /tab >}}

{{< /tabs >}}

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound. [Concepts](/core-concepts/) describes
these concepts with examples available in Python.

Embedded Python functions in Upbound are built on top of Crossplane's [Python
function SDK](https://github.com/crossplane/function-sdk-python), but offer a
simplified, Upbound-specific development experience.

## Limitations

Python is a general purpose programming language with a rich ecosystem of
libraries and tools. Embedded Python functions support all built-in Python
features, the Python standard library, and the Crossplane [Python Function
SDK](https://github.com/crossplane/function-sdk-python). Using external
libraries is currently not supported.
