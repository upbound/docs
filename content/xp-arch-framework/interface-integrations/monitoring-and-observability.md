---
title: "Monitoring & Observability"
weight: 7
description: "A guide for how to integrate control planes with monitoring and observability tooling"
---

{{< hint "important" >}}
This section is under construction - stay tuned for additional guidance and best practices for monitoring & observability with Crossplane.
{{< /hint >}}

Crossplane is capable of being configured to emit prometheus metrics. After you've enabled metrics emission in Crossplane, you should use a tool to collect and aggregate the logs and metrics that are emitted. If your org is already using one of the many third-party solutions that integrate with Kubernetes for monitoring, such as Datadog, Grafana, or New Relic, you are encouraged to use them. 

## Enable metrics for Crossplane

When you go to install the helm chart for UXP, you should set the `metrics.enabled` value to `true`


