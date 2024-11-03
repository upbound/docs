---
title: "Models"
weight: 30
---

Upbound Official Providers and some other packages include [Pydantic
models](https://docs.pydantic.dev/latest/concepts/models/) for their resources.
These models enable in-line documentation, linting, autocompletion, and other
features when working with Crossplane resources in embedded Python functions.

<!-- vale Microsoft.Auto = NO -->

The `up dependency add` command unpacks dependencies that contain Python models
into the `.up/python` directory in your project. You can skip adding the `
.up` directory to source control, as `up` commands (like `up project build` or `up project run`) auto-populate it, or you can manually populate it with `up dependency update-cache`.
<!-- vale Microsoft.Auto = YES -->

## Import models into a function

Each provider's models are available in their own package, named after the
package's resource names. You can import models to your `main.py` function file with the following syntax:

```python
from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
```
<!-- vale write-good.Passive = NO -->
{{<hint "important">}}
The leading `.` on the import path is required because models are
kept alongside your function's source files.
{{</hint>}}
<!-- vale write-good.Passive = YES -->

## Using model types

Once you import the model, you can convert import resources to model types and
construct output resources using model types.

<!-- vale write-good.Passive = NO -->

Input resources like the observed composite resource are passed to functions as
generic structures. You can convert them to model types to take advantage of
type checking, linting, and autocompletion:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.com.example.platform.xmytype import v1alpha1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
```

Output resources from a function are also generic structures, but they can be
generated using typed models:
<!-- vale write-good.Passive = YES -->

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.io.upbound.aws.s3.bucket import v1beta1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    bucket = v1beta1.Bucket(
        apiVersion="s3.aws.upbound.io/v1beta1",
        kind="Bucket",
        metadata=metav1.ObjectMeta(
            name="composed-bucket",
        ),
        spec=bucketv1beta1.Spec(
            forProvider=bucketv1beta1.ForProvider(
                region="us-west-1",
            ),
        ),
    )
    resource.update(rsp.desired.resources[bucket.metadata.name], bucket)
```

## Supported packages

All Upbound Official Providers include Python models.

<!-- vale Google.WordList = NO -->
When you build your project with `up project build`, the generated artifact
contains the generated models for your XRDs. You can build a project and then
import that project as a dependency for the resources you define. You can also
use your own project's models in your functions as described above.
<!-- vale Google.WordList = YES -->
