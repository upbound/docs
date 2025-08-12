---
mdx:
  format: md
---

Uninstall mcp-connector from an App Cluster.



#### Usage

`up controlplane connector uninstall <namespace> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<namespace>` | Namespace in the control plane where the claims of the cluster will be stored. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--cluster-name` | | Name of the cluster connecting to the control plane. If not provided, the namespace argument value will be used. |
| `--installation-namespace` | `-n` | Kubernetes namespace for MCP Connector. Default is kube-system. |
