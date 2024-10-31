---
title: "Support and maintenance"
weight: 30
description: "The Upbound support policy for Official Providers"
---

The source code for Official Providers are [open source](https://github.com/crossplane-contrib/) and available to all Crossplane users. Upbound is the publisher for the Official Provider listings in the [Marketplace](https://marketplace.upbound.io/). Your subscription level determines the level of access to the versions of each Official Provider Marketplace listing.

Support for official providers follows the [product lifecycle]({{<ref "reference/lifecycle">}}) and support policy of other Upbound components.

More information is available on the [support page]({{<ref "../../support.md" >}}).

## Access policy

### Anonymous and Individual Tier subscribers

Anonymous Crossplane community members who doesn't have an Upbound account and `Individual` tier subscribers can access the latest `major.minor.[patch]` release of a given Official Provider. 

When Upbound publishes a new provider version that increments the minor or major number, you lose access to the previous provider version.

### Team, Enterprise, and Business Critical subscribers

If your organizaton has a `Team`, `Enterprise`, or `Business Critical` subscription to Upbound, you can access all published versions of Official Providers. 

To access older Official Provider versions, make sure you've [configured pull secrets for Official Providers]({{<ref "provider-families#configure-pull-secrets-for-official-providers">}})

## Versions

Official providers have two relevant release numbers:

* Provider release, for example, `provider-aws:v1.16.0`
* Custom Resource Definition (*CRD*) API version, for example `v1beta1`

## Provider releases

Upbound publishes new provider versions to provide bug fixes and enhancements. Provider versions follow standard semantic versioning (*semver*) standards of `<major>`.`<minor>`.`<patch>` numbering.

### Versioning policy

#### Major version

The major version number is set to 1 when the provider is considered stable for use in a production environment and long-term support. In cases where the provider is generated using Upjet, If the major version number of the underlying Terraform provider from which it's generated is incremented, the provider’s major version is incremented. If the major version number of the Upjet runtime it's generated with is incremented, the major version number is incremented.

Incrementing the major version resets the minor and patch version number to zero.

#### Minor version

The minor version number is incremented when new features (e.g., new provider functionality, resources or resource fields) are released. Incrementing the minor version resets the patch version number to zero.

#### Patch version

The patch version number is incremented for a release containing only bug fixes and no new features.

#### Backwards compatibility

A release that increments the minor or patch version is backward compatible with the prior release.

#### Family provider versioning

The major, minor and patch versions of all the family providers are updated in unison regardless of whether a specific provider has changes. The providers are all released with the same version number simultaneously.

A family of providers, like [provider-family-aws](https://marketplace.upbound.io/providers/upbound/provider-family-aws), publishes all the providers in the family with the same version number. Using providers from the same family with different version numbers is technically possible, but this could introduce incompatibility in some situations. Due to the large number of combinations, testing all compatibility permutations between different family provider versions isn't feasible. 

Upbound highly recommends that the family providers are all kept on the same version.

The following constraints apply to allow compatibility:

- All family providers must be on the same major version.
- All family providers must be on the same or prior minor version as the family’s config provider.

Examples:

- Technically valid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.1.1`, `provider-aws-ec3:v1.0.1`
- Invalid combination: `provider-family-aws:v1.0.0`, `provider-aws-s3:v1.0.0`, `provider-aws-ec3:v0.46.0`
- Invalid combination: `provider-family-aws:v1.0.0`, `provider-aws-s3:v1.0.0`, `provider-aws-ec3:v1.1.0`

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

Upbound publishes new versions of the Official Providers on the last Thursday of
every month, except for critical bug or security fixes.

You can find an overview of the provider releases for each of the Official
Providers:

* [upbound/provider-aws]({{<ref "provider-aws/_index.md" >}})
* [upbound/provider-azure]({{<ref "provider-azure/_index.md" >}})
* [upbound/provider-gcp]({{<ref "provider-gcp/_index.md" >}})
* [upbound/provider-terraform]({{<ref "provider-terraform/_index.md" >}})
