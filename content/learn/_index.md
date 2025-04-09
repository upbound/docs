---
title: Learn
weight: -1
description: "Learn how Upbound works and how it can work for you."
hideFromHomepage: true
category: "guides"
aliases:
    - /getstarted/_index
    - "/getstarted-devex"
---

Upbound is a scalable infrastructure management service built on Crossplane. The
advantage of Crossplane and Upbound is the universal control plane.

## Why control planes

Upbound uses control planes to manage resources through custom APIs. The control plane constantly monitors your cloud resources to meet the state you define in your custom APIs. You define your resources with Custom Resource Definitions (CRDs), which Upbound parses, connects with the service, and manages on your behalf.

## Why Upbound

Upbound offers several advantages for managing complex infrastructure. As your infrastructure grows, managing cloud environments, scaling, and security can become more challenging. Other infrastructure as code tools often require more hands-on intervention to avoid drift and deploy consistently across providers.

By adopting Upbound, you gain:

- Integrated drift protection and continuous reconciliation
- Scalability across providers
- Self-service deployment workflows
- Enhanced security posture and reduced blast radius
- Consistent deployment using GitOps principles

## Try it out

If you haven't yet, create an Upbound account to get started.

After you create your account and sign in, follow the steps below to create your
first control plane:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.7651767845230153; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm8ceyb5e0u0k2ugqeccjie3g?embed_v=2" loading="lazy" title="Upbound Demo" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

Next, create your resource claim:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm8dk0ou801072k0ixpy9parl?embed_v=2" loading="lazy" title="Consumer Portal Demo" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

Finally, destroy your resources when you're done:

<div style="position: relative; box-sizing: content-box; max-height: 80vh; max-height: 80svh; width: 100%; aspect-ratio: 1.764294049008168; padding: 40px 0 40px 0;"><iframe src="https://app.supademo.com/embed/cm8dqshq521f72ugqg8e3o4ye?embed_v=2" loading="lazy" title="Destroy" allow="clipboard-write" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Next steps

You just created your first control plane with cloud resources.

Now that you understand how Upbound manages your resources with a control plane,
go to the next guide to build with Upbound in the CLI.
