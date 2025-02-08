---
title: "Adding dependencies to your Control Plane Projects"
weight: 2
description: "The basic concepts to help you on your Upbound journey"
aliases:
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
