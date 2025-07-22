---
title: Authentication
sidebar_position: 1
description: Authentication options with the Upbound GCP official provider
---


The Upbound Official GCP Provider supports multiple authentication methods.

* [Upbound auth (OIDC)][upbound-auth-oidc]
* [Service account keys][service-account-keys]
* [OAuth 2.0 access token][oauth-2-0-access-token]
* [Workload identity][workload-identity]
  for Google managed Kubernetes clusters (`GKE`)
* [Service account impersonation][service-account-impersonation]

## Upbound auth (OIDC)

:::note
This method of authentication is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces]
:::

When your control plane runs in an Upbound Cloud Space, you can use this authentication method. Upbound authentication uses OpenID Connect (OIDC) to authenticate to GCP without requiring you to store credentials in Upbound.

### Create an identity pool

1. Open the **[GCP IAM Admin console][gcp-iam-admin-console]**.
2. Select **[Workload Identity Federation][workload-identity-federation]**.
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
To authenticate any control plane in your organization, in the _Conditional CEL_ input box put
<!--- TODO(tr0njavolta): editcode --->
<!--- TODO(tr0njavolta): links --->
```console
google.subject.contains("mcp:ORGANIZATION_NAME")
```

:::warning
Not providing a CEL condition allows any control plane to access your GCP account if they know the project ID and service account name.
:::
<!-- vale gitlab.Uppercase = YES -->

Select **Save**.

### Create a GCP Service Account

GCP requires Upbound to use a [Service Account][service-account]. The required GCP _roles_ of the service account depend on the services managed by your control plane.

1. Open the **[GCP IAM Admin console][gcp-iam-admin-console-1]**.
2. Select **[Service Accounts][service-accounts]**.
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
Upbound requires this to authenticate your control plane.

### Add the service account to the identity pool

Add the service account to the Workload Identity Federation pool to authenticate to Upbound with OIDC.
1. Return to the **[Workload Identity Federation][workload-identity-federation-2]** page and select the [**upbound-oidc-pool**][upbound-oidc-pool].
2. Near the top of the page select **Grant Access**.
3. Select the new service account, **upbound-service-account**.
4. Under _Select principals_ use **All identities in the pool**.
Select **Save**.
In the _Configure your application_ window, select **Dismiss**.

### Create a ProviderConfig

Create a
<Hover label="pc-upbound-auth" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="pc-upbound-auth" line="8">Upbound</Hover>.

Supply the <Hover label="pc-upbound-auth" line="6">projectID</Hover>, <Hover label="pc-upbound-auth" line="11">providerID</Hover>, and <Hover label="pc-upbound-auth" line="12">serviceAccount</Hover> found in the previous section.

:::tip
To apply Upbound based authentication by default name the ProviderConfig
<Hover label="pc-upbound-auth" line="4">default</Hover>.
:::
<div id="pc-upbound-auth">

```yaml
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
</div>
## Service account keys

Using GCP service account keys requires storing the GCP account keys JSON file
as a Kubernetes secret.

To create the Kubernetes secret create or
[download your GCP service account key][download-your-gcp-service-account-key]
JSON file.


### Create a Kubernetes secret
Create the Kubernetes secret with
<Hover label="kubesecret" line="1">}kubectl create secret generic</Hover>}.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.Substitutions = NO -->
For example, name the secret
<Hover label="kubesecret" line="2">}gcp-secret</Hover>} in the
<Hover label="kubesecret" line="3">}crossplane-system</Hover>} namespace
and import the text file with the credentials
<Hover label="kubesecret" line="4">}gcp-credentials.json</Hover> and
assign them to the secret key
<Hover label="kubesecret" line="4">my-gcp-secret</Hover>.
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
Create a <Hover label="decSec" line="2">Secret</Hover> object with
the <Hover label="decSec" line="7">data</Hover> containing the secret
key name, <Hover label="decSec" line="8">my-gcp-secret</Hover> and the
base-64 encoded keys.
<!-- vale Google.FirstPerson = YES -->

<div id="decSec">
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gcp-secret
  namespace: crossplane-system
type: Opaque
data:
  my-gcp-secret: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZG9jcyIsCiAgInByaXZhdGVfa2V5X2lkIjogIjEyMzRhYmNkIiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJkb2NzQHVwYm91bmQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTIzNDUiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2RvY3MuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0=
```
</div>

