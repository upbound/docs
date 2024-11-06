---
title: "Policies"
weight: 5
description: "The Upbound Official provider policies."
aliases:
  - providers/support
---

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- vale Google.Will = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale write-good.Passive = NO -->
<!-- vale gitlab.SentenceLength = NO -->


The following policies provide details on the use, access, support and maintenance of the Upbound Official providers.

{{< tabs >}}

{{< tab "License" >}}
The Upbound Official providers are open source, and the source code is available under the Apache 2.0 license.

Upbound is the publisher for the Official provider listings in
the [Upbound Marketplace](https://marketplace.upbound.io/providers?tier=official).
{{< /tab >}}

{{< tab "Access" >}}
Your Upbound subscription level determines the level of access to the versions of each Official provider in the
Marketplace.

### Anonymous and Individual Tier subscribers

Anonymous Crossplane community members without an Upbound account, along with
`Individual` tier subscribers, can access only the latest released version of
the current `major` version of each Official Provider.

When Upbound releases a new provider version, access to the previous version
ends, and users must upgrade to the latest version. For major version changes, a
30-day grace period allows access to the last release of the prior `major`
version.

#### Accessing the latest released version

The latest version of an Official provider is accessible to users via the `v[major]` tag in the Marketplace. For
example, if the latest version of `provider-aws-s3` is `v1.16.0`, access it with
`xpkg.upbound.io/upbound/provider-aws-s3:v1`

### Team, Enterprise, and Business Critical subscribers

If your organization has a `Team`, `Enterprise`, or `Business Critical` subscription to Upbound, you can access all
published versions of Official providers.

To access older Official provider versions, make sure you've
[configured pull secrets]({{<ref "pull-secrets">}}) for the Official
providers.
{{< /tab >}}

{{< tab "Support" >}}
For Upbound customers with a `Team` tier or higher subscription, Upbound supports its Official providers for 12 months
from the release date.

Once the support window has lapsed, an unsupported provider version is accessible for another 6 months in
the Upbound Marketplace.

{{< hint "important" >}}
The support window for Upbound Official providers for AWS, Azure, AzureAD, and GCP on versions before v1.0.0 ends after
31 Jan 2025.
{{< /hint >}}

Upbound customers with `Enterprise` tier or higher subscription can [open a ticket]({{<ref "../../support.md" >}}) to
request support with the Official providers.
{{< /tab >}}

{{< tab "Publishing" >}}
Official providers have two relevant version numbers:

* Provider release, for example, `provider-aws:v1.16.0`
* Custom Resource Definition (*CRD*) API version, for example `v1beta1`

### Provider versions

Upbound publishes new Official provider versions to provide bug fixes and enhancements. Provider versions follow
standard [semantic versioning (*semver*)](https://semver.org/) standards of `<major>`.`<minor>`.`<patch>` numbering.

#### Major version


A `major` version indicates production stability and long-term support. When the
`major`  version of the underlying Terraform provider (if generated with Upjet)
or Upjet runtime updates, the provider's `major` version increments. Major
version updates reset
the `minor` and `patch` to zero.

<!-- vale Microsoft.Contractions = NO -->
<!-- vale write-good.TooWordy = NO -->

A change in the `major` version number does not come with a backward compatibility guarantee.
The release notes will indicate all breaking changes introduced and provide
instructions on adapting to them.
<!-- vale write-good.TooWordy = YES -->
<!-- vale Microsoft.Contractions = YES -->

#### Minor version


The `minor` version number increases when new features, such as new capabilities, resources, or fields, are introduced. This update resets the
`patch` number to zero and may also include bug fixes.

#### Patch version

A `patch` version increases for releases with **only** bug fixes and **no** new features.


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

  {{< /tab >}}

{{< tab "Compatibility" >}}

### Upgrading

A release that increments the `minor` or `patch` version is backward compatible with the prior release.

<!-- vale write-good.TooWordy = NO -->

Backward compatibility promises that the Crossplane-managed resource APIs,
configurations, and infrastructure aren't impacted when upgrading to a new version with
a higher `minor` or `patch` version number and the same `major`
version number. For example, upgrading from `v1.2.3` to `v1.2.4` or `v1.3.0`
should work without any needed changes.

<!-- vale write-good.TooWordy = YES -->

You can skip `minor` or `patch` releases and upgrade to the latest release within the same `major` version,
such as upgrading from `v1.2.3` to `v1.2.7` or `v1.5.0`.

Despite the commitment to backward compatibility, you should **always**
simulate upgrades in a non-production
environment before applying to production.

### Downgrading

<!-- vale Microsoft.Contractions = NO -->

Backward compatibility **is not** guaranteed when downgrading to a prior version.
<!-- vale Microsoft.Contractions = YES -->

Downgrading to a previous version may require manual intervention to ensure the provider and the resources remain in a
synced/healthy state. In some scenarios, it might be necessary to uninstall the provider and reinstall the older desired
version.

You should **always** simulate downgrades in a non-production environment before
applying to production. Upbound customers with Official Provider support should
consult their Solutions Architect before a production downgrade.

### Family provider version compatibility

The `major`, `minor` and `patch` versions of all the family providers are updated in unison regardless of whether a
specific provider in the family has changes or nor.

A family of providers, like [provider-family-aws](https://marketplace.upbound.io/providers/upbound/provider-family-aws),
is published with all the providers in the family using the same version number. Using providers from the same family
with different version numbers is technically possible, but this could introduce incompatibility in some situations. Due
to the large number of combinations, testing all compatibility permutations between different family provider versions
isn't possible.

Upbound **highly recommends** that the family providers are all kept on the same version.

The following constraints apply to allow version compatibility:

- All family providers must be on the **same** `major` version.
- All family providers must be on the **same or prior** `minor` version as the
  family's configuration provider (for example, the
  `provider-aws-family` provider).

Examples:

<!-- vale alex.Ablist = NO -->

- Technically valid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.1.1`, `provider-aws-ec3:v1.0.1`
- Invalid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.0.0`, `provider-aws-ec3:v0.46.0`
- Invalid combination: `provider-family-aws:v1.0.0`, `provider-aws-s3:v1.0.1`,
  `provider-aws-ec3:v1.1.0`
<!-- vale alex.Ablist = YES -->

  {{< /tab >}}

{{< tab "CVEs" >}}
Upbound will make reasonable commercial effort to ensure its Official providers are free
from [Common Vulnerabilities and Exposures](https://nvd.nist.gov/general/cve-process) (CVEs) under the following
conditions:

1. Upbound's vulnerability scanners identifies a CVE affecting a provider package
1. The CVE is independently fixable of any other bugs. For a CVE to be fixable, either there is
    1. an upstream release version available which has been verified to fix the CVE, or
    1. an affected provider package can be rebuilt with updated compilers and/or libraries to remediate that CVE.

Upbound will address each CVE meeting this criteria based on it's severity score, according to the [Common
Vulnerability Scoring System version 3](https://nvd.nist.gov/vuln-metrics/cvss), as follows:

- Critical Severity: Within 7 calendar days from the date an upstream fix is publicly available.
- High, Medium, and Low severity: Within 14 calendar days from the date an upstream fix is publicly available.

A CVE will be considered addressed when a new version of the provider with the fix is released to the Marketplace.
{{< /tab >}}

{{< /tabs >}}

<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->
<!-- vale Google.Will = YES -->
<!-- vale gitlab.FutureTense = YES -->
<!-- vale write-good.Passive = YES -->
<!-- vale gitlab.SentenceLength = YES -->
