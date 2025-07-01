Managing the mirroring of artifacts to local storage or private container registries.

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

##### `--output-dir`
*Shorthand:* `-t`  
The local directory path where exported artifacts will be saved as .tgz files.

##### `--destination-registry`
*Shorthand:* `-d`  
The target container registry where the artifacts will be mirrored.

##### `--version`
*Shorthand:* `-v`  
The specific Spaces version for which the artifacts will be mirrored.

