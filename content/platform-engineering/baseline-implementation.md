---
title: "Baseline Implementation"
weight: 10
description: A guide for implementing an Internal Developer Platform on Upbound
---

The baseline architecture is meant to represent the most contrived platform imaginable on Upbound. 

## Parts of a platform

Think of a platform as consisting of two major parts:

1. At the heart of your platform is a control plane
    - You've configured its capabilities to manage the resources you want. 
    - You've configured to enforce the Identity and Access Management that makes sense for you: which users of your platform can access which resources and in what target environment
    - You've configured it for connectivity to underlying cloud service providers.
2. Your platform can expose one or more interfaces for interacting with its control plane. 
    - This could be a graphical user interface like the AWS console or Azure portal
    - a CLI
    - a Rest API, etc.

For a baseline architecture on Upbound, suppose the following constraints:

1. The platform on Upbound is owned entirely by a single platform team.
2. The platform is powered by a single Upbound managed control plane.
3. A single control plane project defines in totality the capabilities of the control plane for this platform.
4. A GUI is the desired primary interface exposed to consumers of this platform.

## Control plane project layout

Upbound recommends using our development experience and tooling to define your platform. A [control plane project]({{<ref "core-concepts/projects">}}) is the source-level representation of your control plane. The control plane project--or just 'project'--is where you define all composite resources to be offered on your platform:

- The definitions and compositions for each composite resource should be defined in the _/apis_ folder
- The functions used in your composition should be defined in the _/functions_ folder.
- All dependencies for your control plane--such as provider versions, functions, etc--should be defined in the _upbound.yaml_ at the root of the project.

## Control plane environments

Following software best practices, Upbound recommends the creation of three control plane instances mapping to software environments. Each control plane is responsible for managing cloud resources in a corresponding set of cloud accounts:

- a control plane for inner-loop development. This control plane is used by the platform team to iterate on their API schemas and compositions.
- a control plane for non-prod. This control plane is used as a staging environment by the platform team before rolling onto production.
- a control plane for production. This control plane is what powers the production instance of your platform and is used by your platform consumers.

All three control planes derive their definition from the same project explained earlier. 

### Set up Continuous Integration

Control plane projects require a build step to assemble all parts of your control plane together into a single OCI image. Upbound recommends setting up a Continuous Integration (CI) flow to build the project and deploy it into the environments explained above. Upbound has published GitHub actions to demonstrate how to use up in a workflow to accomplish this. 

## Platform interfaces

### Consumer Portal

Today, Upbound offers an out-of-box portal as one potential interface for the consumers of your platform. Selecting "Consumer Portal" in the Upbound Console takes users to a view where they can see all composite resource types available on the control plane, select one to see its instances, and create new instances by using the Consumer portal's dynamic CRUD form experience.

Here's a sample of the Consumer portal CRUD form that Upbound generates automatically based on the XRD defined by the platform team.

### GitOps

Upbound managed control planes are fully compatible with GitOps toolchains. If you'd like to offer Git and Argo as an interface to your consumers–either to supplement the Consumer portal or instead of it--this is [fully supported]({{<ref "mcp/gitops">}}).

### CLI 

Your platform's control plane is fully compatible with Kubernetes CLIs, such as kubectl. Users can use kubectl to interact with the APIs offered by your platform's control plane.

Upbound doesn't offer an auto generated, custom, bespoke CLI for your platform on Upbound today. If this is interesting to you, reach out to your Upbound account representative.

## Limitations

Upbound believes this architecture won't scale to support the demands of enterprise customers trying to build at-scale platforms for use across their entire enterprise. 

### Software development lifecycle (SDLC)

One limitation of this architecture is that it doesn't scale well for scenarios where multiple platform teams collectively own the platform. One constraint stated earlier is that the platform would be owned by a single platform team. Upbound knows that most enterprises actually have multiple platform teams who own a slice of responsibilities of the overall platform. 

Enterprises have different directives for how they slice up responsibilities. The two most common are:

1. Teams that are responsible for a slice of infrastructure type. Examples: "a platform team for databases," "a platform team for networking."
2. Teams that are responsible for a given SaaS provider. Examples: "the AWS platform team," "the GCP platform team," "the GitHub platform team."

In either case, this means multiple platform teams (who likely don't exist in the same business unit of the organization) need to collaborate together to deliver a unified platform experience. In the Getting Started architecture, this practically means platform teams need to collaborate on building a "monolithic application"-- literally, a single control plane project. This poses similar challenges to building monolithic vs microservice application architectures.

_Diagram courtesy of Microsoft Azure's CI/CD guide_

In Upbound, Composite Resources are the main artifact that a platform team is responsible for producing. The parts that make up a composite resource are:

A CompositeResourceDefinition (XRD), which defines the shape of the API schema for the new resource type
A composition, which defines the implementation of the API schema. Compositions are defined as a collection of resources defined in Crossplane providers and composition functions. Both providers and functions are semantically versioned things.

In the Getting Started architecture, this means platform teams need to ensure the dependencies they take as part of building their Composite Resources are the same version used by all platform teams, since they're building things from a single control plane project. 

As we've seen with modern Software Development Lifecycle (SDLC) practices with containers, modularizing software into self-contained chunks is a faster, more scalable way to build software because it resolves pesky artifact dependency resolution issues. The same is true for building your platform's control plane: if one platform team has built and tested their XR using function-kcl:v0.10.0 and provider-gcp-container:v1.11.2, that's what would get installed in the control planes and all teams would have to use this version if the getting started architecture was followed.

While organizations can mandate certain versions for all teams to use the same dependencies, this requires constant integration testing to be performed across the entire platform whenever a version is bumped. This must happen in lock-step for all teams, which is a slow and painful process.

### Permissions

Using a single managed control plane to power your entire platform means all platform collaborators must have access to a single shared context. This is a non-issue if a single team owns the platform, but can introduce risks once multiple teams have to share the same context to develop the platform. Much of Crossplane is cluster-scoped and there's inherent risk to a platform team inadvertently modifying another platform team's composites. 

### Geolocation

Managed control planes in Upbound are ultimately deployed somewhere to a physical location, whether that's:

- one of Upbound's SaaS-managed Cloud Spaces, such as GCP us-central-1 or AWS us-east-1
- your own self-hosted Space, running in some region of your own cloud provider account or on-prem datacenter.

The baseline architecture is by design powered by a single control plane, meaning it's geolocated in a single region. All control operations for your platform originate from this single location; if you're managing resources in other geolocations around the globe, you must deal with cross-region latency. If you have a business need to run your platform in multiple geolocations distributed around the globe or across different hosting Cloud Providers, this is a limitation you must be aware of. 

