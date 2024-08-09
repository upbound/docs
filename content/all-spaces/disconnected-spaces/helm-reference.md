---
title: Space Helm Chart Reference
weight: 200
description: Spaces Helm chart configuration values
aliases:
    - /spaces/helm-reference
---
<!-- vale off -->

This reference provides detailed documentation on the Upbound Space Helm chart. This Helm chart contains configuration values for installation, configuration, and management of an Upbound Space deployment.


{{< table-no "table table-responsive table-striped table-sm" >}}

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| account | string | `"notdemo"` | The Upbound organization this installation is associated with. |
| api.extraVolumes | list | `[]` | None |
| api.prometheus.podMonitor.enabled | bool | `false` | None |
| api.prometheus.podMonitor.interval | string | `"30s"` | None |
| api.proxy.extraArgs | list | `[]` | None |
| api.proxy.extraEnv | list | `[]` | None |
| api.proxy.extraVolumeMounts | list | `[]` | None |
| api.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| api.proxy.image.repository | string | `"hyperspace"` | None |
| api.proxy.image.tag | string | `""` | None |
| api.proxy.resources.limits.cpu | string | `"1000m"` | None |
| api.proxy.resources.limits.memory | string | `"200Mi"` | None |
| api.proxy.resources.requests.cpu | string | `"100m"` | None |
| api.proxy.resources.requests.memory | string | `"50Mi"` | None |
| api.proxy.service.api.port | int | `8443` | None |
| api.proxy.service.metrics.port | int | `8085` | None |
| api.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| api.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| api.serviceAccount | object | `{"annotations":{},"create":true,"name":"mxe-api"}` | None |
| api.serviceAccount.annotations | object | `{}` | None |
| api.serviceAccount.create | bool | `true` | None |
| api.serviceAccount.name | string | `"mxe-api"` | None |
| authentication | object | `{"hubIdentities":true,"structuredConfig":""}` | Authentication options |
| authentication.hubIdentities | bool | `true` | This enables respecting built in Kubernetes identities (clientcertificate, managed kubernetes OIDC, Kubernetes Groups, etc) specified within the Connected Space's hub. |
| authentication.structuredConfig | string | `""` | Enables consumption of JWT Authenticators via Authentication Configuration per https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-authentication-configuration <br> The below property takes the name of a configmap that contains a structured authentication configuration. |
| authorization | object | `{"hubRBAC":true}` | Authorization options |
| authorization.hubRBAC | bool | `true` | This enables respecting built in Kubernetes Roles and RoleBindings for the resources included in the Space's installation. |
| billing.enabled | bool | `false` | None |
| billing.storage.aws | object | `{"bucket":"","endpoint":"","region":"","tls":{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}}` | None |
| billing.storage.aws.bucket | string | `""` | See billing.storage.secretRef for authentication. <br> Required if billing.storage.provider=aws. |
| billing.storage.aws.endpoint | string | `""` | None |
| billing.storage.aws.region | string | `""` | Required if billing.storage.provider=aws. |
| billing.storage.aws.tls | object | `{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}` | None |
| billing.storage.aws.tls."ca.crt" | bool | `false` | See billing.storage.secretRef.<br> Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.aws.tls."tls.crt" | bool | `false` | None |
| billing.storage.aws.tls."tls.key" | bool | `false` | None |
| billing.storage.aws.tls.alpnProtocols | list | `[]` | None |
| billing.storage.aws.tls.verifyCertificate | bool | `true` | None |
| billing.storage.aws.tls.verifyHostname | bool | `true` | None |
| billing.storage.azure | object | `{"connectionString":"","container":"","endpoint":"","storageAccount":""}` | None |
| billing.storage.azure.connectionString | string | `""` | None |
| billing.storage.azure.container | string | `""` | See billing.storage.secretRef for authentication.<br> Required if billing.storage.provider=azure. |
| billing.storage.azure.endpoint | string | `""` | None |
| billing.storage.azure.storageAccount | string | `""` | None |
| billing.storage.gcp | object | `{"bucket":"","tls":{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}}` | None |
| billing.storage.gcp.bucket | string | `""` | Required if billing.storage.provider=gcp. |
| billing.storage.gcp.tls | object | `{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}` | See billing.storage.secretRef for authentication. |
| billing.storage.gcp.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. <br> Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.gcp.tls."tls.crt" | bool | `false` | None |
| billing.storage.gcp.tls."tls.key" | bool | `false` | None |
| billing.storage.gcp.tls.alpnProtocols | list | `[]` | None |
| billing.storage.gcp.tls.verifyCertificate | bool | `true` | None |
| billing.storage.gcp.tls.verifyHostname | bool | `true` | None |
| billing.storage.provider | string | `""` | Required if billing.enabled=true. Must be one of aws, gcp, azure |
| billing.storage.secretRef | object | `{"name":"billing-storage"}` | None |
| billing.storage.secretRef.name | string | `"billing-storage"` | Required if billing.enabled=true. The secret may contain any of these keys for configuring authentication: <br> AWS_ACCESS_KEY_ID: AWS access key ID. Used when provider is aws. <br> AWS_SECRET_ACCESS_KEY: AWS secret access key. Used when provider is aws. <br> AZURE_TENANT_ID: Azure tenant ID. Used when provider is azure. <br> AZURE_CLIENT_ID: Azure client ID. Used when provider is azure. <br> AZURE_CLIENT_SECRET: Azure client secret. Used when provider is azure. <br> AZURE_USERNAME: Azure username. Used when provider is azure. <br> AZURE_PASSWORD: Azure username. Used when provider is azure. <br> google_application_credentials: GCP service account key JSON. Used when provider is gcp. <br> The secret may also contain any of the following keys for configuring  TLS. The corresponding value at billing.storage.<provider>.tls.<key> must also be set to true. <br> "ca.crt": Custom CA certificate. Used when provider is aws or gcp. <br> "tls.crt": Custom TLS certificate. Used when provider is aws or gcp. <br> "tls.key": Custom TLS key. Used when provider is aws or gcp. <br> |
| certificates | object | `{"clusterResourceNamespace":"cert-manager","provision":true,"space":{"clusterIssuer":"spaces-selfsigned"}}` | Given cert-manager is a requirement for installation, certificates specifies the general configurations for the certificates required for the installation to function. |
| certificates.clusterResourceNamespace | string | `"cert-manager"` | Specifies the cluster resource namespace for the cert-manager installation. <br> https://cert-manager.io/docs/configuration/#cluster-resource-namespace |
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources included in this chart. Operators can opt to provision their own certificates instead, however care should be made to ensure the certificates match the expected: <br> * Shared Certificate Authority <br> * Algorithm. (ECDSA) |
| certificates.space | object | `{"clusterIssuer":"spaces-selfsigned"}` | None |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
| clusterType | string | `"kind"` | Specifies the cluster type that this installation is being installed into. Valid options are: aks, eks, gke, kind. |
| controlPlanes.container.mxpAuthzWebhook.tag | string | `""` | None |
| controlPlanes.container.mxpCharts.tag | string | `""` | None |
| controlPlanes.container.mxpGateway.repository | string | `"hyperspace"` | None |
| controlPlanes.container.mxpGateway.tag | string | `""` | None |
| controlPlanes.container.mxpKsmConfig.repository | string | `"hyperspace"` | None |
| controlPlanes.container.mxpKsmConfig.tag | string | `""` | None |
| controlPlanes.etcd.persistence.size | string | `"5Gi"` | Set storage class backing the vcluster etcd PVCs <br> storageClassName: '' |
| controlPlanes.etcd.resources.requests.cpu | string | `"170m"` |  |
| controlPlanes.etcd.resources.requests.memory | string | `"350Mi"` |  |
| controlPlanes.ingress.annotations | object | `{}` | None |
| controlPlanes.k8sVersion | string | `"v1.29.6"` |  |
| controlPlanes.mxpController.serviceAccount.annotations | object | `{}` |  |
| controlPlanes.policies.limitRange.enabled | bool | `true` | None |
| controlPlanes.syncer.resources.limits.cpu | string | `"1000m"` | None |
| controlPlanes.syncer.resources.limits.memory | string | `"1024Mi"` | None |
| controlPlanes.syncer.resources.requests.cpu | string | `"20m"` | None |
| controlPlanes.syncer.resources.requests.memory | string | `"150Mi"` | None |
| controlPlanes.uxp.enableCompositionFunctions | bool | `true` | None |
| controlPlanes.uxp.enableEnvironmentConfigs | bool | `true` | None |
| controlPlanes.uxp.enableProviderIdentity | bool | `false` | None |
| controlPlanes.uxp.enableUsages | bool | `true` | None |
| controlPlanes.uxp.metrics.enabled | bool | `true` | None |
| controlPlanes.uxp.registryOverride | string | `""` | override the default package registry for Crossplane |
| controlPlanes.uxp.repository | string | `"https://charts.upbound.io/stable"` | None |
| controlPlanes.uxp.resourcesCrossplane.limits.cpu | string | `"400m"` | None |
| controlPlanes.uxp.resourcesCrossplane.limits.memory | string | `"500Mi"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests.cpu | string | `"370m"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests.memory | string | `"400Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager.limits.cpu | string | `"50m"` | None |
| controlPlanes.uxp.resourcesRBACManager.limits.memory | string | `"300Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests.cpu | string | `"25m"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests.memory | string | `"256Mi"` | None |
| controlPlanes.uxp.serviceAccount.customAnnotations | object | `{}` | None |
| controlPlanes.uxp.version | string | `"1.15.3-up.1"` | None |
| controlPlanes.uxp.xgql.enabled | bool | `true` | None |
| controlPlanes.uxp.xgql.replicas | int | `1` | None |
| controlPlanes.uxp.xgql.resources | object | `{"limits":{"cpu":"500m","memory":"1Gi"},"requests":{"cpu":"50m","memory":"50Mi"}}` | None |
| controlPlanes.uxp.xgql.resources.limits.memory | string | `"1Gi"` | None |
| controlPlanes.uxp.xgql.resources.requests.cpu | string | `"50m"` | None |
| controlPlanes.uxp.xgql.resources.requests.memory | string | `"50Mi"` | None |
| controlPlanes.uxp.xgql.version | string | `"v0.2.0-rc.0.153.g0a1d4ae"` | None |
| controlPlanes.vector.debug | bool | `false` | None |
| controlPlanes.vector.enabled | bool | `true` | None |
| controlPlanes.vector.persistence.enabled | bool | `false` | Set enabled to true to run Vector as a statefulset with each replica backed by a persistent volume and enable disk buffers for selected sinks. When set to false, Vector is run as a deployment with memory buffers. |
| controlPlanes.vector.persistence.size | string | `"1Gi"` | size must be at least the sum of all buffer.maxSize values with overhead for other Vector data. If you define this you should also define all sink buffer.maxSize values. |
| controlPlanes.vector.replicas | int | `1` | None |
| controlPlanes.vector.resources.limits | object | `{}` | None |
| controlPlanes.vector.resources.requests | object | `{"cpu":"200m","memory":"256Mi"}` | None |
| controlPlanes.vector.resources.requests.cpu | string | `"200m"` | None |
| controlPlanes.vector.resources.requests.memory | string | `"256Mi"` | None |
| controlPlanes.vector.sinks.usage.buffer.maxEvents | int | `500` | String containing max number of events to buffer in memory. <br> Relevant when mxp.vector.persistence.enabled=false. |
| controlPlanes.vector.sinks.usage.buffer.maxSize | int | `268435488` | String containing max size of disk buffer in bytes. Must fit with other buffer.maxSize values in mxp.vector.persistence.size. <br> Relevant when mxp.vector.persistence.enabled=true. <br> ~256 MiB, minimum allowed |
| controlPlanes.vector.version | string | `"0.22.1"` | None |
| controller | object | `{"controller":{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"2000Mi"},"requests":{"cpu":"100m","memory":"500Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}},"crossplane":{"supportedVersions":["1.14.1-up.1","1.14.2-up.1","1.14.3-up.1","1.14.4-up.1","1.14.5-up.1","1.14.6-up.1","1.14.7-up.1","1.14.8-up.1","1.14.9-up.1","1.15.0-up.1","1.15.1-up.1","1.15.2-up.1","1.15.3-up.1","1.16.0-up.1"],"versionsController":{"enabled":true}},"extraVolumes":[],"kcp":{"enabled":false,"frontProxy":{"replicas":1},"replicas":1,"storageClass":"standard"},"mxeInit":{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}},"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"adminSigning":"cert-admin-signing","ingressCA":"mxe-router-tls"},"serviceAccount":{"annotations":{},"create":true,"name":""},"webhookInit":{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}}}` | Configurations for the space controller deployment. |
| controller.controller | object | `{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"2000Mi"},"requests":{"cpu":"100m","memory":"500Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}}` | None |
| controller.controller.extraArgs | list | `[]` | None |
| controller.controller.extraEnv | list | `[]` | None |
| controller.controller.extraVolumeMounts | list | `[]` | None |
| controller.controller.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| controller.controller.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.controller.image.repository | string | `"hyperspace"` | None |
| controller.controller.image.tag | string | `""` | None |
| controller.controller.resources | object | `{"limits":{"cpu":"1000m","memory":"2000Mi"},"requests":{"cpu":"100m","memory":"500Mi"}}` | None |
| controller.controller.resources.limits | object | `{"cpu":"1000m","memory":"2000Mi"}` | None |
| controller.controller.resources.limits.cpu | string | `"1000m"` | None |
| controller.controller.resources.limits.memory | string | `"2000Mi"` | None |
| controller.controller.resources.requests | object | `{"cpu":"100m","memory":"500Mi"}` | None |
| controller.controller.resources.requests.cpu | string | `"100m"` | None |
| controller.controller.resources.requests.memory | string | `"500Mi"` | None |
| controller.controller.service | object | `{"metrics":{"port":8085},"webhook":{"port":9443}}` | None |
| controller.controller.service.metrics | object | `{"port":8085}` | None |
| controller.controller.service.metrics.port | int | `8085` | None |
| controller.controller.service.webhook | object | `{"port":9443}` | None |
| controller.controller.service.webhook.port | int | `9443` | None |
| controller.crossplane | object | `{"supportedVersions":["1.14.1-up.1","1.14.2-up.1","1.14.3-up.1","1.14.4-up.1","1.14.5-up.1","1.14.6-up.1","1.14.7-up.1","1.14.8-up.1","1.14.9-up.1","1.15.0-up.1","1.15.1-up.1","1.15.2-up.1","1.15.3-up.1","1.16.0-up.1"],"versionsController":{"enabled":true}}` | None |
| controller.crossplane.supportedVersions | list | `["1.14.1-up.1","1.14.2-up.1","1.14.3-up.1","1.14.4-up.1","1.14.5-up.1","1.14.6-up.1","1.14.7-up.1","1.14.8-up.1","1.14.9-up.1","1.15.0-up.1","1.15.1-up.1","1.15.2-up.1","1.15.3-up.1","1.16.0-up.1"]` | None |
| controller.crossplane.supportedVersions[0] | string | `"1.14.1-up.1"` | None |
| controller.crossplane.supportedVersions[10] | string | `"1.15.1-up.1"` | None |
| controller.crossplane.supportedVersions[11] | string | `"1.15.2-up.1"` | None |
| controller.crossplane.supportedVersions[12] | string | `"1.15.3-up.1"` | None |
| controller.crossplane.supportedVersions[13] | string | `"1.16.0-up.1"` | None |
| controller.crossplane.supportedVersions[1] | string | `"1.14.2-up.1"` | None |
| controller.crossplane.supportedVersions[2] | string | `"1.14.3-up.1"` | None |
| controller.crossplane.supportedVersions[3] | string | `"1.14.4-up.1"` | None |
| controller.crossplane.supportedVersions[4] | string | `"1.14.5-up.1"` | None |
| controller.crossplane.supportedVersions[5] | string | `"1.14.6-up.1"` | None |
| controller.crossplane.supportedVersions[6] | string | `"1.14.7-up.1"` | None |
| controller.crossplane.supportedVersions[7] | string | `"1.14.8-up.1"` | None |
| controller.crossplane.supportedVersions[8] | string | `"1.14.9-up.1"` | None |
| controller.crossplane.supportedVersions[9] | string | `"1.15.0-up.1"` | None |
| controller.crossplane.versionsController | object | `{"enabled":true}` | None |
| controller.crossplane.versionsController.enabled | bool | `true` | This flag enables the versionsController. When set to true, the controller will manage Crossplane versions configmap. If disabled, default behavior will be supportedVersions will applied without automatic updates. |
| controller.extraVolumes | list | `[]` | None |
| controller.kcp | object | `{"enabled":false,"frontProxy":{"replicas":1},"replicas":1,"storageClass":"standard"}` | None |
| controller.kcp.enabled | bool | `false` | None |
| controller.kcp.frontProxy | object | `{"replicas":1}` | None |
| controller.kcp.frontProxy.replicas | int | `1` | None |
| controller.kcp.replicas | int | `1` | None |
| controller.kcp.storageClass | string | `"standard"` | None |
| controller.mxeInit | object | `{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}}` | None |
| controller.mxeInit.extraArgs | list | `[]` | None |
| controller.mxeInit.extraEnv | list | `[]` | None |
| controller.mxeInit.extraVolumeMounts | list | `[]` | None |
| controller.mxeInit.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| controller.mxeInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.mxeInit.image.repository | string | `"hyperspace"` | None |
| controller.mxeInit.image.tag | string | `""` | None |
| controller.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| controller.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| controller.prometheus.podMonitor.enabled | bool | `false` | None |
| controller.prometheus.podMonitor.interval | string | `"30s"` | None |
| controller.secretRefs | object | `{"adminSigning":"cert-admin-signing","ingressCA":"mxe-router-tls"}` | None |
| controller.secretRefs.adminSigning | string | `"cert-admin-signing"` | None |
| controller.secretRefs.ingressCA | string | `"mxe-router-tls"` | None |
| controller.serviceAccount | object | `{"annotations":{},"create":true,"name":""}` | None |
| controller.serviceAccount.annotations | object | `{}` | None |
| controller.serviceAccount.create | bool | `true` | None |
| controller.serviceAccount.name | string | `""` | None |
| controller.webhookInit | object | `{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}}` | None |
| controller.webhookInit.extraArgs | list | `[]` | None |
| controller.webhookInit.extraEnv | list | `[]` | None |
| controller.webhookInit.extraVolumeMounts | list | `[]` | None |
| controller.webhookInit.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| controller.webhookInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.webhookInit.image.repository | string | `"hyperspace"` | None |
| controller.webhookInit.image.tag | string | `""` | None |
| deletionPolicy | string | `"Delete"` | Specifies if the supporting APIs for the Spaces deployment should be handled on a deletion request. Possible options are "Delete" or "Orphan". If "Delete" is specified, on performing a 'helm uninstall', the Crossplane configurations that support the installation will also be deleted along with the resources that make the spaces installation. |
| features | object | `{"alpha":{"apollo":{"apiserver":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}},"enabled":false,"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"},"serviceAccount":{"annotations":{},"create":true,"name":"mxe-apollo"},"storage":{"postgres":{"connection":{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}}},"syncer":{"debug":false,"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"metrics":{"enabled":true},"resources":{"limits":{"cpu":"1000m","memory":"1024Mi"},"requests":{"cpu":"100m","memory":"150Mi"}}}},"argocdPlugin":{"enabled":false,"target":{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}},"featuresAnnotation":{"enabled":false},"observability":{"enabled":false},"sharedBackup":{"enabled":false},"sharedSecrets":{"enabled":false},"upboundPolicy":{"enabled":false},"upboundRBAC":{"enabled":false}},"beta":{}}` | None |
| features.alpha | object | `{"apollo":{"apiserver":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}},"enabled":false,"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"},"serviceAccount":{"annotations":{},"create":true,"name":"mxe-apollo"},"storage":{"postgres":{"connection":{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}}},"syncer":{"debug":false,"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"metrics":{"enabled":true},"resources":{"limits":{"cpu":"1000m","memory":"1024Mi"},"requests":{"cpu":"100m","memory":"150Mi"}}}},"argocdPlugin":{"enabled":false,"target":{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}},"featuresAnnotation":{"enabled":false},"observability":{"enabled":false},"sharedBackup":{"enabled":false},"sharedSecrets":{"enabled":false},"upboundPolicy":{"enabled":false},"upboundRBAC":{"enabled":false}}` | NOTE: Alpha features are subject to removal or breaking changes without notice, and generally not considered ready for use in production. They have to be optional even if they are enabled. |
| features.alpha.apollo | object | `{"apiserver":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}},"enabled":false,"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"},"serviceAccount":{"annotations":{},"create":true,"name":"mxe-apollo"},"storage":{"postgres":{"connection":{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}}},"syncer":{"debug":false,"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"metrics":{"enabled":true},"resources":{"limits":{"cpu":"1000m","memory":"1024Mi"},"requests":{"cpu":"100m","memory":"150Mi"}}}}` | Configurations for the apollo deployment. |
| features.alpha.apollo.apiserver | object | `{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}}` | None |
| features.alpha.apollo.apiserver.extraArgs | list | `[]` | None |
| features.alpha.apollo.apiserver.extraEnv | list | `[]` | None |
| features.alpha.apollo.apiserver.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| features.alpha.apollo.apiserver.image.pullPolicy | string | `"IfNotPresent"` | None |
| features.alpha.apollo.apiserver.image.repository | string | `"hyperspace"` | None |
| features.alpha.apollo.apiserver.image.tag | string | `""` | None |
| features.alpha.apollo.apiserver.resources | object | `{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}}` | None |
| features.alpha.apollo.apiserver.resources.limits | object | `{"cpu":"1000m","memory":"500Mi"}` | None |
| features.alpha.apollo.apiserver.resources.limits.cpu | string | `"1000m"` | None |
| features.alpha.apollo.apiserver.resources.limits.memory | string | `"500Mi"` | None |
| features.alpha.apollo.apiserver.resources.requests | object | `{"cpu":"100m","memory":"200Mi"}` | None |
| features.alpha.apollo.apiserver.resources.requests.cpu | string | `"100m"` | None |
| features.alpha.apollo.apiserver.resources.requests.memory | string | `"200Mi"` | None |
| features.alpha.apollo.apiserver.service | object | `{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}` | None |
| features.alpha.apollo.apiserver.service.api | object | `{"port":8443}` | None |
| features.alpha.apollo.apiserver.service.api.port | int | `8443` | None |
| features.alpha.apollo.apiserver.service.metrics | object | `{"port":8085}` | None |
| features.alpha.apollo.apiserver.service.metrics.port | int | `8085` | None |
| features.alpha.apollo.apiserver.service.type | string | `"ClusterIP"` | None |
| features.alpha.apollo.enabled | bool | `false` | None |
| features.alpha.apollo.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| features.alpha.apollo.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| features.alpha.apollo.prometheus.podMonitor.enabled | bool | `false` | None |
| features.alpha.apollo.prometheus.podMonitor.interval | string | `"30s"` | None |
| features.alpha.apollo.secretRefs | object | `{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"}` | None |
| features.alpha.apollo.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| features.alpha.apollo.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| features.alpha.apollo.serviceAccount | object | `{"annotations":{},"create":true,"name":"mxe-apollo"}` | None |
| features.alpha.apollo.serviceAccount.annotations | object | `{}` | None |
| features.alpha.apollo.serviceAccount.create | bool | `true` | None |
| features.alpha.apollo.serviceAccount.name | string | `"mxe-apollo"` | None |
| features.alpha.apollo.storage | object | `{"postgres":{"connection":{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}}}` | None |
| features.alpha.apollo.storage.postgres | object | `{"connection":{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}}` | None |
| features.alpha.apollo.storage.postgres.connection | object | `{"apollo":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"ca":{"name":""},"credentials":{"format":"pgpass","secret":{"name":""},"user":""},"database":"upbound","sslmode":"require","syncer":{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""},"url":""}` | None |
| features.alpha.apollo.storage.postgres.connection.apollo | object | `{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""}` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.credentials | object | `{"format":"","secret":{"name":""},"user":""}` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.credentials.format | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.credentials.secret | object | `{"name":""}` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.credentials.secret.name | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.credentials.user | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.sslmode | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.apollo.url | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.ca | object | `{"name":""}` | None |
| features.alpha.apollo.storage.postgres.connection.ca.name | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.credentials | object | `{"format":"pgpass","secret":{"name":""},"user":""}` | None |
| features.alpha.apollo.storage.postgres.connection.credentials.secret | object | `{"name":""}` | None |
| features.alpha.apollo.storage.postgres.connection.credentials.secret.name | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.credentials.user | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.database | string | `"upbound"` | None |
| features.alpha.apollo.storage.postgres.connection.sslmode | string | `"require"` | None |
| features.alpha.apollo.storage.postgres.connection.syncer | object | `{"credentials":{"format":"","secret":{"name":""},"user":""},"sslmode":"","url":""}` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.credentials | object | `{"format":"","secret":{"name":""},"user":""}` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.credentials.format | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.credentials.secret | object | `{"name":""}` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.credentials.secret.name | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.credentials.user | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.sslmode | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.syncer.url | string | `""` | None |
| features.alpha.apollo.storage.postgres.connection.url | string | `""` | None |
| features.alpha.apollo.syncer | object | `{"debug":false,"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"metrics":{"enabled":true},"resources":{"limits":{"cpu":"1000m","memory":"1024Mi"},"requests":{"cpu":"100m","memory":"150Mi"}}}` | None |
| features.alpha.apollo.syncer.debug | bool | `false` | None |
| features.alpha.apollo.syncer.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| features.alpha.apollo.syncer.image.pullPolicy | string | `"IfNotPresent"` | None |
| features.alpha.apollo.syncer.image.repository | string | `"hyperspace"` | None |
| features.alpha.apollo.syncer.image.tag | string | `""` | None |
| features.alpha.apollo.syncer.metrics | object | `{"enabled":true}` | None |
| features.alpha.apollo.syncer.metrics.enabled | bool | `true` | None |
| features.alpha.apollo.syncer.resources | object | `{"limits":{"cpu":"1000m","memory":"1024Mi"},"requests":{"cpu":"100m","memory":"150Mi"}}` | None |
| features.alpha.apollo.syncer.resources.limits | object | `{"cpu":"1000m","memory":"1024Mi"}` | None |
| features.alpha.apollo.syncer.resources.limits.cpu | string | `"1000m"` | None |
| features.alpha.apollo.syncer.resources.limits.memory | string | `"1024Mi"` | None |
| features.alpha.apollo.syncer.resources.requests | object | `{"cpu":"100m","memory":"150Mi"}` | None |
| features.alpha.apollo.syncer.resources.requests.cpu | string | `"100m"` | None |
| features.alpha.apollo.syncer.resources.requests.memory | string | `"150Mi"` | None |
| features.alpha.argocdPlugin | object | `{"enabled":false,"target":{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}}` | None |
| features.alpha.argocdPlugin.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target | object | `{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}` | None |
| features.alpha.argocdPlugin.target.externalCluster | object | `{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}}` | The secret name and key for the kubeconfig of the external cluster. This is used by the argocd plugin to connect to the external cluster in case ArgoCD does not run in the same cluster as Spaces. If not specified, defaults to in-cluster credentials. |
| features.alpha.argocdPlugin.target.externalCluster.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret | object | `{"key":"kubeconfig","name":"kubeconfig"}` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.key | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.name | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.secretNamespace | string | `"argocd"` | None |
| features.alpha.featuresAnnotation | object | `{"enabled":false}` | None |
| features.alpha.featuresAnnotation.enabled | bool | `false` | None |
| features.alpha.observability | object | `{"enabled":false}` | None |
| features.alpha.observability.enabled | bool | `false` | This enables the observability feature within this space.<br> Enabling observability requires OpenTelemetry Operator for Kubernetes to be installed in the cluster. See https://opentelemetry.io/docs/kubernetes/operator/ |
| features.alpha.sharedBackup | object | `{"enabled":false}` | None |
| features.alpha.sharedBackup.enabled | bool | `false` | This enables backup and restore of control planes using Shared resources. |
| features.alpha.sharedSecrets | object | `{"enabled":false}` | SharedSecrets enables the ability to use the SharedSecrets feature within this space. |
| features.alpha.sharedSecrets.enabled | bool | `false` | None |
| features.alpha.upboundPolicy | object | `{"enabled":false}` | None |
| features.alpha.upboundPolicy.enabled | bool | `false` | This enables the SharedUpboundPolicy API within this space. |
| features.alpha.upboundRBAC | object | `{"enabled":false}` | None |
| features.alpha.upboundRBAC.enabled | bool | `false` | This enables respecting Upbound Authorization management within the space. This will include new APIs for binding Objects to identities supplied by Upbound. |
| features.beta | object | `{}` | Beta features are on by default, but may be disabled here. Beta features are considered to be well tested, and will not be removed completely without being marked deprecated for at least two releases. |
| hostCluster.provider.helm.version | string | `"v0.19.0"` | None |
| hostCluster.provider.kubernetes.version | string | `"v0.14.0"` | None |
| hostCluster.uxp.metrics | object | `{"enabled":true}` | None |
| hostCluster.uxp.version | string | `"1.15.3-up.1"` | None |
| imagePullSecrets | list | `[{"name":"upbound-pull-secret"}]` | NOTE: only an imagePullSecret of "upbound-pull-secret" is currently supported. |
| imagePullSecrets[0] | object | `{"name":"upbound-pull-secret"}` | None |
| ingress | object | `{"annotations":{},"host":"proxy.upbound-127.0.0.1.nip.io","provision":true}` | Configurations for external requests coming into the space. |
| ingress.annotations | object | `{}` | Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
| observability | object | `{"collectors":{"repository":"opentelemetry-collector-spaces","resources":{"limits":{"cpu":"100m","memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}},"tag":""},"spacesCollector":{"config":{"exportPipeline":{"logs":["debug"],"metrics":["debug"]},"exporters":{"debug":null}},"repository":"opentelemetry-collector-spaces","resources":{"limits":{"cpu":100,"memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}},"tag":""}}` | None |
| observability.collectors | object | `{"repository":"opentelemetry-collector-spaces","resources":{"limits":{"cpu":"100m","memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}},"tag":""}` | Observability configuration to collect metrics and traces ( and logs in the future) from the Control Plane. <br> Use SharedTelemetryConfig API to configure the exporters for Control Planes and Control Plane Groups. <br> Control Plane telemetry collection is disabled by default and gated by the "features.alpha.observability.enabled" parameter. |
| observability.collectors.repository | string | `"opentelemetry-collector-spaces"` | None |
| observability.collectors.resources | object | `{"limits":{"cpu":"100m","memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}}` | None |
| observability.collectors.resources.limits | object | `{"cpu":"100m","memory":"1Gi"}` | None |
| observability.collectors.resources.limits.cpu | string | `"100m"` | None |
| observability.collectors.resources.limits.memory | string | `"1Gi"` | None |
| observability.collectors.resources.requests | object | `{"cpu":"10m","memory":"100Mi"}` | None |
| observability.collectors.resources.requests.cpu | string | `"10m"` | None |
| observability.collectors.resources.requests.memory | string | `"100Mi"` | None |
| observability.collectors.tag | string | `""` | None |
| observability.spacesCollector | object | `{"config":{"exportPipeline":{"logs":["debug"],"metrics":["debug"]},"exporters":{"debug":null}},"repository":"opentelemetry-collector-spaces","resources":{"limits":{"cpu":100,"memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}},"tag":""}` | Observability configuration to collect metrics (traces and logs in the future) from the Spaces machinery and send them to the specified exporters. |
| observability.spacesCollector.config | object | `{"exportPipeline":{"logs":["debug"],"metrics":["debug"]},"exporters":{"debug":null}}` | None |
| observability.spacesCollector.config.exportPipeline.logs | list | `["debug"]` | None |
| observability.spacesCollector.config.exportPipeline.metrics | list | `["debug"]` | None |
| observability.spacesCollector.config.exporters | object | `{"debug":null}` | To export observability data, configure the exporters here and update the exportPipeline to include the exporters you want to use per telemetry type. |
| observability.spacesCollector.config.exporters.debug | string | `nil` | None |
| observability.spacesCollector.repository | string | `"opentelemetry-collector-spaces"` | None |
| observability.spacesCollector.resources | object | `{"limits":{"cpu":100,"memory":"1Gi"},"requests":{"cpu":"10m","memory":"100Mi"}}` | None |
| observability.spacesCollector.resources.limits | object | `{"cpu":100,"memory":"1Gi"}` | None |
| observability.spacesCollector.resources.limits.cpu | int | `100` | None |
| observability.spacesCollector.resources.limits.memory | string | `"1Gi"` | None |
| observability.spacesCollector.resources.requests | object | `{"cpu":"10m","memory":"100Mi"}` | None |
| observability.spacesCollector.resources.requests.cpu | string | `"10m"` | None |
| observability.spacesCollector.resources.requests.memory | string | `"100Mi"` | None |
| observability.spacesCollector.tag | string | `""` | None |
| registry | string | `"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"` | Specifies the registry where the containers used in the spaces deployment are served from. |
| router | object | `{"controlPlane":{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}},"extraVolumes":[],"hpa":{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80},"oidc":[],"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"proxy":{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"annotations":{},"http":{"port":8443},"type":"ClusterIP"}},"replicaCount":1,"secretRefs":{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","oidcCABundle":"","tlsSecretName":"mxp-hostcluster-certs"},"serviceAccount":{"annotations":{},"create":true,"name":""}}` | Configurations for the space router deployment. |
| router.controlPlane | object | `{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}}` | None |
| router.controlPlane.extraArgs | list | `[]` | None |
| router.controlPlane.extraEnv | list | `[]` | None |
| router.controlPlane.extraVolumeMounts | list | `[]` | None |
| router.controlPlane.image | object | `{"pullPolicy":"IfNotPresent","repository":"hyperspace","tag":""}` | None |
| router.controlPlane.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.controlPlane.image.repository | string | `"hyperspace"` | None |
| router.controlPlane.image.tag | string | `""` | None |
| router.controlPlane.resources | object | `{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}}` | None |
| router.controlPlane.resources.limits | object | `{"cpu":"1000m","memory":"1000Mi"}` | None |
| router.controlPlane.resources.limits.cpu | string | `"1000m"` | None |
| router.controlPlane.resources.limits.memory | string | `"1000Mi"` | None |
| router.controlPlane.resources.requests | object | `{"cpu":"100m","memory":"100Mi"}` | None |
| router.controlPlane.resources.requests.cpu | string | `"100m"` | None |
| router.controlPlane.resources.requests.memory | string | `"100Mi"` | None |
| router.controlPlane.service | object | `{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}` | None |
| router.controlPlane.service.auth | object | `{"port":9000}` | None |
| router.controlPlane.service.auth.port | int | `9000` | None |
| router.controlPlane.service.grpc | object | `{"port":8081}` | None |
| router.controlPlane.service.grpc.port | int | `8081` | None |
| router.controlPlane.service.http | object | `{"port":9091}` | None |
| router.controlPlane.service.http.port | int | `9091` | None |
| router.controlPlane.service.metrics | object | `{"port":8085}` | None |
| router.controlPlane.service.metrics.port | int | `8085` | None |
| router.controlPlane.service.privateHttp | object | `{"port":9092}` | None |
| router.controlPlane.service.privateHttp.port | int | `9092` | None |
| router.extraVolumes | list | `[]` | None |
| router.hpa | object | `{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80}` | None |
| router.hpa.enabled | bool | `false` | None |
| router.hpa.maxReplicas | int | `5` | None |
| router.hpa.minReplicas | int | `1` | None |
| router.hpa.targetCPUUtilizationPercentage | int | `80` | None |
| router.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| router.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| router.prometheus.podMonitor.enabled | bool | `false` | None |
| router.prometheus.podMonitor.interval | string | `"30s"` | None |
| router.proxy | object | `{"extraArgs":[],"extraEnv":[],"extraVolumeMounts":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"annotations":{},"http":{"port":8443},"type":"ClusterIP"}}` | None |
| router.proxy.extraArgs | list | `[]` | None |
| router.proxy.extraEnv | list | `[]` | None |
| router.proxy.extraVolumeMounts | list | `[]` | None |
| router.proxy.image | object | `{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"}` | None |
| router.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.proxy.image.repository | string | `"envoy"` | None |
| router.proxy.image.tag | string | `"v1.26-latest"` | None |
| router.proxy.resources | object | `{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}}` | None |
| router.proxy.resources.limits | object | `{"cpu":"1000m","memory":"200Mi"}` | None |
| router.proxy.resources.limits.cpu | string | `"1000m"` | None |
| router.proxy.resources.limits.memory | string | `"200Mi"` | None |
| router.proxy.resources.requests | object | `{"cpu":"100m","memory":"50Mi"}` | None |
| router.proxy.resources.requests.cpu | string | `"100m"` | None |
| router.proxy.resources.requests.memory | string | `"50Mi"` | None |
| router.proxy.service | object | `{"annotations":{},"http":{"port":8443},"type":"ClusterIP"}` | None |
| router.proxy.service.annotations | object | `{}` | None |
| router.proxy.service.http | object | `{"port":8443}` | None |
| router.proxy.service.http.port | int | `8443` | None |
| router.proxy.service.type | string | `"ClusterIP"` | None |
| router.replicaCount | int | `1` | None |
| router.secretRefs | object | `{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","oidcCABundle":"","tlsSecretName":"mxp-hostcluster-certs"}` | None |
| router.secretRefs.adminValidating | string | `"cert-admin-signing"` | None |
| router.secretRefs.gatewaySigning | string | `"cert-token-signing-gateway"` | None |
| router.secretRefs.oidcCABundle | string | `""` | The ca.crt key of this Secret will be mounted into the spaces-router |
| router.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| router.serviceAccount | object | `{"annotations":{},"create":true,"name":""}` | None |
| router.serviceAccount.annotations | object | `{}` | None |
| router.serviceAccount.create | bool | `true` | None |
| router.serviceAccount.name | string | `""` | None |
| space | object | `{"labels":{}}` | Configurations that are applied consistently across the space. |
| space.labels | object | `{}` | Labels that are applied to all Deployments, Pods, Services, and StatefulSets managed by the Space. |
| version | string | `""` | Overall artifact version that affects xpkgs and related components. |
| xpkg.mxeCompositionTemplates.repository | string | `"mxe-composition-templates"` | None |
| xpkg.mxeCompositionTemplates.tag | string | `""` | None |
| xpkg.mxpControlPlane.repository | string | `"mxp-control-plane"` | None |
| xpkg.mxpControlPlane.tag | string | `""` | None |
| xpkg.mxpHostCluster.repository | string | `"mxp-host-cluster"` | None |
| xpkg.mxpHostCluster.tag | string | `""` | None |
| xpkg.providerHostCluster.repository | string | `"provider-host-cluster"` | None |
| xpkg.providerHostCluster.tag | string | `""` | None |
| xpkg.pullPolicy | string | `"IfNotPresent"` | None |

{{< /table-no >}}

<!-- vale on -->