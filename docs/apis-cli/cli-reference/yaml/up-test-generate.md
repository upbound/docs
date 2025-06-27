Generate a Test for a project.

#### Usage

```bash
up test generate <name> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name for the new Function.

#### Flags

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--cache-dir`

**Default:** `~/.up/cache/`

Directory used for caching dependency images.

##### `--language` / `-l`

**Default:** `kcl`

Language for test.

##### `--e2e`

create e2e tests

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
up test generate --help

# Basic usage
up test generate my-project
```
