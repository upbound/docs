---
title: Building and Consuming Managed Control Planes with GitOps
weight: 4
description: Using version control best practices with your MCPs.
---

## GitOps for Building vs. GitOps for Consuming

GitOps, the practice of managing the development, deployment, and lifecycle of
software artifacts using Git, has become a widely adopted best practice. Upbound
emphasizes this approach, both in building an consuming managed control planes.

Building managed control planes consists of defining the APIs that are available
for users to interact with, either via the developer portal or the Kubernetes
API directly. Consuming is the act of interacting with those APIs. Though both
involve authoring manifests and applying them to the Kubernetes API server, they
represent separate operations with different lifecycles.

Building control planes is a core feature of Upbound and is built directly into
the platform. Every managed control plane's API is defined in a Git repository,
and can be updated via Upbound's built-in Git integration. Consuming control
planes, on the other hand, may look different from one organization to another.
While Upbound still encourages a GitOps approach in consuming, it is up to each
organization to determine how they would like to setup their Git integration.
Because managed control planes are Kubernetes API compatible, any GitOps tooling
that works with Kubernetes will also work with managed control planes running on
Upbound.

## Building Managed Control Planes

[Crossplane packages](https://docs.crossplane.io/v1.11/concepts/packages/) are
typically stored in version controlled repositories, which contain associated
workflows that build the packages into [OCI
images](https://github.com/opencontainers/image-spec/blob/main/spec.md) and push
them to the [Upbound Marketplace](https://marketplace.upbound.io/). Managed
control planes are defined via a "root" [configuration
package](https://docs.crossplane.io/v1.11/concepts/packages/#configuration-packages),
but instead of needing to be pushed to a registry, Upbound will sync new updates
automatically, allowing for your managed control planes to easily roll forward
to new versions.

### Creating a New Configuration

The Upbound console enables seamless Git integration by connecting to any newly
created configuration automatically. When creating a configuration, you may
choose to allow Upbound to create a new GitHub repository, or grant permission
to an existing one. If creating a new repository, you will have the opportunity
to populate it with manifests from a set of starter templates.

Upbound is granted access to a GitHub account or individual repository through
the installation of a [GitHub
app](https://docs.github.com/en/apps/creating-github-apps/creating-github-apps/about-apps).
Once the app is installed in an account, it does not need to be added again when
creating future configurations.

### Relationship Between Managed Control Planes and Configurations

Configurations describe a versioned API for a managed control plane. However,
one configuration may be used to define multiple managed control planes. This is
a recommended practice for safely rolling out new platform APIs.

For example, an organization may have a development, staging, and production
managed control plane, all associated with the same configuration. When the
platform team would like to introduce a new API or update an existing one, they
will add it to the configuration by committing changes to the `main` branch of
its Git repository. Upbound will validate the new configuration contents, then
surface the new versioned definition in the console. At that point, any managed
control plane may be updated to the new version of the configuration, but
rolling it out to development first, then staging and production, allows for
testing the new API with a smaller blast radius.

{{< hint "tip" >}}
The Upbound app will show a status on the commit in the GitHub
repository indicating whether the package manifests are valid or not.
{{< /hint>}}

## Consuming Managed Control Planes

There are many tools that offer a GitOps interface to the Kubernetes API, with
two of the most popular options being [ArgoCD](https://argoproj.github.io/cd/)
and [Flux](https://fluxcd.io/). These tools, and most others, require a
Kubernetes API endpoint and credentials to start applying manifests.

### Getting a Kubeconfig for Your Managed Control Plane

All managed control planes have a deterministic Kubernetes API server endpoint
in the following form:

```
https://proxy.upbound.io/v1/controlPlanes/<account>/<control-plane-name>/k8s
```

Credentials for this control plane are supplied in the form of a personal access
token (PAT). A `kubeconfig` file can be generated for any managed control plane
with the following command.

```shell
up ctp kubeconfig get -a <account> <control-plane-name> -f <kubeconfig-file> --token <token>
```
