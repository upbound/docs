---
title: Observability
sidebar_position: 50
description: A guide for how to use the integrated observability pipeline feature
  in a Space.
---

:::important
This feature is in preview and by default in Cloud Spaces. To enable
it in a self-hosted Space, set `features.alpha.observability.enabled=true` when
installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.observability.enabled=true" \
```

:::

Upbound offers a built-in feature to help you collect and export logs, metrics, and traces for everything running in a Control Plane. Upbound provides an integrated observability pipeline built on the [OpenTelemetry][opentelemetry] project.

## Benefits

The observability feature allows you to:

- collect, process, and expose telemetry data in control planes.
- deploy a collector per control plane.
- Pass data to external observability backends, such as Datadog, New Relic, and more.

## How it works

The pipeline deploys [OpenTelemetry Collectors][opentelemetry-collectors] to collect, process, and expose telemetry data from control planes. Upbound deploys a collector per control plane, defined by a _SharedTelemetryConfig_ set up at the group level. Control plane collectors pass their data to external observability backends defined in the _SharedTelemetryConfig_.

:::important
From Spaces v1.13 and beyond.
The data collected by SharedTelemetry contains just telemetry from user-facing control plane workloads, such as Crossplane, providers and functions.

Self-hosted Spaces users can add control plane system workloads such as the `api-server`, `etcd` by setting the `observability.collectors.includeSystemTelemetry` Helm flag to true.
:::

<!-- vale Google.Headings = NO -->

## SharedTelemetryConfig

<!-- vale Google.Headings = YES -->

_SharedTelemetryConfig_ is a custom resource that defines the telemetry configuration for a group of control planes. This resources allows you to specify the exporters and pipelines your control planes use to send telemetry data to your external observability backends.

 The following is an example of a _SharedTelemetryConfig_ resource that sends metrics and traces to New Relic:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: newrelic
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  exporters:
    otlphttp:
      endpoint: https://otlp.nr-data.net
      headers:
        api-key: YOUR_API_KEY
  exportPipeline:
    metrics: [otlphttp]
    traces: [otlphttp]
    logs: [otlphttp]
```

The `controlPlaneSelector` field specifies the control planes that use this configuration.
The `exporters` field specifies the configuration for the exporters. Each exporter configuration is unique and corresponds to its [OpenTelemetry Collector configuration][opentelemetry-collector-configuration].
The `exportPipeline` field specifies the control plane pipelines that send telemetry data to the exporters. The `metrics`, `traces` and `logs` fields specify the names of the pipelines the control planes use to send metrics, traces, and logs respectively. The names of the pipelines correspond to the `exporters` in the OpenTelemetry Collector [service pipeline configuration][service-pipeline-configuration].

### Usage

_SharedTelemetryConfigs_ are group-scoped resources. This lets you configure telemetry collection for each group of control planes in a Space.

:::important
Your control plane can only use a single _SharedTelemetryConfig_. If you create multiple _SharedTelemetryConfigs_ that select the same control plane, the one applied first takes precedence. The other _SharedTelemetryConfigs_ fail to provision in the control plane due to conflict.
:::

Currently supported exporters are:
- `datadog` (review the OpenTelemetry [documentation][documentation] for configuration details)
- `otelhttp` (general-use exporter, used by New Relic among others, review the New Relic [documentation][documentation-1] for configuration details)

The example below shows how to configure a _SharedTelemetryConfig_ resource to send metrics, traces and logs to Datadog:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: datadog
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  exporters:
    datadog:
      api:
        site: ${DATADOG_SITE}
        key: ${DATADOG_API_KEY}
  exportPipeline:
    metrics: [datadog]
    traces: [datadog]
    logs: [datadog]
```

### Control plane selection

To configure which control planes in a group you want to provision a telemetry collector into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: telemetry-collector
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: telemetry-collector
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: telemetry-collector
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

### Sensitive data

:::important
This feature is available from Spaces v1.10
:::

To avoid exposing sensitive data in the _SharedTelemetryConfig_ resource, use
Kubernetes secrets to store the sensitive data and reference the secret in the
_SharedTelemetryConfig_ resource.

Create the secret in the same namespace/group as the _SharedTelemetryConfig_
resource. The example below uses `kubectl create secret` to create a new secret:

```bash
kubectl create secret generic sensitive -n <STC_NAMESPACE>  \
    --from-literal=apiKey='YOUR_API_KEY'
```

Next, reference the secret in the _SharedTelemetryConfig_ resource:

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: newrelic
spec:
  configPatchSecretRefs:
    - name: sensitive
      key: apiKey
      path: exporters.otlphttp.headers.api-key
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  exporters:
    otlphttp:
      endpoint: https://otlp.nr-data.net
      headers:
        api-key: dummy # This value is replaced by the secret value, can be omitted
  exportPipeline:
    metrics: [otlphttp]
    traces: [otlphttp]
    logs: [otlphttp]
