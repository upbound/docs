The 'export' command is used to export the current state of a Crossplane or Universal Crossplane (xp/uxp) control plane into an archive file. This file can then be used for migration to Upbound Managed Control Planes.

#### Options

##### `--yes`
*Default:* `false`  
When set to true, automatically accepts any confirmation prompts that may appear during the export process.

##### `--output`
*Shorthand:* `-o`  
*Default:* `xp-state.tar.gz`  
Specifies the file path where the exported archive will be saved. Defaults to 'xp-state.tar.gz'.

##### `--include-extra-resources`
*Default:* `namespaces,configmaps,secrets`  
A list of extra resource types to include in the export in "resource.group" format in addition to all Crossplane resources. By default, it includes namespaces, configmaps, secrets.

##### `--exclude-resources`
A list of resource types to exclude from the export in "resource.group" format. No resources are excluded by default.

##### `--include-namespaces`
A list of specific namespaces to include in the export. If not specified, all namespaces are included by default.

##### `--exclude-namespaces`
*Default:* `kube-system,kube-public,kube-node-lease,local-path-storage`  
A list of specific namespaces to exclude from the export. Defaults to 'kube-system', 'kube-public', 'kube-node-lease', and 'local-path-storage'.

##### `--pause-before-export`
*Default:* `false`  
When set to true, pauses all claim,composite and managed resources before starting the export process. This can help ensure a consistent state for the export. Defaults to false.

