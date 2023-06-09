---
title: "Official Providers"
weight: 20
---
Upbound creates, maintains and supports a set of Crossplane providers called **official providers**.  

The Upbound official providers are open source under the Apache 2.0 license. Upbound recommends the official providers for all deployments.

Find official providers in the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official). 
All official providers have an `Official` tag.

{{<img src="/upbound-marketplace/images/provider-by-upbound.png" alt="Official provider tag" >}}

## Provider families
Upbound packages each of the official providers for Amazon AWS, Google GCP and Microsoft Azure as a "family." 

A provider family organizes the provider's resources into unique packages, organized by a common set of services.

Provider families reduce the resources required to install and run providers and
improve performance over a single monolithic provider.

### Provider family requirements

Provider families have the following requirements and restrictions:
* Crossplane version 1.12.1 or [UXP]({{<ref "/uxp">}}) version 1.12.1-up.1 or later
* Remove existing [monolithic providers](#monolithic-official-providers) matching the new provider family. 

{{<hint "warning" >}}
If a provider family installs into a cluster with an existing monolithic provider, the family provider doesn't take effect. 

The monolithic provider continues to own all provider resource endpoints until it's removed.

For information on migrating from monolithic providers to provider families read the 
[family providers migration guide]({{<ref "/knowledge-base/migrate-to-provider-families">}})
{{< /hint >}}

### Installing a provider family

Installing a provider family is identical to installing other Crossplane providers.
Create a Provider object with the provider package to install.

For example, to install the provider family AWS S3 provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
```

Install multiple services with multiple Provider objects. For example to install both AWS S3 and EC2 providers:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
```

{{<hint "tip" >}}
Browse the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official) to find the provider services to install. 
{{</ hint >}}

{{< expand "Install Providers in an offline environment" >}}

To install Providers in an offline environment set 
{{<hover label="air" line="7">}}skipDependencyResolution: true{{</hover>}} in
the Provider.

```yaml {label="air"}
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  skipDependencyResolution: true
```

When installing multiple providers, apply `skipDependencyResolution` to every
Provider.

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  skipDependencyResolution: true
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
  skipDependencyResolution: true
```

{{< /expand >}}

View the installed providers with `kubectl get providers`

```shell {copy-lines="1",label="getproviders"}
kubectl get providers
NAME                          INSTALLED   HEALTHY   PACKAGE                                               AGE
upbound-provider-aws-ec2      True        True      xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0      25m
upbound-provider-aws-s3       True        True      xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0       25m
upbound-provider-family-aws   True        True      xpkg.upbound.io/upbound/provider-family-aws:v0.37.0   24m
```

The first provider installed of a family also installs an extra
{{<hover label="getproviders" line="5">}}provider-family{{</hover>}} Provider.
The `provider-family` provider manages the ProviderConfig
for all service providers in the same family. 

### Using ControllerConfigs

The [ControllerConfig](https://docs.crossplane.io/latest/concepts/packages/#speccontrollerconfigref) applies settings to a Provider Pod. With family providers
each provider is a unique Pod running in the cluster. 

When using ControllerConfigs with family providers, each provider needs
a ControllerConfig applied.

For example, both providers reference the same 
{{<hover label="cc" line="8">}}controllerConfigRef.name{{</hover >}}.

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  controllerConfigRef:
    name: my-controllerconfig
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: upbound-provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v0.37.0
  controllerConfigRef:
    name: my-controllerconfig
---
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controllerconfig
```

## Monolithic official providers

Upbound delivered the AWS, GCP and Azure official providers as a single 
monolithic provider beginning in October, 2022. Starting June 13, 2023 
Upbound split these official providers into provider families consisting 
of multiple smaller providers. 

This split enables customers to only install the providers specifically 
needed for their deployment, reducing the requirements for running a control 
plane. 

This change is only a packaging change, and doesn't change the capabilities of the
providers.

Customers running on the original monolithic providers are strongly encouraged 
to migrate as soon as possible to the new family providers. 
For Upbound customers, support for monolithic providers is available through December 13, 2023.

## Versions and releases
Official providers have two relevant release numbers:
* Provider release, for example, `provider-aws:v0.17.0`
* Custom Resource Definition (*CRD*) API version, for example `v1beta1`

### Provider releases
Upbound releases new providers to provide bug fixes and enhancements. Provider versions follow standard semantic versioning (*semver*) standards of `<major>`.`<minor>`.`<patch>` numbering.

**Major version** changes have significant changes to provider behavior or breaking changes to general availability CRD APIs.  

**Minor version** changes expand provider capabilities or create breaking changes to `alpha` or `beta` CRD APIs. Minor versions never change general availability CRD APIs.

**Patch version** changes are bug fixes. Provider capabilities and CRD APIs aren't changed between patch versions. 

<!--
### Custom resource definition API versions
The CRDs contained within an official provider follow the standard Kubernetes API versioning and deprecation policy. 

* `v1alpha` - CRDs under `v1alpha` haven't passed through full Upbound quality assurance. `v1alpha1` providers are for testing and experimentation and aren't intended for production deployment.

* `v1beta1` - This identifies a qualified and tested CRD. 
Upbound attempts to ensure a stable CRD API but may require breaking changes in future versions. `v1beta1` may be missing endpoints or settings related to the provider resource.

* `v1beta2` - Like `v1beta1` CRDs all `v1beta2` providers are fully qualified and tested. `v1beta2` contain more features or breaking API changes from `v1beta1`. 

* `v1` - CRDs that reach a `v1` API version have fully defined APIs. Upbound doesn't make breaking API changes until the next provider API version. 
-->

## Support
Official providers are open source and available to all Crossplane users. 

Support for official providers follows the same support model for other Upbound components. 

More information is available on the [support page]({{<ref "../support.md" >}}).

<!-- TODO
## Coverage

-->