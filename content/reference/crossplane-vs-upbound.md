---
title: Upbound vs Crossplane
weight: 1
description: A technical comparison of Upbound vs Crossplane
---

Upbound is so much more than Crossplane. Thousands of organizations around the world use Crossplane. Choosing to run the open source project on your own puts you in the business of managing low-level infrastructure to power your control planes. That's why organizations are choosing Upbound, so they can focus on what matters.

Upbound provides a cloud-native experience for Crossplane. Upbound supplements the core control plane experience with a holistic set of enterprise-grade features to help teams build, deploy, and operate Crossplane at scale. Upbound backs this with a 99.9% uptime SLA.

## Crossplane and Upbound feature comparison

{{< table "table table-hover">}}
|                                                | OSS Crossplane on Managed Kubernetes | Upbound |
| ----                                           | ----                                 | ----    |
| **Cloud-Native Design**                        |
| Crossplane environment                         | ✅                                    | ✅       |
| Interact with multiple cloud services          | ✅                                    | ✅       |
| Provision control plane in under a minute      | -                                    | ✅       |
| Serverless                                     | -                                    | ✅       |
| Autoscaling                                    | -                                    | ✅       |
| Infinite CRD Limits                            | -                                    | ✅       |
| Automatic Upgrades                             | -                                    | ✅       |
| Automatic Backups                              | -                                    | ✅       |
| **API Management**                             |
| Use compositions                               | ✅                                    | ✅       |
| Supports Crossplane community providers        | ✅                                    | ✅       |
| Supports Upbound Official Crossplane providers | -                                    | ✅       |
| Git-connected Configurations                   | -                                    | ✅       |
| Automatic API upgrades                         | -                                    | ✅       |
| **Operations**                                 |
| Get resource events                            | ✅                                    | ✅       |
| Operator Console                               | -                                    | ✅       |
| Claims Viewer and Debugger                       | -                                    | ✅       |
| **Interfaces**                                 |
| Direct API Server access                       | ✅                                    | ✅       |
| Control Plane `CRUD` portal                      | -                                    | ✅       |
| Out-of-box GitOps integration                  | -                                    | ✅       |
{{< /table >}}

## Constraints

Because Upbound fully manages control planes, Upbound locks down the hosted control plane environment to prevent malicious actors. You may not install arbitrary workloads (Pods, Deployments, etc) on your managed control plane.
