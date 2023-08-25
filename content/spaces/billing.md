---
title: Billing
weight: 500
description: A guide for how billing works in an Upbound Space
---

Spaces are a self-hosting feature of Upbound's [flagship product](https://www.upbound.io/product/upbound) for platform teams to deploy managed control planes in their self-managed environments. You can install Spaces into any Kubernetes cluster in your own cloud account, on-premises data center, or on the edge. The pricing usage-based and requires an Upbound account and subscription. The billing unit is a `Loop`.

## Billing details

Spaces aren't **connected** to Upbound's global service. To enable proper billing, the Spaces software ships a controller whose responsibility is to collect billing data from your Spaces deployment. The collection and storage of your billing data happens expressly locally within your environment; no data is automatically emitted back to Upbound's global service. Spaces periodically exports the billing data out of the Spaces controller to a secure file in your environment.

Spaces customers must periodically provide the billing data to Upbound. Contact your Upbound sales representative to learn more.

### Export billing data to send to Upbound

To prepare the billing data to send to Upbound, do the following:

1. Ensure the current context of your kubeconfig points at the Spaces cluster.
2. Run the [export]({{<ref "reference/cli/command-reference.md#space-billing-get">}}) command.
```bash
up space billing get
```
3. The command creates a billing report that's zipped up in your current working directory.
4. Send the output to your Upbound sales representative.

You can find full instructions and command options in the up [CLI reference]({{<ref "reference/cli/command-reference.md#space-billing">}})  docs.