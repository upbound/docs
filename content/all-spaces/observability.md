---
title: Observability
weight: 200
description: A guide for how to use the integrated observability pipeline feature in a Space.
aliases:
    - /spaces/observability
---

{{< hint "important" >}}
This feature is in preview, requires Spaces `v1.3.0`, and is off by default. To enable, set `features.alpha.observability.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.observability.enabled=true" \
```

{{< /hint >}}

Upbound offers a built-in feature to help you collect and export logs, metrics, and traces for everything running in a Control Plane. Upbound provides an integrated observability pipeline built on the [OpenTelemetry](https://opentelemetry.io/) project.

The pipeline deploys [OpenTelemetry Collectors](https://opentelemetry.io/docs/collector/) to collect, process, and expose telemetry data in Spaces. Upbound deploys a collector per control plane, defined by a `SharedTelemetryConfig` set up at the group level. Control plane collectors pass their data to external observability backends defined in the `SharedTelemetryConfig`.

## SharedTelemetryConfig

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
```

The `controlPlaneSelector` field specifies the control planes that use this configuration.
The `exporters` field specifies the configuration for the exporters. Each exporter configuration is unique and corresponds to its [OpenTelemetry Collector configuration](https://opentelemetry.io/docs/collector/configuration/#exporters).
The `exportPipeline` field specifies the control plane pipelines that send telemetry data to the exporters. The `metrics` and `traces` fields specify the names of the pipelines the control planes use to send metrics and traces, respectively. The names of the pipelines correspond to the `exporters` in the OpenTelemetry Collector [service pipeline configuration](https://opentelemetry.io/docs/collector/configuration/#pipelines).

### Usage

In a Space, you can configure per control plane group telemetry settings by creating one or more `SharedTelemetryConfig` resources.

{{< hint "important" >}}
Your control plane can only use a single `SharedTelemetryConfig`. If you multiple `SharedTelemetryConfig` select the same control plane, the one applied first takes precedence. The other `SharedTelemetryConfig` fails the control plane provisioning due to conflict.
{{< /hint >}}

Currently supported exporters are:
- `datadog` (review the OpenTelemetry [documentation](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/datadogexporter/README.md) for configuration details)
- `otelhttp` (used by New Relic among others, review the New Relic [documentation](https://docs.newrelic.com/docs/more-integrations/open-source-telemetry-integrations/opentelemetry/get-started/opentelemetry-set-up-your-app/) for configuration details)

The example below shows how to configure a `SharedTelemetryConfig` resource to send metrics and traces to Datadog:

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
```

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

When you enable observability in a Space, Upbound deploys a single [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) to collect and export metrics to your configured observability backends.

To configure how Upbound exports your metrics, review the `spacesCollector` value in your Space installation Helm chart.

<!-- vale gitlab.MeaningfulLinkWords = NO -->
```yaml
observability:
  # Observability configuration to collect metrics (traces and logs in the future) from the Spaces machinery
  # and send them to the specified exporters.
  spacesCollector:
    tag: %%VERSION%%
    repository: opentelemetry-collector-spaces
    config:
      # To export observability data, configure the exporters in this field and update the
      # exportPipeline to include the exporters you want to use per telemetry type.
      exporters:
        debug:

        # The OpenTelemetry Collector exporter configuration.
        # otlphttp:
        #   endpoint: https://otlp.eu01.nr-data.net
        #   headers:
        #     api-key: <your-key>

      exportPipeline:
        metrics: [debug]

    resources:
      requests:
        cpu: 10m
        memory: 100Mi
      limits:
        cpu: 100m
        memory: 1Gi
```
<!-- vale gitlab.MeaningfulLinkWords = YES -->

You can export metrics from your Crossplane installation, Spaces infrastructure (controller, API, router, etc.), `provider-helm`, and `provider-kubernetes`.

<!-- vale off -->
## OpenTelemetryCollector image
<!-- vale on -->

Control plane (`SharedTelemetry`) and Space observability deploy the same custom OpenTelemetry Collector image. The OpenTelemetry Collector image supports `otelhttp`, `datadog`, and `debug` exporters.
For more information on observability configuration, review the Helm chart reference.

## Prerequisites

This feature requires the [OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) on the Space cluster. Install this now if you haven't already:

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.98.0/opentelemetry-operator.yaml
```

The examples below document how to configure observability with the `up` CLI or Helm installations.

{{< tabs >}}

{{< tab "Up CLI" >}}

```bash {hl_lines="3-7"}
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
```

{{< /tab >}}

{{< tab "Helm" >}}

```bash {hl_lines="7-11"}
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
  --wait
```

{{< /tab >}}

{{< /tabs >}}