### Create a ProviderConfig

Create a <Hover label="pc-keys" line="2">ProviderConfig</Hover> to set the
provider authentication method to<Hover label="pc-keys" line="7">Secret</Hover>.


Create a <Hover label="pc-keys" line="8">secretRef</Hover> with the
<Hover label="pc-keys" line="9">namespace</Hover>,
<Hover label="pc-keys" line="10">name</Hover> and
<Hover label="pc-keys" line="11">key</Hover> of the secret.

:::tip
To apply key based authentication by default name the ProviderConfig
<Hover label="pc-keys" line="4">default</Hover>.
:::

<div id="pc-keys">
```yaml 
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
</div>

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="pc-keys2" line="4">key-based-providerconfig</Hover>.
<div id = "pc-keys2">
```yaml 
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
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr-keys" line="8">providerConfigRef</Hover>.

<div id="mr-keys">

```yaml
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
</div>
## OAuth access tokens

Using GCP access tokens requires storing the GCP account keys JSON file
as a Kubernetes secret.

Create a GCP access [token for a service account][token-for-a-service-account]
or with the [`gcloud` CLI][gcloud-cli].

:::warning
GCP access tokens are valid for 1 hour by default. When the token expires
Crossplane can't create or delete resources.

The [provider-gcp GitHub repository][provider-gcp-github-repository] contains an example cron job that
automatically refreshes access tokens.
:::

### Create a Kubernetes secret
Create the Kubernetes secret with
<Hover label="kubesecret" line="1">kubectl create secret generic</Hover>.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.Substitutions = NO -->
For example, name the secret
<Hover label="kubesecret" line="2">gcp-secret</Hover> in the
<Hover label="kubesecret" line="3">crossplane-system</Hover> namespace
and import the text file with the credentials
<Hover label="kubesecret" line="4">gcp-token.json</Hover> and
assign them to the secret key
<Hover label="kubesecret" line="4">my-gcp-secret</Hover>.
<!-- vale Google.FirstPerson = YES -->
<!-- vale gitlab.Substitutions = YES -->

<div id = "kubesecret">
```shell 
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-token.json
```
</div>

To create a secret declaratively requires encoding the access token as a
base-64 string.

<!-- vale Google.FirstPerson = NO -->
Create a <Hover label="decSec" line="2">Secret</Hover> object with
the <Hover label="decSec" line="7">data</Hover> containing the secret
key name, <Hover label="decSec" line="8">my-gcp-secret</Hover> and the
base-64 encoded token.
<!-- vale Google.FirstPerson = YES -->

<div id = "decSec">
```yaml 
apiVersion: v1
kind: Secret
metadata:
  name: gcp-secret
  namespace: crossplane-system
type: Opaque
data:
  my-gcp-secret: eWEyOS5hMEFmQl9ieURVVEpSSWt3RDk1c1cxTGE0d3dlLS0xTHpOZkxJeFFYbnIza25VVG9jYV9xY2xsSG1ZUzVycjJwYmNzZnVuR3M5blR6SnVIb2lYb3VmRnBEbGZicGV5bTBJU1lfUmdxWGNCMTdDY3RXZWZOd2hJcVVUblJ2UVdmcHpsODVvbklzUXZaN0F5MEJjUy1ZMGxXYXJXODVJQ2Z5R0RhZEtvYUNnWUtBWXdTQVJFU0ZRSHN2WWxzUnU1Q0w4UVY0OThRc1pvbmxGVXJXQTAxNzE=
```
</div>

### Create a ProviderConfig

Create a
<Hover label="pc-keys" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="pc-keys" line="7">AccessToken</Hover>.

Create a <Hover label="pc-keys" line="8">secretRef</Hover> with the
<Hover label="pc-keys" line="9">namespace</Hover>,
<Hover label="pc-keys" line="10">name</Hover> and
<Hover label="pc-keys" line="11">key</Hover> of the secret.

:::tip
To apply key based authentication by default name the ProviderConfig
<Hover label="pc-keys" line="4">default</Hover>.
:::

<div id = "pc-keys">
```yaml 
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
</div>

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="pc-keys2" line="4">key-based-providerconfig</Hover>.

