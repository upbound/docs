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

## Secrets management

[Secrets management]({{<ref "xp-arch-framework/interface-integrations/secrets-management.md" >}}) covers integrations that extend a managed control plane's ability to interact with external services for managing Secrets. The default capability of a Crossplane instance is to read and write Kubernetes secrets locally in their cluster. You can configure managed control planes which run in an Upbound Space to read from external secret stores.

### External Secrets Operator

{{< hint "important" >}}
This feature is supported in Spaces `v1.1.0` and later.
{{< /hint >}}

Upbound supports installing the [External Secrets Operator (ESO)](https://external-secrets.io/latest/) into a Space-managed control plane. ESO allows your managed control plane to synchronize secrets from external APIs.  

#### Enable the feature

ESO support is an alpha-level feature. You must first enable the capability in your Space before you can install the operator in a managed control plane.

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.eso.enabled=true" \
  --set "features.alpha.eso.namespace=external-secrets"  \
  --wait
```

Once enabled, your Space creates a namespace automatically for each managed control plane. The namespace matches the value you provide in `features.alpha.eso.namespace`. If you have running managed control planes _before_ enabling this feature, you must redeploy them.

#### Install the operator in a managed control plane

Once you've enabled the feature in your Space, use Helm to install the External Secrets Operator into a managed control plane. Add the repository source in Helm.

```bash
helm repo add external-secrets https://charts.external-secrets.io
```

Then--with your kubeconfig pointed at a managed control plane--install the operator.

```bash
helm install external-secrets \
  external-secrets/external-secrets \
  -n external-secrets 
```

{{< hint "tip" >}}
During install, you may see a warning message like, "WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /tmp/ctp1.yaml". You can ignore the warning. {{< /hint >}}

Once the installation succeeds, you can confirm access to new CRDs such as `SecretStore`, `ExternalSecret`, and more.

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

Using ESO in a managed control plane is identical to when it into a Kubernetes cluster or standalone Crossplane instance. Below is an example using AWS Secrets Manager.

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

For a full guide on using ESO and how to connect it to various external secret stores, read the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/)