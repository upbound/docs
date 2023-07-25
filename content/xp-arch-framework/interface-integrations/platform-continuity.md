---
title: "Platform Continuity"
weight: 9
description: "A guide for how to integrate control planes with DR tools"
---

Platform continuity is a topic that encompasses everything you need to do to keep your platform up and running. This content is currently focused on providing guidance for how to perform disaster recovery with Crossplane.

## Disaster Recovery

[Velero](https://velero.io/) is a popular open source solution in the Kubernetes ecosystem to safely perform backup and restore operations against Kubernetes cluster resources. We recommend using Velero in any disaster recovery plan for your Crossplane control planes. We will cover best practices for using Velero in the context of Crossplane.

### In the context of Crossplane

It's important to remember:

1. Crossplane is concerned with ensuring the configuration of your resource. 
2. Crossplane **isn't concerned** with the _internal_ state of your resources. 

Crossplane is concerned with enforcing two things:

1. the resources you declared exist.
2. the configuration of those resources matches what you declared. If it doesn't, it will attempt to reconcile to the desired state.

Crossplane **isn't** concerned with the state of what's happening _within_ the resource. For example, consider a CloudSQL instance created with Crossplane using the following manifest:

```yaml
apiVersion: sql.gcp.upbound.io/v1beta1
kind: DatabaseInstance
spec:
  forProvider:
    databaseVersion: MYSQL_5_7
    region: us-central1
    settings:
      - diskSize: 20
        tier: db-f1-micro
```

Crossplane will ensure whatever instance gets created in GCP has a disk size of 20 GB and that it uses MySQL version 5.7; it will continuously ensure the configuration of the instance matches these parameters. However, Crossplane has no involvement with what goes on _inside_ the CloudSQL instance. If someone was using this database to store records of users for a line-of-business app, Crossplane is oblivious.

Likewise, if your control plane fails and goes offline, that doesn't necessarily mean the resources under management by that control plane will be affected--it means the configuration of those resources won't be reconciled while the control plane is offline, so configuration drift could occur. Using the database example above, if the control plane managing the CloudSQL instance fails, that doesn't necessarily mean your database is now offline. 

### What State to Capture vs Exclude

You should configure Velero to capture state that's only relevant for Crossplane. The following is a sample Velero backup object that illustrates which Kubernetes resources are applicable to be backed up and which ones can be safely excluded:

```yaml
apiVersion: velero.io/v1
kind: Backup
metadata:
  name: backup-with-data
  namespace: velero
spec:
  includedNamespaces:
  - '*'
  excludedNamespaces:
  - kube-node-lease
  - kube-system
  - kube-public
  - velero
  excludedResources:
  - bindings
  - componentstatuses
  - endpoints
  - events
  - limitranges
  - nodes
  - persistentvolumeclaims
  - persistentvolume
  - pods
  - podtemplates
  - replicationcontrollers
  - resourcequotas
  - services
  - daemonsets
  - deployments
  - replicasets
  - statefulsets
  - cronjobs
  - jobs
  includeClusterResources: true
  snapshotVolumes: false
  metadata: {}
  ttl: 720h0m0s
 ```

 We recommend configuring Velero to store the captured backup state for all your control planes in a single, global bucket or blob.

{{< hint "tip" >}}
Instead of excluding all other resources, you could include only the resources that you want to backup. However, this would require you to list _all_ resources types--including the CRDs introduced by providers--which isn't possible/feasible. Hence, we recommend doing it the way we show above.
{{< /hint >}}

### Backup Schedules

We recommend establishing a Velero schedule to periodically take snapshots for each control plane. THe following is a sample Velero schedule object that illustrates a recommended schedule:

```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: daily-backup
  namespace: velero
spec:
  schedule: '@every 24h'
  template:
    includedNamespaces:
    - '*'
    excludedNamespaces:
    - kube-node-lease
    - kube-system
    - kube-public
    - velero
    excludedResources:
    - bindings
    - componentstatuses
    - endpoints
    - events
    - limitranges
    - nodes
    - persistentvolumeclaims
    - persistentvolume
    - pods
    - podtemplates
    - replicationcontrollers
    - resourcequotas
    - services
    - daemonsets
    - deployments
    - replicasets
    - statefulsets
    - cronjobs
    - jobs
    includeClusterResources: true
    snapshotVolumes: false
    metadata: {}
    ttl: 168h0m0s
```

For each control plane that you create, create three Velero `Schedule` objects illustrated above with the following schedules:

- Hourly
- Daily
- Weekly

We think this is a good baseline, but you can customize the frequency of the backups according to the Recovery Point Objective (RPO) for your platform. If you need to be able to restore state more frequently, you will want to snapshot more frequently.

### Restore Control Plane from state

To restore backup state into a new cluster:

1. Ensure that Crossplane and providers aren't running in a new cluster. Otherwise, the ordering between managed resources, composites, and claims becomes critical. Failure to do so may result in race conditions and, for example, duplication of managed resources.
2. Install Velero and configure it to use the backup data source.
3. Restore the backed up resources to the new cluster.
4. Scale up the provider deployments to one in the new cluster.
5. During the backup and restoration process Velero preserves owner references, resource states, and external names of managed resources. Therefore from here on, the reconciliation process should kick in and proceed as if there were no changes.
