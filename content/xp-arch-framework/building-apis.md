---
title: "Building APIs"
weight: 2
description: "how to build APIs"
---

Creating your own, customized API is a core differentiating feature of Crossplane and is a critical step in your Crossplane journey. Composite Resources are the feature of Crossplane which allows you to create your own opinionated APIs that are implemented as a Kubernetes Custom Resources, without needing to write your own Kubernetes controller from scratch. Composite Resources are composed of one or Crossplane Managed Resources, which are the building blocks that get installed on a control plane via a Crossplane provider.

This guide defines the best practices to follow when developing custom APIs using Crossplane Composite Resources.

## Overview

### What is a custom API?

Crossplane gives you the tools to extend the Kubernetes API without needing to write code. To put this into context: Kubernetes has a a component called the `API Server`. As explained in the [Kubernetes docs](https://kubernetes.io/docs/concepts/overview/kubernetes-api/), "The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes (for example: Pods, Namespaces, ConfigMaps, and Events)."

You create a custom API by creating a new Crossplane `composite resource (XRs)`. That is, composite resources define new APIs that you can then instantiate, query, and manipulate.

### What is a composite resource (XR)?

Composite resources are the Crossplane representation of your custom API. Composite resources are user-defined. A composite resource requires:

- A `Composite Resource Definition (XRD)` to be authored
- A `composition` to be authored, which is the implementation component of your composite resource against the XRD (which is the definition). You can have multiple compositions that implement an XRD, but 1 implementation will always be selected when creating a new instance of the composite resource.

{{<img src="xp-arch-framework/images/xrd.png" alt="Depiction of an XRD" size="small" quality="100">}}

For example, you can define a custom API called `StorageBucket`. You can have three different implementations of this resource, one for each public cloud provider.

{{<img src="xp-arch-framework/images/xr.png" alt="Depiction of an XR" size="small" quality="100">}}

### What does it mean to compose something?

Customers use Crossplane because they want to declaratively create and manage a set of resources in an external service. "Resources in an external service" can manifest as many things: it could be a traditional cloud resource like an IAM role or a VM instance, a git repo on GitHub, or even a database in a SQL server instance. In all cases, there is an API that you can teach Crossplane how to interact with each of these resources. Crossplane providers are the building block that does this step for you. 

All the resources that a Crossplane provider defines are called `Managed Resources (MRs)`. Managed resources should never be created directly. Instead, create them by composing them using `Composite Resources`. Not only does this allow you to craft a custom API above the managed resource, it also lets you create a relationship between multiple related managed resources, stitch values between them if needed, adds additional RBAC capabilities and lifecycle management controls.

### Configure APIs on a control plane

A new instance of Crossplane is like a blank slate: there are no custom APIs installed. You need to install packages that provide custom APIs designed to do whatever it is that you want to accomplish. This could be a package someone else authored or it could be a package that you have authored yourself. `Control plane configurations` are one of the core building blocks defined by Crossplane and are the recommended package format for distributing APIs onto a control plane. To learn about using configuration packages, read [creating control plane configurations]().

## Creating an XRD

CompositeResourceDefinitions (XRDs) define the type and schema of your Composite Resource (XR). Think of the XRD as the object that defines the **shape** of your API. While the specific fields you define in the `spec` of your XRD are highly dependent on the use case you’re trying to accomplish, there are a general set of best practices you can apply to help you approach how to define an XRD.

### Purpose

Before writing a single line of .yaml, you need to think of answers for the following questions:

- Who is going to consume this API?
- What inputs do they need to provide this API?
- What managed resources do you want to compose together and hide behind this API?
- For each managed resource you want to compose, which fields are required 

### Required fields for composed resources

There are two reasons it's important to know which fields are required in the MRs you want to compose:

1. There's a high likelihood you want to either expose or let your consumers influence indirectly these fields in your API
2. Composite Resources ultimately instantiate MRs, so you need to create valid MRs in order for your Composite Resource to create successfully.

Use the [Upbound Marketplace’s](https://marketplace.upbound.io/) API documentation feature to see which fields are required or optional under the `spec.forProvider`. For example, notice in the AWS EKS Cluster resource API documentation how `region` is required whereas `version` is not.

{{<img src="xp-arch-framework/images/eks-required-fields.png" alt="Which fields are required for EKS cluster" size="small" quality="100">}}

Sometimes a managed resource will have fields that need to have a value but it is not explicitly marked as `required`. For example, AWS Lambda Function resource API documentation stipulates that “filename, image_uri, or s3_bucket must be specified”, yet none of those fields individually are marked required. It is helpful to look at resources `Examples` in the Upbound Marketplace, because these examples demonstrate configs for MRs that have been verified to successfully create.

Fields that are required in order for an MR to successfully create usually indicate important details that impact what gets created. Consider whether these fields should be inputs directly supplied by your API’s consumers, whether it should be influenced by inputs provided by your API’s consumers, or whether they have no business influencing its value at all.

### Scaffolding an XRD

XRDs follow the [OpenAPI](https://swagger.io/specification/) “structural schema”. Below is boilerplate .yaml that you can use to scaffold the start of an XRD.

{{< expand "Scaffolding for a CompositeResource Definition (XRD)" >}}
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
```
{{< /expand >}}

You will want to give your Composite Resource a name and update the API group it should be served from. The scaffold above also assumes you want this Composite Resource to be claimable. If you don’t want to allow users to create claims against this Composite Resource, omit the `claimNames` field.

{{< hint "important" >}}
**Should your composite resource be claimable?** In most circumstances, the answer is "yes". Crossplane composite resources are cluster-scoped objects, which means they're not associated with any given namespace in your control plane. By making a composite resource claimable, this enables you to restrict users to different namespaces in your control plane and thereby improve isolation between them. To learn more, read the [architecture]() guide.
{{< /hint >}}

### Versioning an XRD

Over the lifetime of your custom API, there is a chance the shape of the API could change and you could introduce breaking changes. Crossplane has a built-in capability to help with this. The scaffolding above recommends a boilerplate version named `v1alpha1`. Notice the `versions` field is an array, so you can declare multiple versions of your API definition in the XRD:

{{< expand "Versioning a CompositeResource Definition (XRD)" >}}
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
{{< /expand >}}

Note this is just the definition portion of your new API version; you also need to create new compositions that implement the new version. Learn how to do this in the [compositions]() page.

#### Converting resources between XRD versions

Beginning in Crossplane v1.12.0 and later, Crossplane supports using webhooks to convert resources between defined versions of an XRD. To do this, you declare a `conversion` strategy in the `spec` of the XRD.

{{< expand "Upgrade strategy for a CompositeResource Definition (XRD)" >}}
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
spec:
  conversion:
    strategy: Webhook
    webhook:
      ...
```
{{< /expand >}}

## Creating a Composition

Compositions are the implementations of the schema you define in your XRD. The relationship between XRDs is one-to-many. That is, you can have multiple compositions that implement the spec of an XRD and you can tell Crossplane which one to select. You should only begin authoring compositions after you’ve [defined your XRD](#creating-an-xrd).

### Scaffolding a composition

Compositions follow the [OpenAPI](https://swagger.io/specification/) “structural schema”. Below is boilerplate .yaml that you can use to scaffold the beginning of a composition.

{{< expand "Scaffolding for a Composition" >}}
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
{{< /expand >}}

### Composition versioning

As described in [versioning an XRD](), when you change the shape of an API and define a new version (v1alpha1 -> v1alpha2) in your XRD, you must create a new composition that implements the new version. To do this, define a new composition object, and point the `compositionTypeRef` to the new API version.

{{< expand "Versioning a Composition" >}}
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
{{< /expand >}}

## Creating a Configuration

A Control plane configuration is a bundle containing multiple APIs–their definitions (XRDs) and their implementations (compositions). Whereas Crossplane composite resources allow you to define a single API, configurations allow you to bundle a set of related APIs together, version them, and declare their dependencies. When a configuration is built, the output is a package that, today, is an OCI image.

### When to create a control plane configuration

Configurations are the packaging format of choice to use for delivering **all APIs** to a control plane–even as little as a single API. You should always use configurations to distribute and install new APIs on a Crossplane instance. There is a build process that must be executed to package a configuration into a redistributable artifact. 

### Folder layout for a configuration

At the root of every Crossplane configuration is a `crossplane.yaml` metadata file. Therefore, we recommend establishing a folder structure like below:

{{< expand "Directory structure for a configuration" >}}
- Root folder (/)
  - Crossplane.yaml
  - apis folder 
  - Top-level api
    - composition.yaml
    - definition.yaml
  - Top-level api
    - composition.yaml
    - definition.yaml
  - …
{{< /expand >}}

This structure works well for simple APIs that have a simple definition (XRD) and single implementation (1 composition) that are all defined locally and will be bundled in this configuration.

As we discuss in docs for building compositions, compositions can be nested and/or they can have multiple implementations. The same structure applies and would look like the following:

{{< expand "Directory structure for a configuration with nested XRs" >}}
- Root folder (/)
  - Crossplane.yaml
  - apis folder 
    - Top-level api
      - composition.yaml
      - Definition.yaml
      - Sub-level api folder 1
        - Composition.yaml
        - Definition.yaml
      - Sub-level api folder 2
        - Composition.yaml
        - Definition.yaml
    - Top-level api
      - composition-aws.yaml
      - composition-gcp.yaml
      - composition-azure.yaml
      - definition.yaml
    - …
{{< /expand >}}

Ultimately, the folder structure that you execute a configuration build within does not affect Crossplane’s ability to build a package–it is purely for readability. However, a notable exception is you need to ensure there are no .yaml files located in your repo that you don’t want Crossplane to parse.

### Declaring dependencies
A configuration can declare dependencies, which is done in the `spec.dependsOn` field in the crossplane.yaml. This is handy for two reasons:

First, you can declare which Crossplane provider version your configuration depends on (say, if it uses an API version of a managed resource that changed from provider-aws v0.33.0 to provider-aws v0.34.0). This ensures your configuration will have the provider & version it needs in order to operate.

Second, you can declare dependencies on other configurations. This enables you to chain dependencies together (discussed more below). Declaring a dependency on another configuration looks something like this:

{{< expand "Configuration dependencies" >}}
```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  crossplane:
    version: ">=v1.7.0-0"
  dependsOn:
    - provider: xpkg.upbound.io/upbound/provider-aws
      version: ">=v0.0.1"
    - configuration: xpkg.upbound.io/upbound/configuration-eks
      version: ">=v0.0.2"
```
{{< /expand >}}

### Chaining configurations together
Because configurations enable you to declare dependencies on other configurations, you are enabled to use a building blocks pattern. Rather than put every API that you want to create into a single configuration OR duplicate definitions of APIs across multiple configurations, you can improve reusability by logically structuring your configurations and composing them into larger or smaller packages, depending on your need.

For example, you could define configurations based on the scope of the APIs:

- **myorg-configuration-networking** defines a set of APIs that your organization will use for provisioning networking resources
- **myorg-configuration-compute** defines a set of APIs that your organization will use for provisioning compute resources (VMs, clusters, etc).
- **myorg-configuration-storage** defines a set of APIs that your organization will use for provisioning storage resources (buckets, databases, etc).
- **myorg-configuration-iam** defines a set of APIs that your organization will use for provisioning identity-related resources (roles, policies, etc).
- **myorg-configuration-serverless** defines a set of APIs that your organization will use for provisioning serverless-related resources (functions, 

This would allow you to create configurations that selectively bundle some–but not all–of these APIs into higher-level configurations.

- **Myorg-config-team1** that has a dependency on _myorg-configuration-networking_ and _myorg-configuration-compute_.
- **Myorg-config-team2** that has a dependency on _myorg-configuration-serverless_ and _myorg-configuration-storage_.

## API Patterns and Best Practices

When it comes to combining XRDs and compositions to define and implement your custom APIs, there are four design patterns. We divide API patterns into three major areas. The area depends on stakeholders/teams and can be one of 3:

- **Development** - patterns in this area focus on developer related activities
- **Collaboration** - patterns in this area focus on collaboration between different teams
- **Platform** - patterns in this area focus on the platform, operations, security

### Pattern Design 

Each pattern is divided into 3 sections.

#### Scope
- Name: a descriptive and unique name that helps in identifying and referring to the pattern.
- Intent: a description of the goal behind the pattern and the reason for using it.
- Motivation: s scenario consisting of a problem and a context in which this pattern can be used.

#### Requirements & Applicability

- Applicability: situations in which this pattern is usable; the context for the pattern.
- Participants: Stakeholders and roles within the pattern
- Consequences: A description of the results, side effects, and trade-offs caused by using the pattern. Known Uses: Examples of real usages of the pattern in Upbound, open-source projects or customers willing to share theirs.

#### Implementation Details

- Component and Runtime diagrams
- YAML samples
- implementation specific concerns

### Patterns

#### 1. Product Pattern

The intent of this pattern is to simplify the creation of infrastructure by providing a very simple claim with a "class" field following the MapExpand pattern.

The motivation for this pattern is that oftentimes teams want to get a database quickly for testing purposes and they don't care to have lots of knobs and buttons. The output of this pattern is a low-context composition which can be deployed by an operator who is not a service owner.

The basic configuration is “baked into” the composition; only environment parameters are exposed. As a consequence, tweaking the configuration in a single environment is not fast or easy. Global reconfigurations of the compositions are achieved by rebuilding and deploying.

#### 2. Kiosk Pattern

The intent of this pattern is to provide Developer Teams maximum control over the underlying infrastructure. You can use this pattern when you are working with an app team who want to control what their database does, what features are on/off, how everything is implemented.

Compositions following this pattern are usually built around a single Managed Resource (such as a database). The platform team retains control over which values can be exposed in the composition. The platform team can also bake-in support (such as adding a standard group of users to a database) and security (such as acls or security groups). Tweaking configurations that follow this pattern are fast and easy.

#### 3. Helper Pattern
The intent of this pattern is to provide users a handy and reusable abstraction. This pattern allows you to increase reusability and standardize on larger compositions.

As a result, compositions are highly specialized to a use case. Outside of their intended scope, they’re not generally useful.
Environment Config Pattern
The intent of this pattern is to encapsulate an environment configuration in a composition. This establishes a principal source of truth for an environment’s configuration.

As a result, compositions are highly specialized to their built-for use case.
