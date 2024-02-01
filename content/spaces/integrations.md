---
title: Ecosystem Integrations (alpha)
weight: 150
description: A guide for integrating various ecosystem integrations with managed control planes in a Space
---

{{< hint "important" >}}
This feature is in alpha. It's only applicable to managed control planes that run in an Upbound Space. This feature is disabled by default.
{{< /hint >}}

Crossplane exists in the Kubernetes ecosystem. Users oftentimes find value in being able to reuse familiar Kubernetes tooling with Crossplane. Find guidance below for specific ecosystem tooling and how to integrate it with managed control planes in Spaces.

## GitOps tools

[GitOps]({{<ref "xp-arch-framework/interface-integrations/git-and-gitops.md" >}}) is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. You can use GitOps flows with managed control planes running in a Space.

{{< hint "tip" >}}
For general guidance on integrating Upbound with GitOps flows, see [GitOps with Control Planes]({{<ref "concepts/mcp/control-plane-connector.md">}}).
{{< /hint >}}

Upbound's recommendation is to use the [built-in Git integration]({{<ref "spaces/git-integration.md">}}), but if you'd prefer to bring existing GitOps flows to your managed control planes in a Space, you can.

### Argo

Spaces provides an optional plugin to assist with integrating a managed control plane in a Space with Argo CD. You must enable the plugin for the entire Space at Spaces install-time. The plugin's job is to propagate the connection details of each managed control plane in a Space to Argo CD.

#### On cluster Argo CD

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

#### External cluster Argo CD

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

These flags tells the plugin--running in Spaces--where your Argo CD instance is. After you've done this at install-time, you also need to create a `Secret` on the Spaces cluster. This secret must contain a kubeconfig pointing to your Argo CD instance. The secret needs to be in the same namespace as the `spaces-controller`, which is `upbound-system`.

Once you enable the plugin and configure it, the plugin automatically propagates connection details for your managed control planes to your Argo CD instance. You can then target the managed control plane and use Argo to sync Crossplane-related objects to it.

### Flux

You can also integrate Flux to target a managed control plane in a Space. Upbound doesn't offer a special plugin; you should follow the same instructions as outlined in the Flux section in [GitOps with Control Planes]({{<ref "concepts/mcp/control-plane-connector.md#flux">}}).

### Managed control plane connector

Upbound's managed control plane connector integration is also available for managed control planes in a Space. Read the [MCP Connector documentation]({{<ref "concepts/mcp/control-plane-connector.md#control-plane-connector">}}) to learn more about the feature.

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
helm install --wait mcp-connector upbound-beta/mcp-connector -n kube-system /
  --set mcp.account='your-upbound-org-account'
  --set mcp.name='your-control-plane-name'
  --set mcp.namespace='your-app-ns-1'
  --set mcp.secret.name='name-of-secret-with-kubeconfig'
```

## Secrets management

[Secrets management]({{<ref "xp-arch-framework/interface-integrations/secrets-management.md" >}}) covers integrations that extend a managed control plane's ability to interact with external services for managing Secrets. The default capability of a Crossplane instance is to read and write Kubernetes secrets locally in their cluster. You can configure managed control planes which run in an Upbound Space to read from external secret stores.

### External secrets

{{< hint "important" >}}
This feature is alpha and supported in Spaces `v1.2.0` and later.
{{< /hint >}}

Managed control planes in Spaces support [External Secrets Operator (ESO)](https://external-secrets.io) APIs. The ESO allows you to synchronize secrets from external APIs to your managed control planes.

#### Enable the feature

ESO support is an alpha-level feature. In your Space installation command, add the `--set "eso.enabled=true"` flag to enable ESO.

```bash {copy-lines="7-8", hl_lines="7-8"}
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "eso.enabled=true" \
  --wait
```

Once enabled, your Space creates a namespace automatically for each managed control plane. The namespace matches the value you provide in `features.alpha.eso.namespace`. If you have running managed control planes _before_ enabling this feature, you must redeploy them.

Once the control plane status is `AVAILABLE`, you can confirm access to new secret-related CRDs. For example, you can configure `SecretStore` and `ExternalSecret` CRDs with the ESO APIs.

```bash {copy-lines="1"}
kubectl get crds --kubeconfig=/tmp/ctp1.yaml | grep external-secrets

