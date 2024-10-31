---
title: "Pipeline inputs and outputs"
weight: 25
---

## Inputs

Compositions execute in a pipeline of one or more sequential functions. A function's job is to update desired resource state and return it to Crossplane. All functions are provided four pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function’s input.
4. The function pipeline’s context. 

Each function in a given composition pipeline is provided this collection of information as inputs.

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

Your function must provide the list of resources to update at the end of its execution. In KCL, you do this by setting a reserved variable called `items`. The resources you set in this variable can be composed resources or modified composite resources.

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