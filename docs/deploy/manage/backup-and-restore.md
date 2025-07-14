---
title: Backup and restore
sidebar_position: 13
description: Configure and manage backups in your Upbound Space.
tier: "standard"
---

:::warning
As of Spaces `v.12.0`, this feature is enabled by default.
To disable in a self-hosted Space, pass the `features.alpha.sharedBackup.enabled=false` as a Helm chart value.
`--set "features.alpha.sharedBackup.enabled=false"`
:::

Upbound's _Shared Backups_ is a built-in backup and restore feature. Shared Backups lets you configure automatic schedules for taking snapshots of your control planes. You can restore data from these backups by making new control planes. This guide explains how to use Shared Backups for disaster recovery or upgrade scenarios.

## Benefits

The Shared Backups feature provides the following benefits:

* Automatic backups for control planes without any operational overhead
* Backup schedules for multiple control planes in a group
* Shared Backups are available across all hosting environments of Upbound (Disconnected, Connected or Cloud Spaces)


## Configure a Shared Backup Config

[SharedBackupConfig][sharedbackupconfig] is a [group-scoped][group-scoped] resource. You should create them in a group containing one or more control planes. This resource configures the storage details and provider. Whenever a backup executes (either by schedule or manually initiated), it references a SharedBackupConfig to tell it where store the snapshot.


### Backup config provider


The `spec.objectStorage.provider` and `spec.objectStorage.config` fields configures:

* The object storage provider
* The path to the provider
* The credentials needed to communicate with the provider

You can only set one provider. Upbound currently supports AWS, Azure, and GCP as providers.


`spec.objectStorage.config` is a freeform map of configuration options for the object storage provider. See [Thanos object storage][thanos-object-storage] for more information on the formats for each supported cloud provider. `spec.bucket` and `spec.provider` overrides the required values in the config.


#### AWS as a storage provider

:::important
For Cloud Spaces, static credentials are currently the only supported auth method.
:::

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


This example assumes you've already created an S3 bucket called "spaces-backup-bucket" in AWS `eu-west-2` region. The account credentials to access the bucket should exist in a secret of the same namespace as the Shared Backup Config.

#### Azure as a storage provider

:::important
For Cloud Spaces, static credentials are currently the only supported auth method.
:::

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


This example assumes you've already created an Azure storage account called `upbackupstore` and blob `upbound-backups`. The storage account key to access the blob should exist in a secret of the same namespace as the Shared Backup Config.


#### GCP as a storage provider

:::important
For Cloud Spaces, static credentials are currently the only supported auth method.
:::

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


This example assumes you've already created a Cloud bucket called "spaces-backup-bucket" and a service account with access to this bucket. The key file should exist in a secret of the same namespace as the Shared Backup Config.

<!-- vale Google.Headings = NO -->
## Configure a Shared Backup Schedule
<!-- vale Google.Headings = YES -->

[SharedBackupSchedule][sharedbackupschedule] is a [group-scoped][group-scoped-1] resource. You should create them in a group containing one or more control planes. This resource defines a backup schedule for control planes within its corresponding group.

Below is an example of a Shared Backup Schedule that takes backups every day of all control planes having `environment: production` labels:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
  namespace: default
spec:
  schedule: "@daily"
  configRef:
    kind: SharedBackupConfig
    name: default
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        environment: production
```

### Define a schedule

The `spec.schedule` field is a [Cron-formatted][cron-formatted] string. Some common examples are below:


| Entry             | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `@hourly`         | Run once an hour.                                                                                 |
| `@daily`          | Run once a day.                                                                                   |
| `@weekly`         | Run once a week.                                                                                  |
| `0 0/4 * * *`     | Run every 4 hours.                                                                                |
| `0/15 * * * 1-5`  | Run every fifteenth minute on Monday through Friday.                                              |
| `@every 1h30m10s` | Run every 1 hour, 30 minutes, and 10 seconds. Hour is the largest measurement of time for @every. |


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

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is a duration, for example, `168h` for 7 days.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  ttl: 168h # Backup is garbage collected after 7 days
```
:::tip
By default, this setting doesn't delete uploaded files. Review the next section to define
the deletion policy.
:::

### Define the deletion policy

Set the `spec.deletionPolicy` to define backup deletion actions, including the
deletion of the backup file from the bucket. The Deletion Policy value defaults
to `Orphan`. Set it to `Delete` to remove uploaded files in the bucket. For more
information on the backup and restore process, review the [Spaces API
documentation][spaces-api-documentation].

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: daily-schedule
spec:
  ttl: 168h # Backup is garbage collected after 7 days
  deletionPolicy: Delete # Defaults to Orphan
