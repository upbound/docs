---
title: Query API
sidebar_position: 2
description: The Query API
tier: "standard"
---

The Query API used to previously operate within a multi-tenant Spaces
architecture.

To make it compatible with UXP 2.0, it has been refactored to a "single-tenant"
mode, and comes installed in the same cluster when you install UXP 2.0.

Upbound enables the Query API by default, but you can disable it. All queries
made in the Crossplane WebUI use the Query API in the background.

<!-- vale off -->

## UXP Query API Explorer

<!-- vale on -->

import CrdDocViewer from '@site/src/components/CrdViewer';

### Query

The Query resource allows you to query objects in a single control plane.

<CrdDocViewer crdUrl="/crds/query/spaces.upbound.io_queries.yaml" />

<!-- ignore "aggregate" -->
<!-- vale write-good.TooWordy = YES -->


