Connect an Upbound Space to the Upbound web console.

#### Options

##### `--registry-repository`
*Default:* `xpkg.upbound.io/spaces-artifacts`  
Set registry for where to pull OCI artifacts from. This is an OCI registry reference, i.e. a URL without the scheme or protocol prefix.

##### `--registry-endpoint`
*Default:* `https://xpkg.upbound.io`  
Set registry endpoint, including scheme, for authentication.

##### `--token-file`
File containing authentication token. Expecting a JSON file with "accessId" and "token" keys.

##### `--registry-username`
Set the registry username.

##### `--registry-password`
Set the registry password.

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

##### `--robot-token`
The Upbound robot token contents used to authenticate the connection.

##### `--up-environment`
*Default:* `prod`  
Override the default Upbound Environment.

