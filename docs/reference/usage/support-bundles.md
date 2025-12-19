---
title: Support Bundles
description: Collect diagnostic snapshots for troubleshooting
---

The `up` CLI uses [troubleshoot.sh] to collect diagnostic snapshots from UXP, Spaces, and control planes for troubleshooting.

## Commands

| Command | Description |
|---------|-------------|
| `collect` | Gather logs and resources into a tar.gz archive |
| `template` | Output the default YAML config for customization |
| `serve` | View bundle contents via a local API server |

## Collecting a support bundle

```bash
up support-bundle collect
```

This outputs a timestamped `tar.gz` file (e.g., `upbound-support-bundle-20250115-163905.tar.gz`).

By default, the bundle includes logs and cluster resources from:

- `crossplane-system`
- `upbound-system`
- Any Spaces control plane namespaces

### Filtering namespaces

Include or exclude specific namespaces using glob patterns:

```bash
up support-bundle collect --include-namespaces "prefix-*"
up support-bundle collect --exclude-namespaces upbound-system
```

### Crossplane resources only

Skip log collection and gather only Crossplane CRDs and associated custom resources:

```bash
up support-bundle collect --crossplane-resources-only
```

## Viewing a support bundle

The `serve` command starts a local API server and generates a kubeconfig, letting you browse bundle contents with kubectl or k9s:

```bash
up support-bundle serve ./upbound-support-bundle-20250115-163905.tar.gz
```

Then in another terminal:

```bash
kubectl --kubeconfig=./support-bundle-kubeconfig get pods -A
```

This runs only the API server for viewing collected data, no workloads are actually running.

## Automatic redaction

Sensitive information is automatically redacted, including:

- Kubernetes secrets
- Passwords and API keys
- IPv4 addresses in logs
- ConfigMap data fields
- EnvironmentConfig data fields
- Provider Kubernetes objects

## Shared responsibility

Automatic redaction covers common cases but cannot guarantee complete removal of all sensitive data. Before sharing a support bundle with Upbound:

1. Use `up support-bundle serve` to review the contents
2. Remove any sensitive information or PII that wasn't automatically redacted
3. Add custom redactors if you need to exclude specific patterns

## Custom configuration

Generate the default config template:

```bash
up support-bundle template > support-bundle-config.yaml
```

Edit the file to add custom collectors or redactors, then collect with it:

```bash
up support-bundle collect -c support-bundle-config.yaml
```

The config file supports multi-document YAML—include both `SupportBundle` and `Redactor` resources separated by `---`.

When using `-c`, the `--include-namespaces` and `--exclude-namespaces` flags are ignored.

For redactor syntax, see the [troubleshoot.sh redactors documentation][redactors].

[troubleshoot.sh]: https://troubleshoot.sh/docs/support-bundle/introduction
[redactors]: https://troubleshoot.sh/docs/redact/redactors
