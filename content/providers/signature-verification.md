---
title: "Signature Verification"
weight: 9
description: "Learn how to verify signatures for Official Providers from the Marketplace"
---

Upbound Official Providers contain verifiable signatures, attestations, and an SBOM (software bill of materials). This lets you confirm the origin of each package version and that its contents haven't changed or been tampered with. This article explains how to verify the signature on these packages.

## Prerequisites

We recommend using [cosign](https://docs.sigstore.dev/cosign/system_config/installation/) to verify the signature and attestations of an Official Provider.

If you're running UXP, enable these features first:

```yaml
helm upgrade crossplane --install \
upbound-stable/universal-crossplane \
--debug \
--namespace crossplane-system \
--create-namespace --set args='{--enable-signature-verification,--enable-dependency-version-upgrades}'
```

## Attestations

Attestations are provided per version of a given package, so you'll need to specify the correct tag or digest and registry when pulling attestations from an image with cosign. You can use the cosign verify-attestation command to check the SBOM attestation of the image signatures of the package:

```bash
cosign verify-attestation xpkg.upbound.io/upbound/<provider>@sha256:<digest> \
--certificate-identity https://github.com/upbound/upbound-official-build/.github/workflows/supplychain.yml@refs/heads/main \
--certificate-oidc-issuer https://token.actions.githubusercontent.com  \
--type spdxjson
```

SBOMs for Official Providers are produced in the SPDX format, as indicated by `--type spdxjson`. On successful execution, you will receive output that verifies the SBOM attestation signature in the Rekor transparency log.

## Verify signatures

Upbound performs keyless signing for Official providers using Sigstore, and you can similarly verify package signatures using `cosign`.

```bash
cosign verify xpkg.upbound.io/upbound/<provider>@sha256:<digest> \
--certificate-identity https://github.com/upbound/upbound-official-build/.github/workflows/supplychain.yml@refs/heads/main \
--certificate-oidc-issuer https://token.actions.githubusercontent.com  \
```

## Using `ImageConfig` in Crossplane for Verification

Starting in Crossplane 1.18, you can enable and configure an `ImageConfig` resource to automatically verify package signatures in your Crossplane cluster.

For example, the following configuration will verify images matching `spec.matchImages.prefix` using GitHub as the certificate issuer for the e-mail identity.

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: ImageConfig
metadata:
  name: cosign-verify
spec:
  matchImages:
    - prefix: "xpkg.upbound.io/crossplane/<my-signed-image>:"
  verification:
    provider: Cosign
    cosign:
      authorities:
        - name: verify keyless signing
          keyless:
            identities:
              - issuer: https://github.com/login/oauth
                subject: <my-email>@gmail.com
          attestations:
            - name: verify attestations
              predicateType: spdxjson
```

If enabled, Crossplane will ensure the status condition `SignatureVerificationComplete` is `true`, which means it was either skipped or succeeded.

For example:

```yaml
  - lastTransitionTime: "2024-10-23T16:43:05Z"
    message: Signature verification succeeded with ImageConfig named "cosign-verify"
    reason: VerificationSucceeded
    status: "True"
    type: SignatureVerificationComplete
```
