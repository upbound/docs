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
3. The function’s input.
4. The function pipeline’s context.

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

Check out [read pipeline state](./read-pipeline-state.md) for more details.

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