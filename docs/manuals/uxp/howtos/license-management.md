---
title: License Management
description: "Learn how to manage self-managed license for UXP"
sidebar_position: 2
---

This guide explains how to manage licenses for Upbound Crossplane (UXP),
including how to generate, apply, download, and verify licenses for Community
and Commercial plans.

<!-- vale proselint.Cliches = NO -->
* Upbound Community Plan lets you run Upbound Crossplane for free and is source-available on [GitHub][uxp-source]
* Upbound Standard, Enterprise, and Business Critical are commercial plans that let you create license keys that unlock additional features in Upbound Crossplane
<!-- vale proselint.Cliches = YES -->

:::important
To generate a license key for Upbound Crossplane, contact your Upbound account
representative.
:::

## Prerequisites

Before you begin, make sure you have:

* a running Kubernetes cluster
* `kubectl` installed
* the `up` CLI installed
* a valid UXP license provided by Upbound (for Standard plans and above)
* Admin access for your organization in the Upbound Console (for Enterprise plans)

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

### License expiration

Upon license expiration, the cluster enter a grace period whereby features
continue to work. The grace period is 25% of the total license duration. For
example:

* A yearly license has a 3-month grace period 
* A monthly license has about a 1-week grace period. 

During this grace period:

* Commercial features continue to function normatlly
* UXP emits warnings to indicate the license's grace period is active
* Configuration of commercial features remains unchanged, allowing you to add a new license and continue using commercial features as before expiration. 

**After license expiration and grace period**, paid features or components get
locked down. This means any component checking the license sees that it's truly
invalid (expired and grace period ended) and disables its paid features.

:::note
When licenses expires, your control plane still reconciles to guaranteer your
resources are operational. However, logs will appear in your control plane to
ensure operators understand the license is past its expiration period.
:::

### Development licenses

When you deploy Upbound Crossplane into a local single-node kind cluster, it
automatically receives a temporary license that unlocks commercial features.
These development licenses enable local development and testing flows with Upbound Crossplane.

:::important
This license may not be re-used for production purposes. 
:::

## License management in the Upbound Console (Enterprise and above)

Organizations with Enterprise or higher tier plans have access to self-service
license management in the Upbound Console.  

:::important
To manage your license in the Upbound Console, you must be an organization
Admin.
:::

### List licenses

To list your organization's licenses, log in to your Upbound account and click
the **Licenses** button or navigate to **My Account** > **Manage Account** in
the top right corner of your console.

<!--- TODO(tr0njavolta): image --->

The list of licenses displays information about your UXP licenses like:

* License name
* Status (Active or Expired)
* Resources allocated per month
* Operations allocated per month
* Creation date
* Expiration date

<!--- TODO(tr0njavolta): image --->

You can also use the search bar to find licenes by name, status, or number of
resources/operations allocated per month.

<!--- TODO(tr0njavolta): image --->

### Download licenses

To download a license in your console, click the three dots in the license of
your choice.

<!--- TODO(tr0njavolta): image --->

Click **Download License**. Your browswer will download the license as a JSON
file.

<!--- TODO(tr0njavolta): image --->

For more information, follow the **Provisioning Instructions** to see up-to-date
documentation on how to apply the license to your Kubernetes cluster.

:::note
In the license file, the capicity field references resource hours rather than
resource per month. Resource hours refelct the entire capacity allocated for the
duration of the license instead of for a single month.
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
kubectl get license uxp
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
| **`plan`** | The commercial plan associated with your license (Community, Standard, etc). |
| **`expiresAt`** | The date and time when your license is set to expire. |
| **`capacity`** | The total capacity granted by your license, such as `resourceHours` and `operations`. |
| **`enabledFeatures`** | A list of the commercial features unlocked by your license. |
| **`usage`** | The cumulative usage data tracked by the system, including utilization percentages. |
| **`conditions`** | Reports the real-time status, including `LicenseValid` and `UsageCompliant` conditions. |
| **`gracePeriodEndsAt`** | When the license grace period ends and the license becomes completely invalid. |

For more information on usage metering, review the [Usage Metering][usage]
guide.

[usage]: /manuals/uxp/howtos/usage-metering
[uxp-source]: https://github.com/upbound/upbound-crossplane
