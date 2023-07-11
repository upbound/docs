---
title: "Building APIs | Compositions"
weight: 5
description: "how to build APIs"
---

Compositions are the implementations of the schema you define in your [XRD](#creating-an-xrd). The relationship between XRDs and compositions is one-to-many. That is, you can have multiple compositions that implement the spec of an XRD and you can tell Crossplane which one to select. We always recommend to start by first authoring your XRD before authoring compositions to implement it.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/v1.12/concepts/) documentation.
{{< /hint >}}

## A Composition's Purpose

The reason compositions exist is because they allow you to create abstractions:

1. Assemble a set of related Crossplane managed resources into a logical grouping, all referenced by a single parent entity.
1. Using user-defined logic, transform a set of inputs coming from a Crossplane resource claim and apply them to the underlying managed resources.
3. (Optional) Within the logical grouping, stitch values from one managed resource to the next.

## Prototype with Managed Resources First

Before you begin authoring a composition, we recommend first prototyping the resources you want to compose by creating managed resources directly. At the end of the day, the output of a composite resource is always a set of rendered managed resource manifests. We have found it can be difficult to nail the set of values you need to pass to a managed resource in order for it to create successfully, and starting off by working via your abstraction layer (i.e. your composition) can further complicate things. Therefore, we recommend:

1. Prototype and directly create the set of managed resources you intend to compose _first_.
2. Once you've proven to yourself that you can create this set of resources, _then_ author your composition to do this automatically (patching and transforming values, etc).

If you author your composition correctly, the rendered managed resources manifests will be nearly identical to the set of manifests you manually put together during your prototyping phase.

## Scaffolding a composition

Compositions follow the [OpenAPI](https://swagger.io/specification/) “structural schema”. Below is boilerplate .yaml that you can use to scaffold the beginning of a composition.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: <plural-name>.<group>
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: <group.example.com>/v1alpha1
    kind: X-<kind-name>
  resources:
    - name: <name>
      base:
        apiVersion: <resource-version>
        kind: <resource-kind>
        spec:
          forProvider:
            ...
      patches:
        ...
```

## Composition versioning

As described in [versioning an XRD](../#build-apis-xrds#versioning), when you change the shape of an API and define a new version (such as going from v1alpha1 -> v1alpha2) in your XRD, you must create a new composition that implements the new version. To do this, define a new composition object, and point the `compositionTypeRef` to the new API version.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  compositeTypeRef:
    apiVersion: <group.example.com>/<new-api-version>
    kind: X-<kind-name>
  resources:
    ...
```

## Composition Patching Tips

Patches are a key ingredient of authoring a composition. The following are best practices for patches:

- Ensure that `patches` are aligned with `-base` in your manifests. 
- Policy can be used to make the patch Required (`fromFieldPath: Required`) and set mergeOptions (`keepMapValues: true`) when patching arrays or maps.
- A `Required` field will prevent the Composition from rendering until it is available. 
- Label Selectors will match at the Cluster Level on CRDs, ensure labels on any Managed Resources are unique.

## Composition Best Practices

The following are some other best practices to abide by as you author new XRDs:

- Always label the Composition for future selection in metadata
- Always name Composed Resources in the resources
- Use patchSets for repetitive patching and keep Composition DRY
- Use XR Status or annotations propagation to share data between resources
- Be conscious about composing resources from multiple different providers. It is a supported scenario but it brings additional complexity.

## Next Steps

After you've authored your composition, the third step you must take is to package up your API as a configuration. Read [Building APIs | Configurations](../building-apis-compositions) to learn about best practices for how to do this.