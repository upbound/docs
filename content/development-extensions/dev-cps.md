---
title: Development control planes
description: Use the Up CLI to create and manage development control planes
weight: 1
---

Development Control Planes are a specialized class of Upbound Control Planes designed to support the inner development loop, testing, and CI pipelines for Crossplane-based platforms. They offer a streamlined, cost-effective solution for developers to quickly iterate on their APIs and compositions without the overhead of production-grade configurations.
Development Control Planes are available in Cloud Hosted Spaces only.


Getting Started

The recommended method to create and use a Development Control Plane, is to use the Upbound CLI's up project run command.

up project run

This command will:

Create a Development Control Plane in Upbound Cloud

Deploy your project's configurations, including custom resources, compositions, and functions to the development control plane

Provide you with a connection to interact with the Control Plane

The other way is to create a development control plane directly in the Upbound Console.

Todo: Add screenshots once Matt’s designs are available

Key Features

Development Control Planes differ from standard production grade control planes in the following ways that make it the perfect environment for testing your Crossplane configurations.

Near instantaneous provisioning.

Reduced resource allocation for cost-effectiveness

Time-to-Live (TTL) for automatic cleanup

Hosted in the Upbound Cloud

Time-to-Live (TTL)

Development Control Planes are ephemeral by design, with an automatic cleanup mechanism based on a 24-hour Time-to-Live (TTL) setting.

TTL Behavior

The TTL countdown begins when the Control Plane is created.

An annotation on the Control Plane resource indicates the remaining time.

Once the TTL expires, the Control Plane is automatically deleted.

Limitations and Considerations

There are a few limitations to consider regarding development control planes. First, they are not suitable for production workloads, as these control planes are not highly available (HA).

Second, there are limits to how many concurrent development control planes you can create based on your Upbount account tier. Please check our pricing page for more information.