acraccesstokens.generators.external-secrets.io             2023-10-09T13:39:13Z
clusterexternalsecrets.external-secrets.io                 2023-10-09T13:39:13Z
clustersecretstores.external-secrets.io                    2023-10-09T13:39:13Z
ecrauthorizationtokens.generators.external-secrets.io      2023-10-09T13:39:13Z
externalsecrets.external-secrets.io                        2023-10-09T13:39:13Z
fakes.generators.external-secrets.io                       2023-10-09T13:39:13Z
gcraccesstokens.generators.external-secrets.io             2023-10-09T13:39:13Z
passwords.generators.external-secrets.io                   2023-10-09T13:39:13Z
pushsecrets.external-secrets.io                            2023-10-09T13:39:13Z
secretstores.external-secrets.io                           2023-10-09T13:39:13Z
vaultdynamicsecrets.generators.external-secrets.io         2023-10-09T13:39:13Z
```

#### Usage

You can use ESO API types in a Spaces managed control plane as you would in a standalone Crossplane instance or Kubernetes cluster. Below is an example of the AWS Secrets Manager configuration.
First, create a secret in the managed control plane which contains the auth credentials to access the external secret store.

```bash
kubectl create secret generic awssm-secret \
  --from-file=./access-key \
  --from-file=./secret-access-key
```

Create a SecretStore resource in your managed control plane, referencing the auth secret created in the previous step.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secretsmanager
  namespace: default
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: awssm-secret
            key: access-key
          secretAccessKeySecretRef:
            name: awssm-secret
            key: secret-access-key
EOF
```

Once you have a secret store configured, you can pull external secrets into your control plane by creating new `ExternalSecrets`. As an example, you can store ProviderConfig credentials in a central secret management service and pull them into your managed control plane.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: providerconfig-aws-secret
  namespace: default
spec:
  refreshInterval: 15s
  secretStoreRef:
    name: aws-secretsmanager
    kind: SecretStore
  target:
    creationPolicy: Owner
  data:
  - secretKey: aws_access_key_id
    remoteRef:
      key: providerconfigs
      property: aws_access_key_id
  - secretKey: aws_secret_access_key
    remoteRef:
      key: providerconfigs
      property: aws_secret_access_key
EOF
```

For a full guide on using ESO API types and how to connect it to various external secret stores, read the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/)

### Space-level APIs

Spaces administrators can manage external secrets for multiple control planes with two new API types. `SharedSecretStore` and `SharedExternalSecret` allow admins to provision namespace-scoped secret stores and external secrets into their control planes.

<!-- vale Google.Headings = NO -->
#### SharedSecretStore
<!-- vale Google.Headings = YES -->

SharedSecretStore is namespace-scoped and created in the namespace of a Space containing one or more ControlPlane instances.
It enables provisioning of ClusterSecretStore into control planes within the namespace boundary:

* If the provided selector matches, all matching control planes in the namespace receive the corresponding ClusterSecretStore.
* If the provided selector doesn't match, the non-matched control planes in the namespace remove the corresponding `ClusterSecretStore`
* You can use the `ClusterSecretStore` within a control plane context: `ExternalSecret` and `ClusterExternalSecret` can access the store as documented in the [ESO documentation](https://external-secrets.io/latest/api/externalsecret/).

SharedSecretStore API type is an extension of [ClusterSecretStore](https://external-secrets.io/latest/api/clustersecretstore/):

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-shared-store
  namespace: example
spec:
  # Optional metadata of the secret store to be created.
  secretStoreMetadata:
    # Annotations that are set on projected resource.
    annotations: {}
    # Labels that are set on projected resource.
    labels: {}

  # SecretStoreName is the name to use when creating secret stores within a control plane.
  # Optional, if not set, SharedSecretStore name will be used.
  # secretStoreName: ""

  # The store is projected only to control planes matching the provided selector.
  controlPlaneSelector:
    # A resource is matched if any of the label selector matches.
    # In case when the list is empty, resource is matched too.
    labelSelectors:
    # standard k8s label selector
    - matchExpressions:
      matchLabels: {}
    # A resource is selected if its metadata.name matches any of the provided names.
    # In case when the list is empty, resource is matched too.
    names:
      - ctp1
      - ctp2
  # The projected secret store can be consumed only within namespaces matching the provided selector.
  namespaceSelector:
    # A resource is matched if any of the label selector matches.
    # In case when the list is empty, resource is matched too.
    labelSelectors:
      # standard k8s label selector
    - matchExpressions:
      matchLabels: {}
    # A resource is selected if its metadata.name matches any of the provided names.
    # In case when the list is empty, resource is matched too.
    names:
      - ns1
      - ns2

  # The remaining fields is identical to .spec of ESO SecretStore
  # https://external-secrets.io/latest/api/secretstore/

  # Used to configure the provider. Only one provider may be set.
  provider:
  # Used to configure store refresh interval in seconds.
  # refreshInterval: 100
  # Used to configure http retries if failed.
  # retrySettings:
```
<!-- vale Google.Headings = NO -->
#### SharedExternalSecret
<!-- vale Google.Headings = YES -->