```

### Garbage collect backups when the schedule gets deleted

Set the `spec.useOwnerReferencesInBackup` to garbage collect associated backups when a shared schedule gets deleted. If set to true, backups are garbage collected when the schedule gets deleted.

### Control plane selection

To configure which control planes in a group you want to create a backup schedule for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

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

<!-- vale Google.Headings = NO -->
## Configure a Shared Backup
<!-- vale Google.Headings = YES -->


[SharedBackup][sharedbackup] is a [group-scoped][group-scoped-2] resource. You should create them in a group containing one or more control planes. This resource causes a backups to occur for control planes within its corresponding group.

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

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is a duration, for example, `168h` for 7 days.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: my-backup
spec:
  ttl: 168h # Backup is garbage collected after 7 days
```
<!-- vale Google.Headings = NO -->

### Garbage collect backups on Shared Backup deletion

<!-- vale Google.Headings = YES -->

Set the `spec.useOwnerReferencesInBackup` to define whether to garbage collect associated backups when a shared backup gets deleted. If set to true, backups are garbage collected when the shared backup gets deleted.

### Control plane selection

To configure which control planes in a group you want to create a backup for, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

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

[Backup][backup] is a [group-scoped][group-scoped-3] resource that causes a single backup to occur for a control planes in its corresponding group.

Below is an example of a manual Backup of a control plane:

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

The backup specification `DeletionPolicy` defines backup deletion actions,
including the deletion of the backup file from the bucket. The `Deletion Policy`
value defaults to `Orphan`. Set it to `Delete` to remove uploaded files
in the bucket.
For more information on the backup and restore process, review the [Spaces API documentation][spaces-api-documentation-1].


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

If the control plane doesn't exist, the backup fails after multiple failed retry attempts.

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

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is a duration, for example, `168h` for 7 days.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-backup
spec:
  ttl: 168h # Backup is garbage collected after 7 days
```

## Restore a control plane from a backup

You can restore a control plane's state from a backup. Below is an example of creating a new control plane from a previous backup called `restore-me`:


```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: my-awesome-restored-ctp
  namespace: default
spec:
  restore:
    source:
      kind: Backup
      name: restore-me
```


[group-scoped]: /operate/groups
[group-scoped-1]: /operate/groups
[group-scoped-2]: /operate/groups
[group-scoped-3]: /operate/groups
[sharedbackupconfig]: /apis-cli/spaces-api/#shared-backup-configs
[thanos-object-storage]: https://thanos.io/tip/thanos/storage.md/
[sharedbackupschedule]: /apis-cli/spaces-api/#shared-backup-schedules
[cron-formatted]: https://en.wikipedia.org/wiki/Cron
[spaces-api-documentation]: /apis-cli/spaces-api/
[sharedbackup]: /apis-cli/spaces-api/#shared-backups
[backup]: /apis-cli/spaces-api/#backups
[spaces-api-documentation-1]: /apis-cli/spaces-api/


---
title: Disaster Recovery
sidebar_position: 13
description: Configure Space-wide backups for disaster recovery.
---

:::important
This feature is in preview.

For Connected and Disconnected Spaces, this feature requires Spaces `v1.9.0` and is off by default. To enable, set `features.alpha.spaceBackup.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.spaceBackup.enabled=true"
```
:::

Upbound's _Space Backups_ is a built-in Space-wide backup and restore feature. This guide explains how to configure Space Backups and how to restore from one of them in case of disaster recovery.

This feature is meant for Space administrators. Group or Control Plane users can leverage [Shared Backups][shared-backups] to backup and restore their ControlPlanes.

## Benefits
The Space Backups feature provides the following benefits:

* Automatic backups for all resources in a Space and all resources in control planes, without any operational overhead.
* Backup schedules.
* Selectors to specify resources to backup.

## Prerequisites

Enabled the Space Backups feature in the Space:

- Cloud Spaces: Not accessible to users.
- Connected Spaces: Space administrator must enable this feature.
- Disconnected Spaces: Space administrator must enable this feature.

## Configure a Space Backup Config

[SpaceBackupConfig][spacebackupconfig] is a cluster-scoped resource. This resource configures the storage details and provider. Whenever a backup executes (either by schedule or manually initiated), it references a SpaceBackupConfig to tell it where store the snapshot.


### Backup config provider


The `spec.objectStorage.provider` and `spec.objectStorage.config` fields configures:

* The object storage provider
* The path to the provider
* The credentials needed to communicate with the provider

You can only set one provider. Upbound currently supports AWS, Azure, and GCP as providers.


`spec.objectStorage.config` is a freeform map of configuration options for the object storage provider. See [Thanos object storage][thanos-object-storage] for more information on the formats for each supported cloud provider. `spec.bucket` and `spec.provider` overrides the required values in the config.


#### AWS as a storage provider

This example demonstrates how to use AWS as a storage provider for your backups:

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupConfig
metadata:
  name: default
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
        namespace: upbound-system
        key: creds
```

