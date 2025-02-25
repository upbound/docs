---
title: Observability
weight: 200
description: A guide for how to use the integrated observability pipeline feature in a Space.
aliases:
    - /spaces/observability
---

{{< hint "important" >}}
This feature is in preview, requires Spaces `v1.6.0`, and is off by default. To enable, set `features.alpha.observability.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.observability.enabled=true" \
```

{{< /hint >}}

Upbound offers a built-in feature to help you collect and export logs, metrics, and traces for everything running in a Control Plane. Upbound provides an integrated observability pipeline built on the [OpenTelemetry](https://opentelemetry.io/) project.

The pipeline deploys [OpenTelemetry Collectors](https://opentelemetry.io/docs/collector/) to collect, process, and expose telemetry data in Spaces. Upbound deploys a collector per control plane, defined by a `SharedTelemetryConfig` set up at the group level. Control plane collectors pass their data to external observability backends defined in the `SharedTelemetryConfig`.

## Prerequisites

This feature requires the [OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) on the Space cluster. Install this now if you haven't already:

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.116.0/opentelemetry-operator.yaml
```

If running Spaces => v1.11, the OpenTelemetry Operator version needs to be => v0.110.0, as there are breaking changes in the OpenTelemetry Operator. 

The examples below document how to configure observability with the `up` CLI or Helm installations.

## Up CLI instructions

```bash {hl_lines="3-7"}
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
```

## Helm instructions

```bash {hl_lines="7-11"}
helm -n upbound-system upgrade --install spaces \
  oci://xpkg.upbound.io/spaces-artifacts/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
  --wait
```

<!-- vale Google.Headings = NO -->

## SharedTelemetryConfig

<!-- vale Google.Headings = YES -->

`SharedTelemetryConfig` is a custom resource that defines the telemetry configuration for a group of control planes. This resources allows you to specify the exporters and pipelines your control planes use to send telemetry data to your external observability backends.

 The following is an example of a `SharedTelemetryConfig` resource that sends metrics and traces to New Relic:

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
The `exporters` field specifies the configuration for the exporters. Each exporter configuration is unique and corresponds to its [OpenTelemetry Collector configuration](https://opentelemetry.io/docs/collector/configuration/#exporters).
The `exportPipeline` field specifies the control plane pipelines that send telemetry data to the exporters. The `metrics`, `traces` and `logs` fields specify the names of the pipelines the control planes use to send metrics, traces, and logs respectively. The names of the pipelines correspond to the `exporters` in the OpenTelemetry Collector [service pipeline configuration](https://opentelemetry.io/docs/collector/configuration/#pipelines).

### Usage

In a Space, you can configure per control plane group telemetry settings by creating one or more `SharedTelemetryConfig` resources.

{{< hint "important" >}}
Your control plane can only use a single `SharedTelemetryConfig`. If you multiple `SharedTelemetryConfig` select the same control plane, the one applied first takes precedence. The other `SharedTelemetryConfig` fails the control plane provisioning due to conflict.
{{< /hint >}}

Currently supported exporters are:
- `datadog` (review the OpenTelemetry [documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/datadogexporter/README.md) for configuration details)
- `otelhttp` (used by New Relic among others, review the New Relic [documentation](https://docs.newrelic.com/docs/more-integrations/open-source-telemetry-integrations/opentelemetry/get-started/opentelemetry-set-up-your-app/) for configuration details)

The example below shows how to configure a `SharedTelemetryConfig` resource to send metrics, traces and logs to Datadog:

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

### Sensitive data

{{< hint "important" >}}
This feature is available from Spaces v1.10
{{< /hint >}}

To avoid exposing sensitive data in the `SharedTelemetryConfig` resource, use
Kubernetes secrets to store the sensitive data and reference the secret in the
`SharedTelemetryConfig` resource.

Create the secret in the same namespace/group as the `SharedTelemetryConfig`
resource. The example below uses `kubectl create secret` to create a new secret:

```bash
kubectl create secret generic sensitive -n <STC_NAMESPACE>  \
    --from-literal=apiKey='YOUR_API_KEY'
```

Next, reference the secret in the `SharedTelemetryConfig` resource:

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
`SharedTelemetryConfig` resource.

### Telemetry processing

{{< hint "important" >}}
This feature is available from Spaces v1.11.
{{< /hint >}}

The `SharedTelemetryConfig` resource allows you to configure a processing 
pipeline for the telemetry data collected by the OpenTelemetry Collector. 
Like `spec.exporters`, the `spec.processors` field allows you to
configure the processors that transform the telemetry data for the exporters. It follows the OpenTelmetry Collector [processor configuration](https://opentelemetry.io/docs/collector/configuration/#processors).

For now, the only supported processor is the [transform processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md).

#### Telemetry transforms

<!-- vale gitlab.SentenceLength = NO -->
The [transform processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md) allows for the transformation of telemetry data
using the [OpenTelemetry Transformation Language](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl).
<!-- vale gitlab.SentenceLength = YES -->



The transform processor can transform metrics, logs, and traces at different scopes and allows you to use conditionals to select specific data.

Example of useful transformations include:

- adding, removing, and modifying attributes. Renaming, concatenating multiple labels, etc
- converting metric types (gauge to sum)
- for more information, review the [transform processor README](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md)

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
- [OpenTelemetry Transformation Language](https://github.
  com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl)
- [OpenTelemetry Transformation Language Functions](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/ottl/ottlfuncs/README.md)
- [OpenTelemetry Transformation Language Contexts](https://github.
  com/open-telemetry/opentelemetry-collector-contrib/tree/main/pkg/ottl/contexts)
- An interesting [guide on `OTTL`](https://betterstack.com/community/guides/observability/ottl/#a-brief-overview-of-the-ottl-grammar)

### Status

If successful, Upbound creates the `SharedTelemetryConfig` resource and provisions the OpenTelemetry Collector for the selected control plane. To see the status, run `kubectl get stc`:

```bash
 kubectl get stc
NAME       SELECTED   FAILED   PROVISIONED   AGE
datadog    1          0        1             63s
```

- `SELECTED` shows the number of control planes selected by the `SharedTelemetryConfig`.
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

## Space-level observability

Observability is available in preview at the Space level. This feature allows you to observe your Space infrastructure. To enable this feature, set the `features.alpha.observability.enabled` flag to `true` when installing Spaces.

When you enable observability in a Space, Upbound deploys a single [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) to collect and export metrics and logs to your configured observability backends.

To configure how Upbound exports, review the `spacesCollector` value in your Space installation Helm chart. Below is an example of an `otlphttp` compatible endpoint.

<!-- vale gitlab.MeaningfulLinkWords = NO -->
```yaml
observability:
  spacesCollector:
    config:
      exporters:
        otlphttp:
          endpoint: "<your-endpoint>"
          headers:
            api-key: YOUR_API_KEY
      exportPipeline:
        logs:
          - otlphttp
        metrics:
          - otlphttp
```
<!-- vale gitlab.MeaningfulLinkWords = YES -->

You can export metrics and logs from your Crossplane installation, Spaces infrastructure (controller, API, router, etc.), `provider-helm`, and `provider-kubernetes`.

<!-- vale off -->
## OpenTelemetryCollector image
<!-- vale on -->

Control plane (`SharedTelemetry`) and Space observability deploy the same custom OpenTelemetry Collector image. The OpenTelemetry Collector image supports `otlhttp`, `datadog`, and `debug` exporters.
For more information on observability configuration, review the Helm chart reference.
