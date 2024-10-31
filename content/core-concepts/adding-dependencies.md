---
title: "Adding dependencies to a Control Plane Project"
weight: 2
description: "The basic concepts to help you on your Upbound journey"
---

A dependency can be a provider, function or a configuration that you want to install to your control plane project. Any dependencies you add will be automatically added to the `upbound.yaml` file.

First, let's take a look at our `upbound.yaml` file. It should look something like the following.

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

The `spec.dependsOn` field is where all the dependencies of the control plane project are listed. Function-auto-ready is added by default for you when your control plane project is initiated.

Now let's add new dependencies.

## Adding a Provider
Providers can be installed into your Upbound project as a dependency via the [up dependency add]() command.

```shell
up dependency add xpkg.upbound.io/upbound/provider-gcp-sql:v0.10.0
```

In your `upbound.yaml` file, the provider you just installed is automatically captured in the `spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-gcp-sql
    version: v0.10.0
  - function: xpkg.upbound.io/crossplane-contrib/function-auto-ready
    version: '>=v0.0.0'
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```
## Adding a Function
Functions can be installed into your Upbound project as a dependency via the [up dependency add]() command.

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
  - provider: xpkg.upbound.io/upbound/provider-gcp-sql
    version: v0.10.0
  - function: xpkg.upbound.io/crossplane-contrib/function-status-transformer
    version: v0.4.0
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```

## Adding a Configuration
Configurations can be installed into your Upbound project as a dependency via the [up dependency add]() command.

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
  - provider: xpkg.upbound.io/upbound/provider-gcp-sql
    version: v0.10.0
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