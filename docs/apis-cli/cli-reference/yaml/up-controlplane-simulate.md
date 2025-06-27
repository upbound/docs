Alias for 'up controlplane simulation create'.

#### Usage

```bash
up controlplane (ctp) simulate <source-name> [flags]
```

#### Arguments

##### `<source-name>`

**Required**

Name of source control plane.

#### Flags

##### `--group` / `-g`

The control plane group that the control plane is contained in. This defaults to the group specified in the current context

##### `--simulation-name` / `-n`

The name of the simulation resource

##### `--changeset` / `-f`

Path to the resources that will be applied as part of the simulation. Can either be a single file or a directory

##### `--recursive` / `-r`

**Default:** `false`

Process the directory used in -f, --changeset recursively.

##### `--complete-after`

**Default:** `60s`

The maximum amount of time the simulated control plane should run before ending the simulation

##### `--fail-on`

**Default:** `none`

Fail and exit with a code of '1' if a certain condition is met

##### `--output` / `-o`

Output the results of the simulation to the provided file. Defaults to standard out if not specified

##### `--wait`

**Default:** `true`

Wait for the simulation to complete. If set to false, the command will exit immediately after the changeset is applied

##### `--terminate-on-finish`

**Default:** `false`

Terminate the simulation after the completion criteria is met

##### `--domain`

Root Upbound domain. Overrides the current profile's domain.

##### `--profile`

Profile used to execute command.

##### `--account` / `-a`

Deprecated. Use organization instead.

##### `--organization`

Organization used to execute command. Overrides the current profile's organization.

##### `--ca-bundle`

Path to CA bundle file to prepend to existing CAs

##### `--insecure-skip-tls-verify`

[INSECURE] Skip verifying TLS certificates.

##### `--debug` / `-d`

[INSECURE] Run with debug logging. Repeat to increase verbosity. Output might contain confidential data like tokens.

##### `--override-api-endpoint`

Overrides the default API endpoint.

##### `--override-auth-endpoint`

Overrides the default auth endpoint.

##### `--override-proxy-endpoint`

Overrides the default proxy endpoint.

##### `--override-registry-endpoint`

Overrides the default registry endpoint.

##### `--override-accounts-endpoint`

Overrides the default accounts endpoint.

##### `--kubeconfig`

Override default kubeconfig path.

##### `--kubecontext`

Override default kubeconfig context.

#### Examples

```bash
# Show help
up controlplane simulate --help

# Basic usage
up controlplane simulate <source-name>
```
