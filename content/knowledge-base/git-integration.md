---
title: Building and Consuming Managed Control Planes with GitOps
weight: 4
description: Using version control best practices with your MCPs.
---

## GitOps for building vs GitOps for consuming

GitOps, the practice of managing the development, deployment, and lifecycle of
software artifacts using Git, has become a widely adopted best practice. Upbound
emphasizes this approach, both in building an consuming managed control planes.

Building managed control planes consists of defining the APIs that are available
for users to interact with. Operators define these APIs either via the developer portal or the Kubernetes
API directly. Consuming is the act of interacting with those APIs. Though both
involve authoring manifests and applying them to the Kubernetes API server, they
represent separate operations with different lifecycles.

Building control planes is a core feature of Upbound. Upbound stores every managed control plane's API in a Git repository,
and can Upbound can update them with built-in Git integration. Consuming control
planes, may look different from one organization to another.
Upbound encourages a GitOps approach in consuming control planes, each
organization determines how they build their Git integration.
Because managed control planes are Kubernetes API compatible, any GitOps tooling
that works with Kubernetes also works with managed control planes running on
Upbound.

## Building managed control planes

Operators store Upstream [Crossplane packages](https://docs.crossplane.io/latest/concepts/packages/) 
in Git repositories. The repository contains associated
workflows that build the packages into [OCI images](https://github.com/opencontainers/image-spec/blob/main/spec.md) and push
them to the [Upbound Marketplace](https://marketplace.upbound.io/). 

A "root" [configuration package](https://docs.crossplane.io/latest/concepts/packages/#configuration-packages) 
defines a managed control plane.
Instead of pushing the image to a registry, Upbound syncs new updates
automatically, allowing for your managed control planes to roll forward
to new versions.

### Creating a new configuration

The Upbound console enables seamless Git integration by connecting to any newly
created configuration automatically. When creating a configuration, you may
choose to allow Upbound to create a new GitHub repository, or grant permission
to an existing one. If creating a new repository, you can
populate it with manifests from a set of starter templates.

You grant Upbound access to a GitHub account or individual repository through
the installation of a [GitHub app](https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/about-apps).
Once GitHub installs the app in an account, you don't need to install it again when
creating future configurations.

### Relationship between managed control planes and configurations

Configurations describe a versioned API for a managed control plane. 
One configuration may define multiple managed control planes. Upbound recommends 
this practice for rolling out new platform APIs.

For example, an organization may have a development, staging, and production
managed control plane, all associated with the same configuration. 
<!-- vale gitlab.SentenceLength = NO -->
When the platform team would like to update or introduce a new API, they
add it to the existing configuration and commit the changes to their Git repository. 
<!-- vale gitlab.SentenceLength = YES -->
Upbound validates the new configuration, then
show the new versioned definition in the console. 

At that point, any managed control plane may update to the new version of the configuration. This allows 
rolling it out to development first, then staging and production, allows for
testing the new API with a smaller blast radius.

{{< hint "tip" >}}
The Upbound app shows a status on the commit in the GitHub
repository indicating whether the package manifests are valid or not.
{{< /hint>}}

## How to consume Managed Control Planes

Lots of tools offer a GitOps interface to the Kubernetes API, with
two of the most popular options being [ArgoCD](https://argoproj.github.io/cd/)
and [Flux](https://fluxcd.io/). These tools, and most others, require a
Kubernetes API endpoint and credentials to start applying manifests.

### Getting a Kubeconfig for your Managed Control Plane

All managed control planes have a deterministic Kubernetes API server endpoint
in the following form:


`https://proxy.upbound.io/v1/controlPlanes/<account>/<control-plane-name>/k8s`

Generate a `kubeconfig` file for a managed control plane
with the following [up CLI command]({{<ref "cli/command-reference#controlplane-kubeconfig-get" >}}).

```shell
up ctp kubeconfig get -a <account> <control-plane-name> -f <kubeconfig-file> --token <token>
```

{{< hint "tip" >}}
The `up` CLI uses personal access tokens to authenticate to Upbound. You can [generate a personal access token]({{<ref "concepts/console#create-a-personal-access-token-pat" >}}) from the Upbound Console.
{{< /hint >}}