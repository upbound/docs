---
title: "Git and GitOps"
weight: 2
description: "A guide for how to integrate control planes with a variety of interfaces"
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in git and using controllers to realize the desired state. Crossplane is completely compatible with this pattern and we strongly recommend customers implement GitOps in their platforms built on Crossplane. 

## Git and Crossplane

There are three ways you should plan for integrating with git with Crossplane:

### 1. Use git for storing your custom APIs

Building custom APIs with Crossplane does not require users to write code, but you still need to write configurations and definitions as .yaml. As with traditional software development, you should store your custom API definitions in git. You should have an automated build pipeline set up with your git repo to package your APIs in a configuration package, then install the package on your control plane.

{{< hint "note" >}}
Learn more about how to sturcture your repo and define your APIs in the [Building APIs](../../building-apis) section of this framework.
{{< /hint >}}

### 2. Use git as an interface to invoking your control plane's APIs 

When users think of `GitOps` with Crossplane, its usually in this regard: whenever a user needs a resource from your control plane, a claim should be created. Whether the claim is created directly by the requesting user or there is a [platform frontend](./platform-frontends.md) that collects information from a user and creates a claim in the background, claims are the Kubernetes-native way to interact with your API.

Claims themselves are resources with a configuration (i.e. a `spec`), and as such can and should be declaratively stored in git. We recommend storing claims in a git repo and then using a GitOps engine such as Argo or Flux--described later on below--to deliver the claims to your control plane.

### 3. Use git to store the infrastructure definition that backs your control plane

Your control plane itself is infrastructure, and as such should ideally be defined in git. There is a [chicken or the egg](https://en.wikipedia.org/wiki/Chicken_or_the_egg) problem commonly brought up by platform teams who want to use Crossplane to drive their entire platform. We address this in the [single control plane baseline architecture](../../architecture/architecture-baseline-single#control-plane-causality-dilemma) portion of this framework.

## GitOps and Crossplane 

[Flux](https://fluxcd.io/) and [Argo](https://argo-cd.readthedocs.io/en/stable/) are two examples of projects in the Kubernetes ecosystem that you can use in tandem with Crossplane to achieve GitOps flows. They are also the most commonly chosen tools to accomplish this job, so we'll provide specific recommendations for integrating these with Crossplane below. 

### Integrate Crossplane with Flux

Flux is a set of controllers that keeps Kubernetes clusters in sync with a configuration source (i.e. git).

{{<img src="xp-arch-framework/images/flux.png" alt="A simple illustration of Flux" size="small" quality="100">}}

If you are using self-hosted Flux, you need to deploy it into a Kubernetes cluster. Once you have installed Flux into a cluster, you will want to configure it in two ways:

1. Tell Flux which git sources to pull.
2. Tell Flux which clusters to target applying changes to.

#### Flux and single control plane

In the case where you're running only a single control plane, it is easiest to colocate Flux inside the cluster where Crossplane is running. Once Flux is installed, you need to do three things:

1. Define a `GitRepository` source for each control plane.
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

2. Define a `Kustomization` to tell Flux how frequently you want to pull state from the source and apply it to your control plane
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
```

3. Apply a `Kustomization` to tell Flux about these resources
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- xp-repo.yaml
- xp-kustomization.yaml
```

#### Flux and multi-control planes

While you _could_ install Flux into one of the clusters where Crossplane has been installed into, our baseline recommendation is to operate a centralized instance of Flux and register your control planes (external to Flux) with it. This approach scales better for users who plan to run several Crossplanes.

To configure Flux for deploying to multiple clusters, you will need to do the following:

1. Define a `GitRepository` source for _each_ control plane.
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

2. Define a `Kustomization` to tell Flux how frequently you want to pull state from the source and to which target it should sync to. Notice the `kubeconfig.secretRef.name` stanza, which will configure Flux to apply reconcillations on remote clusters--or clusters which Flux is _not_ installed on. This is key to how you use a centralized Flux instance to target multiple clusters. You need to couple this by injecting a secret into the cluster where Flux runs which encapsulates the kuconfig of your control plane.
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
  kubeConfig:
    secretRef:
      name: controlplane-kubeconfig
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

### Integrate Crossplane with Argo

Argo CD is a project that enables GitOps by implementing an `Application` resource, which provides a declarative approach to managing config management tooling for Kubernetes resources (e.g., Helm, Kustomize) and a controller for handling the reconciliation loop for syncing the resources into the cluster (i.e., updating the live state to match the desired state).

{{<img src="xp-arch-framework/images/argo.png" alt="A simple illustration of Argo" size="small" quality="100">}}

#### Argo and single control plane

In the case where you're running only a single control plane, it is easiest to colocate Argo inside the cluster where Crossplane is running. Once Argo is installed, you need to configure it by defining a new `Application` that represents your control plane and a source to pull from.

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

#### Argo and multi-control plane

Following the same advice as for Flux, in a multi-control plane architecture we recommend deploying Argo as a centralized instance in its own cluster, then register your control planes as external targets. To do this, you will create new `Application` resources in Argo that establish a relationship between a git source and your control planes.

To configure Argo for deploying to multiple clusters, all you need to do is define a new `Application` for each control plane which represents your control plane and a source to pull from.
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