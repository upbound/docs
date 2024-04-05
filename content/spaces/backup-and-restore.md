---
title: Backup and restore
weight: 130
description: Enable and manage backups in your Upbound Space.
---

{{< hint "important" >}}
This feature is in preview, requires Spaces `v1.3.0`, and is off by default. To enable, set `features.alpha.sharedBackup.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedBackup.enabled=true"
```
{{< /hint >}}


Upbound allows you to configure backup and restore for control planes in the Space. This feature helps manage your important control plane data and ensures security and availability best practices.

## Usage

### Backup

#### Create a backup secret

Before you can configure backup schedules and initiate manual backups, you need to create a secret containing auth credentials to allow for communication between the Space and a storage target, such as AWS S3.

```bash
KUBECONFIG=/tmp/space-cluster.yaml kubectl create secret generic super-secret-secret -n default --from-literal=password=supersecret
```

#### Shared backup

You can define a `SharedBackupConfig` for multiple control planes. With shared backups, control planes share a common storage source for the backups that get created. The example below demonstrates how to create a shared backup:

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

Then create a managed control plane with reference to the `SharedBackupConfig`.

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    org: foo
  name: my-awesome-ctp
  namespace: default
spec:
  backup:
    sharedBackupConfigRef:
      name: default
  writeConnectionSecretToRef:
    name: kubeconfig-my-awesome-ctp
---
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  labels:
    org: foo
  name: my-second-awesome-ctp
  namespace: default
spec:
  backup:
    sharedBackupConfigRef:
      name: default
  writeConnectionSecretToRef:
    name: kubeconfig-my-second-awesome-ctp
```

Then a `SharedBackup`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackup
metadata:
  name: custom-shared-backup
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        org: foo
```

This example results in both control planes backed up and uploaded to the S3 endpoint.

### Create a scheduled backup

Instead of a one-time backup with the `SharedBackup` kind, you can create a `SharedBackupSchedule`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: custom-schedule
  namespace: default
spec: "@every 1h"
  schedule:
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        org: foo
```

This schedule backs up control planes with matching labels every hour.

#### Single backup

You can create a manual backup of a managed control plane from the Space cluster.

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: Backup
metadata:
  name: my-awesome-ctp-backup
  namespace: default
spec:
  controlPlane: my-awesome-ctp
  deletionPolicy: Delete
```

Once your Space indicates the backup is complete, you can delete the managed control plane:

```bash
kubectl wait backup my-awesome-ctp-backup --for condition=Completed=True --timeout=3600s && \
kubectl delete controlplane my-awesome-ctp
```

### Restore

<!-- vale off -->
To restore from a backup, check the `ControlPlane` to make sure it's ready.
<!-- vale on -->

```bash
kubectl wait controlplane my-awesome-ctp --for condition=Ready=True --timeout=3600s && \
kubectl get secret kubeconfig-my-awesome-ctp -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/ctp.yaml
```


Next, start the restore process from the backup you created.

```yaml
---
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
      name: my-awesome-ctp-backup
  backup:
    sharedBackupConfigRef:
      name: default
  writeConnectionSecretToRef:
    name: kubeconfig-my-awesome-restored-ctp
```

## Considerations

- Deleting the `SharedBackup` and `SharedBackupSchedule` resources don't automatically delete the created backups, unless `useOwnerReferencesInBackup` is `true`.
<!-- vale off -->
- The `DeletionPolicy` in the backup specification dictates the behavior when a backup is deleted, including the deletion of the backup file from the bucket.

For more information on the backup and restore process, check out the [Spaces API documentation](https://docs.upbound.io/reference/space-api/).
<!-- vale on -->