<div id = "pc-keys2">
```yaml 
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
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr-keys" line="8">providerConfigRef</Hover>.

<div id = "mr-keys">
```yaml 
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
</div>

## Workload identity

When running the GCP Provider in an Google managed Kubernetes cluster (`GKE`)
the Provider may use
[workload identity][workload-identity-3]
for authentication.

Workload identity allows the Provider to authenticate to GCP APIs with
permissions mapped to an IAM service account.

:::tip
Workload identity is only supported with Crossplane running in Google managed
Kubernetes clusters (`GKE`).
:::

Configuring workload identity with the GCP Provider requires:
* a [GCP service account][gcp-service-account]
* a Crossplane ControllerConfig to reference the GCP service account the Provider
  uses
* a Crossplane ProviderConfig to apply the workload identity authentication method.

### Configure the GCP service account

You may use an existing service account or follow the [GCP documentation to
create a new service account][gcp-documentation-to-create-a-new-service-account].

Apply a [GCP IAM policy binding][gcp-iam-policy-binding]
to associate the service account with the desired GCP IAM role.

Enable workload identity and link the GCP IAM service account to the Provider
Kubernetes service account.

This requires defining a name for the Provider's Kubernetes service account.
The <Hover label="saBinding" line="4">--member</Hover> in the policy
includes the Crossplane namespace and the name of the Provider's Kubernetes
service account.

:::tip
Upbound UXP uses the `upbound-system` namespace.
Crossplane uses the `crossplane-system` namespace.
:::

<div id = "saBinding">
```yaml 
gcloud iam service-accounts add-iam-policy-binding \
  <Service_Account_Email_Address> \
--role  roles/iam.workloadIdentityUser    \
--member "serviceAccount:<Project_Name>.svc.id.goog[crossplane-system/<Kubernetes_Service_Account>]" \
--project <Project_Name>
```
</div>

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

Create a <Hover label="workloadCC" line="2">ControllerConfig</Hover>
object. Add an <Hover label="workloadCC" line="5">annotation</Hover>
mapping the key
<Hover label="workloadCC" line="6">iam.gke.io/gcp-service-account</Hover>
to the email address of the GCP IAM service account.

Add a
<Hover label="workloadCC" line="8">serviceAccountName</Hover> to the
<Hover label="workloadCC" line="7">spec</Hover> to name the Provider's
service account. This must match the name used in the GCP IAM binding.

<div id = "workloadCC">
```yaml 
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: <GCP_IAM_service_account_email>
spec:
  serviceAccountName: <Kubernetes_service_account_name>
```
</div>

<!-- vale Google.FirstPerson = NO -->
For example, to create a
<Hover label="wi-cc" line="2">ControllerConfig</Hover> with the
service account
<Hover label="wi-cc" line="6">docs@upbound.iam.gserviceaccount.com</Hover>
and create a Provider service account named
<Hover label="wi-cc" line="8">my-gcp-sa</Hover>.
<!-- vale Google.FirstPerson = YES  -->

<div id = "wi-cc">
```yaml 
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: docs@upbound.iam.gserviceaccount.com
spec:
  serviceAccountName: my-gcp-sa
```
</div>

### Apply the ControllerConfig

Apply the ControllerConfig to the GCP Provider with a
<Hover label="wi-pc" line="7">controllerConfigRef</Hover> referencing
the <Hover label="wi-pc" line="8">name</Hover> of the ControllerConfig.

<!-- vale Google.FirstPerson = NO -->
<!-- vale gitlab.SubstitutionWarning = NO -->
For example, to apply a ControllerConfig named
<Hover label="wi-pc" line="8">my-controller-config</Hover>, reference
the ControllerConfig name in the
<Hover label="wi-pc" line="7">controllerConfigRef</Hover>.
<!-- vale Google.FirstPerson = YES  -->
<!-- vale gitlab.SubstitutionWarning = YES -->

:::tip
Apply the ControllerConfig to each family provider using workload identity.
:::

<div id = "wi-pc">
```yaml 
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-gcp-storage
spec:
  package: xpkg.upbound.io/upbound/provider-gcp-storage:v0.35.0
  controllerConfigRef:
    name: my-controller-config
```
</div>

### Create a ProviderConfig

