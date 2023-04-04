---
title: "Reference Architecture: Building on Upbound" 
weight: 2
description: An overview for how to succesfully design a solution on top of Upbound
---

This reference provides a recommended baseline architecture to deploy a solution on top of Upbound's managed control planes.

## Structuring your managed control planes

This guide is meant to help you think through the key questions to ask as you go to build a solution on Upbound.

### What does the control plane manage?

Crossplane as a framework gives users limitless possibilities: you can use a control plane to manage cloud infrastructure. You can use a control plane to provision environments, setting up and wiring together ancillary cloud resources like IAM roles and policy. Or you can use a control plane to stamp out your own apps based on a custom app model. You need to know first what the control plane is meant to manage.

### Who is the control plane for?

Many organizations look to control planes to power platforms that enable self-service flows for cloud infrastructure. This means the team(s) _building_ on top of the control planes are not necessarily the ones _using_ them. For other organizations, the team that is building with control planes is also the one using it's API. You need to understand who the control plane is for, and if its meant to serve other teams, how many teams you intend to serve.

#### Tenancy Model

Upbound's managed control planes supports multi-tenancy. There are two ways you can have multiple teams using your control planes:

##### Namespaces

Managed control planes support the creation of multiple namespaces on a given control plane. You can therefore separate teams by namespace. Where Crossplane Composite Resources (your APIs) are cluster-scoped objects, Crossplane claims are namespace-scoped; `Team A` can create claims to an API in `Namespace A` and `Team B` can create claims to an API in `Namespace B`. They will not be able to see the other team's claims outside of their namespace.

Because APIs are cluster-scoped, however, you cannot mask certain APIs from a given team but make them available for another team on a single managed control plane. Additionally, the isolation boundary of this model resides at the namespace-level

##### Managed control plane per team

Because Upbound removes the burden of managing the underlying infrastructure and lifecycle of a control plane, you can also consider designating a managed control plane as the isolation boundary between teams: `Team A` would create claims on `managed-control-plane-A` and `Team B` would create claims on `managed-control-plane-B`. 

This gives you a stronger boundary between teams and guarantees they can only ever see available APIs installed on their control plane. This comes at the expense of having more managed control planes.

### How many environments do you have?

Upbound recommends designating a managed control plane per environment. For example, if you have `dev`, `staging`, and `production` environments, you could have `dev-control-plane`, `staging-control-plane`, and `production-control-plane`.

### Do you want to manage resources in multiple regions?

If there are multiple regions that you want your control planes to support, it is generally a best practice to create a control plane per region.

### Do you want to manage cross-cloud resources?

If you want to manage multiple resources across clouds (for example, some EKS clusters in AWS and some AKS clusters in Azure), this is something you can do from a single control plane. Thanks to Crossplane, you can define common API abstractions above these cloud resources and have that API installed on a single, common control plane.

## Structuring your APIs

In addition to figuring out the layout of your managed control planes, it is important to think about the shape of the APIs you want to create and install on them. In Upbound, all APIs are installed on your managed control planes by way of [Configurations]({{<ref "concepts/control-plane-configurations.md">}}) that sync from git.

The relationship of Configurations-to-MCPs is one-to-many. An MCP can only install from one (1) Configuration source. One Configuration source can be installed on many MCPs (and they can have different versions of the same Configuration installed). There are two primary ways to structure your APIs.

### Define all APIs for an MCP in one package

The simpler way to structure your APIs is to define all the APIs of a control plane in a single git repo. Define each composition (its XRD and implementation) in the `apis` folder of the git repo.

{{< expand "Example git layout" >}}
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

### Group APIs by type in a package and declare dependencies

For larger organizations who might have multiple teams responsible for different pieces of cloud infrastructure, it is better to break up APIs across multiple repos, grouped by types. For example, you could group APIs into their own repo by the resources they involve:

- Networking
- Identity and Policy
- Compute
- Storage
- Serverless
- etc 

From here, you would have a git repo layout that looks like below:

{{< expand "Example git layout for multiple repos" >}}
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

Once you've brooken your APIs by group, you can create Configurations that simply declare dependencies on the repos containing the appropriate building blocks. Hence, you would have a third repo, and would only need to update the `crossplane.yaml` dependencies property to declare a dependency:

{{< expand "crossplane.yaml dependency example" >}}
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

You can see an example of this in action by looking at Upbound's [configuration-aws-icp](https://github.com/upbound/configuration-aws-icp) repo example, which declares dependencies on [configuration-rds](https://github.com/upbound/configuration-rds) and [configuration-eks](https://github.com/upbound/configuration-eks)

{{< hint "tip" >}}
The name that should be used in the `dependsOn` property should be the name of the package. You can find the name of Configurations packages via the [Upbound Marketplace](https://marketplace.upbound.io/).
{{< /hint >}}