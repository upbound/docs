---
title: Helm Chart Reference
weight: 200
description: Spaces Helm chart configuration values
---
<!-- vale off -->

This reference provides detailed documentation on the Upbound Space Helm chart. This Helm chart contains configuration values for installation, configuration, and management of an Upbound Space deployment.


{{< table "table table-striped" >}}


# spaces

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1.0](https://img.shields.io/badge/AppVersion-0.1.0-informational?style=flat-square)

A Helm chart for Upbound Spaces

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| "keys for configuring authentication".aws.bucket | string | `""` | See billing.storage.secretRef for authentication. Required if billing.storage.provider=aws. |
| "keys for configuring authentication".aws.endpoint | string | `""` | None |
| "keys for configuring authentication".aws.region | string | `""` | Required if billing.storage.provider=aws. |
| "keys for configuring authentication".aws.tls | object | `{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}` | None |
| "keys for configuring authentication".aws.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| "keys for configuring authentication".aws.tls.alpnProtocols | list | `[]` | None |
| "keys for configuring authentication".aws.tls.verifyCertificate | bool | `true` | None |
| "keys for configuring authentication".aws.tls.verifyHostname | bool | `true` | None |
| "keys for configuring authentication".azure | object | `{"connectionString":"","container":"","endpoint":"","storageAccount":""}` | None |
| "keys for configuring authentication".azure.connectionString | string | `""` | None |
| "keys for configuring authentication".azure.container | string | `""` | Required if billing.storage.provider=azure. |
| "keys for configuring authentication".azure.endpoint | string | `""` | None |
| "keys for configuring authentication".azure.storageAccount | string | `""` | None |
| "keys for configuring authentication".gcp.bucket | string | `""` | Required if billing.storage.provider=gcp. |
| "keys for configuring authentication".gcp.tls | object | `{"alpnProtocols":[],"ca.crt":false,"tls.crt":false,"tls.key":false,"verifyCertificate":true,"verifyHostname":true}` | See billing.storage.secretRef for authentication. |
| "keys for configuring authentication".gcp.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| "keys for configuring authentication".gcp.tls.alpnProtocols | list | `[]` | None |
| "keys for configuring authentication".gcp.tls.verifyCertificate | bool | `true` | None |
| "keys for configuring authentication".gcp.tls.verifyHostname | bool | `true` | None |
| "keys for configuring authentication".name | string | `"billing-storage"` | AWS_ACCESS_KEY_ID: AWS access key ID. Used when provider is aws. \n AWS_SECRET_ACCESS_KEY: AWS secret access key. Used when provider is aws. \n AZURE_TENANT_ID: Azure tenant ID. Used when provider is azure. \n AZURE_CLIENT_ID: Azure client ID. Used when provider is azure. \n AZURE_CLIENT_SECRET: Azure client secret. Used when provider is azure. \n AZURE_USERNAME: Azure username. Used when provider is azure. \n AZURE_PASSWORD: Azure username. Used when provider is azure. \n google_application_credentials: GCP service account key JSON. Used when provider is gcp.\n The secret may also contain any of the following keys for configuring TLS. The corresponding value at billing.storage.<provider>.tls.<key> must also be set to true. \n "ca.crt": Custom CA certificate. Used when provider is aws or gcp. \n "tls.crt": Custom TLS certificate. Used when provider is aws or gcp. \n "tls.key": Custom TLS key. Used when provider is aws or gcp. |
| account | string | `"notdemo"` |  |
| api | object | `{"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"proxy":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-api","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085}}},"secretRefs":{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"},"serviceAccount":{"annotations":{},"create":true,"name":"mxe-api"}}` | Configurations for the space api deployment. |
| api.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| api.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| api.prometheus.podMonitor.enabled | bool | `false` | None |
| api.prometheus.podMonitor.interval | string | `"30s"` | None |
| api.proxy | object | `{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-api","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085}}}` | None |
| api.proxy.extraArgs | list | `[]` | None |
| api.proxy.extraEnv | list | `[]` | None |
| api.proxy.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-api","tag":"1.0.0"}` | None |
| api.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| api.proxy.image.repository | string | `"mxe-api"` | None |
| api.proxy.image.tag | string | `"1.0.0"` | None |
| api.proxy.resources | object | `{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}}` | None |
| api.proxy.resources.limits | object | `{"cpu":"1000m","memory":"200Mi"}` | None |
| api.proxy.resources.limits.cpu | string | `"1000m"` | None |
| api.proxy.resources.limits.memory | string | `"200Mi"` | None |
| api.proxy.resources.requests | object | `{"cpu":"100m","memory":"50Mi"}` | None |
| api.proxy.resources.requests.cpu | string | `"100m"` | None |
| api.proxy.resources.requests.memory | string | `"50Mi"` | None |
| api.proxy.service | object | `{"api":{"port":8443},"metrics":{"port":8085}}` | None |
| api.proxy.service.api | object | `{"port":8443}` | None |
| api.proxy.service.api.port | int | `8443` | None |
| api.proxy.service.metrics | object | `{"port":8085}` | None |
| api.proxy.service.metrics.port | int | `8085` | None |
| api.secretRefs | object | `{"tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"}` | None |
| api.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| api.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| api.serviceAccount | object | `{"annotations":{},"create":true,"name":"mxe-api"}` | None |
| api.serviceAccount.annotations | object | `{}` | None |
| api.serviceAccount.create | bool | `true` | None |
| api.serviceAccount.name | string | `"mxe-api"` | None |
| apollo | object | `{"apiserver":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-apollo","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}},"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"tlsClientSecretName":"mxe-apollo-client-certs","tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"},"serviceAccount":{"annotations":{},"create":true,"name":"mxe-apollo"}}` | Configurations for the space api deployment. |
| apollo.apiserver | object | `{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-apollo","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}},"service":{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}}` | None |
| apollo.apiserver.extraArgs | list | `[]` | None |
| apollo.apiserver.extraEnv | list | `[]` | None |
| apollo.apiserver.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-apollo","tag":"1.0.0"}` | None |
| apollo.apiserver.image.pullPolicy | string | `"IfNotPresent"` | None |
| apollo.apiserver.image.repository | string | `"mxe-apollo"` | None |
| apollo.apiserver.image.tag | string | `"1.0.0"` | None |
| apollo.apiserver.resources | object | `{"limits":{"cpu":"1000m","memory":"500Mi"},"requests":{"cpu":"100m","memory":"200Mi"}}` | None |
| apollo.apiserver.resources.limits | object | `{"cpu":"1000m","memory":"500Mi"}` | None |
| apollo.apiserver.resources.limits.cpu | string | `"1000m"` | None |
| apollo.apiserver.resources.limits.memory | string | `"500Mi"` | None |
| apollo.apiserver.resources.requests | object | `{"cpu":"100m","memory":"200Mi"}` | None |
| apollo.apiserver.resources.requests.cpu | string | `"100m"` | None |
| apollo.apiserver.resources.requests.memory | string | `"200Mi"` | None |
| apollo.apiserver.service | object | `{"api":{"port":8443},"metrics":{"port":8085},"type":"ClusterIP"}` | None |
| apollo.apiserver.service.api | object | `{"port":8443}` | None |
| apollo.apiserver.service.api.port | int | `8443` | None |
| apollo.apiserver.service.metrics | object | `{"port":8085}` | None |
| apollo.apiserver.service.metrics.port | int | `8085` | None |
| apollo.apiserver.service.type | string | `"ClusterIP"` | None |
| apollo.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| apollo.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| apollo.prometheus.podMonitor.enabled | bool | `false` | None |
| apollo.prometheus.podMonitor.interval | string | `"30s"` | None |
| apollo.secretRefs | object | `{"tlsClientSecretName":"mxe-apollo-client-certs","tlsSecretName":"mxp-hostcluster-certs","tokenSigning":"cert-token-signing-gateway"}` | None |
| apollo.secretRefs.tlsClientSecretName | string | `"mxe-apollo-client-certs"` | None |
| apollo.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| apollo.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| apollo.serviceAccount | object | `{"annotations":{},"create":true,"name":"mxe-apollo"}` | None |
| apollo.serviceAccount.annotations | object | `{}` | None |
| apollo.serviceAccount.create | bool | `true` | None |
| apollo.serviceAccount.name | string | `"mxe-apollo"` | None |
| billing | object | `{"enabled":false,"storage":{"provider":"","secretRef":null}}` | Configurations for space billing. |
| billing.enabled | bool | `false` | None |
| billing.storage | object | `{"provider":"","secretRef":null}` | None |
| billing.storage.provider | string | `""` | Required if billing.enabled=true. Must be one of aws, gcp, azure |
| billing.storage.secretRef | string | `nil` | None |
| certificates | object | `{"clusterResourceNamespace":"cert-manager","provision":true,"space":{"clusterIssuer":"spaces-selfsigned"}}` | Given cert-manager is a requirement for installation, certificates specifies the general configurations for the certificates required for the installation to function. |
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources inclused in this chart. Operators can opt to provision their own certificates instead, however care should be made to ensure the certificates match the expected: \n * Shared Certificate Authority \n * Algorithm. (ECDSA) |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
| clusterType | string | `"kind"` | Specifies the cluster type that this installation is being installed into.\n Valid options are: aks, eks, gke, kind. |
| controlPlanes | object | `{"container":{"mxpAccountGate":{"tag":"1.0.0"},"mxpAccountGateInit":{"repository":"mxp-account-gate/initialize","tag":"1.0.0"},"mxpAuthzWebhook":{"tag":"1.0.0"},"mxpCharts":{"tag":"1.0.0"},"mxpGateway":{"repository":"mxp-gateway","tag":"1.0.0"},"mxpHealthCheck":{"repository":"mxp-healthcheck","tag":"1.0.0"},"mxpKsmConfig":{"tag":"1.0.0"}},"etcd":{"persistence":null},"ingress":{"annotations":{}},"otelcollector":{"enabled":true},"policies":{"limitRange":{"enabled":true}},"uxp":{"enableCompositionFunctions":true,"enableEnvironmentConfigs":true,"enableProviderIdentity":false,"metrics":{"enabled":true},"repository":"https://charts.upbound.io/stable","resourcesCrossplane":{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}},"resourcesRBACManager":{"limits":{"cpu":"50m","memory":"300Mi"},"requests":{"cpu":"25m","memory":"256Mi"}},"version":"1.14.5-up.1","xfn":{"resources":{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}}},"xgql":{"enabled":"true","replicas":1,"resources":{"limits":{"cpu":"500m","memory":"1Gi"},"requests":{"cpu":"50m","memory":"50Mi"}},"version":"v0.2.0-rc.0.153.g0a1d4ae"}},"vector":{"debug":false,"enabled":true,"otelcollector":{"enabled":true},"persistence":{"enabled":false,"size":"1Gi"},"replicas":1,"resources":{"limits":{},"requests":{"cpu":"200m","memory":"256Mi"}},"sinks":{"usage":{"buffer":{"maxEvents":"500","maxSize":"268435488"}}},"version":"0.22.1"},"velero":{"chartVersion":"5.2.0","prometheus":{"serviceMonitor":{"enabled":false}},"resources":{"limits":{},"requests":{"cpu":"100m","memory":"75Mi"}}}}` | Configurations applied consistently across all ControlPlanes. |
| controlPlanes.container | object | `{"mxpAccountGate":{"tag":"1.0.0"},"mxpAccountGateInit":{"repository":"mxp-account-gate/initialize","tag":"1.0.0"},"mxpAuthzWebhook":{"tag":"1.0.0"},"mxpCharts":{"tag":"1.0.0"},"mxpGateway":{"repository":"mxp-gateway","tag":"1.0.0"},"mxpHealthCheck":{"repository":"mxp-healthcheck","tag":"1.0.0"},"mxpKsmConfig":{"tag":"1.0.0"}}` | None |
| controlPlanes.container.mxpAccountGate | object | `{"tag":"1.0.0"}` | None |
| controlPlanes.container.mxpAccountGate.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpAccountGateInit | object | `{"repository":"mxp-account-gate/initialize","tag":"1.0.0"}` | None |
| controlPlanes.container.mxpAccountGateInit.repository | string | `"mxp-account-gate/initialize"` | None |
| controlPlanes.container.mxpAccountGateInit.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpAuthzWebhook | object | `{"tag":"1.0.0"}` | None |
| controlPlanes.container.mxpAuthzWebhook.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpCharts | object | `{"tag":"1.0.0"}` | None |
| controlPlanes.container.mxpCharts.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpGateway | object | `{"repository":"mxp-gateway","tag":"1.0.0"}` | None |
| controlPlanes.container.mxpGateway.repository | string | `"mxp-gateway"` | None |
| controlPlanes.container.mxpGateway.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpHealthCheck | object | `{"repository":"mxp-healthcheck","tag":"1.0.0"}` | None |
| controlPlanes.container.mxpHealthCheck.repository | string | `"mxp-healthcheck"` | None |
| controlPlanes.container.mxpHealthCheck.tag | string | `"1.0.0"` | None |
| controlPlanes.container.mxpKsmConfig | object | `{"tag":"1.0.0"}` | None |
| controlPlanes.container.mxpKsmConfig.tag | string | `"1.0.0"` | None |
| controlPlanes.etcd | object | `{"persistence":null}` | None |
| controlPlanes.etcd.persistence | string | `nil` | None |
| controlPlanes.ingress | object | `{"annotations":{}}` | None |
| controlPlanes.ingress.annotations | object | `{}` | None |
| controlPlanes.otelcollector | object | `{"enabled":true}` | None |
| controlPlanes.otelcollector.enabled | bool | `true` | None |
| controlPlanes.policies | object | `{"limitRange":{"enabled":true}}` | None |
| controlPlanes.policies.limitRange | object | `{"enabled":true}` | None |
| controlPlanes.policies.limitRange.enabled | bool | `true` | None |
| controlPlanes.uxp | object | `{"enableCompositionFunctions":true,"enableEnvironmentConfigs":true,"enableProviderIdentity":false,"metrics":{"enabled":true},"repository":"https://charts.upbound.io/stable","resourcesCrossplane":{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}},"resourcesRBACManager":{"limits":{"cpu":"50m","memory":"300Mi"},"requests":{"cpu":"25m","memory":"256Mi"}},"version":"1.14.5-up.1","xfn":{"resources":{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}}},"xgql":{"enabled":"true","replicas":1,"resources":{"limits":{"cpu":"500m","memory":"1Gi"},"requests":{"cpu":"50m","memory":"50Mi"}},"version":"v0.2.0-rc.0.153.g0a1d4ae"}}` | None |
| controlPlanes.uxp.enableCompositionFunctions | bool | `true` | None |
| controlPlanes.uxp.enableEnvironmentConfigs | bool | `true` | None |
| controlPlanes.uxp.enableProviderIdentity | bool | `false` | None |
| controlPlanes.uxp.metrics | object | `{"enabled":true}` | None |
| controlPlanes.uxp.metrics.enabled | bool | `true` | None |
| controlPlanes.uxp.repository | string | `"https://charts.upbound.io/stable"` | None |
| controlPlanes.uxp.resourcesCrossplane | object | `{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}}` | UXP explicitly sets a few limits. We adjust down to what we've observed that we need. |
| controlPlanes.uxp.resourcesCrossplane.limits | object | `{"cpu":"400m","memory":"500Mi"}` | None |
| controlPlanes.uxp.resourcesCrossplane.limits.cpu | string | `"400m"` | None |
| controlPlanes.uxp.resourcesCrossplane.limits.memory | string | `"500Mi"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests | object | `{"cpu":"370m","memory":"400Mi"}` | None |
| controlPlanes.uxp.resourcesCrossplane.requests.cpu | string | `"370m"` | None |
| controlPlanes.uxp.resourcesCrossplane.requests.memory | string | `"400Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager | object | `{"limits":{"cpu":"50m","memory":"300Mi"},"requests":{"cpu":"25m","memory":"256Mi"}}` | None |
| controlPlanes.uxp.resourcesRBACManager.limits | object | `{"cpu":"50m","memory":"300Mi"}` | None |
| controlPlanes.uxp.resourcesRBACManager.limits.cpu | string | `"50m"` | None |
| controlPlanes.uxp.resourcesRBACManager.limits.memory | string | `"300Mi"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests | object | `{"cpu":"25m","memory":"256Mi"}` | None |
| controlPlanes.uxp.resourcesRBACManager.requests.cpu | string | `"25m"` | None |
| controlPlanes.uxp.resourcesRBACManager.requests.memory | string | `"256Mi"` | None |
| controlPlanes.uxp.version | string | `"1.14.5-up.1"` | None |
| controlPlanes.uxp.xfn | object | `{"resources":{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}}}` | None |
| controlPlanes.uxp.xfn.resources | object | `{"limits":{"cpu":"400m","memory":"500Mi"},"requests":{"cpu":"370m","memory":"400Mi"}}` | None |
| controlPlanes.uxp.xfn.resources.limits | object | `{"cpu":"400m","memory":"500Mi"}` | None |
| controlPlanes.uxp.xfn.resources.limits.cpu | string | `"400m"` | None |
| controlPlanes.uxp.xfn.resources.limits.memory | string | `"500Mi"` | None |
| controlPlanes.uxp.xfn.resources.requests | object | `{"cpu":"370m","memory":"400Mi"}` | None |
| controlPlanes.uxp.xfn.resources.requests.cpu | string | `"370m"` | None |
| controlPlanes.uxp.xfn.resources.requests.memory | string | `"400Mi"` | None |
| controlPlanes.uxp.xgql | object | `{"enabled":"true","replicas":1,"resources":{"limits":{"cpu":"500m","memory":"1Gi"},"requests":{"cpu":"50m","memory":"50Mi"}},"version":"v0.2.0-rc.0.153.g0a1d4ae"}` | None |
| controlPlanes.uxp.xgql.enabled | string | `"true"` | None |
| controlPlanes.uxp.xgql.replicas | int | `1` | None |
| controlPlanes.uxp.xgql.resources | object | `{"limits":{"cpu":"500m","memory":"1Gi"},"requests":{"cpu":"50m","memory":"50Mi"}}` | None |
| controlPlanes.uxp.xgql.resources.limits | object | `{"cpu":"500m","memory":"1Gi"}` | None |
| controlPlanes.uxp.xgql.resources.limits.cpu | string | `"500m"` | None |
| controlPlanes.uxp.xgql.resources.limits.memory | string | `"1Gi"` | None |
| controlPlanes.uxp.xgql.resources.requests | object | `{"cpu":"50m","memory":"50Mi"}` | None |
| controlPlanes.uxp.xgql.resources.requests.cpu | string | `"50m"` | None |
| controlPlanes.uxp.xgql.resources.requests.memory | string | `"50Mi"` | None |
| controlPlanes.uxp.xgql.version | string | `"v0.2.0-rc.0.153.g0a1d4ae"` | None |
| controlPlanes.vector | object | `{"debug":false,"enabled":true,"otelcollector":{"enabled":true},"persistence":{"enabled":false,"size":"1Gi"},"replicas":1,"resources":{"limits":{},"requests":{"cpu":"200m","memory":"256Mi"}},"sinks":{"usage":{"buffer":{"maxEvents":"500","maxSize":"268435488"}}},"version":"0.22.1"}` | None |
| controlPlanes.vector.debug | bool | `false` | None |
| controlPlanes.vector.enabled | bool | `true` | None |
| controlPlanes.vector.otelcollector | object | `{"enabled":true}` | None |
| controlPlanes.vector.otelcollector.enabled | bool | `true` | None |
| controlPlanes.vector.persistence | object | `{"enabled":false,"size":"1Gi"}` | None |
| controlPlanes.vector.persistence.enabled | bool | `false` | Set enabled to true to run Vector as a statefulset with each replica backed by a persistent volume and enable disk buffers for selected sinks. When set to false, Vector is run as a deployment with memory buffers. |
| controlPlanes.vector.persistence.size | string | `"1Gi"` | size must be at least the sum of all buffer.maxSize values with overhead for other Vector data. If you define this you should also define all sink buffer.maxSize values. |
| controlPlanes.vector.replicas | int | `1` | None |
| controlPlanes.vector.resources | object | `{"limits":{},"requests":{"cpu":"200m","memory":"256Mi"}}` | None |
| controlPlanes.vector.resources.limits | object | `{}` | None |
| controlPlanes.vector.resources.requests | object | `{"cpu":"200m","memory":"256Mi"}` | None |
| controlPlanes.vector.resources.requests.cpu | string | `"200m"` | None |
| controlPlanes.vector.resources.requests.memory | string | `"256Mi"` | None |
| controlPlanes.vector.sinks.usage | object | `{"buffer":{"maxEvents":"500","maxSize":"268435488"}}` | None |
| controlPlanes.vector.sinks.usage.buffer | object | `{"maxEvents":"500","maxSize":"268435488"}` | None |
| controlPlanes.vector.sinks.usage.buffer.maxEvents | string | `"500"` | String containing max number of events to buffer in memory. \n Relevant when mxp.vector.persistence.enabled=false. |
| controlPlanes.vector.sinks.usage.buffer.maxSize | string | `"268435488"` | String containing max size of disk buffer in bytes. Must fit with other buffer.maxSize values in mxp.vector.persistence.size. \n Relevant when mxp.vector.persistence.enabled=true. |
| controlPlanes.vector.version | string | `"0.22.1"` | None |
| controlPlanes.velero | object | `{"chartVersion":"5.2.0","prometheus":{"serviceMonitor":{"enabled":false}},"resources":{"limits":{},"requests":{"cpu":"100m","memory":"75Mi"}}}` | None |
| controlPlanes.velero.chartVersion | string | `"5.2.0"` | None |
| controlPlanes.velero.prometheus | object | `{"serviceMonitor":{"enabled":false}}` | None |
| controlPlanes.velero.prometheus.serviceMonitor | object | `{"enabled":false}` | None |
| controlPlanes.velero.prometheus.serviceMonitor.enabled | bool | `false` | None |
| controlPlanes.velero.resources | object | `{"limits":{},"requests":{"cpu":"100m","memory":"75Mi"}}` | None |
| controlPlanes.velero.resources.limits | object | `{}` | None |
| controlPlanes.velero.resources.requests | object | `{"cpu":"100m","memory":"75Mi"}` | None |
| controlPlanes.velero.resources.requests.cpu | string | `"100m"` | None |
| controlPlanes.velero.resources.requests.memory | string | `"75Mi"` | None |
| controller | object | `{"controller":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}},"gc":{"extraArgs":[],"failedJobsHistoryLimit":1,"image":{"repository":"mxe-hostcluster-gc","tag":"1.0.0"},"schedule":"*/15 * * * *","successfulJobsHistoryLimit":0},"mxeInit":{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-apis","tag":"1.0.0"}},"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"secretRefs":{"adminSigning":"cert-admin-signing","ingressCA":"mxe-router-tls"},"serviceAccount":{"annotations":{},"create":true,"name":""},"webhookInit":{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller/initialize","tag":"1.0.0"}}}` | Configurations for the space controller deployment. |
| controller.controller | object | `{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}}` | None |
| controller.controller.extraArgs | list | `[]` | None |
| controller.controller.extraEnv | list | `[]` | None |
| controller.controller.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-controller","tag":"1.0.0"}` | None |
| controller.controller.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.controller.image.repository | string | `"mxe-controller"` | None |
| controller.controller.image.tag | string | `"1.0.0"` | None |
| controller.controller.resources | object | `{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}}` | None |
| controller.controller.resources.limits | object | `{"cpu":"1000m","memory":"200Mi"}` | None |
| controller.controller.resources.limits.cpu | string | `"1000m"` | None |
| controller.controller.resources.limits.memory | string | `"200Mi"` | None |
| controller.controller.resources.requests | object | `{"cpu":"100m","memory":"50Mi"}` | None |
| controller.controller.resources.requests.cpu | string | `"100m"` | None |
| controller.controller.resources.requests.memory | string | `"50Mi"` | None |
| controller.controller.service | object | `{"metrics":{"port":8085},"webhook":{"port":9443}}` | None |
| controller.controller.service.metrics | object | `{"port":8085}` | None |
| controller.controller.service.metrics.port | int | `8085` | None |
| controller.controller.service.webhook | object | `{"port":9443}` | None |
| controller.controller.service.webhook.port | int | `9443` | None |
| controller.gc | object | `{"extraArgs":[],"failedJobsHistoryLimit":1,"image":{"repository":"mxe-hostcluster-gc","tag":"1.0.0"},"schedule":"*/15 * * * *","successfulJobsHistoryLimit":0}` | None |
| controller.gc.extraArgs | list | `[]` | None |
| controller.gc.failedJobsHistoryLimit | int | `1` | None |
| controller.gc.image | object | `{"repository":"mxe-hostcluster-gc","tag":"1.0.0"}` | None |
| controller.gc.image.repository | string | `"mxe-hostcluster-gc"` | None |
| controller.gc.image.tag | string | `"1.0.0"` | None |
| controller.gc.schedule | string | `"*/15 * * * *"` | None |
| controller.gc.successfulJobsHistoryLimit | int | `0` | None |
| controller.mxeInit | object | `{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-apis","tag":"1.0.0"}}` | None |
| controller.mxeInit.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-apis","tag":"1.0.0"}` | None |
| controller.mxeInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.mxeInit.image.repository | string | `"mxe-apis"` | None |
| controller.mxeInit.image.tag | string | `"1.0.0"` | None |
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
| controller.webhookInit | object | `{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller/initialize","tag":"1.0.0"}}` | None |
| controller.webhookInit.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-controller/initialize","tag":"1.0.0"}` | None |
| controller.webhookInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.webhookInit.image.repository | string | `"mxe-controller/initialize"` | None |
| controller.webhookInit.image.tag | string | `"1.0.0"` | None |
| deletionPolicy | string | `"Delete"` | Specifies if the supporting APIs for the Spaces deployment should be handled on a deletion request. Possible options are "Delete" or "Orphan". If "Delete" is specified, on performing a 'helm uninstall', the Crossplane configurations that support the installation will also be deleted along with the resources that make the spaces installation. |
| features.alpha | object | `{"argocdPlugin":{"enabled":false,"target":{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}},"controlPlaneBackup":{"enabled":false},"featuresAnnotation":{"enabled":false},"gitSource":{"enabled":true},"kine":{"enabled":false},"sharedBackup":{"enabled":false},"sharedSecrets":{"enabled":false},"upboundPolicy":{"enabled":false}}` | NOTE: Alpha features are subject to removal or breaking changes without notice, and generally not considered ready for use in production. They have to be optional even if they are enabled. |
| features.alpha.argocdPlugin | object | `{"enabled":false,"target":{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}}` | None |
| features.alpha.argocdPlugin.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target | object | `{"externalCluster":{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}},"secretNamespace":"argocd"}` | None |
| features.alpha.argocdPlugin.target.externalCluster | object | `{"enabled":false,"secret":{"key":"kubeconfig","name":"kubeconfig"}}` | The secret name and key for the kubeconfig of the external cluster. This is used by the argocd plugin to connect to the external cluster in case ArgoCD does not run in the same cluster as Spaces. If not specified, defaults to in-cluster credentials. |
| features.alpha.argocdPlugin.target.externalCluster.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret | object | `{"key":"kubeconfig","name":"kubeconfig"}` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.key | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.name | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.secretNamespace | string | `"argocd"` | None |
| features.alpha.controlPlaneBackup | object | `{"enabled":false}` | None |
| features.alpha.controlPlaneBackup.enabled | bool | `false` | This enables backup and restore of control planes. |
| features.alpha.featuresAnnotation | object | `{"enabled":false}` | None |
| features.alpha.featuresAnnotation.enabled | bool | `false` | None |
| features.alpha.gitSource | object | `{"enabled":true}` | None |
| features.alpha.gitSource.enabled | bool | `true` | None |
| features.alpha.kine | object | `{"enabled":false}` | None |
| features.alpha.kine.enabled | bool | `false` | None |
| features.alpha.sharedBackup | object | `{"enabled":false}` | None |
| features.alpha.sharedBackup.enabled | bool | `false` | This enables backup and restore of control planes using Shared resources. |
| features.alpha.sharedSecrets | object | `{"enabled":false}` | SharedSecrets enables the ability to use the SharedSecrets feature within this space. |
| features.alpha.sharedSecrets.enabled | bool | `false` | None |
| features.alpha.upboundPolicy.enabled | bool | `false` | This enables the SharedUpboundPolicy API within this space. |
| features.beta | object | `{}` | Beta features are on by default, but may be disabled here. Beta features are considered to be well tested, and will not be removed completely without being marked deprecated for at least two releases. |
| hostCluster | object | `{"provider":{"helm":{"version":"v0.17.0"},"kubernetes":{"version":"v0.12.1"}},"uxp":{"metrics":{"enabled":true},"version":"1.14.6-up.1"}}` | Configurations applied consistently across all XHostClusters. |
| hostCluster.provider | object | `{"helm":{"version":"v0.17.0"},"kubernetes":{"version":"v0.12.1"}}` | None |
| hostCluster.provider.helm | object | `{"version":"v0.17.0"}` | None |
| hostCluster.provider.helm.version | string | `"v0.17.0"` | None |
| hostCluster.provider.kubernetes | object | `{"version":"v0.12.1"}` | None |
| hostCluster.provider.kubernetes.version | string | `"v0.12.1"` | None |
| hostCluster.uxp | object | `{"metrics":{"enabled":true},"version":"1.14.6-up.1"}` | None |
| hostCluster.uxp.metrics | object | `{"enabled":true}` | None |
| hostCluster.uxp.metrics.enabled | bool | `true` | None |
| hostCluster.uxp.version | string | `"1.14.6-up.1"` | None |
| imagePullSecrets | list | `[{"name":"upbound-pull-secret"}]` | NOTE: only an imagePullSecret of "upbound-pull-secret" is currently supported. |
| ingress | object | `{"annotations":{},"host":"proxy.upbound-127.0.0.1.nip.io","provision":true}` | Configurations for external requests coming into the space. |
| ingress.annotations | object | `{}` | Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
| registry | string | `"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"` | Specifies the registry where the containers used in the spaces deployment are served from. |
| router | object | `{"controlPlane":{"extraArgs":["--service-node","mxe-router","--debug"],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-router","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}},"hpa":{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80},"oidc":[],"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"proxy":{"extraArgs":["--service-node","mxe-router","--service-cluster","mxe-router"],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"admin":{"port":9091},"annotations":{},"http":{"port":8443},"type":"ClusterIP"}},"replicaCount":1,"secretRefs":{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","tlsSecretName":"mxp-hostcluster-certs"},"serviceAccount":{"annotations":{},"create":true,"name":""}}` | Configurations for the space router deployment. |
| router.controlPlane | object | `{"extraArgs":["--service-node","mxe-router","--debug"],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-router","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}}` | None |
| router.controlPlane.extraArgs | list | `["--service-node","mxe-router","--debug"]` | None |
| router.controlPlane.image | object | `{"pullPolicy":"IfNotPresent","repository":"mxe-router","tag":"1.0.0"}` | None |
| router.controlPlane.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.controlPlane.image.repository | string | `"mxe-router"` | None |
| router.controlPlane.image.tag | string | `"1.0.0"` | None |
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
| router.hpa | object | `{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80}` | None |
| router.hpa.enabled | bool | `false` | None |
| router.hpa.maxReplicas | int | `5` | None |
| router.hpa.minReplicas | int | `1` | None |
| router.hpa.targetCPUUtilizationPercentage | int | `80` | None |
| router.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | None |
| router.prometheus.podMonitor | object | `{"enabled":false,"interval":"30s"}` | None |
| router.prometheus.podMonitor.enabled | bool | `false` | None |
| router.prometheus.podMonitor.interval | string | `"30s"` | None |
| router.proxy | object | `{"extraArgs":["--service-node","mxe-router","--service-cluster","mxe-router"],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"admin":{"port":9091},"annotations":{},"http":{"port":8443},"type":"ClusterIP"}}` | None |
| router.proxy.extraArgs | list | `["--service-node","mxe-router","--service-cluster","mxe-router"]` | None |
| router.proxy.extraEnv | list | `[]` | None |
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
| router.proxy.service | object | `{"admin":{"port":9091},"annotations":{},"http":{"port":8443},"type":"ClusterIP"}` | None |
| router.proxy.service.admin | object | `{"port":9091}` | None |
| router.proxy.service.admin.port | int | `9091` | None |
| router.proxy.service.annotations | object | `{}` | None |
| router.proxy.service.http | object | `{"port":8443}` | None |
| router.proxy.service.http.port | int | `8443` | None |
| router.proxy.service.type | string | `"ClusterIP"` | None |
| router.replicaCount | int | `1` | None |
| router.secretRefs | object | `{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","tlsSecretName":"mxp-hostcluster-certs"}` | None |
| router.secretRefs.adminValidating | string | `"cert-admin-signing"` | None |
| router.secretRefs.gatewaySigning | string | `"cert-token-signing-gateway"` | None |
| router.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| router.serviceAccount | object | `{"annotations":{},"create":true,"name":""}` | None |
| router.serviceAccount.annotations | object | `{}` | None |
| router.serviceAccount.create | bool | `true` | None |
| router.serviceAccount.name | string | `""` | None |
| space | object | `{"labels":{}}` | Configurations that are applied consistently across the space. |
| space.labels | object | `{}` | Labels that are applied to all Deployments, Pods, Services, and StatefulSets managed by the Space. |
| version | string | `"1.0.0"` | Overall artifact version that affects xpkgs and related components. |
| xpkg | object | `{"mxeCompositionTemplates":{"repository":"mxe-composition-templates","tag":"1.0.0"},"mxeIngress":{"repository":"mxe-ingress","tag":"1.0.0"},"mxpControlPlane":{"repository":"mxp-control-plane","tag":"1.0.0"},"mxpHostCluster":{"repository":"mxp-host-cluster","tag":"1.0.0"},"providerHostCluster":{"repository":"provider-host-cluster","tag":"1.0.0"},"pullPolicy":"IfNotPresent"}` | xpkg repository and tag references. |
| xpkg.mxeCompositionTemplates | object | `{"repository":"mxe-composition-templates","tag":"1.0.0"}` | None |
| xpkg.mxeCompositionTemplates.repository | string | `"mxe-composition-templates"` | None |
| xpkg.mxeCompositionTemplates.tag | string | `"1.0.0"` | None |
| xpkg.mxeIngress | object | `{"repository":"mxe-ingress","tag":"1.0.0"}` | None |
| xpkg.mxeIngress.repository | string | `"mxe-ingress"` | None |
| xpkg.mxeIngress.tag | string | `"1.0.0"` | None |
| xpkg.mxpControlPlane | object | `{"repository":"mxp-control-plane","tag":"1.0.0"}` | None |
| xpkg.mxpControlPlane.repository | string | `"mxp-control-plane"` | None |
| xpkg.mxpControlPlane.tag | string | `"1.0.0"` | None |
| xpkg.mxpHostCluster | object | `{"repository":"mxp-host-cluster","tag":"1.0.0"}` | None |
| xpkg.mxpHostCluster.repository | string | `"mxp-host-cluster"` | None |
| xpkg.mxpHostCluster.tag | string | `"1.0.0"` | None |
| xpkg.providerHostCluster | object | `{"repository":"provider-host-cluster","tag":"1.0.0"}` | None |
| xpkg.providerHostCluster.repository | string | `"provider-host-cluster"` | None |
| xpkg.providerHostCluster.tag | string | `"1.0.0"` | None |
| xpkg.pullPolicy | string | `"IfNotPresent"` | None |



{{< /table >}}

<!-- vale on -->