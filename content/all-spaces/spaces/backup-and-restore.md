---
title: Backup and restore
weight: 130
description: Enable and manage backups in your Upbound Space.
---

{{< hint "important" >}}
This feature is in preview.
{{< /hint >}}

Upbound's _Shared Backups_ is a built-in backup and restore feature. Shared Backups lets you configure automatic schedules for taking snapshots of your managed control planes. You can restore data from these backups by making new control planes. This guide explains how you can use Shared Backups for disaster recovery or upgrade scenarios.

## Benefits
The Shared Backups feature provides the following benefits:

* You can configure automatic backups for control planes without any operational overhead.
* You can configure backup schedules for multiple managed control planes in a group.
* You can use Shared Backups across all hosting environments of Upbound (Disconnected, Connected or Cloud Spaces).

## Prerequisites

Make sure you've enabled the Shared Backups feature in whichever Space you plan to run your managed control plane in. All Upbound-managed Cloud Spaces have this feature enabled by default. If you want to use these APIs in your own Connected Space, your Space administrator must enable them in the Connected Space.

<!-- vale off -->
## Configure a Shared Backup Config
<!-- vale on -->

[SharedBackupConfig]({{<ref "reference/space-api#SharedBackupConfig-spec">}}) is a [group-scoped]({{<ref "mcp/groups">}}) resource. You should create them in a group containing one or more managed control planes. This resource configures the storage details and provider. Whenever a backup executes (either by schedule or manually initiated), it references a SharedBackupConfig to tell it where store the snapshot.

<!-- vale off -->
### Backup config provider
<!-- vale on -->

The `spec.objectStorage.provider` and `spec.objectStorage.config` fields configures:

* which object storage provider to use
* where it can find that provider
* the credentials needed to communicate with the provider.

You can only set one provider. Upbound currently supports AWS, Azure, and GCP as providers.

<!-- vale off -->
`spec.objectStorage.config` is a freeform map of configuration options for the object storage provider. See [Thanos object storage](https://thanos.io/tip/thanos/storage.md/) for more information on the formats for each supported cloud provider. `spec.bucket` and `spec.provider` overrides the required values in the config.
<!-- vale on -->

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

<!-- vale off -->
This example assumes you've already created an S3 bucket called "spaces-backup-bucket" in AWS eu-west-2 region. The account credentials to access the bucket should exist in a secret of the same namespace as the shared backup config.
<!-- vale on -->

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

<!-- vale off -->
This example assumes you've already created an Azure storage account called "upbackupstore" and blob "upbound-backups." The storage account key to access the blob should exist in a secret of the same namespace as the Shared Backup Config.
<!-- vale on -->

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

<!-- vale off -->
This example assumes you've already created a Cloud bucket called "spaces-backup-bucket." You should've also created a service account with enough permission to access this bucket. It's key file should exist in a secret of the same namespace as the Shared Backup Config.
<!-- vale on -->

<!-- vale off -->
## Configure a Shared Backup Schedule
<!-- vale on -->

[SharedBackupSchedule]({{<ref "reference/space-api#SharedBackupSchedule-spec">}}) is a [group-scoped]({{<ref "mcp/groups">}}) resource. You should create them in a group containing one or more managed control planes. This resource defines a backup schedule for control planes within its corresponding group.

Below is an example of a Shared Backup Schedule that takes backups every day of all control planes having `environment: production` labels:

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

The `spec.schedule` field is a [Cron-formatted](https://en.wikipedia.org/wiki/Cron) string. Some common examples are below:

{{< table >}}
| Entry | Description |
| --- | --- |
| `@every 1h` | Run once an hour. |
| `@every 1d` | Run once a day. |
| `@every 1w` | Run once a week. |
| `0 0/4 * * *` | Run every 4 hours. |
| `0/15 * * * 1-5` | Run every fifteenth minute on Monday through Friday. |
{{< /table >}}

### Exclude resources from the backup

The `spec.excludedResources` field is an array of resource names to exclude from each backup.

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

Use `spec.suspend` field to suspend the schedule. It creates no new backups, but allows running backups to complete.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  suspend: true
```

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is in seconds.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  ttl: 604800 # Backup is garbage collected after 7 days
```

### Garbage collect backups when the schedule gets deleted

Set the `spec.useOwnerReferencesInBackup` to garbage collect associated backups when a shared schedule gets deleted. If set to true, backups are garbage collected when the schedule gets deleted.

### Control plane selection

To configure which managed control planes in a group you want to create a backup schedule for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

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

[SharedBackup]({{<ref "reference/space-api#SharedBackup-spec">}}) is a [group-scoped]({{<ref "mcp/groups">}}) resource. You should create them in a group containing one or more managed control planes. This resource causes a backups to occur for control planes within its corresponding group.

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

The `spec.excludedResources` field is an array of resource names to exclude from each backup.

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

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is in seconds.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  ttl: 604800 # Backup is garbage collected after 7 days
```

<!-- vale off -->
### Garbage collect backups when the Shared Backup is deleted
<!-- vale on -->

Set the `spec.useOwnerReferencesInBackup` to define whether to garbage collect associated backups when a shared backup gets deleted. If set to true, backups are garbage collected when the shared backup gets deleted.

### Control plane selection

To configure which managed control planes in a group you want to create a backup for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

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

[Backup]({{<ref "reference/space-api#Backup-spec">}}) is a [group-scoped]({{<ref "mcp/groups">}}) resource that causes a single backup to occur for a control planes in its corresponding group.

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

The `spec.excludedResources` field is an array of resource names to exclude from the manual backup.

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

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is in seconds.

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