Create a
<Hover label="workloadPC" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="workloadPC" line="7">InjectedIdentity</Hover> and add the
<Hover label="workloadPC" line="8">projectID</Hover> to use.

:::tip
To apply key based authentication by default name the ProviderConfig
<Hover label="workloadPC" line="4">default</Hover>.
:::

<div id = "workloadPC">
```yaml
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: InjectedIdentity
  projectID: <Project_Name>
```
</div>

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="workloadPC2" line="4">workload-id-providerconfig</Hover>.

<div id = "workloadPC2">
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
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr-keys2" line="8">providerConfigRef</Hover>.

<div id = "mr-keys2">
```yaml 
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
</div>

## Service account impersonation

When running the GCP Provider in an Google managed Kubernetes cluster (`GKE`)
the Provider may use
[service account impersonation][service-account-impersonation-4]
for authentication.

Account impersonation allows the Provider to authenticate to GCP APIs with
using one service account and request escalated privileges through a second
account.

:::important
Service account impersonation is only supported with Crossplane running in
Google managed Kubernetes clusters (`GKE`).
:::

Configuring workload identity with the GCP Provider requires:
* a lower privileged [GCP service account][gcp-service-account-5].
* an elevated privileged [GCP service account][gcp-service-account-6]
* a Crossplane ControllerConfig to reference the lower-privileged GCP service account.
* a Crossplane ProviderConfig to reference the elevated privileged GCP service account.

### Configure the GCP service accounts

You may use an existing service accounts or follow the [GCP documentation to
create a new service accounts][gcp-documentation-to-create-a-new-service-accounts].

The lower privilege role requires a
[GCP IAM policy binding][gcp-iam-policy-binding-7]
role for the project which includes
<Hover label="ai-iam" line="3">iam.serviceAccountTokenCreator</Hover>.

<div id = "ai-iam">
```shell 
gcloud projects add-iam-policy-binding <Project_Name> \
    --member "serviceAccount:<Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com" \
    --role  roles/iam.serviceAccountTokenCreator \
    --project <Project_Name>
```
</div>

For example, to create a role-binding for:
 * project `upbound`
 * account `docs-unprivileged`

<div id = "ai-iam">
```shell 
gcloud projects add-iam-policy-binding upbound \
    --member "serviceAccount:docs-unprivileged@upbound.iam.gserviceaccount.com" \
    --role  roles/iam.serviceAccountTokenCreator \
    --project upbound
```
</div>

The lower privileged service account requires a
[GCP IAM service account policy binding][gcp-iam-service-account-policy-binding]
between the unprivileged account and the Kubernetes provider service account.


<div id = "ai-sa">
```shell 
gcloud iam service-accounts add-iam-policy-binding <Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:<Project_Name>.svc.id.goog[<Crossplane_Namespace>/<Kubernetes_Service_Account_Name>]"
```
</div>

For example, to create a policy binding for:
  * project `upbound`
  * account `docs-unprivileged`
  * namespace `crossplane-system`
  * Provider service account name `gcp-provider-sa`

<div id = "ai-sa">
```shell
gcloud iam service-accounts add-iam-policy-binding docs-unprivileged@upbound.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:upbound.svc.id.goog[crossplane-system/gcp-provider-sa]"
```
</div>

:::tip
For more information on the account requirements for account impersonation
read the [GCP service account impersonation
documentation][gcp-service-account-impersonation-documentation]
:::

### Create a ControllerConfig

The ControllerConfig creates a custom Provider service account and applies an
annotation to the Provider's pod.

Create a <Hover label="ai-cc" line="2">ControllerConfig</Hover>
object. Add an <Hover label="ai-cc" line="5">annotation</Hover>
mapping the key
<Hover label="ai-cc" line="6">iam.gke.io/gcp-service-account</Hover>
to the email address of the GCP IAM service account.

Add a
<Hover label="ai-cc" line="8">serviceAccountName</Hover> to the
<Hover label="ai-cc" line="7">spec</Hover> to create the Provider's
service account. This must match the name used in the GCP IAM binding.

<div id = "ai-cc">
```yaml 
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: <Lower_Privilege_Service_Account>@<Project_Name>.iam.gserviceaccount.com
spec:
  serviceAccountName: <Kubernetes_service_account_name>
