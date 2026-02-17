---
title: 'Clusters-as-a-service'
sidebar_position: 210
description: "This example explains how to create clusters-as-a-service"
validation:
  type: conceptual
  owner: docs@upbound.io
  tags:
    - conceptual
    - usecases
    - caas
---

This example assumes you've already created and deployed the IDP starter kit. Read the [Get Started][getStarted] guide to do this if you haven't already.

## Configuration package

Add this Configuration package to the _frontend_ control plane in the IDP starter kit:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: upbound-configuration-caas
spec:
  package: xpkg.upbound.io/upbound/configuration-caas:v0.4.0
```

[getStarted]:/guides/solutions/get-started/ 
