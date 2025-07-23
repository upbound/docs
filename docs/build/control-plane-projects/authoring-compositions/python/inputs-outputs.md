---
title: "Pipeline inputs and outputs"
weight: 25
aliases:
    - /core-concepts/python/inputs-outputs
    - core-concepts/python/inputs-outputs
---

Crossplane sends requests to your functions to ask them what resources to
compose for a given composite resource (XR). Your function answers with a
response.

## Inputs

Compositions execute a pipeline of one or more sequential functions. A
function updates desired resource state and returns it to Crossplane. Function
requests contain four pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function's input.
4. The function pipeline's context.

Each composition pipeline provides this information as _inputs_ into the
function.

Crossplane passes these pieces of information to the function as part of the
`req: RunFunctionRequest` argument:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed = req.observed     # Observed state
    desired = req.desired       # Desired state
    input = req.input           # Function input
    context = req.context       # Function pipeline context
    extra = req.extra_resources # Any extra resources the function pipeline requested
```

:::tip
You can select the `RunFunctionRequest` object in Visual Studio Code to see what
fields it has.

The Python function SDK generates the `RunFunctionRequest` object from a
protobuf definition. Read the
[Python Generated Code Guide][python-generated-code-guide]
to learn about protobuf generated code.
:::

Most functions reference the observed composite resource (XR) to produce
composed resources, typically managed resources (MRs). In Python, you can find
the observed XR in `req.observed.composite.resource`.

When you generate an embedded function with `up function generate`, the command
creates a Python library that includes type definitions based on your XRDs. You
can convert the observed XR to its Python type as follows:

```python
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xmytype import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
```

After this, Visual Studio Code adds tab-completion and type checking when
working with the XR.

## Outputs

Composition functions influence the state of the control plane via three kinds
of outputs:

<!-- vale write-good.TooWordy = NO -->
1. The desired state of the composite resource, and composed resources.
2. Status conditions to apply to the composite resource and, optionally,
   its claim.
3. Context to pass to subsequent functions in the pipeline.
<!-- vale write-good.TooWordy = YES -->

Most functions produce a set of composed resources as part of the desired
state.

In Python, outputs are part of the `rsp: RunFunctionResponse` argument, which is
pre-populated with the request's desired state and context. A Python function
only needs to update any fields in these objects that it wishes to change.

:::tip
You can select the `RunFunctionResponse` object in Visual Studio Code to see
what fields it has.

The Python function SDK generates the `RunFunctionResponse` object from a
protobuf definition. Read the
[Python Generated Code Guide][python-generated-code-guide-1]
to learn about protobuf generated code.
:::

You can add or update composed resources using the `resource.update` helper
function in the Crossplane Python SDK:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    composed = ... # Construct a composed resource
    resource.update(rsp.desired.resources["my-resource"], composed)
```

Similarly, you can update the status of the composite resource by updating it in
the response:

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1

from .model.com.example.platform.xmytype import v1alpha1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    observed_xr = v1alpha1.XMyType(**req.observed.composite.resource)
    observed_xr.status.someInformation = "cool-status"
    resource.update(rsp.desired.composite, observed_xr)
```

:::tip
If you don't want to use a model, you can also pass `resource.update` a Python
dictionary.

```python
from crossplane.function import resource
from crossplane.function.proto.v1 import run_function_pb2 as fnv1


def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
    resource.update(rsp.desired.composite, {
        "status": {
            "replicas": 3,
        },
    })
```
:::


[python-generated-code-guide]: https://protobuf.dev/reference/python/python-generated/
[python-generated-code-guide-1]: https://protobuf.dev/reference/python/python-generated/
