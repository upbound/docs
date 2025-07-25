---
title: Control plane project tooling
description: "Learn how to use the control plane project tooling"
sidebar_position: 2
---

UXP supports local development with the `up` CLI to run and test your control
plane projects.

## Requirements

To use local control plane development tools, make sure you have:

* [up][up] CLI installed
* A Docker-compatible container runtime installed and running on your system

## Launch a local cluster

To quickly launch a local cluster, start a new project with the `--local` flag:

```
up project run --local
```
