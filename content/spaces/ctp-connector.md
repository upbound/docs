---
title: Control Plane Connector
weight: 150
description: A guide for how to connect a Kubernetes app cluster to a managed control plane in Upbound using the Control Plane connector feature
---

Upbound's managed control plane connector integration is also available for managed control planes in a Space. Read the [MCP Connector documentation]({{<ref "/concepts/control-plane-connector.md#control-plane-connector">}}) to learn more about the feature.

MCP Connector functions similarly when running in Space-managed control plane versus a SaaS-managed control plane. The one difference is you must provide a secret containing the Space-managed control plane kubeconfig at install-time. The install command becomes the following:

```bash
up ctp connector install <ctp-name> <namespace-in-ctp> --control-plane-secret=<secret-ctp-kubeconfig>
```

Or if you want to install with Helm, you must provide:

- `mcp.account`, provide an Upbound org account name.
- `mcp.name`, provide the name of the managed control plane you want to connect to.
- `mcp.namespace`, provide the namespace in your managed control plane to sync to.
- `mcp.secret.name`, provide the name of a secret in your app cluster containing the kubeconfig of the Space-managed control plane you want to connect to.

```bash
helm install --wait mcp-connector upbound-beta/mcp-connector -n kube-system \
  --set mcp.account='your-upbound-org-account' \
  --set mcp.name='your-control-plane-name' \
  --set mcp.namespace='your-app-ns-1' \
  --set mcp.secret.name='name-of-secret-with-kubeconfig'
```
