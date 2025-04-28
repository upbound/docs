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

Use the [up dependency add]({{< ref "reference/cli/command-reference" >}}) command to install a provider to your Upbound project.

<!--- TODO(tr0njavolta): update CLI link --->


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

Use the [up dependency add]({{< ref "reference/cli/command-reference" >}}) to install a function dependency to your project.

<!--- TODO(tr0njavolta): update CLI link --->

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

Use the [up dependency add]({{< ref "reference/cli/command-reference" >}}) command to install configurations into your Upbound project.

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

1. In your `upbound.yaml` file, you can update the versions of your dependencies, and then run the [up dependency update-cache]({{< ref
"reference/cli/command-reference" >}}) command.
<!--- TODO(tr0njavolta): update CLI ref link --->

1. You can rerun the [up dependency add]({{< ref
"reference/cli/command-reference" >}}) command with the new version
provided for a specific dependency. This updates the dependency cache
automatically.
<!--- TODO(tr0njavolta): update CLI ref link --->

To wipe the dependency cache, run
the [up dependency clean-cache]({{< ref
"reference/cli/command-reference" >}}) command.
<!--- TODO(tr0njavolta) update CLI ref link --->

## Manage dependency versions in disconnected environments

### Prerequisites

* The `up` CLI `v0.39` or higher [installed](https://docs.upbound.io/reference/cli/)

When using projects in disconnected environments (e.g., air-gapped) or
with private container registries (e.g., AWS ECR, Azure ACR, Google GCR),
dependencies often reference packages hosted in upbounds public registries like
`xpkg.upbound.io`.

Previously, even if you mirrored a dependency (e.g., provider-aws-s3), its
transitive dependencies (e.g, family-provider-aws) would still point to the
upbounds public registry. With the imageConfig functionality in your
`upbound.yaml`, you can now override image prefixes during dependency
resolution:

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

This configuration tells the Upbound CLI:
1. Match any dependency image starting with `xpkg.upbound.io`
1. Rewrite it to your private registry `123456789101.dkr.ecr.eu-central-1.amazonaws.com`

When you run [up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.21.1]({{< ref "reference/cli/command-reference" >}})

And `provider-aws-s3` depends on `xpkg.upbound.io/upbound/family-provider-aws`, both will now be rewritten to your private ECR registry according to your `imageConfig`.

The updated `upbound.yaml` will retain the original registry information under `spec.dependsOn` due to how `spec.pipeline[].functionRef.name` are implemented within crossplane compositions.

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
(XRD)]({{<ref "authoring-xrds.md" >}})
