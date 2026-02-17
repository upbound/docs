---
title: Query API Reference
description: Documentation for the Query API resources
validation:
  type: reference
  owner: docs@upbound.io
  tags:
    - reference
    - api
    - query
---

import CrdDocViewer from '@site/src/components/CrdViewer';

# Query API Reference

This page documents the Custom Resource Definitions (CRDs) for the Query API.

## Query

The Query resource allows you to query objects in a single control plane.

<CrdDocViewer crdUrl="/crds/query/spaces.upbound.io_queries.yaml" />

## GroupQuery

The GroupQuery resource allows you to query objects across a group of control planes.

<CrdDocViewer crdUrl="/crds/query/spaces.upbound.io_groupqueries.yaml" />

## SpaceQuery

The SpaceQuery resource allows you to query objects across all control planes in a space.

<CrdDocViewer crdUrl="/crds/query/spaces.upbound.io_spacequeries.yaml" />
EOF
