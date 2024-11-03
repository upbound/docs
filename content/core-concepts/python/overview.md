---
title: "Overview"
weight: 1
---

Upbound supports defining your control plane APIs in the
[Python](https://www.python.org) language.

Python functions can make use of all built-in Python features, the Python
standard library, and the Crossplane
[Python Function SDK](https://github.com/crossplane/function-sdk-python).

{{<hint "tip">}}
If you'd like to become more familiar with Python, the
[official tutorial](https://docs.python.org/3/tutorial/) is a good place
to start.
{{</hint>}}

## Prerequisites

To define your control plane APIs in Python you need Python and the Python
Visual Studio Code extension. Refer to the
[Visual Studio Code Extensions documentation]({{<ref "development-extensions/vscode-extensions.md">}})
to learn how to install them.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.

{{< content-selector options="Function,XRD,Composition" default="Function" >}}

<!-- Function -->

The function `main.py` file below takes a composite resource (XR) as input. It
produces a Bucket managed resource (MR) from the
[S3 provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from model.com.example.platform.xstoragebucket import v1alpha1
from model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Load the observed XR into a Pydantic model.
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    # The XR's region isn't a required field - it could be omitted.
    # Handle this by setting a default value of "us-west-2".
    region = "us-west-2"
    if observed_xr.spec.region is not None:
        region = observed_xr.spec.region

    # Tell Crossplane to compose an S3 bucket.
    desired_bucket = bucketv1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

Expand the example below to see a more advanced Python function.

{{<expand "A more advanced Python function">}}

The function `main.py` file below takes a composite resource (XR) as input and
produces managed resources (MRs) from the
[S3 provider](https://marketplace.upbound.io/providers/upbound/provider-aws-s3)
based on its parameters.

The function always composes an S3 bucket. When the S3 bucket exists, it also
composes a bucket access control list (ACL). The ACL references the bucket by
name.

If the composite resource's `spec.versioning` field is `True`, the function
enables versioning by composing a bucket versioning configuration. Like the ACL,
the versioning configuration references the bucket by name.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from model.com.example.platform.xstoragebucket import v1alpha1
from model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
from model.io.upbound.aws.s3.bucketversioning import v1beta1 as verv1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Load the observed XR into a Pydantic model.
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    # The XR's region isn't a required field - it could be omitted.
    # Handle this by setting a default value of "us-west-2".
    region = "us-west-2"
    if observed_xr.spec.region is not None:
        region = observed_xr.spec.region

    # Tell Crossplane to compose an S3 bucket.
    desired_bucket = bucketv1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    # Return early if the desired Bucket doesn't appear as an observed resource.
    # This means it doesn't exist yet. The function will be called again when it
    # does.
    if "bucket" not in req.observed.resources:
        return

    # Load the observed bucket into a Pydantic model.
    observed_bucket = bucketv1beta1.Bucket(**req.observed.resources["bucket"].resource)

    # The BucketACL and BucketVersioning MRs below refer to the Bucket by its
    # crossplane.io/external-name annotation. Return early if the observed
    # Bucket doesn't have that annotation yet.
    if observed_bucket.metadata is None or observed_bucket.metadata.annotations is None:
        return

    if "crossplane.io/external-name" not in observed_bucket.metadata.annotations:
        return

    # Tell Crossplane to compose a bucket ACL.
    desired_acl = aclv1beta1.BucketACL(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketACL",
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                region=region,
                bucket=observed_bucket.metadata.annotations[
                    "crossplane.io/external-name"
                ],
                acl=observed_xr.spec.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket-acl"], desired_acl)

    # Return early without including a desired BucketVersioning composed
    # resource if the XR doesn't enable versioning.
    if not observed_xr.spec.versioning:
        return

    # Tell Crossplane to compose a bucket versioning configuration.
    desired_versioning = verv1beta1.BucketVersioning(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="BucketVersioning",
        spec=verv1beta1.Spec(
            forProvider=verv1beta1.ForProvider(
                region=region,
                bucket=observed_bucket.metadata.annotations[
                    "crossplane.io/external-name"
                ],
                versioningConfiguration=[
                    verv1beta1.VersioningConfigurationItem(
                        status="Enabled",
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket-versioning"], desired_versioning)
```

{{</expand>}}

<!-- /Function -->

<!-- XRD -->

The Python function operates on an XR that looks like this:

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
      name: upbound-example-project-awscompose-bucket-python
    step: compose-bucket-python
  - functionRef:
      name: crossplane-contrib-function-auto-ready
    step: crossplane-contrib-function-auto-ready
```

<!-- /Composition -->

{{< /content-selector >}}

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound. [Concepts](/core-concepts/) describes
these concepts with examples available in Python.

Upbound builds embedded Python functions on top of Crossplane's [Python
function SDK](https://github.com/crossplane/function-sdk-python), offering a
simplified, Upbound-specific development experience.

<!-- vale gitlab.HeadingContent = NO -->

## Limitations

Embedded Python functions don't currently support using third party Python
packages like those from https://pypi.org.

<!-- vale gitlab.HeadingContent = YES -->