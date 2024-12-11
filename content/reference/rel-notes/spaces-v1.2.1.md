---
title: "Spaces v1.2.1"
version: "v1.2.1"
date: 2024-02-08
tocHidden: true
product: "spaces"
---

#### What's Changed

- Fixed an issue causing the `controlplane` resources having a benign `crossplane.io/external-create-failed` annotation.
- Fixed an issue causing hotlooping version controller when a `controlplane` is deleted.
- Other stability and performance improvements.
