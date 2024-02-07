---
title: Use Argo or Flux with Spaces
weight: 150
description: A guide for integrating Argo or Flux with managed control planes in a Space.
---

[GitOps]({{<ref "xp-arch-framework/interface-integrations/git-and-gitops.md" >}}) is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. You can use GitOps flows with managed control planes running in a Space.

{{< hint "tip" >}}
For general guidance on integrating Upbound with GitOps flows, see [GitOps with Control Planes]({{<ref "concepts/mcp/control-plane-connector.md">}}).
{{< /hint >}}

Upbound's recommendation is to use the [built-in Git integration]({{<ref "spaces/git-integration.md">}}), but if you'd prefer to bring existing GitOps flows to your managed control planes in a Space, you can.

## Argo

Spaces provides an optional plugin to assist with integrating a managed control plane in a Space with Argo CD. You must enable the plugin for the entire Space at Spaces install-time. The plugin's job is to propagate the connection details of each managed control plane in a Space to Argo CD.

### On cluster Argo CD

If you are running Argo CD on the same cluster as the Space, run the following to enable the plugin:

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.namespace=argocd" \
  --wait
```

The important flags are:

- `features.alpha.argocdPlugin.enabled=true`
- `features.alpha.argocdPlugin.target.namespace=argocd`

The first flag enables the feature and the second indicates the namespace on the cluster where you installed Argo CD.

### External cluster Argo CD

If you are running Argo CD on an external cluster from where you installed your Space, you need to provide some extra flags:

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.namespace=argocd" \
  --set "features.alpha.argocdPlugin.target.externalCluster.enabled=true" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.name=my-argo-cluster" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.key=kubeconfig" \
  --wait
```

The extra flags are:

- `features.alpha.argocdPlugin.target.externalCluster.enabled=true`
- `features.alpha.argocdPlugin.target.externalCluster.secret.name=my-argo-cluster`
- `features.alpha.argocdPlugin.target.externalCluster.secret.key=kubeconfig`

These flags tell the plugin (running in Spaces) where your Argo CD instance is. After you've done this at install-time, you also need to create a `Secret` on the Spaces cluster. This secret must contain a kubeconfig pointing to your Argo CD instance. The secret needs to be in the same namespace as the `spaces-controller`, which is `upbound-system`.

Once you enable the plugin and configure it, the plugin automatically propagates connection details for your managed control planes to your Argo CD instance. You can then target the managed control plane and use Argo to sync Crossplane-related objects to it.

## Flux

You can also integrate Flux to target a managed control plane in a Space. Upbound doesn't offer a special plugin; you should follow the same instructions as outlined in the Flux section in [GitOps with Control Planes]({{<ref "concepts/mcp/control-plane-connector.md#flux">}}).