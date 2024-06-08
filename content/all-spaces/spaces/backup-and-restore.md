---
title: Backup and restore
weight: 130
description: Enable and manage backups in your Upbound Space.
---

{{< hint "important" >}}
This feature is in preview.
{{< /hint >}}

Upbound’s _Shared Backups_ is a built-in backup and restore feature. Shared Backups lets you configure automatic schedules for taking snapshots of your managed control planes. You can restore data from these backups by making new control planes. This page explains how you can use Shared Backups for disaster recovery or upgrade scenarios.

## Benefits
The Shared Backups feature provides the following benefits:

* You can configure automatic backups for control planes without any operational overhead.
* You can configure backup schedules for multiple managed control planes in a group.
* Shared Backups are supported across all hosting environments of Upbound (Disconnected, Connected or Cloud Spaces).

## Prerequisites

Make sure the Shared Backups feature is enabled in whichever Space you plan to run your managed control plane in. The feature is enabled by default in all Upbound-managed Cloud Spaces. If you want to use these APIs in your Connected Space, your admin must enable them in the Connected Space.

## Configure a Shared Backup Config

[SharedBackupConfig]({{<ref "reference/space-api/#SharedBackupConfig-spec">}}) is a group-scoped resource and is created in a group containing one or more managed control planes. This resource configures the storage details and provider. Whenever a backup executes (either by schedule or manually initiated), it references a SharedBackupConfig to tell it where the snapshot should be stored. 

### Backup config provider

The `spec.objectStorage.provider` and `spec.objectStorage.config` fields configures the which object storage provider to use, where that provider is located, and the credentials to be used to communicate with the provider. Only one provider may be set. Upbound currently supports AWS, Azure, and GCP as providers.

