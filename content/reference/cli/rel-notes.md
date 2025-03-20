---
title: "Release Notes"
metaTitle: "Upbound CLI - Release Notes"
description: "Release Notes for the up CLI"
weight: 200
---

Find below the release notes for all released versions of the [up CLI]({{< ref "reference/cli/_index.md" >}}).

<!-- vale off -->

## v0.38.2

Released March 17th, 2025

### What's Changed

- Fixed `up test` and `up project run` compatibility with Crossplane 1.19.
- Added the ability to login with an Upbound Robot Token.
- Bug fixes and improvements in `up test` and `up project build`.

## v0.38.1

Released March 11th, 2025

### What's Changed

- Removed dependency on the `go` binary for generation of Go models.
- Updated name generation for array field types in Go models to avoid name
  collisions.
- Updated KCL function generation to avoid duplicate import names.
- Updated `go test` to pass through environment variables prefixed with `UP_` to
  tests written in KCL and Python.
- Fixed a panic in `up test` when a timeout was not specified.
- Improvements for `up migration` when mcp-connector is in use.

### Breaking Changes

- Some type names in the Go models have changed to avoid naming conflicts. Go
  functions using these fields will fail to compile during `up project build`
  and require an update.

## v0.38.0

Released March 4th, 2025

### What's Changed

- Go is now a supported language for embedded functions in projects.
- New `up test` commands introduced to allow for automated testing of
  compositions, including those that use embedded functions. Test cases can be
  written in YAML, Python, or KCL.
- Embedded KCL functions now use KCL v0.11.2.
- Commands that interact with private repositories in the Upbound Marketplace no
  longer require `docker-credential-up` to be configured.
- Bug fixes and UX improvements.

### Breaking Changes

- The short alias `-d` for the `--cache-dir` flag in various commands has been
  removed.

## v0.37.1

Released February 13th, 2025

### What's Changed

- Improve performance and silence unnecessary warning messages in `up
  composition render`.
- Ensure the `--project-file` flag works consistently across project commands.
- Minor bug fixes.

## v0.37.0

Released January 30th, 2025

### What's Changed

- New `up composition render` command introduced to allow for local testing of compositions including those that use embedded functions.
- Configuration is now profile-centric (see Breaking Changes below).
- `up profile use` restores the last-used Kubeconfig context for the selected profile.
- `up profile config` is deprecated and its functionality will be removed in a future release.
- Kubeconfig flags are handled consistently across commands.
- "Account" renamed to "Organization" in configuration and flags, since the value must be an Upbound organization name.
- Bug fixes and UX improvements.

### Breaking Changes

- Creating a configuration profile is now required.
- Users of disconnected Spaces must now create a disconnected configuration profile for each disconnected Space they interact with.
- `up ctx` is now profile-specific. Only contexts belonging to a given profile's organization or disconnected Space can be accessed when that profile is active.

## v0.36.4
Released January 10th, 2025.

### What's Changed
- Updated base image for Python functions in projects.

## v0.36.3
Released January 7th, 2025.

### What's Changed
- Starting with Spaces `v1.10.0`, `up space init` now supports ingress SSL
  passthrough during installation.
- Removed the unused clusterType field from Helm values in `up space init` for
  Spaces v1.10.0.

## v0.36.2
Released December 19th, 2024.

### What's Changed
- Spaces Mirror: Fixed an issue affecting private registries when using registry flags introduced in v0.36.0.
- Added a new flag to the `up project run` command, enabling projects to be run in production control planes.

## v0.36.1
Released December 3rd, 2024.

### What's Changed
- Resolved the `IsNotFound` error encountered in `up project run` for existing repositories.

## v0.36.0
Released November 28th, 2024.

### What's Changed
- Enhanced the ingress cache to ensure concurrency safety for more stable and efficient operations.
- User organization is now validated during login, offering better security and a smoother user flow.
- Default values for `apiVersion` and `kind` have been added in Python schemas to streamline development.
- The `up dep update` command now processes updates in parallel, significantly reducing update times.
- Projects started in MCP now inherit the parent Space context, ensuring better alignment and continuity.
- `up space mirror` Added registry flags to provide more control and flexibility when managing mirrors.
- The embedded function KCL base image has been upgraded to v0.10.8.
- `up project run` Fixed issues with unsupported duplicate file paths to avoid potential conflicts.
- `up project run` Projects are now re-homed automatically, and repository visibility is preserved during project pushes.
- `up project run` Projects now load repositories into memory, improving performance and reducing disk I/O.
- `up project build` The Docker client environment can now be overridden with custom environment variables, offering more flexibility.
- `up ctp provider,function,configuration,pull-secret` Added support for installing functions and pull-secrets in CTP, expanding functionality and customization options.

