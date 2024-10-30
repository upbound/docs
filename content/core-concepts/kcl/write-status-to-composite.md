---
title: "Write status to a composite"
rank: 15
---

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