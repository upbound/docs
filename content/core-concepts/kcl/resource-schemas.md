---
title: "Resource schemas"
weight: 30
---

Some packages, such as Upbound Official Providers, define KCL-compatible resource schemas. These schemas provide a rich code editing experience, such as in-line definitions, linting, autocomplete, and more.

When you add a dependency to your project using [up dep add](), if the dependency contains resource schemas, they'll be unpacked in the `.up/kcl` folder at root directory of your project.

To take full advantage of this, make sure you have the [necessary tools]({{<ref "overview#prerequisites">}}) fully installed on your machine.

## Import a resource schema to a function

When you generate a function for a composition in your project using [up function generate](), all unpacked schemas provided by your dependencies are automatically imported in the scaffolded KCL function, like below:

```yaml
import models.v1beta1 as v1beta1
import models.v1beta2 as v1beta2
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}
oxr = option("params").oxr

# Compose resources here
_items = []

items = _items
```

You can manually import schemas using the `import` stanza. The schemas imported in your function are used by the KCL IDE extension to provide a rich experience.

## Schema-powered experiences in an IDE

To take full advantage of the KCL IDE experience with resource schemas, you need to declare the resource type. Here's an example:

```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}
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
items = _items
```

When your cursor is inside the stanza of the `v1beta1.Instance`, your IDE will provide code completion, context hints, and more tailored to that resource type.

## Supported packages

All Upbound Official Providers are bundled with KCL-compatible resource schemas. 

When you build your project using [up project build]() command, the generate artifact likewise contains generated resource schemas for the XRDs you define. This lets you import a built project as a dependency and get a rich experience for the resources you define.