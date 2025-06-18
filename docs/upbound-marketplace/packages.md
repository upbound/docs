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
* **`Provider`** packages combine a [Kubernetes controller][kubernetes-controller] container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The Crossplane open source [AWS provider package][aws-provider-package] is an example a provider's metadata and `CRDs`.

## Prerequisites

* Building and pushing packages require the `crossplane` CLI.
* Pushing packages requires an [Upbound account][upbound-account].

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

The [`crossplane xpkg build` command reference][crossplane-xpkg-build-command-reference] contains all available options.

## Push a package
Before pushing a package you must [login][login] to the Upbound Marketplace using `docker login`.

### Create a repository
Upbound hosts packages in an Upbound _repository_. Create a repository with the [`up repository create`][up-repository-create] command.

For example, to create a repository called `my-repo`
```shell
up repository create my-repo
upbound-docs/my-repo created
```
Repositories have either `public` or `private` visibility:
* `public` visibility means that any published versions of your package have a public listing page in the Marketplace and authorized credentials aren't required to pull.
* `private` visibility means that any published versions of your package have a listing page that only you and other collaborators in your organization can see. Packages require authorized credentials to pulled.

:::tip
All newly created repositories are public by default, and only public repositories can be created for free at this time.
:::

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

:::note
You need to <a href="https://accounts.upbound.io/login">login to the Marketplace</a> to see packages in private repositories.
:::

The package is now available from the Upbound Marketplace. View the Marketplace listing at:
`https://marketplace.upbound.io/<package_type>/<organization or user>/<repository>/`

For example, the Upbound AWS Official Provider is a `provider` package in the `upbound` organization's `provider-aws` repository. The package address is <a href="https://marketplace.upbound.io/providers/upbound/provider-aws/">`https://marketplace.upbound.io/providers/upbound/provider-aws/`</a>

### Publishing public packages

Upbound reviews all public packages, and new repositories have a default publishing policy of requiring a one-time manual approval. Contact the Upbound team via the `#upbound` channel in the [Crossplane Slack][crossplane-slack] to request Upbound to review your package.

Upbound needs the following information before considering a package:
* Public Git repository of the package.
* The Upbound account to list as an owner and point of contact.
* The Upbound repository name.

Publish status indicates whether a package version appears in the Marketplace, while privacy indicates who can access it.


| | Published | Not Published |
| ---- | ---- | ---- |
<!-- | <b>Public</b> | **Pull:** Anyone<br>**View:** Anyone | **Pull:** Anonymous<br>**View:** No one | -->
<!-- | <b>Private</b> | **Pull:** Authorized<br>**View:** Authorized | **Pull:** Authorized<br>**View:** No one | -->


### Troubleshooting

<details>

    <summary>A package is in the repository to but not in the Marketplace. Can users pull the package?</summary>

    Published packages don't need to be visible to pull. Verify pulling a package with any OCI client like [docker][docker] or [crane][crane].

</details>

<details>
   
   <summary>The package status lists ACCEPTED in the Marketplace but isn't visible.</summary>

   __ACCEPTED__ means the package is available for publishing to the Marketplace, but not yet visible to others. Users can still pull the package.

</details>

<details>

    <summary>The package status lists REJECTED in the Marketplace.</summary>

    A status of __REJECTED__ means that the package isn't available for publishing to the Marketplace. Select the status badge to get more information on why Upbound rejected the package. Users can still pull the package.

</details>

<details>

<summary>Why are only some package versions published?</summary>

The Marketplace only publishes release versions with valid [semver][semver] tags.

</details>


[upbound-account]: /operate/accounts/identity-management/users/#create-an-account
[login]: /upbound-marketplace/authentication
[up-repository-create]: /apis-cli/cli-reference


[kubernetes-controller]: https://kubernetes.io/docs/concepts/architecture/controller/
[aws-provider-package]: https://github.com/crossplane-contrib/provider-aws/tree/master/package
[crossplane-xpkg-build-command-reference]: https://docs.crossplane.io/latest/cli/command-reference/#xpkg-build
[crossplane-slack]: https://slack.crossplane.io/
[docker]: https://docs.docker.com/get-docker/
[crane]: https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md
[semver]: https://semver.org/
