---
title: "Read function pipeline state"
weight: 120
---

Compositions execute in a pipeline of one or more sequential functions. A function's job is to update desired resource state and return it to Crossplane. All functions are provided four pieces of information:

1. The observed state of the composite resource, and any composed resources.
2. The desired state of the composite resource, and any composed resources.
3. The function’s input.
4. The function pipeline’s context. 

This information is available to access a KCL embedded function.

## Access function pipeline state

When using KCL embedded functions, these pieces of information are accessible using the built-in `option()` function in KCL:

- Read the **ObservedCompositeResource** from `option("params").oxr`
- Read the **ObservedComposedResources** from `option("params").ocds`
- Read the **DesiredCompositeResource** from `option("params").dxr`
- Read the **DesiredComposedResources** from `option("params").dcds`
- Read the **function pipeline's context** from `option("params").ctx`

You can use these variables to do interesting things, such as to [extract data](./resource-data-extraction.md) from composed resources or [write status](./write-status-to-composite.md) to the composite resource.