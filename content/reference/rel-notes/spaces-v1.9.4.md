---
title: "Spaces v1.9.4"
version: "v1.9.4"
date: 2024-11-14
tocHidden: true
product: "spaces"
---
<!-- vale off -->

## Bugs fixed

* Revert in-cluster host port used from 9091 to 8443. This led Argo to not be able to reach controlplanes.

## What's Changed
* [Backport release-1.9] fix: right port used for INCLUSTER_HOST by @github-actions in https://github.com/upbound/spaces/pull/2013


**Full Changelog**: https://github.com/upbound/spaces/compare/v1.9.3...v1.9.4

<!-- vale on -->
