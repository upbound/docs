The Upbound CLI.

Please report issues and feature requests at https://github.com/upbound/upbound.

#### Usage

```bash
up [flags] [subcommand]
```

#### Flags

##### `--help` / `-h`

Show context-sensitive help.

##### `--format`

**Default:** `default`

Format for get/list commands. Can be: json, yaml, default

##### `--quiet` / `-q`

Suppress all output.

##### `--pretty`

Pretty print output.

##### `--dry-run`

dry-run output.

#### Subcommands

- `organization (org)` - Interact with Upbound organizations.
- `token` - Interact with personal access tokens.
- `team` - Interact with teams.
- `robot` - Interact with robots.
- `repository (repo)` - Interact with repositories.
- `space` - Interact with Spaces.
- `group` - Interact with groups inside Spaces.
- `controlplane (ctp)` - Interact with control planes in the current context, both in the cloud and in a local Space.
- `uxp` - Interact with UXP.
- `project` - Manage Upbound development projects.
- `example` - Manage Claim(XRC) or Composite Resource(XR).
- `dependency (dep)` - Manage configuration dependencies.
- `xrd` - Manage XRDs from Composite Resources(XR) or Claims(XRC).
- `composition` - Manage Compositions.
- `function` - Manage Functions.
- `test` - Manage and run tests for projects.
- `xpkg` - Deprecated. Please migrate to up project or use the crossplane CLI.
- `xpls` - Start xpls language server.
- `completion` - Generate shell autocompletions
- `ctx` - Select an Upbound kubeconfig context.
- `help` - Show help.
- `license` - Show license information.
- `profile` - Manage configuration profiles.
- `login` - Login to Upbound. Will attempt to launch a web browser by default. Use --username and --password flags for automations.
- `logout` - Logout of Upbound.
- `version` - Show current version.
- `alpha` - Alpha features. Commands may be removed in future releases.

#### Examples

```bash
# Show help
up --help

# Show version
up version
```
