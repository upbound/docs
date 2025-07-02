Run a project on a development control plane for testing.

#### Options

##### `--project-file`
*Shorthand:* `-f`  
*Default:* `upbound.yaml`  
Path to project definition file.

##### `--repository`
Repository for the built package. Overrides the repository specified in the project file.

##### `--no-build-cache`
*Default:* `false`  
Don't cache image layers while building.

##### `--build-cache-dir`
*Default:* `~/.up/build-cache`  
Path to the build cache directory.

##### `--max-concurrency`
*Default:* `8`  
Maximum number of functions to build and push at once.

##### `--control-plane-group`
The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context.

##### `--control-plane-name`
Name of the control plane to use. It will be created if not found. Defaults to the project name.

##### `--skip-control-plane-check`
Allow running on a control plane without the development control plane annotation.

##### `--cache-dir`
*Default:* `~/.up/cache/`  
Directory used for caching dependencies.

##### `--public`
Create new repositories with public visibility.

##### `--timeout`
*Default:* `5m`  
Maximum time to wait for the project to become ready in the control plane. Set to zero to wait forever.

##### `--domain`
Root Upbound domain. Overrides the current profile's domain.

##### `--profile`
Profile used to execute command.

##### `--account`
*Shorthand:* `-a`  
Deprecated. Use organization instead.

##### `--organization`
Organization used to execute command. Overrides the current profile's organization.

##### `--insecure-skip-tls-verify`
[INSECURE] Skip verifying TLS certificates.

##### `--debug`
*Shorthand:* `-d`  
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

