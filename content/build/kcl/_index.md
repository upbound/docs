---
title: "Build with KCL"
weight: -1
---

Upbound supports defining your control plane APIs in [KCL](https://www.kcl-lang.io/), an open source constraint-based record and functional language.

## Prerequisites

Install the following:

- [KCL](https://www.kcl-lang.io/docs/user_docs/getting-started/install)
- [KCL Language Server](https://www.kcl-lang.io/docs/user_docs/getting-started/install#install-language-server)
- [KCL Visual Studio Code Extension](https://www.kcl-lang.io/docs/user_docs/getting-started/install#install-kcl-extensions-for-ide)

## Example
The example below is a pre-generated function that detects if a composed
resource is ready in your infrastructure.
{{< tabs >}}

{{< tab "Embedded Function" >}}
The function file below describes the behavior of your function. This overview describes the core elements below.

```yaml
import models.v1beta1 as v1beta1

_metadata = lambda name: str -> any {
    { annotations = { "krm.kcl.dev/composition-resource-name" = name }}
}

# This is the observed composite resource, provided as an input to the function
oxr = option("params").oxr

_items = [
    v1beta1.Instance {
      metadata: _metadata("vm-instance")
      spec.forProvider = {
          associatePublicIpAddress: True
          instanceType: "t3.micro"
          availabilityZone: oxr.spec.parameters.locaton
          cpuCoreCount: 10
      }
    }
]

# This function composes an EC2 instance.
items = _items
```

First, review the import statements.

``` yaml
import models.v1alpha1.nop_crossplane_io_v1alpha1_nop_resource as nopv1alpha1
import models.k8s.apimachinery.pkg.apis.meta.v1 as metav1
{{< /tab >}}

{{< tab "XRD" >}}

The function above can be generated from a corresponding XRD, which maps the resource schema for
the resource you want to create.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatabases.platform.acme.co
spec:
  group: platform.acme.co
  names:
    kind: XDatabase
    plural: xdatabases
  claimNames:
    kind: Database
    plural: databases
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              description: |
                The specification for how this database should be
                deployed.
              properties:
                parameters:
                  type: object
                  description: |
                    The parameters indicating how this database should
                    be configured.
                  properties:
                    region:
                      type: string
                      enum:
                        - east
                        - west
                      description: |
                        The geographic region in which this database
                        should be deployed.
                    size:
                      type: string
                      enum:
                        - small
                        - medium
                        - large
                      description: |
                        The machine size for this database.
                    storage:
                      type: integer
                      description: |
                        The storage size for this database in GB.
                  required:
                    - region
                    - size
                    - storage
              required:
                - parameters
```

{{< /tab >}}

{{< tab "Composition" >}}
Compositions reference your function and automatically follow the function
logic.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xdatabases.platform.acme.co
spec:
  compositeTypeRef:
    apiVersion: platform.acme.co/v1alpha1
    kind: XDatabase
  mode: Pipeline
  pipeline:
    - step: compose
      functionRef:
        name: upbound-project-getting-startedxdatabase
    - step: automatically-detect-ready-composed-resources
      functionRef:
        name: crossplane-contrib-function-auto-ready
```

{{< /tab >}}

{{< /tabs >}}

## Control plane project model

The Upbound programming model defines the core concepts you can use when creating your control plane using Upbound. [Concepts](/core-concepts/) describes these concepts with examples available in KCL. This section contains guidance specifically for how to use the KCL language to do Crossplane-specific tasks. Read the [KCL reference docs](https://www.kcl-lang.io/docs/reference/lang/tour) for comprehensive instruction.

<!-- vale off -->
The KCL experience is made available thanks to the [function-kcl](https://github.com/crossplane-contrib/function-kcl) function.
<!-- vale on -->