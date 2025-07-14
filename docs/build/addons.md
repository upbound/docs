---
title: Add-Ons
weight: 250
description: A guide to how to wrap and deploy an Add-On into control planes on Upbound.
---

:::important
This feature is in private preview for select customers in Upbound Cloud Spaces. If you're interested in this feature, please [contact us][contact-us].
:::

Upbound's _Add-Ons_ feature lets you build and deploy control plane software from the Kubernetes ecosystem. With the _Add-Ons_ feature, you're not limited to just managing resource types defined by Crossplane. Now you can create resources from _CustomResourceDefinitions_ defined by other Kubernetes ecosystem tooling. 

This guide explains how to bundle and deploy control plane software from the Kubernetes ecosystem on a control plane in Upbound.

## Benefits

The Add-Ons feature provides the following benefits:

* Deploy control plane software from the Kubernetes ecosystem.
* Use your control plane's package manager to handle the lifecycle of the control plane software and define dependencies between package.
* Build powerful compositions that combine both Crossplane and Kubernetes _CustomResources_.

## How it works

A _Add-On_ is a package type that bundles control plane software from the Kubernetes ecosystem. Examples of such software includes:

- Kubernetes policy engines
- CI/CD tooling
- Your own private custom controllers defined by your organization

You build a _Add-On_ package by wrapping a helm chart along with its requisite _CustomResourceDefinitions_. Your _Add-On_ package gets pushed to an OCI registry, and from there you can apply it to a control plane like you would any other Crossplane package. Your control plane's package manager is responsible for managing the lifecycle of the software once applied.

## Prerequisites

Enable the Add-Ons feature in the Space you plan to run your control plane in:

- Cloud Spaces: Not available yet
- Connected Spaces: Space administrator must enable this feature
- Disconnected Spaces: Space administrator must enable this feature
<!--- TODO(tr0njavolta): link --->
Packaging an _Add-On_ requires [up CLI][up-cli]  `v0.39.0` or later.

<!-- vale Google.Headings = NO --> 
<!-- vale Microsoft.Headings = NO --> 
## Build an _Add-On_ package
<!-- vale Google.Headings = YES --> 
<!-- vale Microsoft.Headings = YES --> 

_Add-Ons_ are a package type that get administered by your control plane's package manager.

### Prepare the package

To define an _Add-On_, you need a Helm chart. This guide assumes the control plane software you want to build into an _Add-On_ already has a Helm chart available.

Start by making a working directory to assemble the necessary parts:

```ini
mkdir addon-package
cd addon-package
```

Inside the working directory, pull the Helm chart

```ini
export CHART_REPOSITORY=<helm-chart-repo>
export CHART_NAME=<helm-chart-name>
export CHART_VERSION=<helm-chart-version>

helm pull $CHART_NAME --repo $CHART_REPOSITORY --version $CHART_VERSION
```

Move the Helm chart into it's own folder:

```ini
mkdir helm
mv $CHART_NAME-$CHART_VERSION.tgz helm/chart.tgz
```

Unpack the CRDs from the Helm chart into their own directory:

```ini
export RELEASE_NAME=<helm-release-name>
export RELEASE_NAMESPACE=<helm-release-namespace>

mkdir crds
helm template $RELEASE_NAME helm/chart.tgz -n $RELEASE_NAMESPACE --include-crds | \
  yq e 'select(.kind == "CustomResourceDefinition")' - | \
  yq -s '("crds/" + .metadata.name + ".yaml")' -
```

:::tip
The instructions above assume your CRDs get deployed as part of your Helm chart. If they're deployed another way, you need to manually copy your CRDs instead.
:::

Create a `crossplane.yaml` with your Add-On metadata:

```yaml
cat <<EOF > crossplane.yaml
apiVersion: meta.pkg.upbound.io/v1alpha1
kind: AddOn
metadata:
  annotations:
    friendly-name.meta.crossplane.io: AddOn <your-add-on>
    meta.crossplane.io/description: |
      A brief description of what the Add-On does.
    meta.crossplane.io/license: Apache-2.0
    meta.crossplane.io/maintainer: <your-email>
    meta.crossplane.io/readme: |
      An explanation of your Add-On.
      meta.crossplane.io/source: <url-for-your-add-on-source>
  name: <add-on-name>
spec:
  packagingType: Helm
  helm:
    releaseName: <release-name>
    releaseNamespace: <release-namespace>
    # Value overrides for the helm release can be provided below.
    # values:
    #   foo: bar
EOF
```