SharedExternal is namespace-scoped and created in the namespace of a Space containing one or more ControlPlane instances.
It enables provisioning of ClusterExternalSecret into control planes within the namespace boundary:
* If the provided selector matches, all matching control planes in the namespace receive the corresponding ClusterExternalSecret.
* If the provided selector doesn't match, the non-matched control planes in the namespace remove the corresponding `ClusterExternalSecret`
* You can use the `ClusterExternalSecret` within a control plane context: `ClusterSecretStore` can access the secret as documented in the [ESO documentation](https://external-secrets.io/latest/api/clusterexternalsecret/).

SharedExternalSecret API type is an extension of [ClusterExternalSecret](https://external-secrets.io/latest/api/clusterexternalsecret/):

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-shared-secret
  namespace: example
spec:
  # The secret is projected only to control planes matching the provided selector.
  controlPlaneSelector:
    # A resource is matched if any of the label selector matches.
    # In case when the list is empty, resource is matched too.
    labelSelectors:
    # standard k8s label selector
    - matchExpressions:
      matchLabels: {}
    # A resource is selected if its metadata.name matches any of the provided names.
    # In case when the list is empty, resource is matched too.
    names:
      - ctp1
      - ctp2
  # The projected secret can be consumed only within namespaces matching the provided selector.
  namespaceSelector:
    # A resource is matched if any of the label selector matches.
    # In case when the list is empty, resource is matched too.
    labelSelectors:
      # standard k8s label selector
      - matchExpressions:
        matchLabels: {}
    # A resource is selected if its metadata.name matches any of the provided names.
    # In case when the list is empty, resource is matched too.
    names:
      - ns1
      - ns2

  # Optional metadata of the secret store to be created.
  #externalSecretMetadata:
    # Annotations that are set on projected resource.
    # annotations: {}
    # Labels that are set on projected resource.
    # labels: {}
  # ExternalSecretName is the name to use when creating external secret within a control plane.
  # Optional, if not set, SharedExternalSecret name will be used.
  # externalSecretName: ""

  # The remaining fields is identical to .spec of ESO SecretStore
  # https://external-secrets.io/latest/api/clusterexternalsecret/

  # The spec for the ExternalSecrets to be created.
  externalSecretSpec:
  # Used to configure secret refresh interval in seconds.
  refreshTime: string
```

#### Usage

Create two managed control planes in `acmeorg` namespace.

```yaml
cat <<EOF | kubectl apply -n acmeorg -f -
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    # example label, to be matched in SharedSecretStore/SharedExternalSecret examples
    org: foo
  name: ctp
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp2
```

```yaml
cat <<EOF | kubectl apply -n acmeorg -f -
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    # example label, to be matched in SharedSecretStore/SharedExternalSecret examples
    org: foo
  name: ctp2
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp
```

Deploy SharedSecretStore in the same namespace. This example uses [fake provider](https://external-secrets.io/latest/provider/fake/).

```yaml
cat <<EOF | kubectl apply -n acmeorg -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: fake
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  provider:
    fake:
      data:
        - key: "/foo/bar"
          value: "HELLO1"
          version: "v1"
        - key: "/foo/bar"
          value: "HELLO2"
          version: "v2"
        - key: "/foo/baz"
          value: '{"john": "doe"}'
          version: "v1"
```

Deploy SharedExternalSecret in the same namespace.

```yaml
cat <<EOF | kubectl apply -n acmeorg -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: fake-secret
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      # refer the projected store
      name: fake
      kind: ClusterSecretStore
    data:
      - secretKey: "foo"
        remoteRef:
          key: "/foo/bar"
          version: "v1"
```

Check if control planes are available:

```bash
$ kubectl get controlplanes
NAME   CROSSPLANE VERSION   SUPPORTED   READY   MESSAGE   AGE
ctp    1.13.2-up.3          True        True              21m
ctp2   1.13.2-up.3          True        True              22m
```

Connect to control plane `ctp`:

```bash
up ctp connect ctp
```

Check if Kubernetes secret `fake-secret` is available in default namespace:

```bash
$ kubectl get secret fake-secret
NAME          TYPE     DATA   AGE
fake-secret   Opaque   1      20s
```
<!-- vale Google.WordList = NO -->
Perform the same check on control plane `ctp2`.
<!-- vale Google.WordList = YES -->

Verify the projected ClusterSecretStore and ClusterExternalSecret.

```bash
$ kubectl get clustersecretstore
NAME   AGE     STATUS   CAPABILITIES   READY
fake   5m18s   Valid    ReadOnly       True

$ kubectl get clusterexternalsecret
NAME          STORE   REFRESH INTERVAL   READY
fake-secret   fake                       True
```
