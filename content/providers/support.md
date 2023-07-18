---
title: "Support and maintenance"
weight: 30
---
Official providers are open source and available to all Crossplane users.

Support for official providers follows the [product lifecycle]({{<ref "knowledge-base/lifecycle">}}) and support policy of other Upbound components.

More information is available on the [support page]({{<ref "../../support.md" >}}).

## Versions
Official providers have two relevant release numbers:
* Provider release, for example, `provider-aws:v0.17.0`
* Custom Resource Definition (*CRD*) API version, for example `v1beta1`

## Provider releases
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

## Release cadence

Upbound releases new versions of the Official Providers on the last Thursday of every month, except for critical bug or security fixes.