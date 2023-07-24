---
title: "Policy Engines"
weight: 5
description: "A guide for how to integrate control planes with a variety of interfaces"
---

{{< hint "important" >}}
This section is under construction - stay tuned for additional guidance and best practices for integrating policy engines with Crossplane.
{{< /hint >}}

An effective way to manage Crossplane is to enforce governance through policies. Any Kubernetes-compatible policy engine–-such as [Open Policy Agent Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/) or [Kyverno](https://github.com/kyverno/kyverno)–-can be installed alongside Crossplane. This allows users to write custom policies to enforce against Crossplane resources.

## Kyverno

Kyverno's Kubernetes-native policy engine is completely compatible with Crossplane. It works by running an admission controller on the cluster, after which you can author policies as Kubernetes resources.

## OPA Gatekeeper

Open Policy Agent (OPA) Gatekeeper is another policy engine you can use with Crossplane. You author policies using [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/). 

## Applying policies to a control plane

Don’t apply custom policies directly to the control plane. These policies are part of your control plane’s total configuration and should instead be defined in your control plane’s git repo source of truth (recommended earlier) and administered to your control plane that way. 