---
title: Upbound Cloud Pricing
sidebar_position: 50
description: An overview of pricing for Upbound Cloud, Connected Spaces, and Connected UXP control planes 
plan: "standard"
---

<Standard />


Upbound Cloud, [Connected Spaces], and Connected UXP control planes operate on a
consumption-based service model. You only pay for what you use based on
Crossplane Resources and Operations consumption.

This document describes each of the metrics used to define the pricing model
and information to estimate your implementation costs. For more exact estimates,
[reach out to us][contact-us].

If you are an existing customer looking for your current consumption and billing
information, visit the [Upbound Console]. 

## Pricing model

Your monthly invoice includes a combination of usages of Upbound Cloud Resources
(Resource-months and [Operations][operation]) and a minimum monthly commitment that
includes support.

All paid pricing plans contain a minimum commitment of Resource-Months and
Operations. Any usage that exceeds this initial free consumption is
automatically invoiced at the publicly listed prices subject to volume discounts
and additional credits.

:::important
Partial months are prorated to the day.
:::

### Resource-Months

A Resource-Month represents the reconciliation of one Crossplane resource over
the period of one month. 

Crossplane resources are:

* Claims (XRCs)
* Composite Resources (XRs)
* Managed Resources (MRs)
* Composed Resources - any resource other than an MR managed by a composite
    resource

Crossplane resources excluded from Resource-Month calculations are:
* Providers
* Functions
* `ProviderConfig` and ` ProviderConfigUsage` resources
* Events

Upbound measures the time a resources is alive to an accuracy of approximately
one minute.

#### Example

An example for a control plane with 1000 resources for a full month:

* 200 XRs created, each composes 4 MRs
* 200 XRs + 800MRs = 1000 billable Crossplane resources
* 1000 resources = 1000 Resource-Months

:::note
One month is defined as 730 hours
:::

### Operations

An Operation represents a run of a single, unique Crossplane [Operation]
resource. A unique Operation is tied to a resources UID. Deleting and
recreating an Operation represents 2 billable Operations.

## Plans

Upbound manages pricing plans and billing at the organization level. An Upbound
user can belong to multiple organizations with different billing plans. Feature
availability depends on your organization context.

Upbound paid plans are invoiced each calendar month. Included Resource-Month and
Operation is reset each invoice.

For more information on plans and feature availability, refer to the
[Upbound pricing][pricing] page


## FAQ


<details>

    <summary>What payment methods does Upbound accept?</summary>

Upbound accepts credit cards as payment for Standard tier. [Contact our sales team][contact-us] to discuss other options.

</details>

<details>

    <summary>How often will I be billed?</summary>

Upbound paid plans are invoiced at the beginning of every calendar month. 

</details>

<details>

    <summary>Where can I view my usage and billing details?</summary>

To find your monthly consumption and your current billing details, visit the [Upbound Console].

</details>

<details>

    <summary>Do my included Resource-Months or Operations roll over month-to-month?</summary>

The Resource-Months and Operations included in the Standard tier plan aren't rolled over between months. 

</details>

<details>

    <summary>How does billing work for self-managed UXP or Spaces?</summary>

The pay-as-you-go billing model is only applicable to Upbound Cloud and connected UXP or Spaces. For self-hosted Spaces, you must purchage a capacity based license through our [license management] system.

</details>

<details>

    <summary>Will I be billed for paused control planes?</summary>

No, you won't get charged for resources or operations managed in any control plane that has a status of Paused.

</details>

<details>

    <summary>How can I downgrade from a paid plan?</summary>

[Contact our customer support team][support] to assist with downgrading an existing organization on a paid plan.

</details>

<details>

    <summary>Do you have a way to estimate the cost of migrating to Upbound?</summary>

[Contact our Sales team][contact-us] for more exact pricing estimates.

</details>

[connected spaces]: /manuals/spaces/howtos/self-hosted/attach-detach/
[contact-us]: https://www.upbound.io/contact-us
[upbound console]: https://console.upbound.io
[operation]: https://docs.crossplane.io/latest/operations/
[pricing]: https://upbound.io/pricing
[license management]: /manuals/uxp/howtos/license-management/#license-management-in-the-upbound-console-enterprise-and-above
[support]: https://help.upbound.io/


