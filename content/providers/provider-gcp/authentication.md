---
title: Authentication
weight: 10
description: Authentication options with the Upbound GCP official provider
---

The Upbound Official GCP Provider supports multiple authentication methods.

* [Upbound auth (OIDC)]({{<ref "operate/oidc" >}})
* [Service account keys](https://cloud.google.com/iam/docs/keys-create-delete)
* [OAuth 2.0 access token](https://developers.google.com/identity/protocols/oauth2)
* [Workload identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)
  for Google managed Kubernetes clusters (`GKE`)
* [Service account impersonation](https://cloud.google.com/iam/docs/service-account-overview#impersonation)

## Upbound auth (OIDC)

{{< hint "note" >}}
This method of authentication is only supported in managed control planes running on [Upbound Cloud Spaces]({{<ref "deploy" >}})
{{< /hint >}}

When your control plane runs in an Upbound Cloud Space, you can use this authentication method. Upbound authentication uses OpenID Connect (OIDC) to authenticate to GCP without requiring you to store credentials in Upbound.

### Create an identity pool

1. Open the **[GCP IAM Admin console](https://console.cloud.google.com/iam-admin/iam)**.
2. Select **[Workload Identity Federation](https://console.cloud.google.com/iam-admin/workload-identity-pools)**.
3. If this is your first Workload Identity Federation configuration select **Get Started**
4. At the top of the page, select **Create Pool**.
5. Name the pool, like **upbound-oidc-pool**.
6. Enter a description like **An identity provider for Upbound**.
7. **Enable** the pool.
8. Select **Continue**

#### Add Upbound to the pool

Under the _Add a provider to pool_ configuration under _Select a provider_ use **OpenID Connect (OIDC)**

_Provider Name_: **upbound-oidc-provider**
_Provider ID_: **upbound-oidc-provider-id**
_Issuer (URL)_: **https://proidc.upbound.io**

Select **Allowed audiences**
For _Audience 1_ enter **sts.googleapis.com**

Select **Continue**.

#### Configure provider attributes

The provider attributes restrict which remote entities you allow access to your resources.
When Upbound authenticates to GCP it provides an OIDC subject (`sub`) in the form:

`mcp:<account>/<mcp-name>:provider:<provider-name>`

Configure the _google.subject_ attribute as **assertion.sub**

Under _Attribute Conditions_ select **Add Condition**.

<!-- vale gitlab.Uppercase = NO -->
<!-- ignore CEL -->
To authenticate any control plane in your organization, in the _Conditional CEL_ input box put
<!-- vale gitlab.Uppercase = YES -->

{{<editCode >}}
```console
google.subject.contains("mcp:$@ORGANIZATION_NAME$@")
```
{{< /editCode >}}

{{< hint "warning" >}}
Not providing a CEL condition allows any managed control plane to access your GCP account if they know the project ID and service account name.
{{< /hint >}}

Select **Save**.

### Create a GCP Service Account

GCP requires Upbound to use a [Service Account](https://cloud.google.com/iam/docs/service-account-overview). The required GCP _roles_ of the service account depend on the services managed by your control plane.

1. Open the **[GCP IAM Admin console](https://console.cloud.google.com/iam-admin/iam)**.
2. Select **[Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)**.
3. From the top of the page, select **Create Service Account**.

### Service account details
<!-- vale Google.WordList = NO -->
<!-- ignore account name -->
<!-- vale Google.FirstPerson = NO -->
Under _Service account details_ enter
_Service account name_: **upbound-service-account**
_Service account ID_: **upbound-service-account-id**
_Description_: **Upbound control planes service account**
<!-- vale Google.WordList = YES -->
<!-- vale Google.FirstPerson = YES -->

Select **Create and Continue**.

### Grant this service account access to project

For the _CloudSQL as a service_ configuration the service account requires the roles:
**Cloud SQL Admin**
**Workload Identity User**

Select **Done**.

### Record the service account email address

At the list of service accounts copy the service account **email**.
Upbound requires this to authenticate your managed control plane.

### Add the service account to the identity pool

Add the service account to the Workload Identity Federation pool to authenticate to Upbound with OIDC.
1. Return to the **[Workload Identity Federation](https://console.cloud.google.com/iam-admin/workload-identity-pools)** page and select the [**upbound-oidc-pool**](https://console.cloud.google.com/iam-admin/workload-identity-pools/pool/upbound-oidc-pool).
2. Near the top of the page select **Grant Access**.
3. Select the new service account, **upbound-service-account**.
4. Under _Select principals_ use **All identities in the pool**.
Select **Save**.
In the _Configure your application_ window, select **Dismiss**.

### Create a ProviderConfig

Create a
{{<hover label="pc-upbound-auth" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="pc-upbound-auth" line="8">}}Upbound{{</hover>}}.

Supply the {{<hover label="pc-upbound-auth" line="6">}}projectID{{</hover>}}, {{<hover label="pc-upbound-auth" line="11">}}providerID{{</hover>}}, and {{<hover label="pc-upbound-auth" line="12">}}serviceAccount{{</hover>}} found in the previous section.

{{<hint "tip" >}}
To apply Upbound based authentication by default name the ProviderConfig
{{<hover label="pc-upbound-auth" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc-upbound-auth"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: crossplane-playground
  credentials:
    source: Upbound
    upbound:
      federation:
        providerID: projects/<project-id>/locations/global/workloadIdentityPools/<identity-pool>/providers/<identity-provider>
        serviceAccount: <service-account-name>@<project-name>.iam.gserviceaccount.com
```

## Service account keys

Using GCP service account keys requires storing the GCP account keys JSON file
as a Kubernetes secret.

To create the Kubernetes secret create or
[download your GCP service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating)
JSON file.


### Create a Kubernetes secret
Create the Kubernetes secret with
{{<hover label="kubesecret" line="1">}}kubectl create secret generic{{</hover>}}.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.Substitutions = NO -->
For example, name the secret
{{<hover label="kubesecret" line="2">}}gcp-secret{{</hover>}} in the
{{<hover label="kubesecret" line="3">}}crossplane-system{{</hover>}} namespace
and import the text file with the credentials
{{<hover label="kubesecret" line="4">}}gcp-credentials.json{{</hover>}} and
assign them to the secret key
{{<hover label="kubesecret" line="4">}}my-gcp-secret{{</hover>}}.
<!-- vale Google.FirstPerson = YES -->
<!-- vale gitlab.Substitutions = YES -->

```shell {label="kubesecret"}
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-credentials.json
```

To create a secret declaratively requires encoding the authentication keys as a
base-64 string.

<!-- vale Google.FirstPerson = NO -->
Create a {{<hover label="decSec" line="2">}}Secret{{</hover>}} object with
the {{<hover label="decSec" line="7">}}data{{</hover>}} containing the secret
key name, {{<hover label="decSec" line="8">}}my-gcp-secret{{</hover>}} and the
base-64 encoded keys.
<!-- vale Google.FirstPerson = YES -->

```yaml {label="decSec"}
apiVersion: v1
kind: Secret
metadata:
  name: gcp-secret
  namespace: crossplane-system
type: Opaque
data:
  my-gcp-secret: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZG9jcyIsCiAgInByaXZhdGVfa2V5X2lkIjogIjEyMzRhYmNkIiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJkb2NzQHVwYm91bmQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTIzNDUiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2RvY3MuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0=
```


### Create a ProviderConfig

Create a
{{<hover label="pc-keys" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="pc-keys" line="7">}}Secret{{</hover>}}.

Create a {{<hover label="pc-keys" line="8">}}secretRef{{</hover>}} with the
{{<hover label="pc-keys" line="9">}}namespace{{</hover>}},
{{<hover label="pc-keys" line="10">}}name{{</hover>}} and
{{<hover label="pc-keys" line="11">}}key{{</hover>}} of the secret.

{{<hint "tip" >}}
To apply key based authentication by default name the ProviderConfig
{{<hover label="pc-keys" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc-keys"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
{{<hover label="pc-keys2" line="4">}}key-based-providerconfig{{</hover>}}.

```yaml {label="pc-keys2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: key-based-providerconfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```

Apply the ProviderConfig to a
managed resource with a
{{<hover label="mr-keys" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr-keys"}
apiVersion: storage.gcp.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-gcp-bucket
spec:
  forProvider:
    location: US
  providerConfigRef:
    name: key-based-providerconfig
```

## OAuth access tokens

Using GCP access tokens requires storing the GCP account keys JSON file
as a Kubernetes secret.

Create a GCP access [token for a service account](https://developers.google.com/identity/protocols/oauth2#serviceaccount)
or with the [`gcloud` CLI](https://cloud.google.com/sdk/gcloud/reference/auth/print-access-token).

{{<hint "warning" >}}
GCP access tokens are valid for 1 hour by default. When the token expires
Crossplane can't create or delete resources.

The [provider-gcp GitHub repository](https://github.com/upbound/provider-gcp/blob/main/docs/Configuration.md#3-create-resources-to-generate-an-access-token) contains an example cron job that
automatically refreshes access tokens.
{{< /hint >}}

### Create a Kubernetes secret
Create the Kubernetes secret with
{{<hover label="kubesecret" line="1">}}kubectl create secret generic{{</hover>}}.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.Substitutions = NO -->
For example, name the secret
{{<hover label="kubesecret" line="2">}}gcp-secret{{</hover>}} in the
{{<hover label="kubesecret" line="3">}}crossplane-system{{</hover>}} namespace
and import the text file with the credentials
{{<hover label="kubesecret" line="4">}}gcp-token.json{{</hover>}} and
assign them to the secret key
{{<hover label="kubesecret" line="4">}}my-gcp-secret{{</hover>}}.
<!-- vale Google.FirstPerson = YES -->
<!-- vale gitlab.Substitutions = YES -->

```shell {label="kubesecret"}
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-token.json
```

To create a secret declaratively requires encoding the access token as a
base-64 string.

<!-- vale Google.FirstPerson = NO -->
Create a {{<hover label="decSec" line="2">}}Secret{{</hover>}} object with
the {{<hover label="decSec" line="7">}}data{{</hover>}} containing the secret
key name, {{<hover label="decSec" line="8">}}my-gcp-secret{{</hover>}} and the
base-64 encoded token.
<!-- vale Google.FirstPerson = YES -->

```yaml {label="decSec"}
apiVersion: v1
kind: Secret
metadata:
  name: gcp-secret
  namespace: crossplane-system
type: Opaque
data:
  my-gcp-secret: eWEyOS5hMEFmQl9ieURVVEpSSWt3RDk1c1cxTGE0d3dlLS0xTHpOZkxJeFFYbnIza25VVG9jYV9xY2xsSG1ZUzVycjJwYmNzZnVuR3M5blR6SnVIb2lYb3VmRnBEbGZicGV5bTBJU1lfUmdxWGNCMTdDY3RXZWZOd2hJcVVUblJ2UVdmcHpsODVvbklzUXZaN0F5MEJjUy1ZMGxXYXJXODVJQ2Z5R0RhZEtvYUNnWUtBWXdTQVJFU0ZRSHN2WWxzUnU1Q0w4UVY0OThRc1pvbmxGVXJXQTAxNzE=
```


### Create a ProviderConfig

Create a
{{<hover label="pc-keys" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="pc-keys" line="7">}}AccessToken{{</hover>}}.

Create a {{<hover label="pc-keys" line="8">}}secretRef{{</hover>}} with the
{{<hover label="pc-keys" line="9">}}namespace{{</hover>}},
{{<hover label="pc-keys" line="10">}}name{{</hover>}} and
{{<hover label="pc-keys" line="11">}}key{{</hover>}} of the secret.

{{<hint "tip" >}}
To apply key based authentication by default name the ProviderConfig
{{<hover label="pc-keys" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc-keys"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: AccessToken
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
{{<hover label="pc-keys2" line="4">}}key-based-providerconfig{{</hover>}}.

```yaml {label="pc-keys2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: token-based-providerconfig
spec:
  credentials:
    source: AccessToken
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
```

Apply the ProviderConfig to a
managed resource with a
{{<hover label="mr-keys" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr-keys"}
apiVersion: storage.gcp.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-gcp-bucket
spec:
  forProvider:
    location: US
  providerConfigRef:
    name: token-based-providerconfig
```

## Workload identity

When running the GCP Provider in an Google managed Kubernetes cluster (`GKE`)
the Provider may use
[workload identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)
for authentication.

Workload identity allows the Provider to authenticate to GCP APIs with
permissions mapped to an IAM service account.

{{<hint "important">}}
Workload identity is only supported with Crossplane running in Google managed
Kubernetes clusters (`GKE`).
{{< /hint >}}

Configuring workload identity with the GCP Provider requires:
* a [GCP service account](https://cloud.google.com/iam/docs/service-account-overview)
* a Crossplane ControllerConfig to reference the GCP service account the Provider
  uses
* a Crossplane ProviderConfig to apply the workload identity authentication method.

### Configure the GCP service account

You may use an existing service account or follow the [GCP documentation to
create a new service account](https://cloud.google.com/iam/docs/service-accounts-create).

Apply a [GCP IAM policy binding](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding)
to associate the service account with the desired GCP IAM role.

Enable workload identity and link the GCP IAM service account to the Provider
Kubernetes service account.

This requires defining a name for the Provider's Kubernetes service account.
The {{<hover label="saBinding" line="4">}}--member{{</hover>}} in the policy
includes the Crossplane namespace and the name of the Provider's Kubernetes
service account.

{{<hint "tip" >}}
Upbound UXP uses the `upbound-system` namespace.
Crossplane uses the `crossplane-system` namespace.
{{< /hint >}}

```yaml {label="saBinding"}
gcloud iam service-accounts add-iam-policy-binding \
  <Service_Account_Email_Address> \
--role  roles/iam.workloadIdentityUser    \
--member "serviceAccount:<Project_Name>.svc.id.goog[crossplane-system/<Kubernetes_Service_Account>]" \
--project <Project_Name>
```

For example with the following settings:
* service account email `docs@upbound.iam.gserviceaccount.com`
* project name `upbound`
* namespace `crossplane-system`
* Provider Kubernetes service account `my-gcp-sa`

Creates the following command:
```console
gcloud iam service-accounts add-iam-policy-binding \
 docs@upbound.iam.gserviceaccount.com \
--role  roles/iam.workloadIdentityUser    \
--member "serviceAccount:upbound.svc.id.goog[crossplane-system/my-gcp-sa]" \
--project upbound
```

### Create a ControllerConfig

The ControllerConfig creates a custom Provider service account and applies an
annotation to the Provider's pod.

Create a {{<hover label="workloadCC" line="2">}}ControllerConfig{{</hover>}}
object. Add an {{<hover label="workloadCC" line="5">}}annotation{{</hover>}}
mapping the key
{{<hover label="workloadCC" line="6">}}iam.gke.io/gcp-service-account{{</hover>}}
to the email address of the GCP IAM service account.

Add a
{{<hover label="workloadCC" line="8">}}serviceAccountName{{</hover>}} to the
{{<hover label="workloadCC" line="7">}}spec{{</hover>}} to name the Provider's
service account. This must match the name used in the GCP IAM binding.

{{< editCode >}}
```yaml {label="workloadCC"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: $@<GCP_IAM_service_account_email>$@
spec:
  serviceAccountName: $@<Kubernetes_service_account_name>$@
```
{{< /editCode >}}

<!-- vale Google.FirstPerson = NO -->
For example, to create a
{{<hover label="wi-cc" line="2">}}ControllerConfig{{</hover>}} with the
service account
{{<hover label="wi-cc" line="6">}}docs@upbound.iam.gserviceaccount.com{{</hover>}}
and create a Provider service account named
{{<hover label="wi-cc" line="8">}}my-gcp-sa{{</hover>}}.
<!-- vale Google.FirstPerson = YES  -->

```yaml {label="wi-cc"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: docs@upbound.iam.gserviceaccount.com
spec:
  serviceAccountName: my-gcp-sa
```

### Apply the ControllerConfig

Apply the ControllerConfig to the GCP Provider with a
{{<hover label="wi-pc" line="7">}}controllerConfigRef{{</hover>}} referencing
the {{<hover label="wi-pc" line="8">}}name{{</hover>}} of the ControllerConfig.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.SubstitutionWarning = NO -->
For example, to apply a ControllerConfig named
{{<hover label="wi-pc" line="8">}}my-controller-config{{</hover>}}, reference
the ControllerConfig name in the
{{<hover label="wi-pc" line="7">}}controllerConfigRef{{</hover>}}.
<!-- vale Google.FirstPerson = YES  -->
<!-- vale gitlab.SubstitutionWarning = YES -->

{{<hint "tip" >}}
Apply the ControllerConfig to each family provider using workload identity.
{{< /hint >}}

```yaml {label="wi-pc"}
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-gcp-storage
spec:
  package: xpkg.upbound.io/upbound/provider-gcp-storage:v0.35.0
  controllerConfigRef:
    name: my-controller-config
```

### Create a ProviderConfig

Create a
{{<hover label="workloadPC" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="workloadPC" line="7">}}InjectedIdentity{{</hover>}} and add the
{{<hover label="workloadPC" line="8">}}projectID{{</hover>}} to use.

{{<hint "tip" >}}
To apply key based authentication by default name the ProviderConfig
{{<hover label="workloadPC" line="4">}}default{{</hover>}}.
{{< /hint >}}

{{< editCode >}}
```yaml {label="workloadPC"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: InjectedIdentity
  projectID: $@<Project_Name>$@
```
{{< /editCode >}}

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
{{<hover label="workloadPC2" line="4">}}workload-id-providerconfig{{</hover>}}.

```yaml {label="workloadPC2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: workload-id-providerconfig
spec:
  credentials:
    source: InjectedIdentity
  projectID: upbound
```

Apply the ProviderConfig to a
managed resource with a
{{<hover label="mr-keys2" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr-keys2"}
apiVersion: storage.gcp.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-gcp-bucket
spec:
  forProvider:
    location: US
  providerConfigRef:
    name: workload-id-providerconfig
```

## Service account impersonation

When running the GCP Provider in an Google managed Kubernetes cluster (`GKE`)
the Provider may use
[service account impersonation](https://cloud.google.com/iam/docs/service-account-overview#impersonation)
for authentication.

Account impersonation allows the Provider to authenticate to GCP APIs with
using one service account and request escalated privileges through a second
account.

{{<hint "important">}}
Service account impersonation is only supported with Crossplane running in
Google managed Kubernetes clusters (`GKE`).
{{< /hint >}}

Configuring workload identity with the GCP Provider requires:
* a lower privileged [GCP service account](https://cloud.google.com/iam/docs/service-account-overview).
* an elevated privileged [GCP service account](https://cloud.google.com/iam/docs/service-account-overview)
* a Crossplane ControllerConfig to reference the lower-privileged GCP service account.
* a Crossplane ProviderConfig to reference the elevated privileged GCP service account.

### Configure the GCP service accounts

You may use an existing service accounts or follow the [GCP documentation to
create a new service accounts](https://cloud.google.com/iam/docs/service-accounts-create).

The lower privilege role requires a
[GCP IAM policy binding](https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding)
role for the project which includes
{{<hover label="ai-iam" line="3">}}iam.serviceAccountTokenCreator{{</hover>}}.

```shell {label="ai-iam"}
gcloud projects add-iam-policy-binding <Project_Name> \
    --member "serviceAccount:<Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com" \
    --role  roles/iam.serviceAccountTokenCreator \
    --project <Project_Name>
```

For example, to create a role-binding for:
 * project `upbound`
 * account `docs-unprivileged`

```shell {label="ai-iam"}
gcloud projects add-iam-policy-binding upbound \
    --member "serviceAccount:docs-unprivileged@upbound.iam.gserviceaccount.com" \
    --role  roles/iam.serviceAccountTokenCreator \
    --project upbound
```

The lower privileged service account requires a
[GCP IAM service account policy binding](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding)
between the unprivileged account and the Kubernetes provider service account.

```shell {label="ai-sa"}
gcloud iam service-accounts add-iam-policy-binding <Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:<Project_Name>.svc.id.goog[<Crossplane_Namespace>/<Kubernetes_Service_Account_Name>]"
```

For example, to create a policy binding for:
  * project `upbound`
  * account `docs-unprivileged`
  * namespace `crossplane-system`
  * Provider service account name `gcp-provider-sa`

```shell {label="ai-sa"}
gcloud iam service-accounts add-iam-policy-binding docs-unprivileged@upbound.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:upbound.svc.id.goog[crossplane-system/gcp-provider-sa]"
```

{{<hint "tip" >}}
For more information on the account requirements for for account impersonation
read the [GCP service account impersonation
documentation](https://cloud.google.com/iam/docs/service-account-overview#impersonation)
{{< /hint >}}

### Create a ControllerConfig

The ControllerConfig creates a custom Provider service account and applies an
annotation to the Provider's pod.

Create a {{<hover label="ai-cc" line="2">}}ControllerConfig{{</hover>}}
object. Add an {{<hover label="ai-cc" line="5">}}annotation{{</hover>}}
mapping the key
{{<hover label="ai-cc" line="6">}}iam.gke.io/gcp-service-account{{</hover>}}
to the email address of the GCP IAM service account.

Add a
{{<hover label="ai-cc" line="8">}}serviceAccountName{{</hover>}} to the
{{<hover label="ai-cc" line="7">}}spec{{</hover>}} to create the Provider's
service account. This must match the name used in the GCP IAM binding.

```yaml {label="ai-cc"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: <Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com
spec:
  serviceAccountName: <Kubernetes_service_account_name>
```

For example, to use a GCP service account named
{{<hover label="ai-cc2" line="6">}}docs-unprivileged{{</hover>}} and a
service account name
{{<hover label="ai-cc2" line="8">}}gcp-provider-sa{{</hover>}}:

{{<hint "important">}}
The `{{<hover label="ai-cc2" line="8">}}serviceAccountName{{</hover>}} must match the
service account referenced in the GCP IAM policy binding.
{{< /hint >}}

```yaml {label="ai-cc2"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: docs@upbound.iam.gserviceaccount.com
spec:
  serviceAccountName: my-gcp-sa
```

### Create a ProviderConfig

Create a
{{<hover label="ai-pc" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="ai-pc" line="7">}}ImpersonateServiceAccount{{</hover>}}. Add the
{{<hover label="ai-pc" line="8">}}impersonateServiceAccount{{</hover>}} object
and provide the
{{<hover label="ai-pc" line="9">}}name{{</hover>}} of the _privileged_ account
to impersonate.
Include the
{{<hover label="ai-pc" line="10">}}projectID{{</hover>}} to use.

{{<hint "tip" >}}
To apply key based authentication by default name the ProviderConfig
{{<hover label="ai-pc" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="ai-pc"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: ImpersonateServiceAccount
    impersonateServiceAccount:
      name: <Privileged_Service_Account>}@<Project_Name>.iam.gserviceaccount.com
  projectID: <Project_Name>
```

For example to create a
{{<hover label="ai-pc2" line="2">}}ProviderConfig{{</hover>}} with:
 * service account named {{<hover label="ai-pc" line="9">}}docs-privileged{{</hover>}}
 * project named {{<hover label="ai-pc" line="10">}}upbound{{</hover>}}


```yaml {label="ai-pc2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: ImpersonateServiceAccount
    impersonateServiceAccount:
      name: docs-privileged@upbound.iam.gserviceaccount.com
  projectID: upbound
```

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
{{<hover label="workloadPC2" line="4">}}workload-id-providerconfig{{</hover>}}.

{{< editCode >}}
```yaml {label="workloadPC2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: impersonation-providerconfig
spec:
  credentials:
    source: ImpersonateServiceAccount
    impersonateServiceAccount:
      name: <Privileged_Service_Account>}@<Project_Name>.iam.gserviceaccount.com
  projectID: <Project_Name>
```
{{< /editCode >}}

Apply the ProviderConfig to a
managed resource with a
{{<hover label="mr-keys2" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr-keys2"}
apiVersion: storage.gcp.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-gcp-bucket
spec:
  forProvider:
    location: US
  providerConfigRef:
    name: impersonation-providerconfig
```