## v0.35.3
Released November 6th, 2024.

### What's Changed
- improvements for new commands introduced in v0.35.0

## v0.35.2
Released November 6th, 2024.

### What's Changed
- improvements for new commands introduced in v0.35.0

## v0.35.1
Released November 6th, 2024.

### What's Changed
- Made the ingress cache concurrency safe in `up ctx`.
- Prevented output of status fields for generated XRDs.
- Validated the user's organization during login.
- Configured projects to use the parent Space context when started in control plane.

## v0.35.0
Released November 6th, 2024.

### What's Changed
#### Project Management Enhancements
- Introduced new commands:
  - `up project init`, `build`, `push`, `run`, and `move`
  - `up example generate`
  - `up xrd generate`
  - `up composition generate`
  - `up function generate`

https://docs.upbound.io/core-concepts/projects/

#### Dependency Management
- Enhanced the `xpkg dep` command to handle function dependencies and group dependencies effectively
- Added validation and examples for dependency handling

### Improvements
- Supported installation of mcp-connectors and cloudnative-pg from `xpkg.upbound.io`
- Improved error messages for unreachable spaces and unusable contexts in `up ctx`.

### Bug Fixes
- Fixed function name validation and schema handling errors.
- Improved dependency checks for projects and configurations.

### Breaking Changes
- Deprecated `xpkg` in favor of enhanced project workflows.

## v0.34.2
Released October 17th, 2024.

### What's Changed
- Use spaces-config configmap to validate spaces in `up space attach`

## v0.34.1
Released October 10th, 2024.

### What's Changed
- update `up alpha space mirror` corresponding images

## v0.34.0
Released October 7th, 2024.

### What's Changed
- Reduced verbosity of logging
- Install agent from the `xpkg.upbound.io` registry
- Require username and password for agent chart installation.
- Added cloudnative-pg as a dependency and updated query to v1alpha2.
- Removed the "healthy" column from `up ctp get/list`.
- Ensured `up ctx` always uses the spaces ingress.

## v0.33.0
Released September 3rd, 2024.

### What's Changed
- Update `up space init` update for 1.7.0 release OCI Registry change to `xpkg.upbound.io/spaces-artifacts`
- Update `up alpha space mirror` update for 1.7.0 release
- Update `up ctp connector` install using now OCI Registry `xpkg.upbound.io/spaces-artifacts`
- Improve `up ctp list/get` show healthy column and read message from status for CTP
- Improve `up alpha query` print right kind with multiple resources
- Improve `up xpkg dep` works now with functions
- Improve `up ctx` writing kubeconfig to stdout with current path
- Delete `up cofiguration`

## v0.32.0

Released August 2nd, 2024.

### What's Changed

- New `up team` command for managing teams.
- New `up robot team` command for managing robot team membership.
- New `up repository permission` command for managing team access to repositories.
- `up space attach` and `up space detach` have been renamed to `up space connect` and `up space disconnect`, respectively.
- Improved `up alpha get` and `up alpha query` commands for querying resources in and across control planes.


## v0.31.0

Released June 7th, 2024.

{{< hint "important" >}}
- Web-based login (previously `up alpha web-login`) is now the default for `up login`. Use `up login --username=<user>` to invoke interactive terminal login.
- `up configuration` is now stubbed out, since Configurations are not currently supported in Upbound.
{{< /hint >}}

### What's Changed

- Web login is now the default for `up login`.
- `up ctx` now works with connected Spaces.
- `up ctx` now supports navigating between cloud, connected, and disconnected Spaces regardless of the current kubeconfig context.
- `up space attach` now works with Upbound IAM.

## v0.30.0

Released May 10th, 2024.

### What's Changed