```
</div>

For example, to use a GCP service account named
<Hover label="ai-cc2" line="6">docs-unprivileged</Hover> and a
service account name
<Hover label="ai-cc2" line="8">gcp-provider-sa</Hover>:

:::important
The <Hover label="ai-cc2" line="8">`serviceAccountName`</Hover> must match the
service account referenced in the GCP IAM policy binding.
:::

<div id = "ai-cc2">
```yaml 
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: my-controller-config
  annotations:
    iam.gke.io/gcp-service-account: docs@upbound.iam.gserviceaccount.com
spec:
  serviceAccountName: my-gcp-sa
```
</div>

### Create a ProviderConfig

Create a
<Hover label="ai-pc" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="ai-pc" line="7">ImpersonateServiceAccount</Hover>. Add the
<Hover label="ai-pc" line="8">impersonateServiceAccount</Hover> object
and provide the
<Hover label="ai-pc" line="9">name</Hover> of the _privileged_ account
to impersonate.
Include the
<Hover label="ai-pc" line="10">projectID</Hover> to use.

:::tip
To apply key based authentication by default name the ProviderConfig
<Hover label="ai-pc" line="4">default</Hover>.
:::

<div id = "ai-pc">
```yaml 
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
</div>

For example to create a
<Hover label="ai-pc2" line="2">ProviderConfig</Hover> with:
 * service account named <Hover label="ai-pc" line="9">docs-privileged</Hover>
 * project named <Hover label="ai-pc" line="10">upbound</Hover>

<div id = "ai-pc2">
```yaml 
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
</div>

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="workloadPC2" line="4">workload-id-providerconfig</Hover>.

<div id = "workloadPC2">
```yaml 
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
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr-keys2" line="8">providerConfigRef</Hover>.

<div id = "mr-keys2">
```yaml 
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
</div>

<!--- TODO(tr0njavolta): fix redirect --->
[upbound-auth-oidc]: /connect/oidc
[upbound-cloud-spaces]: /deploy


[service-account-keys]: https://cloud.google.com/iam/docs/keys-create-delete
[oauth-2-0-access-token]: https://developers.google.com/identity/protocols/oauth2
[workload-identity]: https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity
[service-account-impersonation]: https://cloud.google.com/iam/docs/service-account-overview#impersonation
[gcp-iam-admin-console]: https://console.cloud.google.com/iam-admin/iam
[workload-identity-federation]: https://console.cloud.google.com/iam-admin/workload-identity-pools
[service-account]: https://cloud.google.com/iam/docs/service-account-overview
[gcp-iam-admin-console-1]: https://console.cloud.google.com/iam-admin/iam
[service-accounts]: https://console.cloud.google.com/iam-admin/serviceaccounts
[workload-identity-federation-2]: https://console.cloud.google.com/iam-admin/workload-identity-pools
[upbound-oidc-pool]: https://console.cloud.google.com/iam-admin/workload-identity-pools/pool/upbound-oidc-pool
[download-your-gcp-service-account-key]: https://cloud.google.com/iam/docs/keys-create-delete#creating
[token-for-a-service-account]: https://developers.google.com/identity/protocols/oauth2#serviceaccount
[gcloud-cli]: https://cloud.google.com/sdk/gcloud/reference/auth/print-access-token
[provider-gcp-github-repository]: https://github.com/upbound/provider-gcp/blob/main/docs/Configuration.md#3-create-resources-to-generate-an-access-token
[workload-identity-3]: https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity
[gcp-service-account]: https://cloud.google.com/iam/docs/service-account-overview
[gcp-documentation-to-create-a-new-service-account]: https://cloud.google.com/iam/docs/service-accounts-create
[gcp-iam-policy-binding]: https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding
[service-account-impersonation-4]: https://cloud.google.com/iam/docs/service-account-overview#impersonation
[gcp-service-account-5]: https://cloud.google.com/iam/docs/service-account-overview
[gcp-service-account-6]: https://cloud.google.com/iam/docs/service-account-overview
[gcp-documentation-to-create-a-new-service-accounts]: https://cloud.google.com/iam/docs/service-accounts-create
[gcp-iam-policy-binding-7]: https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding
[gcp-iam-service-account-policy-binding]: https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding
[gcp-service-account-impersonation-documentation]: https://cloud.google.com/iam/docs/service-account-overview#impersonation