This example assumes you've already created an S3 bucket called
`spaces-backup-bucket` in the `eu-west-2` AWS region. To access the bucket,
define the account credentials as a Secret in the specified Namespace
(`upbound-system` in this example).

#### Azure as a storage provider

This example demonstrates how to use Azure as a storage provider for your backups:

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupConfig
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
        namespace: upbound-system
        key: creds
```


This example assumes you've already created an Azure storage account called
`upbackupstore` and blob `upbound-backups`. To access the blob,
define the account credentials as a Secret in the specified Namespace
(`upbound-system` in this example).


#### GCP as a storage provider

This example demonstrates how to use Google Cloud Storage as a storage provider for your backups:

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupConfig
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
        namespace: upbound-system
        key: creds
```


This example assumes you've already created a Cloud bucket called
"spaces-backup-bucket" and a service account with access to this bucket. Define the key file as a Secret in the specified Namespace
(`upbound-system` in this example).

<!-- vale Google.Headings = NO -->
## Configure a Space Backup Schedule
<!-- vale Google.Headings = YES -->

[SpaceBackupSchedule][spacebackupschedule] is a cluster-scoped resource. This resource defines a backup schedule for the whole Space.

Below is an example of a Space Backup Schedule running every day. It backs up all groups having `environment: production` labels and all control planes in those groups having `backup: please` labels.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupSchedule
metadata:
  name: daily-schedule
spec:
  schedule: "@daily"
  configRef:
    kind: SpaceBackupConfig
    name: default
  match:
    groups:
      labelSelectors:
      - matchLabels:
          environment: production
    controlPlanes:
      labelSelectors:
      - matchLabels:
          backup: please
```

### Define a schedule

The `spec.schedule` field is a [Cron-formatted][cron-formatted] string. Some common examples are below:

| Entry             | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `@hourly`         | Run once an hour.                                                                                 |
| `@daily`          | Run once a day.                                                                                   |
| `@weekly`         | Run once a week.                                                                                  |
| `0 0/4 * * *`     | Run every 4 hours.                                                                                |
| `0/15 * * * 1-5`  | Run every fifteenth minute on Monday through Friday.                                              |
| `@every 1h30m10s` | Run every 1 hour, 30 minutes, and 10 seconds. Hour is the largest measurement of time for @every. |

### Suspend a schedule

Use `spec.suspend` field to suspend the schedule. It creates no new backups, but allows running backups to complete.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupSchedule
metadata:
  name: daily-schedule
spec:
  suspend: true
...
```

### Garbage collect backups when the schedule gets deleted

Set the `spec.useOwnerReferencesInBackup` to garbage collect associated `SpaceBackup` when a `SpaceBackupSchedule` gets deleted. If set to true, backups are garbage collected when the schedule gets deleted.

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected.

The time to live is a duration, for example, `168h` for 7 days.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackupSchedule
metadata:
  name: daily-schedule
spec:
  ttl: 168h # Backup is garbage collected after 7 days
...
```

## Selecting space resources to backup

By default, a SpaceBackup selects all groups and, for each of them, all control planes, secrets, and any other group-scoped resources.

By setting `spec.match`, you can include only specific groups, control planes, secrets, or other Space resources in the backup.

By setting `spec.exclude`, you can filter out some matched Space API resources from the backup.

### Including space resources in a backup

Different fields are available to include resources based on labels or names:
- `spec.match.groups` to include only some groups in the backup.
- `spec.match.controlPlanes` to include only some control planes in the backup.
- `spec.match.secrets` to include only some secrets in the backup.
- `spec.match.extras` to include only some extra resources in the backup.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackup
metadata:
  name: my-backup
spec:
  configRef:
    kind: SpaceBackupConfig
    name: default
  match:
    groups:
      labelSelectors:
        - matchLabels:
            environment: production
    controlPlanes:
      labelSelectors:
        - matchLabels:
            backup: please
    secrets:
      names:
        - my-secret
    extras:
      - apiGroup: "spaces.upbound.io"
        kind: "SharedBackupConfig"
        names:
          - my-shared-backup
```

