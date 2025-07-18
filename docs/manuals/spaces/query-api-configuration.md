---
title: Configure the Query API
sidebar_position: 6
description: How to enable and configure your Space to use the Query API
plan: business
---

:::important
**Cloud Spaces**: The Query API is enabled by default. To learn how to use the
Query API, see this guide.
**Self-hosted Spaces**: You must enable the Query API to connect a Space to
Upbound.
:::

Upbound's Query API allows you to inspect objects and resources within your
control planes. The `up` CLI provides `up alpha query` and `up alpha get` as
read-only commands to retrieve information in your control planes.

This configuration guide walks through how to enable and setup the Query API for
Self-hosted Spaces.

## Prerequisites
- up cli
- CloudNativePG

The Query API requires a PostgreSQL database for storage. Upbound provides a
managed PostgreSQL instance or you can use and maintain your own PostgreSQL instance.

## Managed database setup

If your organization doesn't have specific data requirements for your setup,
Upbound recommends this approach. 

For self-hosted Spaces, you *must* connect your Space to Upbound to use the
Query API.

### Enable with the `up` CLI

To enable the Query API in a self-hosted Space, use the `--set` flags to pass
the correct values when you install Spaces:

```shell
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.apollo.enabled=true" \
  --set "features.alpha.apollo.storage.postgres.create=true"
```

### Enable and customize with the Helm chart
