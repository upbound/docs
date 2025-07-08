---
title: "Design the platform"
sidebar_position: 10
description: "A guide to designing the parts of your platform powered by Upbound"
---

To get started on your journey designing an IDP on Upbound, zoom out and think about the big picture of what you want to accomplish. 

## Parts of a platform

At a high level, all platforms on Upbound are usually composed of the following parts:

- **Interfaces.** Your platform will offer one or more modes to interact with it. A common interface is a GUI, such as a web app. 
- **Your platform's API.** You will define what APIs your platform offers and is responsible for managing. These APIs represent resource types offered on your platform, and they range from things like a Bucket abstraction to a complex multi-cloud serverless experience. The power is in your hands and the sky's the limit. 
- **Your control planes.** These form the core of your platform and they're responsible for handling the resource requests made to your API. 
- **Connectivity to underlying services.** The next generation of the cloud is powered by platforms that provide streamlined experiences on top of existing infrastructure and cloud services, such as AWS, Azure, GitHub, VMWare, and more.

Here's a visual depiction of the high-level shape of a platform powered by Upbound:

```
picture
```

## Chart your journey

Before jumping into building the foundations of your platform, remember that platforms are a multi-year investment that matures and gets enhanced over time. Consider your favorite Cloud Service Provider (AWS, Azure, GCP, OCI, or other) and think about the wide range of services they provide to their users. The crux of what a product like GCP offers is:

- A set of managed service experiences…
- …for vending out `some resource`-as-a-service
- …and that provides continual lifecycle management and ops experiences around that resource

Whether it's Google Kubernetes Engine vending out Kubernetes Clusters or Big Query as a managed data platform, almost all services offered by these cloud providers follow the same pattern. As Upbound, we encourage you to think about your IDP in a similar spirit, focused around what offerings you want your platform to provide, to deliver business value to its users. We define an offering as:

- a managed service experience …
- …for vending out a resource abstraction defined by your platform teams
- …and that provides continual lifecycle management and ops experiences around that resource

Traditional cloud platforms like GCP, which consist of physical assets such as server racks, storage disks, and networking infrastructure located in physical data centers around the globe, offer computing services powered by virtualized resources based on these physical assets. Your IDP powered by Upbound is a next-gen platform that offers its own computing services powered by the lower-level services found in traditional cloud platforms. Said another way: Your IDP on Upbound leverages the investments of lower-level cloud platforms and lets you focus on baking in the policies, configuration, and multi-cloud configurations that your business requires.

### Examples of common Offerings

In Upbound, an offering maps to a group of one or more composite resource APIs built with Crossplane. Some of the most common offerings we see customers building includes:

- AI Platforms
- Databases and Storage
- Networking
- API management
- Compute (virtual machines, serverless, and more)

Because Upbound managed control planes are built around Crossplane, you're not limited to only building these offerings. As long as there's:

- a Crossplane provider that implements the underlying resources you want to abstract as a Managed Resource 
- or there exists a Kubernetes Custom Resource

you can use the power of Crossplane to build a new composite resource API on top of it.

## Prioritizing your first use cases

Based on the use cases of your platform on Upbound, we recommend prioritizing only a subset of the total offerings you want your platform to provide. Pick one or two offerings, or use any of the available [Configurations from Upbound](configurations). 

## Next steps

Learn how to [use an Upbound control plane to bootstrap](bootstrap) the rest of the platform.

[configurations]: https://marketplace.upbound.io/configurations
[bootstrap]: bootstrap.md

