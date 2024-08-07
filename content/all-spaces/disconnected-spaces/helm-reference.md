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
| api.serviceAccount.annotations | object | `{}` | None |
| api.serviceAccount.create | bool | `true` | None |
| api.serviceAccount.name | string | `"mxe-api"` | None |
| apollo.apiserver.extraArgs | list | `[]` | None |
| apollo.apiserver.extraEnv | list | `[]` | None |
| apollo.apiserver.image.pullPolicy | string | `"IfNotPresent"` | None |
| apollo.apiserver.image.repository | string | `"hyperspace"` | None |
| apollo.apiserver.image.tag | string | `""` | None |
| apollo.apiserver.resources.limits.cpu | string | `"1000m"` | None |
| apollo.apiserver.resources.limits.memory | string | `"500Mi"` | None |
| apollo.apiserver.resources.requests.cpu | string | `"100m"` | None |
| apollo.apiserver.resources.requests.memory | string | `"200Mi"` | None |
| apollo.apiserver.service.api.port | int | `8443` |  |
| apollo.apiserver.service.metrics.port | int | `8085` | None |
| apollo.apiserver.service.type | string | `"ClusterIP"` | None |
| apollo.prometheus.podMonitor.enabled | bool | `false` | None |
| apollo.prometheus.podMonitor.interval | string | `"30s"` | None |
| apollo.secretRefs.tlsClientSecretName | string | `"mxe-apollo-client-certs"` | None |
| apollo.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| apollo.secretRefs.tokenSigning | string | `"cert-token-signing-gateway"` | None |
| apollo.serviceAccount.annotations | object | `{}` | None |
| apollo.serviceAccount.create | bool | `true` | None |
| apollo.serviceAccount.name | string | `"mxe-apollo"` | None |
| authentication.hubIdentities | bool | `true` | This enables respecting built in Kubernetes identities (clientcertificate, managed kubernetes OIDC, Kubernetes Groups, etc) specified within the Connected Space's hub. |
| authentication.structuredConfig | string | `"name-of-configmap"` | Enables consumption of JWT Authenticators via Authentication Configuration per https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-authentication-configuration <br> The below property takes the name of a configmap that contains a structured authentication configuration. |
| authorization.hubRBAC | bool | `true` | This enables respecting built in Kubernetes Roles and RoleBindings for the resources included in the Space's installation. |
| billing.enabled | bool | `false` | None |
| billing.storage.aws.bucket | string | `""` | See billing.storage.secretRef for authentication. <br> Required if billing.storage.provider=aws. |
| billing.storage.aws.endpoint | string | `""` | None |
| billing.storage.aws.region | string | `""` | Required if billing.storage.provider=aws. |
| billing.storage.aws.tls."ca.crt" | bool | `false` | See billing.storage.secretRef.<br> Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.aws.tls."tls.crt" | bool | `false` | None |
| billing.storage.aws.tls."tls.key" | bool | `false` | None |
| billing.storage.aws.tls.alpnProtocols | list | `[]` | None |
| billing.storage.aws.tls.verifyCertificate | bool | `true` | None |
| billing.storage.aws.tls.verifyHostname | bool | `true` | None |
| billing.storage.azure.connectionString | string | `""` | None |
| billing.storage.azure.container | string | `""` | See billing.storage.secretRef for authentication.<br> Required if billing.storage.provider=azure. |
| billing.storage.azure.endpoint | string | `""` | None |
| billing.storage.azure.storageAccount | string | `""` | None |
| billing.storage.gcp.bucket | string | `""` | Required if billing.storage.provider=gcp. |
| billing.storage.gcp.tls."ca.crt" | bool | `false` | See billing.storage.secretRef. <br> Set to true if the corresponding key is defined in the secret referenced by billing.storage.secretRef.name. |
| billing.storage.gcp.tls."tls.crt" | bool | `false` | None |
| billing.storage.gcp.tls."tls.key" | bool | `false` | None |
| billing.storage.gcp.tls.alpnProtocols | list | `[]` | None |
| billing.storage.gcp.tls.verifyCertificate | bool | `true` | None |
| billing.storage.gcp.tls.verifyHostname | bool | `true` | None |
| billing.storage.provider | string | `""` | Required if billing.enabled=true. Must be one of aws, gcp, azure |
| billing.storage.secretRef.name | string | `"billing-storage"` | Required if billing.enabled=true. The secret may contain any of these keys for configuring authentication: <br> AWS_ACCESS_KEY_ID: AWS access key ID. Used when provider is aws. <br> AWS_SECRET_ACCESS_KEY: AWS secret access key. Used when provider is aws. <br> AZURE_TENANT_ID: Azure tenant ID. Used when provider is azure. <br> AZURE_CLIENT_ID: Azure client ID. Used when provider is azure. <br> AZURE_CLIENT_SECRET: Azure client secret. Used when provider is azure. <br> AZURE_USERNAME: Azure username. Used when provider is azure. <br> AZURE_PASSWORD: Azure username. Used when provider is azure. <br> google_application_credentials: GCP service account key JSON. Used when provider is gcp. <br> The secret may also contain any of the following keys for configuring  TLS. The corresponding value at billing.storage.<provider>.tls.<key> must also be set to true. <br> "ca.crt": Custom CA certificate. Used when provider is aws or gcp. <br> "tls.crt": Custom TLS certificate. Used when provider is aws or gcp. <br> "tls.key": Custom TLS key. Used when provider is aws or gcp. <br> |
| certificates.clusterResourceNamespace | string | `"cert-manager"` | Specifies the cluster resource namespace for the cert-manager installation. <br> https://cert-manager.io/docs/configuration/#cluster-resource-namespace |
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources included in this chart. Operators can opt to provision their own certificates instead, however care should be made to ensure the certificates match the expected: <br> * Shared Certificate Authority <br> * Algorithm. (ECDSA) |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
| clusterType | string | `"kind"` | Specifies the cluster type that this installation is being installed into. Valid options are: aks, eks, gke, kind. |
| controlPlanes.container.mxpAuthzWebhook.tag | string | `""` | None |
| controlPlanes.container.mxpCharts.tag | string | `""` | None |
| controlPlanes.container.mxpGateway.repository | string | `"hyperspace"` | None |
| controlPlanes.container.mxpGateway.tag | string | `""` | None |
| controlPlanes.container.mxpHealthCheck.repository | string | `"hyperspace"` | None |
| controlPlanes.container.mxpHealthCheck.tag | string | `""` | None |
| controlPlanes.container.mxpKsmConfig.repository | string | `"hyperspace"` | None |
| controlPlanes.container.mxpKsmConfig.tag | string | `""` | None |
| controlPlanes.etcd.persistence.size | string | `"5Gi"` | Set storage class backing the vcluster etcd PVCs <br> storageClassName: "" |
| controlPlanes.ingress.annotations | object | `{}` | None |
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
| controlPlanes.uxp.xgql.enabled | string | `"true"` | None |
| controlPlanes.uxp.xgql.replicas | int | `1` | None |
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
| controlPlanes.vector.resources.requests.cpu | string | `"200m"` | None |
| controlPlanes.vector.resources.requests.memory | string | `"256Mi"` | None |
| controlPlanes.vector.sinks.usage.buffer.maxEvents | string | `"500"` | String containing max number of events to buffer in memory. <br> Relevant when mxp.vector.persistence.enabled=false. |
| controlPlanes.vector.sinks.usage.buffer.maxSize | string | `"268435488"` | String containing max size of disk buffer in bytes. Must fit with other buffer.maxSize values in mxp.vector.persistence.size. <br> Relevant when mxp.vector.persistence.enabled=true. <br> ~256 MiB, minimum allowed |
| controlPlanes.vector.version | string | `"0.22.1"` | None |
| controller.controller.extraArgs | list | `[]` | None |
| controller.controller.extraEnv | list | `[]` | None |
| controller.controller.extraVolumeMounts | list | `[]` | None |
| controller.controller.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.controller.image.repository | string | `"hyperspace"` | None |
| controller.controller.image.tag | string | `""` | None |
| controller.controller.resources.limits.cpu | string | `"1000m"` | None |
| controller.controller.resources.limits.memory | string | `"1000Mi"` | None |
| controller.controller.resources.requests.cpu | string | `"100m"` | None |
| controller.controller.resources.requests.memory | string | `"500Mi"` | None |
| controller.controller.service.metrics.port | int | `8085` | None |
| controller.controller.service.webhook.port | int | `9443` | None |
| controller.crossplane.supportedVersions | list | `["1.14.1-up.1","1.14.2-up.1","1.14.3-up.1","1.14.4-up.1","1.14.5-up.1","1.14.6-up.1","1.14.7-up.1","1.14.8-up.1","1.14.9-up.1","1.15.0-up.1","1.15.1-up.1","1.15.2-up.1","1.15.3-up.1","1.16.0-up.1"]` | None |
| controller.crossplane.versionsController.enabled | bool | `true` | This flag enables the versionsController. When set to true, the controller will manage Crossplane versions configmap. If disabled, default behavior will be supportedVersions will applied without automatic updates. |
| controller.extraVolumes | list | `[]` | None |
| controller.kcp.enabled | bool | `false` | None |
| controller.kcp.frontProxy.replicas | int | `1` | None |
| controller.kcp.replicas | int | `1` | None |
| controller.kcp.storageClass | string | `"standard"` | None |
| controller.mxeInit.extraArgs | list | `[]` | None |
| controller.mxeInit.extraEnv | list | `[]` | None |
| controller.mxeInit.extraVolumeMounts | list | `[]` | None |
| controller.mxeInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.mxeInit.image.repository | string | `"hyperspace"` | None |
| controller.mxeInit.image.tag | string | `""` | None |
| controller.prometheus.podMonitor.enabled | bool | `false` | None |
| controller.prometheus.podMonitor.interval | string | `"30s"` | None |
| controller.secretRefs.adminSigning | string | `"cert-admin-signing"` | None |
| controller.secretRefs.ingressCA | string | `"mxe-router-tls"` | None |
| controller.serviceAccount.annotations | object | `{}` | None |
| controller.serviceAccount.create | bool | `true` | None |
| controller.serviceAccount.name | string | `""` | None |
| controller.webhookInit.extraArgs | list | `[]` | None |
| controller.webhookInit.extraEnv | list | `[]` | None |
| controller.webhookInit.extraVolumeMounts | list | `[]` | None |
| controller.webhookInit.image.pullPolicy | string | `"IfNotPresent"` | None |
| controller.webhookInit.image.repository | string | `"hyperspace"` | None |
| controller.webhookInit.image.tag | string | `""` | None |
| deletionPolicy | string | `"Delete"` | Specifies if the supporting APIs for the Spaces deployment should be handled on a deletion request. Possible options are "Delete" or "Orphan". If "Delete" is specified, on performing a 'helm uninstall', the Crossplane configurations that support the installation will also be deleted along with the resources that make the spaces installation. |
| features.alpha.argocdPlugin.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target.externalCluster.enabled | bool | `false` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.key | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.externalCluster.secret.name | string | `"kubeconfig"` | None |
| features.alpha.argocdPlugin.target.secretNamespace | string | `"argocd"` | None |
| features.alpha.featuresAnnotation.enabled | bool | `false` | None |
| features.alpha.gitSource.enabled | bool | `true` | None |
| features.alpha.kine.accountSchema.enabled | bool | `false` | This configures kine to store its data in a separate schema for each account, and configures apollo to query it. If disabled, kine will store all data in the public schema. |
| features.alpha.kine.enabled | bool | `false` | None |
| features.alpha.observability.enabled | bool | `false` | This enables the observability feature within this space.<br> Enabling observability requires OpenTelemetry Operator for Kubernetes to be installed in the cluster. See https://opentelemetry.io/docs/kubernetes/operator/ |
| features.alpha.sharedBackup.enabled | bool | `false` | This enables backup and restore of control planes using Shared resources. |
| features.alpha.sharedSecrets.enabled | bool | `false` | None |
| features.alpha.upboundPolicy.enabled | bool | `false` | This enables the SharedUpboundPolicy API within this space. |
| features.alpha.upboundRBAC.enabled | bool | `false` | This enables respecting Upbound Authorization management within the space. This will include new APIs for binding Objects to identities supplied by Upbound. |
| features.beta | object | `{}` | Beta features are on by default, but may be disabled here. Beta features are considered to be well tested, and will not be removed completely without being marked deprecated for at least two releases. |
| hostCluster.provider.helm.version | string | `"v0.19.0"` | None |
| hostCluster.provider.kubernetes.version | string | `"v0.14.0"` | None |
| hostCluster.uxp.version | string | `"1.15.3-up.1"` | None |
| ingress.annotations | object | `{}` | Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
| observability.collectors.repository | string | `"opentelemetry-collector-spaces"` | None |
| observability.collectors.resources.limits.cpu | string | `"100m"` | None |
| observability.collectors.resources.limits.memory | string | `"1Gi"` | None |
| observability.collectors.resources.requests.cpu | string | `"10m"` | None |
| observability.collectors.resources.requests.memory | string | `"100Mi"` | None |
| observability.collectors.tag | string | `""` | None |
| observability.spacesCollector.config.exportPipeline.logs | list | `["debug"]` | None |
| observability.spacesCollector.config.exportPipeline.metrics | list | `["debug"]` | None |
| observability.spacesCollector.config.exporters.debug | string | `nil` | None |
| observability.spacesCollector.repository | string | `"opentelemetry-collector-spaces"` | None |
| observability.spacesCollector.resources.limits.cpu | int | `100` | None |
| observability.spacesCollector.resources.limits.memory | string | `"1Gi"` | None |
| observability.spacesCollector.resources.requests.cpu | string | `"10m"` | None |
| observability.spacesCollector.resources.requests.memory | string | `"100Mi"` | None |
| observability.spacesCollector.tag | string | `""` | None |
| registry | string | `"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"` | Specifies the registry where the containers used in the spaces deployment are served from. |
| router.controlPlane.extraArgs | list | `[]` | None |
| router.controlPlane.extraEnv | list | `[]` | None |
| router.controlPlane.extraVolumeMounts | list | `[]` | None |
| router.controlPlane.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.controlPlane.image.repository | string | `"hyperspace"` | None |
| router.controlPlane.image.tag | string | `""` | None |
| router.controlPlane.resources.limits.cpu | string | `"1000m"` | None |
| router.controlPlane.resources.limits.memory | string | `"1000Mi"` | None |
| router.controlPlane.resources.requests.cpu | string | `"100m"` | None |
| router.controlPlane.resources.requests.memory | string | `"100Mi"` | None |
| router.controlPlane.service.auth.port | int | `9000` | None |
| router.controlPlane.service.grpc.port | int | `8081` | None |
| router.controlPlane.service.http.port | int | `9091` | None |
| router.controlPlane.service.metrics.port | int | `8085` | None |
| router.controlPlane.service.privateHttp.port | int | `9092` | None |
| router.extraVolumes | list | `[]` | None |
| router.hpa.enabled | bool | `false` | None |
| router.hpa.maxReplicas | int | `5` | None |
| router.hpa.minReplicas | int | `1` | None |
| router.hpa.targetCPUUtilizationPercentage | int | `80` | None |
| router.prometheus.podMonitor.enabled | bool | `false` | None |
| router.prometheus.podMonitor.interval | string | `"30s"` | None |
| router.proxy.extraArgs | list | `[]` | None |
| router.proxy.extraEnv | list | `[]` | None |
| router.proxy.extraVolumeMounts | list | `[]` | None |
| router.proxy.image.pullPolicy | string | `"IfNotPresent"` | None |
| router.proxy.image.repository | string | `"envoy"` | None |
| router.proxy.image.tag | string | `"v1.26-latest"` | None |
| router.proxy.resources.limits.cpu | string | `"1000m"` | None |
| router.proxy.resources.limits.memory | string | `"200Mi"` | None |
| router.proxy.resources.requests.cpu | string | `"100m"` | None |
| router.proxy.resources.requests.memory | string | `"50Mi"` | None |
| router.proxy.service.admin.port | int | `9091` | None |
| router.proxy.service.annotations | object | `{}` | None |
| router.proxy.service.http.port | int | `8443` | None |
| router.proxy.service.type | string | `"ClusterIP"` | None |
| router.replicaCount | int | `1` | None |
| router.secretRefs.adminValidating | string | `"cert-admin-signing"` | None |
| router.secretRefs.gatewaySigning | string | `"cert-token-signing-gateway"` | None |
| router.secretRefs.oidcCABundle | string | `""` | The ca.crt key of this Secret will be mounted into the spaces-router |
| router.secretRefs.tlsSecretName | string | `"mxp-hostcluster-certs"` | None |
| router.serviceAccount.annotations | object | `{}` | None |
| router.serviceAccount.create | bool | `true` | None |
| router.serviceAccount.name | string | `""` | None |
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