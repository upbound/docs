---
title: "Spaces v1.2.4"
version: "v1.2.4"
date: 2024-03-13
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### What's Changed

- Tweaked the control plane API autoscaler configuration per recent performance testing.
- Fixed an issue causing the kube-state-metrics pods being restarted per CRD deployed in the control plane.
- Optimized the control plane deletion process to reduce the time it takes to delete a control plane.
- Fixed an issue breaking `kubectl logs` command against the control plane API.

<!-- vale on -->
