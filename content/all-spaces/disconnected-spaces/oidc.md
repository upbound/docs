---
title: OIDC authentication
weight: 300
description: Use kubelogin to authenticate users in a Space
aliases:
    - /spaces/oidc
---

You can configure a Space to integrate with an external Identity Provider, provided it implements the [Open ID Connect (OIDC) protocol](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens). This allows you to use an auth plugin, such as [kubelogin](https://github.com/int128/kubelogin).

## Configure a Space for OIDC authentication

You can configure a Space to use OIDC auth by providing the **OIDC issuer URL** and **OIDC client ID** at Space install-time. As a prerequisite, you must have already created an OIDC Identity Provider. This could be:

- [AWS Cognito user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [GCP Identity Platform](https://cloud.google.com/identity-platform/docs/web/oidc)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/architecture/auth-oidc)
- [Okta](https://developer.okta.com/blog/2021/11/08/k8s-api-server-oidc#set-up-an-okta-oidc-application-and-authorization-server)
- Other Identity Providers, as long as they support OIDC

{{< hint "tip" >}}
Consult your preferred Identity Provider's documentation for setting up OIDC.
{{< /hint >}}

You must set the issuer URL (`oidc-issuer-url`) and client ID (`oidc-client-id`) values from the corresponding OIDC Identity Provider in the Space.

```bash
# Replace these with the values from your IdP.
export SPACES_OIDC_ISSUER_URL=issuer-url
export SPACES_OIDC_CLIENT_ID=client-id
```

During a Space install:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v1.2.0" \
  --set "router.oidc[0]='--oidc-issuer-url=${SPACES_OIDC_ISSUER_URL}'" \
  --set "router.oidc[1]='--oidc-client-id=${SPACES_OIDC_CLIENT_ID}'"
```

Or via Helm:

```bash
helm -n upbound-system upgrade --install spaces \
  oci://us-west1-docker.pkg.dev/orchestration-build/upbound-environments/spaces \
  --version "v1.2.0" \
  --set "router.oidc[0]='--oidc-issuer-url=${SPACES_OIDC_ISSUER_URL}'" \
  --set "router.oidc[1]='--oidc-client-id=${SPACES_OIDC_CLIENT_ID}'"
```

## Authenticate with a control plane

After you've installed a Space that's configured to use OIDC auth, you need to fetch and convert the kubeconfig for the control plane. In a Space, the Space writes the connection details for a control plane to a secret in the Space. Fetch the kubeconfig from the secret. For example:

```bash
kubectl get secret kubeconfig-ctp1 -n default -o jsonpath='{.data.kubeconfig}' | base64 -d > /tmp/ctp1.yaml
```

Update the user details of the kubeconfig to use `oidc-login`. For example, below is a snippet of a kubeconfig which uses [kubelogin](https://github.com/int128/kubelogin).

```yaml
users:
- name: acmeco-ctp1
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: kubectl
      args:
      - oidc-login
      - get-token
      - --oidc-issuer-url=${SPACES_OIDC_ISSUER_URL}
      - --oidc-client-id=${SPACES_OIDC_CLIENT_ID}
      - --oidc-client-secret=${SPACES_OIDC_CLIENT_SECRET}
```

 Now whenever a user attempts to interact directly with the control plane, they must have first authenticated with your Identity Provider.