### Excluding Space resources from the backup

Use the `spec.exclude` field to exclude matched Space API resources from the backup.

Different fields are available to exclude resources based on labels or names:
- `spec.exclude.groups` to exclude some groups from the backup.
- `spec.exclude.controlPlanes` to exclude some control planes from the backup.
- `spec.exclude.secrets` to exclude some secrets from the backup.
- `spec.exclude.extras` to exclude some extra resources from the backup.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackup
metadata:
  name: my-backup
spec:
  ttl: 168h # Backup is garbage collected after 7 days
  configRef:
    kind: SpaceBackupConfig
    name: default
  match:
    groups:
      labelSelectors:
        - matchLabels:
            environment: production
  exclude:
    groups:
      names:
      - not-this-one-please
```

### Exclude resources in control planes' backups

By default, it backs up all resources in a selected control plane.

Use the `spec.controlPlaneBackups.excludedResources` field to exclude resources from control planes' backups.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackup
metadata:
  name: my-backup
spec:
  ttl: 168h # Backup is garbage collected after 7 days
  configRef:
    kind: SpaceBackupConfig
    name: default
  controlPlaneBackups:
    excludedResources:
    - secrets
    - buckets.s3.aws.upbound.io
```

## Create a manual backup

[SpaceBackup][spacebackup] is a cluster-scoped resource that causes a single backup to occur for the whole Space.

Below is an example of a manual SpaceBackup:

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackup
metadata:
  name: my-backup
spec:
  configRef:
    kind: SpaceBackupConfig
    name: default
  deletionPolicy: Delete
```


The backup specification `DeletionPolicy` defines backup deletion actions,
including the deletion of the backup file from the bucket. The `Deletion Policy`
value defaults to `Orphan`. Set it to `Delete` to remove uploaded files
in the bucket.
For more information on the backup and restore process, review the [Spaces API documentation][spaces-api-documentation].

### Set the time to live

Set the `spec.ttl` field to define the time to live for the backup. After this time, the backup is eligible for garbage collection. If this field isn't set, the backup isn't garbage collected. The time to live is a duration, for example, `168h` for 7 days.

```yaml
apiVersion: admin.spaces.upbound.io/v1alpha1
kind: SpaceBackup
metadata:
  name: my-backup
spec:
  ttl: 168h # Backup is garbage collected after 7 days
...
```

## Restore from a space backup

Space Backup and Restore focuses only on disaster recovery. The restore procedure assumes a new Space installation with no existing resources. The restore procedure is idempotent, so you can run it multiple times without any side effects in case of failures.

To restore a Space from an existing Space Backup, follow these steps:

1. Install Spaces from scratch as needed.
2. Create a `SpaceBackupConfig` as needed to access the SpaceBackup from the object storage, for example named `my-backup-config`.
3. Select the backup you want to restore from, for example `my-backup`.
4. Run the following command to restore the Space:

```shell
export SPACE_BACKUP_CONFIG=my-backup-config
export SPACE_BACKUP=my-backup
kubectl exec -ti -n upbound-system deployments/spaces-controller -c spaces -- hyperspace restore $SPACE_BACKUP $SPACE_BACKUP_CONFIG
```

### Restore specific control planes

:::important
This feature is available from Spaces v1.11.
:::

Instead of restoring the whole Space, you can choose to restore specific control planes
from a backup using the `--controlplanes` flag. You can also use
the `--skip-space-restore` flag to skip restoring Space objects. 
This allows Spaces admins to restore individual control planes without 
needing to restore the entire Space.

```shell
export SPACE_BACKUP_CONFIG=my-backup-config
export SPACE_BACKUP=my-backup
kubectl exec -ti -n upbound-system deployments/spaces-controller -c spaces 
-- hyperspace restore $SPACE_BACKUP $SPACE_BACKUP_CONFIG --controlplanes default/ctp1,default/ctp2 --skip-space-restore
```


[shared-backups]: /deploy/backup-and-restore
[spacebackupconfig]: /apis-cli/spaces-api/
[thanos-object-storage]: https://thanos.io/tip/thanos/storage.md/
[spacebackupschedule]: /apis-cli/spaces-api/
[cron-formatted]: https://en.wikipedia.org/wiki/Cron
[spacebackup]: /apis-cli/spaces-api/
[spaces-api-documentation]: /apis-cli/spaces-api/

