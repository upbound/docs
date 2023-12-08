---
title: "Monolithic providers"
weight: 20
description: "Support information for legacy monolithic Crossplane Providers"
---

Upbound delivered the AWS, GCP and Azure official providers as a single 
monolithic provider beginning in October, 2022. Starting June 13, 2023 
Upbound split these official providers into provider families consisting 
of multiple smaller providers. 

This split enables customers to only install the providers specifically 
needed for their deployment, reducing the requirements for running a control 
plane. 

This change is only a packaging change, and doesn't change the capabilities of the
providers.

Customers running on the original monolithic providers are strongly encouraged 
to migrate as soon as possible to the new family providers. 
For Upbound customers, support for monolithic providers is available through June 12, 2024.

{{<hint "tip" >}}
Upbound has released [migration tooling]({{<ref "migration" >}}) to automate the upgrade from monolithic to family providers.
{{</ hint >}}