---
title: "Creating and Pushing Packages"
weight: 6
description: "How to create, configure and push packages to the Upbound Marketplace"
aliases:
    - /upbound-marketplace/packages
---

## Package types
Crossplane supports these package types: `Configurations`, `Functions` and `Providers`.

* **`Configuration`** packages combine Crossplane _Composite Resource Definitions_, _Compositions_ and metadata.
* **`Function`** packages include the compiled function code for single or
  multiple processor architectures.
* **`Provider`** packages combine a [Kubernetes controller](https://kubernetes.io/docs/concepts/architecture/controller/) container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The Crossplane open source [AWS provider package](https://github.com/crossplane-contrib/provider-aws/tree/master/package) is an example a provider's metadata and `CRDs`.

## Prerequisites

* Building and pushing packages require the `crossplane` CLI.
* Pushing packages requires an [Upbound account]({{<ref "operate/accounts/identity-management/users.md#create-an-account">}}).

## Build a package
Build a package using `crossplane xpkg build`.

The `crossplane xpkg build` command expects a `crossplane.yaml` file to provide the metadata for the package file.

The default name is the `metadata.name` value in the `crossplane.yaml` file.

```shell
crossplane xpkg build
xpkg saved to /home/vagrant/pkg/test-config-15ab02d92a30.xpkg
```

Provide a specific package name with `crossplane xpkg build --name <package name>`.

By default `crossplane xpkg build` saves the package to the current directory. Specify a specific location with `crossplane xpkg build -o <path>`.

The [`crossplane xpkg build` command reference](https://docs.crossplane.io/latest/cli/command-reference/#xpkg-build) contains all available options.

## Push a package
Before pushing a package you must [login]({{<ref "/upbound-marketplace/authentication">}}) to the Upbound Marketplace using `docker login`.

### Create a repository
Upbound hosts packages in an Upbound _repository_. Create a repository with the [`up repository create`]({{<ref "reference/cli/command-reference#repository-create" >}}) command.

For example, to create a repository called `my-repo`
```shell
up repository create my-repo
upbound-docs/my-repo created
```
Repositories have either `public` or `private` visibility:
* `public` visibility means that any published versions of your package have a public listing page in the Marketplace and authorized credentials aren't required to pull.
* `private` visibility means that any published versions of your package have a listing page that only you and other collaborators in your organization can see. Packages require authorized credentials to pulled.

{{< hint "tip" >}}
All newly created repositories are public by default, and only public repositories can be created for free at this time.
{{< /hint >}}

View any existing repositories with `up repository list`.
```shell
up repo list
NAME         TYPE            PUBLIC   UPDATED
my-repo      configuration   true     23h
```
### Add annotations to your package
The Upbound Marketplace automatically renders specific metadata annotations into listing pages. Upbound recommends that all package maintainers add these annotations into their `crossplane.yaml`. Adding annotations ensures listing have all the required information like licenses, links to source code, and contact information for maintainers.

Upbound supports all annotations specified in the <a href="https://github.com/crossplane/crossplane/blob/master/contributing/specifications/xpkg.md#object-annotations">xpkg specification</a>.

### Push a package to the repository
Push a package to the Upbound Marketplace using the `crossplane xpkg push` command.

The `crossplane xpkg push` command requires:
* The repository to push a package to.
* A package version tag. The package version tag is a <a href="https://semver.org/">semantic versioning</a> number determining package upgrades and dependency requirements.

The push command syntax is
`crossplane xpkg push <repository>:<version tag> -f <xpkg file>`.

For example, to push a package with the following parameters:
* Repository `upbound-docs/my-repo`
* Version `v0.2`
* Package file named `my-package.xpkg`

Use the following `crossplane xpkg push` command:

```shell
crossplane xpkg push upbound-docs/my-repo:v0.2 -f my-package.xpkg
xpkg pushed to upbound-docs/my-repo:v0.2
```

{{< hint "note" >}}
You need to <a href="https://accounts.upbound.io/login">login to the Marketplace</a> to see packages in private repositories.
{{< /hint >}}

The package is now available from the Upbound Marketplace. View the Marketplace listing at:
`https://marketplace.upbound.io/<package_type>/<organization or user>/<repository>/`

For example, the Upbound AWS Official Provider is a `provider` package in the `upbound` organization's `provider-aws` repository. The package address is <a href="https://marketplace.upbound.io/providers/upbound/provider-aws/">`https://marketplace.upbound.io/providers/upbound/provider-aws/`</a>

### Publishing public packages

Upbound reviews all public packages, and new repositories have a default publishing policy of requiring a one-time manual approval. Contact the Upbound team via the `#upbound` channel in the [Crossplane Slack](https://slack.crossplane.io/) to request Upbound to review your package.

Upbound needs the following information before considering a package:
* Public Git repository of the package.
* The Upbound account to list as an owner and point of contact.
* The Upbound repository name.

Publish status indicates whether a package version appears in the Marketplace, while privacy indicates who can access it.

{{< table >}}
| | Published | Not Published |
| ---- | ---- | ---- |
| <b>Public</b> | **Pull:** Anyone<br>**View:** Anyone | **Pull:** Anonymous<br>**View:** No one |
| <b>Private</b> | **Pull:** Authorized<br>**View:** Authorized | **Pull:** Authorized<br>**View:** No one |
{{< /table >}}

### Troubleshooting

{{< expand "A package is in the repository to but not in the Marketplace. Can users pull the package?" >}}
Published packages don't need to be visible to pull. Verify pulling a package with any OCI client like [docker](https://docs.docker.com/get-docker/) or [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md).
{{</expand >}}

{{< expand "The package status lists ACCEPTED in the Marketplace but isn't visible." >}}
__ACCEPTED__ means the package is available for publishing to the Marketplace, but not yet visible to others. Users can still pull the package.
{{</expand >}}

{{< expand "The package status lists REJECTED in the Marketplace." >}}
A status of __REJECTED__ means that the package isn't available for publishing to the Marketplace. Select the status badge to get more information on why Upbound rejected the package. Users can still pull the package.
{{</expand >}}

{{< expand "Why are only some package versions published?" >}}
The Marketplace only publishes release versions with valid [semver](https://semver.org/) tags.
{{</expand >}}