`spec.objectStorage.config` is a freeform map of configuration options for the object storage provider. See [Thanos object storage](https://thanos.io/tip/thanos/storage.md/) for more information on the formats for each supported cloud provider. `spec.bucket` and `spec.provider` will override the required values in the config.

#### AWS as a storage provider

{{< hint "important" >}}
Static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

This example demonstrates how to use AWS as a storage provider for your backups:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupConfig
metadata:
  name: default
  namespace: default
spec:
  objectStorage:
    provider: AWS
    bucket: spaces-backup-bucket
    config:
      endpoint: s3.eu-west-2.amazonaws.com
      region: eu-west-2
    credentials:
      source: Secret
      secretRef:
        name: bucket-creds
        key: creds
```

This example assumes an S3 bucket has already been created, called "spaces-backup-bucket", in AWS eu-west-2 region. The account credentials to access the bucket should exist in a secret of the same namespace as the Shared Backup Config.

#### Azure as a storage provider

{{< hint "important" >}}
Static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

This example demonstrates how to use Azure as a storage provider for your backups:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupConfig
metadata:
  name: default
  namespace: default
spec:
  objectStorage:
    provider: Azure
    bucket: upbound-backups
    config:
      storage_account: upbackupstore
      container: upbound-backups
      endpoint: blob.core.windows.net
    credentials:
      source: Secret
      secretRef:
        name: bucket-creds
        key: creds
```

This example assumes an Azure storage account (upbackupstore) and blob (upbound-backups) have already been created. The storage account key to access the blob should exist in a secret of the same namespace as the Shared Backup Config.

#### GCP as a storage provider

{{< hint "important" >}}
Static credentials are currently the only supported auth method in Cloud Spaces.
{{< /hint >}}

This example demonstrates how to use Google Cloud Storage as a storage provider for your backups:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupConfig
metadata:
  name: default
  namespace: default
spec:
  objectStorage:
    provider: GCP
    bucket: spaces-backup-bucket
    credentials:
      source: Secret
      secretRef:
        name: bucket-creds
        key: creds
```

This example assumes a Cloud bucket has already been created, called "spaces-backup-bucket". A service account with sufficient permission to access this bucket should also have been created and its keyfile should exist in a secret of the same namespace as the Shared Backup Config.

<!-- vale off -->
## Configure a Shared Backup Schedule
<!-- vale on -->

[SharedBackupSchedule]({{<ref "reference/space-api/#SharedBackupSchedule-spec">}}) is a group-scoped resource and is created in a group containing one or more managed control planes. This resource defines a backup schedule for control planes within its corresponding group. 

Below is an example of a Shared Backup Schedule that takes daily backups of all control planes having `environment: production` labels:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
  namespace: default
spec:
  schedule: "@every 1d"
  configRef:
    kind: SharedBackupConfig
    name: default
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        environment: production
```

### Define a schedule

The `spec.schedule` field is a [Cron-formatted](https://en.wikipedia.org/wiki/Cron) string. Here are some common examples:

{{< table >}}
| Entry | Description |
| --- | --- |
| `@every 1h` | Run once an hour. |
| `@every 1d` | Run once a day. |
| `@every 1w` | Run once a week. |
| `0 0/4 * * *` | Run every 4 hours. |
| `0/15 * * * 1-5` | Run every 15th minute on Monday through Friday. |
{{< /table >}}

### Exclude resources from the backup

The `spec.excludedResources` field is an array of resource names to exclude from being included in each backup.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  excludedResources:
  - "XCluster"
  - "XDatabase"
  - "XRolePolicyAttachment"
```

### Suspend a schedule

Use `spec.suspend` field to suspend the schedule. No new Backups will be created, but running backups will be allowed to complete.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  suspend: true
```

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup will be eligible for garbage collection. If this field isn't set, the backup won't be garbage collected. The time to live is in seconds.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  ttl: 604800 # Backup is garbage collected after 7 days
```

### Garbage collect the backups when the schedule is deleted

Set the `spec.useOwnerReferencesInBackup` to define whether or not to garbage collect associated backups when a shared schedule is deleted. If set to true, backups will be garbage collected when the schedule is deleted.

### Control plane selection

To configure which managed control planes in a group you want to create a backup schedule for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane is matched if any of the label selectors match. 

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: my-backup-schedule
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: my-backup-schedule
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: my-backup-schedule
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

<!-- vale off -->
## Configure a Shared Backup
<!-- vale on -->

[SharedBackup]({{<ref "reference/space-api/#SharedBackup-spec">}}) is a group-scoped resource and is created in a group containing one or more managed control planes. This resource causes a backup to be executed for control planes within its corresponding group. 

Below is an example of a Shared Backup that takes a backup of all control planes having `environment: production` labels:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
  namespace: default
spec:
  configRef:
    kind: SharedBackupConfig
    name: default
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        environment: production
```

### Exclude resources from the backup

The `spec.excludedResources` field is an array of resource names to exclude from being included in each backup.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  excludedResources:
  - "XCluster"
  - "XDatabase"
  - "XRolePolicyAttachment"
```

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup will be eligible for garbage collection. If this field isn't set, the backup won't be garbage collected. The time to live is in seconds.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  ttl: 604800 # Backup is garbage collected after 7 days
```

### Garbage collect backups when the Shared Backup is deleted

Set the `spec.useOwnerReferencesInBackup` to define whether or not to garbage collect associated backups when a shared backup is deleted. If set to true, backups will be garbage collected when the shared backup is deleted.

### Control plane selection

To configure which managed control planes in a group you want to create a backup for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane is matched if any of the label selectors match. 

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

## Create a manual backup

[Backup]({{<ref "reference/space-api/#Backup-spec">}}) is a group-scoped resource that causes a single backup to be executed for a control planes in its corresponding group. 

Below is an example of a manual Backup of a managed control plane:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-backup
  namespace: default
spec:
  configRef:
    kind: SharedBackupConfig
    name: default
  controlPlane: my-awesome-ctp
  deletionPolicy: Delete
```

<!-- vale off -->
The `DeletionPolicy` in the backup specification dictates the behavior when a backup is deleted, including the deletion of the backup file from the bucket, by default it's set to `Orphan`. Set it to `Delete` to cleanup uploaded files in the bucket.
For more information on the backup and restore process, check out the [Spaces API documentation](https://docs.upbound.io/reference/space-api/).
<!-- vale on -->

### Choose a control plane to backup

The `spec.controlPlane` field defines which control plane to execute a backup against.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-backup
  namespace: default
spec:
  controlPlane: my-awesome-ctp
```

### Exclude resources from the backup

The `spec.excludedResources` field is an array of resource names to exclude from being included in the manual backup.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-backup
spec:
  excludedResources:
  - "XCluster"
  - "XDatabase"
  - "XRolePolicyAttachment"
```

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup will be eligible for garbage collection. If this field isn't set, the backup won't be garbage collected. The time to live is in seconds.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-backup
spec:
  ttl: 604800 # Backup is garbage collected after 7 days
```

## Restore a control plane from a backup

<!-- vale off -->
You can restore a control plane's state from a backup in a few steps. Below is an example of creating a new control plane from a previous backup called "restore-me":
<!-- vale on -->

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: my-awesome-restored-ctp
  namespace: default
spec:
  restore:
    source:
      apiGroup: spaces.upbound.io
      kind: Backup
      name: restore-me

```