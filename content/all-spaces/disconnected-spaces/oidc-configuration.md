
### Configuring OIDC
Upbound uses the Kubernetes [Structured Authentication Configuration][Structured Auth Config] format to define how to validate OIDC tokens that are presented to the API. This configuration is stored in a `ConfigMap`, and provided to the Upbound router component during installation via Helm.

#### Creating the `AuthenticationConfiguration` file
Create a file called `config.yaml` containing an `Authenticationconfiguration`

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: oidc-issuer-url
    audiences:
    - oidc-client-id
  claimMappings: # optional
    username:
      claim: oidc-username-claim
      prefix: oidc-username-prefix
    groups:
      claim: oidc-groups-claim
      prefix: oidc-groups-prefix
```

 A full discussion of all of the available configuration options, including CEL-based token validation, can be found in the feature [documentation][Structured Auth Config]. The format allows for multiple JWT authenticators to be configured. At a minimum, each element of the `jwt` array must contain:
 - An `issuer` specification
Typically, the configuration will also contain:
- A `username` claim mapping
- A `groups` claim mapping
Optionally, the configuration may also include:
- A set of claim validation rules
- A set of user validation rules
##### Issuer
```yaml
issuer: 
  url: https://example.com
  discoveryUrl: https://discovery.example.com/.well-known/openid-configuration
  certificateAuthority: |-
    <Inline CA Certificate>
  audiences:
  - client-id-a
  - client-id-b
  audienceMatchPolicy: MatchAny
```
The `issuer` url must be unique across all configured authenticators

By default, the authenticator will assume the OIDC Discovery URL is `{issuer.url}/.well-known/openid-configuration`. This should be correct for most providers, but can be overridden if needed.

If the CA for the Issuer is not public, provide the PEM encoded CA for the Discovery URL.

At least one of the `audiences` entries must match the `aud` claim in the JWT. For OIDC tokens, this will be the Client ID of the application attempting to access the Upbound API. Having multiple values set allows the same configuration to apply to multiple client applications, for example the `kubectl` cli and an Internal Developer Portal. 

If multiple `audiences` are specified, `audienceMatchPolicy` must equal `MatchAny`.

##### Username Claim Mapping
```yaml
claimMappings:
  username:
    claim: "sub"
    prefix: ""
    # <or>
	expression: 'claims.username + ":external-user'
```
By default, the authenticator will use the `sub` claim as the user name. To override this, either:
- specify *both* `claim` and `prefix`. `prefix` may be explicitly set to the empty string.
or
- specify a CEL `expression` that will be used to calculate the user name. 

##### Groups Claim Mapping
```yaml
claimMappings:
  groups:
    claim: "groups"
    prefix: ""
    # <or>
	expression: 'claims.roles.split(",")'
```
By default, no groups will be mapped. To override this, either:
- specify both `claim` and `prefix`. `prefix` may be explicitly set to the empty string.
or
- specify a CEL `expression` that returns a string or list of strings.

##### Validation Rules
Authoring validation rules is outside the scope of this discussion. But the [documentation][Structured Auth Config] includes several examples of using CEL expressions to validate authentication such as:
- Validating that a token claim has a specific value
- Validating that a token has a limited lifetime
- Ensuring usernames and groups don't contain reserved prefixes

#### Required Claims
In order to interact with Space and ControlPlane APIs, users must have the `upbound.io/aud` claim set to one of the following:

| Upbound.io Audience                                     | Notes                                                                |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `[]`                                                    | No Access to Space-level or ControlPlane APIs                        |
| `['upbound:spaces:api']`                                | This Identity is intended only for Space-level APIs                  |
| `['upbound:spaces:controlplanes']`                      | This Identity is intended only for  ControlPlane APIs                |
| `[upbound:spaces:api', 'upbound:spaces:controlplanes']` | This Identity is intended for both Space-level and ControlPlane APIs |
This claim may be set at the Identity Provider, and mapped in the ID Token, or it can be added via the `AuthenticationConfiguration` `jwt.claimMappings.extra` array. For example:

```yaml
apiVersion: apiserver.config.k8s.io/v1beta1
kind: AuthenticationConfiguration
jwt:
- issuer:
    url: https://keycloak:8443/realms/master
    certificateAuthority: |-
      <ca bytes inline>
    audiences:
    - master-realm
    audienceMatchPolicy: MatchAny
  claimMappings:
    username:
      claim: "preferred_username"
      prefix: "keycloak:"
    groups:
      claim: "groups"
      prefix: ""
    extra:
    - key: 'upbound.io/aud'
      valueExpression: "['upbound:spaces:controlplanes', 'upbound:spaces:api']"
```

#### Installing the `AuthenticationConfiguration` 
Once you have created an `AuthenticationConfiguration` in a file called `config.yaml`, this will be specified as a `ConfigMap` in the host cluster for the Upbound space.

```sh
kubectl create secret generic <name> -n upbound-system --from-file=config.yaml=./path/to/config.yaml
```
Then, to enable OIDC authentication when installing the Space, reference the configuration and disable Upbound IAM:
```sh
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "authentication.structuredConfig=<configmap name>" \
  --set "router.controlPlane.extraArgs[0]=--upbound-iam-issuer-url="
```

### Configuring RBAC
The OIDC configuration enables users to be authenticated from an external identity provider, however access permissions for Spaces and ControlPlane APIs use standard Kubernetes RBAC objects.

#### Spaces APIs
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

#### ControlPlane APIs
Crossplane specifies three [roles][Crossplane Managed ClusterRoles] for a ControlPlane: admin, editor, and viewer. These map to the verbs `admin`, `edit`, and `view` on the `controlplanes/k8s` resource in the `spaces.upbound.io` api group.


#### Controlling Access
Combined with a `groups` claim mapping in the OIDC configuration, access to individual control planes and control plane groups may be modeled using `ClusterRoleBinding`s in the appropriate namespaces.

#### Examples

###### Allow members of group 'ctp-admins' to admin all ControlPlanes
ControlPlane admin ClusterRole
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






[Structured Auth Config]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-authentication-configuration
[Crossplane Managed ClusterRoles]: https://github.com/crossplane/crossplane/blob/master/design/design-doc-rbac-manager.md#managed-rbac-clusterroles
