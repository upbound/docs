<!-- vale off-->
# License Management

This guide explains how to manage licenses for Upbound Crossplane (UXP), including generating, applying, downloading, and verifying licenses for both community and commercial plans.

Upbound Crossplane is available in community and commercial plans. The Community Plan lets you run Upbound Crossplane for free, while Standard, Enterprise, and Business Critical are commercial plans that unlock additional features through license keys.

## Prerequisites

Before you manage UXP licenses, ensure:

* You have a running Kubernetes cluster
* kubectl is installed
* The up CLI is installed
* You have a valid UXP license provided by Upbound (for Standard plans and above)
* For Enterprise plans and above: You have Admin access to your Organization's account in Upbound Console

## Community plan

The Community plan on Upbound lets you run Upbound Crossplane without a license. This lets you use the free core features of Upbound Crossplane.

### Enable a development license

1. Generate a development license for local development on a single-node cluster using the up CLI:

    ```
    up uxp license apply --dev
    ```

    This automatically provides a temporary license for local development and testing.

### Restrictions

Users can't provide Upbound Crossplane as a commercial Crossplane service to others.

## Commercial plans (Standard, Enterprise, Business Critical)

Users who have a commercial plan on Upbound including Standard, Enterprise, and Business Critical may generate and install license keys. These commercial license keys unlock commercial-only features in Upbound Crossplane.

### Commercial features

Commercial licenses unlock the following Upbound Crossplane features:

* Provider pod autoscaling
* Function pod scale-to-zero
* Backup and restore
* Access to patch releases of Official Providers

These features are unavailable unless a valid license is present.

### License expiration behavior

Upon license expiration, the cluster enters a grace period whereby features continue to work. The grace period is 25% of the total license duration. For example:

* A yearly license has a 3-month grace period
* A monthly license has about a 1-week grace period

During this grace period:

* Commercial features continue to function normally
* Warnings are emitted in Upbound Crossplane indicating the license's grace period is active
* Configuration of commercial features remains unchanged, allowing you to add a new license and continue using commercial features as before expiration

After the grace period ends, paid features or components get locked down. Any component checking the license sees that it's truly invalid (expired and grace period ended) and disables its paid features.

Note: When licenses are expired, reconciliation in your control plane leveraging it won't stop, to guarantee your resources are kept operational. However, logs will start appearing in your control plane to ensure operators understand the license is past its expiration period.

### Development licenses

When you deploy Upbound Crossplane into a local single-node kind cluster, it automatically receives a temporary license that unlocks commercial features. These development licenses enable local development and testing flows with Upbound Crossplane.

This license may not be re-used for production purposes.

## List existing licenses (Enterprise plans and above)

Only organizations with Enterprise plans (or greater tiers) have access to self-service license management in the Upbound Console.

1. Visit your Console's landing page and click the **Licenses** button.

    Alternatively, click on **My Account > Manage Account** on the top right corner of your console, select the organization you would like to inspect under Organizations, and click the option **UXP Licenses** on the sidebar.

2. View the list of existing licenses displayed on the page.

    The list includes:
    * License name
    * Status (Active or Expired)
    * Resources allocated per month
    * Operations allocated per month
    * Creation date
    * Expiration date

3. Use the search bar to quickly find licenses by name, status, or number of resources/operations allocated per month.

### License statuses

Each license has one of two potential statuses:

* **Active**: The license is within its validity period
* **Expired**: The license is past its expiration period

## Download existing licenses (Enterprise plans and above)

1. Navigate to the Licenses page in your Upbound Console.

2. Click the three dots (actions menu) in the license of your choice.

3. Click **Download License**.

    The download process starts automatically and a JSON file is stored in your local machine.

4. Click the **Provisioning Instructions** button at the top of the table to see up-to-date documentation on how to apply the license to your Kubernetes Cluster.

The downloaded license file is in JSON format and contains all the information required by your control plane to verify its authenticity and operate with it.

