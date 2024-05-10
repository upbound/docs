---
title: Secrets Management
weight: 150
description: A guide for how to configure synchronizing external secrets into maanged control planes in a Space.
---

{{< hint "important" >}}
This feature is in preview.
{{< /hint >}}

Upbound has built-in features to help you manage secrets for control planes running in a Cloud or Connected Space. Upbound offers:

1. `SharedSecretStore` and `SharedExternalSecret` resources to manage syncing external secrets into groups of control planes.
2. Built-in support for [External Secrets Operator (ESO)](https://external-secrets.io) APIs. This allows you to synchronize secrets from external secret stores into a managed control plane.

<!-- vale Google.Headings = NO -->
## Shared secrets in a Space
<!-- vale Google.Headings = YES -->

Control plane group administrators can manage external secrets for multiple control planes with two API types. `SharedSecretStore` and `SharedExternalSecret` allow admins to provision group-scoped secret stores and external secrets into their control planes.

<!-- vale Google.Headings = NO -->
### Shared Secret Stores
<!-- vale Google.Headings = YES -->

{{< hint "tip" >}}
The Shared Secrets feature is enabled by default in all Upbound Cloud Spaces. If you want to use these APIs in your Connected Space, your admin must [enable them]({{<ref "../disconnected-spaces/secrets-management" >}}) in the Connected Space.
{{< /hint >}}

`SharedSecretStore` is group-scoped and created in a group containing one or more `ControlPlane` instances.
It provisions `ClusterSecretStore` resources into control planes with a group:

* If the provided selector matches, all matching control planes in the group receive the corresponding `ClusterSecretStore`.
* If the provided selector doesn't match, the non-matched control planes in the group remove the corresponding `ClusterSecretStore`
* You can use the `ClusterSecretStore` within a control plane context: `ExternalSecret` and `ClusterExternalSecret` can access the store as documented in the [ESO documentation](https://external-secrets.io/latest/api/externalsecret/).

<!-- vale Google.Headings = NO -->
### Shared External Secrets
<!-- vale Google.Headings = YES -->

`SharedExternalSecret` is group-scoped and created in a control plane group containing one or more `ControlPlane` instances.
It enables provisioning of `ClusterExternalSecret` resources into control planes within the group boundary:

* If the provided selector matches, all matching control planes in the group receive the corresponding `ClusterExternalSecret`.
* If the provided selector doesn't match, the non-matched control planes in the group remove the corresponding `ClusterExternalSecret`
* You can use the `ClusterExternalSecret` within a control plane context: `ClusterSecretStore` can access the secret as documented in the [ESO documentation](https://external-secrets.io/latest/api/clusterexternalsecret/).


### Usage

Create two managed control planes in `acmeorg` control plane group.

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

Deploy SharedSecretStore in the same group. This example uses [fake provider](https://external-secrets.io/latest/provider/fake/).

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

Deploy SharedExternalSecret in the same group.

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

## External secrets in a control plane

<!-- vale off -->
You can use ESO API types in a managed control plane as you would in a standalone Crossplane instance or Kubernetes cluster. Below is an example of the AWS Secrets Manager configuration.
<!-- vale on -->

### Usage

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

<!-- vale off -->
For a full guide on using ESO API types and how to connect it to various external secret stores, read the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/).
<!-- vale on -->