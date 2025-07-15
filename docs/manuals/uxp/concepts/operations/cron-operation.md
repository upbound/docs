---
title: CronOperation 
sidebar_position: 3
description: Understand Crossplane's CronOperation workflow
---

A _CronOperation_ creates one-time [Operations][operations] on a repeating schedule.

CronOperation is meant for performing a regular scheduled action such as the backup of a resource. CronOperation runs an Operation periodically on a given schedule, written in [Cron][cron] format.

## Run a CronOperation example

Here is an example CronOperation config. It executes a rolling verison upgrade for a fleet of Kubernetes Clusters.

```yaml
apiVersion: ops.crossplane.io/v1alpha1
kind: CronOperation
metadata:
  name: cluster-rolling-upgrade
spec:
  schedule: "0 12 * * *"
  startDeadline: 10m
  successfulHistoryLimit: 3
  failedHistoryLimit: 3
  concurrencyPolicy: Forbid
  operationTemplate:
    spec:
      retryLimit: 5
      mode: Pipeline
      pipeline:
      - step: rolling-upgrade
        functionRef:
          name: function-rolling-upgrade
        input:
          targets:
            apiVersion: example.org/v1
            kind: KubernetesCluster
            selector:
              matchLabels:
                ops.crossplane.io/eligible-for-rolling-update: "true"
          batches:
          - 0.01 
          - 0.1
          - 0.5
          - 1.0
          fromVersions:
          - "v1.29"
          toVersion: "v1.30"
          versionField: spec.version
          healthyConditions:
          - Synced
          - Ready
```
An Operation isn't long-running - it's akin to a single reconcile loop. So to upgrade a fleet of clusters in four batches you'd want the Operation to run (at least) four times, with each Operation handling the next largest batch.
## Writing a CronOperation spec
The `spec.schedule` field is required. The value of the field follows the [Cron][cron] syntax.

## Next steps

Read the API documentation for CronOperation for more details.

[operations]: overview
[cron]: https://en.wikipedia.org/wiki/Cron
[watchOperation]: /build/control-plane-projects
[compositions]: /uxp/composition/overview
[ssa]: https://kubernetes.io/docs/reference/using-api/server-side-apply/
[functionMarketplace]: https://marketplace.upbound.io/functions