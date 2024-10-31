---
title: "Write status to a composite"
weight: 80
---

This article describes how to write status information to the composite resource of a function pipeline. You use the status field of a composite to provide details about the progression of the function pipeline.

## Write a status to the Composite Resource

To write status to the Composite Resource associated with the composition function pipeline, capture the value of the composite resource to a local variable. Append information to the status of the XR. Return the patched XR as an item to be composed by the function.

Here's an example:

```yaml
# Read the XR
oxr = option("params").oxr
# Patch the XR with the status field
dxr = {
    **oxr
    status.someInformation = "cool-status"
}
# Construct a bucket
bucket = {
    apiVersion = "s3.aws.upbound.io/v1beta1"
    kind = "Bucket"
    metadata.annotations: {
        "krm.kcl.dev/composition-resource-name" = "bucket"
    }
    spec.forProvider.region = option("oxr").spec.region
}
# Return the bucket and patched XR
items = [bucket, dxr]
```

{{< hint "tip" >}}
The `**` symbol is what KCL calls an unpacking operator, which unpacks the value of a dictionary or list. In the example above, `**oxr` unpacks the value of the composite resource to a variable, which allows us to then add status information.
{{< /hint >}}