Your Add-On's file structure should look like this:

```ini
.
├── crds
│   ├── your-crd.yaml
│   ├── second-crd.yaml
│   └── another-crd.yaml
├── crossplane.yaml
└── helm
    └── chart.tgz
```

### Package and push the _Add-On_

At the root of your Add-On's working directory, build the contents into an xpkg:

```ini
up xpkg build
```

This causes an xpkg to get saved to your current directory with a name like `addon-f7091386b4c0.xpkg`.

Push the package to your desired OCI registry:

```ini
export UPBOUND_ACCOUNT=<org-account-name>
export ADDON_NAME=<addon-name>
export ADDON_VERSION=<addon-version>
export XPKG_FILENAME=<addon-f7091386b4c0.xpkg>

up xpkg push xpkg.upbound.io/$UPBOUND_ACCOUNT/$ADDON_NAME:$ADDON_VERSION -f $XPKG_FILENAME
```

<!-- vale Google.Headings = NO --> 
<!-- vale Microsoft.Headings = NO --> 
## Deploy a _Add-On_ package
<!-- vale Google.Headings = YES --> 
<!-- vale Microsoft.Headings = YES --> 

:::important
_Add-On_ are only installable on control planes running Crossplane `v1.19.0` or later.
:::

Set your kubecontext to the desired control plane in Upbound. Change the package path to the OCI registry you pushed it to. Then, deploy the _Add-On_ directly:

```ini
export ADDON_NAME=<addon-name>
export ADDON_VERSION=<addon-version>

cat <<EOF | kubectl apply -f -
apiVersion: pkg.upbound.io/v1alpha1
kind: AddOn
metadata:
  name: $ADDON_NAME
spec:
  package: xpkg.upbound.io/$UPBOUND_ACCOUNT/$ADDON_NAME:$ADDON_VERSION
EOF
```

## Example usage

The example below demonstrates step-by-step how to package and deploy [Argo CD][argo-cd] to a control plane in Upbound.

### Prepare to package Argo CD

Start by making a working directory to assemble the necessary parts:

```ini
mkdir argo-package
cd argo-package
```

Inside the working directory, pull the Helm chart

```ini
export CHART_REPOSITORY=https://argoproj.github.io/argo-helm
export CHART_NAME=argo-cd
export CHART_VERSION=7.8.8

helm pull $CHART_NAME --repo $CHART_REPOSITORY --version $CHART_VERSION
```

Move the Helm chart into it's own folder:

```ini
mkdir helm
mv $CHART_NAME-$CHART_VERSION.tgz helm/chart.tgz
```

Unpack the CRDs from the Helm chart into their own directory:

```ini
export RELEASE_NAME=argo-cd
export RELEASE_NAMESPACE=argo-system

mkdir crds
helm template $RELEASE_NAME helm/chart.tgz -n $RELEASE_NAMESPACE --include-crds | \
  yq e 'select(.kind == "CustomResourceDefinition")' - | \
  yq -s '("crds/" + .metadata.name + ".yaml")' -
```

Create a `crossplane.yaml` with the Add-On metadata:

```yaml
cat <<EOF > crossplane.yaml
apiVersion: meta.pkg.upbound.io/v1alpha1
kind: AddOn
metadata:
  annotations:
    friendly-name.meta.crossplane.io: Add-On ArgoCD
    meta.crossplane.io/description: |
      The ArgoCD Add-On enables continuous delivery and declarative configuration
      management for Kubernetes applications using GitOps principles.
    meta.crossplane.io/license: Apache-2.0
    meta.crossplane.io/maintainer: Upbound Maintainers <info@upbound.io>
    meta.crossplane.io/readme: |
      ArgoCD is a declarative GitOps continuous delivery tool for Kubernetes that
      follows the GitOps methodology to manage infrastructure and application
      configurations.
      meta.crossplane.io/source: https://github.com/argoproj/argo-cd
  name: argocd
spec:
  packagingType: Helm
  helm:
    releaseName: argo-cd
    releaseNamespace: argo-system
    # values:
    #   foo: bar
EOF
```

Your controller's file structure should look like this:

```ini
.
├── crds
│   ├── applications.argoproj.io.yaml
│   ├── applicationsets.argoproj.io.yaml
│   └── appprojects.argoproj.io.yaml
├── crossplane.yaml
└── helm
    └── chart.tgz
```

### Package and push addon-argocd

