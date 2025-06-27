Run project tests.

#### Usage

```bash
up test run <patterns> [flags]
```

#### Arguments

##### `<patterns>`

**Required**

The path to the test manifests

#### Flags

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--repository`

Repository for the built package. Overrides the repository specified in the project file.

##### `--no-build-cache`

**Default:** `false`

Don't cache image layers while building.

##### `--build-cache-dir`

**Default:** `~/.up/build-cache`

Path to the build cache directory.

##### `--max-concurrency`

**Default:** `8`

Maximum number of functions to build and push at once.

##### `--control-plane-group`

The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context.

##### `--control-plane-name-prefix`

Prefex of the control plane name to use. It will be created if not found.

##### `--skip-control-plane-check`

Allow running on a non-development control plane.

##### `--local`

Use a local dev control plane, even if Spaces is available.

##### `--use-current-context`

Run the project with the current kubeconfig context rather than creating a new dev control plane.

##### `--cache-dir`

**Default:** `~/.up/cache/`

Directory used for caching dependencies.

##### `--kubectl`

Absolute path to the kubectl binary. Defaults to the one in $PATH.

##### `--public`

Create new repositories with public visibility.

##### `--e2e`

Run E2E

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
up test run --help

# Basic usage
up test run <patterns>
```
