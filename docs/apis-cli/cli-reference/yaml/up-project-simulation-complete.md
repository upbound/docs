Force complete an in-progress project simulation

#### Usage

```bash
up project simulation complete <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

The name of the simulation resource

#### Flags

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--output` / `-o`

Output the results of the simulation to the provided file. Defaults to standard out if not specified

##### `--terminate-on-finish`

**Default:** `true`

Terminate the simulation after the completion criteria is met

##### `--control-plane-group` / `-g`

The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context.

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
up project simulation complete --help

# Basic usage
up project simulation complete my-project
```
