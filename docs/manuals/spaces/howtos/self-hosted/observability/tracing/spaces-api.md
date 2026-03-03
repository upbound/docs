---
title: Spaces API Traces
sidebar_position: 20
description: Distributed tracing details for the Spaces API component.
---

The Spaces API is the API server for managing Spaces resources
(ControlPlanes, SharedBackupConfigs, etc.) on the host cluster.

For common tracing configuration, see the
[distributed tracing overview](./overview.md).

## Overview

The Spaces API implements distributed tracing using **service.name**:
`spaces-api`

## Custom tags

The API adds custom tags to every span extracted from request headers. These
are in addition to standard span attributes:

| Tag | Source | Description | Example |
|-----|--------|-------------|---------|
| `request.id` | `x-request-id` header | Request correlation ID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

## Example traces

### Successful API request

This example shows a span from a ControlPlane list request:

```text
Span #11
    Trace ID       : eae4424212d7029b3fd1f7afa763fa8a
    Parent ID      : 1b71c1871b379395
    ID             : e73e9d6c333cbbe3
    Name           : GET /apis/spaces.upbound.io/v1beta1/namespaces/default/controlplanes
    Kind           : Server
    Start time     : 2025-11-24 19:48:05.139056295 +0000 UTC
    End time       : 2025-11-24 19:48:05.141362628 +0000 UTC
    Status code    : Unset
    Status message :
Attributes:
     -> server.address: Str(127.0.0.1)
     -> http.request.method: Str(GET)
     -> url.scheme: Str(https)
     -> network.peer.address: Str(192.168.3.18)
     -> network.peer.port: Int(41320)
     -> user_agent.original: Str(up/v0.0.0 (darwin/arm64) kubernetes/$Format)
     -> client.address: Str(192.168.3.18)
     -> url.path: Str(/apis/spaces.upbound.io/v1beta1/namespaces/default/controlplanes)
     -> network.protocol.version: Str(1.1)
     -> http.response.body.size: Int(3097)
     -> http.response.status_code: Int(200)
```

### Distributed trace flow

When using the `up` CLI, requests create a distributed trace through multiple
services:

```text
Trace ID: eae4424212d7029b3fd1f7afa763fa8a
│
├─ Span: up ctp list (Client - up CLI, not shown)
│  └─ Parent ID: (root)
│
├─ Span: GET /apis/spaces.upbound.io/v1beta1/namespaces/default/controlplanes
│  ├─ ID: e73e9d6c333cbbe3
│  ├─ Parent: up CLI request
│  ├─ Service: spaces-api (otelhttp)
│  ├─ Duration: 2.3ms
│  ├─ Status: Unset (200 OK)
│  └─ Attributes:
│     ├─ http.request.method: Str(GET)
│     ├─ http.response.status_code: Int(200)
│     ├─ client.address: Str(192.168.3.18)
│     ├─ url.path: Str(/apis/spaces.upbound.io/v1beta1/namespaces/default/controlplanes)
│     └─ [custom attributes if headers present]
│
└─ Span: List (Internal K8s operation)
   ├─ ID: 690765d809f58cfe
   ├─ Parent: e73e9d6c333cbbe3
   ├─ Service: spaces-api (k8s.io/component-base/tracing)
   ├─ Duration: 2.2ms
   ├─ Status: Unset
   └─ Events:
      ├─ About to List from storage
      ├─ Listing from storage done
      └─ Writing http response done (count: 1)
```

<!-- vale gitlab.SentenceLength = NO -->
This shows how a single `up ctp list` command generates multiple correlated
spans across different instrumentation layers.
<!-- vale gitlab.SentenceLength = YES -->
