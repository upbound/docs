---
title: "Monitoring & Observability"
weight: 7
description: "A guide for how to integrate control planes with a variety of interfaces"
---
There are two aspects to Universal Crossplane monitoring
and observablity. Monitoring Crossplane itself, and composing
capabilities to offer monitored resources upon issueing a claim.

### Crossplane and Provider Observability

In order to enable metrics for Crossplane, you must configure the
option `metrics.enabled` and set it to `true`. This can be done
during initial installation of Crossplane, or at any time while it
is running for instance when using the Upbound `up uxp install` or
`up uxp upgrade` command.

The metrics that Crossplane and its providers emit are available
at port 8080 under the `/metrics` URL path. The metrics feed can
be picked up with a Prometheus or Prometheus compatible scraper.
The specific metrics inform about the Crossplane and provider
Kubernetes pod performance. They include the following categories:

- Certwatcher Read Requests and Errors
- Controller Runtime Recociliation Counts
- Go Memory and Threads
- Leader Election Status
- Process CPU and Memory
- Rest Client Requests
- Workqueue Depth and Processing Duration
- Provider Processes

After you've enabled metrics emission in Crossplane, you should use a
tool to collect and aggregate the logs and metrics that are emmitted.
If your org is already using one of the many third-party solutions that
integrate with Kubernetes for monitoring, such as Datadog, Grafana,
or New Relic, you are encouraged to use them.

### Managed Resource Observability

When you design your custom APIs that are mapped to provider
capabilities through compositions, it is a good practice to
identify which observability features to provision along with those
resources. Amazon AWS, Google GCP and Microsoft Azure provider
families all include aspects of observability provisioning features.
To name a few, `provider-gcp-monitoring` gives you access to
a rich set of Google Cloud metrics. Amazon `provider-aws-cloudwatch`
allows setting of alarm triggers and Microsoft `provider-azure-logz`
enables monitoring of event logs. In addition to these, the Upbound
Marketplace has a a couple of related providers, such as
`provider-grafana` and `provider-newrelic`.

Consider to automatically create dashboards for the networks, databases
compute such as Kubernetes clusters and other resources you might
compose when receiving a resource claim from your application teams.
It will create a greater experience for
them because they now have insight regarding the health of the
resources that they just claimed. Based on your organization's needs
and the specific requirements of your own customers, engage in
discussions with them what they would like to see.
