---
title: "Spaces v1.7.0"
version: "v1.7.0"
date: 2024-09-02
tocHidden: true
product: "spaces"
version_sort_key: "0001.0007.0000"
---
<!-- vale off -->

#### API Changes

- Added v1alpha2 of the Query API, which supports a richer set of filters.

#### What's New

- **OCI Artifact Support in Upbound Registry**: We are excited to announce that the Spaces Helm Chart and images are now
  shipped as OCI artifacts by default, hosted in the Upbound central registry. You can access these at
  `xpkg.upbound.io/spaces/artifacts`.

  **Important**: To pull the Helm Chart and images from the new OCI location, you will need to obtain a new pull token
  from your Upbound account representative.

  To update your pull secret, follow these steps:

    1. **Delete the existing pull secret**:
       ```bash
       kubectl delete -n upbound-system upbound-pull-secret
       ```
    2. **Re-create the upbound-pull-secret**:
       ```bash
       kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
       --docker-server=https://xpkg.upbound.io \
       --docker-username="$(jq -r .accessId $SPACES_TOKEN_PATH)" \
       --docker-password="$(jq -r .token $SPACES_TOKEN_PATH)"
       ```

  **Start the Helm-Chart upgrade**:

    1. **Log in to the OCI Registry**:
       ```bash
       jq -r .token $SPACES_TOKEN_PATH | helm registry login xpkg.upbound.io -u $(jq -r .accessId $SPACES_TOKEN_PATH) --password-stdin
       ```
    2. **Upgrade Spaces software from the new location**:
       ```bash
       helm -n upbound-system upgrade --install spaces \
         oci://xpkg.upbound.io/spaces-artifacts/spaces \
         --version "${SPACES_VERSION}" \
         --set "ingress.host=${SPACES_ROUTER_HOST}" \
         --set "clusterType=${SPACES_CLUSTER_TYPE}" \
         --set "account=${UPBOUND_ACCOUNT}" \
         --set "authentication.hubIdentities=true" \
         --set "authorization.hubRBAC=true"
       ```

- **Helm Repository Deprecation**: This release marks the final time the Spaces Helm Chart will be published to the
  Upbound Helm repository. All users are encouraged to migrate to the new OCI artifact format to ensure uninterrupted
  access to future updates.

  If you need additional time to prepare for this transition, you can still use the old registry with this release. To
  do so, you must explicitly set the registry:

  ```bash
  helm -n upbound-system upgrade --install spaces \
    oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
    --version "${SPACES_VERSION}" \
    --set "registry=us-west1-docker.pkg.dev/orchestration-build/upbound-environments" \
    --set "ingress.host=${SPACES_ROUTER_HOST}" \
    --set "clusterType=${SPACES_CLUSTER_TYPE}" \
    --set "account=${UPBOUND_ACCOUNT}" \
    --set "authentication.hubIdentities=true" \
    --set "authorization.hubRBAC=true"
  ```

  **Note**: This will be the last version that supports the old registry. We will discontinue publishing updates to it
  after Spaces 1.8.0.

---

We appreciate your cooperation and understanding during this transition. Should you have any questions or require
further assistance, please reach out to your Upbound account representative.

- **Simplified Installation Requirements**: This release simplifies the installation process for the Spaces Helm Chart.
  You no longer need to have Crossplane installed with the provider-helm and provider-kubernetes on your HostCluster. If
  you were only using this Crossplane setup for Spaces, you can safely remove the remaining artifacts by running the
  following commands:

  ```bash
  kubectl delete xhostclusters.internal.spaces.upbound.io space-hub
  kubectl patch xhostclusters.internal.spaces.upbound.io space-hub --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
  ```

  Once these steps are completed, you may proceed to uninstall Crossplane, provider-kubernetes, and provider-helm
  according to your original installation method.

  **Note**: The `upbound-system` namespace must not be removed, as it is still required for Spaces operations.

#### Other Improvements

- ControlPlane viewers can now list `events.events.k8s.io` resources and can get secrets.
- ControlPlane editors can no longer write ESO and kyverno resources.
- ControlPlane admins can now write kyverno `cleanuppolicies`, `clustercleanuppolicies`, `policyexceptions` and
  `events.events.k8s.io`.
- ControlPlane Admins can now also update CRDs.

#### Fixed Bugs

- Add priorityClass for telemetry-spaces-logs daemonset
- Cleanup control plane resources out of the system namespace when a control plane is deleted.
- Fix Backup's expired TTL resulting in deadlock.
- Fixed a bug preventing scraping control plane etcd metrics
- Fixed duplicate port warning printed during installation of the Spaces helm chart.
- Observability: fixed an issue where network policies didnt allow the OTEL Collector's Prometheus to scrape some pods
  for metrics.
- We have optimized our controllers and tested hosting up to 500 control planes with a single Spaces installation.

<!-- vale on -->
