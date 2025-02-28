---
title: "Spaces v1.10.0"
version: "v1.10.0"
date: 2025-01-07
tocHidden: true
product: "spaces"
---
<!-- vale off -->

#### What's Changed

**Warning - Breaking changes**

Please be aware of the following changes:

- `ClientCertFromHeader` authenticator at `spaces-router` has been removed and it can no longer authenticate requests from a client certificate it finds in the `Ssl-Client-Cert` HTTP request header. `spaces-router` now requires SSL-passthrough to be enabled for the ingress-nginx controller if:
    - The Spaces `v1.10.0` installation is still using the Ingress API (this is still the default although we now support the [Gateway API](https://gateway-api.sigs.k8s.io/)) and,
    - `spaces-router` is running in secure mode (the default) and,
    - Hub identities are enabled via the `authentication.hubIdentities` Spaces Helm chart parameter (the default) and,
    - You would like to be able to authenticate Spaces clients using the client certificates issued by the host cluster's signer.

  You can enable the SSL-passthrough mode for the ingress-nginx controller by passing the `--enable-ssl-passthrough=true` command-line option to it. Please also see the official [self-hosted Spaces deployment guides](https://docs.upbound.io/deploy/self-hosted-spaces/).
- If you are using the Gateway API with Spaces and your chosen Gateway API implementation is [Envoy Gateway](https://gateway.envoyproxy.io), please note that the short name `ctp` now belongs to the `clienttrafficpolicies.gateway.envoyproxy.io` custom resources. If you have any scripts that use this short name for `controlplanes.spaces.upbound.io`, you will need to update them to use the long name `controlplane` if you are using Envoy Gateway.

#### Features and Enhancements

- **Observability**:
    - Added an option to reference sensitive data in SharedTelemetryConfig
      configuration through a secret.

- **Query API**:
    - Pin in-chart PostgreSQL cluster to 16 and wire down image pull secrets to it too.

- **Security**:
    - Spaces chart now installs a network policy that allows ingress traffic to the `spaces-router` pod's port 8443 only from the `ingress-nginx` controller pod or the connect agent pod. The namespace and the pod labels of the `ingress-nginx` controller can be specified using the `ingress.namespaceLabels` and the `ingress.podLabels` Helm chart parameters, respectively. The pod labels for the connect agent can be specified using the `connect.agent.podLabels` Helm chart parameter.
    - Spaces now supports the Kubernetes Gateway API in addition to the Ingress API. The ClientCertFromHeader authenticator has been removed and when using a secured spaces-router with client certificate authentication, TLS traffic needs to be terminated at spaces-router.

- **Other**:
    - Add schema validation for helm chart values.
    - ControlPlanes now expose the time at which they first became Available.
    - Bumped latest supported Crossplane minor version to v1.18.
    - ClusterType is removed from the Spaces helm chart values

#### Fixed Bugs

- Fixed storage class parameter visibility for control plane etcd and vector in values.yaml
- Avoid noisy restarts of apollo-syncer by retrying with backoff before erroring out.
- Avoid resetting apollo syncers' passwords on every reconciliation, preventing frequent syncers restarts.
-  Drop controlPlanes.uxp.repository from values, always use registry.
- Fix an issue preventing to pull xpkg.upbound.io/spaces-artifacts/external-secrets-chart when Shared Secrets was enabled.
- Fixed a security issue with how the internal tokens are validated by mxp-gateway.
- Fixed a timeout issue in spaces-router while doing authorization checks against the host cluster for ControlPlane requests when hub RBAC is enabled via the `authorization.hubRBAC` Helm parameter.
- Fixed duplicate probe definitions in spaces controller deployment.
- Move to domain-qualified finalizer for controlplane provisioner reconciler, while dropping old ones allowing ControlPlanes deletion after Spaces upgrade.
- Properly handle and validate imagePullSecrets passed to the helm chart.
- Revert in-cluster host port used from 9091 to 8443. This led Argo to not be able to reach controlplanes.
- SpaceBackups now will only skip just created controlplanes instead of the ones not ready.
- Spaces-router can now reload without a restart renewed spaces-ca certificate which it uses to validate the upstream server certificates.

<!-- vale on -->
