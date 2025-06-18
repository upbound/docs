---
title: "Build with Python"
weight: 1
aliases:
    - /core-concepts/python/overview
    - core-concepts/python/overview
---

Upbound supports defining your control plane APIs in the
[Python][python] language.

Python functions can make use of all built-in Python features, the Python
standard library, and the Crossplane
[Python Function SDK][python-function-sdk].

:::tip
If you'd like to become more familiar with Python, the
[official tutorial][official-tutorial] is a good place
to start.
:::

## Prerequisites

To define your control plane APIs in Python you need Python and the Python
Visual Studio Code extension. Refer to the
[Visual Studio Code Extensions documentation][visual-studio-code-extensions-documentation]
to learn how to install them.

## Example

The following example function composes an S3 bucket based on a simplified
bucket XRD.

<Tabs>
<TabItem value="Funciton" label="Function">

The function `main.py` file below takes a composite resource (XR) as input. It
produces a Bucket managed resource (MR) from the
[S3 provider][s3-provider]
based on its parameters.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xstoragebucket import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Load the observed XR into a Pydantic model.
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    # Tell Crossplane to compose an S3 bucket.
    desired_bucket = bucketv1beta1.Bucket(
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=observed_xr.spec.region or "us-west-2",
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

Expand the example below to see a more advanced Python function.

<details>

<summary>A more advanced Python function</summary>

The function `main.py` file below takes a composite resource (XR) as input and
produces managed resources (MRs) from the
[S3 provider][s3-provider-1]
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

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.com.example.platform.xstoragebucket import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
from .model.io.upbound.aws.s3.bucketownershipcontrols import v1beta1 as bocv1beta1
from .model.io.upbound.aws.s3.bucketpublicaccessblock import v1beta1 as pabv1beta1
from .model.io.upbound.aws.s3.bucketversioning import v1beta1 as verv1beta1
from .model.io.upbound.aws.s3.bucketserversideencryptionconfiguration import (
    v1beta1 as ssev1beta1,
)


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)
    params = observed_xr.spec.parameters

    desired_bucket = bucketv1beta1.Bucket(
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=params.region,
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)

    # The desired ACL, encryption, and versioning resources all need to refer to
    # the bucket by its external name, which is stored in its external name
    # annotation. Return early if the Bucket's external-name annotation isn't
    # set yet.
    if "bucket" not in req.observed.resources:
        return

    observed_bucket = bucketv1beta1.Bucket(**req.observed.resources["bucket"].resource)
    if observed_bucket.metadata is None or observed_bucket.metadata.annotations is None:
        return
    if "crossplane.io/external-name" not in observed_bucket.metadata.annotations:
        return

    bucket_external_name = observed_bucket.metadata.annotations[
        "crossplane.io/external-name"
    ]

    desired_acl = aclv1beta1.BucketACL(
        spec=aclv1beta1.Spec(
            forProvider=aclv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                acl=params.acl,
            ),
        ),
    )
    resource.update(rsp.desired.resources["acl"], desired_acl)

    desired_boc = bocv1beta1.BucketOwnershipControls(
        spec=bocv1beta1.Spec(
            forProvider=bocv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                rule=[
                    bocv1beta1.RuleItem(
                        objectOwnership="BucketOwnerPreferred",
                    ),
                ],
            )
        ),
    )
    resource.update(rsp.desired.resources["boc"], desired_boc)

    desired_pab = pabv1beta1.BucketPublicAccessBlock(
        spec=pabv1beta1.Spec(
            forProvider=pabv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                blockPublicAcls=False,
                ignorePublicAcls=False,
                restrictPublicBuckets=False,
                blockPublicPolicy=False,
            )
        ),
    )
    resource.update(rsp.desired.resources["pab"], desired_pab)

    desired_sse = ssev1beta1.BucketServerSideEncryptionConfiguration(
        spec=ssev1beta1.Spec(
            forProvider=ssev1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                rule=[
                    ssev1beta1.RuleItem(
                        applyServerSideEncryptionByDefault=[
                            ssev1beta1.ApplyServerSideEncryptionByDefaultItem(
                                sseAlgorithm="AES256",
                            ),
                        ],
                        bucketKeyEnabled=True,
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["sse"], desired_sse)

    # Return early without composing a BucketVersioning MR if the XR doesn't
    # have versioning enabled.
    if not params.versioning:
        return

    desired_versioning = verv1beta1.BucketVersioning(
        spec=verv1beta1.Spec(
            forProvider=verv1beta1.ForProvider(
                region=params.region,
                bucket=bucket_external_name,
                versioningConfiguration=[
                    verv1beta1.VersioningConfigurationItem(
                        status="Enabled",
                    ),
                ],
            ),
        ),
    )
    resource.update(rsp.desired.resources["versioning"], desired_versioning)
```

</details>

</TabItem>

<TabItem value="XRD" label="XRD">

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
</TabItem>


<TabItem value="Composition" label="Composition">

The composition invokes the function to compose resources for an XR, then
invokes [`function-auto-ready`][function-auto-ready].
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

</TabItem>
</Tabs>

## Control plane project model

The Upbound programming model defines the core concepts you can use when
creating your control plane using Upbound.


Upbound builds embedded Python functions on top of Crossplane's [Python
function SDK][python-function-sdk-2], offering a
simplified, Upbound-specific development experience.

<!-- vale gitlab.HeadingContent = NO -->

## Limitations

Embedded Python functions don't currently support using third party Python
packages like those from https://pypi.org.

<!-- vale gitlab.HeadingContent = YES -->


[visual-studio-code-extensions-documentation]: /usage/vscode-extensions
[python]: https://www.python.org
[python-function-sdk]: https://github.com/crossplane/function-sdk-python
[official-tutorial]: https://docs.python.org/3/tutorial/
[s3-provider]: https://marketplace.upbound.io/providers/upbound/provider-aws-s3
[s3-provider-1]: https://marketplace.upbound.io/providers/upbound/provider-aws-s3
[function-auto-ready]: https://marketplace.upbound.io/functions/crossplane-contrib/function-auto-ready/v0.3.0
[python-function-sdk-2]: https://github.com/crossplane/function-sdk-python
