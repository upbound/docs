---
title: Migrate Live Clusters to Crossplane v2
description: Migrate active clusters to v2 namespaced composites without recreating cloud resources
sidebar_position: 5
---

This guide demonstrates how to migrate active live clusters to v2 namespaced
composites from v1-style cluster scoped composites **without recreating cloud
resources**.

:::note
This guide doesn't cover how to migrate compositions themselves to v2. To
migrate to v2 XRDs, see [Migrate configurations to v2][migrate-configs-v2].
:::

## Prerequisites

- Though not strongly required, this guide assumes you are using Crossplane
  configuration packages to manage your XRDs and compositions
- v1 and v2 version of configuration package
- Both versions need to have `function-external-name-backup-restore` deployed
  at the end of their composition pipeline
- Upgraded Crossplane v2 control plane with v1 version of the configuration
  package deployed
- XR instances of v1 configuration running in the v2 cluster
  (`apiVersion: apiextensions.crossplane.io/v1` for the XRD)

## Step by step guide

For the sake of demonstration this guide runs through all the steps, including
the initial setup. If you were to do this in an actual cluster, you can skip
setting up the control plane.

### Step 1: Set up control plane

Create a control plane with Crossplane v2:

```bash
up ctp create v2-migration-test --crossplane-version=2.1.1-up.1 --crossplane-channel=None
```

Add `function-external-name-backup-restore` to dependencies:

```yaml
- apiVersion: pkg.crossplane.io/v1
  kind: Function
  package: xpkg.upbound.io/solutions/function-external-name-backup-restore
  version: v0.1.0
```

Prepare your compositions by adding this to your composition pipeline:

```yaml
- step: external-name-backup
  functionRef:
    name: solutions-function-external-name-backup-restore
  credentials:
  - name: aws-creds
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-dynamodb-creds
      key: credentials
```

:::warning
A current limitation exists where function-credentials can't be optional.
Because the function supports other external stores like AWS DynamoDB, you
need to create an empty placeholder secret. This guide uses a ConfigMap on the
same cluster to store the external names. This step is required for both the
v1 and v2 versions of your composition.
:::

:::danger
**IMPORTANT:** Don't add any new resource and keep all
`crossplane.io/composition-resource-name` the same. This is essential for a
successful restore. If you do this in an actual production setup, create a
backup with Upbound tooling before you proceed.
:::

### Step 2: Deploy v1 configuration and composite

This example uses `configuration-aws-network`. Configuration packages with the
required changes are already prepared.

Switch context:

```bash
up ctx ./v2-migration-test
```

Deploy the configuration:

```bash
kubectl apply -f - <<EOF
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: upbound-configuration-aws-network
spec:
  package: xpkg.upbound.io/solutions/configuration-aws-network:v1.0.0-migration-test
EOF
```

Configure the provider using static credentials:

```bash
kubectl apply -f - <<EOF
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-creds
      key: credentials
EOF
```

Deploy the credentials. This assumes you have the credentials in
`~/.aws/credentials` with the following format:

```text
~/.aws/credentials
[default]
aws_access_key_id=A...
aws_secret_access_key=a...
```

Apply them:

```bash
kubectl create secret generic aws-creds -n crossplane-system \
  --from-file=credentials=$HOME/.aws/credentials \
  --dry-run=client -o yaml | kubectl apply -f -
```

Create placeholder credentials for the function:

```bash
kubectl create secret generic aws-dynamodb-creds \
  --namespace=crossplane-system \
  --from-literal=credentials=""
```

Assign permissions for the function to write to ConfigMaps:

```bash
SA=$(kubectl get sa -ncrossplane-system | grep function-external-name-backup-restore | awk '{print $1}')

kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: function-external-name-backup-restore-configmap
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "create", "update", "delete"]
  - apiGroups: [""]
    resources: ["namespaces"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: function-external-name-backup-restore-configmap
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: function-external-name-backup-restore-configmap
subjects:
  - kind: ServiceAccount
    name: ${SA}
    namespace: crossplane-system
EOF
```

Deploy the composite:

```bash
kubectl apply -f - <<EOF
apiVersion: aws.platform.upbound.io/v1alpha1
kind: XNetwork
metadata:
  name: configuration-aws-network
  namespace: network-team
  annotations:
    fn.crossplane.io/enable-external-store: "true"
    fn.crossplane.io/cluster-id: "migration-poc"
    fn.crossplane.io/store-type: "k8sconfigmap"
spec:
  parameters:
    id: configuration-aws-network
    deletionPolicy: Orphan
    region: us-west-2
    vpcCidrBlock: 192.168.0.0/16
    subnets:
      - availabilityZone: us-west-2a
        type: public
        cidrBlock: 192.168.0.0/18
      - availabilityZone: us-west-2b
        type: public
        cidrBlock: 192.168.64.0/18
      - availabilityZone: us-west-2a
        type: private
        cidrBlock: 192.168.128.0/18
      - availabilityZone: us-west-2b
        type: private
        cidrBlock: 192.168.192.0/18
EOF
```

