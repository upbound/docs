---
title: "Reference Architecture: Building on Upbound" 
weight: 2
description: An overview for how to succesfully design a solution on top of Upbound
---

This reference provides a recommended baseline architecture to deploy a solution on top of Upbound's managed control planes.

## Structuring managed control planes

This guide helps you think through the key questions to ask as you go to build a solution on Upbound.

### What does the control plane manage

Crossplane as a framework gives users limitless possibilities: you can use a control plane to manage cloud infrastructure. You can use a control plane to provision environments, setting up and wiring together ancillary cloud resources like IAM roles and policy. Or you can use a control plane to stamp out your own apps based on a custom app model. You need to know first what the control plane manages.

### Control plane users

<!-- vale write-good.Weasel = NO -->
<!-- allow "how many teams" -->
Organizations look to control planes to power platforms that enable self-service flows for cloud infrastructure. This means the teams _building_ on top of the control planes aren't necessarily the ones _using_ them. For other organizations, the team that's building with control planes is also the one using it's API. You need to understand who the control plane is for, and if its meant to serve other teams, how many teams you intend to serve.
<!-- vale write-good.Weasel = YES -->

#### Multi-tenancy

Upbound's managed control planes supports multi-tenancy and there are two ways you can have multiple teams using your control planes:

* namespaces
* control plane per team

##### Namespaces

Managed control planes support the creation of multiple namespaces on a given control plane allowing team isolation by namespace. Crossplane Composite Resources are cluster-scoped objects but Crossplane claims are namespace-scoped. A team can create claims to an API in their private namespace and other teams can't see them.

Because APIs are cluster-scoped you can't hide cluster-scoped APIs from one team and make them available to another team.

##### Managed control plane per team

Upbound removes the burden of managing the underlying infrastructure and lifecycle of a control plane. You can consider designating a managed control plane as the isolation boundary between teams. Each team creates claims on their own managed control plane. 

This gives a stronger boundary between teams and guarantees teams only see APIs installed on their control plane. 

<!-- vale write-good.Weasel = NO -->
<!-- allow "many" -->
### Multiple development environments
<!-- vale write-good.Weasel = YES -->

Upbound recommends designating a managed control plane per environment. For example, if you have `dev`, `staging`, and `production` environments, you could have `dev-control-plane`, `staging-control-plane`, and `production-control-plane`.

### Multiple regions

Upbound recommends a control plane per region.

### Cross-cloud resources

Upbound can manage multiple resources across clouds, for example, EKS clusters in AWS and AKS clusters in Azure, from a single control plane. Crossplane allows you can define common API abstractions for these cloud resources and have that abstraction API installed on a single control plane.

## Structuring APIs

It's important to think about the structure of the APIs you want to create and install on them. Upbound installs all APIs on your managed control planes with [Configurations]({{<ref "concepts/mcp/control-plane-configurations.md">}}) that sync from Git.

<!-- vale write-good.Weasel = NO -->
<!-- allow "one-to-many" -->
The relationship of Configurations-to-MCPs is one-to-many. An MCP can only install from one Configuration source. Upbound can install multiple MCPs from a single Configuration.
<!-- vale write-good.Weasel = YES -->

Upbound recommends structuring your APIs in one of two ways:

* define all APIs in a single package
* group APIs by type

### Single package

The simpler way to structure your APIs is to define all the APIs of a control plane in a single Git repository. Define each composition (its XRD and implementation) in the `apis` folder of the Git repository.

{{< expand "Example Git layout for a single repository" >}}
```
apis-repo.git
  crossplane.yaml
  apis/
    your-first-composition/
      composition.yaml
      definition.yaml
    your-second-composition/
      composition.yaml
      definition.yaml
    ...
```
{{< /expand >}}

{{<img src="knowledge-base/images/dev-stg-prod.webp" alt="Illustration of a Configuration stored in Git" size="large" lightbox="true">}}

### Group APIs by type

Another option is breaking up APIs across multiple repositories. Each API is 
grouped together by type. Grouping APIs creates more complex management but can 
be effective when multiple teams are responsible for different pieces of 
cloud infrastructure.

For example, you could group APIs into their own repository by the resources 
they involve:

- Networking
- Identity and Policy
- Compute
- Storage
- Serverless


{{< expand "Example Git layout for multiple repositories" >}}
```
//All APIs for networking services for your platform go here
networking-apis.git
  crossplane.yaml
  apis/
    networking-composition-1/
      composition.yaml
      definition.yaml
    networking-composition-2/
      composition.yaml
      definition.yaml
    ...

//All APIs for compute services for your platform go here
compute-apis.git
  crossplane.yaml
  apis/
    compute-composition-1/
      composition.yaml
      definition.yaml
    compute-composition-2/
      composition.yaml
      definition.yaml
    ...
```
{{< /expand >}}

Once you've organized your APIs by group, you can create Configurations that declare dependencies on the repositories containing the API group. Only the `crossplane.yaml` needs updating to declare dependencies.

<!-- vale gitlab.Substitutions = NO -->
<!-- allow .yaml -->
{{< expand "crossplane.yaml dependency example" >}}
<!-- vale gitlab.Substitutions = YES -->
```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  ...
  dependsOn:
    # replace with the names of your configurations
    - configuration: xpkg.upbound.io/upbound/configuration-rds
      version: ">=v0.0.1"
    - configuration: xpkg.upbound.io/upbound/configuration-eks
      version: ">=v0.0.1"
```
{{< /expand >}}

Upbound's [configuration-aws-icp](https://github.com/upbound/configuration-aws-icp) 
is an example of this approach. It has dependencies on 
[configuration-rds](https://github.com/upbound/configuration-rds) and 
[configuration-eks](https://github.com/upbound/configuration-eks).

{{< hint "tip" >}}
The name that should be used in the `dependsOn` property should be the name of the package. You can find the name of Configurations packages via the [Upbound Marketplace](https://marketplace.upbound.io/).
{{< /hint >}}