At the root of your Add-On's working directory, build the contents into an xpkg:

```ini
up xpkg build
```

This causes an xpkg to get saved to your current directory with a name like `argocd-f7091386b4c0.xpkg`.

Push the package to your desired OCI registry:

```ini
export UPBOUND_ACCOUNT=<org-account-name>
export ADDON_NAME=addon-argocd
export ADDON_VERSION=v7.8.8
export XPKG_FILENAME=<addon-f7091386b4c0.xpkg>

up xpkg push --create xpkg.upbound.io/$UPBOUND_ACCOUNT/$ADDON_NAME:$ADDON_VERSION -f $XPKG_FILENAME
```

### Deploy addon-argocd to a control plane

Set your kubecontext to the desired control plane in Upbound. Change the package path to the OCI registry you pushed it to. Then, deploy the _Add-On_ directly:

```ini
cat <<EOF | kubectl apply -f -
apiVersion: pkg.upbound.io/v1alpha1
kind: AddOn
metadata:
  name: addon-argocd
spec:
  package: xpkg.upbound.io/$UPBOUND_ACCOUNT/addon-argocd:v7.8.8
EOF
```

Wait for the package to become ready:

```ini
watch kubectl get addons.pkg
```

Check the pods in the `argo-system` namespace:

```ini
kubectl -n argo-system get pods
```

You can now use the _CustomResource_ types defined by Argo CD in your control plane.

<!-- vale off -->

## Frequently asked questions
<details>
    <summary>Can I package any software or are there any prerequisites to be an Add-On?</summary>

    We define an _Add-On_ as a software that has at least one Custom Resource Definition (CRD) and a Kubernetes controller for that CRD. This is the minimum requirement to be a  _Add-On_. We have some checks to enforce this at packaging time. 

</details>

<details>

<summary>How can I package my software as an Add-On?</summary>

Currently, we support Helm charts as the underlying package format for _Add-Ons_. As long as you have a Helm chart, you can package it as an _Add-On_.

If you don't have a Helm chart, you can't deploy the software. We only support Helm charts as the underlying package format for _Add-Ons_. We may extend this to support other packaging formats like Kustomize in the future.

</details>

<details>

<summary>Can I package Crossplane XRDs/Compositions as a Helm chart to deploy as an AddOn?</summary>

This is not recommended. For packaging Crossplane XRDs/ and Compositions, we recommend using the `Configuration` package format. A helm chart only with Crossplane XRDs/Compositions does not qualify as an _Add-On_.

</details>

<details>

<summary>How can I override the Helm values when deploying an Add-On?</summary>

Overriding the Helm values is possible at two levels:

- During packaging time, in the package manifest file.
- At runtime, using a `ControllerRuntimeConfig` resource (similar to Crossplane `DeploymentRuntimeConfig`).

</details>

<details>

<summary>How can I configure the helm release name and namespace for the Add-On?</summary>

Right now, it is not possible to configure this at runtime. The package author configures release name and namespace during packaging, so it is hardcoded inside the package. Unlike a regular application that is deployed by a Helm chart, _Add-Ons_ can only be deployed once in a given control plane, so, we hope it should be ok to rely on predefined release names and namespaces. We may consider exposing these in `ControllerRuntimeConfig` later, but, we would like to keep it opinionated unless there are strong reasons to do so.

</details>

<details>

<summary>Can I deploy more than one instance of an Add-On package?</summary>

No, this is not possible. Remember, an _Add-On_ package introduces CRDs which are cluster-scoped objects. Just like one cannot deploy more than one instance of the same Crossplane Provider package today, it is not possible to deploy more than one instance of a _Add-On_.

</details>

<details>

<summary>Do I need a specific Crossplane version to run Add-Ons?</summary>

Yes, you need to use Crossplane v1.19.0 or later to use _Add-Ons_. This is because of the changes in the Crossplane codebase to support third-party package formats in dependencies.

Spaces `v1.12.0` supports Crossplane `v1.19` in the _Rapid_ release channel.
</details>

<details>

<summary>Can I deploy Add-Ons outside of an Upbound control plane? With UXP?</summary>

No, _Add-Ons_ are a proprietary package format and are only available for control planes running in Spaces hosting environments in Upbound.

</details>

<!-- vale on -->


[contact-us]: https://www.upbound.io/usage/support/contact
[up-cli]: /apis-cli/cli-reference
[argo-cd]: https://argoproj.github.io/cd/
