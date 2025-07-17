---
title: Environment Configs
sidebar_position: 7
description: Environment Configs or EnvironmentConfigs are an in-memory datastore
  used in Compositions
---

<!--
TODO: Add Policies
-->


A Crossplane EnvironmentConfig is a cluster-scoped, strongly typed,
[ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/)-like
resource used by Compositions. Compositions can use the environment to store
information from individual resources or to apply patches.

Crossplane supports multiple `EnvironmentConfigs`, each acting as a unique
data store.

When Crossplane creates a composite resource, Crossplane merges all the
EnvironmentConfigs referenced in the associated Composition and creates a unique
in-memory environment for that composite resource.

The composite resource can read and write data to their unique
in-memory environment.

:::important
The in-memory environment is unique to each composite resource.
A composite resource can't read data in another composite resource's
environment.
:::


