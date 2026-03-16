---
mdx:
  format: md
---

Serve support bundle files via a local Kubernetes API server for live viewing.

The `up support-bundle serve` command serves support bundle files over HTTP for live viewing.
It starts a local Kubernetes API server (not a full cluster), imports the support bundle resources,
and provides a kubeconfig file that allows you to interact with the bundle using standard
Kubernetes tools like `kubectl` or `k9s`.

Note: This runs only the API server for viewing collected data, no workloads are actually running.

## Usage

```bash
up support-bundle serve [path] [flags]
```

### Examples

```bash
# Serve a support bundle tar.gz file
up support-bundle serve ./upbound-support-bundle.tar.gz

# Serve on a custom port
up support-bundle serve --port 9090

# Specify a custom kubeconfig output path
up support-bundle serve --kubeconfig-path ./my-kubeconfig
```

## Viewing the Bundle

Once the server is running, you can use standard Kubernetes tools to view the bundle contents:

```bash
kubectl --kubeconfig=./support-bundle-kubeconfig get pods --all-namespaces
kubectl --kubeconfig=./support-bundle-kubeconfig get all -A
kubectl --kubeconfig=./support-bundle-kubeconfig logs &lt;pod-name> -n &lt;namespace>
```


#### Usage

`up support-bundle serve [<path>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<path>` |**Optional** Path to support bundle directory or archive. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--host` | | Host to serve on. |
| `--port` | | Port to serve on. 0 means a random port will be chosen. |
| `--kubeconfig-path` | `-k` | Where to write the kubeconfig file. |
| `--envtest-arch` | `-a` | Arch value for Kubernetes API Server assets. |
| `--debug` | `-d` | Enable debug output. |
