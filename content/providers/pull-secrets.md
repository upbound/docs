---
title: "Pull secrets"
weight: 8
description: "Learn how to configure access to older Official providers versions from the Marketplace"
---

You must configure a pull secret on your control plane to pull any older version of an Official Provider. If you’re on
Crossplane or UXP v1.18 or later, use the ImageConfig API. Otherwise, configure a pull secret for each provider pod.

### Crossplane and UXP v1.16+

{{< hint "tip" >}}
The `ImageConfig` API was introduced starting in Crossplane `v1.18` and backported to `v1.16.4` and `v1.17.3`. Make sure you're running these versions before using this API.
{{< /hint >}}

1. Create a [pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) on your control plane. You can use the [up ctp pull-secret create]({{<ref "/upbound-marketplace/authentication#kubernetes-image-pull-secrets">}}) command:
```bash
up ctp pull-secret create
```

2. Create an `ImageConfig` resource and reference the pull secret you created earlier:
```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: ImageConfig
metadata:
  name: official-provider-auth
spec:
  matchImages:
    - prefix: xpkg.upbound.io/upbound
  registry:
    authentication:
      pullSecretRef:
        name: package-pull-secret
        namespace: upbound-system
```

This pull secret matches all packages with the `xpkg.upbound.io/upbound` and provides the package pull secret any time your control plane needs to pull the provider image.

### Older Crossplane versions

If you're on an older version of Crossplane, you need to create a package pull secret and configure each Provider package to use it:

1. Create a [pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) on your control plane. You can use the [up ctp pull-secret create]({{<ref "/upbound-marketplace/authentication#kubernetes-image-pull-secrets">}}) command:
```bash
up ctp pull-secret create
```

2. **For each provider package installed on your control plane**, update it's `.spec` to reference the pull secret:
```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  packagePullSecrets: 
    - name: package-pull-secret
# Removed for brevity

```