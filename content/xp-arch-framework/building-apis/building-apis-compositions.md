---
title: "Authoring Compositions"
weight: 5
description: "how to build APIs"
---

Compositions are the implementations of the schema you define in your [XRD](../building-apis-xrds). The relationship between XRDs and compositions is one-to-many. You can have multiple compositions that implement the spec of an XRD and you can tell Crossplane which one to select. We always recommend to start by first authoring your XRD before authoring compositions to implement it.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/v1.12/concepts/) documentation.
{{< /hint >}}

## A Composition's Purpose

Compositions exist in Crossplane to allow you to create resource abstractions that:

1. Assemble a set of related Crossplane managed resources into a logical grouping, all referenced by a single parent entity.
2. Using user-defined logic, transform a set of inputs coming from a Crossplane resource claim and apply them to the underlying managed resources.
3. (Optional) Within the logical grouping, propogate values between managed resources in the composition.

## Prototype with Managed Resources First

Before you begin authoring a composition, we recommend first prototyping the resources you want to compose by creating managed resources directly. The ultimate output of a composite resource is always a set of rendered managed resource manifests. We've found it can be difficult to nail the set of values you need to pass to a managed resource in order for it to create successfully, and starting off by working via your abstraction layer (your composition) can further complicate things. Therefore, we recommend:

1. Prototype and directly create the set of managed resources you intend to compose _first_.
2. Once you've proven to yourself that you can create this set of resources, _then_ author your composition to do this automatically (patching and transforming values, etc).

If you author your composition correctly, the rendered managed resources manifests will be nearly identical to the set of manifests you manually put together during your prototyping phase.

## Scaffolding a composition

