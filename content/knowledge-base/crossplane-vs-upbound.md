---
title: Upbound vs Crossplane
weight: 1
description: A technical comparison of Upbound vs Crossplane
---

Upbound is so much more than Crossplane. Crossplane is used by thousands of organizations around the world. But choosing to run the open source project on your own puts you in the business of managing low-level infrastructure to power your control planes. That's why organizations are choosing Upbound, so they can focus on what matters.

Upbound provides a cloud-native experience for Crossplane, supplementing the core control plane experience with a holistic set of enterprise-grade features to help teams build, deploy, and operate Crossplane at scale. All of this is backed by Upbound's 99.9% uptime SLA.

## Feature Comparison

{{< table >}}
| | OSS Crossplane on Managed Kubernetes | Upbound |
| ---- | ---- | ---- | 
| **Cloud-Native Design** | 
| Crossplane environment | ✅ | ✅ | 
| Interact with mutliple cloud services | ✅ | ✅ | 
| Provision control plane in under a minute | - | ✅ | 
| Serverless | - | ✅ | 
| Autoscaling | - | ✅ | 
| Infinite CRD Limits | - | ✅ | 
| Automatic Upgrades | - | ✅ | 
| Automatic Backups | - | ✅ | 
| **API Management**  | 
| Use compositions | ✅ | ✅ | 
| Supports Crossplane community providers | ✅ | ✅ | 
| Supports Upbound Official Crossplane providers | - | ✅ | 
| git-connected Configurations | - | ✅ | 
| Automatic API upgrades | - | ✅ | 
| **Operations**  | 
| Get resource events | ✅ | ✅ | 
| Operator Console | - | ✅ | 
| Claims Viewer & Debugger | - | ✅ | 
| **Interfaces**  | 
| Direct API Server access | ✅ | ✅ | 
| Control Plane CRUD portal | - | ✅ | 
| Out-of-box GitOps integration | - | ✅ | 
{{< /table >}}

## Constraints

Because Upbound fully manages control planes, certain security measures are taken to lock down the environment to prevent malicious actors. You may not install arbitrary workloads (Pods, Deployments, etc) on your managed control plane.

