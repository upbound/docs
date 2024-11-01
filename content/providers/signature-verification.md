---
title: "Signature Verification"
weight: 9
description: "Learn how to verify signatures for Official Providers from the Marketplace"
---

Upbound Official Providers contain verifiable signatures, attestations, and an SBOM (software bill of materials). This lets you confirm the origin of each package version and that its contents haven't changed or been tampered with. This article explains h ow to verify the signature on these packages.

## Prerequisites

We recommend using [cosign](https://docs.sigstore.dev/cosign/system_config/installation/) to verify the signature and attestations of an Official Provider.

## Attestations

Attestations are provided per version of a given package, so you'll need to specify the correct tag or digest and registry when pulling attestations from an image with cosign. You can use the cosign verify-attestation command to check the SBOM attestation of the image signatures of the package:

```bash
some command
```

SBOMs are produced in the SPDX format, as indicated by `--type spdxjson`. You will receive output that verifies the SBOM attestation signature in cosign's transparency log:

## Verify signatures

Official Providers signed using Sigstore, and you can check the included signatures using cosign.

```bash
some command
```

The cosign verify command pulls detailed information about all signatures found for the provided package.