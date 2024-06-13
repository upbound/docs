---
title: Proxied configuration
weight: 200
description: Configure Upbound within a proxied environment
---

<!-- vale off -->

When you install Upbound with Helm in a proxied environment, please update the specified registry with your internal registry.
<!-- vale on -->


```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.host=${SPACES_ROUTER_HOST}" \
  --set "clusterType=${SPACES_CLUSTER_TYPE}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --set "authentication.hubIdentities=true" \
  --set "authorization.hubRBAC=true" \
  --set "registry=registry.company.corp/us-west1-docker.pkg.dev/orchestration-build/upbound-environments" \
  --set "controlPlanes.uxp.registryOverride=registry.company.corp/xpkg.upbound.io" \
  --set "controlPlanes.uxp.repository=registry.company.corp/charts.upbound.io/stable" \
  --wait
```
