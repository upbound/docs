---
title: "Authoring Compositions"
weight: 5
description: "how to build APIs"
---

Compositions are the implementations of the schema you define in your [XRD]({{< ref "xp-arch-framework/building-apis/building-apis-xrds.md" >}}). The composition receives all inputs from the XRD. It's recommended to design the API (composite inputs) before launching into composition authoring. The relationship between XRDs and compositions is one-to-N. You can have multiple compositions that define the implementation of the spec of an XRD and you can tell Crossplane which one to select.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/master/concepts/) documentation.
{{< /hint >}}

## A composition's purpose

Compositions exist in Crossplane to allow you to create resource abstractions that:

1. Assemble a set of related Crossplane managed resources into a logical grouping, all referenced by a single parent entity.
2. Using user-defined logic, transform a set of inputs coming from a Crossplane resource claim and apply them to the underlying managed resources.
3. (Optional) Within the logical grouping, propagate values between managed resources in the composition.

## Prototype with managed resources first

Before you begin authoring a composition, it's recommended you first prototyping the resources you want to compose by creating managed resources directly. The ultimate output of a composite resource is always a set of rendered managed resource manifests. It can be difficult to nail the values you need to pass to a managed resource in order for it to create. Starting off by working via your abstraction layer (your composition) can further complicate things. It's recommended you follow this flow:

1. Prototype and directly create the set of managed resources you intend to compose _first_.
2. Once you've proven to yourself that you can create this set of resources, identify the fields the consumer of your API should control.
3. _Then_ author your composition to map those inputs in their proper format (patching and transforming values, etc).

A composition that's authored right should result in rendered managed resources manifests. These manifests should be identical to what you manually put together during your prototyping phase.

## Scaffolding a composition

