Start a new project simulation and wait for the results.

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

##### `--name`
*Shorthand:* `-n`  
The name of the simulation resource

##### `--tag`
An existing tag of the project to simulate. If not specified, defaults to building and pushing a new version

##### `--output`
*Shorthand:* `-o`  
Output the results of the simulation to the provided file. Defaults to standard out if not specified

##### `--terminate-on-finish`
*Default:* `true`  
Terminate the simulation after the completion criteria is met

##### `--wait`
*Default:* `true`  
Wait until the simulation completes and output the difference.

##### `--complete-after`
*Default:* `60s`  
The amount of time the simulated control plane should run before ending the simulation

##### `--control-plane-group`
*Shorthand:* `-g`  
The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context.

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

