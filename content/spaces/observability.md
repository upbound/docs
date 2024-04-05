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

Upbound offers a built-in feature to help you collect and export logs, metrics, and traces for everything running in a Space. Upbound provides an integrated observability pipeline built on the [OpenTelemetry](https://opentelemetry.io/) project.

The pipeline deploys [OpenTelemetry Collectors](https://opentelemetry.io/docs/collector/) to collect, process, and expose telemetry data in Spaces. Upbound deploys a central collector at the Space-level and collectors per control plane. Control plane collectors pass their telemetry data to the Spaces collector by default.

## Usage

When you install a Space, you can configure the pipeline and related options. You can configure:

* which exporter is used
* an `API Key` to enable a Space to write to the designated exporter.
* whether metrics and/or traces route to the desired exporter.

For information about which exporters are available, consult the OpenTelemetry Collector [exporter docs](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/README.md). 

This feature requires the [OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) to be installed on the Space cluster. Install this now if you haven't already:

```bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.96.0/opentelemetry-operator.yaml
```

The examples below document how to configure observability with the `up` CLI or Helm installations.

{{< tabs >}}

{{< tab "Up CLI" >}}

```bash {hl_lines="3-7"}
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "features.alpha.observability.enabled=true" \
  --set "observability.config.exporters.otlphttp.endpoint=${NEWRELIC_ENDPOINT}" \
  --set "observability.config.exporters.otlphttp.headers.api-key=${NEWRELIC_API_KEY}" \
  --set "observability.config.exportPipeline.metrics={debug,otlphttp}" \
  --set "observability.config.exportPipeline.traces={debug,otlphttp}"
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
  --set "observability.config.exportPipeline.traces={debug,otlphttp}" \
  --wait
```

{{< /tab >}}

{{< /tabs >}}

{{<hint "important" >}}
In Spaces v1.3, you must configure Space-level observability when you first install a Space. In future releases, Upbound will allow backend exports per control plane group or per individual control planes.
{{< /hint >}}