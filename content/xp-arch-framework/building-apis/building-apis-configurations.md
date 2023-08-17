---
title: "Authoring Configurations"
weight: 6
description: "how to build APIs"
---

A Control plane configuration is a package that bundles one or more APIs--their definitions (XRDs) and their implementations (compositions). Whereas Crossplane composite resources allow you to define a single API, configurations allow you to bundle a set of related APIs together. They also allow you to version them and declare their dependencies. Because configurations are packages, they're the output of a build process. Today, that output is an OCI image.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/master/concepts/) documentation.
{{< /hint >}}

## When to create a control plane configuration

**Always!** As a best practice, configurations are the packaging format of choice for delivering **all APIs** to a control plane. Even if that's only a single API, you should always use configurations to distribute and install new APIs on a Crossplane instance. 

## Configuration layout in Git

It's recommended you keep the definitions of your Crossplane configurations in a Git-based version control service. At the root of every Crossplane configuration is a `crossplane.yaml` metadata file. It's recommended you create an `apis` folder next and place all your API definitions in that folder. Each API (XRD and its compositions) should go in its own folder. The folder structure should look like this:

```bash
.
├── crossplane.yaml
└── apis/
    ├── custom-api-1/
    │   ├── composition.yaml
    │   └── definition.yaml
    ├── custom-api-2/
    │   ├── composition.yaml
    │   └── definition.yaml
    └── ...
```

This structure works well for basic APIs that have a definition (XRD) and single implementation (1 composition). They're all defined locally in the directory structure and bundled in a single configuration. 

It's a best practice it improves human readability, not because Crossplane depends on a certain folder structure. The folder structure doesn't affect Crossplane's ability to build a package since all .YAML files get flattened during the build process. 

{{< hint "important" >}}
👉 Be careful to avoid placing .YAML files in your configuration's directory tree that you **don't** want Crossplane to parse. This can cause builds to unintentionally break because Crossplane will attempt to ingest **all** .YAML files.
{{< /hint >}}

If you want to ignore a set of .YAML files during the build process, run the following:

```bash
XPKG_IGNORE='*/generate.yaml'
XPKG_DIR='./'

$(UP) xpkg build \
		--package-root $(XPKG_DIR) \
		--ignore $(XPKG_IGNORE) \
```

You can also specify multiple patterns to ignore as comma-delimited list:

```bash
XPKG_IGNORE='*/pattern.yaml,*/other_pattern.yaml'
XPKG_DIR='./'

$(UP) xpkg build \
		--package-root $(XPKG_DIR) \
		--ignore $(XPKG_IGNORE) \
```


### Advanced layout: Nested compositions

As discussed in docs for building compositions, compositions are nestable and/or they can have multiple implementations. The same folder structure still applies and would look like the following:

```bash
.
├── crossplane.yaml
└── apis/
    ├── custom-api-1/
    │   ├── composition.yaml
    │   ├── definition.yaml
    │   └── sub-level-api/
    │       ├── composition.yaml
    │       └── definition.yaml
    ├── custom-api-2/
    │   ├── composition.yaml
    │   ├── definition.yaml
    │   └── sub-level-api/
    │       ├── composition.yaml
    │       └── definition.yaml
    └── ...
```

## Configuration dependencies

A configuration can declare dependencies as part of its definition. Declare them in the `spec.dependsOn` field in the `crossplane.yaml`. It's handy for two reasons:

1. **Provider resolution**: you can declare which Crossplane provider versions your configuration depends on (say, if it uses an API version of a managed resource that changed from provider-aws v0.33.0 to provider-aws v0.34.0). This ensures your configuration have the provider and version it needs to operate.
2. **use other configurations**: you can declare dependencies on other configurations. This enables you to chain dependencies together (discussed more below). 

Declaring dependencies for a configuration looks like this:
```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  crossplane:
    version: ">=v1.12.1-0"
  dependsOn:
    - provider: xpkg.upbound.io/upbound/provider-aws
      version: ">=v0.0.1"
    - configuration: xpkg.upbound.io/upbound/configuration-eks
      version: ">=v0.0.2"
```

{{< hint "important" >}}
Removing a dependency from your configuration's `dependsOn` list does not automatically uninstall it when reapplied to your Crossplane cluster.
{{< /hint >}}

### Chain configurations together

Because configurations enable you to declare dependencies on other configurations, you can use a building blocks pattern. Rather than put every API into a single configuration OR duplicate definitions of APIs across multiple configurations, you can improve reuse. Logically structure your configurations and compose them into larger or smaller packages, depending on your need.

For example, you could define configurations based on the scope of the APIs:

- **myorg-configuration-networking** defines a set of APIs that your organization uses for provisioning networking resources
- **myorg-configuration-compute** defines a set of APIs that your organization uses for provisioning compute resources (virtual machines, clusters, etc).
- **myorg-configuration-storage** defines a set of APIs that your organization uses for provisioning storage resources (buckets, databases, etc).
- **myorg-configuration-iam** defines a set of APIs that your organization uses for provisioning identity-related resources (roles, policies, etc).
- **myorg-configuration-serverless** defines a set of APIs that your organization uses for provisioning serverless-related resources (functions, etc). 

This would allow you to create configurations that selectively bundle some--but not all--of these APIs into higher-level configurations.

- **myorg-configuration-team1** that has a dependency on _myorg-configuration-networking_ and _myorg-configuration-compute_.
- **myorg-configuration-team2** that has a dependency on _myorg-configuration-serverless_ and _myorg-configuration-storage_.

Another pattern that you can apply to configuration packages and dependency chaining is to have a bootstrap plus pattern approach. One platform team own the baseline set of APIs that exists on all control planes for your organization. Another service or pattern team builds APIs for specific services that sit on top of the baseline set of APIs.

## Build configurations

Because configurations are a package, you must build them before you install into your Crossplane. 

### The build process

Build configurations using the _up_ CLI's [xpkg build]({{< ref "reference/cli/command-reference.md#xpkg-build" >}}) command. You should run this command in the root folder of your configuration--wherever your `crossplane.yaml` is:

```bash
$ up xpkg build -o my-configuration-package.xpkg
xpkg saved to my-configuration-package.xpkg
```

Once you've built a configuration package, push it to any OCI-compliant registry, such as the [Upbound Marketplace](https://marketplace.upbound.io) or your own container registry. You can use up CLI's [xpkg push]({{< ref "reference/cli/command-reference.md#xpkg-push" >}}) command to do this:

```bash
$ up xpkg push my-org/my-configuration-packagev0.0.1 -f my-configuration-package.xpkg
xpkg pushed to my-org/my-configuration-packagev0.0.1 
```

### Set up a build pipeline with GitHub

It's recommended you store your configuration definition in a version controlled environment and set up a build pipeline. The pipeline should automatically create a new version of your configuration when a new commit merges. If you are using a version control service such as GitHub, you can configure a [GitHub Action](https://docs.github.com/en/actions) on the Git repository.

Below is a sample workflow file that uses a GitHub Action, [crossplane-contrib/xpkg-action](https://github.com/crossplane-contrib/xpkg-action). You can use it as the basis for your own GitHub Action, tweaked according to your needs:

```yaml
name: CI

on:
  push:
    branches:
      - main
  workflow_dispatch: {}

env:
  DOCKER_USR: ${{ secrets.DOCKERHUB_USERNAME }}
  PACKAGE_NAME: your-org/your-configuration-name

jobs:
  configuration:
    runs-on: ubuntu-18.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          submodules: true
          fetch-depth: 0
      - name: Set tag
        run: echo "::set-output name=VERSION_TAG::$(git describe --dirty --always --tags | sed 's/-/./2' | sed 's/-/./2' )"
        id: tagger
      - name: Login to Docker
        uses: docker/login-action@v1
        if: env.DOCKER_USR != ''
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build
        uses: crossplane-contrib/xpkg-action@v0.2.0
        with:
          channel: stable
          version: current
          command: build configuration -f ${{ github.workspace }}/package --name package.xpkg
      - name: Push to Dockerhub
        uses: crossplane-contrib/xpkg-action@v0.2.0
        with:
          command: push configuration -f package/package.xpkg ${PACKAGE_NAME}:${{ steps.tagger.outputs.VERSION_TAG }}
      - name: Push Latest to Dockerhub
        uses: crossplane-contrib/xpkg-action@v0.2.0
        with:
          command: push configuration -f ${{ github.workspace }}/package/package.xpkg ${PACKAGE_NAME}
```

## Deploy configurations

To deploy a configuration on a control plane, create a new `Configuration` object on your control plane and reference your package:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
spec:
  commonLabels:
      version: v0.0.1
  package: my-org/my-configuration-packagev0.0.1 
  packagePullPolicy: IfNotPresent
  packagePullSecrets:
    - name: registry-key
```

Because Configurations are just another Kubernetes object, you can apply GitOps patterns and tooling to it. Use GitOps tools to continuously watch a repository source and deploy your desired configuration to your control plane. It's recommended you establish an GitOps-based automated process to apply configurations to your control planes. Read the [baseline control plane architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single" >}}) to learn how.

In the preceding example, it's recommended you add `commonLabels` to your package. It makes it easier to introduce `compositionRevisions` with auto generated labels from this field.

## Next steps

After you've learned how to package and deploy your APIs, you should think about how to architect a production-ready solution on Crossplane. Read [Architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single" >}}) to learn about best practices for how to do this.