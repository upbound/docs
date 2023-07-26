---
title: "Monitoring & Observability"
weight: 7
description: "A guide for how to integrate control planes with monitoring and observability tooling"
---

{{< hint "important" >}}
This section is under construction - stay tuned for additional guidance and best practices for monitoring & observability with Crossplane.
{{< /hint >}}

Crossplane is able to emit Prometheus metrics. After you've enabled metrics emission in Crossplane, you should use a tool to collect the logs and metrics. You can then integrate with third-party monitoring solutions such as Datadog, Grafana, or New Relic.

## Enable metrics for Crossplane

When you go to install the helm chart for UXP, you should set the `metrics.enabled` value to `true`


