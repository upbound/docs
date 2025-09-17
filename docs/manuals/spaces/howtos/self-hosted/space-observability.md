---
title: Space-level observability
sidebar_position: 30
description: Configure Space-level observability
---

:::important
This feature is GA since `v1.14.0`, requires Spaces `v1.6.0`, and is off by default. To enable, set `observability.enabled=true` (`features.alpha.observability.enabled=true` before `v1.14.0`) when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "observability.enabled=true" \
```
:::

This guide explains how to set up Space-level observability. This feature is only applicable to self-hosted Space administrators. This lets Space administrators observe the cluster infrastructure where the Space software gets installed.

When you enable observability in a Space, Upbound deploys a single [OpenTelemetry Collector][opentelemetry-collector] to collect and export metrics and logs to your configured observability backends.

## Prerequisites

:::important
This feature is GA since `v1.14.0`, requires Spaces `v1.6.0`, and is off by default. To enable, set `observability.enabled=true` (`features.alpha.observability.enabled=true` before `v1.14.0`) when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "observability.enabled=true" \
```
:::

This feature requires the [OpenTelemetry Operator][opentelemetry-operator] on the Space cluster. Install this now if you haven't already:

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.116.0/opentelemetry-operator.yaml
```

If running Spaces => v1.11, the OpenTelemetry Operator version needs to be => v0.110.0, as there are breaking changes in the OpenTelemetry Operator. 

## Configuration

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

For more information on observability configuration, review the [Helm chart reference][helm-chart-reference].

## Observability in control planes

Read the [observability documentation][observability-documentation] to learn about the features Upbound offers for collecting telemetry from control planes.

[observability-documentation]: /manuals/spaces/features/observability
[opentelemetry-collector]: https://opentelemetry.io/docs/collector/
[opentelemetry-operator]: https://opentelemetry.io/docs/kubernetes/operator/
[helm-chart-reference]: /reference/helm-reference
