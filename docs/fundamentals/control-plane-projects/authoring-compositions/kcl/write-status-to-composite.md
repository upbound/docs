---
title: Write status to a composite
sidebar_position: 8
---

This guide describes how to write status information to the composite resource
of a function pipeline. The status field of a composite provides details about
the procession of the function pipeline.

## Write a status to the Composite Resource

To write status to the Composite Resource associated with the composition function pipeline, capture the value of the composite resource to a local variable. Append information to the status of the XR. Return the patched XR as an item so it gets composed.

Here's an example:

```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

# Read the desired state for the XR from the pipeline
_dxr = option("params").dxr

# Construct a bucket
bucket = v1beta1.Bucket {
    metadata: _metadata("my-bucket")
    spec.forProvider.region = option("oxr").spec.region
}

# Update the dxr status immutably
_dxr = {
    **dxr
    status: {
        someInformation: "cool-status"
    }
}

# Return the bucket and updated status for the XR
items = [bucket, _dxr]
```

Make sure you've described the status fields you write to in your function in the XRD corresponding to the composition.
