---
title: "Git and GitOps"
weight: 2
description: "A guide for how to integrate control planes with a variety of interfaces"
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. Crossplane is compatible with this pattern and it's strongly recommended you integrate GitOps in your platforms built on Crossplane. 

## Git and Crossplane

### Use Git for storing your custom APIs

Building custom APIs with Crossplane doesn't require users to write code, but you still need to write configurations and definitions as YAML. As with traditional software development, you should store your custom API definitions in a version control system, such as Git. Create an automated build pipeline with your Git repository to package your APIs in a configuration package, then install the package on your control plane.

{{< hint "note" >}}
Learn more about how to sturcture your repo and define your APIs in the [Building APIs]({{< ref "xp-arch-framework/building-apis/" >}}) section of this framework.
{{< /hint >}}

### Use Git as an interface to invoking your control plane's APIs 

Whenever a user needs a resource from your control plane, a claim must get created. Whether the claim gets created directly by the requesting user or there is a [platform frontend]({{< ref "xp-arch-framework/interface-integrations/platform-frontends.md" >}}) that collects information from a user and creates a claim in the background, claims are the Kubernetes-native way to interact with your API.

Claims themselves are resources with a configuration (a `spec`), and as such can and should be declaratively stored in Git. It's recommended you store claims in a Git repository. Then, use a GitOps engine such as Argo or Flux--described later on below--to deliver the claims to your control plane.

### Use Git to store the infrastructure definition that backs your control plane

Your control plane itself is infrastructure, so its definition should live in Git. A [chicken or the egg](https://en.wikipedia.org/wiki/Chicken_or_the_egg) problem is commonly brought up by platform teams who want to use Crossplane to drive their entire platform. Consult the [single control plane baseline architecture]({{< ref "xp-arch-framework/architecture/architecture-baseline-single.md#control-plane-causality-dilemma" >}}) page for guidance on this topic.

## GitOps and Crossplane 

[Argo](https://argo-cd.readthedocs.io/en/stable/) and [Flux](https://fluxcd.io/) are two examples of projects in the Kubernetes ecosystem that you can use in tandem with Crossplane to achieve GitOps flows. They're also the most commonly chosen tools for this job. Below are specific recommendations for integrating these with Crossplane below. 

### Integrate Crossplane with Argo

Argo CD is a project that enables GitOps by implementing an `Application` resource. This provides a declarative approach to managing configuration management tooling for Kubernetes resources (such as Helm or Kustomize).

{{<img src="xp-arch-framework/images/argo.png" alt="An illustration of Argo" size="small" quality="100">}}

#### Argo and single control plane

If you're running only a single control plane, it's easiest to co-locate Argo inside the cluster where Crossplane is running. After installing Argo, you need to configure it by defining a new `Application` that represents your control plane and a source to pull from.

```yaml
#controlplane-1.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: local-controlplane
spec:
  destination:
    name: in-cluster
    namespace: <namespace-in-controlplane-to-sync-to>
  project: default
  source:
    path: infrastructure/claims
    repoURL: <your-controlplane-repo-source>
    targetRevision: main
    directory:
      recurse: true
  syncPolicy:
    automated: {}
```

Based on the recommendations for how to [structure your APIs]({{< ref "xp-arch-framework/building-apis/building-apis-configurations.md#configuration-layout-in-git" >}}) in Git, be sure to enable [recursive resource detection](https://argo-cd.readthedocs.io/en/stable/user-guide/directory/#enabling-recursive-resource-detection) (as demonstrated in the preceding example).

#### Argo and multi-control plane

Its recommended you deploy Argo as a centralized instance in its own cluster to handle a multi-control plane architecture. Then, register your control planes as external targets. To do this, create new `Application` resources in Argo that establish a relationship between a Git source and your control planes.

To configure Argo for deploying to multiple clusters, define a new `Application` for each control plane. This represents your control plane and a source to pull from.

```yaml
#controlplane-1.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: local-controlplane
spec:
  destination:
    server: <cluster-api-url>
    namespace: <namespace-in-controlplane-to-sync-to>
  project: default
  source:
    path: infrastructure/claims
    repoURL: <your-controlplane-repo-source>
    targetRevision: main
    directory:
      recurse: true
  syncPolicy:
    automated: {}
```

You need to configure the `spec.destination.server` to point to the endpoint for your control plane's cluster API server. You need to [configure credentials](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#repositories) to your repository. For every control plane that you want to register with your central Argo, you must create a new `Application` object as in the preceding example. 

### Integrate Crossplane with Flux

Flux is a set of controllers that keeps Kubernetes clusters in sync with a configuration source.

{{<img src="xp-arch-framework/images/flux.png" alt="An illustration of Flux" size="small" quality="100">}}

If you are using self-hosted Flux, you need to deploy it into a Kubernetes cluster. Once you have installed Flux into a cluster, you should configure it in two ways:

1. Tell Flux which Git sources to pull.
2. Tell Flux which clusters to target applying changes to.

#### Flux and single control plane

For single control plane scenarios, it's easiest to co-locate Flux inside the cluster where Crossplane is running. After deploying Flux, you need to do three things:

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

While you _could_ install Flux into one of the clusters alongside Crossplane, it's recommended you create a centralized instance of Flux. Then, register your control planes (external to Flux) with it. This approach scales better for users who plan to run several control planes.

To configure Flux for deploying to multiple clusters, you need to do the following:

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

2. Define a `Kustomization` to tell Flux how frequently you want to pull state from the source and to which target it should sync to. Notice the `kubeconfig.secretRef.name` stanza, which configures Flux to apply the reconciliation on remote clusters--or clusters which Flux is _not_ installed on. You need to couple this by injecting a secret into the cluster where Flux runs which encapsulates the kubeconfig of your control plane.
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

You must create pairs of `GitRepositories` and `Kusomizaitons` for every new instance of Crossplane that you want to register and set up GitOps flows for with Flux. 