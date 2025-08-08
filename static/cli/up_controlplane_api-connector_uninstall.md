---
mdx:
  format: md
---

Uninstall api-connector from an consumer cluster.

The `uninstall` command uninstalls the API Connector from a cluster.

#### Examples

Uninstall the API Connector from the cluster but leave the connections and
secrets in place:

```shell
up controlplane api-connector uninstall --target-kubeconfig kubeconfig-path-for-deployment-cluster
```

Uninstall the API Connector from the cluster and delete the connections and
secrets. API objects created by the API Connector initial installation will not
be deleted:

```shell
up controlplane api-connector uninstall --all --target-kubeconfig kubeconfig-path-for-deployment-cluster
```


#### Usage

`up controlplane api-connector uninstall --consumer-kubeconfig=STRING [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--consumer-kubeconfig` | | **Required** Path to the kubeconfig file for the consumer cluster. If not provided, the default kubeconfig resolution will be used. |
| `--consumer-context` | | Context to use in the kubeconfig file. If not provided, the current context will be used. |
| `--all` | | Uninstall all resources including the connectors and secrets. If not provided, only the connector will be uninstalled. |
