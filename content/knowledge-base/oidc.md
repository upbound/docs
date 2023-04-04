---
title: Provider Identity with OIDC
weight: 3
description: Authenticating providers to external services using OpenID Connect.
---

Crossplane providers implement a `ProviderConfig` type, which can be used to
supply credentials for authenticating with the external service they target. For
example, [Upbound's AWS
provider](https://marketplace.upbound.io/providers/upbound/provider-aws/latest)
offers a
[`ProviderConfig`](https://marketplace.upbound.io/providers/upbound/provider-aws/v0.31.0/resources/aws.upbound.io/ProviderConfig/v1beta1)
that supports [supplying
credentials](https://marketplace.upbound.io/providers/upbound/provider-aws/v0.31.0/resources/aws.upbound.io/ProviderConfig/v1beta1#doc:spec-credentials-source)
via a Kubernetes `Secret`, environment variable, file, and more. Users can
create multiple `ProviderConfig` instances and reference them from the
`spec.providerConfigRef` field of any managed resource.

Providers that run in managed control planes have the option to also support an
`Upbound` credential source, which alleviates the need for users to store
credentials on Upbound. This is similar to "workload identity" features offered
by some managed Kubernetes offerings. In Upbound managed control planes the
feature is referred to as **Provider Identity**.

## OpenID Connect

[OpenID Connect (OIDC)](https://openid.net/connect/) is a protocol that is built
on top of [OAuth 2.0](https://oauth.net/2/) and serves to establish the identity
of entity in one environment that is attempting to access resources in another.
The roles played on each side of the interaction are referred to as **OpenID
Providers (OPs)** and **Relying Parties (RPs)**. In the context of managed
control planes, these roles are defined as follows.

- **OpenID Provider**: Upbound
- **Relying Party**: an external service that supports OIDC

Instead of storing credentials for an external service in their managed control
plane, users set up a _trust relationship_ between Upbound and the external
service. Upbound then injects an _identity token_ into the filesystem of every
provider `Pod`, which can be sent to the external service and exchanged for a
short-lived credential if it meets the parameters and policies that govern the
relationship. If the exchange is successful, the short-lived credential can then
be used to perform subsequent operations against the external service.

## Creating Trust Relationships

Every relying party implements its own mechanism for establishing a trust
relationship and associating permissions. Typically, the process will involve
the following broad steps:

1. Specifying the _issuer_. For Upbound, this is `https://proidc.upbound.io`.
2. Specifying an _audience_. This may vary by relying party.
3. Creating a role or service account that an entity possessing a valid identity
   token can assume.
4. Associating permissions with the role or service account.

The way validity of a token is defined may also vary from one relying party to
another, but it typically involves writing some policy that restricts what
_subject_ can assume the role or service account.

{{<hint "warning" >}} Authoring a policy with appropriate access controls
is critical to ensure that only your provider in your managed control plane is
able to assume the role or service account. {{< /hint >}}

Identity tokens are formatted as [JSON Web Tokens
(JWTs)](https://www.rfc-editor.org/rfc/rfc7519). The OIDC specification requires
the presence of some claims, but the supported claims for any OpenID provider
can be discovered on the corresponding OIDC metadata endpoint. For Upbound, that
endpoint is `https://proidc.upbound.io/.well-known/openid-configuration`.

```json
{
  "issuer": "https://proidc.upbound.io",
  "jwks_uri": "https://proidc.upbound.io/.well-known/jwks",
  "response_types_supported": [
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ],
  "claims_supported": [
    "sub",
    "aud",
    "exp",
    "iat",
    "iss",
    "jti",
    "nbf"
  ]
}
```

Relying parties use this information to validate identity tokens. The `jwks_uri`
is used to ensure that the identity token is signed with a private keys that
matches one of the public keys serve from
`https://proidc.upbound.io/.well-known/jwks`. The `iss` and `aud` claims of an
identity token should match the _issuer_ and _audience_ configured for the
relying party. The `sub` should evaluate to a valid _subject_ based on the
authored policy. For providers running in Upbound managed control planes, the
_subject_ adheres to the following format.

```
mcp:<account>/<mcp-name>:provider:<provider-name>
```

For example, the following would be a valid _subject_ for `provider-aws` in a
managed control plane named `prod-1` in the `my-org` account.

```
mcp:my-org/prod-1:provider:provider-aws
```

In total, the claims for an identity token injected into the filesystem of a
provider in a managed control plane will look similar to the following.

```json
{
  "iss": "https://proidc.upbound.io",
  "sub": "mcp:my-org/prod1:provider:provider-aws",
  "aud": [
    "sts.amazonaws.com"
  ],
  "exp": 1680124165,
  "nbf": 1680120565,
  "iat": 1680120565,
  "jti": "YL1ouQ5KJiTY2QShIRczqQ=="
}
```

{{< hint "tip" >}} Identity tokens injected into a provider `Pod` are valid
for 1 hour. They are automatically refreshed before expiration to ensure there
is no interruption in service. {{< /hint >}}


## Using Upbound OIDC as a Credential Source

The Upbound console allows for creating instances of a `ProviderConfig` via the
UI, which alleviates the need to manually author a YAML manifest. However, users
may also connect to their managed control planes directly and apply a
`ProviderConfig` manifest. When doing so, users may look in the [Upbound
Marketplace](https://marketplace.upbound.io/) to see what credential sources are
offered by the providers they are utilizing, and what additional information
must be supplied. Most providers will also supply a set of examples
demonstrating how to use the various credential sources. For example, [Upbound's
GCP
provider](https://marketplace.upbound.io/providers/upbound/provider-gcp/latest)
includes the following manifest for using the `Upbound` OIDC identity source.

```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Upbound
    upbound:
      federation:
        providerID: projects/<project-id>/locations/global/workloadIdentityPools/<identity-pool>/providers/<identity-provider>
        serviceAccount: <service-account-name>@<project-name>.iam.gserviceaccount.com
  projectID: my-org-gcp-project
```

Populating this manifest with the appropriate values and applying it in a
managed control plane will cause `provider-gcp` to fetch its identity token from
the filesystem and use it to authenticate to GCP.

## Adding Upbound OIDC to a Provider

Any provider that can run in a managed control plane can support the `Upbound`
credential source. Identity tokens are injected into the filesystem of every
provider `Pod` whether they support OIDC or not. A provider wishing to implement
the functionality can access its identity token in the
`/var/run/secrets/upbound.io/provider/token` file. A reference implementation
can be found in [this Pull
Request](https://github.com/upbound/provider-aws/pull/278).
