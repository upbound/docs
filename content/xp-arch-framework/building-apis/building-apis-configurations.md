---
title: "Authoring Configurations"
weight: 6
description: "how to build APIs"
---

A Control plane configuration is a package that bundles one or more APIs--their definitions (XRDs) and their implementations (compositions). Whereas Crossplane composite resources allow you to define a single API, configurations allow you to bundle a set of related APIs together, version them, and declare their dependencies. Because configurations are packages, they are the output of a build process. Today, that output is an OCI image.

{{< hint "important" >}}
If you are not already familiar with core Crossplane concepts, we recommend first reading the upstream [Crossplane concepts](https://docs.crossplane.io/v1.12/concepts/) documentation.
{{< /hint >}}

## When to create a control plane configuration

As a best practice, **always!** Configurations are the packaging format of choice for delivering **all APIs** to a control plane–even if that's only a single API. You should always use configurations to distribute and install new APIs on a Crossplane instance. 

## Configuration layout in git

We recommend the definition of your Crossplane configurations to be stored in a git-based version control service. At the root of every Crossplane configuration is a `crossplane.yaml` metadata file. We recommend creating an `apis` folder next and placing all your API definitions in that folder. Each API (XRD and its compositions) should go in its own folder. The folder structure we recommend looks like this:

```bash
.
├── Crossplane.yaml
└── apis/
    ├── custom-api-1/
    │   ├── composition.yaml
    │   └── definition.yaml
    ├── custom-api-2/
    │   ├── composition.yaml
    │   └── definition.yaml
    └── ...
```

This structure works well for simple APIs that have a definition (XRD) and single implementation (1 composition) that are all defined locally in the folder structure and will be bundled in this configuration. 

We recommend this folder structure because it improves human readability, not because Crossplane depends on a certain folder structure. The folder structure does not affect Crossplane’s ability to build a package since all .yaml files are flattened during the build process. 

{{< hint "important" >}}
👉 Be careful to avoid placing .yaml files in your configuration's directory tree that you **don't** want Crossplane to parse. This can cause builds to unintendly break because Crossplane will attempt to ingest **all** .yaml files.
{{< /hint >}}

### Advanced layout: nested compositions

As we discuss in docs for building compositions, compositions can be nested and/or they can have multiple implementations. The same folder structure still applies and would look like the following:

```bash
.
├── Crossplane.yaml
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

A configuration can declare dependencies as part of its definition. This is done in the `spec.dependsOn` field in the `crossplane.yaml`. This is handy for two reasons:

1. **Provider resolution**: you can declare which Crossplane provider versions your configuration depends on (say, if it uses an API version of a managed resource that changed from provider-aws v0.33.0 to provider-aws v0.34.0). This ensures your configuration will have the provider & version it needs in order to operate.
2. **use other configurations**: you can declare dependencies on other configurations. This enables you to chain dependencies together (discussed more below). 

Declaring dependencies for a configuration looks like this:
```yaml
apiVersion: meta.pkg.crossplane.io/v1alpha1
kind: Configuration
...
spec:
  crossplane:
    version: ">=v1.7.0-0"
  dependsOn:
    - provider: xpkg.upbound.io/upbound/provider-aws
      version: ">=v0.0.1"
    - configuration: xpkg.upbound.io/upbound/configuration-eks
      version: ">=v0.0.2"
```

### Chain configurations together

Because configurations enable you to declare dependencies on other configurations, you can use a building blocks pattern: rather than put every API that you want to create into a single configuration OR duplicate definitions of APIs across multiple configurations, you can improve reusability by logically structuring your configurations and composing them into larger or smaller packages, depending on your need.

For example, you could define configurations based on the scope of the APIs:

- **myorg-configuration-networking** defines a set of APIs that your organization will use for provisioning networking resources
- **myorg-configuration-compute** defines a set of APIs that your organization will use for provisioning compute resources (VMs, clusters, etc).
- **myorg-configuration-storage** defines a set of APIs that your organization will use for provisioning storage resources (buckets, databases, etc).
- **myorg-configuration-iam** defines a set of APIs that your organization will use for provisioning identity-related resources (roles, policies, etc).
- **myorg-configuration-serverless** defines a set of APIs that your organization will use for provisioning serverless-related resources (functions, etc). 

This would allow you to create configurations that selectively bundle some–but not all–of these APIs into higher-level configurations.

- **Myorg-config-team1** that has a dependency on _myorg-configuration-networking_ and _myorg-configuration-compute_.
- **Myorg-config-team2** that has a dependency on _myorg-configuration-serverless_ and _myorg-configuration-storage_.

Another pattern that you can apply to configuration packages & dependency chaining is to have one platform team own the baseline set of APIs that exists on all control planes for your organization, then you can have service or pattern teams build APIs for specific services that sit above the baseline set of APIs.

## Build configurations

Because configurations are a package, they need to be built before they can be installed into a Crossplane. 

### The build process

Configurations can be built using the up CLI's [xpkg build](../../cli/command-reference#xpkg-build) command. You should execute this command in the root folder of your configuration--wherever your `crossplane.yaml` is located:

```bash
$ up xpkg build -o my-configuration-package.xpkg
xpkg saved to my-configuration-package.xpkg
```

Once you've built a configuration package, you can push it to any OCI-compliant registry, such as the [Upbound Marketplace](https://marketplace.upbound.io) or your own container registry. You can use up CLI's [xpkg push](../../cli/command-reference#xpkg-push) command to do this:

```bash
$ up xpkg push my-org/my-configuration-packagev0.0.1 -f my-configuration-package.xpkg
xpkg pushed to my-org/my-configuration-packagev0.0.1 
```

### Set up a build pipeline

We recommend storing your configuration definition in a version controlled environment and to set up a build pipeline that will automatically create a new version of your configuration when a new commit is pushed. If you are using a version control service such as GitHub, you can configure a [GitHub Action](https://docs.github.com/en/actions) on the git repo which hosts your configuration definition. 

Below is a sample workflow file that uses a GitHub Action, [crossplane-contrib/xpkg-action](https://github.com/crossplane-contrib/xpkg-action), which you can use as the basis for your own GitHub Action and can be tweaked according to your needs:

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

## Test configurations

Upbound has built a test harness and made it available for customers. Here's how to use it.

## Deploy configurations

To deploy a configuration on a control plane, create a new `Configuration` object on your control plane and reference your package:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
spec:
  package: my-org/my-configuration-packagev0.0.1 
  packagePullPolicy: IfNotPresent
  packagePullSecrets:
    - name: registry-key
```

Because Configurations are just another Kubernetes object, you can apply GitOps patterns and tooling to continuously monitor a repo source and deploy your desired configuration to your control plane. We recommend establishing an GitOps-based automated process to apply configurations to your control planes, which is described and implemented in the [baseline control plane architecture](../architecting-with-control-planes#baseline-control-plane-architecture) 

## Next Steps

Read [API Patterns](../building-apis-patterns).