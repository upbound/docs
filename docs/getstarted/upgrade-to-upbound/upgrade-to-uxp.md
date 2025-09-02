---
title: Upgrade to Upbound Crossplane
description: Adopt Upbound Crossplane from OSS Crossplane
sidebar_position: 2
---
import GlobalLanguageSelector, { CodeBlock } from '@site/src/components/GlobalLanguageSelector';

<GlobalLanguageSelector />


## Upgrade paths
<CodeBlock version="v1">
<!-- Do not add headers inside these blocks, they will appear in right-side TOC -->
<!-- regardless of if it's the selected option. -->
V1 -> UXP path
</CodeBlock>


<CodeBlock version="v2">
V2 -> UXP path
</CodeBlock>


Upbound Crossplane (UXP) is the AI-native distribution of Crossplane by Upbound.
UXP is based on Crossplane v2.0 and fully compatible with upstream Crossplane.

This guide walks through how to upgrade from the Open-Source version of
Crossplane v1/v2 to Upbound Crossplane (UXP) v2 with both Community and
Commercial licenses.

## Prerequisites

For this guide, you'll need:
* an existing OSS Crossplane v1 or v2 installation
* `kubectl` configured to access your cluster
* Helm 
* Cluster admin permissions
* A Commercial license key (for Commercial features only)

:::important
Upbound recommends backing up your critical resources **before** beginning this process.
:::

## Version compatibility

To upgrade from open-source Crossplane, the target UXP version has to match the
Crossplane version until the `-up.N` suffix. For example, you can upgrade from
Crossplane `v1.2.1` only to a UXP version that looks like `v1.2.1-up.N` but not
to a `v1.3.0-up.N`. In that scenario, you'd need to upgrade to open-source
Crossplane `v1.3.0` and then UXP `v1.3.0-up.N`.

## Breaking changes

:::warning
If you're migrating from Crossplane v1.X, read the breaking changes section below before performing the migration from Crossplane v1.X to Upbound Crossplane. 
**Upbound Crossplane is backward compatible with Crossplane v1.X**, provided you're not using these deprecated features.
:::

For users coming from Crossplane v1.X, Crossplane v2.0 makes breaking changes you should be aware of:
- It removes native patch and transform composition.
- It removes the `ControllerConfig` type.
- It removes support for external secret stores.
- It removes the default registry for Crossplane Packages.

Crossplane deprecated native patch and transform composition in Crossplane v1.17. It's replaced by composition functions.

Crossplane deprecated the ControllerConfig type in v1.11. It's replaced by the DeploymentRuntimeConfig type.

Crossplane added external secret stores in v1.7. External secret stores have remained in alpha for over two years and are now unmaintained.

Crossplane v2.0 drops the `--registry` flag that allowed users to specify a
default registry value and now requires users to always specify a fully
qualified URL when installing packages, both directly via `spec.package` and
indirectly as dependencies. Using fully qualified images was already a best
practice, but it's now enforced to avoid confusion and unexpected behavior, to
ensure users are aware of the registry used by their packages.

## Pre-upgrade steps

:::important
Before upgrading to Upbound Crossplane, please ensure all your Packages are
using fully qualified images that explicitly specify a registry
(`registry.example.com/repo/package:tag`). Run `kubectl get pkg` to look for any
packages that aren't fully qualified, then update or rebuild any Packages to use
fully qualified images as needed.
:::

Review your existing Crossplane resources:

```shell
# Backup all Crossplane configurations
kubectl get configurations.pkg -o yaml > configurations-backup.yaml
kubectl get providers.pkg -o yaml > providers-backup.yaml
kubectl get functions.pkg -o yaml > functions-backup.yaml
# Backup your claims and managed resources
kubectl get claim -A -o yaml > claims-backup.yaml
kubectl get managed -o yaml > managed-resources-backup.yaml
```

Verify your current Crossplane version and health:

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

Update your kubecontext to point at the cluster where you have Crossplane installed.

### Crossplane to Community UXP

Moving from Open Source Crossplane to Community UXP provides enhanced stability and features like improved package management and observability. This upgrade path uses a **free Community license**.

**Step 1: Upgrade to UXP**

Choose one of these methods:

**Helm:**
```bash
export UXP_VERSION=2.0.2-up.2                                      
helm upgrade --install crossplane --namespace crossplane-system oci://xpkg.upbound.io/upbound/crossplane --version "${UXP_VERSION}" --set "upbound.manager.imagePullSecrets[0].name=uxpv2-pull,webui.imagePullSecrets[0].name=uxpv2-pull,apollo.imagePullSecrets[0].name=uxpv2-pull" 
```

:::tip
To find the most recent version of UXP available, search the Helm repo:

```shell
helm search repo upbound-stable/crossplane --devel --versions
```
:::

**Alternative Helm:**
```bash
helm upgrade crossplane --namespace crossplane-system upbound-stable/universal-crossplane --devel
```


**up CLI:**
```bash
up uxp upgrade
```

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

## Upgrade to V2 Crossplane features

Crossplane v2.0 supports legacy v1-style XRs and MRs. Most users will be able to
upgrade from v1.x to Crossplane v2.0 without breaking changes.
