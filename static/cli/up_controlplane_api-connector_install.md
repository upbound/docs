---
mdx:
  format: md
---

Install api-connector into an consumer cluster.

The `install` command installs the API Connector into a consumer cluster.

Note that the API Connector is a preview feature, under active development and
subject to breaking changes. Production use is not recommended.

#### Examples

Install the API Connector into the consumer cluster and connect it to the
control plane referred to by the current context:

```shell
up controlplane api-connector install --consumer-kubeconfig /path/to/kubeconfig
```

Install the API Connector into the cluster and connect it to the control plane
referred to by the current context using the provided robot name for
authentication:

```shell
up controlplane api-connector install --consumer-kubeconfig /path/to/kubeconfig \
    --robot-name upbound-robot-name
```

Install the API Connector into the cluster but do not provision a
`ClusterConnection` resource or create a robot for authentication:

```shell
up controlplane api-connector install --consumer-kubeconfig /path/to/kubeconfig \
    --skip-connection
```


#### Usage

`up controlplane api-connector install [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--upgrade` | | Upgrade or downgrade the API Connector to --version, even if it is already installed. |
| `--version` | | Version of the API Connector to install. If not provided, the latest, known to CLI, will be installed. |
| `--name` | | Name of the related objects for named connection. If not provided, control plane name will be used with api-connector prefix.  |
| `--upbound-token` | | API token used to authenticate to the provider control plane. Mutually exclusive with --robot-name. |
| `--skip-connection` | | Skip secret and connection initialization to the control plane. If provided, the connector will be installed without connecting to the control plane. |
| `--consumer-kubeconfig` | | Path to the kubeconfig file for the consumer cluster. If not provided, the default kubeconfig resolution will be used. |
| `--consumer-context` | | Context to use in the kubeconfig file. If not provided, the current context will be used. |
| `--helm-directory` | | Directory to store the Helm chart. If not provided, the default will be used. |
| `--set` | | Set parameters. |
| `--file` | `-f` | Parameters file. |
| `--bundle` | | Local bundle path. |