Note: In the license file, the capacity field references resource "hours" instead of resource per "month", and reflects the entire capacity allocated for the duration of the license (based on its expiration), not just for a single month. This is because:

* Resource Hours is the actual metric controllers track within user clusters for accuracy and precision
* Since licenses are applied to disconnected clusters (not reporting back consumption metrics), the license must hold the entire capacity at once

## Create a new license (Enterprise plans and above)

1. Navigate to the Licenses page in your Upbound Console.

2. Click the **Create** button at the top of the table.

    A modal window appears requiring the necessary information to complete the process.

3. Fill out the required information:

    * **License Name**: A meaningful name to identify the license within the pool of licenses created. Use cluster names, regions, or meaningful identifiers that can help you later know to which control plane your license is tied.
    * **Expiration**: The exact date when the license will expire. No expiration date can exceed your end contract with Upbound.
    * **Resources per Month**: Number of resources that the control plane will manage during a month.
    * **Operations per Month**: Number of operations the control plane will execute on a monthly basis.

4. Click the **Create** button to provision your license.

    Once submitted, the license is generated, charges are billed according to the resources/operations allocated, and the file is immediately available for download.

5. Download the license and follow the provisioning instructions to apply it to your control plane.

### Organizations without active contracts

If you see the Create button disabled, hover over it for insights on why the operation is not allowed.

Unless network errors or outages exist, the only reason the creation button is disabled is if your organization does not have a valid contract in Upbound's billing system (Metronome). In this case, reach out to support or your account representative to coordinate the proper provisioning of your account.

## Apply a license to an Upbound Crossplane cluster

To enable commercial features in an Upbound Crossplane cluster, you need a commercial license.

1. Connect to your Upbound Crossplane cluster.

2. Download your license file (if generated through the Console).

3. Apply the license with the up CLI:

    ```
    up uxp license apply /path/to/license.json
    ```

    If you don't provide a license key, UXP runs the Community edition.

Note: You may not re-use licenses across multiple Upbound Crossplane clusters.

## Verify a license

You can verify your license status using either the up CLI or kubectl.

### Using up CLI

Confirm your license status:

```
up uxp license show
```

It should print a result like the following:

```
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

Note: Since Licenses are used on disconnected UXP clusters, there is no live consumption being reported back to Upbound's SaaS. To understand how your license is being exhausted, leverage the up CLI or kubectl in your terminal.

### Using kubectl

Confirm your license status:

```
kubectl get license uxp
```

It should print a result like the following:

```
NAME   PLAN       VALID   REASON              AGE
uxp    standard   True    SignatureVerified   3h59m
```

### View detailed license status information

For a detailed view, use kubectl to return the full resource YAML information:

```
kubectl get license uxp -o yaml
```

The status field provides more information about your license entitlements and current usage:

| Field | Description |
| --- | --- |
| plan | The commercial plan associated with your license (Community, Standard, etc). |
| expiresAt | The date and time when your license is set to expire. |
| capacity | The total capacity granted by your license, such as resourceHours and operations. |
| enabledFeatures | A list of the commercial features unlocked by your license. |
| usage | The cumulative usage data tracked by the system, including utilization percentages. |
| conditions | Reports the real-time status, including LicenseValid and UsageCompliant conditions. |
| gracePeriodEndsAt | When the license grace period ends and the license becomes completely invalid. |

## Frequently asked questions

### How are licenses billed?

To match Upbound's pricing strategy, licenses are billed on a monthly basis. For example, if you create a license with 50 resources per month, 1000 operations per month, and an expiration date of 6 months, even though the JSON file itself contains the full allocation for the entire validity period, the billing is done on a monthly basis.

The first month is prorated depending on the date the license is created on (if not the first day of the month), and then for the following 5 months, you receive an invoice with the cost of 50 resources + 1000 operations.

## See also

* Usage Metering guide
* Contact your Upbound account representative to generate a license key for Upbound Crossplane
* Upbound pricing strategy documentation
<!-- vale on -->
