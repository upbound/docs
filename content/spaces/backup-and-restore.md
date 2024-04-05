---
title: Backup and restore Upbound Spaces
weight: 120
description: Enable and manage backups in your Upbound Space.
---

{{< hint "important" >}}
This functionality is in preview and requires Spaces `v1.3.0`.
{{< /hint >}}


Upbound allows you to configure a backup and restore process. This feature helps manage your important control plane data and ensures security and availability best practices.

## Usage

### Backup

#### Create a backup secret

Before you begin the backup process, you need to create a secret for your Kubernetes configuration to allow for communication between your backup and your restored configuration.

```bash
KUBECONFIG=/tmp/ctp.yaml kubectl create secret generic super-secret-secret -n default --from-literal=password=supersecret
```


#### Shared backup

You can define the `SharedBackupConfig` for multiple control planes in a configuration file like the example below:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupConfig
metadata:
  name: default
  namespace: default
spec:
  objectStorage:
    provider: AWS
    bucket: -restore-test
    config:
      endpoint: s3.eu-west-2.amazonaws.com
      region: eu-west-2
    credentials:
      source: Secret
      secretRef:
        name: bucket-creds
        key: creds
```

Then create a `ControlPlane` with that secret reference:

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

This example configuration results in both control planes backed up and uploaded to the S3 endpoint.

### Create a scheduled backup

Instead of a one-time backup with the `SharedBackup` kind, you can create a `SharedBackupSchedule`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedBackupSchedule
metadata:
  name: custom-schedule
  namespace: default
spec: "@every 1m"
  schedule:
  controlPlaneSelector:
    labelSelectors:
    - matchLabels:
        org: foo
```

Both control planes with the matching labels will be backed up every minute.

#### Single backup

You can create a backup of your current ControlPlane.

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

Once your ControlPlane indicates the backup is complete, you can delete the ControlPlane:

```bash
kubectl wait backup my-awesome-ctp-backup --for condition=Completed=True --timeout=3600s && \
kubectl delete controlplane my-awesome-ctp
```

### Restore

To restore from a backup, check the `ControlPlane` to make sure it is ready.

```bash
kubectl wait controlplane my-awesome-ctp --for condition=Ready=True --timeout=3600s && \
kubectl get secret kubeconfig-my-awesome-ctp -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/ctp.yaml
```


Next, initiate the restore process from the backup you created previously.

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

- Deleting the `SharedBackup` and `SharedBackupSchedule` does not automatically delete the created backups, unless `useOwnerReferencesInBackup` is set to true.
- The `DeletionPolicy` in the backup specification dictates the behavior when a backup is deleted, including the deletion of the backup file from the bucket.

For more information on the backup and restore process, check out the [Spaces API documentation](https://docs.upbound.io/reference/space-api/).