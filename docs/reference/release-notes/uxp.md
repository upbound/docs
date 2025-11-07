---
title: Upbound Crossplane Release Notes
description: Release notes for Upbound Crossplane
---
<!-- vale off -->
<!-- Release notes template/Copy&Paste 
## vX.Y.Z
### Release Date: YYYY-MM-DD
#### Breaking Changes
:::important
Any important warnings or necessary information
:::
#### What's Changed
- User-facing changes
-->

## v2.1.0-up.2

#### What's Changed
- Bumped controller-manager chart to 0.1.0-rc.0.260.g46def90
- Bumped UXP to 2.1.0-up.1
- Updated controller-manager and apollo to latest versions
- Reverted controller-manager bump

## v2.0.2-up.5

#### What's Changed
- Bumped controller-manager to get metering API
- Bumped uxp-controller-manager for FIPS-140-3 and Go 1.25 fixes
- Bumped query API chart to 0.2.8
- Bumped controller-manager to 0.1.0-rc.0.257.g231312a

## v2.0.2-up.4

#### What's Changed
- Fixed UXP link to website
- Bumped controller-manager to get ClusterRoles
- Reverted UPBOUND_BOT_GITHUB_TOKEN requirement cleanup

## v2.0.2-up.3

#### What's Changed
- Bumped Web UI version to 1.0.0 for release
- Bumped uxp-apollo to 0.1.0
- Bumped UXP to v2.0.1-up.1
- Updated README documentation
- Fixed Helm devel flag notice in README
- Bumped UXP to v2.0.2-up.1
- Bumped controller-manager
- Cleaned up UPBOUND_BOT_GITHUB_TOKEN requirement
- Updated apollo to 0.1.1
- Updated docs link
- Mirrored OCI image to spaces-artifacts
- Bumped uxp-controller-manager to latest

## v2.0.0-rc.5

:::important
Pre-release version
:::

## v2.0.0-rc.4

:::important
Pre-release version
:::

#### What's Changed
- Bumped Web UI version with backup fixes
- Bumped Web UI version with visual tweaks
- Bumped UXP to v2.0.0-up.1.rc.1 (Crossplane v2.0.0-rc.1)
- Bumped Web UI version introducing addons

## v2.0.0-rc.3

:::important
Pre-release version
:::

#### What's Changed
- Packaged components as dependencies and subcharts
- Bumped controller-manager to latest
- Updated build submodule to crossplane/build and gitignore Helm chart dependencies
- Added Chart.lock to gitignore
- Bumped Crossplane to latest main
- Updated Web UI with license fixes
- Bumped upbound-controller-manager to version 0.1.0-rc.0.94.ge3b7735
- Applied controller manager and license changes
- Bumped apollo and webui to latest versions
- Bumped Crossplane to latest
- Moved dependencies from upbound-dev to upbound org
- Pushed OCI image to upbound/crossplane (image with v prefix, chart without)
- Updated apollo chart to 0.0.0-110.g5127447
- Added publishing to charts.upbound.io
- Published for main channel and cleaned up promote step
- Bumped uxp-controller-manager to version 0.1.0-rc.0.209.gfe6962e
- Specified bucket in us-west-2 for chart release
- Bumped Crossplane to v2.0.0-rc.0.302.g1c5774d68
- Avoided newlines in values
