---
title: About Upbound
sidebar_position: 4
description: Learn what Control Planes are and why you should use them
---


Upbound is the platform that helps platform engineers automate and build their
platforms.

Upbound offers scalable and powerful platform tools to help you build control
planes that manage your applications and infrastructure.

## What are control planes?

**A control plane is software that controls other software.**

Control planes are a core cloud native pattern. The major cloud providers are
all built using control planes.

Control planes expose an API. You use the API to tell the control plane what
software it should configure and how - this is your _desired state_.

A control plane can configure any cloud native software. It could deploy an app,
create a load balancer, or create a GitHub repository.

The control plane configures your software, then monitors it throughout its
lifecycle. If your software ever _drifts_ from your desired state, the control
plane automatically corrects the drift.

The Upbound platform gives rich ecosystem of extensions that make building a control plane
faster and easier. 

## The Upbound Platform

At it's core, Upbound is a platform that provides all the tools and experiences 
you need to build your own platform powered by Crossplane control planes.

Upbound Crossplane (UXP) is the best way to build control planes that deploy your
platform.

Upbound Spaces are hosting environments where Upbound can _manage_ your control
planes.

## Why control planes?

**The key value of control planes is that they unlock the benefits of building
your own custom APIs to build the resources your users need.** 

Upbound uses control planes to manage resources through custom APIs. The control
plane constantly monitors your cloud resources to meet the state you define in
your custom APIs. You define your resources with Custom Resource Definitions
(CRDs), which Upbound parses, connects with the service, and manages on your
behalf.

## About the documentation

Upbound organizes it's documentation into the following sections:

### Fundamentals

[Fundamentals][fundamentals] introduces Upbound control plane concepts with:

* Get Started
* Builder's Workshop

### Upbound Crossplane

[Upbound Crossplane][uxp] takes a deeper look at the concepts introduced in the
Fundamentals section. You'll learn:

* The Composition workflow in depth
* Managed Resource deployment
* How to work use packages, like Official Providers, functions, operations, and configurations to help you build your
    control planes
* Working with the UXP WebUI
* How to configure features enabled with a **Commercial License** like:
    * Backup and restore
    * Vertical pod auto-scaling


### Upbound Spaces

[Upbound Spaces][spaces] introduces the managed hosting service, Spaces. In this
section, you'll learn:

* About the deployment options of Cloud and Self-hosted Spaces
* How to configure Spaces-only features

### Reference

[Reference][reference] captures:

* Crossplane API
* Spaces API
* Query API
* Testing API
* `up` CLI command reference
* Release Notes
* Helm Chart Reference

### Solutions

[Solutions][solutions] covers end-to-end guides for building:

* Your own Internal Developer Platform

[fundamentals]: /fundamentals/get-started
[uxp]: /uxp
[spaces]: /spaces
[reference]: /reference
[solutions]: /solutions/idp-starter-kit
