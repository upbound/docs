Initialize a new project.

#### Options

##### `--template`
*Default:* `project-template`  
The template name or URL to use to initialize the new project.

##### `--directory`
The directory to initialize. It must be empty. It will be created if it doesn't exist.

##### `--ref-name`
*Default:* `main`  
The branch or tag to clone from the template repository.

##### `--method`
*Default:* `https`  
Specify the method to access the repository: 'https' or 'ssh'.

##### `--ssh-key`
Optional. Specify an SSH key for authentication when initializing the new package. Used when method is 'ssh'.

##### `--username`
Optional. Specify a username for authentication. Used when the method is 'https' and an SSH key is not provided, or with an SSH key when the method is 'ssh'.

##### `--password`
Optional. Specify a password for authentication. Used with the username when the method is 'https', or with an SSH key that requires a password when the method is 'ssh'.

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

