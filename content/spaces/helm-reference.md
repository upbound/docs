---
title: Helm Chart Reference
weight: 200
description: Spaces Helm chart configuration values
---
<!-- vale off -->

This reference provides detailed documentation on the Upbound Space Helm chart. This Helm chart contains configuration values for installation, configuration, and management of an Upbound Space deployment.


{{< table "table table-striped" >}}


![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1.0](https://img.shields.io/badge/AppVersion-0.1.0-informational?style=flat-square)

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| certificates | object | `{"clusterResourceNamespace":"cert-manager","provision":true,"space":{"clusterIssuer":"spaces-selfsigned"}}` | Certificates configuration |
| certificates.clusterResourceNamespace | string | `"cert-manager"` | Specifies the cluster resource namespace for the cert-manager installation. |
| certificates.provision | bool | `true` | Specifies if the chart should provision the certificate resources included in this chart. |
| certificates.space.clusterIssuer | string | `"spaces-selfsigned"` | The clusterIssuer for the space. Most certificates used at the space level are derived from this issuer. |
| controller | object | `{"controller":{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}},"gc":{"extraArgs":[],"failedJobsHistoryLimit":1,"image":{"repository":"mxe-hostcluster-gc","tag":"1.0.0"},"schedule":"*/15 * * * *","successfulJobsHistoryLimit":0},"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"serviceAccount":{"annotations":{},"create":true,"name":""},"webhookInit":{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller/initialize","tag":"1.0.0"}}}` | Controller configuration |
| controller.controller | object | `{"extraArgs":[],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"metrics":{"port":8085},"webhook":{"port":9443}}}` | Controller specific configuration |
| controller.gc | object | `{"extraArgs":[],"failedJobsHistoryLimit":1,"image":{"repository":"mxe-hostcluster-gc","tag":"1.0.0"},"schedule":"*/15 * * * *","successfulJobsHistoryLimit":0}` | Garbage collector configuration for the controller |
| controller.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | Prometheus monitoring configuration for the controller |
| controller.serviceAccount | object | `{"annotations":{},"create":true,"name":""}` | Service account configuration for the controller |
| controller.webhookInit | object | `{"image":{"pullPolicy":"IfNotPresent","repository":"mxe-controller/initialize","tag":"1.0.0"}}` | Webhook initialization configuration for the controller |
| deletionPolicy | object | `{"action":"Delete"}` | Deletion policy configuration |
| deletionPolicy.action | string | `"Delete"` | that make the spaces installation. |
| general | object | `{"account":"notdemo","clusterType":"kind","version":"1.0.0"}` | General configuration for the installation |
| general.account | string | `"notdemo"` | The Upbound organization this installation is associated with. |
| general.clusterType | string | `"kind"` | Valid options are: aks, eks, gke, kind. |
| general.version | string | `"1.0.0"` | Overall artifact version that affects xpkgs and related components. |
| imagePullSecrets | list | `[{"name":"upbound-pull-secret"}]` | Image pull secrets configuration |
| imagePullSecrets[0] | object | `{"name":"upbound-pull-secret"}` | NOTE: only an imagePullSecret of "upbound-pull-secret" is currently supported. |
| ingress | object | `{"annotations":{},"host":"proxy.upbound-127.0.0.1.nip.io","provision":true}` | Ingress configuration |
| ingress.annotations | object | `{}` | Allows setting ingress annotations for the external facing Ingress that terminates at the mxe-router deployment. |
| ingress.host | string | `"proxy.upbound-127.0.0.1.nip.io"` | Specifies the externally routable hostname used for routing requests to individual control planes. |
| ingress.provision | bool | `true` | Specifies whether the helm chart should create an Ingress resource for routing requests to the spaces-router. |
| registry | object | `{"url":"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"}` | Container registry configuration |
| registry.url | string | `"us-west1-docker.pkg.dev/orchestration-build/upbound-environments"` | Specifies the registry where the containers used in the spaces deployment are served from. |
| router | object | `{"controlPlane":{"extraArgs":["--service-node","mxe-router","--debug"],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-router","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}},"hpa":{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80},"oidc":[],"prometheus":{"podMonitor":{"enabled":false,"interval":"30s"}},"proxy":{"extraArgs":["--service-node","mxe-router","--service-cluster","mxe-router"],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"admin":{"port":9091},"annotations":{},"http":{"port":8443},"type":"ClusterIP"}},"replicaCount":1,"secretRefs":{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","tlsSecretName":"mxp-hostcluster-certs"},"serviceAccount":{"annotations":{},"create":true,"name":""}}` | Router configuration |
| router.controlPlane | object | `{"extraArgs":["--service-node","mxe-router","--debug"],"image":{"pullPolicy":"IfNotPresent","repository":"mxe-router","tag":"1.0.0"},"resources":{"limits":{"cpu":"1000m","memory":"1000Mi"},"requests":{"cpu":"100m","memory":"100Mi"}},"service":{"auth":{"port":9000},"grpc":{"port":8081},"http":{"port":9091},"metrics":{"port":8085},"privateHttp":{"port":9092}}}` | Control plane specific configuration for the router |
| router.hpa | object | `{"enabled":false,"maxReplicas":5,"minReplicas":1,"targetCPUUtilizationPercentage":80}` | Horizontal Pod Autoscaler configuration for the router |
| router.oidc | list | `[]` | OIDC configuration for the router |
| router.prometheus | object | `{"podMonitor":{"enabled":false,"interval":"30s"}}` | Prometheus monitoring configuration for the router |
| router.proxy | object | `{"extraArgs":["--service-node","mxe-router","--service-cluster","mxe-router"],"extraEnv":[],"image":{"pullPolicy":"IfNotPresent","repository":"envoy","tag":"v1.26-latest"},"resources":{"limits":{"cpu":"1000m","memory":"200Mi"},"requests":{"cpu":"100m","memory":"50Mi"}},"service":{"admin":{"port":9091},"annotations":{},"http":{"port":8443},"type":"ClusterIP"}}` | Proxy specific configuration for the router |
| router.secretRefs | object | `{"adminValidating":"cert-admin-signing","gatewaySigning":"cert-token-signing-gateway","tlsSecretName":"mxp-hostcluster-certs"}` | Secret references for the router |
| router.serviceAccount | object | `{"annotations":{},"create":true,"name":""}` | Service account configuration for the router |
| space | object | `{"labels":{}}` | Space configuration |
| space.labels | object | `{}` | Labels that are applied to all Deployments, Pods, Services, and StatefulSets managed by the Space. |




{{</ table >}}

<!-- vale on -->