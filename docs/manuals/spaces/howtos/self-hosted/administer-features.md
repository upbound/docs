---
title: Administer features 
sidebar_position: 12
description: Enable and disable features in Spaces
---

This guide shows how to enable or disable features in your self-hosted Space.

## Shared secrets

**Status:** Preview

This feature is enabled by default in Cloud Spaces.

To enable this feature in a self-hosted Space, set
`features.alpha.sharedSecrets.enabled=true` when installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedSecrets.enabled=true" \
```


## Observability

**Status:** GA
**Available from:** Spaces v1.13+

This feature is enabled by default in Cloud Spaces.



To enable this feature in a self-hosted Space, set
`observability.enabled=true` (`features.alpha.observability.enabled=true` before `v1.14.0`) when installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "observability.enabled=true" \
```

The observability feature collects telemetry data from user-facing control
plane workloads like:

* Crossplane
* Providers
* Functions

Self-hosted Spaces users can add control plane system workloads such as the
`api-server`, `etcd` by setting the
`observability.collectors.includeSystemTelemetry` Helm flag to true.

### Sensitive data

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

## Shared backups

As of Spaces `v.12.0`, this feature is enabled by default.

To disable in a self-hosted Space, pass the `features.alpha.sharedBackup.enabled=false` as a Helm chart value.
`--set "features.alpha.sharedBackup.enabled=false"`

## Query API

**Status:** Preview
The Query API is available in the Cloud Space offering and enabled by default.

Query API is required for self-hosted deployments with connected Spaces. See the
related [documentation][documentation]
to enable this feature.

[documentation]: /manuals/spaces/howtos/query-api/
