---
title: Package Policies
sidebar_position: 100
description: The Upbound Official package policies.
---

<!-- vale Google.Headings = NO -->
<!-- vale Microsoft.HeadingAcronyms = NO -->
<!-- vale Google.Will = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale write-good.Passive = NO -->
<!-- vale gitlab.SentenceLength = NO -->

:::note
**Policy version:** `1.0.0`  
**Effective date:** `25 September 2025`  
:::

The following policies govern the access, support and maintenance procedures of the Upbound Official and Partner packages.

## Scope and Definitions

| Topic                                    | Description                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream vs Downstream                   | **Upstream**: public repositories under `github.com/crossplane-contrib` and main releases published to `xpkg.crossplane.io`; all source code changes land here first.<br/> **Downstream**: private repositories under `github.com/upbound` that mirror upstream and produce downstream main and backport releases published to `xpkg.upbound.io`. |
| Main vs Backport                         | **Main**: regular releases from the `main` branch.<br/>**Backport**: patch-only releases from release maintenance branches for a specific minor version; cherry-picked fixes only, no new features.                                                                                                                                               |
| Community, Official and Partner packages | **Community**: built, maintained and supported by members of the Crossplane community.<br/>**Official**: built, maintained and supported by Upbound.<br/>**Partner**: built and supported jointly by Upbound and the partner; Upbound verifies that the package meets its quality bar.                                                            |
| Host                                     | Host refers to the runtime the package targets.<br/>**OSS Crossplane**: supports providers, functions and configuration packages.<br/>**UXP**: supports all packages in OSS Crossplane and other package types (for example, add-ons) that aren't available for OSS Crossplane;                                                                   |
| Availability Window                      | The duration that a release remains pullable in from the registry.<br/>**Main releases**: available for 6 months from the release date. <br/>**Backport releases**: available for 18 months from the release date.                                                                                                                                |
| SBOM                                     | A software bill of materials (SBOM) lists all the software components and their versions used in the published package. Upstream main releases are unsigned and have no SBOM. All downstream releases are signed and include an SBOM.                                                                                                             |
| FIPS                                     | FIPS-compatible artifacts are available for all Upbound Official and Partner packages and require an Enterprise+ license.                                                                                                                                                                                                                         |

## Source Code and License

All Upbound authored packages for Crossplane are open source, and the source code is made available under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0) regardless of where the source code is located.

