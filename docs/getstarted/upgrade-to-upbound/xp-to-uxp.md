---
title: Crossplane 1.X to Upbound Crossplane
description: Adopt Upbound Crossplane from OSS Crossplane
sidebar_position: 2
---
import VersionSelector from '@site/src/components/VersionSelector';

<VersionSelector />

Upbound Crossplane (UXP) is the AI-native distribution of Crossplane by Upbound.
UXP is based on Crossplane v2.0 and fully compatible with upstream Crossplane.

This guide walks through how to upgrade from the Open-Source version of
Crossplane v2 to Upbound Crossplane (UXP) v2 with both Community and
Commercial licenses.

:::important
As UXP v2 is built upon Crossplane v2 your controlplane must be running atleast Crossplane v2.0.1. If this is not the case please refer to the [Crossplane documentation on how to upgrade to Crossplane v2](https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/) and refer back to this doc.
:::

<VersionSelector version="v2.0.1">

## Prerequisites

For this guide, you'll need:
* An actively supported [Kubernetes version](https://kubernetes.io/releases/patch-releases/#support-period)
* An existing OSS Crossplane v2.0.1 installation
* `kubectl` configured to access your cluster
* Helm version `v3.2.0` or later
* Cluster admin permissions
* A Commercial license key (for Commercial features only)
</VersionSelector>

<VersionSelector version="v2.0.2">
## Prerequisites

For this guide, you'll need:
* An actively supported [Kubernetes version](https://kubernetes.io/releases/patch-releases/#support-period)
* an existing OSS Crossplane v2.0.2
* `kubectl` configured to access your cluster
* Helm version `v3.2.0` or later
* Cluster admin permissions
* A Commercial license key (for Commercial features only)
</VersionSelector>

:::important
Upbound recommends backing up your critical resources **before** beginning this process.
:::

## Version compatibility

To upgrade from open-source Crossplane, the target UXP version has to match the
Crossplane version until the `-up.N` suffix. For example, you can upgrade from
Crossplane `v2.0.1` only to a UXP version that looks like `v2.0.1-up.N` but not
to a `v2.1.1-up.N`. In that scenario, you'd need to upgrade to open-source
Crossplane `v2.1.1` and then UXP `v2.1.1-up.N`.

## Breaking changes

Crossplane v2.0 drops the `--registry` flag that allowed users to specify a
default registry value and now requires users to always specify a fully
qualified URL when installing packages, both directly via `spec.package` and
indirectly as dependencies. Using fully qualified images was already a best
practice, but it's now enforced to avoid confusion and unexpected behavior, to
ensure users are aware of the registry used by their packages.

## Verify Packges & Backup Crossplane resources

:::important
Before upgrading to Upbound Crossplane, please ensure all your Packages are
using fully qualified images that explicitly specify a registry
(`registry.example.com/repo/package:tag`).
:::

### Review your existing Crossplane packages:
```shell
# Check existing packages for fully qualified images
kubectl get pkg
```

The output should look like the following:
![kubectl get pkg](/img/getstarted/pkg-fqdn.png)

### Review your existing Crossplane resources:

```shell
# Backup all Crossplane configurations
kubectl get configurations.pkg -o yaml > configurations-backup.yaml
kubectl get providers.pkg -o yaml > providers-backup.yaml
kubectl get functions.pkg -o yaml > functions-backup.yaml
# Backup your claims and managed resources
kubectl get claim -A -o yaml > claims-backup.yaml
kubectl get managed -o yaml > managed-resources-backup.yaml
```

### Verify your current Crossplane version and health:

```shell
# Check current version
helm list -n crossplane-system
# Verify all resources are healthy
kubectl get configurations.pkg
kubectl get providers.pkg
kubectl get functions.pkg
```

Expected healthy state:
- Configurations: `INSTALLED: True`, `HEALTHY: True`
- Providers: `INSTALLED: True`, `HEALTHY: True`  
- Functions: `INSTALLED: True`, `HEALTHY: True`
- Claims: `SYNCED: True`, `READY: True`

Capture your critical cluster workloads that depend on Crossplane to plan for minimal disruption.

## Create a `ClusterAdmin`

Create a _ClusterRoleBinding_ to give your control plane the ability to create the necessary Kubernetes resource:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: crossplane-clusteradmin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: crossplane
  namespace: crossplane-system
```
Save as `rbac.yaml` and apply it:

```shell
kubectl apply -f rbac.yaml
```

:::warning

The _ClusterRoleBinidng_ above gives full admin access to Crossplane. While this
is fine for development purposes, it's advised for production scenarios to be
diligent in what permissions you grant Crossplane. Only give it what's
necessary to create and manage the resources you need it to.

:::


## Upgrade paths

### Crossplane to Community UXP

Moving from Open Source Crossplane to Community UXP provides enhanced stability and features like improved package management and observability. This upgrade path uses a **free Community license**.

#### Upgrade to Community UXP

Set version of UXP to install:
<VersionSelector version="v2.0.1">

```shell
export UXP_VERSION=2.0.1-up.1
```

</VersionSelector>
<VersionSelector version="v2.0.2">

```shell
export UXP_VERSION=2.0.2-up.3
```

</VersionSelector>

<Tabs>
<TabItem value="Helm Install">

Add the Upbound repository and upgrade your Crossplane cluster:
```shell
helm repo add upbound-stable https://charts.upbound.io/stable && helm repo update
helm upgrade crossplane --namespace crossplane-system upbound-stable/crossplane --version "${UXP_VERSION}"
```
</TabItem>

<TabItem value="Up CLI">

**Download the CLI:**

```shell
curl -sL "https://cli.upbound.io" | sh
```

**Upgrade you Crossplane cluster to UXP:**

```shell
up uxp upgrade "${UXP_VERSION}"
```

</TabItem>

#### Verify your upgrade

Check that all resources are healthy:
```bash
kubectl get configurations.pkg
kubectl get providers.pkg
kubectl get functions.pkg
kubectl get functionrevisions.pkg
kubectl get claim -A
kubectl get managed
```


<!-- # TODO
### Crossplane to Commericial UXP

Export the path of the license token JSON file provided by your Upbound account representative.
```bash
# Change the path to where you saved the token.
export UXP_TOKEN_PATH="/path/to/token.json"
```

```bash
kubectl -n crossplane-system create secret uxpv2-pull --
```

```bash
helm repo add upbound-stable https://charts.upbound.io/stable && helm repo update
helm upgrade --install crossplane --namespace crossplane-system oci://xpkg.upbound.io/upbound/crossplane --version "${UXP_VERSION}" --set "upbound.manager.imagePullSecrets[0].name=uxpv2-pull,webui.imagePullSecrets[0].name=uxpv2-pull,apollo.imagePullSecrets[0].name=uxpv2-pull" 
```

:::tip
To find the most recent version of UXP available, search the Helm repo:

```shell
helm search repo upbound-stable/crossplane --devel --versions
```
:::

**Step 2: Verify your upgrade**

Check that all resources are healthy:
```bash
kubectl get configurations.pkg
kubectl get providers.pkg
kubectl get functions.pkg
kubectl get claim -A
kubectl get managed
```

### Crossplane v2 to Commercial UXP

Moving from Open Source Crossplane to a Commercial UXP v2 provides production
level enterprise features like ProviderVPA, Knative, and enterprise support.
This upgrade path uses a **paid Commercial license**. Review our pricing plans
for more information.

**Step 1: Install your Commercial License**

Download your license file and use the `up` CLI to apply it:
```shell
up uxp license apply /path/to/license.json
```

**Step 2: Verify your commercial features**

After applying the license, check for VPA resources:
```bash
kubectl -n crossplane-system get vpa
```

Provider revisions should be healthy:
```bash
kubectl get providerrevisions.pkg
``` 

**Step 5: Verify function revision runtime update**

Function revisions should show healthy runtime status:
```bash
kubectl get functionrevisions.pkg
```

Expected output:
```
NAME                                                           HEALTHY   RUNTIME   IMAGE                                                                    STATE    AGE
crossplane-contrib-function-auto-ready-35bfe51b9ce9            True      True      xpkg.upbound.io/crossplane-contrib/function-auto-ready:v0.5.0            Active   16m
crossplane-contrib-function-patch-and-transform-d000d8ce634a   True      True      xpkg.upbound.io/crossplane-contrib/function-patch-and-transform:v0.9.0   Active   17m
```
-->

### Next Steps

After upgrading to Upbound Crossplane be sure to try out:
 * The devex improvements with our [builders workshop](https://docs.upbound.io/getstarted/builders-workshop/project-foundations/)
 * Browse all your managed resources with the [Crossplane Web UI](https://docs.upbound.io/manuals/console/self-service/#key-features)
 * Query resource states in real-time with [Upbound Query API](https://docs.upbound.io/manuals/console/query-api/)
 * Leverage Intelligent Control Planes to [Dynamically scale an RDS Instance](https://docs.upbound.io/guides/intelligent-control-planes/scale-database/)

Lastly, be sure to join the [#Upbound](https://crossplane.slack.com/archives/C01TRKD4623) channel on Crossplane slack if you have any questions!