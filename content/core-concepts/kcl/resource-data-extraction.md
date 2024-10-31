---
title: "Resource data extraction"
weight: 70
---

## Extract Data from the Composite Resource

To extract data from the Composite Resource (XR) associated with the composition function pipeline, you can use the `option("params").oxr` variable. Here's an example that demonstrates extracting data from the `.spec` of an XR to set the value of composed resource:

```yaml
apiVersion = "s3.aws.upbound.io/v1beta1"
kind = "Bucket"
metadata.annotations: {
    "krm.kcl.dev/composition-resource-name" = "bucket"
}
spec.forProvider.region = option("oxr").spec.region
```

## Extract Data from a Specific Composed Resource

To extract data from a specific composed resource by using the resource name, you can use the `option("params").ocds` variable. This variable is a mapping that its key is the resource name and its value is the observed composed resource like the example.

```yaml
metadata.name = "ocds"
spec.ocds = option("params").ocds
spec.user_kind = option("params").ocds["test-user"]?.Resource.Kind
spec.user_metadata = option("params").ocds["test-user"]?.Resource.metadata
spec.user_status = option("params").ocds["test-user"]?.Resource.status
```