---
mdx:
  format: md
---

Install mcp-connector into an App Cluster.



#### Usage

`up controlplane connector install <name> <namespace> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name of control plane. |
| `<namespace>` | Namespace in the control plane where the claims of the cluster will be stored. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--token` | | API token used to authenticate. If not provided, a new robot and a token will be created. |
| `--cluster-name` | | Name of the cluster connecting to the control plane. If not provided, the namespace argument value will be used. |
| `--installation-namespace` | `-n` | Kubernetes namespace for MCP Connector. Default is kube-system. |
| `--control-plane-secret` | | Name of the secret that contains the kubeconfig for a control plane. |
| `--set` | | Set parameters. |
| `--file` | `-f` | Parameters file. |
| `--bundle` | | Local bundle path. |