:::important
Migration to namespaced managed resources requires dropping managed resources,
so they need to be orphaned. The recommended way is to use
`deletionPolicy: Orphan` (only supported in v1) or omit `Delete` in
`managementPolicies` (`managementPolicies: ["Observe", "Create", "Update", "LateInitialize"]`).
The function only backs up external names for resources that are set to be
orphaned by either method.
:::

### Step 3: Verify everything is prepared

Run the trace command to check all resources are synced and ready:

```bash
crossplane beta trace xnetwork configuration-aws-network
```

Expected output:

```text
NAME                                                                  SYNCED   READY   STATUS
XNetwork/configuration-aws-network                                    True     True    Available
├─ InternetGateway/configuration-aws-network-971272c3bfda             True     True    Available
├─ MainRouteTableAssociation/configuration-aws-network-18c857fe1af8   True     True    Available
├─ RouteTableAssociation/configuration-aws-network-03d02afa8678       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-617ef61230c5       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-671f50b8bb04       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-fc8889923717       True     True    Available
├─ RouteTable/configuration-aws-network-0df02cd98a5a                  True     True    Available
├─ SecurityGroupRule/configuration-aws-network-99aa788bad71           True     True    Available
├─ SecurityGroupRule/configuration-aws-network-df5c35f2d876           True     True    Available
├─ SecurityGroup/configuration-aws-network-1ce1205df468               True     True    Available
├─ Subnet/configuration-aws-network-05dbaad53374                      True     True    Available
├─ Subnet/configuration-aws-network-3787dda7db1f                      True     True    Available
├─ Subnet/configuration-aws-network-80321cfd754b                      True     True    Available
├─ Subnet/configuration-aws-network-c278f9a1db3d                      True     True    Available
├─ VPC/configuration-aws-network-0b68c47236cd                         True     True    Available
└─ Route/configuration-aws-network-006e6a6fe825                       True     True    Available
```

Verify the ConfigMap contains all external names:

```bash
kubectl get configmap -ncrossplane-system external-name-backup-migration-poc -oyaml
```

The ConfigMap should show all external names written to it. The key is
base64-encoded to work around limitations:

```yaml
apiVersion: v1
data:
  bm9uZS9ub25lL2F3cy5wbGF0Zm9ybS51cGJvdW5kLmlvL3YxYWxwaGExL1hOZXR3b3JrL2NvbmZpZ3VyYXRpb24tYXdzLW5ldHdvcms: '{"igw":{"externalName":"igw-037378105667837d2","resourceName":"configuration-aws-network-971272c3bfda"},...}'
kind: ConfigMap
metadata:
  creationTimestamp: "2025-12-10T11:17:14Z"
  labels:
    app.kubernetes.io/managed-by: function-external-name-backup-restore
    cluster-id: migration-poc
  name: external-name-backup-migration-poc
  namespace: crossplane-system
```

### Step 4: Drop the XR

Delete the v1 XR:

```bash
kubectl delete xnetwork configuration-aws-network
```

### Step 5: Update the configuration package

:::important
It's important that the function was added to the composition pipeline.
:::

For this example, there is already a version prepared. Install the new version:

```bash
kubectl apply -f - <<EOF
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: upbound-configuration-aws-network
spec:
  package: xpkg.upbound.io/solutions/configuration-aws-network:v2.0.0-migration-test
EOF
```

Verify the configuration has been updated successfully:

```bash
kubectl get configuration
```

Expected output:

```text
NAME                                INSTALLED   HEALTHY   PACKAGE                                                                     AGE
upbound-configuration-aws-network   True        True      xpkg.upbound.io/solutions/configuration-aws-network:v2.0.0-migration-test   18m
```

### Step 6: Deploy the v2 version of the XR

Configure the provider for namespaced resources:

```bash
kubectl create ns network-team

kubectl apply -f - <<EOF
apiVersion: aws.m.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
  namespace: network-team
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: network-team
      name: aws-creds
      key: credentials
EOF

kubectl create secret generic aws-creds -n network-team \
  --from-file=credentials=$HOME/.aws/credentials \
  --dry-run=client -o yaml | kubectl apply -f -
```

Deploy the v2 version of the XR:

```bash
kubectl apply -f - <<EOF
apiVersion: aws.platform.upbound.io/v1alpha1
kind: Network
metadata:
  name: configuration-aws-network
  namespace: network-team
  annotations:
    fn.crossplane.io/enable-external-store: "true"
    fn.crossplane.io/cluster-id: "migration-poc"
    fn.crossplane.io/store-type: "k8sconfigmap"
    fn.crossplane.io/override-kind: "XNetwork"
    fn.crossplane.io/override-namespace: "none"
    fn.crossplane.io/require-restore: "true"
spec:
  parameters:
    managementPolicies:
      - Create
      - Update
      - Observe
      - LateInitialize
    id: configuration-aws-network
    region: us-west-2
    vpcCidrBlock: 192.168.0.0/16
    subnets:
      - availabilityZone: us-west-2a
        type: public
        cidrBlock: 192.168.0.0/18
      - availabilityZone: us-west-2b
        type: public
        cidrBlock: 192.168.64.0/18
      - availabilityZone: us-west-2a
        type: private
        cidrBlock: 192.168.128.0/18
      - availabilityZone: us-west-2b
        type: private
        cidrBlock: 192.168.192.0/18
EOF
```

