---
title: Query API Traces
sidebar_position: 30
description: Distributed tracing details for the Query API (Apollo) component.
---

Query API (Apollo) provides querying capabilities for Kubernetes resources
across multiple Crossplane control planes.

For common tracing configuration, see the
[distributed tracing overview](./overview.md).

## Overview

Service name: **`query-api`**

Each request generates three span types:

- Router ingress (routes to Apollo cluster)
- Apollo HTTP (processes query)
- PostgreSQL (executes SQL)

## Architecture

Requests flow through Spaces Router to Apollo:

```text
Client → Spaces Router → Apollo (Query API) → PostgreSQL
   │           │              │                    │
   └───────────────────────────────────────────────→ Single Trace
```

Each request produces four spans:

1. **Router ingress** - Envoy routes to `spaces-apollo` cluster
2. **Auth check** - External authorization validates request
3. **Apollo HTTP** - Query API processes request (service.name: `query-api`)
4. **PostgreSQL** - Database executes SQL

### Enabling tracing

Configure Query API tracing via Helm values:

```yaml
apollo:
  apollo:
    observability:
      enabled: true
      tracing:
        enabled: true
        endpoint: "telemetry-spaces-collector.upbound-system.svc.cluster.local"
        insecure: false
        port: 4317
        sampling:
          rate: 0.1 # 10%
        tls:
          caBundleSecretRef: spaces-ca
```

## Custom tags

### Apollo spans

Apollo exports spans with `service.name: query-api` and includes:

| Attribute | Description | Example Value |
|-----------|-------------|---------------|
| `http.request.method` | HTTP method | `POST` |
| `url.path` | Request path | `/apis/query.spaces.upbound.io/v1alpha2/namespaces/default/queries` |
| `http.response.status_code` | Status code | `200` |
| `http.request.body.size` | Request size | `360` |
| `http.response.body.size` | Response size | `3702` |
| `server.address` | Server hostname | `127.0.0.1` |
| `network.peer.address` | Client IP | `192.168.2.11` |
| `user_agent.original` | User agent | `up-cli/v0.40.0 (darwin; arm64)` |

### Database spans

Database spans include PostgreSQL connection pool metrics:

| Attribute | Description | Example Value |
|-----------|-------------|---------------|
| `db.system` | Database system | `postgresql` |
| `db.name` | Database name | `upbound` |
| `db.operation` | Operation type | `query` |
| `db.statement` | SQL query | Full SQL statement |
| `db.pool.total_conns` | Total connections | `1` |
| `db.pool.idle_conns` | Idle connections | `1` |
| `db.pool.acquired_conns` | Acquired connections | `0` |

## Example traces

### Complete query request

A complete trace from a Query API request:

```text
Trace ID: c11e69bdbb34e74a0bf737346986acd1

Span #0: ingress (spaces-router)
├─ Span ID: 5c4116696e82042c
├─ Parent: (root)
├─ Service: spaces-router
├─ Kind: Server
├─ Duration: 3.7ms
├─ Attributes:
│  ├─ http.method: POST
│  ├─ http.url: https://proxy.../apis/query.spaces.upbound.io/v1alpha2/namespaces/default/queries
│  ├─ http.status_code: 200
│  ├─ upstream_cluster: spaces-apollo ← Routes to Apollo
│  ├─ upstream_cluster.name: spaces-apollo
│  ├─ request_size: 360
│  ├─ response_size: 1157
│  ├─ user_agent: up-cli/v0.40.0 (darwin; arm64)
│  ├─ peer.address: 192.168.1.7
│  ├─ node_id: mxe-router
│  └─ component: proxy

Span #1: async envoy.service.auth.v3.Authorization.Check egress (spaces-router)
├─ Span ID: 80bcf47a67cb4e0f
├─ Parent: 5c4116696e82042c ← Child of router ingress
├─ Service: spaces-router
├─ Kind: Client
├─ Duration: 0.5ms
├─ Attributes:
│  ├─ upstream_cluster: extauthz
│  ├─ grpc.status_code: 0
│  └─ ext_authz_status: ext_authz_ok

Span #2: POST /apis/query.spaces.upbound.io/v1alpha2/namespaces/default/queries
├─ Span ID: 3091be4c5f50bd6e
├─ Parent: 5c4116696e82042c ← Child of router ingress
├─ Service: query-api ← Apollo service
├─ Kind: Server
├─ Duration: 1.7ms
├─ InstrumentationScope: go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp
├─ Attributes:
│  ├─ server.address: 127.0.0.1
│  ├─ http.request.method: POST
│  ├─ url.scheme: https
│  ├─ url.path: /apis/query.spaces.upbound.io/v1alpha2/namespaces/default/queries
│  ├─ network.peer.address: 192.168.2.11
│  ├─ network.peer.port: 52226
│  ├─ network.protocol.version: 1.1
│  ├─ client.address: 192.168.2.11
│  ├─ user_agent.original: up-cli/v0.40.0 (darwin; arm64)
│  ├─ http.request.body.size: 360
│  ├─ http.response.body.size: 3702
│  └─ http.response.status_code: 200

Span #3: db.query
├─ Span ID: 185caba122c6098e
├─ Parent: 3091be4c5f50bd6e ← Child of Apollo HTTP span
├─ Service: query-api
├─ InstrumentationScope: query-api
├─ Kind: Client
├─ Duration: 0.5ms
├─ Status: Ok
├─ Attributes:
│  ├─ db.system: postgresql
│  ├─ db.name: upbound
│  ├─ db.operation: query
│  ├─ db.statement: WITH base AS (SELECT "controlplane_namespace", ...)
│  ├─ db.pool.total_conns: 1
│  ├─ db.pool.idle_conns: 1
│  ├─ db.pool.acquired_conns: 0
│  └─ db.params.count: 0
```
