---
title: "UXP"
weight: 300
icon: "popsicle"
description: "The Upbound official Crossplane distribution."
hideFromHomepage: true
category: "resources"
---

Upbound Universal Crossplane (`UXP`) is the Upbound commercially supported version of Crossplane. UXP consists of upstream Crossplane and Upbound-specific enhancements and patches.

## About Universal Crossplane
UXP is [open source][open-source] and [Crossplane conformant][crossplane-conformant].

UXP installs into an existing Kubernetes cluster. UXP extends the Kubernetes API using [Custom Resource Definitions][custom-resource-definitions] to support Crossplane resource types.

## Universal Crossplane pods
UXP installs two pods into the Kubernetes cluster, inside the `upbound-system` namespace, by default.

<div id="uxp-pods">
```shell
kubectl get pods -n upbound-system
NAME                                      READY   STATUS    RESTARTS      AGE
crossplane-58b797d5c-fcsgc                1/1     Running   0             16h
crossplane-rbac-manager-59f79b9cd-fh4qx   1/1     Running   0             16h
```
</div>

* <Hover label="uxp-pods" line="3">crossplane</Hover> - The <Hover label="uxp-pods" line="3">crossplane</Hover> pod is the core controller that extends Kubernetes and installs Crossplane extensions like `Providers`.
* <Hover label="uxp-pods" line="4">crossplane-rbac-manager</Hover> - The <Hover label="uxp-pods" line="4">crossplane-rbac-manager</Hover> pod allows Crossplane to create and dynamically adjust [Kubernetes Role-based access control (RBAC)][kubernetes-role-based-access-control-rbac] for Crossplane resources in the Kubernetes cluster.
* <Hover label="uxp-pods" line="5">upbound-bootstrapper</Hover> - Only deployed if explicitly enabled, adds the AWS Marketplace controller that registers this instance with AWS Marketplace.

<!-- vale Upbound.Spelling = NO -->
<!-- allow "ref" in the link inside a shortcode -->
:::hint
The [Up command-line][up-command-line] installs Universal Crossplane using a Helm chart. Download the chart from [charts.upbound.io][charts-upbound-io] to see the full details of the Universal Crossplane install.
:::
<!-- vale Upbound.Spelling = YES -->


[up-command-line]: /operate/cli

[open-source]: https://github.com/upbound/universal-crossplane
[crossplane-conformant]: https://github.com/cncf/crossplane-conformance
[custom-resource-definitions]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[kubernetes-role-based-access-control-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[charts-upbound-io]: https://charts.upbound.io/main/
