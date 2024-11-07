---
title: "Read function pipeline state"
weight: 120
---

Compositions execute each function sequentially in the pipeline. Each function
has two main tasks:

1. Update the state of resources as they change
2. Send the updated state data back to Crossplane.

Each function receives four key data points:

1. Current state: The real-world status of the composite resource and related resources
2. Target state: The desired status of resources as defined in your configuration
3. Function input: The specific configuration settings for this function
4. Pipeline context: Shared information passed through the function pipeline

This information is available to access a KCL embedded function.

## Access function pipeline state

When using KCL embedded functions, these pieces of information are accessible using the built-in `option()` function in KCL:

- Read the **ObservedCompositeResource** from `option("params").oxr`
- Read the **ObservedComposedResources** from `option("params").ocds`
- Read the **DesiredCompositeResource** from `option("params").dxr`
- Read the **DesiredComposedResources** from `option("params").dcds`
- Read the **function pipeline's context** from `option("params").ctx`

You can use these variables to do interesting things, such as [extracting data]({{<ref "resource-data-extraction">}}) from composed resources or [write status]({{<ref "write-status-to-composite">}}) to the composite resource.