---
title: "Secrets Management"
weight: 3
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Kubernetes [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) are objects that contain some sensitive data. In the case of Crossplane, that could be:

* credentials for a provider
* connection details to a resource
* inputs that need to be passed to managed resources at creation time

Our baseline recommendation is to just use Kubernetes secrets. If you have business requirements that preclude this because you need to integrate Crossplane with a centralized secret management solution, we will document below how to do that.

### Reading secrets

To read secrets from an external source into your Crossplane cluster, we recommend installing the [External Secrets Operator](https://external-secrets.io) into your cluster. The External Secrets Operator is an open-source tool that implements a custom resource called `ExternalSecret` that defines where secrets live. 

To use the external secrets operator, you need to register a SecretStore. This could Vault, AWS Key Secrets Manager, or other central keystore services.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: default
spec:
  provider:
    vault:
      server: your-vault-server-address
      path: secret
      namespace: admin
      version: v2
      auth:
        # points to a secret that contains a vault token
        # https://www.vaultproject.io/docs/auth/token
        tokenSecretRef:
          name: vault-secret
          key: vault-token
```

Once you have a secret store configured, you can pull external secrets into your control plane by creating new `ExternalSecrets`. As an example, this allows you to store ProviderConfig credentials in a central keystore and pull them into different control planes.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: providerconfig-gcp-secret
  namespace: default
spec:
  refreshInterval: 15s
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    creationPolicy: Owner
  data:
  - secretKey: creds
    remoteRef:
      key: providerconfigs
      property: providerconf-gcp
```

### Writing secrets

When Crossplane creates a secret, the default mode is to write that the secret as a Kubernetes secret in its cluster. One common example of this is when you create a resource that generates connection details, this will get written to a local Kubernetes secret in the cluster. 

If you need to write secrets to a centralized secret management solution outside of the cluster, you can rely on the fact that a secret is "just another Crossplane resource" in this case. You should create secrets in your desired secret store by composing the set of managed resources which represent the secret, and pull data from the Kubernetes secret that Crossplane creates.

In the example below, we demonstrate a sample composition that stores the connection details for a GCP CloudSQL database into a secret in GCP Secret Manager.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xsuperdatabases.test.org
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: test.org/v1alpha1
    kind: XSuperDatabase
  resources:
    - name: the-db
      base:
        apiVersion: sql.gcp.upbound.io/v1beta1
        kind: DatabaseInstance
        metadata:
          name: my-database
        spec:
          forProvider:
            databaseVersion: MYSQL_5_7
            deletionProtection: false
            region: us-central1
            settings:
              - diskSize: 20
                tier: db-f1-micro
          writeConnectionSecretToRef:
            name: my-db-connection
            namespace: default
        patches:
          - type: FromCompositeFieldPath
            fromFieldPath: spec.parameters.name
            toFieldPath: metadata.name
    - name: the-secret
      base:
        apiVersion: secretmanager.gcp.upbound.io/v1beta1
        kind: Secret
        metadata:
          name: my-db-secret
        spec:
          forProvider:
            labels:
              environment: dev
            replication:
              - automatic: true
        patches:
          - type: CombineFromComposite
            combine:
              variables:
              - fromFieldPath: spec.parameters.name
              strategy: string
              string:
                fmt: "%s-secret"
            toFieldPath: metadata.name
            policy:
              fromFieldPath: Required
    - name: the-secret-data
      base:
        apiVersion: secretmanager.gcp.upbound.io/v1beta1
        kind: SecretVersion
        metadata:
          name: my-db-secret-version
        spec:
          forProvider:
            secretDataSecretRef:
              key: publicIP
              name: my-db-connection
              namespace: default
            secretSelector:
              matchControllerRef: true
```

When a new composite resource gets created which uses this composition, a `kind: DatabaseInstance` managed resource gets created. it stores its connection details in a local secret in the cluster. A `kind: Secret` resource will get created, respresenting a new secret in GCP Secret Manager. Then a `kind: SecretVersion` resource gets created, which will transpose the data from a local Kubernetes secret to the secret contained in GCP.

This example is for GCP, but you would follow a similar pattern for other popular secret stores (AWS, Azure, Vault, etc), too.