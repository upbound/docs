---
title: Use Argo or Flux with Spaces
weight: 150
description: A guide for integrating Argo or Flux with managed control planes in a Space.
draft: true
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. You can use GitOps flows with managed control planes running in a Space.

{{< hint "tip" >}}
For general guidance on integrating Upbound with GitOps flows, see [GitOps with Control Planes]({{<ref "/mcp/control-plane-connector.md">}}).
{{< /hint >}}

## Argo

{{< hint "important" >}}
This feature is in preview and is off by default. To enable, set `features.alpha.argocdPlugin.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.argocdPlugin.enabled=true"
```
{{< /hint >}}

Spaces provides an optional plugin to assist with integrating a managed control plane in a Space with Argo CD. You must enable the plugin for the entire Space at Spaces install-time. The plugin's job is to propagate the connection details of each managed control plane in a Space to Argo CD.

### On cluster Argo CD

If you are running Argo CD on the same cluster as the Space, run the following to enable the plugin:

{{< tabs >}}

{{< tab "Up CLI" >}}

```bash {hl_lines="3-4"}
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.secretNamespace=argocd"
```

{{< /tab >}}

{{< tab "Helm" >}}

```bash {hl_lines="7-8"}
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.secretNamespace=argocd" \
  --wait
```

{{< /tab >}}

{{< /tabs >}}


The important flags are:

- `features.alpha.argocdPlugin.enabled=true`
- `features.alpha.argocdPlugin.target.secretNamespace=argocd`

The first flag enables the feature and the second indicates the namespace on the cluster where you installed Argo CD.

Be sure to [configure Argo](#configure-argo) after it's installed.

### External cluster Argo CD

If you are running Argo CD on an external cluster from where you installed your Space, you need to provide some extra flags:

{{< tabs >}}

{{< tab "Up CLI" >}}

```bash {hl_lines="3-7"}
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.secretNamespace=argocd" \
  --set "features.alpha.argocdPlugin.target.externalCluster.enabled=true" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.name=my-argo-cluster" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.key=kubeconfig"
```

{{< /tab >}}

{{< tab "Helm" >}}

```bash {hl_lines="7-11"}
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.secretNamespace=argocd" \
  --set "features.alpha.argocdPlugin.target.externalCluster.enabled=true" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.name=my-argo-cluster" \
  --set "features.alpha.argocdPlugin.target.externalCluster.secret.key=kubeconfig" \
  --wait
```

{{< /tab >}}

{{< /tabs >}}

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.argocdPlugin.enabled=true" \
  --set "features.alpha.argocdPlugin.target.secretNamespace=argocd" \
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

Be sure to [configure Argo](#configure-argo) after it's installed.

### Configure Argo

Argo's default configuration causes it to try to query for resource kinds that don't exist in managed control planes. You should configure Argo's [general configmap](https://argo-cd.readthedocs.io/en/stable/operator-manual/argocd-cm-yaml/) to include the resource group/kinds which make sense in the context of managed control planes. For example, the concept of `nodes` isn't exposed in managed control planes.

To configure Argo CD, connect to the cluster where you've installed it and edit the configmap:

```bash
kubectl edit configmap argocd-cm -n argocd
```

Adjust the resource inclusions and exclusions under the `data` field of the configmap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
data:
  resource.exclusions: |
    - apiGroups:
      - "*"
      kinds:
      - "*"
      clusters:
      - "*"
  resource.inclusions: |
    - apiGroups:
      - "*"
      kinds:
      - Provider
      - Configuration
      clusters:
      - "*"
```

The preceding configuration causes Argo to exclude syncing **all** resource group/kinds--except Crossplane `providers` and `configurations`--for **all** control planes. You're encouraged to adjust the `resource.inclusions` to include the types that make sense for your control plane, such as an `XRD` you've built with Crossplane. You're also encouraged to customize the `clusters` pattern to selectively apply these exclusions/inclusions to control planes (for example, `control-plane-prod-*`).

## Flux

You can also integrate Flux to target a managed control plane in a Space. Upbound doesn't offer a special plugin; you should follow the same instructions as outlined in the Flux section in [GitOps with Control Planes]({{<ref "/mcp/control-plane-connector.md#flux">}}).
