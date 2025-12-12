---
title: 'Databases-as-a-service'
sidebar_position: 200
description: "This example explains how to create databases-as-a-service"
---

This example assumes you've already created and deployed the IDP starter kit. Read the [Get Started][getStarted] guide to do this if you haven't already.

## Configuration package

Add this Configuration package to the _frontend_ control plane in the IDP starter kit:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Configuration
metadata:
  name: upbound-configuration-dbaas
spec:
  package: xpkg.upbound.io/upbound/configuration-dbaas:v0.5.0
```

[getStarted]: /guides/solutions/get-started
