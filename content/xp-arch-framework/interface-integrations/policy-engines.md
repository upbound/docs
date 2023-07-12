---
title: "Policy Engines"
weight: 5
description: "A guide for how to integrate control planes with a variety of interfaces"
---

An effective way to manage Crossplane is to enforce governance through policies. Any Kubernetes-compatible policy engine–-such as [Open Policy Agent](https://github.com/open-policy-agent/opa) or [Kyverno](https://github.com/kyverno/kyverno)–-can be installed into Crossplane. This allows users to write custom policies to enforce against Crossplane resources.

When setting policies, apply them based on the requirements of the control plane. Do you want to Audit or Deny the action? In Audit mode, the action is allowed but it’s flagged as Non-Compliant. Have processes to check non-compliant states at a regular cadence and take necessary action. In Deny mode, the action is blocked because it violates the policy. Be careful in choosing this mode because it can be too restrictive for the workload to function.

Don’t apply custom policies directly to the control plane. These policies are part of your control plane’s total configuration and should instead be defined in your control plane’s git repo source of truth (recommended earlier) and administered to your control plane that way. 