Batch build and push a family of service-scoped provider packages.

#### Options

##### `--family-base-image`
Family image used as the base for the smaller provider packages.

##### `--provider-name`
Provider name, such as provider-aws to be used while formatting smaller provider package repositories.

##### `--family-package-url-format`
Family package URL format to be used for the smaller provider packages. Must be a valid OCI image URL with the format specifier "%s", which will be substituted with `<provider name>-<service name>`.

##### `--smaller-providers`
*Default:* `monolith`  
Smaller provider names to build and push, such as ec2, eks or config.

##### `--concurrency`
*Default:* `0`  
Maximum number of packages to process concurrently. Setting it to 0 puts no limit on the concurrency, i.e., all packages are processed in parallel.

##### `--push-retry`
*Default:* `3`  
Number of retries when pushing a provider package fails.

##### `--platform`
*Default:* `linux_amd64,linux_arm64`  
Platforms to build the packages for. Each platform should use the `<OS>_<arch>` syntax. An example is: linux_arm64.

##### `--provider-bin-root`
*Shorthand:* `-p`  
Provider binary paths root. Smaller provider binaries should reside under the platform directories in this folder.

##### `--output-dir`
*Shorthand:* `-o`  
Path of the package output directory.

##### `--store-packages`
Smaller provider names whose provider package should be stored under the package output directory specified with the --output-dir option.

##### `--package-metadata-template`
*Default:* `./package/crossplane.yaml.tmpl`  
Smaller provider metadata template. The template variables `{{ .Service }}` and `{{ .Name }}` will be substituted when the template is executed among with the supplied template variable substitutions.

##### `--template-var`
Smaller provider metadata template variables to be used for the specified template.

##### `--examples-group-override`
Overrides for the location of the example manifests folder of a smaller provider.

##### `--crd-group-override`
Overrides for the locations of the CRD folders of the smaller providers.

##### `--package-repo-override`
Overrides for the package repository names of the smaller providers.

##### `--providers-with-auth-ext`
*Default:* `monolith,config`  
Smaller provider names for which we need to configure the authentication extension.

##### `--examples-root`
*Shorthand:* `-e`  
*Default:* `./examples`  
Path to package examples directory.

##### `--crd-root`
*Default:* `./package/crds`  
Path to package CRDs directory.

##### `--auth-ext`
*Default:* `./package/auth.yaml`  
Path to an authentication extension file.

##### `--ignore`
Paths to exclude from the smaller provider packages.

##### `--create`
Create repository on push if it does not exist.

##### `--build-only`
*Default:* `false`  
Only build the smaller provider packages and do not attempt to push them to a package repository.

##### `--provider-name-suffix-for-push`
Suffix for provider name during pushing the packages. This suffix is added to the end of the provider name. If there is a service name for the corresponded provider, then the suffix will be added to the base provider name and the service-scoped name will be after this suffix.  Examples: provider-family-aws-suffix, provider-aws-suffix-s3

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

