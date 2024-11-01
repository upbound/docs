---
title: "Access and Support Policies"
weight: 30
description: "The Upbound publishing and access policy for Official providers."
aliases:
  - providers/support
---

The following providers are designated Upbound Official and are subject to Upbound's publishing and access policies.

{{< table >}}
| Official provider                                                                                        | Upjet-based | Provider family |
|----------------------------------------------------------------------------------------------------------|-------------|-----------------|
| [upbound/provider-family-aws](https://marketplace.upbound.io/providers/upbound/provider-family-aws/)     | Yes         | Yes             |
| [upbound/provider-family-azure](https://marketplace.upbound.io/providers/upbound/provider-family-azure/) | Yes         | Yes             |
| [upbound/provider-family-gcp](https://marketplace.upbound.io/providers/upbound/provider-family-gcp/)     | Yes         | Yes             |
| [upbound/provider-azuread](https://marketplace.upbound.io/providers/upbound/provider-azuread/)           | Yes         | No              |
| [upbound/provider-terraform](https://marketplace.upbound.io/providers/upbound/provider-terraform/)       | No          | No              |
| [upbound/provider-kubernetes](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/)     | No          | No              |
| [upbound/provider-helm](https://marketplace.upbound.io/providers/upbound/provider-helm/)                 | No          | No              |
{{< /table >}}

The source code for the Upbound Official providers are [open source](https://github.com/crossplane-contrib/) and
available to all Crossplane users. Upbound is the publisher for the Official provider listings in
the [Marketplace](https://marketplace.upbound.io/). Your Upbound subscription level determines the level of access to
the versions of each Official provider in the Marketplace.

Read more information on the Official provider
[release schedule and support window]({{<ref "../../reference/lifecycle.md" >}}).

Upbound customers with subscriptions offering Official provider support can find more information available on
the [support page]({{<ref "../../support.md" >}}).

## Access policy

### Anonymous and Individual Tier subscribers

Anonymous Crossplane community members who don't have an Upbound account, as well as `Individual` tier subscribers, can
only access the latest released version of the current `major` version of the Official provider.

When Upbound publishes a new provider version you lose access to the previous provider version and need to upgrade to
the new version. When Upbound publishes a new provider version that increments the `major` number, we provide a 30-day
grace period for accessing the last release of the prior `major` version.

#### Accessing the latest released version

The latest version of an Official provider is accessible to users via the `v[major]` tag in the Marketplace. For
example, if the latest version of `provider-aws-s3` is `v1.16.0`, it is accessible via
`xpkg.upbound.io/upbound/provider-aws-s3:v1`

### Team, Enterprise, and Business Critical subscribers

If your organization has a `Team`, `Enterprise`, or `Business Critical` subscription to Upbound, you can access all
published versions of Official providers.

To access older Official provider versions, make sure you've
[configured pull secrets]({{<ref "provider-families#configure-pull-secrets-for-official-providers">}}) for the Official
providers.

## Publishing policy

Official providers have two relevant version numbers:

* Provider release, for example, `provider-aws:v1.16.0`
* Custom Resource Definition (*CRD*) API version, for example `v1beta1`

### Provider versions

Upbound publishes new Official provider versions to provide bug fixes and enhancements. Provider versions follow
standard [semantic versioning (*semver*)](https://semver.org/) standards of `<major>`.`<minor>`.`<patch>` numbering.

#### Major version

The `major` version number is set to one when the provider is considered stable for use in a production environment and
Upbound is committed to providing long-term support for it. In cases where the provider is generated using Upjet, if the
`major` version number of the underlying Terraform provider from which it's generated is incremented, the provider’s
`major` version is incremented. If the `major` version number of the Upjet runtime a provider is generated with is
incremented, the `major` version number of the provider is also incremented.

Incrementing the `major` version resets the `minor` and `patch` version numbers to zero.

A change in the `major` version number does not come with a backward compatibility guarantee.
The release notes will indicate all breaking changes introduced and provide instructions on adapting to them.

#### Minor version

The `minor` version number is incremented when new features (e.g., new provider functionality, resources or resource
fields) are released. Incrementing the `minor` version resets the `patch` version number to zero. `Minor` version
releases may contain bug fixes in addition to new capabilities.

#### Patch version

The `patch` version number is incremented for a release containing **only** bug fixes and **no** new features.

### CRD API versions

The CRDs contained within an Official provider follow the standard Kubernetes API versioning and deprecation policy.

- `v1alpha1` - CRDs under `v1alpha` haven't yet passed through Upbound's quality assurance process. `v1alpha1` providers
  are for testing and experimentation and aren't intended for production deployment.
- `v1beta1` - This identifies a qualified and tested CRD under common use cases. Upbound attempts to ensure a stable CRD
  API but may require breaking changes in future versions. `v1beta1` APIs may be missing endpoints or settings related
  to the provider resource.
- `v1beta2` - Like `v1beta1` CRDs all `v1beta2` providers are fully qualified and tested. `v1beta2` contain more
  features or breaking changes from the `v1beta1` API.
- `v1` - CRDs that reach a `v1` API version have fully defined APIs. Upbound won't make breaking API changes in the
  current `major` version of the provider.

## Compatibility policy

### Upgrading

A release that increments the `minor` or `patch` version is backward compatible with the prior release.

Backward compatibility promises that the Crossplane-managed resource APIs, configurations, and infrastructure do not
need to be changed when upgrading to a new version with a higher `minor` or `patch` version number and the same `major`
version number. For example, upgrading from `v1.2.3` to `v1.2.4` or `v1.3.0` should work without any needed changes.

It is supported to skip `minor` or `patch` releases and upgrade to the latest release within the same `major` version,
such as upgrading from `v1.2.3` to `v1.2.7` or `v1.5.0`.

Despite the commitment to backward compatibility, upgrades should **always** be simulated in a non-production
environment before being applied in production.

### Downgrading

Backward compatibility is not guaranteed when downgrading to a prior version.

Downgrading to a previous version may require manual intervention to ensure the provider and the resources remain in a
synced/healthy state. In some scenarios, it might be necessary to uninstall the provider and reinstall the older desired
version.

Downgrades should **always** be simulated in a non-production environment before being applied to production. Upbound
customers with subscriptions offering Official provider support are encouraged to speak to their assigned Solutions
Architect before downgrading a provider version in a production environment.

### Family provider version compatibility

The `major`, `minor` and `patch` versions of all the family providers are updated in unison regardless of whether a
specific provider in the family has changes or nor.

A family of providers, like [provider-family-aws](https://marketplace.upbound.io/providers/upbound/provider-family-aws),
is published with all the providers in the family using the same version number. Using providers from the same family
with different version numbers is technically possible, but this could introduce incompatibility in some situations. Due
to the large number of combinations, testing all compatibility permutations between different family provider versions
isn't feasible.

Upbound **highly recommends** that the family providers are all kept on the same version.

The following constraints apply to allow version compatibility:

- All family providers must be on the **same** `major` version.
- All family providers must be on the **same or prior** `minor` version as the family’s config provider (e.g., the
  `provider-aws-family` provider).

Examples:

- Technically valid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.1.1`, `provider-aws-ec3:v1.0.1`
- Invalid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.0.0`, `provider-aws-ec3:v0.46.0`
- Invalid combination: `provider-family-aws:v1.0.0`, `provider-aws-s3:v1.0.1`, `provider-aws-ec3:v1.1.0`

## CVE resolution policy

Upbound will make reasonable commercial effort to ensure its Official providers are free
from [Common Vulnerabilities and Exposures](https://nvd.nist.gov/general/cve-process) (CVEs) under the following
conditions:

1. Upbound’s vulnerability scanners identifies a CVE affecting a provider package
1. The CVE is independently fixable of any other bugs. For a CVE to be fixable, either there is
    1. an upstream release version available which has been verified to fix the CVE, or
    1. an affected provider package can be rebuilt with updated compilers and/or libraries to remediate that CVE.

Upbound will address each CVE meeting the above criteria based on it's severity score, according to the [Common
Vulnerability Scoring System version 3](https://nvd.nist.gov/vuln-metrics/cvss), as follows:

- Critical Severity: Within 7 calendar days from the date an upstream fix is publicly available.
- High, Medium, and Low severity: Within 14 calendar days from the date an upstream fix is publicly available.

A CVE will be considered addressed when a new version of the provider with the fix is released to the Marketplace.