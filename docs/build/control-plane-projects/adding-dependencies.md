---
title: "Adding dependencies to your Control Plane Projects"
weight: 1
description: "The basic concepts to help you on your Upbound journey"
aliases:
    - /core-concepts/adding-dependencies
    - core-concepts/adding-dependencies
---

A dependency can be a provider, function or a configuration that you want to
install to your control plane project. When you install a dependency, the Upbound CLI unpacks and references the
dependency automatically in your `upbound.yaml` project file.

First, open the `upbound.yaml` project file in your editor.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: platform-api
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/upbound/platform-api
  source: github.com/upbound/project-template
```

<!-- vale Microsoft.Auto = NO -->
<!-- vale write-good.Passive = NO -->
The `spec.dependsOn` field lists your control plane project dependencies.
When you initialize your control plane project, the auto-ready function is
included by default.
<!-- vale write-good.Passive = YES -->
<!-- vale Microsoft.Auto = YES -->

## Add a provider

Use the [up dependency add][up-dependency-add] command to install a provider to your Upbound project.

```shell
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```

In your `upbound.yaml` file, the provider you just installed is automatically captured in the `spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.16.0
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```
## Add a function

Use the [up dependency add][up-dependency-add] to install a function dependency to your project. 


```shell
up dependency add xpkg.upbound.io/crossplane-contrib/function-status-transformer:v0.4.0
```

In your `upbound.yaml` file, the function you just installed is automatically captured in the `spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.16.0
  - function: xpkg.upbound.io/crossplane-contrib/function-status-transformer
    version: v0.4.0
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```

## Adding a configuration

Use the [up dependency add][up-dependency-add] command to install configurations into your Upbound project.

```shell
up dependency add xpkg.upbound.io/upbound/platform-ref-aws:v1.2.0
```

In your `upbound.yaml` file, the configuration you just installed is automatically captured in the `spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.16.0
  - function: xpkg.upbound.io/crossplane-contrib/function-status-transformer
    version: v0.4.0
  - configuration: xpkg.upbound.io/upbound/platform-ref-aws
    version: v1.2.0
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```

## Manage dependency versions
You can manage dependencies in your control plane projects in two ways:

1. In your `upbound.yaml` file, you can update the versions of your dependencies, and then run the [up dependency update-cache][up-dependency-update-cache] command.
1. You can rerun the [up dependency add][up-dependency-add] command with the new version
provided for a specific dependency. This updates the dependency cache
automatically.

To wipe the dependency cache, run
the [up dependency clean-cache][up-dependency-clean-cache] command.

## Manage dependency versions in disconnected environments

### Prerequisites

* The `up` CLI `v0.39` or higher [installed][installed]

In disconnected environments or private container registries like AWS `ECR`, Azure
`ACR`, or Google `GCR` dependencies use packages from Upbound's public registries
like `xpkg.upbound.io`.

<!-- vale Google.WordList = NO -->
With the `imageConfig` functionality in your `upbound.yaml` project file you can override image
prefixes during dependency resolution:
<!-- vale Google.WordList = YES -->

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: platform-api
spec:
  dependsOn:
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  imageConfig:
  - matchImages:
    - prefix: xpkg.upbound.io
      type: Prefix
    rewriteImage:
      prefix: 123456789101.dkr.ecr.eu-central-1.amazonaws.com
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: 123456789101.dkr.ecr.eu-central-1.amazonaws.com/upbound/platform-api
  source: github.com/upbound/project-template
```

When you run [up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.21.1][up-dependency-add], this `upbound.yaml` project file:
1. Matches any dependency image starting with `xpkg.upbound.io`
1. Rewrites the dependency to your private registry repository

Because `provider-aws-s3` depends on `xpkg.upbound.io/family-provider-aws`,
Upbound writes these packages to your private `ECR` registry as described in
your `imageConfig`.

When you run `up dependency add`, the `upbound.yaml` file retains the original
registry under `spec.dependsOn`:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: platform-api
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.21.1
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  imageConfig:
  - matchImages:
    - prefix: xpkg.upbound.io
      type: Prefix
    rewriteImage:
      prefix: 123456789101.dkr.ecr.eu-central-1.amazonaws.com
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: 123456789101.dkr.ecr.eu-central-1.amazonaws.com/upbound/platform-api
  source: github.com/upbound/project-template
```

## Next steps
After adding dependencies to your control plane projects, learn how to create an
API in the next guide: [Authoring a Composition Resource Definition
(XRD)][authoring-a-composition-resource-definition-xrd]

[up-dependency-add]: /apis-cli/cli-reference/#up-dependency-dep-add
[up-dependency-update-cache]: /apis-cli/cli-reference/#up-dependency-dep-add
[up-dependency-clean-cache]: /apis-cli/cli-reference/#up-dependency-dep-clean-cache
[authoring-a-composition-resource-definition-xrd]: /build/control-plane-projects/authoring-xrds
[installed]: /operate/cli
<!--- TODO(tr0njavolta): links --->
