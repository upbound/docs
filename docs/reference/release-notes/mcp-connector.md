---
title: MCP Connector Release Notes
description: Release notes for the Mcp Connector
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

## v0.9.0

### Release Date: 2025-04-28

#### What's Changed

- Upgraded Kubernetes library dependencies from 1.29 to 1.32.
- Apiserver Audit-IDs are propagated to the requests to the connected MCP for easier log correlation.
- Fixed an issue with binary architecture in `arm64` images.
- Fixed an issue that was causing namespace deletions to get blocked.

## v0.8.1

### Release Date: 2025-04-28

#### What's Changed

- Ability to override app cluster id via `clusterID` helm value for migration scenarios.

## v0.8.0

### Release Date: 2024-11-01

#### What's Changed

- Ability to override app cluster id via `clusterID` helm value for migration scenarios.

## v0.7.0

### Release Date: 2024-08-16

#### What's Changed

- Support for server-side apply
- This release ships the helm chart as an OCI artifact in the Upbound registry only, available at
  `oci://xpkg.upbound.io/spaces-artifacts/mcp-connector`.
- The helm chart won't be available at the Upbound helm repository anymore, please migrate to the OCI artifact.

## v0.6.1

### Release Date: 2024-06-29

#### What's Changed

- Fixed a regression where connector makes only a single kind for a given group/version available to the application
  cluster.

## v0.6.0

### Release Date: 2024-06-15

#### What's Changed

- We started shipping the helm chart as an OCI artifact in the Upbound registry, available at
  `oci://xpkg.upbound.io/spaces-artifacts/mcp-connector`.
- This the latest release where we will publish the helm chart to the Upbound helm repository, please migrate to the OCI
  artifact.

## v0.5.0

### Release Date: 2024-06-06

#### What's Changed

- Support for auth with Upbound Identity.
- Upgraded Kubernetes library dependencies from 1.26 to 1.29.

## v0.4.0

### Release Date: 2024-04-29

#### What's Changed

- Add ability to set memory and cpu limits.

## v0.3.8

### Release Date: 2024-03-21

#### What's Changed

- Configured burst and QPS for kube clients to prevent excessive rate limiting.

## v0.3.7

### Release Date: 2024-03-21

#### What's Changed

- Fixed regular expression for control plane check for older versions of the Spaces API.

## v0.3.6

### Release Date: 2024-03-15

#### What's Changed

- Updated control plane check to support the recent changes in the Spaces API.

<!-- vale on -->