- We promoted `up web-login` to stable.
- We fixed several bugs related to `up ctx` failing to connect to a Space, group, or control plane.
- `up version` now prints information seperated into client (your up CLI version) and server (version information for the control plane and Space you're connected to)
- `up space init` enables hub authz and authn by default.

## v0.29.0

Released May 3rd, 2024.

{{< hint "important" >}}
This release contains an important breaking change that affects how users gain access to the API server of their control planes.

For users who've deployed MCPs to Upbound prior to April 30th, 2024 (on our 'legacy GCP Space'), to connect to those MCPs you **must** use `up` ver <= `v0.28.0`.

To connect to an MCP in a Cloud Space or Connected/Disconnected Space, please use `up` ver >= `v0.29.0`.
{{< /hint >}}

### Notable Changes

- We replaced `up ctp connect/disconnect` and `up ctp kubeconfig get` with a new `up ctx` command.
- We've overhauled how profiles work in `up`. Learn more about it by reading the [up CLI]({{<ref "reference/cli">}}) reference.

### What's Changed

- We introduced `up space list` to list all Cloud and Connected Spaces that exist in an organization's account.
- We added CRUD support for control plane groups with `up group` subcommand.
- We bumped the prerequisite version of UXP to `v1.15` when using `up space init` to create a single-tenant Space.
- We fixed some bugs that caused `up space detach` to fail.
- `up ctp list` now derives its context according to what's been set with `up ctx`.
- `up space init` now installs opentelemetry-operator as a prerequisite.
- All commands in `up` now use the new `up` profiles and kubecontexts.

## v0.28.0

Released April 2nd, 2024.

### What's Changed

- We added `up alpha space attach` and `detach` commands to facilitate connecting a single-tenant Space to Upbound's global console.

## v0.27.0

Released March 27th, 2024.

### What's Changed

- We fixed a bug that caused `up ctp connect` to fail to connect to a control plane running in a single-tenant Space.
- We fixed a bug impacting `up xpkg build` against Docker 1.25

## v0.26.0

Released March 16th, 2023.

### What's Changed

- We added`up alpha query` and `up alpha get` commands.
- We changed `up trace`'s arguments to align with `up query` and `up get` and fixed up/down navigation.

## v0.25.0

Released March 12th, 2024.

### Notable Changes

- We updated `up version` to print client and server side versions.
- We improved the UX of `up ctp connect/disconnect`. Connect now gracefully handles different context names and allows repeated connect attempts.

### What's Changed

- We fixed an issue in `up migration` that restored package statuses.
- `up migration` now uses the same confirmation dialog as `up space init`
- We improved the UX of `up ctp connect/disconnect`. Connect now gracefully handles different context names and allows repeated connect attempts.
- We unified the experience between `up ctp connect` and `up ctp kubeconfig get`.
- We added `alpha trace` and `alpha tview` template commands.
- We updated `up version` to print client and server side versions.

## v0.24.2

Released February 29th, 2024.

### What's Changed

- This version includes some configuration tweaks for Crossplane and providers that is installed as prerequisites with the up space init command.

## v0.24.1

Released February 7th, 2024.

### What's Changed

- We fixed an issue in `up migration` that restored package statuses.
- `up migration` now uses the same confirmation dialog as `up space init`

## v0.24.0

Released February 1st, 2024.

### What's Changed

- We introduced `up alpha web-login`, a preview feature to allow web-based authentication to Upbound from `up`.

## v0.23.0

Released February 1st, 2024.

### What's Changed

- Updated component prerequisite versions for an Upbound Space.
- We fixed an issue where `up migration` didn't wait for PackageRevisions to be healthy in order to complete a successful migration.
- Space subcommands now respect control plane groups.

## v0.22.1

Released January 30th, 2024.

### What's Changed

- Updated component prerequisite versions for an Upbound Space.

## v0.22.0

Released January 30th, 2024.

### Notable Changes

- New `up alpha migration` commands to export state from a control plane and import it into an Upbound control plane.
- Allow creation of control planes without being configured to use Upbound's deployment service.

### What's Changed

- Improved the help text to make `up profile set space` more discoverable.
- Allow creating new Upbound profiles with `type: space` by name.
- Fixed an issue where `up space init` ignored SIGINT.

## v0.21.0

Released October 12th, 2023.

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

### What's Changed

- Fix `up xpkg build` not including authentication extensions for Upbound console on Provider v1

## v0.19.1

Released August 29th, 2023.

### What's Changed

- [Backport release-0.19] Fix `uxp install` error "couldn't find binding"

## v0.19.0

Released August 28th, 2023.

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
- cmd space: fix missing install.Context
- Space: improve destroy command
- space: unify and deduplicate registry flag logic
- Use concrete types with destroyCmd.Run()
- Fix typo in up space destroy output
- Rename `up space billing get` to export and fix event tags

## v0.18.0

Released June 27th, 2023.

### What's Changed

- Make `help` more accessible
- Updates dependencies to get up close to current

## v0.17.0

Released May 12th, 2023.

### What's Changed

- Added tab completion for two control plane commands
- Check the validity of kubeconfig before applying it
- xpkg batch subcommand to batch process provider packages

## v0.16.1

Released April 17th, 2023.

### Notable Changes

- This patch release for `v0.16.0` notably adds a contribution guide and fixes a marshaling bug when building bundled provider packages (if no controller image ref is passed).

### What's Changed

- add contribution guide that includes release process.
- Reorganize organization user commands.

## v0.16.1

Released April 17th, 2023.

### Notable Changes

- This patch release for `v0.16.0` notably adds a contribution guide and fixes a marshaling bug when building bundled provider packages (if no controller image ref is passed).
- ⚠️ Breaking change ⚠️ With the core crossplane dependency bumped to `v1.6.0` , only `v1` API versions will be supported for `Composition` and `CompositeResourceDefinition` in the `apiextensions.crossplane.io` group. Support for `v1beta1` versions was removed. Please plan to update to `v1` and see the README for more details.

### What's Changed

- add contribution guide that includes release process.
- Reorganize organization user commands.

## v0.16.0

Released March 28th, 2023.

### Notable Changes

- Introduction of many new commands to coincide with the relaunch of [Upbound](https://console.upbound.io), including many commands in `ctp` and `cfg`.
- ⚠️ Breaking change ⚠️ Starting in v0.16.0, `up controlplane create` must supply a required flag `--configuration-name` and no longer supports creating "empty canvas" control planes. Prior versions of up that do not have this flag will now get an error response from the Upbound API:`{"message":"configurationId is required"}`

### What's Changed

- Add `ctp get` command, to show a single control plane.
- Added get commands for orgs, repos, robots, and robot tokens
- Implement JSON and YAML output formatting
- Add formatted ouput for more get & list commands
- Add alpha commands for MCP connector
- update up-sdk-go to use new error descriptions
- Initial suport for tab completions
- Introduce `configuration` commands
- Add completion predictors for control planes, profiles, repos, and robots
- Add completion predictor for configurations
- Add first iteration of `configuration create`
- Update login to fetch default user account if none specified
- Require configurations for creating control planes
- Separate kubeconfig generation steps
- Update gitsources login to pass port parameter.
- Add Organization user management
- Add support for listing configuration templates
- Disable the `upbound` subcommand.
- Revised the new "org user" comands to take an org name instead of an org ID
- Move `controlplane` commands to stable maturity level
- Create a token as part of connect command
- docs: add controlplane commands
- connect: fix the robot creation call
- Querying control planes with no associated configurations
- Update docs: add configuration, remove 'upbound'.
- Added --private flag for `up cfg create`
- connect: always create user token if not provided - no creation of robots
- connect: wait for helm installation to complete
- combine xpkg auth ext anno during build
- Move up ctp kubeconfig get to stable

## v0.15.0

Released November 6th, 2022.

### What's Changed

- Support webhook configurations in provider packages

## v0.14.0

Released October 5th, 2022.

### Notable Changes

- Two new commands, `up ctp provider install` and `up ctp configuration install`, to quickly install Providers and Configurations into any control plane.
- The promotion of the experimental control planes (MCP) API to be the default for all `up alpha ctp` commands.
- ⚠️ Breaking change ⚠️ The promotion of the experimental MCP API may break some workflows, but all impacted commands fall under the `alpha` maturity group. Guarantees around backwards compatibility are explained in detail in the [API Maturity](https://github.com/upbound/up/blob/main/docs/maturity.md) documentation. While breaking changes will try to be minimized from version to version, `up` is not guaranteed to maintain backwards compatibility for pre-v1.0 versions.

### What's Changed

- Use compact usage output
- Drop `UP_MCP_EXPERIMENTAL` in favor of new control planes API
- Add support for `up ctp provider install` and `up ctp configuration install`
- Move control plane commands to only support previously experimental API
- Clean up remaining mcp ID references in docs

## v0.13.0

Released August 26th, 2022.
[Release reference on GitHub](https://github.com/upbound/up/releases/tag/v0.13.0)

### Notable Changes

- drastically increases the functionality of up by introducing command groups for `organization`, `robot`, `repository`, and `profile`.
- restructures the up command graph by adding top-level "maturity" groups. Commands that are expected to change or evolve in the future are now nested under `up alpha`. See the [API Maturity](https://github.com/upbound/up/blob/main/docs/maturity.md) documentation for more information.

### What's Changed

- Do not prompt for username / password if token is provided
- Only pass domain to docker-credential-up
- Embed Kubernetes client auth plugins
- Update comment about auth plugins
- Drop up uxp connect command
- Update MCP experimental ctp list with paging
- Move to pterm, emit success message for all operations, and support `--quiet` and `--pretty` global output config
- Add support for repository management and create on push
- Add Nix installation instructions
- Simplify `up upbound install` and add config command group
- Add support for organization management commands
- Support robot management commands
- Add `--force` option to destructive commands
- Move experimental and preview commands to `alpha` group
- Fix up logout and hint when session is missing
- Add support for `up ctp pull-secret create` and require token create output
- Cleanup command structure and allow creating new named profile on login
- Fix top-level alpha command help output and updates docs for v0.13.0 release
- Update configuration docs to include base config
