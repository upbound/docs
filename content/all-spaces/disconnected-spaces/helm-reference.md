---
title: Space Helm Chart Reference
weight: 200
description: Spaces Helm chart configuration values
---
<!-- vale off -->

This reference provides detailed documentation on the Upbound Space Helm chart. This Helm chart contains configuration values for installation, configuration, and management of an Upbound Space deployment.


{{< table "table table-striped" >}}


![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1.0](https://img.shields.io/badge/AppVersion-0.1.0-informational?style=flat-square)


| Key | Type | Default | Description |
|-----|------|---------|-------------|
| account | string | `"notdemo"` |  |
| api | object |  | Configurations for the space api deployment. |
| api.prometheus | object |  | None |
| api.prometheus.podMonitor | object |  | None |
| api.prometheus.podMonitor.enabled | bool | `false` | None |
| api.prometheus.podMonitor.interval | string | `"30s"` | None |
| api.proxy | object |  | None |
| api.proxy.extraArgs | list | `[]` | None |
| api.proxy.extraEnv | list | `[]` | None |
| api.proxy.image | object |  | None |
| api.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| api.proxy.image.repository | string | `"mxe-api"` | None |
| api.proxy.image.tag | string | `"0.1.0"` | None |
| api.proxy.resources | object | | None |
| api.proxy.resources.limits | object |  | None |
| api.proxy.resources.limits.cpu | string | `"1000m"` | None |
| api.proxy.resources.limits.memory | string | `"200Mi"` | None |
| api.proxy.resources.requests | object | | None |
| api.proxy.resources.requests.cpu | string | `"100m"` | None |
| api.proxy.resources.requests.memory | string | `"50Mi"` | None |
| api.proxy.service | object |  | None |
| api.proxy.service.api | object |  | None |
| api.proxy.service.api.port | int | `8443` | None |
| api.proxy.service.metrics | object |  | None |
| api.proxy.service.metrics.port | int | `8085` | None |
| api.secretRefs | object |  | None |
| api.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| api.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| api.serviceAccount | object |  | None |
| api.serviceAccount.annotations | object | `{}` | None |
| api.serviceAccount.create | bool | `true` | None |
| api.serviceAccount.name | string | `"mxe-api"` | None |
| apollo | object |  | Configurations for the space api deployment. |
| apollo.apiserver | object | | None |
| apollo.apiserver.extraArgs | list | `[]` | None |
| apollo.apiserver.extraEnv | list | `[]` | None |
| apollo.apiserver.image | object |  | None |
| apollo.apiserver.image.pullPolicy | string | `"IfNotPresent"` | None |
| apollo.apiserver.image.repository | string | `"mxe-apollo"` | None |
| apollo.apiserver.image.tag | string | `"0.1.0"` | None |
| apollo.apiserver.resources | object | | None |
| apollo.apiserver.resources.limits | object | | None |
| apollo.apiserver.resources.limits.cpu | string | `"1000m"` | None |
| apollo.apiserver.resources.limits.memory | string | `"500Mi"` | None |
| apollo.apiserver.resources.requests | object |  | None |
| apollo.apiserver.resources.requests.cpu | string | `"100m"` | None |
| apollo.apiserver.resources.requests.memory | string | `"200Mi"` | None |
| apollo.apiserver.service | object | | None |
| apollo.apiserver.service.api | object |  | None |
| apollo.apiserver.service.api.port | int | `8443` | None |
| apollo.apiserver.service.metrics | object |  | None |
| apollo.apiserver.service.metrics.port | int | `8085` | None |
| apollo.apiserver.service.type | string | `"ClusterIP"` | None |
| apollo.prometheus | object |  | None |
| apollo.prometheus.podMonitor | object | | None |
| apollo.prometheus.podMonitor.enabled | bool | `false` | None |
| apollo.prometheus.podMonitor.interval | string | `"30s"` | None |
| apollo.secretRefs | object | | None |
| apollo.secretRefs.tlsClientSecretName | string | `"mxe-apollo-client-certs"` | None |
| apollo.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| apollo.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| apollo.serviceAccount | object |  | None |
| apollo.serviceAccount.annotations | object | `{}` | None |
| apollo.serviceAccount.create | bool | `true` | None |
| apollo.serviceAccount.name | string | `"mxe-apollo"` | None |
| billing | object |  | Configurations for space billing. |
| billing.enabled | bool | `false` | None |
| billing.storage | object |  | None |
| billing.storage.aws.bucket | string | `""` | See billing.storage.secretRef for authentication. Required if billing.storage.provider=aws. |
| billing.storage.aws.endpoint | string | `""` | None |
| billing.storage.aws.region | string | `""` | Required if billing.storage.provider=aws. |
| billing.storage.aws.tls | object | | None |
| billing.storage.aws.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.aws.tls.alpnProtocols | list | `[]` | None |
| billing.storage.aws.tls.verifyCertificate | bool | `true` | None |
| billing.storage.aws.tls.verifyHostname | bool | `true` | None |
| billing.storage.azure | object |  | None |
| billing.storage.azure.connectionString | string | `""` | None |
| billing.storage.azure.container | string | `""` | Required if billing.storage.provider=azure. |
| billing.storage.azure.endpoint | string | `""` | None |
| billing.storage.azure.storageAccount | string | `""` | None |
| billing.storage.gcp.bucket | string | `""` | Required if billing.storage.provider=gcp. |
| billing.storage.gcp.tls | object |  | See billing.storage.secretRef for authentication. |
| billing.storage.gcp.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.gcp.tls.alpnProtocols | list | `[]` | None |
| billing.storage.gcp.tls.verifyCertificate | bool | `true` | None |
| billing.storage.gcp.tls.verifyHostname | bool | `true` | None |
| billing.storage.name | string | `"billing-storage"` | Required if billing.enabled=true. The secret may contain any of these keys for configuring authentication: <br> AWS_ACCESS_KEY_ID: AWS access key ID. Used when provider is aws. <br> AWS_SECRET_ACCESS_KEY: AWS secret access key. Used when provider is aws. <br> AZURE_TENANT_ID: Azure tenant ID. Used when provider is azure. <br> AZURE_CLIENT_ID: Azure client ID. Used when provider is azure. <br> AZURE_CLIENT_SECRET: Azure client secret. Used when provider is azure. <br> AZURE_USERNAME: Azure username. Used when provider is azure. <br> AZURE_PASSWORD: Azure username. Used when provider is azure. <br> google_application_credentials: GCP service account key JSON. Used when provider is gcp.<br> The secret may also contain any of the following keys for configuring TLS. The corresponding value at billing.storage.<provider>.tls.<key> must also be set to true. <br> "ca.crt": Custom CA certificate. Used when provider is aws or gcp. <br> "tls.crt": Custom TLS certificate. Used when provider is aws or gcp. <br> "tls.key": Custom TLS key. Used when provider is aws or gcp. |
| billing.storage.provider | string | `""` | Required if billing.enabled=true. Must be one of aws, gcp, azure |
| billing.storage.secretRef | string | `nil` | None |
| certificates | object | `{"clusterResourceNamespace":"cert-manager","provision":true,"space":{"clusterIssuer":"spaces-selfsigned"}}` | Given cert-manager is a requirement for installation, certificates specifies the general configurations for the certificates required for the installation to function. |
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources inclused in this chart. Operators can opt to provision their own certificates instead, however care should be made to ensure the certificates match the expected: <br> * Shared Certificate Authority <br> * Algorithm. (ECDSA) |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
| clusterType | string | `"kind"` | Specifies the cluster type that this installation is being installed into.<br> Valid options are: aks, eks, gke, kind. |
| controlPlanes | object |  | Configurations applied consistently across all ControlPlanes. |
| controlPlanes.container | object |  | None |
| controlPlanes.container.mxpAccountGate | object |  | None |
| controlPlanes.container.mxpAccountGate.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpAccountGateInit | object | | None |
| controlPlanes.container.mxpAccountGateInit.repository | string | `"mxp-account-gate/initialize"` | None |
| controlPlanes.container.mxpAccountGateInit.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpAuthzWebhook | object |  | None |
| controlPlanes.container.mxpAuthzWebhook.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpCharts | object |  | None |
| controlPlanes.container.mxpCharts.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpGateway | object |  | None |
| controlPlanes.container.mxpGateway.repository | string | `"mxp-gateway"` | None |
| controlPlanes.container.mxpGateway.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpHealthCheck | object | | None |
| controlPlanes.container.mxpHealthCheck.repository | string | `"mxp-healthcheck"` | None |
| controlPlanes.container.mxpHealthCheck.tag | string | `"0.1.0"` | None |
| controlPlanes.container.mxpKsmConfig | object | | None |
| controlPlanes.container.mxpKsmConfig.tag | string | `"0.1.0"` | None |
| controlPlanes.etcd | object |  | None |
| controlPlanes.etcd.persistence | string | `nil` | None |
| controlPlanes.ingress | object | | None |
| controlPlanes.ingress.annotations | object | `{}` | None |
| controlPlanes.otelcollector | object | | None |
| controlPlanes.otelcollector.enabled | bool | `true` | None |
| controlPlanes.policies | object |  | None |
| controlPlanes.policies.limitRange.enabled | bool | `true` | None |
| controlPlanes.uxp | object | | None |
| controlPlanes.uxp.enableCompositionFunctions | bool | `true` | None |
| controlPlanes.uxp.enableEnvironmentConfigs | bool | `true` | None |
| controlPlanes.uxp.enableProviderIdentity | bool | `false` | None |
| controlPlanes.uxp.metrics | object |  | None |
| controlPlanes.uxp.metrics.enabled | bool | `true` | None |
| controlPlanes.uxp.repository | string | `"https://charts.upbound.io/stable"` | None |
| controlPlanes.uxp.resourcesCrossplane | object | | UXP explicitly sets a few limits. We adjust down to what we've observed that we need. |
| controlPlanes.uxp.resourcesCrossplane.limits | object |  | None |
| controlPlanes.uxp.resourcesCrossplane.limits.cpu | string | `"400m"` | None |
| controlPlanes.uxp.resourcesCrossplane.limits.memory | string | `"500Mi"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests | object |  | None |
| controlPlanes.uxp.resourcesCrossplane.requests.cpu | string | `"370m"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests.memory | string | `"400Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager | object |  | None |
| controlPlanes.uxp.resourcesRBACManager.limits | object | | None |
| controlPlanes.uxp.resourcesRBACManager.limits.cpu | string | `"50m"` | None |
| controlPlanes.uxp.resourcesRBACManager.limits.memory | string | `"300Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests | object |  | None |
| controlPlanes.uxp.resourcesRBACManager.requests.cpu | string | `"25m"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests.memory | string | `"256Mi"` | None |
| controlPlanes.uxp.version | string | `"1.14.5-up.1"` | None |
| controlPlanes.uxp.xfn | object |  | None |
| controlPlanes.uxp.xfn.resources | object |  | None |
| controlPlanes.uxp.xfn.resources.limits | object |  | None |
| controlPlanes.uxp.xfn.resources.limits.cpu | string | `"400m"` | None |
| controlPlanes.uxp.xfn.resources.limits.memory | string | `"500Mi"` | None |
| controlPlanes.uxp.xfn.resources.requests | object |  | None |
| controlPlanes.uxp.xfn.resources.requests.cpu | string | `"370m"` | None |
| controlPlanes.uxp.xfn.resources.requests.memory | string | `"400Mi"` | None |
| controlPlanes.uxp.xgql | object |  | None |
| controlPlanes.uxp.xgql.enabled | string | `"true"` | None |
| controlPlanes.uxp.xgql.replicas | int | `1` | None |
| controlPlanes.uxp.xgql.resources | object |  | None |
| controlPlanes.uxp.xgql.resources.limits | object | | None |
| controlPlanes.uxp.xgql.resources.limits.cpu | string | `"500m"` | None |
| controlPlanes.uxp.xgql.resources.limits.memory | string | `"1Gi"` | None |
| controlPlanes.uxp.xgql.resources.requests | object | | None |
| controlPlanes.uxp.xgql.resources.requests.cpu | string | `"50m"` | None |
| controlPlanes.uxp.xgql.resources.requests.memory | string | `"50Mi"` | None |
| controlPlanes.uxp.xgql.version | string | `"v0.2.0-rc.0.153.g0a1d4ae"` | None |
| controlPlanes.vector | object |  | None |
| controlPlanes.vector.debug | bool | `false` | None |
| controlPlanes.vector.enabled | bool | `true` | None |
| controlPlanes.vector.otelcollector | object | | None |
| controlPlanes.vector.otelcollector.enabled | bool | `true` | None |
| controlPlanes.vector.persistence | object | | None |
| controlPlanes.vector.persistence.enabled | bool | `false` | Set enabled to true to run Vector as a statefulset with each replica backed by a persistent volume and enable disk buffers for selected sinks. When set to false, Vector is run as a deployment with memory buffers. |
| controlPlanes.vector.persistence.size | string | `"1Gi"` | size must be at least the sum of all buffer.maxSize values with overhead for other Vector data. If you define this you should also define all sink buffer.maxSize values. |
| controlPlanes.vector.replicas | int | `1` | None |
| controlPlanes.vector.resources | object |  | None |
| controlPlanes.vector.resources.limits | object | `{}` | None |
| controlPlanes.vector.resources.requests | object |  | None |
| controlPlanes.vector.resources.requests.cpu | string | `"200m"` | None |
| controlPlanes.vector.resources.requests.memory | string | `"256Mi"` | None |
| controlPlanes.vector.sinks.usage | object | | None |
| controlPlanes.vector.sinks.usage.buffer | object | | None |
| controlPlanes.vector.sinks.usage.buffer.maxEvents | string | `"500"` | String containing max number of events to buffer in memory. <br> Relevant when mxp.vector.persistence.enabled=false. |
| controlPlanes.vector.sinks.usage.buffer.maxSize | string | `"268435488"` | String containing max size of disk buffer in bytes. Must fit with other buffer.maxSize values in mxp.vector.persistence.size. <br> Relevant when mxp.vector.persistence.enabled=true. |
| controlPlanes.vector.version | string | `"0.22.1"` | None |
| controlPlanes.velero | object |  | None |
| controlPlanes.velero.chartVersion | string | `"5.2.0"` | None |
| controlPlanes.velero.prometheus | object | | None |
| controlPlanes.velero.prometheus.serviceMonitor | object |  | None |
| controlPlanes.velero.prometheus.serviceMonitor.enabled | bool | `false` | None |
| controlPlanes.velero.resources | object |  | None |
| controlPlanes.velero.resources.limits | object | `{}` | None |
| controlPlanes.velero.resources.requests | object |  | None |
| controlPlanes.velero.resources.requests.cpu | string | `"100m"` | None |
| controlPlanes.velero.resources.requests.memory | string | `"75Mi"` | None |
| controller | object |  | Configurations for the space controller deployment. |
| controller.controller | object | | None |
| controller.controller.extraArgs | list | `[]` | None |
| controller.controller.extraEnv | list | `[]` | None |
| controller.controller.image | object |  | None |
| controller.controller.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.controller.image.repository | string | `"mxe-controller"` | None |
| controller.controller.image.tag | string | `"0.1.0"` | None |
| controller.controller.resources | object |  | None |
| controller.controller.resources.limits | object |  | None |
| controller.controller.resources.limits.cpu | string | `"1000m"` | None |
| controller.controller.resources.limits.memory | string | `"200Mi"` | None |
| controller.controller.resources.requests | object |  | None |
| controller.controller.resources.requests.cpu | string | `"100m"` | None |
| controller.controller.resources.requests.memory | string | `"50Mi"` | None |
| controller.controller.service | object | | None |
| controller.controller.service.metrics | object |  | None |
| controller.controller.service.metrics.port | int | `8085` | None |
| controller.controller.service.webhook | object |  | None |
| controller.controller.service.webhook.port | int | `9443` | None |
| controller.gc | object | | None |
| controller.gc.extraArgs | list | `[]` | None |
| controller.gc.failedJobsHistoryLimit | int | `1` | None |
| controller.gc.image | object |  | None |
| controller.gc.image.repository | string | `"mxe-hostcluster-gc"` | None |
| controller.gc.image.tag | string | `"0.1.0"` | None |
| controller.gc.schedule | string | `"*/15 * * * *"` | None |
| controller.gc.successfulJobsHistoryLimit | int | `0` | None |
| controller.mxeInit | object |  | None |
| controller.mxeInit.image | object | | None |
| controller.mxeInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.mxeInit.image.repository | string | `"mxe-apis"` | None |
| controller.mxeInit.image.tag | string | `"0.1.0"` | None |
| controller.prometheus | object | | None |
| controller.prometheus.podMonitor | object | | None |
| controller.prometheus.podMonitor.enabled | bool | `false` | None |
| controller.prometheus.podMonitor.interval | string | `"30s"` | None |
| controller.secretRefs | object |  | None |
| controller.secretRefs.adminSigning | string | `"cert-admin-signing"` | None |
| controller.secretRefs.ingressCA | string | `"mxe-router-tls"` | None |
| controller.serviceAccount | object |  | None |
| controller.serviceAccount.annotations | object | `{}` | None |
| controller.serviceAccount.create | bool | `true` | None |
| controller.serviceAccount.name | string | `""` | None |
| controller.webhookInit | object |  | None |
| controller.webhookInit.image | object |  | None |
| controller.webhookInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.webhookInit.image.repository | string | `"mxe-controller/initialize"` | None |
| controller.webhookInit.image.tag | string | `"0.1.0"` | None |
| deletionPolicy | string | `"Delete"` | Specifies if the supporting APIs for the Spaces deployment should be handled on a deletion request. Possible options are "Delete" or "Orphan". If "Delete" is specified, on performing a 'helm uninstall', the Crossplane configurations that support the installation will also be deleted along with the resources that make the spaces installation. |
| features.alpha | object | | NOTE: Alpha features are subject to removal or breaking changes without notice, and generally not considered ready for use in production. They have to be optional even if they are enabled. |
| features.alpha.argocdPlugin | object | | None |
| features.alpha.argocdPlugin.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target | object | | None |
| features.alpha.argocdPlugin.target.externalCluster | object | | The secret name and key for the kubeconfig of the external cluster. This is used by the argocd plugin to connect to the external cluster in case ArgoCD does not run in the same cluster as Spaces. If not specified, defaults to in-cluster credentials. |
| features.alpha.argocdPlugin.target.externalCluster.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret | object | | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.key | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.name | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.secretNamespace | string | `"argocd"` | None |
| features.alpha.controlPlaneBackup | object | | None |
| features.alpha.controlPlaneBackup.enabled | bool | `false` | This enables backup and restore of control planes. |
| features.alpha.featuresAnnotation | object || None |
| features.alpha.featuresAnnotation.enabled | bool | `false` | None |
| features.alpha.gitSource | object | | None |
| features.alpha.gitSource.enabled | bool | `true` | None |
| features.alpha.kine | object | | None |
| features.alpha.kine.enabled | bool | `false` | None |
| features.alpha.sharedBackup | object | | None |
| features.alpha.sharedBackup.enabled | bool | `false` | This enables backup and restore of control planes using Shared resources. |
| features.alpha.sharedSecrets | object | | SharedSecrets enables the ability to use the SharedSecrets feature within this space. |
| features.alpha.sharedSecrets.enabled | bool | `false` | None |
| features.alpha.upboundPolicy.enabled | bool | `false` | This enables the SharedUpboundPolicy API within this space. |
| features.beta | object | `{}` | Beta features are on by default, but may be disabled. Beta features are considered to be well tested, and will not be removed completely without being marked deprecated for at least two releases. |
| hostCluster | object | | Configurations applied consistently across all XHostClusters. |
| hostCluster.provider | object | | None |
| hostCluster.provider.helm | object | | None |
| hostCluster.provider.helm.version | string | `"v0.17.0"` | None |
| hostCluster.provider.kubernetes | object || None |
| hostCluster.provider.kubernetes.version | string | `"v0.12.1"` | None |
| hostCluster.uxp | object | | None |
| hostCluster.uxp.metrics | object || None |
| hostCluster.uxp.metrics.enabled | bool | `true` | None |
| hostCluster.uxp.version | string | `"1.14.6-up.1"` | None |
| imagePullSecrets | list | `[{"name":"upbound-pull-secret"}]` | NOTE: only an imagePullSecret of "upbound-pull-secret" is currently supported. |
| ingress | object |  | Configurations for external requests coming into the space. |
| ingress.annotations | object | `{}` | Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
| registry | string | `"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"` | Specifies the registry the containers used in the spaces deployment are served from. |
| router | object | | Configurations for the space router deployment. |
| router.controlPlane | object | | None |
| router.controlPlane.extraArgs | list | `["--service-node","mxe-router","--debug"]` | None |
| router.controlPlane.image | object | | None |
| router.controlPlane.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.controlPlane.image.repository | string | `"mxe-router"` | None |
| router.controlPlane.image.tag | string | `"0.1.0"` | None |
| router.controlPlane.resources | object | | None |
| router.controlPlane.resources.limits | object | | None |
| router.controlPlane.resources.limits.cpu | string | `"1000m"` | None |
| router.controlPlane.resources.limits.memory | string | `"1000Mi"` | None |
| router.controlPlane.resources.requests | object | | None |
| router.controlPlane.resources.requests.cpu | string | `"100m"` | None |
| router.controlPlane.resources.requests.memory | string | `"100Mi"` | None |
| router.controlPlane.service | object | | None |
| router.controlPlane.service.auth | object | | None |
| router.controlPlane.service.auth.port | int | `9000` | None |
| router.controlPlane.service.grpc | object | | None |
| router.controlPlane.service.grpc.port | int | `8081` | None |
| router.controlPlane.service.http | object | | None |
| router.controlPlane.service.http.port | int | `9091` | None |
| router.controlPlane.service.metrics | object | | None |
| router.controlPlane.service.metrics.port | int | `8085` | None |
| router.controlPlane.service.privateHttp | object | | None |
| router.controlPlane.service.privateHttp.port | int | `9092` | None |
| router.hpa | object | | None |
| router.hpa.enabled | bool | `false` | None |
| router.hpa.maxReplicas | int | `5` | None |
| router.hpa.minReplicas | int | `1` | None |
| router.hpa.targetCPUUtilizationPercentage | int | `80` | None |
| router.prometheus | object | | None |
| router.prometheus.podMonitor | object | | None |
| router.prometheus.podMonitor.enabled | bool | `false` | None |
| router.prometheus.podMonitor.interval | string | `"30s"` | None |
| router.proxy | object | | None |
| router.proxy.extraArgs | list | `["--service-node","mxe-router","--service-cluster","mxe-router"]` | None |
| router.proxy.extraEnv | list | `[]` | None |
| router.proxy.image | object | | None |
| router.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.proxy.image.repository | string | `"envoy"` | None |
| router.proxy.image.tag | string | `"v1.26-latest"` | None |
| router.proxy.resources | object | | None |
| router.proxy.resources.limits | object | | None |
| router.proxy.resources.limits.cpu | string | `"1000m"` |  None |
| router.proxy.resources.limits.memory | string | `"200Mi"` | None |
| router.proxy.resources.requests | object | | None |
| router.proxy.resources.requests.cpu | string | `"100m"` | None |
| router.proxy.resources.requests.memory | string | `"50Mi"` | None |
| router.proxy.service | object | | None |
| router.proxy.service.admin | object | | None |
| router.proxy.service.admin.port | int | `9091` | None |
| router.proxy.service.annotations | object | `{}` | None |
| router.proxy.service.http | object | | None |
| router.proxy.service.http.port | int | `8443` | None |
| router.proxy.service.type | string | `"ClusterIP"` | None |
| router.replicaCount | int | `1` | None |
| router.secretRefs | object | | None |
| router.secretRefs.adminValidating | string | `"cert-admin-signing"` | None |
| router.secretRefs.gatewaySigning | string | `"cert-token-signing-gateway"` | None |
| router.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| router.serviceAccount | object | | None |
| router.serviceAccount.annotations | object | `{}` | None |
| router.serviceAccount.create | bool | `true` | None |
| router.serviceAccount.name | string | `""` | None |
| space | object | `{"labels":{}}` | Configurations that are applied consistently across the space. |
| space.labels | object | `{}` | Labels that are applied to all Deployments, Pods, Services, and StatefulSets managed by the Space. |
| version | string | `"0.1.0"` | Overall artifact version that affects xpkgs and related components. |
| xpkg | object | | xpkg repository and tag references. |
| xpkg.mxeCompositionTemplates | object | | None |
| xpkg.mxeCompositionTemplates.repository | string | `"mxe-composition-templates"` | None |
| xpkg.mxeCompositionTemplates.tag | string | `"0.1.0"` | None |
| xpkg.mxeIngress | object | | None |
| xpkg.mxeIngress.repository | string | `"mxe-ingress"` | None |
| xpkg.mxeIngress.tag | string | `"0.1.0"` | None |
| xpkg.mxpControlPlane | object | | None |
| xpkg.mxpControlPlane.repository | string | `"mxp-control-plane"` | None |
| xpkg.mxpControlPlane.tag | string | `"0.1.0"` | None |
| xpkg.mxpHostCluster | object | | None |
| xpkg.mxpHostCluster.repository | string | `"mxp-host-cluster"` | None |
| xpkg.mxpHostCluster.tag | string | `"0.1.0"` | None |
| xpkg.providerHostCluster | object | | None |
| xpkg.providerHostCluster.repository | string | `"provider-host-cluster"` | None |
| xpkg.providerHostCluster.tag | string | `"0.1.0"` | None |
| xpkg.pullPolicy | string | `"IfNotPresent"` | None |


{{< /table >}}

<!-- vale on -->