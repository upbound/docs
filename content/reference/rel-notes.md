---
title: Release Notes
weight: 150
---

Find below the release notes for all released versions of [Upbound Spaces]({{< ref "spaces/overview.md" >}}).

<!-- vale off -->
## Spaces v1.0.1 release notes

- [Backport release-1.0] Export mxp-gateway metrics via otlp-collector by @github-actions in #332

## Spaces v1.0.0 release notes

- controllers: patch against original object by @sttts in #249
- Revert "move status.ControlPlaneID and status.HostClusterID to optional" by @sttts in #248
- Promote APIs to v1beta1 by @sttts in #250
- apis: clarify resource descriptions by @sttts in #252
- apis/mxp: minimize unused xr fields by @sttts in #251
- Stop routing internal traffic in the hub hostcluster through the ingress-controller by @tnthornton in #243
- XManagedControlPlane and hub XHostCluster XRs to v1beta1 by @tnthornton in #253
- [Backport release-1.0] Introduce CRD lifecycle management through mxe-apis by @github-actions in #259
- [Backport release-1.0] Add external-name to xhostclusterservices composed resource by @github-actions in #263
- [Backport release-1.0] Stop logging bearer token at debug by @github-actions in #264
- [Backport release-1.0] Clean up misc items by @github-actions in #265
- [Backport release-1.0] Update XHostClusterServices resource by @github-actions in #267
- [Backport release-1.0] Update interacting instructions in README.md by @github-actions in #269
- [Backport release-1.0] Minor adjustments to destroy process by @github-actions in #277
- [Backport release-1.0] Enable git source by default and keep it optional by @github-actions in #279
- [Backport release-1.0] kube-control-plane: bump to kube 1.28 by @github-actions in #282
- [Backport release-1.0] ArgoCD controller to register ControlPlane as target by @github-actions in #283
- [Backport release-1.0] vcluster: bump memory limit to 400Mi after seeing 270Mi in reality by @github-actions in #286
- [Backport release-1.0] mxp-gateway: use client-go's transport cache by @github-actions in #287
- [Backport release-1.0] Fix missing tab in comment block by @github-actions in #289
- [Backport release-1.0] Bring vcluster-k8s in tree by @github-actions in #291
- [Backport release-1.0] Return error instead of panic if ctp connection secret ref is unset by @github-actions in #297
- [Backport release-1.0] vcluster: disable its liveness probe pointing to kube-apiserver by @tnthornton in #302
- [Backport release-1.0] Observability networkpolicy fixes by @github-actions in #306
- [Backport release-1.0] Fix ssh auth with known_hosts and sub-directory discovery by @github-actions in #312
- [Backport release-1.0] git: fix commit ref bugs by @github-actions in #316
- [Backport release-1.0] git: run through cleanup even if controlplane is not ready by @github-actions in #317
- [Backport release-1.0] Fix otlp-collector networkpolicy ports by @github-actions in #320
<!-- vale on -->
