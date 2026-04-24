---
title: UXP Helm Chart Reference
sidebar_position: 20
description: UXP Helm chart configuration values
mdx:
    format: md
---

<!-- vale off -->

This reference provides detailed documentation on the UXP Helm chart. This Helm chart contains configuration values for installation, configuration, and management of UXP.

## Values

<div class="helm-table">

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Add `affinities` to the Crossplane pod deployment. |
| args | list | `["--enable-operations","--package-runtime=External"]` | Add custom arguments to the Crossplane pod. |
| configuration.packages | list | `[]` | A list of Configuration packages to install. |
| customAnnotations | object | `{}` | Add custom `annotations` to the Crossplane pod deployment. |
| customLabels | object | `{}` | Add custom `labels` to the Crossplane pod deployment. |
| deploymentStrategy | string | `"RollingUpdate"` | The deployment strategy for the Crossplane and RBAC Manager pods. |
| dnsPolicy | string | `""` | Specify the `dnsPolicy` to be used by the Crossplane pod. |
| extraEnvVarsCrossplane | object | `{}` | Add custom environmental variables to the Crossplane pod deployment application container. Replaces any `.` in a variable name with `_`. For example, `SAMPLE.KEY=value1` becomes `SAMPLE_KEY=value1`. |
| extraEnvVarsCrossplaneInit | object | `{}` | Add custom environmental variables to the Crossplane pod deployment init container. Replaces any `.` in a variable name with `_`. For example, `SAMPLE.KEY=value1` becomes `SAMPLE_KEY=value1`. |
| extraEnvVarsRBACManager | object | `{}` | Add custom environmental variables to the RBAC Manager pod deployment. Replaces any `.` in a variable name with `_`. For example, `SAMPLE.KEY=value1` becomes `SAMPLE_KEY=value1`. |
| extraObjects | list | `[]` | To add arbitrary Kubernetes Objects during a Helm Install |
| extraVolumeMountsCrossplane | object | `{}` | Add custom `volumeMounts` to the Crossplane pod. Supports template expressions. |
| extraVolumesCrossplane | object | `{}` | Add custom `volumes` to the Crossplane pod. Supports template expressions. |
| function.packages | list | `[]` | A list of Function packages to install |
| functionCache.medium | string | `""` | Set to `Memory` to hold the function cache in a RAM backed file system. Useful for Crossplane development. |
| functionCache.pvc | string | `""` | The name of a PersistentVolumeClaim to use as the function cache. Disables the default function cache `emptyDir` Volume. |
| functionCache.sizeLimit | string | `"512Mi"` | The size limit for the function cache. If medium is `Memory` the `sizeLimit` can't exceed Node memory. |
| hostNetwork | bool | `false` | Enable `hostNetwork` for the Crossplane deployment. Caution: enabling `hostNetwork` grants the Crossplane Pod access to the host network namespace. Consider setting `dnsPolicy` to `ClusterFirstWithHostNet`. |
| image.ignoreTag | bool | `false` | Do not use the {{ .image.tag }} value to compute the image uri. |
| image.pullPolicy | string | `"IfNotPresent"` | The image pull policy used for Crossplane and RBAC Manager pods. |
| image.repository | string | `"xpkg.upbound.io/upbound/crossplane"` | Repository for the Crossplane pod image. |
| image.tag | string | `"v2.2.0-up.1"` | The Crossplane image tag. Defaults to the value of `appVersion` in `Chart.yaml`. |
| imagePullSecrets | list | `[]` | The imagePullSecret names to add to the Crossplane ServiceAccount. |
| leaderElection | bool | `true` | Enable [leader election](https://docs.crossplane.io/latest/guides/pods/#leader-election) for the Crossplane pod. |
| metrics.enabled | bool | `true` | Enable Prometheus path, port and scrape annotations and expose port 8080 for both the Crossplane and RBAC Manager pods. |
| metrics.port | string | `""` | The port the metrics server listens on. |
| nodeSelector | object | `{}` | Add `nodeSelectors` to the Crossplane pod deployment. |
| packageCache.configMap | string | `""` | The name of a ConfigMap to use as the package cache. Disables the default package cache `emptyDir` Volume. |
| packageCache.medium | string | `""` | Set to `Memory` to hold the package cache in a RAM backed file system. Useful for Crossplane development. |
| packageCache.pvc | string | `""` | The name of a PersistentVolumeClaim to use as the package cache. Disables the default package cache `emptyDir` Volume. |
| packageCache.sizeLimit | string | `"20Mi"` | The size limit for the package cache. If medium is `Memory` the `sizeLimit` can't exceed Node memory. |
| podSecurityContextCrossplane | object | `{}` | Add a custom `securityContext` to the Crossplane pod. |
| podSecurityContextRBACManager | object | `{}` | Add a custom `securityContext` to the RBAC Manager pod. |
| priorityClassName | string | `""` | The PriorityClass name to apply to the Crossplane and RBAC Manager pods. |
| provider.defaultActivations | list | `["*"]` | Define entries for the default managed resource activation policy. If defined, a default MRAP will contain these activations. |
| provider.packages | list | `[]` | A list of Provider packages to install. |
| rbac.clusterAdmin | bool | `false` |  |
| rbacManager.affinity | object | `{}` | Add `affinities` to the RBAC Manager pod deployment. |
| rbacManager.args | list | `[]` | Add custom arguments to the RBAC Manager pod. |
| rbacManager.deploy | bool | `true` | Deploy the RBAC Manager pod and its required roles. |
| rbacManager.leaderElection | bool | `true` | Enable [leader election](https://docs.crossplane.io/latest/guides/pods/#leader-election) for the RBAC Manager pod. |
| rbacManager.nodeSelector | object | `{}` | Add `nodeSelectors` to the RBAC Manager pod deployment. |
| rbacManager.replicas | int | `1` | The number of RBAC Manager pod `replicas` to deploy. |
| rbacManager.revisionHistoryLimit | string | `nil` | The number of RBAC Manager ReplicaSets to retain. |
| rbacManager.skipAggregatedClusterRoles | bool | `false` | Don't install aggregated Crossplane ClusterRoles. |
| rbacManager.tolerations | list | `[]` | Add `tolerations` to the RBAC Manager pod deployment. |
| rbacManager.topologySpreadConstraints | list | `[]` | Add `topologySpreadConstraints` to the RBAC Manager pod deployment. |
| readiness.port | string | `""` | The port the readyz server listens on. |
| registryCaBundleConfig.key | string | `""` | The ConfigMap key containing a custom CA bundle to enable fetching packages from registries with unknown or untrusted certificates. |
| registryCaBundleConfig.name | string | `""` | The ConfigMap name containing a custom CA bundle to enable fetching packages from registries with unknown or untrusted certificates. |
| replicas | int | `1` | The number of Crossplane pod `replicas` to deploy. |
| resourcesCrossplane.limits.cpu | string | `"500m"` | CPU resource limits for the Crossplane pod. |
| resourcesCrossplane.limits.memory | string | `"1024Mi"` | Memory resource limits for the Crossplane pod. |
| resourcesCrossplane.requests.cpu | string | `"100m"` | CPU resource requests for the Crossplane pod. |
| resourcesCrossplane.requests.memory | string | `"256Mi"` | Memory resource requests for the Crossplane pod. |
| resourcesRBACManager.limits.cpu | string | `"100m"` | CPU resource limits for the RBAC Manager pod. |
| resourcesRBACManager.limits.memory | string | `"512Mi"` | Memory resource limits for the RBAC Manager pod. |
| resourcesRBACManager.requests.cpu | string | `"100m"` | CPU resource requests for the RBAC Manager pod. |
| resourcesRBACManager.requests.memory | string | `"256Mi"` | Memory resource requests for the RBAC Manager pod. |
| revisionHistoryLimit | string | `nil` | The number of Crossplane ReplicaSets to retain. |
| runtimeClassName | string | `""` | The runtimeClassName name to apply to the Crossplane and RBAC Manager pods. |
| secrets.customAnnotations | object | `{}` | Add custom annotations to Crossplane Secret resources. |
| securityContextCrossplane.allowPrivilegeEscalation | bool | `false` | Enable `allowPrivilegeEscalation` for the Crossplane pod. |
| securityContextCrossplane.readOnlyRootFilesystem | bool | `true` | Set the Crossplane pod root file system as read-only. |
| securityContextCrossplane.runAsGroup | int | `65532` | The group ID used by the Crossplane pod. |
| securityContextCrossplane.runAsUser | int | `65532` | The user ID used by the Crossplane pod. |
| securityContextRBACManager.allowPrivilegeEscalation | bool | `false` | Enable `allowPrivilegeEscalation` for the RBAC Manager pod. |
| securityContextRBACManager.readOnlyRootFilesystem | bool | `true` | Set the RBAC Manager pod root file system as read-only. |
| securityContextRBACManager.runAsGroup | int | `65532` | The group ID used by the RBAC Manager pod. |
| securityContextRBACManager.runAsUser | int | `65532` | The user ID used by the RBAC Manager pod. |
| service.customAnnotations | object | `{}` | Configure annotations on the service object. Only enabled when webhooks.enabled = true |
| serviceAccount.create | bool | `true` | Specifies whether Crossplane ServiceAccount should be created |
| serviceAccount.customAnnotations | object | `{}` | Add custom `annotations` to the Crossplane ServiceAccount. |
| serviceAccount.name | string | `""` | Provide the name of an already created Crossplane ServiceAccount. Required when `serviceAccount.create` is `false` |
| sidecarsCrossplane | list | `[]` | Add sidecar containers to the Crossplane pod. Supports template expressions. |
| tolerations | list | `[]` | Add `tolerations` to the Crossplane pod deployment. |
| topologySpreadConstraints | list | `[]` | Add `topologySpreadConstraints` to the Crossplane pod deployment. |
| upbound.init.extraEnvVars | object | `{}` |  |
| upbound.manager.affinity | object | `{}` | Add `affinities` to the Upbound Controller Manager pod deployment. |
| upbound.manager.args | list | `[]` | Add custom arguments to the Upbound Controller Manager pod. |
| upbound.manager.backupCache.medium | string | `""` | Set to `Memory` to hold the backup cache in a RAM backed file system. |
| upbound.manager.backupCache.sizeLimit | string | `"20Mi"` | The size limit for the backup cache. If medium is `Memory` the `sizeLimit` can't exceed Node memory. |
| upbound.manager.customAnnotations | object | `{}` | Add custom `annotations` to the Upbound Controller Manager pod deployment. |
| upbound.manager.deploymentStrategy | string | `"RollingUpdate"` | The deployment strategy for the Upbound Controller Manager pod. |
| upbound.manager.dnsPolicy | string | `""` | Specify the `dnsPolicy` to be used by the Upbound Controller Manager pod. |
| upbound.manager.extraEnvVars | object | `{}` | Add custom environmental variables to the Upbound Controller Manager pod deployment. Replaces any `.` in a variable name with `_`. For example, `SAMPLE.KEY=value1` becomes `SAMPLE_KEY=value1`. |
| upbound.manager.extraVolumeMounts | object | `{}` | Add custom `volumeMounts` to the Upbound Controller Manager pod. |
| upbound.manager.extraVolumes | object | `{}` | Add custom `volumes` to the Upbound Controller Manager pod. |
| upbound.manager.image.pullPolicy | string | `"IfNotPresent"` | The Upbound Controller Manager image pull policy used for Crossplane and RBAC Manager pods. |
| upbound.manager.image.repository | string | `"xpkg.upbound.io/upbound/controller-manager"` | Repository for the Upbound Controller Manager pod image. |
| upbound.manager.image.tag | string | `""` | The Upbound Controller Manager image tag. Defaults to the value of `appVersion` in `Chart.yaml`. |
| upbound.manager.imagePullSecrets | list | `[]` | The imagePullSecret names to add to the Upbound Controller Manager ServiceAccount. |
| upbound.manager.leaderElection | bool | `true` | Enable [leader election](https://docs.crossplane.io/latest/guides/pods/#leader-election) for the Upbound Controller Manager pod. |
| upbound.manager.measurement.enabled | bool | `true` | Enable the measurement server. |
| upbound.manager.measurement.port | string | `""` | The port the measurement server listens on. |
| upbound.manager.metering | object | `{"affinity":{},"args":[],"customAnnotations":{},"dnsPolicy":"","extraEnvVars":{},"extraVolumeMounts":[],"extraVolumes":[],"image":{"pullPolicy":"IfNotPresent","repository":"xpkg.upbound.io/upbound/controller-manager","tag":""},"imagePullSecrets":[],"meteringStorage":{"accessMode":"ReadWriteOnce","enabled":false,"size":"10Gi","storageClass":""},"nodeSelector":{},"podAnnotations":{},"podLabels":{},"podSecurityContext":{},"ports":[],"priorityClassName":"","resources":{"limits":{"cpu":"500m","memory":"1024Mi"},"requests":{"cpu":"50m","memory":"128Mi"}},"securityContext":{},"startupProbe":{},"tolerations":[],"topologySpreadConstraints":[]}` | Configuration for the UXP metering StatefulSet deployed by the licensing controller. |
| upbound.manager.metering.affinity | object | `{}` | Add `affinities` to the metering StatefulSet pods. |
| upbound.manager.metering.args | list | `[]` | Add custom arguments to the Upbound Metering pod. |
| upbound.manager.metering.customAnnotations | object | `{}` | Add custom `annotations` to the metering StatefulSet. |
| upbound.manager.metering.dnsPolicy | string | `""` | Specify the `dnsPolicy` to be used by the metering pod. |
| upbound.manager.metering.extraEnvVars | object | `{}` | Add custom environmental variables to the metering pod. Replaces any `.` in a variable name with `_`. For example, `SAMPLE.KEY=value1` becomes `SAMPLE_KEY=value1`. |
| upbound.manager.metering.extraVolumeMounts | list | `[]` | Add custom `volumeMounts` to the metering pod. |
| upbound.manager.metering.extraVolumes | list | `[]` | Add custom `volumes` to the metering pod. |
| upbound.manager.metering.image | object | `{"pullPolicy":"IfNotPresent","repository":"xpkg.upbound.io/upbound/controller-manager","tag":""}` | Container image for the metering StatefulSet. |
| upbound.manager.metering.image.pullPolicy | string | `"IfNotPresent"` | The Upbound Metering image pull policy. |
| upbound.manager.metering.image.repository | string | `"xpkg.upbound.io/upbound/controller-manager"` | Repository for the Upbound Metering pod image. |
| upbound.manager.metering.image.tag | string | `""` | The metering container image tag. Defaults to the value of `appVersion` in `Chart.yaml`. |
| upbound.manager.metering.imagePullSecrets | list | `[]` | The imagePullSecret names to add to the metering StatefulSet. |
| upbound.manager.metering.meteringStorage.accessMode | string | `"ReadWriteOnce"` | Access mode for the PersistentVolume. |
| upbound.manager.metering.meteringStorage.enabled | bool | `false` | Enable persistent storage for usage metering data. |
| upbound.manager.metering.meteringStorage.size | string | `"10Gi"` | Size of the PersistentVolume for metering data. |
| upbound.manager.metering.meteringStorage.storageClass | string | `""` | Storage class for the PersistentVolume. If not specified, uses the default storage class. |
| upbound.manager.metering.nodeSelector | object | `{}` | Add `nodeSelectors` to the metering StatefulSet pods. |
| upbound.manager.metering.podAnnotations | object | `{}` | Add custom annotations to the metering StatefulSet pods. |
| upbound.manager.metering.podLabels | object | `{}` | Add custom labels to the metering StatefulSet pods. |
| upbound.manager.metering.podSecurityContext | object | `{}` | Add a custom `securityContext` to the metering StatefulSet pod. |
| upbound.manager.metering.ports | list | `[]` | Configure ports for the metering container. |
| upbound.manager.metering.priorityClassName | string | `""` | The PriorityClass name to apply to the metering pod. |
| upbound.manager.metering.resources | object | `{"limits":{"cpu":"500m","memory":"1024Mi"},"requests":{"cpu":"50m","memory":"128Mi"}}` | Resource requirements for the metering container. |
| upbound.manager.metering.resources.limits.cpu | string | `"500m"` | CPU resource limits for the metering container. |
| upbound.manager.metering.resources.limits.memory | string | `"1024Mi"` | Memory resource limits for the metering container. |
| upbound.manager.metering.resources.requests.cpu | string | `"50m"` | CPU resource requests for the metering container. |
| upbound.manager.metering.resources.requests.memory | string | `"128Mi"` | Memory resource requests for the metering container. |
| upbound.manager.metering.securityContext | object | `{}` | Add a custom `securityContext` to the metering container. |
| upbound.manager.metering.startupProbe | object | `{}` | Configure startup probe for the metering container. |
| upbound.manager.metering.tolerations | list | `[]` | Add `tolerations` to the metering StatefulSet pods. |
| upbound.manager.metering.topologySpreadConstraints | list | `[]` | Add `topologySpreadConstraints` to the metering pod. |
| upbound.manager.metrics.enabled | bool | `false` | Enable Prometheus path, port and scrape annotations and expose port 8080 for the Upbound Controller Manager pod. |
| upbound.manager.metrics.port | string | `""` | The port the metrics server listens on. |
| upbound.manager.nodeSelector | object | `{}` | Add `nodeSelectors` to the Upbound Controller Manager pod deployment. |
| upbound.manager.packageCache.medium | string | `""` | Set to `Memory` to hold the package cache in a RAM backed file system. Useful for Crossplane development. |
| upbound.manager.packageCache.sizeLimit | string | `"20Mi"` | The size limit for the package cache. If medium is `Memory` the `sizeLimit` can't exceed Node memory. |
| upbound.manager.podSecurityContext | object | `{}` | Add a custom `securityContext` to the Upbound Controller Manager pod. |
| upbound.manager.priorityClassName | string | `""` | The PriorityClass name to apply to the Upbound Controller Manager pod. |
| upbound.manager.prometheus | object | `{"disabled":false,"image":{"repository":"quay.io/prometheus/prometheus","tag":"v3.2.1"},"metricAllowlist":"controller_runtime_reconcile_total|upjet_resource_external_api_calls_total|function_run_function_seconds_.+","queryTimeout":"2m","resources":{"limits":{"cpu":"500m","memory":"512Mi"},"requests":{"cpu":"50m","memory":"256Mi"}},"retention":"12h","storage":{"accessMode":"ReadWriteOnce","size":"5Gi","storageClass":""}}` | Configuration for the UXP Prometheus instance deployed used for the webui metric dashboards. |
| upbound.manager.prometheus.disabled | bool | `false` | Set to true to disable the Prometheus deployment entirely. |
| upbound.manager.prometheus.image.repository | string | `"quay.io/prometheus/prometheus"` | Repository for the Prometheus image. |
| upbound.manager.prometheus.image.tag | string | `"v3.2.1"` | The Prometheus image tag. |
| upbound.manager.prometheus.metricAllowlist | string | `"controller_runtime_reconcile_total|upjet_resource_external_api_calls_total|function_run_function_seconds_.+"` | Regex allowlist for metrics to keep. Only matching metric names are ingested; everything else is dropped at scrape time. |
| upbound.manager.prometheus.queryTimeout | string | `"2m"` | Prometheus query timeout. |
| upbound.manager.prometheus.resources.limits.cpu | string | `"500m"` | CPU resource limits for Prometheus. |
| upbound.manager.prometheus.resources.limits.memory | string | `"512Mi"` | Memory resource limits for Prometheus. |
| upbound.manager.prometheus.resources.requests.cpu | string | `"50m"` | CPU resource requests for Prometheus. |
| upbound.manager.prometheus.resources.requests.memory | string | `"256Mi"` | Memory resource requests for Prometheus. |
| upbound.manager.prometheus.retention | string | `"12h"` | Prometheus data retention period. |
| upbound.manager.prometheus.storage.accessMode | string | `"ReadWriteOnce"` | Access mode for the PersistentVolume. |
| upbound.manager.prometheus.storage.size | string | `"5Gi"` | Size of the PersistentVolume for Prometheus data. |
| upbound.manager.prometheus.storage.storageClass | string | `""` | Storage class for the PersistentVolume. If not specified, uses the default storage class. |
| upbound.manager.readiness.port | string | `""` | The port the readyz server listens on. |
| upbound.manager.replicas | int | `1` | The number of Upbound Controller Manager pod `replicas` to deploy. |
| upbound.manager.resources.limits.cpu | string | `"500m"` | CPU resource limits for the Upbound Controller Manager pod. |
| upbound.manager.resources.limits.memory | string | `"512Mi"` | Memory resource limits for the Upbound Controller Manager pod. |
| upbound.manager.resources.requests.cpu | string | `"50m"` | CPU resource requests for the Upbound Controller Manager pod. |
| upbound.manager.resources.requests.memory | string | `"128Mi"` | Memory resource requests for the Upbound Controller Manager pod. |
| upbound.manager.revisionHistoryLimit | string | `nil` | The number of Upbound Controller Manager ReplicaSets to retain. |
| upbound.manager.securityContext.allowPrivilegeEscalation | bool | `false` | Enable `allowPrivilegeEscalation` for the Upbound Controller Manager pod. |
| upbound.manager.securityContext.readOnlyRootFilesystem | bool | `true` | Set the Upbound Controller Manager pod root file system as read-only. |
| upbound.manager.securityContext.runAsGroup | int | `65532` | The group ID used by the Upbound Controller Manager pod. |
| upbound.manager.securityContext.runAsUser | int | `65532` | The user ID used by the Upbound Controller Manager pod. |
| upbound.manager.tolerations | list | `[]` | Add `tolerations` to the Upbound Controller Manager pod deployment. |
| upbound.manager.topologySpreadConstraints | list | `[]` | Add `topologySpreadConstraints` to the Upbound Controller Manager pod deployment. |
| upbound.secretsProxy.apiServerSecretSuffixes | string | `"-tls-client,-tls-server,-root-ca"` | Comma-separated list of suffixes. Secrets with names containing any of these suffixes will be sent directly to the API server instead of the secrets proxy. |
| upbound.secretsProxy.caSecretName | string | `"secrets-proxy-ca"` | Name of the CA secret to create. |
| upbound.secretsProxy.certSecretName | string | `"secrets-proxy-certs"` | Name of the certificate secret to create. |
| upbound.secretsProxy.enabled | bool | `false` | Enable secrets proxy CA initialization and webhook. |
| upbound.secretsProxy.webhook.additionalNamespaces | list | `[]` | Additional namespaces where the webhook should inject sidecars. The release namespace is always included. |
| upbound.secretsProxy.webhook.failurePolicy | string | `"Fail"` | Failure policy for the webhook (Ignore or Fail). |
| upbound.secretsProxy.webhook.timeoutSeconds | int | `10` | Timeout in seconds for the webhook. |
| upbound.secretsProxy.webhookSecretName | string | `"secrets-proxy-webhook-tls"` | Name of the webhook certificate secret to create. |
| upbound.secretsProxy.webhookServiceName | string | `"secrets-proxy-webhook"` | Name of the webhook service. |
| upbound.security.fips.enabled | bool | `false` | Disable FIPS strict mode by default. |
| upbound.telemetry.disabled | bool | `false` | Disable telemetry. |
| webhooks.enabled | bool | `true` | Enable webhooks for Crossplane and installed Provider packages. |
| webhooks.port | string | `""` | The port the webhook server listens on. |
| webui.config.metricsApiEndpoint | string | `"http://uxp-prometheus.crossplane-system.svc.cluster.local:9090/api/v1"` | The Prometheus API endpoint used by the Web UI for metrics. Override this when using an external Prometheus instance and disable the built-in Prometheus (`upbound.manager.prometheus.disabled: true`). |
| webui.enabled | bool | `true` | Enable the UXP Web UI and Apollo subcharts. |


</div>

<!-- vale on -->

<!-- end-table-no -->

