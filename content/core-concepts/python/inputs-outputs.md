---
title: "Pipeline inputs and outputs"
weight: 25
---

Functions require inputs and outputs to process requests and return values to
your control plane.

## Inputs

Compositions execute in a pipeline of one or more sequential functions. A
function updates desired resource state and returns it to Crossplane. Function
requests and values rely on four pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function's input.
4. The function pipeline's context.

Each composition pipeline provides this information as _inputs_ into the function.

In Python, these four pieces of information are passed to the function as part
of the `req: RunFunctionRequest` argument:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed = req.observed # Observed state
    desired = req.desired   # Desired state
    input = req.input       # Function input
    context = req.context   # Function pipeline context
```

Most functions reference the observed composite resource (XR) to produce
composed resources, most commonly managed resources (MRs). In Python, the
observed XR can be found in `req.observed.composite.resource`.

When you generate an embedded function with `up function generate`, a Python
library is generated that includes type definitions based on your XRDs. You can
convert the observed XR to its Python type as follows:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.com.example.platform.xmytype import v1alpha1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
```

You will then get tab-completion and type checking in VSCode when working with
the XR.

## Outputs

Composition functions influence the state of the control plane via three kinds
of outputs:

1. The desired state of the composite resource, and composed resources.
2. Status conditions to be applied to the composite resource and, optionally,
   its claim.
3. Context to be passed to subsequent functions in the pipeline.

Most functions will produce a set of composed resources as part of the desired
state.

In Python, outputs are part of the `res: RunFunctionResponse` argument, which is
pre-populated with the request's desired state and context. A Python function
only needs to update any fields in these objects that it wishes to change.

Composed resources can be added or updated using the `resource.update` helper
function from the Crossplane Python SDK:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    composed = ... # Construct a composed resource
    resource.update(rsp.desired.resources[composed.metadata.name], composed)
```

Similarly, you can update the status of the composite resource by updating it in
the response:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1
from .model.com.example.platform.xmytype import v1alpha1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
    observed_xr.status.someInformation = "cool-status"
    resource.update(rsp.desired.composite.resource, observed_xr)
```
