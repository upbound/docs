---
title: Control Plane Meshes
weight: 150
description: Configure scheduling of composites to remote control planes
---

{{< hint "important" >}}
This feature is in preview.

For Connected and Disconnected Spaces, this feature requires at least Spaces `v1.12.0` and is off by default. To enable, set `features.alpha.controlPlaneMesh.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.controlPlaneMesh.enabled=true"
```
{{< /hint >}}

Upbound's _Control Plane Mesh_ is a feature that lets you build and deploy multiple control planes that work together to provide a unified platform experience. With the _Mesh_ features, you can install composites from Configurations that are reconciled by other control planes and configure how resources are routed to control planes. You can also build compositions that reference other resources running on your control plane or elsewhere in Upbound. 

This guide explains how to use Control Plane Mesh APIs to install, configure remote APIs, and build powerful compositions that reference other resources.

## Benefits

The Control Plane Mesh feature provides the following benefits:

* Decouple your platform architecture into indepedent offerings to improve your platform's software development lifecycle.
* Install composite APIs from Configurations as CRDs which are fulfilled and reconciled by other control planes.
* Route APIs to other control planes by configuring an _Environment_ resource, which define a set of routable dimensions.

## Prerequisites

Enabled the Control Plane Mesh feature in the Space you plan to run your managed control plane in:

- Cloud Spaces: Not available yet
- Connected Spaces: Space administrator must enable this feature
- Disconnected Spaces: Space administrator must enable this feature

## Install a _RemoteConfiguration_

_RemoteConfiguration_ is a resource type available in an Upbound manage control planes that acts like a sort of Crossplane [Configuration](https://docs.crossplane.io/latest/concepts/packages) package. Unlike standard Crossplane Configurations, which install XRDs, compositions, and functions into a desired control plane, _RemoteConfigurations_ install only the CRDs for claimable composite resource types.

### Install directly

Install a _RemoteConfiguration_ by defining the following and applying it to your control plane:

{{< editCode >}}
```yaml
apiVersion: pkg.upbound.io/v1alpha1
kind: RemoteConfiguration
metadata:
  name: $@<your-configuration-name>$@
spec:
  package: $@<xpkg.upbound.io/your-org/your-configuration-name:tag>$@
```
{{< /editCode >}}

### Declare as a project dependency

You can declare _RemoteConfigurations_ as dependencies in your control plane's [project file]({{<ref "core-concepts/projects">}}). Use the up CLI to add the dependency, providing the `--remote` flag:

{{< editCode >}}
```ini
up dep add $@<xpkg.upbound.io/your-org/your-configuration-name:tag>$@ --remote
```
{{< /editCode >}}

This command adds a declaration in the `spec.apiDependencies` stanza of your project's `upbound.yaml` as demonstrated below:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: service-controlplane
spec:
  apiDependencies:
  - configuration: xpkg.upbound.io/upbound/remote-configuration
    version: '>=v0.0.0'
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-kubernetes
    version: '>=v0.0.0'
```

Like a Configuration, a _RemoteConfigurationRevision_ gets created when the package gets installed on a control plane. Unlike Configurations, XRDs and compositions **don't** get installed by a _RemoteConfiguration_. Only the CRDs for claimable composite types get installed and Crossplane thereafter manages their lifecycle. You can tell when a CRD gets installed by a _RemoteConfiguration_ because it has the `internal.scheduling.upbound.io/remote: true` label:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: things.networking.acme.com
  labels:
    internal.scheduling.upbound.io/remote: "true"
```

## Use an _Environment_ to route resources

_Environment_ is a resource type available in Upbound managed control planes that works in tandem with resources installed by _RemoteConfigurations_. _Environment_ is a namespace-scoped resource that lets you configure how to route remote resources to other control planes by a set of user-defined dimensions. 

### Define a routing dimension

To establish a routing dimensions between two control planes, you must do two things:

1. Annotate the service control plane with the name and value of a dimension.
2. Configure an environment on another control plane with a dimension matching the field and value of the service control plane.

The example below demonstrates the creation of a service control plane with a `region` dimension:

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    dimension.scheduling.upbound.io/region: "us-east-1"
  name: prod-1
  namespace: default
spec:
```

Upbound's Spaces controller keeps an inventory of all declared dimensions and listens for control planes to route to them.

### Create an _Environment_

Next, create an _Environment_ on a separate control plane, referencing the dimension from before. The example below demonstrates routing all remote resource requests in the `default` namespace of the control plane based on a single `region` dimension:

```yaml
apiVersion: scheduling.upbound.io/v1alpha1
kind: Environment
metadata:
  name: default
  namespace: default
spec:
  dimensions:
    region: us-east-1
```

You can specify whichever dimensions as you want. The example below demonstrates multiple dimensions:

```yaml
apiVersion: scheduling.upbound.io/v1alpha1
kind: Environment
metadata:
  name: default
  namespace: default
spec:
  dimensions:
    region: us-east-1
    env: prod
    offering: databases
```

In order for the routing controller to match, _all_ dimensions must match for a given service control plane.

You can specify dimension overrides on a per-resource group basis. This lets you configure default routing rules for a given _Environment_ and override routing on a per-offering basis.

```yaml
apiVersion: scheduling.upbound.io/v1alpha1
kind: Environment
metadata:
  name: default
  namespace: default
spec:
  dimensions:
    region: us-east-1
  resourceGroups:
    - name: database.platform.upbound.io # database
      dimensions:
        region: "us-east-1"
        env: "prod"
        offering: "databases"
    - name: networking.platform.upbound.io # networks
      dimensions:
        region: "us-east-1"
        env: "prod"
        offering: "networks"
```

### Confirm the configured route

After you create an _Environment_ on a control plane, the routes selected get reported in the _Environment's_ `.status.resourceGroups`. This is illustrated below:

```yaml
apiVersion: scheduling.upbound.io/v1alpha1
kind: Environment
metadata:
  name: default
...
status:
  resourceGroups:
    - name: database.platform.upbound.io # database
      proposed:
        controlPlane: ctp-1
        group: default
        space: upbound-gcp-us-central1
      dimensions:
        region: "us-east-1"
        env: "prod"
        offering: "databases"
```

If you don't see a response in the `.status.resourceGroups`, this indicates a match wasn't found or an error establishing routing occurred. 

### Limitations

Routing from one control plane to another is currently scoped to control planes in a single Space. You can't route resource requests to control planes that exist in a cross-Space boundary.

## Build compositions with _ReferencedObjects_

_ReferencedObject_ is a resource type available in an Upbound managed control plane that lets you reference other Kubernetes resources in Upbound. Spaces machinery 