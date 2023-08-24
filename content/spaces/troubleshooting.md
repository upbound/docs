---
title: Troubleshooting
weight: 500
description: A guide for troubleshooting an issue that occurs in a Space
---

Find guidance below on how to find solutions for issues you encounter when deploying and using an Upbound Space.

<!-- vale off -->
## Your managed control plane is stuck in a 'creating' state

### unknown field "ports" in io.k8s.api.networking.v1.NetworkPolicySpec

This error is emitted by a Helm release named `control-plane-host-policies` attempting to be installed by the Spaces software. The full error is:

_CannotCreateExternalResource failed to install release: unable to build kubernetes objects from release manifest: error validating "": error validating data: ValidationError(NetworkPolicy.spec): unknown field "ports" in io.k8s.api.networking.v1.NetworkPolicySpec_

This error may be caused by running a Space on an earlier version of Kubernetes than is supported (`v1.26 or later`). To resolve this issue, upgrade the host Kubernetes cluster version to 1.26.

<!-- vale on -->