---
title: "Resource data extraction"
weight: 70
---

## Extract Data from the Composite Resource

To extract data from the Composite Resource (XR) associated with the composition function pipeline, you can use the `option("params").oxr` variable. Here's an example that demonstrates extracting data from the `.spec` of an XR to set the value of composed resource:

```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

myBucket = v1beta1.Bucket {
    metadata: _metadata
    spec.forProvider.region = option("oxr").spec.region
}
```

## Extract data from a specific composed resource

To extract data from a specific composed resource by using the resource name,
you can use the `option("params").ocds` variable. This variable works like a
dictionary/map type where you provide the resource name as a key to access the
corresponding configuration data.

```yaml
metadata.name = "ocds"
spec.ocds = option("params").ocds
spec.user_kind = option("params").ocds["test-user"]?.Resource.Kind
spec.user_metadata = option("params").ocds["test-user"]?.Resource.metadata
spec.user_status = option("params").ocds["test-user"]?.Resource.status
```