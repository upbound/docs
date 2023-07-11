---
title: "Interface Integrations"
weight: 20
description: "A guide for how to integrate control planes with a variety of interfaces"
---

Crossplane sits at the core of your platform. As a result, there are about ten areas you need to think about integrating with. We've categorized them into the following:

- [Platform frontends](#platform-frontends)
- [Git and GitOps](#git-and-gitops)
- [CI/CD]()
- [Secret Management](#secrets-management)
- [Policy Engines](#policy-engines)
- [Platform Continuity](#platform-continuity)
- [Monitoring & Observability](#monitoring--observability)
- [Authentication & Authorization](#authentication--authorization)
- [Security](#security)

Crossplane has built-in capabilities for some of these areas. For other areas, it is up to users to bring 3rd party toolchains to integrate with Crossplane and address the particular use case. Because Crossplane exists in the Kubernetes ecosystem, users oftentimes find value in being able to reuse familiar Kubernetes tooling with Crossplane. In this framework, we will provide guidance for how to leverage built-in functionality where present, and integrate Crossplane with popular 3rd party tools when necessary.

## Platform Frontends

Just like Kubernetes, the default interface to a new Crossplane instance is the [Kubernetes-based API](https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/), typically accessed via a tool like [kubectl](https://kubernetes.io/docs/reference/kubectl/). Alternatively, users can use any http client such as `curl` to directly access the REST API of their Crossplane.

Most users don't want to directly expose their Crossplane's API server to users. Commandline terminals can be an unfriendly user interface for some, so users may have an interest in connecting their own frontend to their control plane. You are welcome to use any frontend that you like with Crossplane (such as if you have built a home-grown web app), but a very popular platform designed for building developer portals is [Backstage](https://backstage.io/). In this framework, we will provide a set of best practices for integrating Backstage with Crossplane.

### Backstage

todo

## Git and GitOps

GitOps is a pattern for declaratively describing a desired resource's configuration in git. Crossplane is completely compatible with this pattern and we strongly recommend customers implement GitOps in their platforms built on Crossplane. There are three ways you should plan for integrating with git and setting up GitOps flows with Crossplane:

1. **Use git to store the infrastructure definition that backs your control plane**.
2. **Use git for storing your custom APIs**. Building custom APIs with Crossplane does not require users to write code, but you are still required to write configuratioons and definitions as .yaml. As with traditional software development, you should store your custom API definitions in git. Learn more about how to sturcture your repo and define your APIs in the [Building APIs](../building-apis) section of this framework.
3. **Use git as an interface to invoking your control plane's APIs**. When users think of `GitOps` with Crossplane, its usually in this regard, because claims are the objects that faciliate creation of new resources via your API.

In any case, [Flux](https://fluxcd.io/) and [Argo](https://argo-cd.readthedocs.io/en/stable/) are two examples of projects in the Kubernetes ecosystem that you can use in tandem with Crossplane to achieve GitOps flows. 

### Integrate Crossplane with Flux

Flux is a set of controller that keeps Kubernetes clusters in sync with a configuration source (i.e. git).

{{<img src="xp-arch-framework/images/flux.png" alt="A simple illustration of Flux" size="small" quality="100">}}

If you are using self-hosted Flux, you need to deploy it into a Kubernetes cluster. Once you have installed Flux into a cluster, you will want to configure it in two ways:

1. Tell Flux which git sources to pull.
2. Tell Flux which clusters to target applying changes to.

While you _could_ install Flux into the same cluster where Crossplane has been installed into, our baseline recommendation from a central cluster and register your Crossplane clusters with it. This approach scales better for users who plan to run several Crossplanes.

{{< hint "note" >}}
💡 If your production scenario involves running only one instance of Crossplane, for simplicity this recommendation does not apply.
{{< /hint >}}

To configure Flux for deploying to multiple clusters, you will need to do the following:

1. Define a new `GitRepository` source for each control plane
```yaml
#xp-repo.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: your-repo-source
  namespace: default
spec:
  interval: 30s
  ref:
    branch: main
  url: https://github.com/yourorg/your-repo
```

2. Define a `Kustomization` to tell Flux how frequently you want to pull state from the source
```yaml
#xp-kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: your-repo-source
  namespace: default
spec:
  interval: 5m0s
  path: ./kustomize
  prune: true
  sourceRef:
    kind: GitRepository
    name: your-repo-source
  validation: client
```

3. Apply a `Kustomization` to tell Flux about these resources
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- xp-repo.yaml
- xp-kustomization.yaml
```

For every new instance of Crossplane that you want to register and set up GitOps flows for with Flux, you will create pairs of files as we demonstrated with `xp-repo.yaml` and `xp-kustomization.yaml` above.

{{< hint "tip" >}}
💡 An implementation of this integration is available on GitHub: <link to a configuration on Marketplace>. You can use it as a starting point and are encouraged to tweak it according to your needs.
{{< /hint >}}

### Integrate Crossplane with Argo

Argo CD is a projects that enables GitOps by implementing an `Application` resource, which provides a declarative approach to managing config management tooling for Kubernetes resources (e.g., Helm, Kustomize) and a controller for handling the reconciliation loop for syncing the resources into the cluster (i.e., updating the live state to match the desired state).

{{<img src="xp-arch-framework/images/argo.png" alt="A simple illustration of Argo" size="small" quality="100">}}

Like Flux, if you are using a self-hosted installation of Argo CD, you need to deploy it into a Kubernetes cluster. Once you have installed Argo CD into a cluster, you will create new `Applications` in Argo that establish a relationship between a git source and your control planes.

While you _could_ install Argo CD into the same cluster where Crossplane has been installed into, our baseline recommendation is to run Argo CD from a central cluster and register your Crossplane clusters with it. This approach scales better for users who plan to run several Crossplanes.

{{< hint "note" >}}
💡 If your production scenario involves running only one instance of Crossplane, for simplicity this recommendation does not apply.
{{< /hint >}}

To configure Argo for deploying to multiple clusters, all you need to do is define a new `Application` that represents your control plane and a source to pull from.
```yaml
#controlplane-1.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: 'my-control-plane'
spec:
  destination:
    server: your-control-plane-endpoint
    namespace: guestbook
  source:
    path: 'claims'
    repoURL: 'https://github.com/yourorg/your-repo-source'
    targetRevision: 'main'
  project: 'default'
  syncPolicy:
    automated: {}
```

You will need to configure the `spec.destination.server` to point to the endpoint for your control plane's cluster. For every control plane that you want to register with your central instance of Argo, you will create a new `Application` object as above.

{{< hint "tip" >}}
💡 An implementation of this integration is available on GitHub: <link to a configuration on Marketplace>. You can use it as a starting point and are encouraged to tweak it according to your needs.
{{< /hint >}}

## CI/CD

asd

## Secrets Management

asd

## Policy Engines

asd

## Platform Continuity

asd

## Monitoring & Observability

asd

## Authentication & Authorization

asd

## Security

asd