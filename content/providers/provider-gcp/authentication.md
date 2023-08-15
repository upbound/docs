---
title: Authentication 
weight: 10
description: Authentication options with the Upbound AWS official provider
---

The Upbound Official GCP Provider supports multiple authentication methods.

* [Service account keys](https://cloud.google.com/iam/docs/keys-create-delete)
* [OAuth 2.0 access token](https://developers.google.com/identity/protocols/oauth2) 
* [Workload identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity_) 
  for Google managed Kubernetes clusters (`GKE`). 

ImpersonateServiceAccount;;Environment;Filesystem

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

InjectedIdentity

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

{{< editCode >}}
```yaml {label="saBinding"}
gcloud iam service-accounts add-iam-policy-binding \
$@<Service_Account_Email_Address>$@ \
--role  roles/iam.workloadIdentityUser    \
--member "serviceAccount:$@<Project_Name>.svc.id.goog[crossplane-system/<Kubernetes_Service_Account>$@]" \
--project $@<GCP_Project>$@
```
{{< /editCode >}}

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
EKS annotation to the Provider's pod. 

Create a {{<hover label="workloadCC" line="2">}}ControllerConfig{{</hover>}}
object. Add an {{<hover label="workloadCC" line="5">}}annotation{{</hover>}}
mapping the key 
{{<hover label="workloadCC" line="6">}}iam.gke.io/gcp-service-account{{</hover>}} 
to the email address of the GCP IAM service account. 

Add a
{{<hover label="workloadCC" line="8">}}serviceAccountName{{</hover>}} to the 
{{<hover label="workloadCC" line="7">}}spec{{</hover>}} to create the Provider's
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

For example, to use the settings applied in the IAM binding example the
ControllerConfig would be:

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
  projectID: $@upbound$@
```
{{< /editCode >}}

To selectively apply key based authentication name the ProviderConfig and apply 
it when creating managed resources.

For example, creating an ProviderConfig named 
{{<hover label="workloadPC2" line="4">}}workload-id-providerconfig{{</hover>}}.

{{< editCode >}}
```yaml {label="workloadPC2"}
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: workload-id-providerconfig
spec:
  credentials:
    source: InjectedIdentity
  projectID: $@upbound$@
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
    name: workload-id-providerconfig
```