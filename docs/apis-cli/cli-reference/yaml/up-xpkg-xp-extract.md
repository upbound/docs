Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default.

#### Usage

```bash
up xpkg xp-extract [package] [flags]
```

#### Arguments

##### `<package>`

**Optional**

Name of the package to extract. Must be a valid OCI image tag or a path if using --from-xpkg.

#### Flags

##### `--from-daemon`

Indicates that the image should be fetched from the Docker daemon.

##### `--from-xpkg`

Indicates that the image should be fetched from a local xpkg. If package is not specified and only one exists in current directory it will be used.

##### `--output` / `-o`

**Default:** `out.gz`

Package output file path. Extension must be .gz or will be replaced.

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
up xpkg xp-extract --help

# Basic usage
up xpkg xp-extract <package>
```
