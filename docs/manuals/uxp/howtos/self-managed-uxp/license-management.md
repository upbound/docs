---
title: License Management
description: "Learn how to manage self-managed license for UXP"
sidebar_position: 2
---

Upbound Crossplane is available in community and commercial plans for Upbound. 
<!-- vale proselint.Cliches = NO -->
* Upbound Community Plan lets you run Upbound Crossplane for free and is source-available on [GitHub][uxp-source]
* Upbound Standard, Enterprise, and Business Critical are commercial plans that let you create license keys that unlock additional features in Upbound Crossplane
<!-- vale proselint.Cliches = YES -->

:::important
To generate a license key for Upbound Crossplane, contact your Upbound account
representative.
:::

This guide walks through how to manage a UXP license.

## Prerequisites

Before you begin, make sure you have:

* a running Kubernetes cluster
* `kubectl` installed
* the `up` CLI installed
* a valid UXP license provided by Upbound (for Standard plans and above)

## Community plan 

The Community plan on Upbound lets you run Upbound Crossplane without a license.
This lets you use the free core features of Upbound Crossplane.

### Enable a development license

To generate a development license for local development on a single-node
cluster, use the `up` CLI:

```shell
up uxp license apply --dev
```

### Restrictions

Users can't provide Upbound Crossplane as a commercial Crossplane service to
others.

## Commercial plans (Standard, Enterprise, Business Critical)

Users who have a commercial plan on Upbound including Standard, Enterprise, and
Business Critical may generate and install license keys. These commercial
license keys unlock commercial-only features in Upbound Crossplane.

Users who purchased a commercial plan (Standard, Enterprise, and Business
Critical) can generate and install license keys. 

### Commercial features

Commercial licenses unlock the following Upbound Crossplane features:

* Provider pod autoscaling
* Function pod scale-to-zero
* Backup and restore
* Access to patch releases of Official Providers

These features are unavailable unless a valid license is present.

* **Upon license expiration:**
    * The cluster enters a grace period whereby features continue to work. The grace period is 25% of the total license duration. For example, a yearly license has a 3-month grace period, and a monthly license has about a 1-week grace period. During this grace period, the commercial features will continue to function normally. However, you'll notice warnings emitted in Upbound Crossplane that the license's grace period is active. 
    * Configuration of commercial features remains unchanged, allowing you to add a new license and continue using commercial features as before expiration. 
* **After license expiration and grace period:** After the grace period ends, paid features or components get locked down. This means any component checking the license sees that it's truly invalid (expired and grace period ended) and disables its paid features.

### Development licenses

When you deploy Upbound Crossplane into a local single-node kind cluster, it
automatically receives a temporary license that unlocks commercial features.
These development licenses enable local development and testing flows with Upbound Crossplane.

:::important
This license may not be re-used for production purposes. 
:::


## Add a license to an Upbound Crossplane cluster

To enable commercial features in an Upbound Crossplane cluster, you need a
commercial license.

Connect to your Upbound Crossplane cluster.

Download your license file and apply the license with the up CLI:

```bash
up uxp license apply /path/to/license.json
```

If you don't provide a license key, UXP runs the `Community` edition.


:::important

**You may not re-use licenses across multiple Upbound Crossplane clusters.**

:::

## Verify a license

<Tabs>

<TabItem value="Up CLI" label="Up CLI">

Confirm your license status:

```bash
up uxp license show
```

It should print a result like the following:

```bash
Upbound Crossplane License Status:  Valid (The license signature has been successfully verified.)
Created:                            2025-07-15 08:30:21 -0400 EDT
Expires:                            2025-10-13 08:30:21 -0400 EDT

Plan:                 standard
Resource Hour Limit:  50000
Operation Limit:      5000
Enabled Features:
- LazyCRDLoading
- ProviderVPA
- BackupRestore
```

</TabItem>
<TabItem value="kubectl" label="kubectl">

Confirm your license status:

```bash
kubectl get license uxp --subresource=status
```

It should print a result like the following:

```bash
NAME   PLAN       VALID   REASON              AGE
uxp    standard   True    SignatureVerified   3h59m
```

</TabItem>
</Tabs>

### License status information

For a detailed view, use `kubectl` to return the full resource YAML information:

```shell
kubectl get license uxp -o yaml
```

The `status` field provides more information about your license entitlements and
current usage:

| Field | Description |
|-------|-------------|
| **`plan`** | The commercial plan associated with your license (e.g., community, standard). |
| **`expiresAt`** | The date and time when your license is set to expire. |
| **`capacity`** | The total capacity granted by your license, such as `resourceHours` and `operations`. |
| **`enabledFeatures`** | A list of the commercial features unlocked by your license. |
| **`usage`** | The cumulative usage data tracked by the system, including utilization percentages. |
| **`conditions`** | Reports the real-time status, including `LicenseValid` and `UsageCompliant` conditions. |

For more information on usage metering, review the [Usage Metering][usage]
guide.

[usage]: /manuals/uxp/howtos/self-managed-uxp/usage-metering
[uxp-source]: https://github.com/upbound/upbound-crossplane
