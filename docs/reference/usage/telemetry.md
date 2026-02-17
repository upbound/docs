---
title: Telemetry
sidebar_position: 99
description: Learn about telemetry data collection in Upbound and how to opt out
validation:
  type: reference
  owner: docs@upbound.io
  tags:
    - reference
    - telemetry
---

Upbound collects telemetry data to improve the product and provide better support to our users.

## What data is collected?

Upbound collects the following telemetry data:

- Version information for the Upbound CLI and Upbound Control Plane
- Basic consumption information, such as the number of operations performed and claims created
- Feature flag usage statistics
- Component version information
- `up` CLI commands that are executed (without capturing values)
- License information

## How's data collected?

Telemetry data is collected by both the Upbound CLI and Upbound Control Plane using the [OpenTelemetry](https://opentelemetry.io/) protocol. This data is sent securely to the Upbound telemetry service.

## How to opt out

You can opt out of telemetry collection at any time using the methods below.

### Upbound CLI

Two ways to disable telemetry for the Upbound CLI:

**Option 1: Environment variable**

Set the `DO_NOT_TRACK` environment variable to `true` before running the `up` CLI:

```bash
# See https://consoledonottrack.com/ for more information
export DO_NOT_TRACK=true
```

**Option 2: Configuration command**

Run the following command to permanently disable telemetry in your CLI configuration:

```bash
up config set telemetry.disabled true
```

### Upbound Control Plane

**Environment variable**

Set the `UPBOUND_TELEMETRY_DISABLED` environment variable to `true`:

```bash
export UPBOUND_TELEMETRY_DISABLED=true
```

**Helm installation**

When installing the Upbound Control Plane with Helm, you can disable telemetry by providing the following value:

```yaml
telemetry:
  disabled: true
```
