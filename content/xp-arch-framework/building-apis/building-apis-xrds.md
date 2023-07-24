---
title: "Authoring XRDs"
weight: 4
description: "how to build APIs"
---

[Composite resource definitions (XRDs)](https://docs.crossplane.io/master/concepts/composition/#compositeresourcedefinitions) define the type and schema of your composite resource (XR). Think of the XRD as the object that defines the **shape** of your API. While the fields you choose to define in the `spec` of your XRD are highly dependent on the use case you’re trying to accomplish, there are a general set of best practices you can apply to help you approach how to define an XRD.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/master/concepts/) documentation.
{{< /hint >}}

## Purpose

If you haven't read and gone through the framework's [self-evaluation]({{< ref "xp-arch-framework/self-eval.md" >}}) exercise, we recommend you do that now. It's difficult to build a custom API without knowing who you are building it for and why you're building it. If you have an understanding of how you're building the custom API for and what inputs (if any) you want your consumers to have, the next questions you need to figure out are:

- What managed resources do you want to compose together as part of this API?
- For each managed resource you want to compose, which fields are required?

### Which managed resources to compose

Most Crossplane providers have a number of different managed resources that map to appropriate APIs to manage a particular set of infrastucture or resources.

{{< table "table table-sm" >}}
| Generic | Crossplane provider-aws | AWS infrastructure |
| ---- | ---- | ---- | 
| resource-1 | [`Instance`](https://marketplace.upbound.io/providers/upbound/provider-aws-ec2/latest/resources/ec2.aws.upbound.io/Instance/v1beta1) | An EC2 Instance | 
| resource-2 | [`SecurityGroup`](https://marketplace.upbound.io/providers/upbound/provider-aws-ec2/latest/resources/ec2.aws.upbound.io/SecurityGroup/v1beta1) | A Security Group | 
{{< /table >}}

When you create some infrastructure in a cloud service, sometimes that infrastructure maps to a single API (such as an S3 bucket) and other times it actually maps to multiple APIs. For example, if you create an EKS cluster in AWS, there is an AWS cluster object, some IAM rules, a NodeGroup, network settings, and more; this is multiple APIs and multiple objects that get created. 

{{< hint "tip" >}}
If you are coming from traditional Infrastructure as Code (IaC) tooling such as Terraform or AWS CloudFormation, these tools also have resource representation that maps to underlying APIs in a provider. These IaC tool resources usually map one-to-one to equivalent Crossplane provider managed resources. You can use this to inform which Crossplane managed resources you need to compose. 
{{< /hint >}}

If you don't have existing IaC tooling definitions to inform which resources you need to compose, you can use the [Upbound Marketplace’s](https://marketplace.upbound.io/) API documentation feature. In the Marketplace, search for a resource you want to create. Within that resource's API documentation, under the `spec.forProvider` struct, look for properties that have a naming pattern like `<resource>Ref` or `<resource>IdSelector`. These are properties which may indicate that, in order for your desired resource to be created, you may need to provide references to _other_ resources. Be advised, this tip is a heuristic, not a firm requirement.

As an example, consider the provider-aws `Instance` resource for an EC2 Instance. You can see below there is a reference to a networkInterface, indicating this is another resource you may choose to create in Crossplane and then reference in your Instance resource.

{{<img src="xp-arch-framework/images/instance-nw-interface.png" alt="Parameters on an AWS EC2 instance" size="small" quality="100">}}

### Required fields for composed resources

Two reasons it's important to know which fields are required in the MRs you want to compose are:

1. There's a high likelihood you want to either expose or let your consumers influence indirectly these fields in your API
2. Composite Resources ultimately instantiate MRs, so you need to create valid MRs in order for your Composite Resource to create successfully.

Use the [Upbound Marketplace’s](https://marketplace.upbound.io/) API documentation feature to see which fields are required or optional under the `spec.forProvider`. For example, notice in the [AWS EKS Cluster](https://marketplace.upbound.io/providers/upbound/provider-aws-eks/latest/resources/eks.aws.upbound.io/Cluster/v1beta1) resource API documentation how `region` is required whereas `version` isn't.

{{<img src="xp-arch-framework/images/eks-required-fields.png" alt="Which fields are required for EKS cluster" size="small" quality="100">}}

Sometimes a managed resource will have fields that need to have a value but it's not explicitly marked as `required`. For example, the [AWS Lambda Function](https://marketplace.upbound.io/providers/upbound/provider-aws-lambda/latest/resources/lambda.aws.upbound.io/Function/v1beta1) resource API documentation stipulates that “filename, image_uri, or s3_bucket must be specified”, yet none of those fields individually are marked required. It's helpful to look at resources `Examples` in the Upbound Marketplace, because these examples demonstrate configs for MRs that have been verified to successfully create.

{{< hint "tip" >}}
Fields that are required in order for an MR to successfully create usually indicate important details that dramatically impact what gets created. Consider whether these fields should be inputs directly supplied by your API’s consumers, whether it should be influenced by inputs provided by your API’s consumers, or whether they have no business influencing its value at all.
{{< /hint >}}

## Authoring an XRD

### Scaffolding an XRD

XRDs follow the [OpenAPI](https://swagger.io/specification/) “structural schema”. Below is boilerplate .YAML that you can use to scaffold the start of an XRD.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: <plural-name>.<group>
spec:
  group: <group.example.com>
  names:
    kind: X-<kind-name>
    plural: X-<kind-name-plural>
  claimNames:
    kind: <kind-name>
    plural: <kind-name-plural>
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
            properties:
              parameters:
                type: object
                properties:
                  <to-do>
            required:
            - parameters
          status:
            type: object
            properties:
                <todo>
```

In your XRD, you will want to give your Composite Resource a name and update the API group it should be served from. The scaffold above also assumes you want this Composite Resource to be claimable. If you don’t want to allow users to create claims against this Composite Resource, omit the `claimNames` field.

{{< hint "important" >}}
**Should your composite resource be claimable?** In most circumstances, the answer is "yes". Crossplane composite resources are cluster-scoped objects, which means they're not associated with any given namespace in your control plane. By making a composite resource claimable, this enables you to restrict users to different namespaces in your control plane and thereby improve isolation between them. To learn more, read the [architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md#tenancy-on-your-control-plane" >}}) guide.
{{< /hint >}}

### Authoring Best Practices

The following are some other best practices to abide by as you author new XRDs:

#### Inputs belong in spec.properties.parameters

All of the inputs you want to provide as part of your API belong in your XRD's `spec.properties.parameters` stanza, as seen in the example below.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
spec:
  ...
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
            properties:
              parameters:
                type: object
                properties:
                  storageGB:
                    type: integer
                required:
                - storageGB
            required:
            - parameters
```

#### Rely on the OpenAPI v3 data models

The OpenAPI v3 [data models](https://swagger.io/docs/specification/data-models/) define the types and values available for you to use as part of defining your XRD.

#### Comply with OpenAPI v3 data types

The OpenAPI v3 [data types](https://swagger.io/docs/specification/data-models/data-types/) define the value types available for you to use as part of your schema.

#### Use enums for static options

We recommend using [Enums](https://swagger.io/docs/specification/data-models/enums/) for static options for field value. For example, if you have field called `environment` and there are a defined list of options for your users to choose from:

```yaml
environment:
type: string
    enum: [Dev, DR, UAT, Pre-prod, Prod]
```

#### String validation

We recommend using `pattern` for complex string validations. For example:

```yaml
teamEmailAddress:
type: string
    pattern: "^[a-zA-Z0-9@\\.]*$"
```

### XRD status

The `spec.status` field of your XRD is a useful way to exchange data between various Crossplane resources. In order to patch a value from one Crossplane resource to another, you can publish and consume values via an XRD's status, which means the XRD must first _define_ the status field. Patching is a concept relevant to compositions and is discussed in detail later for how to do this.

## Versioning

Over the lifetime of your custom API, there is a chance the shape of the API could change and you could introduce breaking changes. Crossplane has a built-in capability to help with this. The scaffolding above recommends a boilerplate version named `v1alpha1`. Notice the `versions` field is an array, so you can declare multiple versions of your API definition in the XRD:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
spec:
...
  versions:
  - name: v1alpha1
    served: true
    referenceable: true
    schema:
      ...
  - name: v1alpha2
    served: true
    referenceable: true
    schema:
      ...
```

Note this is just the definition portion of your new API version; you also need to create new compositions that implement the new version. Learn how to do this in the [compositions]({{< ref "xp-arch-framework/building-apis/building-apis-compositions.md" >}}) page.

### Converting resources between XRD versions

Beginning in Crossplane v1.12.0 and later, Crossplane supports using webhooks to convert resources between defined versions of an XRD. To do this, you declare a `conversion` strategy in the `spec` of the XRD.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
spec:
  conversion:
    strategy: Webhook
    webhook:
      ...
```

## Next Steps

Defining an XRD is half the equation for building a custom API. The other important steps is to define a composition which implements the definition contained in your XRD. Read [Authoring Compositions]({{< ref "xp-arch-framework/building-apis/building-apis-compositions.md" >}}) to learn how to do that.