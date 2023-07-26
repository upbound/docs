---
title: "Monitoring & Observability"
weight: 7
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Crossplane has two aspects to consider for monitoring
and observability. Monitoring Crossplane itself, and composing
capabilities to offer monitored resources upon issuing a claim.

### Crossplane and provider observability

To enable metrics for Crossplane, you must configure the
option `metrics.enabled` and set it to `true`. Do this during the initial install of Crossplane, or at any time while it
is running. For instance, when using the Upbound `up uxp install` or
`up uxp upgrade` command.

The metrics that Crossplane and its providers emit are available
at port 8080 under the `/metrics` URL path. Pick up the metrics feed with Prometheus or a Prometheus compatible scraper.
The specific metrics inform about the Crossplane and provider
Kubernetes pod performance. They include the following categories:

- Certwatcher Read Requests and Errors
- Controller Runtime Reconciliation Counts
- Go Memory and Threads
- Leader Election Status
- Process CPU and Memory
- Rest Client Requests
- Work queue Depth and Processing Duration
- Provider Processes

After you've enabled metrics emission in Crossplane, you should use a
tool to collect the emitted logs and metrics.
Your org may already be using one of the third-party solutions that
integrate with Kubernetes for monitoring. Examples include as Datadog, Grafana,
or New Relic. You should use these with Crossplane.

### Managed resource observability

When you design your custom APIs, they map to provider
capabilities through compositions. It's a good practice to
identify which observability features to provision along with those
resources. Amazon AWS, Google GCP and Microsoft Azure provider
families all include aspects of observability provisioning features.
For example, `provider-gcp-monitoring` gives you access to
a rich set of Google Cloud metrics. Amazon `provider-aws-cloudwatch`
allows setting of alarm triggers and Microsoft `provider-azure-logz`
enables monitoring of event logs. Also, the Upbound
Marketplace has a couple of related providers, such as
`provider-grafana` and `provider-newrelic`.

You may want to automatically create dashboards for the resources you might
compose when receiving a resource claim from your application teams.
It creates a better experience for
them because they now have insight into the health of the
resources that they just claimed. Based on your organization's needs
and the specific requirements of your own customers, engage in
discussions with them what they would like to see.