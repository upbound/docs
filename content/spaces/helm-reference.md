---
title: Helm Chart Reference
weight: 200
description: Spaces Helm chart configuration values
---

This reference provides detailed documentation on the Upbound Space Helm chart. This page details the Helm chart configuration values for installation, configuration, and management of an Upbound Space deployment.

## Top-level keys

[account](#account)

[clusterType](#clusterType)

[version](#version)

[ingress](#ingress)

[deletion policy](#deletion-policy)

[space](#space)

[certificates](#certificates)

[router](#router)

[billing](#billing)

[features](#features)


### account

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| account | string | `"notdemo"` | The Upbound organization this installation is associated with. |
{{</ table >}}

### clusterType


{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| clusterType | string | `"kind"` | Specifies the cluster type that this installation is being installed into. <br> Valid options are: `aks`, `eks`, `gke`, `kind`. |
{{</ table >}}

### version

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| version | string | `"0.1.0"` | Overall artifact version that affects xpkgs and related components. |
{{</ table >}}

### ingress

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| ingress | object | | Configurations for external requests coming into the space. |
| ingress.annotations | object | `{}` |   Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
{{</ table >}}

### deletion policy


{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| deletionPolicy | string | `"Delete"` | Specifies if the supporting APIs for the Spaces deployment should be handled on a deletion request. Possible options are "Delete" or "Orphan". If "Delete" is specified, on performing a 'helm uninstall', the Crossplane configurations that support the installation will also be deleted along with the resources that make the spaces installation. |
{{</ table >}}

### space

Configuration values applied consistently across the space.

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| space.labels | object | `{}` |  Labels that are applied to all Deployments, Pods, Services, and StatefulSets managed by the Space. |

{{</ table >}}

### certificates

Given cert-manager is a requirement for installation, certificates specifies the general configurations for the certificates required for the installation to function.

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources included in this chart. Operators can opt to provision their own certificates instead, however care should be made to ensure the certificates match the expected:<br>* Shared Certificate Authority<br>* Algorithm. (ECDSA)  |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
{{</ table >}}

### router

Configuration values for the Space router deployment.

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| router.oidc | list | `[]` | Configures [OpenID Connect Authentication](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens). <br> Current supported arguments for this array are a subset of the arguments defined in the above document. Those arguments include:<br>`--oidc-issuer-url` <br> `--oidc-client-id` <br> `--oidc-username-claim` |
{{</ table >}}

### billing

Configuration values for Spaces billing settings.

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| billing.enabled | bool | `false` |  |
| billing.storage.aws.bucket | string | `""` |  |
| billing.storage.aws.endpoint | string | `""` |  |
| billing.storage.aws.region | string | `""` |  |
| billing.storage.aws.tls."ca.crt" | bool | `false` |  |
| billing.storage.aws.tls."tls.crt" | bool | `false` |  |
| billing.storage.aws.tls."tls.key" | bool | `false` |  |
| billing.storage.aws.tls.alpnProtocols | list | `[]` |  |
| billing.storage.aws.tls.verifyCertificate | bool | `true` |  |
| billing.storage.aws.tls.verifyHostname | bool | `true` |  |
| billing.storage.azure.connectionString | string | `""` |  |
| billing.storage.azure.container | string | `""` |  |
| billing.storage.azure.endpoint | string | `""` |  |
| billing.storage.azure.storageAccount | string | `""` |  |
| billing.storage.gcp.bucket | string | `""` |  |
| billing.storage.gcp.tls."ca.crt" | bool | `false` |  |
| billing.storage.gcp.tls."tls.crt" | bool | `false` |  |
| billing.storage.gcp.tls."tls.key" | bool | `false` |  |
| billing.storage.gcp.tls.alpnProtocols | list | `[]` |  |
| billing.storage.gcp.tls.verifyCertificate | bool | `true` |  |
| billing.storage.gcp.tls.verifyHostname | bool | `true` |  |
| billing.storage.provider | string | `""` | Required if `billing.enabled`=`true`. Valid values: `aws`, `gcp`, `azure` |
| billing.storage.secretRef.name | string | `"billing-storage"` |  |
{{</ table >}}

### features

{{< table >}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| features.alpha.argocdPlugin.enabled | bool | `false` |  |
| features.alpha.argocdPlugin.target.externalCluster.enabled | bool | `false` |  |
| features.alpha.argocdPlugin.target.externalCluster.secret.key | string | `"kubeconfig"` |  |
| features.alpha.argocdPlugin.target.externalCluster.secret.name | string | `"kubeconfig"` |  |
| features.alpha.argocdPlugin.target.secretNamespace | string | `"argocd"` |  |
| features.alpha.controlPlaneBackup.enabled | bool | `false` |  |
| features.alpha.featuresAnnotation.enabled | bool | `false` |  |
| features.alpha.gitSource.enabled | bool | `true` |  |
| features.alpha.kine.enabled | bool | `false` |  |
| features.alpha.sharedSecrets.enabled | bool | `false` |  |
| features.alpha.sharedSecrets.namespace | string | `"external-secrets"` |  |
| features.beta | object | `{}` |  |
{{</ table >}}