Notice three critical settings:
- `fn.crossplane.io/override-kind: "XNetwork"` - Because kind changed, tell
  the function to look up this kind
- `fn.crossplane.io/override-namespace: "none"` - Because namespace changed,
  the function needs to look up on cluster scope
- `fn.crossplane.io/require-restore: "true"` - Safety switch to not proceed
  unless all resources have been found in the backup store

Verify that everything was imported correctly:

```bash
crossplane beta trace network -nnetwork-team configuration-aws-network
```

Expected output:

```text
NAME                                                                                 SYNCED   READY   STATUS
Network/configuration-aws-network (network-team)                                     True     True    Available
├─ InternetGateway/configuration-aws-network-971272c3bfda (network-team)             True     True    Available
├─ MainRouteTableAssociation/configuration-aws-network-18c857fe1af8 (network-team)   True     True    Available
├─ RouteTableAssociation/configuration-aws-network-03d02afa8678 (network-team)       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-617ef61230c5 (network-team)       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-671f50b8bb04 (network-team)       True     True    Available
├─ RouteTableAssociation/configuration-aws-network-fc8889923717 (network-team)       True     True    Available
├─ RouteTable/configuration-aws-network-0df02cd98a5a (network-team)                  True     True    Available
├─ Route/configuration-aws-network-006e6a6fe825 (network-team)                       True     True    Available
├─ SecurityGroupRule/configuration-aws-network-99aa788bad71 (network-team)           True     True    Available
├─ SecurityGroupRule/configuration-aws-network-df5c35f2d876 (network-team)           True     True    Available
├─ SecurityGroup/configuration-aws-network-1ce1205df468 (network-team)               True     True    Available
├─ Subnet/configuration-aws-network-05dbaad53374 (network-team)                      True     True    Available
├─ Subnet/configuration-aws-network-3787dda7db1f (network-team)                      True     True    Available
├─ Subnet/configuration-aws-network-80321cfd754b (network-team)                      True     True    Available
├─ Subnet/configuration-aws-network-c278f9a1db3d (network-team)                      True     True    Available
└─ VPC/configuration-aws-network-0b68c47236cd (network-team)                         True     True    Available
```

### Step 7: Clean up

Drop the safety annotation from the XR:

```bash
kubectl annotate network configuration-aws-network \
  -nnetwork-team fn.crossplane.io/require-restore-
```

Alternatively, delete all the annotations relating to
`external-name-backup-restore` to disable the function completely.

Delete the ConfigMap with the stored names:

```bash
kubectl delete configmap -ncrossplane-system external-name-backup-migration-poc
```

### Finished

Congratulations, you migrated your XR to Crossplane v2 with a namespaced XR and
namespaced managed resources without deleting or recreating any resources on
AWS.

## Best practices

### Backup before migration

Always create a backup of your control plane before starting the migration.
Use Upbound's backup tools or your preferred backup solution.

### Test in non-production first

Test the migration process in a development or staging environment before
running it in production.

### Verify resource state

After migration, verify that all resources are in the expected state and that
applications consuming the resources are working correctly.

### Monitor during migration

Watch for any errors or warnings during the migration process. The function
logs can provide useful debugging information.

## Troubleshooting

### Resources not being restored

**Problem:** Resources aren't being imported after v2 deployment.

**Solution:** Check that:
- The ConfigMap contains the external names
- The `fn.crossplane.io/require-restore: "true"` annotation is set
- The `override-kind` and `override-namespace` annotations are correct
- All `crossplane.io/composition-resource-name` values match between v1 and v2

### Permission errors

**Problem:** Function can't write to ConfigMaps.

**Solution:** Verify the ClusterRole and ClusterRoleBinding are correctly set
up for the function's ServiceAccount.

### Missing external names in ConfigMap

**Problem:** ConfigMap doesn't contain all expected external names.

**Solution:** Ensure resources were set to orphan mode before deletion
(`deletionPolicy: Orphan` in v1 or appropriate `managementPolicies` in v2).

## Next steps

- [Migrate configurations to v2][migrate-configs-v2] - Technical guide for
  updating XRDs and compositions
- [Upgrade to UXP][upgrade-uxp] - Upgrade from Crossplane v2 OSS to Upbound
  Crossplane
- [Provider migration guide][provider-migration] - Migrate from monolithic to
  family providers

[migrate-configs-v2]: /getstarted/upgrade-to-upbound/migrate-configurations-v2
[upgrade-uxp]: /getstarted/upgrade-to-upbound/upgrade-to-uxp
[provider-migration]: /manuals/packages/providers/migration
