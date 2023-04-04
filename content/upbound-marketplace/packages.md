---
title: "Creating and Pushing Packages"
weight: 30
---

{{< hint "warning" >}}
This section covers creating and pushing packages to the Upbound Marketplace. For information about installing packages read the <a href="{{<ref "uxp/packages">}}">Crossplane Packages</a> section.
{{< /hint >}}

## Package types
Crossplane supports two package types, `Configurations` and `Providers`.

* **`Configuration`** packages combine Crossplane _Composite Resource Definitions_, _Compositions_ and metadata. 
* **`Provider`** packages combine a [Kubernetes controller](https://kubernetes.io/docs/concepts/architecture/controller/) container, associated _Custom Resource Definitions_ (`CRDs`) and metadata. The Crossplane open source [AWS provider package](https://github.com/crossplane-contrib/provider-aws/tree/master/package) is an example a provider's metadata and `CRDs`.

## Prerequisites

* Building and pushing packages require the [`up` command-line]({{<ref "/cli" >}}).
* Pushing packages requires an [Upbound account]({{<ref "users/register">}}).

## Build a package
Build a package using `up xpkg build`. 

The `up xpkg build` command expects a `crossplane.yaml` file to provide the metadata for the package file. 

The default name is the `metadata.name` value in the `crossplane.yaml` file. 

```shell
up xpkg build
xpkg saved to /home/vagrant/pkg/test-config-15ab02d92a30.xpkg
```

Provide a specific package name with `up xpkg build --name <package name>`.

By default `up xpkg build` saves the package to the current directory. Specify a specific location with `up xpkg build -o <path>`.

The [`up xpkg build` command reference]({{<ref "cli/command-reference/xpkg/build" >}}) contains all available options.

## Push a package
Before pushing a package you must [login]({{<ref "/upbound-marketplace/authentication">}}) to the Upbound Marketplace using `up login`.

### Create a repository
Upbound hosts packages in an Upbound _repository_. Create a repository with the [`up repository create`]({{<ref "cli/command-reference/repository#up-repository-create" >}}) command.

For example, to create a repository called `my-repo`
```shell
up repository create my-repo
upbound-docs/my-repo created
```
Repositories have either `public` or `private` visibility:
* `public` visibility means that any published versions of your package will have a public listing page in the Marketplace and can be pulled without credentials.
* `private` visibility means that any published versions of your package will have a listing page that only you and other collaborators in your organization can see. Packages will require authorized credentials to be pulled.

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
The Upbound Marketplace automatically renders specific metadata annotations into listing pages, and it is recommended that all package maintainers add these annotations into their `crossplane.yaml` to ensure their listing has all of the key information required such as licenses, links to source code, and contact information for maintainers.

All annotations specified in the <a href="https://docs.crossplane.io/v1.10/reference/xpkg/#object-annotations">xpkg specification</a> are supported.

### Push a package to the repository
Push a package to the Upbound Marketplace using the `up xpkg push` command.

The `up xpkg push` command requires:
* The repository to push a package to.
* A package version tag. The package version tag is a <a href="https://semver.org/">semantic versioning</a> number determining package upgrades and dependency requirements.

The push command syntax is  
`up xpkg push <repository>:<version tag> -f <xpkg file>`.

For example, to push a package with the following parameters:
* Repository `upbound-docs/my-repo`
* Version `v0.2`
* Package file named `my-package.xpkg`

Use the following `up xpkg push` command:

```shell
up xpkg push upbound-docs/my-repo:v0.2 -f my-package.xpkg
xpkg pushed to upbound-docs/my-repo:v0.2
```

{{< hint "note" >}}
You need to <a href="https://accounts.upbound.io/login">login to the Marketplace</a> to see packages in private repositories.
{{< /hint >}}

The package is now available from the Upbound Marketplace. View the Marketplace listing at:
`https://marketplace.upbound.io/<package_type>/<organization or user>/<repository>/`

For example, the Upbound AWS Official Provider is a `provider` package in the `upbound` organization's `provider-aws` repository. The package address is <a href="https://marketplace.upbound.io/providers/upbound/provider-aws/">`https://marketplace.upbound.io/providers/upbound/provider-aws/`</a>

### Publishing public packages

Upbound reviews all public packages, and new repositories have a default publishing policy of requiring a one-time manual approval. To request Upbound to review your package contents before publishing it and all future versions to a public listing page, please email support@upbound.io or message the `#upbound` channel in the [Crossplane Slack](https://slack.crossplane.io/).

Upbound needs the following information before considering a package:
* Public Git repository of the package.
* The Upbound account to list as an owner and point of contact.
* The Upbound repository name.

Whether a package version is published is independent from whether it is public or private. Publish status indicates whether a package version can be viewed in the Marketplace, while privacy indicates who can access it.

{{< table >}}
| | Published | Not Published |
| ---- | ---- | ---- | 
| <b>Public</b> | **Pull:** Anyone<br>**View:** Anyone | **Pull:** Anonymous<br>**View:** No one | 
| <b>Private</b> | **Pull:** Authorized<br>**View:** Authorized | **Pull:** Authorized<br>**View:** No one | 
{{< /table >}}

### FAQ

{{< expand "I pushed a package to my repository, but I don't see it in the Marketplace. Does this mean I can't use it?" >}}
A package can be pushed and pulled regardless of whether they are _published_ (i.e. visible) in the Marketplace. You can verify that you can still pull your packages with any OCI client like [docker](https://docs.docker.com/get-docker/) or [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md).
{{</expand >}}

{{< expand "My package shows as ACCEPTED in the Marketplace. Is something wrong?" >}}
A status of __ACCEPTED__ means that the package is available to be published to the Marketplace, but not yet visible to others. The package can still be pulled.
{{</expand >}}

{{< expand "My package shows as REJECTED in the Marketplace. Is something wrong?" >}}
A status of __REJECTED__ means that the package is not available to be published to the Marketplace. You can click on the status badge to get more information as to why it was rejected, for example the image being too large to index. The package can still be pulled.
{{</expand >}}

{{< expand "Why are some of my package versions published, but others are not?" >}}
The Marketplace only publishes release versions with valid [semver](https://semver.org/) tags. Release candidates and dirty builds that are pushed can still be pulled, but will remain in __ACCEPTED__ status.
{{</expand >}}