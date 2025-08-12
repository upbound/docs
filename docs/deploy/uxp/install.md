---
title: "Install UXP"
weight: 205
description: "How to install Upbound UXP"
---

Upbound Universal Crossplane (UXP) is the Upbound official enterprise-grade
distribution of Crossplane for self-hosted control planes. 

Install UXP into an existing Kubernetes cluster to access Upbound features like [official providers][official-providers] or community Crossplane features.

## Install Upbound Universal Crossplane

Installing UXP requires the [Up command-line][up-command-line]. 

Use the `up uxp install` command to install UXP into the current Kubernetes cluster based on `~/.kube/config`.

```shell
up uxp install
```

Up installs the latest stable [UXP release][uxp-release] into the `upbound-system` namespace.

### Install a specific Upbound Universal Crossplane version
Install a specific version of UXP with `up uxp install <version>`. 

The list of available versions is in the [charts.upbound.io/stable][charts-upbound-io-stable] listing.

:::note
Don't include the `universal-crossplane-` name when using `up uxp install <version>`. 
For example, `up uxp install 1.8.1-up.1`
:::

### Install Upbound Universal Crossplane in a custom namespace
Install UXP into a specific namespace using the `-n <NAMESPACE>` option.

For example, to install UXP into the `upbound-test` namespace use the command

```shell
up uxp install -n upbound-test
```

### Install unreleased Upbound Universal Crossplane versions

Install unreleased versions of UXP for testing or troubleshooting. Don't install unreleased versions for production use without explicit guidance from Upbound.

Find available unreleased releases in the [charts.upbound.io/main][charts-upbound-io-main] listing. 

Install the latest unreleased version with the `--unstable` flag.

`up uxp install --unstable`

Install a specific release with `up uxp install --unstable <version>`

:::note
Don't include the `universal-crossplane-` name when using `up uxp install --unstable <version>`. 
For example, `up uxp install --unstable 1.9.0-up.1.rc.1.6.g3b4985a`
:::

### Customize install options 
Change default install settings via the command-line with `--set <key>=<value>` or a settings file with `-f <file>`.

:::tip
A configuration file is the recommended method to customize the UXP install.
:::

Provide file-based configurations as a [Helm values file][helm-values-file]. 

For example to configure two Crossplane pod replicas with `--set`:

`up uxp install --set replicas=2`

or with a file:  

```shell {copy-lines="2"}
cat settings.yaml
replicas: 2
```
```shell
up uxp install -f settings.yaml
```

View the `upbound-system` pods to see two Crossplane pods deployed.
```shell {hl_lines="3-4"}
kubectl get pods -n upbound-system
NAME                                         READY   STATUS    RESTARTS        AGE
crossplane-75556d97b6-gpzq7                  1/1     Running   0               4m23s
crossplane-75556d97b6-xm8bj                  1/1     Running   0               4m23s
crossplane-rbac-manager-8f5c76d46-kvmpm      1/1     Running   0               4m23s
provider-aws-a1113cd136a1-59b8587f6f-q8bpt   1/1     Running   0               4h55m
```

### Configure Upbound Universal Crossplane installed from the Amazon EKS management console

If you have installed `uxp` directly from the Amazon EKS management console, you need to grant `crossplane` and any `provider` cluster level roles.

Upbound tailored the `uxp` installation to fit AWS requirements and Upbound removes the `crossplane-rbac-manager` from the installation.

To install and use any provider, you must to configure `uxp` by granting cluster scope permissions to the `crossplane` pod and `provider` pods.

These steps are necessary only for the installations without `crossplane-rbac-manager.`

First grant `crossplane` a _cluster-admin_ role.

```bash {copy-lines="all"} 
kubectl create clusterrolebinding cluster-crossplane-admin \
        --clusterrole=cluster-admin \
        --serviceaccount upbound-system:crossplane
```

<!-- vale Google.WordList = NO -->
<!-- allow cluster-admin -->
Next, for each installed provider, add _cluster-admin_ role binding. An example for provider `AWS`:
<!-- vale Google.WordList = YES -->

```bash {copy-lines="all"} 
# Retrieve provider sa name
provider_aws=$(kubectl get sa -n upbound-system \
              | grep provider-aws \
              | awk '{print $1}')
# Grant cluster-admin role
kubectl create clusterrolebinding cluster-provider-aws-admin \
        --clusterrole=cluster-admin \
        --serviceaccount upbound-system:"$provider_aws"
```

Restart `crossplane` and `provider aws` pods for the changes to take effect

