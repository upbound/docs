---
title: "Spaces v1.0.0"
version: "v1.0.0"
date: 2023-08-28
tocHidden: true
product: "spaces"
---

#### What's Changed

- controllers: patch against original object
- Promote APIs to v1beta1
- apis: clarify resource descriptions
- apis/mxp: minimize unused xr fields
- Stop routing internal traffic in the hub hostcluster through the ingress-controller
- XManagedControlPlane and hub XHostCluster XRs to v1beta1
- Introduce CRD lifecycle management through mxe-apis
- Add external-name to xhostclusterservices composed resource
- Stop logging bearer token at debug
- Clean up misc items
- Update XHostClusterServices resource
- Minor adjustments to destroy process
- Enable git source by default and keep it optional
- kube-control-plane: bump to kube 1.28
- ArgoCD controller to register ControlPlane as target
- vcluster: bump memory limit to 400Mi after seeing 270Mi in reality
- mxp-gateway: use client-go's transport cache
- Bring vcluster-k8s in tree
- Return error instead of panic if ctp connection secret ref is unset
- vcluster: disable its liveness probe pointing to kube-apiserver
- Observability networkpolicy fixes
- Fix ssh auth with known_hosts and sub-directory discovery
- git: fix commit ref bugs
- git: run through cleanup even if controlplane is not ready
- Fix otlp-collector networkpolicy ports
