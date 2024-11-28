---
title: Configure a self-hosted OIDC provider
weight: 200
description: Configure a self-hosted OIDC provider in a connected or disconnected Space
---

In case you are not able to [enable SSO for your Upbound organization](enable-sso.md), you might want to configure your space(s) to trust an authentication provider using OIDC. This might be needed when:

- you are a disconnected Space user
- your Identity Provider is not internet-accessible
- you need more fine-grained control over how users are authenticated than Upbound SSO and Directory Sync can provide.

Upbound Spaces uses the Kubernetes API server [Structured Authentication Configuration][Structured Auth Config] format to let you configure how OIDC tokens sent to the Spaces API and control planes are authenticated.

This guide walks you through how to create and apply the authentication configuration to let the space know how to authenticate users from your external identity provider. Each section focuses on a specific part of the configuration file.

## Creating the `AuthenticationConfiguration` file

An Upbound Space expects the configuration to be present inside a `ConfigMap` inside the `upbound-system` namespace, with a name you supply to the `authentication.structuredConfig` Helm value.

First, create a file called `config.yaml` with an `AuthenticationConfiguration` payload, see the [API reference here](https://kubernetes.io/docs/reference/config-api/apiserver-config.v1beta1/#apiserver-k8s-io-v1beta1-AuthenticationConfiguration).

The following are the minimally required parameters:

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: <oidc-issuer-url>
    audiences:
    - <oidc-client-id>
  claimMappings:
    username:
      claim: <oidc-username-claim>
      prefix: <oidc-username-prefix>
```

The minimally required JWT token for a user `alice` would be as follows:

```json
{
  "iss": "<oidc-issuer-url>",      // must match the issuer.url
  "aud": ["<oidc-client-id>"],     // at least one of the entries in issuer.audiences must match the "aud" claim in presented JWTs.
  "exp": 1234567890,               // token expiration as Unix time (the number of seconds elapsed since January 1, 1970 UTC)
  "<oidc-username-claim>": "alice" // this is the username claim configured in the claimMappings.username.claim or claimMappings.username.expression
}
```

The result of the authentication process is a [Kubernetes UserInfo](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#authentication-strategies), a user representation where the user:

- must have a non-empty username
- can be part of zero, one or many groups
- can have a UID
- can have attached extra user information in an object with provider-scoped keys

If in the above example `<oidc-username-prefix>` was `oidc:`, the resulting user information would only contain the username:

```json
{
    "username": "oidc:alice"
}
```

Based on this user information, authorization is performed, either using Kubernetes or Upbound RBAC.

<!-- vale gitlab.Uppercase = NO -->
For detailed configuration options, including the CEL-based token validation, review the feature [documentation][Structured Auth Config].
<!-- vale gitlab.Uppercase = YES -->

The `AuthenticationConfiguration` allows you to configure multiple JWT authenticators as separate issuers.

### Required: Configure an issuer

The `issuer` URL must be unique across all configured authenticators.

```yaml
# initial part of configuration omitted
jwt:
- issuer:
    url: https://example.com
    discoveryUrl: https://discovery.example.com/.well-known/openid-configuration
    certificateAuthority: |-
      <Inline CA Certificate>
    audiences:
    - client-id-a
    - client-id-b
    audienceMatchPolicy: MatchAny
```

By default, the authenticator assumes the OIDC Discovery URL is `{issuer.url}/.well-known/openid-configuration`. Most identity providers follow this structure, and if so, you can omit the `discoveryUrl` field. To use a separate discovery service, specify the full path to the discovery endpoint in the `discoveryURL` field.

If the CA for the Discovery URL isn't public or trusted by internet-standard CA certificates, provide the PEM encoded CA in the `certificateAuthority` field.

At least one of the `audiences` entries must match the `aud` claim in the JWT. For OIDC tokens, this is the Client ID of the application attempting to access the Upbound API. Having multiple values set allows the same configuration to apply to multiple client applications, for example the `kubectl` CLI and an Internal Developer Portal.

If you specify multiple `audiences`, `audienceMatchPolicy` must equal `MatchAny`, which means that as long as the JWT token contains any of the listed audiences, authentication is successful.

### Configure how JWT claims map into user information

When deciding how to map a JWT token from your identity provider into an identity in the Space, it is important to avoid
naming conficts between different trust domains, which there might be multiple of within a Space (e.g. Upbound Identity,
host-cluster authentication). This can be achieved in a straightforward way by prefixing all userinfo values and extra keys
with some value that is unique in the Space context. This in practice means:

- specify `prefix` for `username` (and `groups` & `uid` if mapped), or alternative include a prefix in `expression`
- add your prefix to all `extra[*].key` values
- choose unique prefixes for all JWT authenticators you specify in the configuration
- do not use reserved prefixes `system:` (reserved by Kubernetes) or `upbound:` (reserved by Upbound)

#### Required: Username claim mapping

It is recommended to follow the OIDC standard and use the `sub` claim as the user name, and specify a unique, non-empty prefix as discussed above.

As an alternative to specifying both `username.claim` and `username.prefix`,
you can specify a [CEL](https://cel.dev/) `username.expression`.
Either of those alternatives is required, but they are also mutually exclusive.

```yaml
claimMappings:
  username:
    claim: "sub"
    prefix: "keycloak:"
    # <or>
    expression: '"keycloak:" + claims.username + ":external-user"'
```

#### Optional but recommended: Groups claim mapping

By default, this configuration doesn't map groups, unless you either:

- specify both `groups.claim` and `groups.prefix`. `groups.prefix` may be explicitly set to the empty string.
or
<!-- vale gitlab.Uppercase = NO -->
- specify a CEL `expression` that returns a string or list of strings.
<!-- vale gitlab.Uppercase = YES -->

```yaml
claimMappings:
  groups:
    claim: "groups"
    prefix: "keycloak:"
    # <or>
    expression: 'claims.roles.split(",")'
```

### Optional: UID or extra claim mappings

Optionally, you can configure claim mappings for the user UID and extra information. Refer to the [Kubernetes documentation][Structured Auth Config] for more info.

### Optional but recommended: Validation rules

<!-- vale gitlab.Uppercase = NO -->
Validation rules are outside the scope of this document. Review the [documentation][Structured Auth Config] for more information. Examples include using CEL expressions to validate authentication such as:
<!-- vale gitlab.Uppercase = YES -->

- Validating that a token claim has a specific value
- Validating that a token has a limited lifetime
- Ensuring usernames and groups don't contain reserved values

It is recommended to only authenticate such users which reasonably would need access to the Space, instead of all users of your identity provider, which most likely contain many more users than need access to your space.

For example, to only allow users with a certain group membership `space-foo-access` access to authenticate (and thus later, get assigned privileges) in the space:

```yaml
- issuer: {} # omitted, see spec above
  userValidationRules:
  - expression: "!user.groups.has(group, group == 'keycloak:space-foo-access')"
    message: 'user must be part of space-foo-access group'
```

## Security Considerations

- Without unique, non-empty prefixes, user naming conflicts can occur, and semantics from one trust domain can influence that of another
  - For example, if [host-cluster Kubernetes authorization](../authorization/k8s-rbac.md) is enabled, and no prefix is set for groups, a user in the OIDC identity provider could create and join a group called `system:masters`, a reserved admin group within Kubernetes, and thus successfully be authorized for any operation because of their seemed membership of that group, as the Kubernetes authorizer thinks the user is a superadmin.
  - On the contrary, if a group prefix like `keycloak:` was specified, a group called `system:masters` within the identity provider would be mapped into group name `keycloak:system:masters` within the Space, and thus would not be part of any "special" Kubernetes group.
- Every authenticated user can send requests to any control plane, as they might be assigned control plane-local privileges in that control plane
  - This is why it is recommended to only authenticate the users which really need access to your Space, as a defense in depth prevention against someone assigning privileges to a user in your identity provider which never actually would access the Space
- When a user is successfully authenticated according to the given configuration, they can be assigned privileges in either Spaces API or control planes. There is no distinction at the authentication level between them
  - If you would like to authenticate users differently for different endpoints (e.g. Spaces API vs control planes, or use different authentication logic for a specific control plane), let us know about this feature request.

## Install the `AuthenticationConfiguration`

Once you create an `AuthenticationConfiguration` file, specify this file as a `ConfigMap` in the host cluster for the Upbound Space.

```sh
kubectl create configmap <configmap name> -n upbound-system --from-file=config.yaml=./path/to/config.yaml
```
<!-- vale gitlab.SentenceLength = NO -->
<!-- vale Google.WordList = NO -->
To enable OIDC authentication and disable Upbound IAM when installing the Space, reference the configuration and pass an empty value to the Upbound IAM issuer 
parameter:
<!-- vale Google.WordList = YES -->
<!-- vale gitlab.SentenceLength = YES -->
```sh
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "authentication.structuredConfig=<configmap name>" \
  --set "router.controlPlane.extraArgs[0]=--upbound-iam-issuer-url="

# TODO: Deactivate upbound IAM separately
```

## Connecting to the Space



<!-- vale Microsoft.HeadingAcronyms = NO -->
## Configure Spaces-level RBAC
<!-- vale Microsoft.HeadingAcronyms = YES -->

In this scenario, the external identity provider handles authentication, but permissions for Spaces and ControlPlane APIs use standard RBAC objects.

### Spaces APIs

The Spaces APIs include:
```yaml
- apiGroups:
  - spaces.upbound.io
  resources:
  - controlplanes
  - sharedexternalsecrets
  - sharedsecretstores
  - backups
  - backupschedules
  - sharedbackups
  - sharedbackupconfigs
  - sharedbackupschedules
- apiGroups:
  - observability.spaces.upbound.io
  resources:
  - sharedtelemetryconfigs
```
<!-- vale Google.Headings = NO -->
### ControlPlane APIs
<!-- vale Google.Headings = YES -->

<!-- vale Google.WordList = NO -->
Crossplane specifies three [roles][Crossplane Managed ClusterRoles] for a ControlPlane: admin, editor, and viewer. These map to the verbs `admin`, `edit`, and `view` on the `controlplanes/k8s` resource in the `spaces.upbound.io` API group.
<!-- vale Google.WordList = YES -->

### Control access

The `groups` claim in the `AuthenticationConfiguration` allows you to control resource access when you create a `ClusterRoleBinding`. A `ClusterRole` defines the role parameters and a `ClusterRoleBinding` subject.

The example below allows `admin` permissions for all ControlPlanes to members of the `ctp-admins` group:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: allow-ctp-admin
rules:
- apiGroups:
  - spaces.upbound.io
  resources:
  - controlplanes/k8s
  verbs:
  - admin
```

ctp-admins ClusterRoleBinding
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: allow-ctp-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: allow-ctp-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: ctp-admins
```

## Configure Control Plane-level RBAC

TODO

[Structured Auth Config]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-authentication-configuration
[Crossplane Managed ClusterRoles]: https://github.com/crossplane/crossplane/blob/master/design/design-doc-rbac-manager.md#managed-rbac-clusterroles
