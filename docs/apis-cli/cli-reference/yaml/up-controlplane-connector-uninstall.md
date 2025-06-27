Uninstall mcp-connector from an App Cluster.

#### Usage

```bash
up controlplane (ctp) connector uninstall <namespace> [flags]
```

#### Arguments

##### `<namespace>`

**Required**

Namespace in the control plane where the claims of the cluster will be stored.

#### Flags

##### `--cluster-name`

Name of the cluster connecting to the control plane. If not provided, the namespace argument value will be used.

##### `--kubeconfig`

Override the default kubeconfig path.

##### `--installation-namespace` / `-n`

**Default:** `kube-system`

Kubernetes namespace for MCP Connector. Default is kube-system.

#### Examples

```bash
# Show help
up controlplane connector uninstall --help

# Basic usage
up controlplane connector uninstall <namespace>
```
