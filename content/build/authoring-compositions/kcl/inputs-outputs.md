---
title: "Pipeline inputs and outputs"
weight: 25
aliases:
    - core-concepts/kcl/inputs-outputs
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


```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

# These are the inputs (explained above) provided to the function
oxr = option("params").oxr
ocds = option("params").ocds
dxr = option("params").dxr
dcds = option("params").dcds

items = []
```

Check out [read pipeline state]({{<ref "read-pipeline-state">}}) for more details.

## Outputs

Your function must provide the list of resource updates at the end of execution.
KCL uses a required `items` variable where you list your composed or modified
composite resources.

```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

# This is the observed composite resource, provided as an input to the function
oxr = option("params").oxr

_items = [
    v1beta1.Instance {
        metadata: _metadata("virtual-machine")
        spec.forProvider = {
            associatePublicIpAddress: True
            ipv6Addresses: ["192.168.1.1"]
            availabilityZone: oxr.spec.parameters.locaton
            cpuCoreCount: 10
        }
    }
]

# This function composes an EC2 instance.
items = _items
```

The `items` variable should contain only valid composed resource objects, otherwise the function fails and emits an error like below:

```bash
cannot compose resources: cannot generate a name for composed resource "": Object 'Kind' is missing in 'unstructured object has no kind'
```

This can happen when the `items` array is mistakenly populated by the wrong data.
