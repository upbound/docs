---
title: Upgrade from Open-Source Crossplane to Upbound Crossplane
---

This guide walks through how to upgrade from the Open-Source version of
Crossplane v1/v2 to Upbound Crossplane(UXP) with both Community and Commercial
licenses.

## Prerequisites

For this guide, you'll need:

* an existing OSS Crossplane v1 or v2 installation
* `kubectl` configured to access your cluster
* Helm 
* Cluster admin permissions
* A Commercial license key (for Commercial features only)


:::important
Upbound recommends backing up your critical resources **before** beginning this
process.
:::

## Pre-upgrade steps

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

Capture your critical cluster workloads that depend on Crossplane to plan for
minimal disruption.

## Upgrade paths


### Crossplane to Community UXP

Moving from Open Source Crossplane v2 to Community UXP provides enhanced
stability and features like improved package management and observability. This
upgrade path uses a **free Community license**.

**Step 1: Upgrade to UXP**

```bash
export UXP_VERSION=VERSION
helm upgrade --install crossplane --namespace crossplane-system oci://xpkg.upbound.io/upbound-dev/crossplane --version "${UXP_VERSION}" --set "upbound.manager.imagePullSecrets[0].name=uxpv2-pull,webui.imagePullSecrets[0].name=uxpv2-pull,apollo.imagePullSecrets[0].name=uxpv2-pull"
```

**Step 2: Verify your upgrade**

Apply test resources to verify functionality:

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: uxp-test-configuration
spec:
  ignoreCrossplaneConstraints: true
  package: xpkg.upbound.io/alper/uxp-test-configuration:v0.0.1
EOF

kubectl apply -f - --server-side <<EOF
apiVersion: upbound.io/v1alpha1
kind: Stressor
metadata:
  name: test-claim1
spec:
  parameters:
    cpuLoad: 50
    vmBytes: 512000000
EOF
```

Check that all resources are healthy:

```bash
kubectl get configurations.pkg
kubectl get providers.pkg
kubectl get functions.pkg
kubectl get claim -A
kubectl get managed
```


### Crossplane v2 to Commercial UXP

Moving from Crossplane v2 to a Commercial UXP deployment provides production
level enterprise features like ProviderVPA, Knative, and enterprise support.
This upgrade path uses a **paid Commercial license**. Review our pricing plans
for more information.

**Step 1: Install your Commercial License**

```bash
export UXP_VERSION=VERSION
export UXP_LICENSE=<commercial license>
helm upgrade --install crossplane --namespace crossplane-system oci://xpkg.upbound.io/upbound-dev/crossplane --version "${UXP_VERSION}" --set "upbound.manager.imagePullSecrets[0].name=uxpv2-pull,webui.imagePullSecrets[0].name=uxpv2-pull,apollo.imagePullSecrets[0].name=uxpv2-pull" --set "args[0]=--package-runtime=Function=External" --set "upbound.manager.args[0]=--enable-provider-vpa,upbound.manager.args[1]=--enable-knative-runtime" --set "upbound.licenseKey=${UXP_LICENSE}"

up uxp license apply uxp-dev-license.json
```

**Step 2: Verify your commercial features**

After upgrade, check VPA resources are created:

```bash
kubectl -n crossplane-system get vpa
```

Expected output:
```
NAME                                   MODE   CPU   MEM       PROVIDED   AGE
upbound-provider-stress-8ef6ab35affd   Auto   25m   262144k   True       49s
```

Provider revisions should be healthy:

```bash
kubectl get providerrevisions.pkg
```

Expected output:
```
NAME                                   HEALTHY   RUNTIME   IMAGE                                            STATE    AGE
upbound-provider-stress-8ef6ab35affd   True      True      xpkg.upbound.io/upbound/provider-stress:v0.0.1   Active   10m
```


**Step 4: Find any KNative conflicts**

Knative services may initially fail with "NotOwned" status:

```bash
kubectl -n crossplane-system get services.serving
```

If you see services in "NotOwned" state:

```
NAME                                              URL                                                                                          LATESTCREATED                                                  LATESTREADY                                                    READY   REASON
crossplane-contrib-function-auto-ready            http://crossplane-contrib-function-auto-ready.crossplane-system.svc.cluster.local            crossplane-contrib-function-auto-ready-35bfe51b9ce9            crossplane-contrib-function-auto-ready-35bfe51b9ce9            False   NotOwned
crossplane-contrib-function-patch-and-transform   http://crossplane-contrib-function-patch-and-transform.crossplane-system.svc.cluster.local   crossplane-contrib-function-patch-and-transform-d000d8ce634a   crossplane-contrib-function-patch-and-transform-d000d8ce634a   False   NotOwned
```

**Problem**: Existing function services from OSS Crossplane installation are not owned by Knative services.

**Solution**: Delete the conflicting services:

```bash
kubectl -n crossplane-system delete service crossplane-contrib-function-auto-ready crossplane-contrib-function-patch-and-transform
```

After deletion, Knative services will become ready:

```bash
kubectl -n crossplane-system get services.serving
```

Expected output:
```
NAME                                              URL                                                                                           LATESTCREATED                                                  LATESTREADY                                                    READY   REASON
crossplane-contrib-function-auto-ready            https://crossplane-contrib-function-auto-ready.crossplane-system.svc.cluster.local            crossplane-contrib-function-auto-ready-35bfe51b9ce9            crossplane-contrib-function-auto-ready-35bfe51b9ce9            True
crossplane-contrib-function-patch-and-transform   https://crossplane-contrib-function-patch-and-transform.crossplane-system.svc.cluster.local   crossplane-contrib-function-patch-and-transform-d000d8ce634a   crossplane-contrib-function-patch-and-transform-d000d8ce634a   True
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

## Known Issues and Workarounds

### Immutable Selector Error (OSS v1 upgrades)

**Issue**: Provider deployments fail with immutable selector error after upgrade/downgrade cycles.

**Workaround**: Delete the problematic deployment - it will be recreated automatically:

```bash
kubectl -n crossplane-system delete deploy <provider-deployment-name>
```

### Knative Service Ownership Conflicts (Commercial UXP)

**Issue**: Knative services show "NotOwned" status due to existing services from OSS installation.

**Workaround**: Delete the conflicting services to allow Knative to take ownership:

```bash
kubectl -n crossplane-system delete service <service-names>
```
