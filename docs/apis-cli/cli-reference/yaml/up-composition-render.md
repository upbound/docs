Run a composition locally to render an XR into composed resources.

#### Usage

```bash
up composition render <composition> <composite-resource> [flags]
```

#### Arguments

##### `<composition>`

**Required**

A YAML file specifying the Composition to use to render the Composite Resource (XR).

##### `<composite-resource>`

**Required**

A YAML file specifying the Composite Resource (XR) to render.

#### Flags

##### `--xrd`

A YAML file specifying the CompositeResourceDefinition (XRD) to validate the XR against.

##### `--context-files`

Comma-separated context key-value pairs to pass to the Function pipeline. Values must be files containing JSON.

##### `--context-values`

Comma-separated context key-value pairs to pass to the Function pipeline. Values must be JSON. Keys take precedence over --context-files.

##### `--include-function-results` / `-r`

Include informational and warning messages from Functions in the rendered output as resources of kind: Result.

##### `--include-full-xr` / `-x`

Include a direct copy of the input XR's spec and metadata fields in the rendered output.

##### `--observed-resources` / `-o`

A YAML file or directory of YAML files specifying the observed state of composed resources.

##### `--extra-resources` / `-e`

A YAML file or directory of YAML files specifying extra resources to pass to the Function pipeline.

##### `--include-context` / `-c`

Include the context in the rendered output as a resource of kind: Context.

##### `--function-credentials`

A YAML file or directory of YAML files specifying credentials to use for Functions to render the XR.

##### `--timeout`

**Default:** `1m`

How long to run before timing out.

##### `--max-concurrency`

**Default:** `8`

Maximum number of functions to build at once.

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

##### `--cache-dir`

**Default:** `~/.up/cache/`

Directory used for caching dependency images.

##### `--no-build-cache`

**Default:** `false`

Don't cache image layers while building.

##### `--build-cache-dir`

**Default:** `~/.up/build-cache`

Path to the build cache directory.

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
up composition render --help

# Basic usage
up composition render <composition> <composite-resource>
```
