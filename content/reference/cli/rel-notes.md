---
title: "Release Notes"
metaTitle: "Upbound CLI - Release Notes"
metaDescription: "Release Notes for the up CLI"
weight: 200
---

Find below the release notes for all released versions of the [up CLI]({{< ref "reference/cli/_index.md" >}}).

<!-- vale off -->

## v0.21.0

Released October 12th, 2023.  
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.21.0)

### Notable Changes

- `up space init`'s UXP auto-installed prerequisite was updated from 1.12.2-up.2 to 1.13.2-up.2
- `up ctp connect` was re-introduced, with different functionality. Invoking the command will now connect your kubectl directly to the target control plane. Any kubectl commands run in that terminal will be executed against the target control plane.
- `up ctp disconnect` was introduced to compliment connect. Invoking the command will switch from the control plane context back to the originating context.
- `up ctp connector install` was extended to enable configuring mcp-connector against a Space's control plane.
- `up ctp connector uninstall` was introduced to compliment install. Invoking the command will delete the mcp-connector helm chart from the App Cluster.

### What's Changed

- Re-introduce `up ctp connect` add `up ctp disconnect`
- Bump the UXP prereq for spaces to v1.13.2-up.2
- MCP Connector support for Spaces

## v0.20.0

Released October 10th, 2023.  
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.20.0)

### Notable Changes

- Introduced support for the following `up ctp` subcommands with spaces:
  - `create`
  - `delete`
  - `get`
  - `list`
- ⚠️ Breaking change ⚠️ `up ctp connect` was moved to up `ctp connector install`. This is anticipation of future work.

### What's Changed

- Add tests for auth.yaml inclusion in provider package
- Allow pre-release versions of spaces to be installed and upgraded to
- Introduce support for up ctp (create, get, list, delete) against an Upbound Space
- Move ctp connect to ctp connector install

## v0.19.2

Released October 5th, 2023.  
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.19.2)

### What's Changed

- Fix `up xpkg build` not including authentication extensions for Upbound console on Provider v1

## v0.19.1

Released August 29th, 2023.  
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.19.1)

### What's Changed

- [Backport release-0.19] Fix `uxp install` error "couldn't find binding"

## v0.19.0

Released August 28th, 2023.  
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.19.0)

### Notable Changes

- New subcommands to support Upbound Spaces
- Add `up space billing get` with GCS support

### What's Changed

- Add repeatable --debug (short -d) enabling API request logging
- Package composition function types
- Prevent deferred File.Close and wrap errors while putting CRDs into xpls provider package cache
- [DevEx] xpkg: add error contexts and print & fail on parse errors
- Add `up space billing get` with GCS support
- Add AWS support to `up spaces billing get`
- New subcommands to support Upbound Spaces
- Introduce additional requirements for the spaces install
- Adjust ingress-nginx deployment to target kind
- Spaces: add helpers for default and unattended installation
- Allow operators to override the registry and registry-endpoint for a spaces install
- Spaces: add support for public load balancer
- Add Azure support to `up space billing get` + provider-generic refactor
- cmd/space: fix missing install.Context
- Space: improve destroy command
- space: unify and deduplicate registry flag logic
- Use concrete types with destroyCmd.Run()
- Fix typo in up space destroy output
- Rename `up space billing get` to export and fix event tags

## v0.18.0 and earlier

Consult the [GitHub releases page](https://github.com/upbound/up/releases) for earlier version of the up CLI and its changelog.