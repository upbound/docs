---
title: Development control planes
description: Use the Up CLI to create and manage development control planes
weight: 1
---

Development control planes are a subset of Upbound's Managed Control Planes.
Development control planes aim to help you in your Upbound journey and support
your development loop, testing, and CI pipeline configuration. These resource-limited, short-TTL control planes offer a cost-effective way to test and calibrate APIs and compositions without production-level overhead.

{{<hint>}}
Development Control Planes are available in Cloud Hosted Spaces only.
{{</hint>}}

## Create a development control plane

To create a Development Control Plane, use the Upbound CLI's `up project run`
command in an existing project. Follow the Upbound Quickstart to create a new
example project.

```shell
up project run
```

The `up project run` command creates a development control plane in your Upbound
Cloud organization. It spins up your project's custom resources, compositions,
and functions in a limited scope isolated control plane.

## Benefits of a development control plane

Development control planes differ from standard control planes in several ways:

* Near instantaneous provisioning.
* Reduced resource allocation for cost-effectiveness.
* Time-to-Live (TTL) for automatic cleanup. Development control planes deploy with a
  24-hour lifespan and get deleted after that.
* Hosted in the Upbound Cloud.

<!-- vale gitlab.HeadingContent = NO -->
## Limitations and considerations
<!-- vale gitlab.HeadingContent = YES -->

<!-- vale Microsoft.Contractions = NO -->
Development control planes are **not** suitable for production workloads.
<!-- vale Microsoft.Contractions = YES -->

<!-- vale Google.We = NO -->
Upbound limits the number of concurrent development control planes you can
create based on your account tier. Review our pricing for more information.
<!-- vale Google.We = YES -->
