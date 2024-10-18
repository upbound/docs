---
title: "Baseline Architecture - Simple"
weight: 10
description: "A guide for how to build with control planes"
---

This reference architecture provides a recommended baseline to power a single platform on Upbound. This architecture isn't focused on a workload or role to be served by the control plane-powered platform, rather it concentrates on how to structure your control planes on Upbound. The information here is the minimum recommended baseline for most control plane-powered platforms.

## Diagram 

{{<img src="/reference-architectures/images/upbound-baseline-arch-no-argo.png" alt="Baseline Upbound architecture" size="medium" unBlur="true" >}}

{{< hint "tip" >}}
Click the diagram to make it larger.
{{< /hint >}}

## Layout

### Control plane project

Use Upbound's platform builder tooling available in `up` to create a source-level project. Denoted by an `upbound.yaml` in the architecture diagram above, this project houses the definition of your control plane. Use a git repo hosted on a version control service as the single source of truth containing the definition for your platform's control plane. You should place all configurations applicable to your control plane in this repo. At a high level, you can think of a project defining your control plane as:

- your platform API schemas defined as `CompositeResourceDefinitions (XRDs)`. All APIs belong in the `apis/` folder under your project.
- the implementation of those schemas, defined as Crossplane `compositions`. All compositions should be placed alongside the XRD they implement in the `apis/` folder.
- compositions functions, which are modules referenced by your compositions that define how to compose resources. All functions should be placed in the `functions/` folder.
- example configs for your API, so you can conduct testing as part of your inner-loop development. All example should be plced under the `examples/` folder.

Upbound's tooling defines a default project structure as:

```bash
.
├── upbound.yaml # Your control plane project is defined here
├── apis/ # Each API (XRD and composition) are defined here
│   ├── SuperBucket/ 
│   │   ├── definition.yaml
│   │   └── composition.yaml
│   ├── SuperDatabase/ 
│   │   ├── definition.yaml
│   │   └── composition.yaml
├── functions/ # Define reusable function modules used by compositions
│   ├── bucketFunction/
│   │   └── main.k 
│   ├── databaseFunction/
│   │   └── main.py
├── examples/ # Define example configs for your API
│   ├── SuperBucket/ 
│   │   └── example.yaml
│   ├── SuperDatabase/ 
│   │   └── example.yaml
└── _output/ # 'up project build' places the OCI image output here.
```

Control plane projects require a **build** step to assemble all parts of your control plane together into a single OCI image. The output of the build step is placed in the `_output/` folder by upbound's tooling.

### Control planes on Upbound

Following software best practices, Upbound recommends the creation of three control plane instances mapping to software environments. Each control plane is responsible for managing cloud resources in a corresponding set of cloud accounts:

- a control plane for inner-loop development. This control plane is used by the platform team to iterate on their API schemas and compositions.
- a control plane for non-prod. This control plane is used as a staging environment by the platform team before rolling onto production.
- a control plane for production. This control plane is what powers your platform and is ultimately used by your platform consumers.

All three control planes derive their definition from a single control plane project. The versioned artifact built from the project differs between control planes.

### Configure CI/CD

Control plane projects require a **build** step to assemble all parts of your control plane together into a single OCI image. Upbound recommends setting up a Continuous Integration (CI) flow to build


## Configure operations

### Add secrets to control planes

Secrets in Kubernetes are objects that hold sensitive data like passwords, tokens and keys. Crossplane uses Secrets to store sensitive information, such as credentials for Crossplane providers, inputs to managed resources, or connection details. 

If you don't configure Crossplane to use an external secrets store, when you configure a managed resource to write a secret (such as when you configure the object to use `writeConnectionSecretToRef: ...`), that secret gets written in the control plane. Most organizations have security requirements that recommend storing all secrets in a centrally managed key-value store (such as Vault, AWS Secrets Manager, etc); reliance on in-cluster secrets aren't considered a best practice. Therefore, our architecture baseline recommends configuring your control plane to use an external secrets store.

Use Upbound's `Shared Secrets` to provision secrets into each of your control planes.

### Monitor and collect metrics

Use Upbound's `Shared Telemetry Configs` to configure telemetry collection for all things in your control planes and send them to your preferred observability solution, such as DataDog or New Relic.

### Platform continuity

Use Upbound's `Shared Backup Configs` to establish a schedule for how often your control plane's state is backed up.

## Tenancy on your control plane

TODO - replace

Many users create control planes that have multiple consumers. Suppose you are building a platform that has 10 teams who will use your control plane to create resources. In this example, each consuming team is a "tenant." The Kubernetes documentation on [multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) does a thorough job covering this topic for Kubernetes generally. We will cover how it maps to Crossplane specifically.

Sharing control planes can save cost and simplify administrative overhead. However, much like a shared Kubernetes cluster, shared control planes introduce security and performance considerations that need to be carefully evaluated.

{{< hint "tip" >}}
Best Practice: If you have security requirements to ensure certain teams are only able to create resources in certain cloud accounts, we strongly recommend adopting a multi-control plane architecture that segments teams to their own control planes. Discrete control planes will always be a stronger isolation boundary than namespaces.
{{< /hint >}}

If you are comfortable with tenants on a control plane being able to have read-only visibility of other tenants' resources, you should feel confident using Kubernetes' and Crossplane's built-in tenancy capabilities.

{{< table "table table-sm" >}}
| Crossplane concept | Scope |
| ---- | ---- |
| Claim | namespace |
| Managed Resource | cluster |
| Composite Resource | cluster |
| Providers | cluster | 
| ProviderConfig | cluster |
{{< /table >}}

## Consume control plane APIs

Your control plane’s API can be consumed in a variety of ways. Upbound offers an out-of-box `Consumer Portal` that can be used to create, view, and manage resoure claims.

## Next Steps

Now that we've explained the baseline architecture recommendation, you may want to understand when its appropriate to consider running more complex arcihtectures. You may want to consider:

- [architecting for multi-tenancy]({{< ref "architecture-baseline-multitenant.md" >}})
- [architecting with services]({{< ref "architecture-baseline-services.md" >}})
- [architecting with self-hosted deployments]({{< ref "architecture-self-hosted.md" >}})