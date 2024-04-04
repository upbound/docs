---
title: Observability
weight: 200
description: A guide for how to use the integrated observability pipeline feature in a Space.
---

{{< hint "important" >}}
This feature is in preview, requires Spaces `v1.3.0`, and is off by default. To enable, set `features.alpha.observability.enabled=true` when installing Spaces:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.observability.enabled=true" \
```

{{< /hint >}}

Upbound offers a built-in feature to help you collect and export logs, metrics, and traces for everything running in a Space. Upbound's feature an integrated observability pipeline built on the [OpenTelemetry](https://opentelemetry.io/) project. 

[OpenTelemetry Collectors](https://opentelemetry.io/docs/collector/) are deployed to collect, process, and expose telemetry data in Spaces. Upbound deploys a central collector at the Space-level along with collectors per control plane. By default, all collectors belonging to control planes pass their telemetry data to the Spaces collector.

## Usage

Configuration of the pipeline is done at installation time. In addition to enabling the feature, you have the ability to configure:

* which exporter is used
* an `API Key` to enable a Space to write to the designated exporter.
* whether metrics and/or traces route to the desired exporter.

For information about which exporters are available, consult the OpenTelemetry Collector [exporter docs](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/README.md).

Below is an example for how to configure it:

{{< tabs >}}

{{< tab "Up CLI" >}}

```bash {hl_lines="7-11"}
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
  --set "observability.config.exporters.otlphttp.endpoint=${NEWRELIC_ENDPOINT}" \
  --set "observability.config.exporters.otlphttp.headers.api-key=${NEWRELIC_API_KEY}" \
  --set "observability.config.exportPipeline.metrics={debug,otlphttp}" \
  --set "observability.config.exportPipeline.traces={debug,otlphttp}"
  --wait
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
  --set "observability.config.exporters.otlphttp.endpoint=${NEWRELIC_ENDPOINT}" \
  --set "observability.config.exporters.otlphttp.headers.api-key=${NEWRELIC_API_KEY}" \
  --set "observability.config.exportPipeline.metrics={debug,otlphttp}" \
  --set "observability.config.exportPipeline.traces={debug,otlphttp}"
  --wait
```

{{< /tab >}}

{{< /tabs >}}

{{<hint "important" >}}
In Spaces v1.3, we're only exposing a space-level installation time configuration. In the next iteration, we plan to enable the ability to configure export backends per control plane group or for individual control planes.
{{< /hint >}}