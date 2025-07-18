---
title: Backup and Restore
description: "Learn how to use the built-in backup and restore controller"
sidebar_position: 15
tier: "standard"
---

<Standard />

This guide explains how to create a backup of your control plane and restore it
to that moment in time.

## Prerequisites

* a running Upbound Crossplane control plane cluster
* a valid **Standard** license applied to your control plane
* resources deployed and managed in the control plane
* Cloud provider credentials and secrets configured

Maintaining a healthy backup cadence is useful to prevent data loss or
operational downtime in the event of accidental deletion, human error, or
upstream failures.


## Backup

A control plane backup requires:
- a `BackupConfig` that defines your cloud provider object store and secret
- a `Backup` that specifies your backup name and deletion policy


UXP can capture your control plane and stores the backup information in a cloud
object store with a `BackupConfig`

Upbound Crossplane needs a `BackupConfig` object that defines your provider, the
name of your backup bucket and the credentials associated with that cloud
account.

### Create a `BackupConfig` object

To backup your control plane to your cloud provider object store, you need to
create a `BackupConfig` and apply it to your cluster:

```yaml
apiVersion: admin.upbound.io/v1beta1
kind: BackupConfig
metadata:
  name: default
spec:
  objectStorage:
    provider: AWS
    bucket: luop-backup-bucket
    config:
      endpoint: s3.us-west-1.amazonaws.com
    credentials:
      source: Secret
      secretRef:
        name: aws-secret
        key: my-aws-secret
```

The **required** properties of this object are:

* `spec.objectStorage` to configure the bucket name and object store endpoint
* `spec.objectStorage.credentials` to pass cloud provider secrets


### Create a `Backup` object

To capture the control plane state, you need to create a `Backup` and apply it
to your cluster to kick off the actual backup task:

```yaml
apiVersion: admin.upbound.io/v1beta1
kind: Backup
metadata:
  name: <your_backup_name>
spec:
  configRef:
    name: default
  deletionPolicy: Delete
```

When you apply this `Backup`, TODO what does UXP actually do under the hood?
(pauses resources, then...?)

Verify the backup:

```shell
kubectl get backup
```

## Restore

A control plane restore operation requires:

* a `Restore` object to kick off the restore operation

### Create a `Restore` object

Your `Restore` object specifies the backup name you specified in the previous
step:

```yaml

apiVersion: admin.upbound.io/v1beta1
kind: Restore
metadata:
  name: my-restore
spec:
  configRef:
    name: default
  backupName: <your_backup_name>-backup
```

Verify the restore:

```shell
kubectl get restore
```

To verify your resources:

```shell
kubectl get composite
```


## Next steps

For more information , review the
TODO links and next steps
