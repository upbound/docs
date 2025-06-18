Install mcp-connector into an App Cluster.

#### Options

##### `--token`
API token used to authenticate. If not provided, a new robot and a token will be created.

##### `--cluster-name`
Name of the cluster connecting to the control plane. If not provided, the namespace argument value will be used.

##### `--kubeconfig`
Override the default kubeconfig path.

##### `--installation-namespace`
*Shorthand:* `-n`  
*Default:* `kube-system`  
Kubernetes namespace for MCP Connector. Default is kube-system.

##### `--control-plane-secret`
Name of the secret that contains the kubeconfig for a control plane.

##### `--set`
Set parameters.

##### `--file`
*Shorthand:* `-f`  
Parameters file.

##### `--bundle`
Local bundle path.

