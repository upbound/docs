---
title: Observability
sidebar_position: 50
description: A guide for how to use the integrated observability pipeline feature
  in a Space.
plan: "enterprise"
---

<Enterprise />

This guide explains how to configure observability in Upbound Cloud Spaces. Upbound
provides integrated observability features built on
[OpenTelemetry][opentelemetry] to collect, process, and export logs, metrics,
and traces.

Upbound Spaces offers the following level of observability for Cloud Spaces:

1. **Control plane observability** - Observes workloads running within individual control planes

:::important
**Control plane observability** (available since v1.13.0, GA in v1.14.0):
- Enabled by default
- No additional configuration required

Space-level observability (infrastructure-level) is available for **Self-Hosted Spaces only**. See the [self-hosted observability guide][space-level-o11y].
:::

## Control plane observability

Control plane observability collects telemetry data from workloads running
within individual control planes using `SharedTelemetryConfig` resources.

The pipeline deploys [OpenTelemetry Collectors][opentelemetry-collectors] per
control plane, defined by a `SharedTelemetryConfig` at the group level.
Collectors pass data to external observability backends.

:::important
From Spaces `v1.13` and beyond, telemetry only includes user-facing control
plane workloads (Crossplane, providers, functions).
:::

:::important
Spaces validates `SharedTelemetryConfig` resources before applying them by
sending telemetry to configured exporters.
:::

### `SharedTelemetryConfig`

`SharedTelemetryConfig` is a group-scoped custom resource that defines telemetry
configuration for control planes.

#### New Relic example

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

#### Datadog Example

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

Use `spec.controlPlaneSelector` to specify which control planes should use the
telemetry configuration.

#### Label-based selection

```yaml
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

#### Expression-based selection

```yaml
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

#### Name-based selection

```yaml
spec:
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```

### Manage sensitive data

:::important
Available from Spaces `v1.10`
:::

Store sensitive data in Kubernetes secrets and reference them in your
`SharedTelemetryConfig`:

1. **Create the secret:**
   ```bash
   kubectl create secret generic sensitive -n <STC_NAMESPACE> \
       --from-literal=apiKey='YOUR_API_KEY'
   ```

2. **Reference in SharedTelemetryConfig:**
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
           api-key: dummy # Replaced by secret value
     exportPipeline:
       metrics: [otlphttp]
       traces: [otlphttp]
       logs: [otlphttp]
   ```

### Telemetry processing

:::important
Available from Spaces `v1.11`
:::

Configure processing pipelines to transform telemetry data using the [transform
processor][transform-processor].

#### Add labels to metrics

```yaml
spec:
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

#### Remove labels

From metrics:
```yaml
processors:
  transform:
    metric_statements:
      - context: datapoint
        statements:
          - delete_key(attributes, "kubernetes_namespace")
```

From logs:
```yaml
processors:
  transform:
    log_statements:
      - context: log
        statements:
          - delete_key(attributes, "log.file.name")
```

#### Modify log messages

```yaml
processors:
  transform:
    log_statements:
      - context: log
        statements:
          - set(attributes["original"], body)
          - set(body, Concat(["log message:", body], " "))
```

### Monitor status

Check the status of your `SharedTelemetryConfig`:

```bash
kubectl get stc
NAME       SELECTED   FAILED   PROVISIONED   AGE
datadog    1          0        1             63s
```

- `SELECTED`: Number of control planes selected
- `FAILED`: Number of control planes that failed provisioning
- `PROVISIONED`: Number of successfully running collectors

For detailed status information:

```bash
kubectl describe stc <name>
```

## Supported exporters

Control plane observability supports:
- `datadog` - Datadog integration
- `otlphttp` - General-purpose exporter (used by New Relic, among others)
- `debug` - troubleshooting

## Considerations

- **Control plane conflicts**: Each control plane can only use one `SharedTelemetryConfig`. Multiple configs selecting the same control plane conflict.
- **Custom collector image**: Control plane observability uses a custom OpenTelemetry Collector image with supported exporters.
- **Resource scope**: `SharedTelemetryConfig` resources are group-scoped, allowing different telemetry configurations per group.

For more advanced configuration options, review the [OpenTelemetry Transformation Language
documentation][opentelemetry-transformation-language].

[opentelemetry]: https://opentelemetry.io/
[opentelemetry-collectors]: https://opentelemetry.io/docs/collector/
[transform-processor]: https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md
[opentelemetry-transformation-language]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl
[space-level-o11y]: /self-hosted-spaces/howtos/space-observability