Compositions follow the [OpenAPI](https://swagger.io/specification/) “structural schema”. Below is boilerplate .YAML that you can use to scaffold the beginning of a composition.

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

## Layering Composite Resources

Composite resources are user-defined. You can layer composite resources on one another by crafting your composition implementations to compose both managed resources _and_ composite resources. Notice in the example below, it defines a composition that composes four _other_ composite resources (_XCompositeAmplify_, _XCompositeCognito_, _XCompositeGateway_, and _XCompositeFunction_)

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  compositeTypeRef:
    apiVersion: infrastructure.example.org/v1alpha1
    kind: XServerlessApp
  resources:
    # A composite resource representing an AWS amplify app
    - name: amplify
      base: 
        apiVersion: infrastructure.example.org/v1alpha1
        kind: XCompositeAmplify
        spec:
          ...
    # A composite resource representing a cognito user pool 
    - name: cognito
      base: 
        apiVersion: infrastructure.example.org/v1alpha1
        kind: XCompositeCognito
        spec:
          ...
    # A composite resource representing a group of resources that form an AWS API gateway
    - name: apigw
      base: 
        apiVersion: infrastructure.example.org/v1alpha1
        kind: XCompositeGateway
        spec:
          ...
    # A composite resource representing a n AWS lambda function with helper resources
    - name: lambda-item-get
      base: 
        apiVersion: infrastructure.example.org/v1alpha1
        kind: XCompositeFunction
        spec:
          ...
```

### When should I layer compositions?

As a best practice, always start by defining your compositions as a flat list of composed managed resources. The complexity involved with debugging a nested composition increases because:

- there are more layers of objects (and associated events) that you must parse through.
- more layers of patching to keep track of.

Therefore, start out by composing resources in a flat list. If you find yourself repetitively copying around definitions of managed resources in your compositions, that would be an appropriate time to consider refactoring those resources into their own compositions and nest them. Another appropriate time to consider using nested compositions is if you have a set of common resource abstractions (such as a standard VPC or bucket) that you tend to use in tandem with other resources. Because you'll be reusing these resource abstractions many times, you can compose them once and then nest then in other compositions as needed.

{{< hint "important" >}}
Be careful not to misinterpret nesting composite resources as nesting **claims** inside compositions. You cannot nest Crossplane claim objects in compositions--only other composite resources.
{{< /hint >}}

## Composition Best Practices

### Patching Tips

#### 1. Formatting and alignment

Always ensure that `patches` are aligned with `-base` in your manifests. If you are debugging a composition because its not behaving as expected, just like an "off by one" coding error, forgetting proper indention is a common error--and then your patches aren't even defined and applied correctly.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  ...
  resources:
    - name: controlplaneRole
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: Role
          ...
      # This is correctly indented!
      patches:
        ...
```

#### 2. Patch policy

Policy can be used to make the patch Required (`fromFieldPath: Required`) and set mergeOptions (`keepMapValues: true`) when patching arrays or maps. In the example below, we're patching an array to a property on a bucket.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  ...
  resources:
    - name: my-bucket
      base:
        apiVersion: storage.gcp.upbound.io/v1beta1
        kind: Bucket
          ...
      patches:
        - type: FromCompositeFieldPath
          fromFieldPath: spec.web.indexPage
          toFieldPath: spec.forProvider.website[0].mainPageSuffix
          policy:
            mergeOptions:
              appendSlice: true
              keepMapValues: true
```

#### 3. Propogating data between managed resources

One of the common jobs of composition authors is to exchange data between managed resources in a composition. Whereas the convential use case for patches is to patch from a `spec` supplied by a resource claim to a composed managed resource in a composition, this method of patching is for passing data between two sibling managed resources. TO do this, you must publish your desired field from a source managed resource to a custom composite resource `status` field. You can then consume data from this `status` field by a target managed resource.

This is able to be done because, just like in Kubernetes, every Crossplane object has a nested object field called `status`. In this example below, you can see how we propogate data emitted from one managed resouce (a cluster resource) to another managed resource in the composition (an OIDC Provider). 

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xeks.aws.platformref.upbound.io
  labels:
    provider: aws
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: aws.platformref.upbound.io/v1alpha1
    kind: XEKS
  resources:
    - name: kubernetesCluster
      base:
        apiVersion: eks.aws.upbound.io/v1beta1
        kind: Cluster
        spec:
          ...
      patches:
        # This patch propogates the oidc issuer field to the composite resource's status.
        - type: ToCompositeFieldPath
          fromFieldPath: status.atProvider.identity[0].oidc[0].issuer
          toFieldPath: status.eks.oidc
    - name: oidcProvider
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: OpenIDConnectProvider
        spec:
          ...
      patches:
        # This patch consumes the data from the oidc issuer field patched to the composite resoursce earelier
        - fromFieldPath: status.eks.oidc
          toFieldPath: spec.forProvider.url
```

In order for this example to work, the status property (status.eks.oidc) must be defined for this composite resource, which must be done in the XRD.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
spec:
  ...
  versions:
  - name: v1alpha1
    schema:
      openAPIV3Schema:
        type: object
        properties:
          ....
          status:
            properties:
              # We define this status field for the composite resource here.
              eks:
                description: Freeform field containing status information for eks
                type: object
                x-kubernetes-preserve-unknown-fields: true
            type: object
```

#### 4. Block composition rendering

A `Required` field will prevent a composition from rendering until it's available. 

{{< hint "note" >}}
You configure whether a field is required in an XRD, not the composition
{{< /hint >}}

#### 5. Label Selector matching

Label Selectors will match at the cluster-level on CRDs, so ensure labels on any managed resources are unique.

#### 6. Use patchsets

Use patchSets for repetitive patching and keep Compositions from becoming bloated. In the example below, you can see a `patchSet` declaration in the spec of the composition, and then that patch is reused across multiple composed resources.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xnetworks.aws.platformref.upbound.io
  labels:
    provider: aws
spec:
  ...
  # Defined the patch set in the spec of the composition
  patchSets:
  - name: network-id
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.id
      toFieldPath: metadata.labels[networks.aws.platformref.upbound.io/network-id]
  resources:
    - name: platformref-vcp
      base:
        ...
      patches:
        # reference the patch set in the spec when we're patching the composed managed resource
        - type: PatchSet
          patchSetName: network-id
    - name: gateway
      base:
        ...
      patches:
        # reference the patch set in the spec when we're patching the composed managed resource
        - type: PatchSet
          patchSetName: network-id
```

### Other Best Practices

#### 1. Label your compositions

Always label the composition in `metadata` for future selection. 

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  #This labels the composition
  name: xeks.aws.k8s.starter.org
  labels:
    provider: aws
spec:
  ...
```

#### 2. Name composed resources

Always name Composed Resources in the resources array of a composition. This makes it easier to debug compositions when they're running because events will print out their name, as oppsoed to an index in an array. In the example below, you can see how we've named three composed resources as part of an XEKS composition.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xeks.aws.k8s.starter.org
  labels:
    provider: aws
spec:
  compositeTypeRef:
    apiVersion: aws.k8s.starter.org/v1alpha1
    kind: XEKS
  resources:
    # A name for the first composed resource
    - name: controlplaneRole
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: Role
          ...
    # A name for the second composed resource
    - name: clusterRolePolicyAttachment
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: RolePolicyAttachment
          ...
    # A name for the third composed resource
    - name: kubernetesCluster
      base:
        apiVersion: eks.aws.upbound.io/v1beta1
        kind: Cluster
          ...
```

#### 3. Composing resources from multiple Crossplane providers

Be conscious about composing resources from multiple different providers. It's a supported scenario but it brings additional complexity.

## Next Steps

After you've authored your composition, the third step you must take is to package up your API as a configuration. Read [Authoring Configurations](../building-apis-configurations) to learn about best practices for how to do this.