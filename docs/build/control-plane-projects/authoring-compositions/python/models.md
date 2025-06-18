---
title: "Models"
weight: 30
aliases:
    - /core-concepts/python/models
    - core-concepts/python/models
---

Upbound Official Providers and some other packages include
[Pydantic models][pydantic-models] for their
resources. These models enable in-line documentation, linting, autocompletion,
and other features when working with Crossplane resources in embedded Python
functions.

## Make models available to a function

Use `up dependency add` to make models from a dependency available to a
function. Dependencies are most often Crossplane providers, but they can also be
configurations that include XRDs.

```console
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```

Use `up project build` to make models available for XRDs defined by your
project.

```console
up project build
```

:::tip
`up` caches Python models in the `.up/python` directory, at the root of your
project. You shouldn't commit the `.up` directory to source control.
:::

## Import models into a function

Each provider's models are available in their own package, named after the
package's resource names. Import models to your `main.py` function file with the
following syntax:

```python
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
```

:::tip
The period prefix on `.model` is important. It tells Python to look for the
model package in the same directory as `main.py`.
:::

## Use model in a function

Once you import the model, you can convert import resources to model types and
construct output resources using model types.

Crossplane passes resources to your function as generic, Python dictionary-like
objects. Convert them to model types to take advantage of type checking,
linting, and autocompletion:

:::warning

If a function is first in a composition pipeline, `req.observed.composite.resource` doesn't exist yet. Always verify this property exists before attempting to access it to prevent panic errors.

**Example**:
```python
    if "composite" in req.desired:
        if "resource" in req.desired.composite:
            if "status" in req.desired.composite.resource:
                status_xr|=req.desired.composite.resource["status"]
    resource.update(rsp.desired.composite, status_xr)
```
:::

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xmytype import v1alpha1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
    observed_bucket = bucketv1beta1.Bucket(**req.observed.resource["bucket"].resource)
```

Use `resource.update` to add composed resources to the function's response:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.aws.s3.bucket import v1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    bucket = v1beta1.Bucket(
        spec=v1beta1.Spec(
            forProvider=v1beta1.ForProvider(
                region="us-west-1",
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], bucket)
```
You can also use `resource.update` to update the desired XR:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xmytype import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    desired_xr = v1alpha1.XMyType(**req.desired.composite.resource)
    desired_xr.status.replicas = 3
    resource.update(rsp.desired.composite.resource, desired_xr)
```

:::tip
If you don't want to use a model, you can also pass `resource.update` a Python
dictionary.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    resource.update(rsp.desired.composite.resource, {
        "status: {
            "replicas": 3,
        },
    })
```
:::

## Supported packages

All Upbound Official Providers include Python models.

<!-- vale Google.WordList = NO -->
When you build your project with `up project build`, the generated artifact
contains the generated models for your XRDs. You can build a project and then
import that project as a dependency for the resources you define. You can also
use your own project's models in your functions as described above.
<!-- vale Google.WordList = YES -->

## Optional and required fields

Upbound's Python models know which resource fields Crossplane requires and which
are optional.

Required fields have a specific type, like `str` - a string.

Python raises an exception if you create a model without supplying a required
field. This can be a problem when updating the desired composite resource (XR).

You should only include the fields your function has an opinion about when you
update the desired XR. This can be a problem if for example Crossplane requires
an XR spec field, but your function only wants to update a status field.

When updating the desired XR, you can avoid issues due to required fields by
using the resource's status model directly.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    # Create a model of the XR's status.
    desired_xr_status = v1alpha1.Status()

    # Include any desired status from previous functions in the pipeline.
    if "status" in req.desired.composite.resource:
        desired_xr_status = v1alpha1.Status(**req.desired.composite.resource["status"])

    # Update only the status field your function is concerned with.
    desired_xr_status.replicas = 3

    # Dump the model as a Python dictionary.
    resource.update(rsp.desired.composite, {"status": desired_xr_status.model_dump()})
```

Optional fields have a union type with `None`, like `str | None`. This means the
field can be a string, or `None` - Python's null value.

Pydantic warns you when you copy a required field to an optional field.

For example, Pydantic warns you if you try to copy an optional `spec.region`
field from an XR to a required `spec.forProvider.region` field of an MR:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.org.example.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    desired_bucket = bucketv1beta1.Bucket(
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=observed_xr.spec.region,  # Warning: Argument of type "str | None" cannot be assigned to parameter "region" of type "str"
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

You can address this warning two ways.

If the optional field could be `None` in practice, handle that case by
specifying a default value.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.org.example.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    region = "us-west-2"
    if observed_xr.spec.region is not None:
        region = observed_xr.spec.

    desired_bucket = bucketv1beta1.Bucket(
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region=observed_xr.spec.region or "us-west-2",  # Default to "us-west-2" if region is None.
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)
```

If the optional field can't be `None` in practice, use a `type: ignore` comment
to silence the warning.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
from .model.org.example.xstoragebucket import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XStorageBucket(**req.observed.composite.resource)

    desired_bucket = bucketv1beta1.Bucket(
        from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
        metadata=metav1.ObjectMeta(
            name=observed_xr.metadata.name + "-bucket", # type: ignore  # The observed XR will always have a name.
        ),
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region="us-west-2",
            ),
        ),
    )
    resource.update(rsp.desired.resources["bucket"], desired_bucket)
```


[pydantic-models]: https://docs.pydantic.dev/latest/concepts/models/
