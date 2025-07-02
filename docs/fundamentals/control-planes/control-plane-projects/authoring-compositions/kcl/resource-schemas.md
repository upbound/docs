---
title: Resource schemas
sidebar_position: 3
---

Upbound Official Providers and some other packages define KCL-compatible
resource schemas. Make sure you have the KCL Language Server and KCL Visual Studio Code
extension on your machine for richer code editing. These schemas and the KCL
Visual Studio Code extension provide in-line definitions, linting, autocomplete, and more.


The `up dep add` command unpacks dependencies that contain resource schemas in
the `.up/kcl` folder at your project root directory.

Make sure you have the [necessary tools][necessary-tools] fully installed on your machine.

## Import a resource schema to a function

When you generate a function for your project with `up function generate` from a
composition, the command automatically imports the schemas into your KCL
function file:

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

The `import` stanza in your function allows you to manually import schemas. The
KCL Visual Studio Code extension can also parse the imported schemas for the same benefits.

<!-- vale off -->
## Schema-powered experiences in an IDE
<!-- vale on -->

To take full advantage of the KCL IDE experience with resource schemas, you need
to declare the resource type. Here's an example:

To use the KCL Visual Studio Code extension with resource schemas, you must declare a
resource type.

In the example below, adding the `v1beta1.Instance` resource enables code
completion, context hints, and resource specific information.

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

When your cursor is inside the stanza of the `v1beta1.Instance`, your IDE provides code completion, context hints, and more tailored to that resource type.

## Supported packages

All Upbound Official Providers use KCL-compatible resource schemas.

When you build your project with `up project build`, the generated artifact
contains the generated resource schemas for your XRDs. You can build a project
and then import that project as a dependency for the resources you define.


[necessary-tools]: /build/control-plane-projects/authoring-compositions/kcl/#prerequisites