```

The `configPatchSecretRefs` field in the `spec` specifies the secret `name`,
`key`, and `path` values to inject the secret value in the
_SharedTelemetryConfig_ resource.

### Telemetry processing

:::important
This feature is available from Spaces v1.11.
:::

The _SharedTelemetryConfig_ resource allows you to configure a processing 
pipeline for the telemetry data collected by the OpenTelemetry Collector. 
Like `spec.exporters`, the `spec.processors` field allows you to
configure the processors that transform the telemetry data for the exporters. It follows the OpenTelmetry Collector [processor configuration][processor-configuration].

For now, the only supported processor is the [transform processor][transform-processor].

Similarly to how `spec.exportPipeline` defines the pipeline for `spec.exporters`, `spec.processorPipeline` defines the pipeline for `spec.processors`.

#### Telemetry transforms

<!-- vale gitlab.SentenceLength = NO -->
The [transform processor][transform-processor-2] allows for the transformation of telemetry data
using the [OpenTelemetry Transformation Language][opentelemetry-transformation-language].
<!-- vale gitlab.SentenceLength = YES -->

The transform processor can transform metrics, logs, and traces at different scopes and allows you to use conditionals to select specific data.

Example of useful transformations include:

- adding, removing, and modifying attributes. Renaming, concatenating multiple labels, etc
- converting metric types (gauge to sum)
- for more information, review the [transform processor README][transform-processor-readme]

Important considerations:

- Your context determines the transformation scope.
- `conditions` are "any match condition" field. If your data meets any condition, the transformation applies to that data.

Some useful examples:

##### Adding an attribute/label to metrics

```yaml
apiVersion: observability.spaces.upbound.io/v1alpha1
kind: SharedTelemetryConfig
metadata:
  name: datadog
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  exporters:
    datadog:
      api:
        site: ${DATADOG_SITE}
        key: ${DATADOG_API_KEY}
  exportPipeline:
    metrics: [datadog]
    traces: [datadog]
    logs: [datadog]
  processors:
    transform:
      error_mode: ignore
      metric_statements:
        - context: datapoint
          statements:
            - set(attributes["newLabel"], "someLabel")
  processorPipeline:
    metrics: [transform]
```

You can also add the label only to a specific metric:

```yaml
...
processors:
  transform:
    metric_statements:
      - context: datapoint
        statements:
          - set(attributes["newLabel"], "someLabel") where metric.name == "crossplane_managed_resource_ready"
...
```

##### Removing labels

From metrics:
```yaml
...
- processors:
  transform:
    metric_statements:
      - context: datapoint
        statements:
          - delete_key(attributes, "kubernetes_namespace")
...
```

From logs:
```yaml
- processors:
  transform:
    log_statements:
      - context: log
        statements:
          - delete_key(attributes, "log.file.name")
```

##### Modifying logs

```yaml
...
- processors:
  transform:
    log_statements:
      - context: log
        statements:
          - set(attributes["original"], body) # save the original log message
          - set(body, Concat(["log message:", body], " ")) # add a prefix to the log message
...
```

##### References

For more information, review the following transform processor documentation:
- [OpenTelemetry Transformation Language][opentelemetry-transformation-language-3]
- [OpenTelemetry Transformation Language Functions][opentelemetry-transformation-language-functions]
- [OpenTelemetry Transformation Language Contexts][opentelemetry-transformation-language-contexts]
- An interesting [guide on `OTTL`][guide-on-ottl]

### Status

If successful, Upbound creates the _SharedTelemetryConfig_ resource and provisions the OpenTelemetry Collector for the selected control plane. To see the status, run `kubectl get stc`:

```bash
 kubectl get stc
NAME       SELECTED   FAILED   PROVISIONED   AGE
datadog    1          0        1             63s
```

- `SELECTED` shows the number of control planes selected by the _SharedTelemetryConfig_.
- `FAILED` shows the number of control planes that failed to provision the OpenTelemetry Collector.
- `PROVISIONED` shows the provisioned and running OpenTelemetry Collectors on each control plane.

To return the names of control planes selected and provisioned, review the resource status:

```yaml
...
status:
  selected:
    - ctp
  provisioned:
    - ctp
```

If a conflict or another issue occurs, the failed control planes status returns the failure conditions:

```bash
k get stc
NAME       SELECTED   FAILED   PROVISIONED   AGE
datadog    1          1        0             63s
```

```yaml
...
status:
  failed:
  - conditions:
    - lastTransitionTime: "2024-04-26T09:32:28Z"
      message: 'control plane dev is already managed by another SharedTelemetryConfig:
        newrelic'
      reason: SelectorConflict
      status: "True"
      type: Failed
    controlPlane: ctp
  selectedControlPlanes:
  - ctp
```
<!-- vale write-good.Passive = NO -->
Upbound marks the control plane as provisioned only if the OpenTelemetry Collector is deployed and running. There could be a delay in the status update if the OpenTelemetry Collector is currently deploying:
<!-- vale write-good.Passive = YES -->

```bash
 k get stc
NAME       SELECTED   FAILED   PROVISIONED   AGE
datadog    1          0        0             63s
```

[opentelemetry]: https://opentelemetry.io/
[opentelemetry-collectors]: https://opentelemetry.io/docs/collector/
[opentelemetry-collector-configuration]: https://opentelemetry.io/docs/collector/configuration/#exporters
[service-pipeline-configuration]: https://opentelemetry.io/docs/collector/configuration/#pipelines
[documentation]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/datadogexporter/README.md
[documentation-1]: https://newrelic.com/instant-observability/opentelemetry
[processor-configuration]: https://opentelemetry.io/docs/collector/configuration/#processors
[transform-processor]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md
[transform-processor-2]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md
[opentelemetry-transformation-language]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl
[transform-processor-readme]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md
[opentelemetry-transformation-language-3]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl
[opentelemetry-transformation-language-functions]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/ottlfuncs/README.md
[opentelemetry-transformation-language-contexts]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl/contexts
[guide-on-ottl]: https://betterstack.com/community/guides/observability/ottl/#a-brief-overview-of-the-ottl-grammar
