---
title: Metrics
weight: 60
description: "Metrics are essential for monitoring Crossplane's operations, helping to quickly identify and resolve potential issues."
---

Crossplane produces [Prometheus style metrics](https://prometheus.io/docs/introduction/overview/#what-are-metrics) for effective monitoring and alerting in your environment.
These metrics are essential for helping to identify and resolve potential issues.
This page offers explanations of all these metrics gathered from Crossplane.
Understanding these metrics helps you maintain the health and performance of your resources.
Please note that this document focuses on Crossplane specific metrics and doesn't cover standard Go metrics.

To enable the export of metrics it's necessary to configure the `--set metrics.enabled=true` option in the [helm chart](https://github.com/crossplane/crossplane/blob/main/cluster/charts/crossplane/README.md#configuration).
<div id="value">
```yaml
metrics:
  enabled: true
```
</div>

These Prometheus annotations expose the metrics:
<div id="deployment">
```yaml
prometheus.io/path: /metrics
prometheus.io/port: "8080"
prometheus.io/scrape: "true"
```
</div>    

| Metric Name | Description | Further Explanation |
| --- | --- | --- |
| <Hover label="certwatcher_read_certificate_errors_total" line="1">certwatcher_read_certificate_errors_total</Hover> | Total number of certificate read errors |  |
| <Hover label="certwatcher_read_certificate_total" line="2">certwatcher_read_certificate_total</Hover> | Total number of certificate reads |  |
| <Hover label="composition_run_function_seconds_bucket" line="3">composition_run_function_seconds_bucket</Hover> | Histogram of RunFunctionResponse latency (seconds) |  |
| <Hover label="controller_runtime_active_workers" line="4">controller_runtime_active_workers</Hover> | Number of used workers per controller | The number of threads processing jobs from the work queue. |
| <Hover label="controller_runtime_max_concurrent_reconciles" line="5">controller_runtime_max_concurrent_reconciles</Hover> | Maximum number of concurrent reconciles per controller | Describes how reconciles can happen in parallel. |
| <Hover label="controller_runtime_reconcile_errors_total" line="6">controller_runtime_reconcile_errors_total</Hover> | Total number of reconciliation errors per controller | A counter that counts reconcile errors. Sharp or non stop rising of this metric might be a problem. |
| <Hover label="controller_runtime_reconcile_time_seconds_bucket" line="7">controller_runtime_reconcile_time_seconds_bucket</Hover> | Length of time per reconciliation per controller |  |
| <Hover label="controller_runtime_reconcile_total" line="8">controller_runtime_reconcile_total</Hover> | Total number of reconciliations per controller |  |
| <Hover label="controller_runtime_webhook_latency_seconds_bucket" line="9">controller_runtime_webhook_latency_seconds_bucket</Hover> | Histogram of the latency of processing admission requests |  |
| <Hover label="controller_runtime_webhook_requests_in_flight" line="10">controller_runtime_webhook_requests_in_flight</Hover> | Current number of admission requests served |  |
| <Hover label="controller_runtime_webhook_requests_total" line="11">controller_runtime_webhook_requests_total</Hover> | Total number of admission requests by HTTP status code |  |
| <Hover label="rest_client_requests_total" line="12">rest_client_requests_total</Hover> | Number of HTTP requests, partitioned by status code, method, and host |  |
| <Hover label="workqueue_adds_total" line="13">workqueue_adds_total</Hover> | Total number of adds handled by `workqueue` |  |
| <Hover label="workqueue_depth" line="14">workqueue_depth</Hover> | Current depth of `workqueue` |  |
| <Hover label="workqueue_longest_running_processor_seconds" line="15">workqueue_longest_running_processor_seconds</Hover> | The number of seconds has the longest running processor for `workqueue` been running |  |
| <Hover label="workqueue_queue_duration_seconds_bucket" line="16">workqueue_queue_duration_seconds_bucket</Hover> | How long in seconds an item stays in `workqueue` before requested | The time it takes from the moment a job enter the `workqueue` until the processing of this job starts. |
| <Hover label="workqueue_retries_total" line="17">workqueue_retries_total</Hover> | Total number of retries handled by `workqueue` |  |
| <Hover label="workqueue_unfinished_work_seconds" line="18">workqueue_unfinished_work_seconds</Hover> | The number of seconds of work done that's in progress and hasn't observed by `work_duration`. Large values means stuck threads. |  |
| <Hover label="workqueue_work_duration_seconds_bucket" line="19">workqueue_work_duration_seconds_bucket</Hover> | How long in seconds processing an item from `workqueue` takes | The time it takes from the moment the job start until it finish (either successfully or with an error). |
| <Hover label="crossplane_managed_resource_exists" line="20">crossplane_managed_resource_exists</Hover> | The number of managed resources that exist |  |
| <Hover label="crossplane_managed_resource_ready" line="21">crossplane_managed_resource_ready</Hover> | The number of managed resources in `Ready=True` state |  |
| <Hover label="crossplane_managed_resource_synced" line="22">crossplane_managed_resource_synced</Hover> | The number of managed resources in `Synced=True` state |  |
| <Hover label="upjet_resource_ext_api_duration_bucket" line="23">upjet_resource_ext_api_duration_bucket</Hover> | Measures in seconds how long it takes a Cloud SDK call to complete |  |
| <Hover label="upjet_resource_external_api_calls_total" line="24">upjet_resource_external_api_calls_total</Hover> | The number of external API calls | The number of calls to cloud providers, with labels describing the endpoints resources. |
| <Hover label="upjet_resource_reconcile_delay_seconds_bucket" line="25">upjet_resource_reconcile_delay_seconds_bucket</Hover> | Measures in seconds how long the reconciles for a resource delay from the configured poll periods |  |
| <Hover label="crossplane_managed_resource_deletion_seconds_bucket" line="26">crossplane_managed_resource_deletion_seconds_bucket</Hover> | The time it took to delete a managed resource |  |
| <Hover label="crossplane_managed_resource_first_time_to_readiness_seconds_bucket" line="27">crossplane_managed_resource_first_time_to_readiness_seconds_bucket</Hover> | The time it took for a managed resource to become ready first time after creation |  |
| <Hover label="crossplane_managed_resource_first_time_to_reconcile_seconds_bucket" line="28">crossplane_managed_resource_first_time_to_reconcile_seconds_bucket</Hover> | The time it took to detect a managed resource by the controller |  |
| <Hover label="upjet_resource_ttr_bucket" line="29">upjet_resource_ttr_bucket</Hover> | Measures in seconds the `time-to-readiness` `(TTR)` for managed resources |  |
