---
title: 'Build your own App Model'
sidebar_position: 220
description: "This example explains how to create apps-as-a-service"
validation:
  type: conceptual
  owner: docs@upbound.io
  tags:
    - conceptual
    - usecases
    - app
---

This example assumes you've already created and deployed the IDP starter kit. Read the [Get Started][getStarted] guide to do this if you haven't already.

## Configuration package

Add this Configuration package to the _frontend_ control plane in the IDP starter kit:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: upbound-configuration-app
spec:
  package: xpkg.upbound.io/upbound/configuration-app:v0.12.1
```

[getStarted]: /guides/solutions/get-started
