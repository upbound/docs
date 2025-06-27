Push a project's packages to the Upbound Marketplace.

#### Usage

```bash
up project push [flags]
```

#### Flags

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--repository`

Repository to push to. Overrides the repository specified in the project file.

##### `--tag` / `-t`

Tag for the built package. If not provided, a semver tag will be generated.

##### `--package-file`

Package file to push. Discovered by default based on repository and tag.

##### `--max-concurrency`

**Default:** `8`

Maximum number of functions to build at once.

##### `--public`

Create new repositories with public visibility.

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
up project push --help
```
