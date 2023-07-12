---
title: "Platform Frontends"
weight: 4
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Just like Kubernetes, the default interface to a new Crossplane instance is the [Kubernetes-based API](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/), typically accessed via a tool like [kubectl](https://kubernetes.io/docs/reference/kubectl/). Alternatively, users can use any http client such as `curl` to directly access the REST API of their Crossplane.

Most users don't want to directly expose their Crossplane's API server to users. Commandline terminals can be an unfriendly user interface for some, so users may have an interest in connecting their own frontend to their control plane. You are welcome to use any frontend that you like with Crossplane (such as if you have built a home-grown web app), but a very popular platform designed for building developer portals is [Backstage](https://backstage.io/). In this framework, we will provide a set of best practices for integrating Backstage with Crossplane.

## Backstage

todo