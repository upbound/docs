---
title: Configure Space-level observability
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

This guide explains how to configure Space-level observability. This feature is
only applicable to self-hosted Space administrators. This lets Space
administrators observe the cluster infrastructure where the Space software gets
installed.

When you enable observability in a Space, Upbound deploys a single
[OpenTelemetry Collector][opentelemetry-collector] to collect and export metrics
and logs to your configured observability backends.

## Prerequisites

This feature requires the [OpenTelemetry Operator][opentelemetry-operator] on
the Space cluster. Install this now if you haven't already:

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.116.0/opentelemetry-operator.yaml
```

If running Spaces v1.11 or later, use OpenTelemetry Operator v0.110.0 or later
due to breaking changes in the OpenTelemetry Operator.

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

You can export metrics and logs from your Crossplane installation, Spaces
infrastructure (controller, API, router, etc.), provider-helm, and
provider-kubernetes.

### Router metrics

The Spaces router component uses Envoy as a reverse proxy and exposes detailed
metrics about request handling, circuit breakers, and connection pooling. 
Upbound collects these metrics in your Space after you enable Space-level
observability.

Envoy metrics in Upbound include:

- **Upstream cluster metrics** - Request status codes, timeouts, retries, and latency for traffic to control planes and services
- **Circuit breaker metrics** - Connection and request circuit breaker state for both `DEFAULT` and `HIGH` priority levels
- **Downstream listener metrics** - Client connections and requests received
- **HTTP connection manager metrics** - End-to-end HTTP request processing and latency

For a complete list of available router metrics and example PromQL queries, see the [Router metrics reference][router-ref].

## Available metrics

Space-level observability collects metrics from multiple infrastructure components:

### Infrastructure component metrics

- Crossplane controller metrics
- Spaces controller, API, and router metrics
- Provider metrics (provider-helm, provider-kubernetes)

### Router metrics

The router component exposes Envoy proxy metrics for monitoring traffic flow and
service health. Key metric categories include:

- `envoy_cluster_upstream_rq_*` - Upstream request metrics (status codes, timeouts, retries, latency)
- `envoy_cluster_circuit_breakers_*` - Circuit breaker state and capacity
- `envoy_listener_downstream_*` - Client connection and request metrics
- `envoy_http_downstream_*` - HTTP request processing metrics

Example query to monitor total request rate:

```promql
sum(rate(envoy_cluster_upstream_rq_total{job="spaces-router-envoy"}[5m]))
```

For detailed router metrics documentation and more query examples, see the [Router metrics reference][router-ref].

<!-- vale off -->
## OpenTelemetryCollector image
<!-- vale on -->

Control plane (`SharedTelemetry`) and Space observability deploy the same custom
OpenTelemetry Collector image. The OpenTelemetry Collector image supports
`otlhttp`, `datadog`, and `debug` exporters.

For more information on observability configuration, review the [Helm chart reference][helm-chart-reference].

## Observability in control planes

Read the [observability documentation][observability-documentation] to learn
about the features Upbound offers for collecting telemetry from control planes.


## Router metrics reference {#router-ref}


### Upstream cluster metrics

| Metric | Description |
|--------|-------------|
| `envoy_cluster_upstream_rq_xx_total` | HTTP status codes (2xx, 3xx, 4xx, 5xx) with label `envoy_response_code_class` |
| `envoy_cluster_upstream_rq_timeout_total` | Requests that timed out waiting for upstream |
| `envoy_cluster_upstream_rq_retry_limit_exceeded_total` | Requests that exhausted retry attempts |
| `envoy_cluster_upstream_rq_total` | Total upstream requests |
| `envoy_cluster_upstream_rq_time_bucket` | Latency histogram (for P50/P95/P99 calculations) |
| `envoy_cluster_upstream_rq_time_sum` | Sum of request durations |
| `envoy_cluster_upstream_rq_time_count` | Count of requests |

### Circuit breaker metrics

| Name | Description |
|--------|-------------|
| `envoy_cluster_circuit_breakers_default_cx_open` | `DEFAULT` priority connection circuit breaker open (gauge) |
| `envoy_cluster_circuit_breakers_default_rq_open` | `DEFAULT` priority request circuit breaker open (gauge) |
| `envoy_cluster_circuit_breakers_default_remaining_cx` | Available `DEFAULT` priority connections (gauge) |
| `envoy_cluster_circuit_breakers_default_remaining_rq` | Available `DEFAULT` priority request slots (gauge) |
| `envoy_cluster_circuit_breakers_high_cx_open` | `HIGH` priority connection circuit breaker open (gauge) |
| `envoy_cluster_circuit_breakers_high_rq_open` | `HIGH` priority request circuit breaker open (gauge) |
| `envoy_cluster_circuit_breakers_high_remaining_cx` | Available `HIGH` priority connections (gauge) |
| `envoy_cluster_circuit_breakers_high_remaining_rq` | Available `HIGH` priority request slots (gauge) |

### Downstream listener metrics

| Name | Description |
|--------|-------------|
| `envoy_listener_downstream_rq_xx_total` | HTTP status codes for responses sent to clients |
| `envoy_listener_downstream_rq_total` | Total requests received from clients |
| `envoy_listener_downstream_cx_total` | Total connections from clients |
| `envoy_listener_downstream_cx_active` | Currently active client connections (gauge) |


<!-- vale Microsoft.HeadingAcronyms = NO -->
### HTTP connection manager metrics
<!-- vale Microsoft.HeadingAcronyms = YES -->

| Name | Description |
|--------|-------------|
| `envoy_http_downstream_rq_xx` | HTTP status codes (note: no `_total` suffix for this metric family) |
| `envoy_http_downstream_rq_total` | Total HTTP requests received |
| `envoy_http_downstream_rq_time_bucket` | Downstream request latency histogram |
| `envoy_http_downstream_rq_time_sum` | Sum of downstream request durations |
| `envoy_http_downstream_rq_time_count` | Count of downstream requests |

[router-ref]: #router-ref
[observability-documentation]: /manuals/spaces/features/observability
[opentelemetry-collector]: https://opentelemetry.io/docs/collector/
[opentelemetry-operator]: https://opentelemetry.io/docs/kubernetes/operator/
[helm-chart-reference]: /reference/helm-reference
