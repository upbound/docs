---
title: WatchOperation 
sidebar_position: 4
description: Understand Crossplane's WatchOperation workflow
---

A _WatchOperation_ creates one-time [Operations][operations] in response to state changes on observed resources.

WatchOperation is meant for performing an action such as the backup of a resource. CronOperation runs an Operation periodically on a given schedule, written in [Cron][cron] format.

## Run a WatchOperation example

Here is an example WatchOperation config. It watches for a Cluster to become ready before scheduling an App object.

```yaml
apiVersion: ops.crossplane.io/v1alpha1
kind: WatchOperation
metadata:
  name: schedule-app-to-cluster
spec:
  watch:
    apiVersion: example.org/v1
    kind: App
    matchLabels:
      ops.crossplane.io/auto-schedule: "true"
  operationTemplate:
    # Omitted for brevity.
```

## Writing a WatchOperation spec

TODO

## Next steps

Read the API documentation for WatchOperation for more details.

[operations]: overview
[cron]: https://en.wikipedia.org/wiki/Cron
[compositions]: /manuals/uxp/composition/overview
[ssa]: https://kubernetes.io/docs/reference/using-api/server-side-apply/
[functionMarketplace]: https://marketplace.upbound.io/functions