```bash {copy-lines="all"} 
AWS_POD=$(kubectl get pods -n upbound-system | grep provider-aws | awk '{print $1}') && \
          kubectl delete pod -n upbound-system $AWS_POD

CROSSPLANE_POD=$(kubectl get pods -n upbound-system | grep crossplane | awk '{print $1}') && \
          kubectl delete pod -n upbound-system $CROSSPLANE_POD
```
<div style={{overflowX: 'auto'}}>
<!-- vale off -->
| **Parameter**                                       | **Description**                                                                                                                                                                                                                                                                           | **Default**                                                                                                                                                                                                                                                                                                                                                        |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| affinity                                            | Enable and define the affinity for the `crossplane` pod.                                                                                                                                                                                                                                  | `{}` - Affinities aren't configured.                                                                                                                                                                                                                                                                                                                               |
| configuration.packages                              | The list of `configuration packages` to install together with UXP. These packages install UXP resources after the `crossplane` pod starts.                                                                                                                                                | `{}` - Configurations aren't installed by default.                                                                                                                                                                                                                                                                                                                 |
| customAnnotations                                   | Custom annotations to add to the `crossplane` deployment and pod.                                                                                                                                                                                                                         | `{}` - Annotations aren't configured.                                                                                                                                                                                                                                                                                                                              |
| customLabels                                        | Custom labels to add to the `crossplane` and `crossplane-rbac-manager` deployments and pods. Overwriting default labels isn't supported and causes the install to fail.                                                                                                                   | ```{app=crossplane, app.kubernetes.io/component=cloud-infrastructure-controller, app.kubernetes.io/instance=universal-crossplane, app.kubernetes.io/managed-by=Helm, app.kubernetes.io/name=crossplane, app.kubernetes.io/part-of=crossplane, app.kubernetes.io/version=<crossplane version>, helm.sh/chart=<crossplane version>, release=universal-crossplane}``` |
| deploymentStrategy                                  | The deployment strategy for the `crossplane` and `crossplane-rbac-manager` pods.                                                                                                                                                                                                          | `RollingUpdate`                                                                                                                                                                                                                                                                                                                                                    |
| extraEnvVarsCrossplane                              | List of extra environment variables to set in the `crossplane` deployment. A \_ replaces any `.` character in a variable name. For example `SAMPLE.KEY=value1` becomes `SAMPLE\_KEY=value1`.                                                                                              | ```{POD_NAMESPACE:(v1:metadata.namespace),olala:olala,LEADER_ELECTION:true}```                                                                                                                                                                                                                                                                                     |
| extraEnvVarsRBACManager                             | List of extra environment variables to set in the `crossplane-rbac-manager` deployment. A \_ replaces any `.` character in a variable name. For example `SAMPLE.KEY=value1` becomes `SAMPLE\_KEY=value1`.                                                                                 | ```{LEADER_ELECTION:true}```                                                                                                                                                                                                                                                                                                                                       |
| image.pullPolicy                                    | Kubernetes [image pull policy][image-pull-policy].                                                                                                                                                                                 | `IfNotPresent`                                                                                                                                                                                                                                                                                                                                                     |
| image.repository                                    | Container image repository to download UXP from.                                                                                                                                                                                                                                          | The DockerHub repository `upbound/crossplane`.                                                                                                                                                                                                                                                                                                                     |
| image.tag                                           | Image tag to install a specific Crossplane version. Provides the same function as `up uxp install <image.tag>`.                                                                                                                                                                           | `""` - Without an image tag Up installs the `latest` UXP version.                                                                                                                                                                                                                                                                                                  |
| imagePullSecrets                                    | List of Kubernetes [image pull secrets][image-pull-secrets]. Required if `image.repository` uses authentication.                                                                                                 | `""` - Secrets aren't configured.                                                                                                                                                                                                                                                                                                                                  |
| leaderElection                                      | Enable leader election for the `crossplane` deployment and pods. Set `leaderElection` as `true` for any deployment with more than 1 `replica` to prevent race-conditions.                                                                                                                 | `true`                                                                                                                                                                                                                                                                                                                                                             |
| metrics.enabled                                     | Exposes port `8080` in the `crossplane` and `crossplane-rbac-manager` pods. Configures pod annotations `prometheus.io/path:/metrics`, `prometheus.io/port:"8080"` and `prometheus.io/scrape:"true"`.                                                                                      | `false`                                                                                                                                                                                                                                                                                                                                                            |
| nodeSelector                                        | Apply a `nodeSelector` map to the `crossplane` pod.                                                                                                                                                                                                                                       | `{}` - Node selectors aren't configured.                                                                                                                                                                                                                                                                                                                           |
| packageCache.medium                                 | The Kubernetes [`emptyDir` Volume type][emptydir-volume-type] for the `crossplane` pod's package cache. The only valid value is `"memory"`. Not supported with `packageCache.pvc`.                                                           | `""` - Kubernetes pod default of local node storage.                                                                                                                                                                                                                                                                                                               |
| packageCache.pvc                                    | A [`PersistentVolumeClaim`][persistentvolumeclaim] for the `crossplane` pod's package cache. `packageCache.pvc` is an alternative to the default `emptyDir` volume mount. Not supported with `packageCache.medium` or `packageCache.sizeLimit`. | `""` - `emptyDir` is the default mounted pod volume.                                                                                                                                                                                                                                                                                                               |
| packageCache.sizeLimit                              | The size limit for the `crossplane` pod's `emptyDir` package cache. Not supported with `pacakgeCache.pvc`.                                                                                                                                                                                | `5Mi`                                                                                                                                                                                                                                                                                                                                                              |
| priorityClassName                                   | Applies a priority class name to the `crossplane` and `crossplane-rbac-manager` deployments and pods.                                                                                                                                                                                     | `""` - A priority class isn't set.                                                                                                                                                                                                                                                                                                                                 |
| provider.packages                                   | The list of `provider packages` to install together with UXP. These packages install UXP resources after the `crossplane` pod starts.                                                                                                                                                     | `[]` - Providers aren't installed by default.                                                                                                                                                                                                                                                                                                                      |
| rbacManager.affinity                                | Enable and define the affinity for the `crossplane` pod.                                                                                                                                                                                                                                  | `{}` - Affinities aren't configured.                                                                                                                                                                                                                                                                                                                               |
| rbacManager.deploy                                  | Deploy RBAC Manager and its required roles.                                                                                                                                                                                                                                               | `true`                                                                                                                                                                                                                                                                                                                                                             |
| rbacManager.leaderElection                          | Enable leader election for the `crossplane-rbac-manager` deployment and pods. Set `leaderElection` as `true` for any deployment with more than 1 `replica` to prevent race-conditions.                                                                                                    | `true`                                                                                                                                                                                                                                                                                                                                                             |
| rbacManager.managementPolicy                        | The scope of `crossplane-rbac-manager` permissions control. A value of `all` all Crossplane controller and user roles. `basic` only manages Crossplane controller roles and the `crossplane-admin`, `crossplane-edit`, and `crossplane-view` user roles.                                  | `all`                                                                                                                                                                                                                                                                                                                                                              |
| rbacManager.nodeSelector                            | Apply a `nodeSelector` map to the `crossplane` pod.                                                                                                                                                                                                                                       | `{}` - Node selectors aren't configured.                                                                                                                                                                                                                                                                                                                           |
| rbacManager.replicas                                | The number of `crossplane-rbac-manager` replicas.                                                                                                                                                                                                                                         | `1`                                                                                                                                                                                                                                                                                                                                                                |
| rbacManager.skipAggregatedClusterRoles              | Skip the deployment of `ClusterRoles` along with the `crossplane-rbac-manager`. Set to `true` to manually build Crossplane ClusterRoles.                                                                                                                                                  | `false`                                                                                                                                                                                                                                                                                                                                                            |
| rbacManager.tolerations                             | Enable `tolerations` for the `crossplane-rbac-manager` pod.                                                                                                                                                                                                                               | `{}` - Tolerations aren't configured.                                                                                                                                                                                                                                                                                                                              |
| registryCaBundleConfig.key                          | Use a custom CA certification for downloading images and configurations. The value of the `configMap` key. Use with `registryCaBundleConfig.name`                                                                                                                                         | `{}` - Crossplane uses the default system certificates.                                                                                                                                                                                                                                                                                                            |
| registryCaBundleConfig.name                         | Use a custom CA certification for downloading images and configurations. The value of the `configMap` name. Use with `registryCaBundleConfig.key`                                                                                                                                         | `{}` - Crossplane uses the default system certificates.                                                                                                                                                                                                                                                                                                            |
| replicas                                            | The number of `crossplane-rbac-manager` replicas.                                                                                                                                                                                                                                         | `1`                                                                                                                                                                                                                                                                                                                                                                |
| resourcesCrossplane.limits.cpu                      | CPU resource limits for the `crossplane` pods.                                                                                                                                                                                                                                            | `100m`                                                                                                                                                                                                                                                                                                                                                             |
| resourcesCrossplane.limits.memory                   | Memory resource limits for the `crossplane` pods.                                                                                                                                                                                                                                         | `512Mi`                                                                                                                                                                                                                                                                                                                                                            |
| resourcesCrossplane.requests.cpu                    | CPU resource requests for the `crossplane` pods.                                                                                                                                                                                                                                          | `100m`                                                                                                                                                                                                                                                                                                                                                             |
| resourcesCrossplane.requests.memory                 | Memory resource requests for the `crossplane` pods.                                                                                                                                                                                                                                       | `256Mi`                                                                                                                                                                                                                                                                                                                                                            |
| resourcesRBACManager.limits.cpu                     | CPU resource limits for the `crossplane-rbac-manager` pods.                                                                                                                                                                                                                               | `100m`                                                                                                                                                                                                                                                                                                                                                             |
| resourcesRBACManager.limits.memory                  | Memory resource limits for the `crossplane-rbac-manager` pods.                                                                                                                                                                                                                            | `512Mi`                                                                                                                                                                                                                                                                                                                                                            |
| resourcesRBACManager.requests.cpu                   | CPU resource requests for the `crossplane-rbac-manager` pods.                                                                                                                                                                                                                             | `100m`                                                                                                                                                                                                                                                                                                                                                             |
| resourcesRBACManager.requests.memory                | Memory resource requests for the `crossplane-rbac-manager` pods.                                                                                                                                                                                                                          | `256Mi`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextCrossplane.allowPrivilegeEscalation  | Allow [privilege escalation][privilege-escalation] the `crossplane` pods.                                                                                                                                               | `false`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextCrossplane.readOnlyRootFilesystem    | Set a [ReadOnly][readonly] root file system for the `crossplane` pods.                                                                                                                                  | `true`                                                                                                                                                                                                                                                                                                                                                             |
| securityContextCrossplane.runAsGroup                | Set the [Run as group][run-as-group] for the `crossplane` pods.                                                                                                                                                     | `65532`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextCrossplane.runAsUser                 | Set the [Run as user][run-as-user] the `crossplane` pods.                                                                                                                                                          | `65532`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextRBACManager.allowPrivilegeEscalation | Allow [privilege escalation][privilege-escalation-1] the `crossplane-rbac-manager` pods.                                                                                                                                  | `false`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextRBACManager.readOnlyRootFilesystem   | Set a [ReadOnly][readonly-2] root file system for the `crossplane-rbac-manager` pods.                                                                                                                     | `true`                                                                                                                                                                                                                                                                                                                                                             |
| securityContextRBACManager.runAsGroup               | Set the [Run as group][run-as-group-3] for the `crossplane-rbac-manager` pods.                                                                                                                                        | `65532`                                                                                                                                                                                                                                                                                                                                                            |
| securityContextRBACManager.runAsUser                | Set the [Run as user][run-as-user-4] the `crossplane-rbac-manager` pods.                                                                                                                                             | `65532`                                                                                                                                                                                                                                                                                                                                                            |
| serviceAccount.customAnnotations                    | Custom annotations for the `crossplane` `serviceaccount`                                                                                                                                                                                                                                  | `{meta.helm.sh/release-name: universal-crossplane, meta.helm.sh/release-namespace: upbound-system}`                                                                                                                                                                                                                                                                |
| tolerations                                         | Enable `tolerations` for the `crossplane` pod.                                                                                                                                                                                                                                            | `{}` - Tolerations aren't configured.                                                                                                                                                                                                                                                                                                                              |
| webhooks.enabled                                    | Create a service and expose TCP port 9443 to support `webhooks` for all Crossplane created pods.                                                                                                                                                                                          | `false`                                                                                                                                                                                                                                                                                                                                                            |
<!-- vale on -->
</div>

[official-providers]: /img/providers
[up-command-line]: /operate/cli/


[uxp-release]: https://github.com/upbound/universal-crossplane/releases/
[charts-upbound-io-stable]: https://charts.upbound.io/stable/
[charts-upbound-io-main]: https://charts.upbound.io/main/
[helm-values-file]: https://helm.sh/docs/chart_template_guide/values_files/
[image-pull-policy]: https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy
[image-pull-secrets]: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod
[emptydir-volume-type]: https://kubernetes.io/docs/concepts/storage/volumes/#volume-types
[persistentvolumeclaim]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[privilege-escalation]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#privilege-escalation
[readonly]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
[run-as-group]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
[run-as-user]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
[privilege-escalation-1]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#privilege-escalation
[readonly-2]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#volumes-and-file-systems
[run-as-group-3]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
[run-as-user-4]: https://kubernetes.io/docs/concepts/security/pod-security-policy/#users-and-groups
