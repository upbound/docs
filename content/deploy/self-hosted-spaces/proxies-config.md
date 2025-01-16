---
title: Proxied configuration
weight: 200
description: Configure Upbound within a proxied environment
aliases:
    - /deploy/disconnected-spaces/proxies-config
---

<!-- vale off -->

When you install Upbound with Helm in a proxied environment, please update the specified registry with your internal registry.
<!-- vale on -->


```bash
helm -n upbound-system upgrade --install spaces \
  oci://xpkg.upbound.io/spaces-artifacts/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "authentication.hubIdentities=true" \
  --set "authorization.hubRBAC=true" \
  --set "registry=registry.company.corp/spaces" \
  --set "controlPlanes.uxp.registryOverride=registry.company.corp/xpkg.upbound.io" \
  --set "controlPlanes.uxp.repository=registry.company.corp/spaces" \
  --wait
```
