---
title: Telemetry
sidebar_position: 99
description: Learn about telemetry data collection in Upbound and how to opt out
---

<!-- vale Google.We = NO -->
Upbound collects telemetry data to improve the product and provide better support to our users.
<!-- vale Google.We = YES -->

<!-- vale write-good.Passive = NO -->
<!-- vale Microsoft.HeadingPunctuation = NO -->
## What data is collected?
<!-- vale Microsoft.HeadingPunctuation = YES -->
<!-- vale write-good.Passive = YES -->

Upbound collects the following telemetry data:

- Version information for the Upbound CLI and Upbound Control Plane
- Basic consumption information, such as the number of operations performed and claims created
- Feature flag usage statistics
- Component version information
- `up` CLI commands you run (without capturing values)
- License information

<!-- vale Microsoft.HeadingPunctuation = NO -->
## How's data collected?
<!-- vale Microsoft.HeadingPunctuation = YES -->

Both the Upbound CLI and Upbound Control Plane collect telemetry data using the [OpenTelemetry](https://opentelemetry.io/) protocol. The system sends this data securely to the Upbound telemetry service.

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

### Upbound control plane

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
