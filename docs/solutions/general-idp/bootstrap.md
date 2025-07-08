---
title: "Bootstrap the platform with GitOps"
sidebar_position: 20
description: "A guide to use an Upbound control plane to bootstrap other platform pieces"
---

The solution uses an Upbound control plane configured with [Argo CD](argoCD) to bootstrap the rest of the platform pieces. This lets you define all parts of your platform in Git and use GitOps workflows to instantiate the entire platform.

## Repository Layout

The source repository for this solution is [available on GitHub](repoSource). 

### Platform instances

All configuration for the solution is under a folder in the root directory called `state`. The definitions for an instantiation of the platform are inside this folder. This lets you define multiple instances of the platform solution, such as to have environment-based deployments:

- a production deployment of your platform, for use by the developers your platform serves
- a non-production deployment of your platform, for use by the platform teams responsible for building the internal platform

The source repository defines two such instances, `solution-idp-non-prod` and `solution-idp-prod`, but you can have as many as you wish.

![ArchitectureDiagram](/img/aws-ref-diagram.png)

### Platform instance configuration

In a given platform instance folder, you'll find a collection of config files that configure the **bootstrap control plane**. This control plane is an instance of Crossplane, meaning that it has a Crossplane Configuration installed on it. The bootstrap control plane has a set of capabilities:

It can create child control planes and supporting resources, which is expressed as an `XEnvironment` resource type.
It has Argo CD installed as an _Upbound Add-On_, so you can use Git as an interface to interact with the bootstrap control plane.

One or more child folders are nested inside the platform instance folder. These correspond to `XEnvironments` that get provisioned and managed by the bootstrap control plane. 

### XEnvironment configuration

Notice how this solution defines a single `XEnvironment` called _frontend_, which is a control plane that'll be responsible for provisioning an instance of Backstage **and** serving a set of APIs that appear in Backstage. 

You're not limited to defining only a single child control plane, however the solution's configured to only connect the _frontend_ control plane to Backstage currently.

Each `XEnvironment` folder defines the complete collection of configurations it needs. In the case of frontend defined in this solution, it defines:

- A set of Crossplane configuration packages, which configure the capabilities of the frontend control plane to provision Backstage and serve a database-as-a-service API.
- A set of Crossplane ProviderConfigs, so the control plane can provision resources in an external service, such as AWS.
- A set of composite resources to instantiate, such as the Backstage portal for this platform.
- A set of composite resource claims to instantiate, such as a PodIdentity resource.

The Argo instance, which runs on the bootstrap control plane, uses sync waves to ensure each component group gets rolled out appropriately to the corresponding `XEnvironment` control plane 

## GitOps

The solution demonstrates an approach for using Argo CD combined with a Crossplane control plane to declaratively manage the entire lifecycle of platform components. Component configurations are all kept in GitHub. 

This lets you use Git as an interface for reviewing and driving any changes to your platform. This may include:

- Expose new capabilities as APIs in your platform
- Upgrading existing control plane components, such as Configurations or Providers used
- Facilitating the provisioning of resource requests to your control plane, created by a form experience in your platform portal

### Argo as an Upbound Add-On

Argo CD is a popular tool for doing cloud native Continuous Integration / Continuous Deployment (CI/CD), and especially for setting up GitOps flows to configure a control plane. The Upbound platform offers an `AddOns` resource type as a mechanism for extending your Upbound control planes with additional non-Crossplane capabilities.

This solution installs ArgoCD as an Upbound Add-On in the bootstrap control plane. This lets you run Argo CD directly next to Crossplane in your Upbound control plane, without needing to bring an external Kubernetes cluster to host Argo CD.

While this solution chooses to use Argo CD, you can use other cloud native CI/CD tools to accomplish the same task.

### Argo ApplicationSets

An `Application` in Argo is the core resource for configuring a source for Argo to sync from and apply to your control plane. Argo CD defines a resource called `ApplicationSet`, which is useful for templating out one or more `Applications`. This solution defines and applies an `ApplicationSet` to the bootstrap control plane.

Once the bootstrap control plane gets fully provisioned and configured with Argo, you can add new `XEnvironments` following the same folder structure convention as demonstrated for the frontend `XEnvironment` and the bootstrap control plane automatically handles provisioning new `XEnvironments`, their underlying control plane, and the control plane's configuration.

[argoCD]: https://argo-cd.readthedocs.io/en/stable/
[repoSource]: https://github.com/upbound/solution-idp