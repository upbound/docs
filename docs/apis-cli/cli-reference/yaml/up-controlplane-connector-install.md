Install mcp-connector into an App Cluster.

#### Usage

```bash
up controlplane (ctp) connector install <name> <namespace> [flags]
```

#### Arguments

##### `<name>`

**Required**

Name of control plane.

##### `<namespace>`

**Required**

Namespace in the control plane where the claims of the cluster will be stored.

#### Flags

##### `--token`

API token used to authenticate. If not provided, a new robot and a token will be created.

##### `--cluster-name`

Name of the cluster connecting to the control plane. If not provided, the namespace argument value will be used.

##### `--kubeconfig`

Override the default kubeconfig path.

##### `--installation-namespace` / `-n`

**Default:** `kube-system`

Kubernetes namespace for MCP Connector. Default is kube-system.

##### `--control-plane-secret`

Name of the secret that contains the kubeconfig for a control plane.

##### `--set`

Set parameters.

##### `--file` / `-f`

Parameters file.

##### `--bundle`

Local bundle path.

#### Examples

```bash
# Show help
up controlplane connector install --help

# Basic usage
up controlplane connector install my-project <namespace>
```
