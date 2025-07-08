---
title: 'Internal Developer Platform Starter Kit'
sidebar_position: 0
description: "Build an Internal Development Platform with Upbound"
---

The Internal Developer Platform starter kit gives you all the tools you
need to create a streamlined self-service platform for infrastructure
deployment.

This guide will help you build the foundations of your IdP with a few quick
steps.

## Prerequisites

For this guide, you'll need:

* Docker Desktop
* `kubectl`
* The Up CLI
* Access to an Upbound Space and Organization
* AWS credentials
* `Task` installed

## Components

This repo builds a complete GitOps workflow for an IdP with Upbound. It builds
your control planes, deploys ArgoCD and Backstage, and syncs environment
manifests in the `state` directory.

## Build your IdP

To get started, clone this repository:

```shell
git clone https://github.com/upbound/solution-idp.git
cd solution-idp
```

Next, bootstrap the environment with `task`.

```shell
task bootstrap-all
```

## Configure your IdP

## Next steps
