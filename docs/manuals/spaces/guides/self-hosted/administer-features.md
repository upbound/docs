---
title: Administer features 
sidebar_position: 12
description: Enable and disable features in Spaces
---

Administer feature guide

## Shared Secrets

:::important
This feature is in preview and enabled by default in Cloud Spaces. To enable it
in a self-hosted Space, set `features.alpha.sharedSecrets.enabled=true` when
installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedSecrets.enabled=true" \
```

:::

## Observability

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

:::important
From Spaces v1.13 and beyond.
The data collected by SharedTelemetry contains just telemetry from user-facing control plane workloads, such as Crossplane, providers and functions.

Self-hosted Spaces users can add control plane system workloads such as the `api-server`, `etcd` by setting the `observability.collectors.includeSystemTelemetry` Helm flag to true.
:::


### Sensitive data

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

## Shared Backups

:::warning
As of Spaces `v.12.0`, this feature is enabled by default.
To disable in a self-hosted Space, pass the `features.alpha.sharedBackup.enabled=false` as a Helm chart value.
`--set "features.alpha.sharedBackup.enabled=false"`
:::

## Query API

:::important

This feature is in preview. The Query API is available in the Cloud Space offering and enabled by default.

Query API is required for self-hosted deployments with connected Spaces. See the
related [documentation][documentation]
to enable this feature.

:::