---
title: Provider Identity with OIDC
weight: 100
description: Authenticating providers to external services using OpenID Connect.
---

Crossplane providers use a `ProviderConfig` Kubernetes object to
supply credentials to authenticate with external services. For
example, 
[Upbound's AWS provider](https://marketplace.upbound.io/providers/upbound/provider-aws/latest)
offers a
[`ProviderConfig`](https://marketplace.upbound.io/providers/upbound/provider-aws/latest/resources/aws.upbound.io/ProviderConfig/v1beta1)
that supports 
[supplying credentials](https://marketplace.upbound.io/providers/upbound/provider-aws/latest/resources/aws.upbound.io/ProviderConfig/v1beta1#doc:spec-credentials-source)
via a Kubernetes `Secret`, environment variable, file, and more. Users can
create multiple `ProviderConfig` instances and reference them from the
`spec.providerConfigRef` field of any managed resource.

Providers in Upbound managed control planes can also use an `Upbound` credential 
source called **Provider Identity**.  

The `Upbound` credential source uses OpenID Connect (`OIDC`) to 
authenticate to providers without requiring users to store credentials on Upbound. 

This authentication method is comparable to
["workload identity"](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) 
offered by some managed Kubernetes providers.

## OpenID Connect

[OpenID Connect (OIDC)](https://openid.net/connect/) is a protocol that's built
on top of [OAuth 2.0](https://oauth.net/2/). It serves to establish the identity
of an entity in one environment that's attempting to access resources in another.

OIDC calls the two parties the **OpenID Providers (OPs)** and **Relying Parties (RPs)**. 
Managed control planes define these roles as follows:

- **OpenID Provider**: Upbound
- **Relying Party**: an external service that supports OIDC, for example, AWS, Azure or GCP
 
Users set up a _trust relationship_ between Upbound and the external
service. Upbound uses the trust relationship instead of storing credentials for an 
external service in the managed control plane. 


Upbound injects an _identity token_ into the file system of every
provider `Pod`. Upbound sends the token to the external service and exchanges it for a
short-lived credential. Upbound uses the short-lived credential to perform 
operations against the external service.

## Creating trust relationships

Every OIDC relying party implements its own mechanism for establishing a trust
relationship and associating permissions. Typically, the process involves
the following broad steps:

1. Specifying the _issuer_. For Upbound, this is `https://proidc.upbound.io`.
2. Specifying an _audience_. This may vary by relying party.
3. Creating a role or service account that an entity possessing a valid identity
   token can assume.
4. Associating permissions with the role or service account.

Different OIDC relaying parties may define valid tokens differently. Typically 
it involves writing a policy that restricts what _subject_ can assume 
the role or service account.

{{<hint "warning" >}} 
Authoring a policy with appropriate access controls
is critical to ensure that only your provider in your managed control plane is
able to assume the role or service account. 
{{< /hint >}}

Identity tokens are
[JSON Web Tokens (`JWTs`)](https://www.rfc-editor.org/rfc/rfc7519). 
The OIDC _claims_ supported by Upbound are available in the OIDC metadata
endpoint at `https://proidc.upbound.io/.well-known/openid-configuration`.

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

OIDC relying parties use this information to validate identity tokens. 
Relying parties use the `jwks_uri` to ensure that the OIDC provider signed the 
identity token with their private key. The private key must
correspond to one of the public keys from
`https://proidc.upbound.io/.well-known/jwks`. 

The `iss` and `aud` claims of an
identity token should match the _issuer_ and _audience_ configured for the
relying party. The `sub` should be a valid _subject_ based on the
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

The claims for an identity token injected into the file system of a
provider in a managed control plane looks like the following.

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

{{< hint "tip" >}} 
Identity tokens injected into a provider `Pod` are valid
for 1 hour. They are automatically refreshed before expiration to ensure there
is no interruption in service. 
{{< /hint >}}


## Using Upbound OIDC as a credential source

The Upbound console allows for creating instances of a `ProviderConfig` via the
console, instead of manually authoring a YAML manifest. Users
may also connect to their managed control planes directly and apply a
`ProviderConfig` YAML manifest. 

Each `Provider` defines their own `ProviderConfig` schema and values.

{{<hint "tip" >}}
Proividers in the [Upbound Marketplace](https://marketplace.upbound.io/) 
contain examples of how to use `source: Upbound` to enable OIDC authentication.
{{< /hint >}}

For example, 
[Upbound's GCP provider](https://marketplace.upbound.io/providers/upbound/provider-gcp/latest)
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

Applying this manifest in a
managed control plane causes `provider-gcp` to fetch its identity token from
the file system and use it to authenticate to GCP.

## Adding Upbound OIDC to a Provider

Any provider that can run in a managed control plane can support the `Upbound`
credential source. Upbound injects identity tokens into the file system of every
provider `Pod` whether they support OIDC or not. A provider wishing to support OIDC
can access its identity token in the
`/var/run/secrets/upbound.io/provider/token` file. [This Pull
Request](https://github.com/upbound/provider-aws/pull/278) provides a reference implementation.
