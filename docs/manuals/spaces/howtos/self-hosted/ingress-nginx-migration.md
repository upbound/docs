---
title: Migrate to Envoy Gateway
sidebar_position: 6
description: A guide on how to migrate to Envoy Gateway from ingress-nginx
tier: "business"
---
import GlobalLanguageSelector, { CodeBlock } from '@site/src/components/GlobalLanguageSelector';

<GlobalLanguageSelector />


Upbound recommends migrating from the Ingress API to the Gateway API for routing
traffic to control planes. This changes addresses critical security issues and
aligns with the Kuberenetes community decision to retire ingress-nginx in March
2026.

## Why?

Currently, TLS connections terminate at the ingress-nginx controller, but client
certificate validation happens later at the `spaces-router` component. The
controller extracts the certificate and forwards it in the `ssl-client-cert`
HTTP header. This presents a security flaw as the TLS handshake and certificate
validation are separate.

With TLS passthrough mode, the encrypted connection goes directly to the
`spaces-router` component. Both the TLS handshake and certificate validation
happen together and eliminates the security vulnerability.

Gateway API is also the official routing standard for Kubernetes going forward.

## How?

To migrate from ingress-nginx to Envoy Gateway, you must delete your current
ingress resource and controller and install the Gateway API implementation with
TLS passthrough enabled.


### 1. Remove existing Ingress resources

Delete the Ingress resource and ingress-nginx controller:

```bash
kubectl -n upbound-system delete ingress mxe-router-ingress
helm -n ingress-nginx delete ingress-nginx
```

:::warning
This step forces downtime for API access through spaces-router until the
Gateway API configuration is complete.
:::

### 2. Install a Gateway API controller

Install a Gateway API implementation that supports TLS passthrough and `TLSRoute`.
The following example uses Envoy Gateway:

```bash
export ENVOY_GATEWAY_VERSION=v1.2.4

helm -n envoy-gateway-system upgrade --install --wait --wait-for-jobs \
  --timeout 300s --create-namespace envoy-gateway \
  oci://docker.io/envoyproxy/gateway-helm \
  --version "${ENVOY_GATEWAY_VERSION}"
```

### 3. Create GatewayClass resource

Create a `GatewayClass` resource appropriate for your cloud provider. 

<CodeBlock cloud="aws">

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: spaces
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
  parametersRef:
    group: gateway.envoyproxy.io
    kind: EnvoyProxy
    name: spaces-proxy-config
    namespace: envoy-gateway-system
EOF
```

</CodeBlock>

<CodeBlock cloud="azure">


```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: spaces
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
  parametersRef:
    group: gateway.envoyproxy.io
    kind: EnvoyProxy
    name: spaces-proxy-config
    namespace: envoy-gateway-system
EOF
```

</CodeBlock>

<CodeBlock cloud="gcp">

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: spaces
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
EOF
```

</CodeBlock>


### 4. Create Gateway resource

Create a Gateway resource in the `upbound-system` namespace.

<CodeBlock cloud="aws">

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: spaces
  namespace: upbound-system
spec:
  gatewayClassName: spaces
  listeners:
    - name: tls
      port: 443
      protocol: TLS
      allowedRoutes:
        namespaces:
          from: Same
      tls:
        mode: Passthrough
EOF
```

</CodeBlock>


<CodeBlock cloud="azure">

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: spaces
  namespace: upbound-system
spec:
  gatewayClassName: spaces
  listeners:
    - name: tls
      port: 443
      protocol: TLS
      allowedRoutes:
        namespaces:
          from: Same
      tls:
        mode: Passthrough
EOF
```

</CodeBlock>




<CodeBlock cloud="gcp">

```bash
kubectl apply -f - --server-side <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: spaces
  namespace: upbound-system
spec:
  gatewayClassName: spaces
  listeners:
    - name: tls
      port: 443
      protocol: TLS
      allowedRoutes:
        namespaces:
          from: Same
      tls:
        mode: Passthrough
EOF
```

</CodeBlock>



:::note
During installation or upgrade, you can use the Spaces Helm chart to create the
Gateway automatically with these parameters:
- `gatewayAPI.gateway.provision=true`
- `gatewayAPI.gateway.className=spaces`
:::


### 5. Get the load balancer hostname

Check the externally routable hostname for the Gateway's load balancer. 
The Helm `gatewayAPI.host` parameter requires this hostname.

For Envoy Gateway, inspect the LoadBalancer service:

```bash
kubectl get service -n envoy-gateway-system \
  -l gateway.envoyproxy.io/owning-gateway-name=spaces \
  -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
```

### 6. Upgrade the Spaces Helm release

Upgrade the Spaces installation with Gateway API parameters:

```bash
helm -n upbound-system upgrade spaces \
  oci://xpkg.upbound.io/spaces-artifacts/spaces \
  --version "${SPACES_VERSION}" \
  --set "ingress.provision=false" \
  --set "gatewayAPI.host=${GATEWAY_HOSTNAME}" \
  --set "account=${UPBOUND_ACCOUNT}" \
  --reuse-values \
  --wait
```

### 7. Restart spaces-router (Optional)

If the `gatewayAPI.host` value differs from the previous `ingress.host` value,
restart the spaces-router pod to regenerate the certificate with the correct SAN
(Subject Alternative Name):

```bash
kubectl -n upbound-system rollout restart deployment spaces-router
kubectl -n upbound-system rollout status deployment spaces-router
```

## Additional resources

- [Spaces Deployment]
- [Kubernetes Announcement]

[spaces deployment]:
/manuals/spaces/howtos/self-hosted/self-hosted-spaces-deployment
[kubernetes announcement]: https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/