Compositions follow the [OpenAPI](https://swagger.io/specification/) "structural schema." Below is boilerplate .YAML that you can use to scaffold the beginning of a composition.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: <plural-name>.<group>
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: <group.example.com>/v1alpha1
    kind: X<KindName>
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

As described in [versioning an XRD]({{< ref "xp-arch-framework/building-apis/building-apis-xrds.md#versioning" >}}), a version change in the XRD (such as going from v1alpha1 -> v1alpha2) requires a new composition that implements the new version. To do this, define a new composition object, and point the `compositionTypeRef` to the new API version.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  compositeTypeRef:
    apiVersion: <group.example.com>/<new-api-version>
    kind: X<KindName>
  resources:
    ...
```

{{< hint "note" >}}
Deploying a new version will automatically upgrade the existing version on all clusters. Only one version can be "live" at a time, which is dictated by the `served` field in the XRD.
{{< /hint >}}

## Layering composite resources

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

### When to layer compositions

As a best practice, always start by defining your compositions as a flat list of composed managed resources. The complexity involved with debugging a nested composition increases because:

- there are more layers of objects (and associated events) that you must parse through.
- more layers of patching to keep track of.

Start out by composing resources in a flat list. Below are some scenarios where you may want to consider using nested composites:

1. If you find yourself repetitively copying around definitions of managed resources in your compositions, that would be an appropriate time to consider refactoring those resources into their own compositions and nest them. 
2. If you have a set of common resource abstractions (such as a standard VPC or bucket) that you tend to use in tandem with other resources, you can compose them once and then nest then in other compositions as needed. 
3. In cases where when another team is the owner of a particular managed resource. For example, suppose one team owns "infra," but wishes to use IAM Policies established by a "security" team. The security team can author `IAMPolicy` composites and the "infra" team can consume those.

{{< hint "important" >}}
Be careful not to misinterpret nesting composite resources as nesting **claims** inside compositions. You cannot nest Crossplane claim objects in compositions--only other composite resources.
{{< /hint >}}

## Composition best practices

There's a significant improvement in upstream XP found at [crossplane/crossplane#3756](https://github.com/crossplane/crossplane/pull/3756). This enhancement introduces the `--enable-composition-webhook-schema-validation` flag, which you may enable to enhance the developer experience. By enabling this flag, you gain a fast feedback loop during the composition crafting process, leading to more efficient and productive development.

### Patching tips

#### Formatting and alignment

Always ensure `patches` align with `-base` in your manifests. Forgetting proper indention is a common error, causing your patches to apply incorrectly.

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

#### Patch policy

Patch policy can make the patch Required (`fromFieldPath: Required`) and set `mergeOptions` (`keepMapValues: true`) when patching arrays or maps. The example below demonstrates patching an array to a property on a bucket.

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

#### Propagate data between managed resources

One of the common jobs of composition authors is to exchange data between managed resources in a composition. The conventional use case for patches is to patch from a `spec` supplied by a resource claim to a composed managed resource in a composition. You can also patch to pass data between two sibling managed resources. To do this, you must publish your desired field from a source managed resource to a custom composite resource `status` field. You can then consume data from this `status` field by a target managed resource.

In order for the below example to work, the status property (status.eks.oidc) exists in the schema of the resource (in the XRD).

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
              # We define this status field for the composite resource.
              eks:
                description: Freeform field containing status information for eks
                type: object
                x-kubernetes-preserve-unknown-fields: true
            type: object
```

After you've added the status field to the XRD, you can use it to patch in your composition. Just like in Kubernetes, every Crossplane object has a nested object field called `status`. You can see how to propagate data emitted from one managed resource (a cluster resource) to another managed resource in the composition (an OIDC Provider). 

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xeks.aws.k8s.starter.org
  labels:
    provider: aws
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: aws.k8s.starter.org/v1alpha1
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

#### Block composition rendering

A `Required` field prevents a composition from rendering until it's available. 

```yaml
- name: oidcProvider
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: OpenIDConnectProvider
        spec:
          ...
      patches:
        - fromFieldPath: status.eks.oidc
          toFieldPath: spec.forProvider.url
          policy:
            fromFieldPath: Required
```

The preceding example makes this a required patch. This means the `oidcProvider` resource fails to render unless you test the composite with a live ProviderConfig in a fully configured control plane. This impacts how you would go about validating and testing the composite output before publishing it in a configuration package.

{{< hint "note" >}}
You configure whether a field is required in an XRD, not the composition
{{< /hint >}}

#### Label selector matching

Label Selectors match at the cluster-level on CRDs, so ensure labels on any managed resources are unique.

```yaml
policyArnSelector:
  # Match only managed resources that are part of the same composite, i.e.
  # managed resources that have the same controller reference as the
  # selecting resource.
  matchControllerRef: true
  matchLabels:
    role: core-ecr
```

#### Use patchSets

Use `patchSets` for repetitive patching and keep Compositions from becoming bloated. In the example below, you can see a `patchSet` declaration in the spec of the composition, and then multiple composed resources reference it.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xnetworks.aws.k8s.starter.org
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
      toFieldPath: metadata.labels[networks.aws.k8s.starter.org/network-id]
  resources:
    - name: vpc
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

### Other best practices

#### Label your compositions

Always label the composition in `metadata` for future selection. Composition names must match the DNS spec. Always including the full group name (as below) is a convention. The name has a limit on the length (63-character). The group is omissible if the name gets too long, but each composition must have a unique name on the cluster.

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

#### Name composed resources

Always name Composed Resources in the resources array of a composition. It's easier to debug compositions when they're running because events print out their name, as opposed to an index in an array. In the example below, observe three composed resources are part of an `XEKS` composition.

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

{{< hint "note" >}}
If you use Kuttl to validate composites, managed resources _must_ be named uniquely. It's sometimes helpful to have a nestable composite which sets this unique name.
{{< /hint >}}

#### Composing resources from multiple Crossplane providers

Be conscious about composing resources from multiple different providers. It's a supported scenario but it introduces complexity. For example, `Selector` and `References` only work with a single provider today, not with multiple providers.

## Next steps

After you've authored your composition, the third step you must take is to package up your API as a configuration. Read [Authoring Configurations]({{< ref "xp-arch-framework/building-apis/building-apis-configurations.md" >}}) to learn about best practices for how to do this.