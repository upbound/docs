---
title: Segregate Marketplace Repository Access
sidebar_position: 2
description: A guide for segregating marketplace repository access.
---

<!-- vale gitlab.SentenceLength = NO -->
Organizations using Upbound may want to cleanly segregate repository access so that developers can push development artifacts as part of their `up project run` workflows, while production control planes are only allowed to consume authorized artifacts including specifically signed-off configuration packages, [providers][crossplane-providers], functions and add-ons after they pass SBOM, CVE, and other relevant checks.
<!-- vale gitlab.SentenceLength = YES -->

## Overview

The approach for controlled repository access uses [ImageConfig][image-configs] to limit production control planes from consuming images from unauthorized repos and those that are not signed by a CI/CD pipeline.

## Example ImageConfig

An exmaple [ImageConfig][image-configs] for production control planes may look
like below.

```
kubectl describe imageconfigs.pkg.crossplane.io
```

```
Name:         verify-upbound-images
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  pkg.crossplane.io/v1beta1
Kind:         ImageConfig
Metadata:
  Creation Timestamp:  2025-12-02T21:22:09Z
  Generation:          1
  Resource Version:    1809
  UID:                 11149b5c-2ccc-4d2b-b7bd-cdea75f71ad9
Spec:
  Match Images:
    Prefix:  xpkg.upbound.io/upbound
    Type:    Prefix
  Verification:
    Cosign:
      Authorities:
        Keyless:
          Identities:
            Issuer:   https://token.actions.githubusercontent.com
            Subject:  https://github.com/upbound/upbound-official-build/.github/workflows/supplychain.yml@refs/heads/main
        Name:         Verify Images
    Provider:         Cosign
Events:               <none>
```

When installing any unsigned upbound package, even if it's public, no pods start up, it is not pulled and the revision is by design unhealthy.

```
kubectl get pkgrev
```

```
NAME                                                                       HEALTHY   RUNTIME   IMAGE                                             STATE    AGE
providerrevision.pkg.crossplane.io/upbound-provider-datadog-0f38c6598970   False     False     xpkg.upbound.io/upbound/provider-datadog:v0.3.0   Active   3m24s
```

When describing the revision, the status condition shows that the signature verification failed as expected.

```
Status:
  Applied Image Config Refs:
    Name:    verify-upbound-images
    Reason:  VerifyImage
  Conditions:
    Last Transition Time:  2025-12-02T21:23:40Z
    Message:               Waiting for signature verification to complete
    Observed Generation:   1
    Reason:                UnhealthyPackageRevision
    Status:                False
    Type:                  RuntimeHealthy
    Last Transition Time:  2025-12-02T21:23:40Z
    Observed Generation:   1
    Reason:                AwaitingSignatureVerification
    Status:                False
    Type:                  RevisionHealthy
    Last Transition Time:  2025-12-02T21:23:41Z
    Message:               Signature verification failed using ImageConfig named "verify-upbound-images": authority "Verify Images": signature verification failed with no signatures found
    Observed Generation:   1
    Reason:                SignatureVerificationFailed
    Status:                False
    Type:                  Verified
  Resolved Image:          xpkg.upbound.io/upbound/provider-datadog:v0.3.0
```

## Image Signing

Information about image signing can be found [here][sigstore-cosign].

## Benefits

- Developers can push artifacts to one or more [marketplace][marketplace] registries, including a third party enterprise locations, and production control planes can only successfully consume the signed image versions.
- Signing can happen in place for the images that pass CI/CD pipeline tests.
- The solution does not require moving images across repos (dev to prod).
- Team permissions and robot account / token setup and management is simpler
  compared to a multi-step multi-repo setup.
- All authorized consumers can pull signed images.

## Caution

The creation of a production control plane should be immediately followed by the installation of the ImageConfig. This is a second step. With it, the above overall approach is lean and clean.

[crossplane-providers]: https://docs.crossplane.io/latest/packages/providers/
[image-configs]: https://docs.upbound.io/manuals/uxp/concepts/packages/image-configs/
[marketplace]: https://marketplace.upbound.io/providers
[sigstore-cosign]: https://github.com/sigstore/cosign