Where a package is available to run in the OSS Crossplane host (for example, providers, functions, and configurations), the source code for these packages is located in the `crossplane-contrib` organization on GitHub and is subject to the [governance](https://github.com/crossplane/crossplane/blob/main/GOVERNANCE.md) of the Crossplane project.

UXP-only packages (for example, Add-ons) are located in the Upbound organization on GitHub.

:::note
All existing OSS Crossplane compatible packages that are currently in the `upbound` organization in GitHub will be migrated over to `crossplane-contrib` in due time.
:::

## Official and Partner packages

Official packages are built, maintained and supported by Upbound. Partner packages are built, maintained and supported jointly by Upbound and a technology partner.

Upbound prefers Partner packages when a capable partner exists. Upbound will publish packages as Official when no partner exists or when it's required to meet customer demand, quality, or coverage needs.

Official and Partner packages are subject to Upbound's CVE remediation SLA and support entitlements for eligible customers.

## Host policy

Packages can target one or both Crossplane hosts:

- Providers, Functions, and Configurations all run on OSS Crossplane or UXP.
- Add-ons and other UXP-only features are available on UXP only.

Where host-specific behavior exists, it will be called out in the package documentation and release notes.

## Maintenance, backports and distribution

This section explains how packages are maintained, when backport releases are produced and the distribution of upstream and downstream packages.

### Change flow

- All feature, bug fix and security work lands in the upstream repository (`crossplane-contrib`) on `main` first and are published to `xpkg.crossplane.io` in alignment with the Crossplane governance policies.
- Downstream mirrors in `github.com/upbound` sync from upstream `main` and produce downstream 'main' releases.
- Bug fix and security work is backported to the downstream release maintenance branches; these branches only exist downstream and don't flow back to upstream. See "Requesting a fix or backport" section below.

### Backport eligibility

Backports are created when all the following are true:

- The fix addresses a security issue, critical regression, or data-loss risk.
- The change is low risk and scoped (can be cherry-picked) to a specific issue.
- The change doesn't introduce new features, new APIs, or breaking schema or behavioral changes.

Backports aren't used for feature delivery, refactors, or non-critical improvements. Those ship in the next main release.

By default Upbound backports security fixes to releases made during the last 6 months. Customers can request a backport to an older and still supported version.

### Branching and versioning

- Each supported minor release has a maintenance branch, for example `release-X.Y`.
- Backport releases increment only the patch version within that minor line (for example, `X.Y.Z → X.Y.(Z+1)`).
- Maintenance branches accept cherry-picked fixes only; no new features or API surface area.

### Distribution

- Downstream releases of packages compatible with OSS Crossplane are runnable on all hosts (see "Access and Compatibility" section).
- Downstream releases are distributed through the [Upbound Marketplace](https://marketplace.upbound.io).
- Downstream main releases are publicly accessible; backport releases require a Standard+ subscription and [configured pull secrets][configured-pull-secrets].

### Signing, SBOM, and FIPS

- All downstream releases (main and backport) are signed and include an SBOM.
- Upstream main releases aren't signed and don't include an SBOM.
- FIPS-compatible artifacts are available for all Upbound Official and Partner packages and require an Upbound Enterprise+ subscription.

### Requesting a fix or backport

- Upbound customers with Standard+ subscriptions can [open a ticket][open-a-ticket] to request a fix and evaluation for creating a backport for a supported release.
- Community users should file an issue upstream; fixes will be included in a future main release.

::::note
Backports are cautious and patch-only by design. If a safe, targeted fix isn't possible, the change will ship in the next main release instead.
::::

## Access and Support

Your Upbound plan subscription level determines the level of access to the versions of each Official package in the
Marketplace.

### Anonymous and Community Tier subscribers

**Access**: Anonymous Crossplane community members without an Upbound account, along with
`Community` tier subscribers, can access all main releases of a package within the availability window.  
**Support**: Support is limited to help from the community in the Crossplane community Slack workspace or issues in the upstream repository.

### Standard, Enterprise, and Business Critical subscribers

**Access**: If your organization has a `Standard`, `Enterprise`, or `Business Critical` subscription to Upbound, you can access all available versions within the availability window, including backport releases (backports require configured pull secrets).  
**Support**: Upbound supports Official and Partner packages for 12 months from the release date.

:::note
Availability is distinct from Support. Support is provided for 12 months from the release date of a package. After the Support window ends, artifacts may remain available per the Availability window.

Upbound customers with `Enterprise` plan or higher subscription can [open a ticket][open-a-ticket] to request support.
:::

:::important
To access backport releases, make sure you've
[configured pull secrets][configured-pull-secrets].
:::

## Availability window

Availability defines how long a release remains pullable in registries and is distinct from Support:

- **Main releases**: available for `6 months` from the release date. The latest main releases will remain available until a new version is published regardless of whether the 6 month window has passed.
- **Backport releases**: available for `18 months` from the release date.

If a main version is found to have a significant security issue, it will be marked or withdrawn as appropriate.

:::important
The main releases availability window is intentionally limited to ensure users stay up to date with the latest fixes and are protected from security vulnerabilities.
:::

## Publishing

Packages have two relevant version numbers:

- Package release version, for example, `provider-aws:v2.1.0`
- Custom Resource Definition (_CRD_) API version, for example `v1beta1`

### Release types

- **Upstream main release**: produced from the upstream `main` branch in `crossplane-contrib`.
- **Downstream main release**: produced from the downstream `main` mirror in `upbound`.
- **Downstream backport release**: produced from a downstream release maintenance branch (patch-only); see "Maintenance, backports and distribution" section.

### Release cadence

- **Upstream main** releases are subject to the Crossplane governance policies and at least should follow the core Crossplane project release schedule.
- The **Upstream main** release cadence may vary by package and a faster release cadence is subject to the package repository maintainers.
  - **Upbound Official** and **Partner** packages target monthly main releases if there are new features available.
  - **Upbound Official** and **Partner** packages that are generated with Upjet and leverage Terraform providers are upgraded to the latest version of the Terraform provider every 2 months.
- **Downstream main** releases ship at the same time as the upstream main release.
- **Downstream backport** releases are produced as needed based on eligibility and customer impact.

:::tip
Upbound customers with a Standard+ plan may submit a support request to fast-track a release cadence.
:::

### Testing and release quality gating

- **Upstream main release**: unit and basic integration testing.
- **Downstream (main and backport)**: extended test matrix and validation on supported Cloud accounts; CVE validation to ensure the package is free from CVEs. Releases are gated on these validation steps passing.

### Publish summary matrix

| Release type        | Host runtime        | Source                     | Distribution         | Signed | SBOM | FIPS-compatible<br/>packages available<br/>(Enterprise+) | Availability window | Subscription<br/>required | Requires<br/>pull secrets | Cadence                               | Testing/quality gating                       |
| ------------------- | ------------------- | -------------------------- | -------------------- | ------ | ---- | -------------------------------------------------------- | ------------------- | ------------------------- | ------------------------- | ------------------------------------- | -------------------------------------------- |
| Upstream main       | OSS Crossplane, UXP | `crossplane-contrib/`      | `xpkg.crossplane.io` | No     | No   | No                                                       | 6 months            | None                      | No                        | Follows Crossplane schedule or faster | Unit + basic integration                     |
| Downstream main     | OSS Crossplane, UXP | `upbound` (private mirror) | `xpkg.upbound.io`    | Yes    | Yes  | Yes                                                      | 6 months            | None                      | No                        | Ships with upstream main              | Extended matrix; cloud validation; CVE-gated |
| Downstream backport | OSS Crossplane, UXP | `upbound` (private mirror) | `xpkg.upbound.io`    | Yes    | Yes  | Yes                                                      | 18 months           | Standard+                 | Yes                       | As needed (eligibility-based)         | Extended matrix; cloud validation; CVE-gated |

## Package versions

Upbound Official and Partner package versions follow the
[semantic versioning (_semver_)][semantic-versioning-semver] standard of `<major>`.`<minor>`.`<patch>` numbering.

#### Major version change

Major version number changes are typically reserved for indicating breaking schema or behavior changes in packages.

For providers, when the `major` version of the underlying Terraform provider (if generated with Upjet)
or Upjet runtime changes, then the provider's `major` version increments. Major version updates reset the `minor` and `patch` to zero.

<!-- vale Microsoft.Contractions = NO -->
<!-- vale write-good.TooWordy = NO -->

:::important
A change in the `major` version number doesn't come with a backward compatibility guarantee and users should evaluate and verify it in non-production environments before upgrading.
:::

The release notes will indicate all breaking changes introduced and provide instructions on adapting to them.

<!-- vale write-good.TooWordy = YES -->
<!-- vale Microsoft.Contractions = YES -->

#### Minor version

The `minor` version number increases when new features, such as new capabilities, resources, or fields, are introduced.
This update resets the `patch` number to zero and may also include bug fixes.

#### Patch version

A `patch` version increases for releases with **only** bug fixes and **no** new features.

### CRD API versions

When CRDs are contained in an Official package, they follow the standard Kubernetes API versioning and deprecation policy.

- `v1alpha1` - CRDs under `v1alpha` haven't yet passed through Upbound's quality assurance process. `v1alpha1` providers
  are for testing and experimentation and aren't intended for production deployment.
- `v1beta1` - This identifies a qualified and tested CRD under common use cases. Upbound attempts to ensure a stable CRD
  API but may require breaking changes in future versions. `v1beta1` APIs may be missing endpoints or settings related
  to the provider resource.
- `v1beta2` - Like `v1beta1` CRDs all `v1beta2` providers are fully qualified and tested. `v1beta2` contain more
  features or breaking changes from the `v1beta1` API.
- `v1` - CRDs that reach a `v1` API version have fully defined APIs. Upbound won't make breaking API changes in the
  current `major` version of the provider.

## Compatibility

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

:::important
Despite the commitment to backward compatibility, you should **always**
simulate upgrades in a non-production
environment before applying to production.
:::

### Downgrading

<!-- vale Microsoft.Contractions = NO -->

Backward compatibility **is not** guaranteed when downgrading to a prior version.

<!-- vale Microsoft.Contractions = YES -->

Downgrading to a previous version may require manual intervention to ensure the package and the resources remain in a
synced/healthy state. In some scenarios, it might be necessary to uninstall the package and reinstall the older desired
version.

:::important
You should **always** simulate downgrades in a non-production environment before
applying to production.
:::

:::tip
Upbound customers with support entitlements support should
consult their assigned Solutions Architect or reach out to Upbound Support before a production downgrade.
:::

### Family provider version compatibility

The `major`, `minor` and `patch` versions of all the family providers are updated in unison regardless of whether a
specific provider in the family has changes or not.

A family of providers, like [provider-family-aws][provider-family-aws],
is published with all the providers in the family using the same version number. Using providers from the same family
with different version numbers is technically possible, but this could introduce incompatibility in some situations. Due
to the large number of combinations, testing all compatibility permutations between different family provider versions
isn't possible.

Upbound **strongly recommends** that the family providers are all kept on the same version.

The following constraints apply to ensure version compatibility:

- All family providers must be on the **same** `major` version.
- All family providers must be on the **same or prior** `minor` version as the
  family's configuration provider (for example, the `provider-aws-family` provider).

Examples:

<!-- vale alex.Ablist = NO -->

- Technically valid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.1.1`, `provider-aws-ec2:v1.0.1`
- Invalid combination: `provider-family-aws:v1.1.0`, `provider-aws-s3:v1.0.0`, `provider-aws-ec2:v0.46.0`
- Invalid combination: `provider-family-aws:v1.0.0`, `provider-aws-s3:v1.0.1`, `provider-aws-ec2:v1.1.0`

<!-- vale alex.Ablist = YES -->

## CVEs

Upbound will make reasonable commercial effort to ensure its Official packages are free
from [Common Vulnerabilities and Exposures][common-vulnerabilities-and-exposures] (CVEs) under the following
conditions:

- Upbound's vulnerability scanners identify a CVE affecting a package
- The CVE is independently fixable of any other bugs. For a CVE to be fixable, either there is
  - an upstream release version available which has been verified to fix the CVE, or
  - an affected provider package can be rebuilt with updated compilers and/or libraries to remediate that CVE.

Upbound will address each CVE meeting this criteria based on its severity score, according to the [Common
Vulnerability Scoring System version 3][common-vulnerability-scoring-system-version-3], as follows:

- **Critical Severity**: Within 7 calendar days from the date an upstream fix is publicly available.
- **High, Medium, and Low severity**: Within 14 calendar days from the date an upstream fix is publicly available.
- **Unknown severity**: Within 30 calendar days from the date an upstream fix is publicly available.

A CVE will be considered addressed when a new version of the provider with the fix is released to the Marketplace.

<!-- vale Google.Headings = YES -->
<!-- vale Microsoft.HeadingAcronyms = YES -->
<!-- vale Google.Will = YES -->
<!-- vale gitlab.FutureTense = YES -->
<!-- vale write-good.Passive = YES -->
<!-- vale gitlab.SentenceLength = YES -->

[configured-pull-secrets]: /manuals/packages/providers/pull-secrets
[open-a-ticket]: /reference/usage/support
[upbound-marketplace]: https://marketplace.upbound.io/providers?tier=official
[semantic-versioning-semver]: https://semver.org/
[provider-family-aws]: https://marketplace.upbound.io/providers/upbound/provider-family-aws
[common-vulnerabilities-and-exposures]: https://nvd.nist.gov/general/cve-process
[common-vulnerability-scoring-system-version-3]: https://nvd.nist.gov/vuln-metrics/cvss
