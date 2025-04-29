---
title: "MCP Connector v0.9.0"
version: "v0.9.0"
date: 2025-04-28
tocHidden: true
product: "mcp-connector"
version_sort_key: "0000.0009.0000"
---
<!-- vale off -->

#### What's Changed

- Upgraded Kubernetes library dependencies from 1.29 to 1.32.
- Apiserver Audit-IDs are propagated to the requests to the connected MCP for easier log correlation.
- Fixed an issue with binary architecture in `arm64` images.
- Fixed an issue that was causing namespace deletions to get blocked.

<!-- vale on -->
