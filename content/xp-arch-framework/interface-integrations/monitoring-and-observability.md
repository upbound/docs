---
title: "Monitoring & Observability"
weight: 7
description: "A guide for how to integrate control planes with a variety of interfaces"
---

In order to enable metrics for Crossplane, you must configure the install-time option `metrics.enabled` and set it to `true`. After you've enabled metrics emission in Crossplane, you should use a tool to collect and aggregate the logs and metrics that are emmitted. If your org is already using one of the many third-party solutions that integrate with Kubernetes for monitoring, such as Datadog, Grafana, or New Relic, you are encouraged to use them. 
