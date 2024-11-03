---
title: "Models"
weight: 30
---

Upbound Official Providers and some other packages include
[Pydantic models](https://docs.pydantic.dev/latest/concepts/models/) for their
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

{{<hint "tip">}}
`up` caches Python models in the `.up/python` directory, at the root of your
project. You shouldn't commit the `.up` directory to source control.
{{</hint>}}

## Import models into a function

Each provider's models are available in their own package, named after the
package's resource names. Import models to your `main.py` function file with the
following syntax:

```python
from model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
```

## Use model in a function

Once you import the model, you can convert import resources to model types and
construct output resources using model types.

Crossplane passes resources to your function as generic, Python dictionary-like
objects. Convert them to model types to take advantage of type checking,
linting, and autocompletion:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from model.com.example.platform.xmytype import v1alpha1
from model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
    observed_bucket = bucketv1beta1.Bucket(**req.observed.resource["bucket"].resource)
```

Use `resource.update` to add composed resources to the function's response:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from model.io.upbound.aws.s3.bucket import v1beta1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    bucket = v1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
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

from model.com.example.platform.xmytype import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    desired_xr = v1alpha1.XMyType(**req.desired.composite.resource)
    desired_xr.status.replicas = 3
    resource.update(rsp.desired.composite.resource, desired_xr)
```

{{<hint "tip">}}
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

{{</hint>}}

## Supported packages

All Upbound Official Providers include Python models.

<!-- vale Google.WordList = NO -->
When you build your project with `up project build`, the generated artifact
contains the generated models for your XRDs. You can build a project and then
import that project as a dependency for the resources you define. You can also
use your own project's models in your functions as described above.
<!-- vale Google.WordList = YES -->
