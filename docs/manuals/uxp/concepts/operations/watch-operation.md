---
title: WatchOperation 
sidebar_position: 4
description: Understand Crossplane's WatchOperation workflow
---

A _WatchOperation_ creates one-time [Operations][operations] in response to state changes on observed resources.

WatchOperation is designed to monitor resources and respond to state changes. Unlike CronOperation which runs on a schedule, WatchOperation triggers actions when specific changes are detected in the watched resources.

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

The `spec.watch` and `spec.operationTemplate` fields are required.