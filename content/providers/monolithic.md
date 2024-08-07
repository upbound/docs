---
title: "Monolithic providers"
weight: 20
description: "Support information for legacy monolithic Crossplane Providers"
---

{{<hint "important" >}}
Support for monolithic providers came to an end on June 12, 2024.
{{</ hint >}}

Upbound delivered the AWS, GCP and Azure official providers as a single 
monolithic provider beginning in October, 2022. Starting June 13, 2023 
Upbound split these official providers into provider families consisting 
of multiple smaller providers. 

This split enables customers to only install the providers specifically 
needed for their deployment, reducing the requirements for running a control 
plane. 

This change is only a packaging change, and doesn't change the capabilities of the
providers.

{{<hint "tip" >}}
Upbound released [migration tooling]({{<ref "migration" >}}) to automate the upgrade from monolithic to family providers.
{{</ hint >}}
