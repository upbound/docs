---
title: Service Mesh and Certificates
sidebar_position: 20
description: Install self hosted spaces certificates
---

:::important
Prerequisites

- Spaces Token avilable in a file
- `docker login xpkg.upbound.io -u <TOKEN_ACCESS_ID> -p <TOKEN>`
- [`istioctl`][istioctl] installation
:::

This document describes the installation of a self hosted space on an example `kind`
cluster along with Istio and certificates. The service mesh and certificates
installation is transferable to self hosted spaces in arbitrary clouds.

## Create a kind cluster

```shell
cat <<EOF | kind create cluster --wait 5m --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```

## Install cert-manager

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.2/cert-manager.yaml
```

## Install istio

```shell
cat > istio-values.yaml << 'EOF'
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
spec:
  hub: gcr.io/istio-release
  components:
    ingressGateways:
      - enabled: true
        name: istio-ingressgateway
        k8s:
          nodeSelector:
            ingress-ready: "true"
          overlays:
            - apiVersion: apps/v1
              kind: Deployment
              name: istio-ingressgateway
              patches:
                - path: spec.template.spec.containers.[name:istio-proxy].ports
                  value:
                    - containerPort: 8080
                      hostPort: 80
                    - containerPort: 8443
                      hostPort: 443
EOF
```

```shell
istioctl install -f istio-values.yaml
```

## Create or generate a certificate

This script creates a certificate for a proof of concept environment.
Pleae use your blessed processes for obtaining production certificates.

:::important
NOT for use in production.
:::

```shell
#!/bin/bash

# Create upbound-system namespace
kubectl create ns upbound-system

# Create certificates directory
mkdir -p certs

# Generate CA private key
openssl genrsa -out certs/ca.key 4096

# Create CA certificate
openssl req -new -x509 -key certs/ca.key -sha256 -subj "/C=US/ST=CA/O=MyOrg/CN=MyCA" -days 3650 -out certs/ca.crt

# Generate server private key
openssl genrsa -out certs/server.key 4096

# Create certificate signing request
openssl req -new -key certs/server.key -out certs/server.csr -subj "/C=US/ST=CA/O=MyOrg/CN=proxy.upbound-127.0.0.1.nip.io"

# Create server certificate extensions file
cat > certs/server.conf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = CA
O = MyOrg
CN = proxy.upbound-127.0.0.1.nip.io

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = proxy.upbound-127.0.0.1.nip.io
DNS.2 = *.proxy.upbound-127.0.0.1.nip.io
IP.1 = 127.0.0.1
EOF

# Sign server certificate with CA
openssl x509 -req -in certs/server.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/server.crt -days 365 -extensions v3_req -extfile certs/server.conf

# Create Kubernetes secrets
kubectl create secret generic proxy-tls-secret --from-file=tls.crt=certs/server.crt --from-file=tls.key=certs/server.key --from-file=ca.crt=certs/ca.crt -n upbound-system --dry-run=client -o yaml | kubectl apply -f -

echo "Certificates created in certs/ directory:"
echo "- ca.crt (CA certificate)"
echo "- ca.key (CA private key)"
echo "- server.crt (Server certificate for proxy.upbound-127.0.0.1.nip.io)"
echo "- server.key (Server private key)"
echo ""
echo "Kubernetes secrets created:"
echo "- proxy-tls-secret in upbound-system namespace"
```

## Create an istio gateway and virtual service

Use TLS passthrough.

```
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1
kind: Gateway
metadata:
  name: spaces-gateway
  namespace: istio-system
spec:
  selector:
    istio: ingressgateway
  servers:
  - hosts:
    - proxy.upbound-127.0.0.1.nip.io
    port:
      name: tls
      number: 443
      protocol: TLS
    tls:
      mode: PASSTHROUGH
---
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: spaces-router
  namespace: istio-system
spec:
  gateways:
  - spaces-gateway
  hosts:
  - proxy.upbound-127.0.0.1.nip.io
  tls:
  - match:
    - sniHosts:
      - proxy.upbound-127.0.0.1.nip.io
    route:
    - destination:
        host: spaces-router.upbound-system.svc.cluster.local
        port:
          number: 8443
EOF
```

## Install spaces

```
cat > spaces-values.yaml << 'EOF'
externalTLS:
  tlsSecret:
    name: proxy-tls-secret
  caBundleSecret:
    name: proxy-tls-secret
    key: ca.crt
ingress:
  provision: false
  namespaceLabels:
    kubernetes.io/metadata.name: istio-system
  podLabels:
    app: istio-ingressgateway
    istio: ingressgateway
EOF

# Update these according to your account/token file
export SPACES_TOKEN_PATH=<token file path>
export UPBOUND_ACCOUNT=<account>
export SPACES_ROUTER_HOST="proxy.upbound-127.0.0.1.nip.io"
export SPACES_VERSION="1.13.1"

# Create image pull secret
kubectl -n upbound-system create secret docker-registry upbound-pull-secret \
 --docker-server=https://xpkg.upbound.io \
 --docker-username="$(jq -r .accessId $SPACES_TOKEN_PATH)" \
 --docker-password="$(jq -r .token $SPACES_TOKEN_PATH)"

# Login to xpkg.upbound.io
jq -r .token $SPACES_TOKEN_PATH | helm registry login xpkg.upbound.io -u $(jq -r .accessId $SPACES_TOKEN_PATH) --password-stdin

# Install spaces helm chart
helm -n upbound-system upgrade --install spaces \
 oci://xpkg.upbound.io/spaces-artifacts/spaces \
 --version "${SPACES_VERSION}" \
 --set "ingress.host=${SPACES_ROUTER_HOST}" \
 --set "account=${UPBOUND_ACCOUNT}" \
 --set "authentication.hubIdentities=true" \
 --set "authorization.hubRBAC=true" \
 --wait -f spaces-values.yaml
```

## Validate the installation

Successful access of the up command to interact with your self hosted space validates the
certificate installation.
- `up ctx .`

Additionally, you can further issue control plane creation, list and deletion
commands that should work as well.
- `up ctp create cert-test`
- `up ctp list`
- `up ctp delete cert-test`

Note that a new profile may need to be created if up cannot connect.

## Troubleshooting

The following `openssl` command is useful to examine your certificate:
- `openssl s_client -connect proxy.upbound-127.0.0.1.nip.io:443 -showcerts`

[istioctl]: https://istio.io/latest/docs/ops/diagnostic-tools/istioctl/
