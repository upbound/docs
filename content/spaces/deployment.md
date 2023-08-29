---
title: Deployment
weight: 900
description: A guide for deploying an Upbound Space in production
---

Upbound recommends devoting a Kubernetes cluster to run a Spaces deployment. You can install Spaces into any Kubernetes cluster, version v1.25 or later. Upbound validates the Spaces software runs on [AWS EKS](https://aws.amazon.com/eks/), [Google Cloud GKE](https://cloud.google.com/kubernetes-engine), and [Microsoft AKS](https://azure.microsoft.com/en-us/products/kubernetes-service).

## Deployment requirements

Spaces requires two things:

1. A Kubernetes cluster.
2. You must have an [Upbound account](https://www.upbound.io/register/a). Spaces is a feature only available for paying customers in the **Business Critical** tier of Upbound.

This guide helps you think through all steps needed to deploy Spaces for production workloads.

## Sizing a Space

The 

The number of control planes you plan to run in the Space.
The number of managed resources you plan each control plane to reconcile.
The Crossplane providers you plan to install in each control plane.
Most customers use Upbound Official Providers; the guidance presented below assumes you are doing the same. As a rule of thumb, a control plane responsible for continuously reconciling 1000 managed resources requires ~4 GB memory and ~8 CPU cores.

## Deploying more than one Space
