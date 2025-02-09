---
title: "Providers"
weight: 4
description: "Providers allow Upbound to provision infrastructure on an external service. They handle communication between the control plane and your external resources"
searchExclude: true
aliases:
    - core-concepts/providers
---

Providers allow Upbound to provision infrastructure on an external service.
Providers handle communication between your Upbound control plane and the
external resource, like AWS, GCP or Azure. Providers capture the external
resources they can create as an API endpoint and result in managed resources.

## Upbound Marketplace

The [Upbound Marketplace](https://marketplace.upbound.io) is the central repository for provider information.
Review your provider reference documentation here to determine what specific
resources you need to create or the provider family
group to look for.

There are three tiers of providers in the Marketplace:

{{<table>}}
| Provider Level | Description |
|---------------|-------------|
| **Upbound Official** <br> <svg width="18" height="18" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><path fill="#6553C0" d="M 10.2053 1.01289 L 12.191 2.998 L 14.9982 2.99817 C 15.5505 2.99817 15.9982 3.44589 15.9982 3.99817 L 15.998 6.806 L 17.9835 8.79107 C 18.374 9.18159 18.374 9.81476 17.9835 10.2053 L 15.998 12.19 L 15.9982 14.9982 C 15.9982 15.5505 15.5505 15.9982 14.9982 15.9982 L 12.19 15.998 L 10.2053 17.9835 C 9.81476 18.374 9.18159 18.374 8.79107 17.9835 L 6.806 15.998 L 3.99817 15.9982 C 3.44589 15.9982 2.99817 15.5505 2.99817 14.9982 L 2.998 12.191 L 1.01289 10.2053 C 0.622369 9.81476 0.622369 9.18159 1.01289 8.79107 L 2.998 6.805 L 2.99817 3.99817 C 2.99817 3.44589 3.44589 2.99817 3.99817 2.99817 L 6.805 2.998 L 8.79107 1.01289 C 9.18159 0.622369 9.81476 0.622369 10.2053 1.01289 Z M 11.9057 7.09636 L 8.62317 10.2406 L 7.09063 8.77261 C 6.95395 8.64168 6.73233 8.64168 6.59565 8.77261 L 6.10068 9.24673 C 5.964 9.37766 5.964 9.58993 6.10068 9.72085 L 8.37569 11.9 C 8.51236 12.0309 8.73396 12.0309 8.87066 11.9 L 12.8957 8.0446 C 13.0323 7.91367 13.0323 7.7014 12.8957 7.57048 L 12.4007 7.09636 C 12.264 6.96545 12.0424 6.96545 11.9057 7.09636 Z"/></svg> | These providers are developed, maintained, and fully supported by **Upbound**. They undergo testing, security audits, and follow Upbound's best practices to ensure high reliability and enterprise-grade support. |
| **Partner** <br> 🏅 | These providers are developed and maintained by **trusted partners** in collaboration with Upbound. They follow best practices and have some level of verification, but the **partner** is responsible for long-term maintenance and support. |
| **Community** <br> 🌍 | These providers are developed and maintained by the **open-source community**. They may not be officially verified by Upbound, and their maintenance and support depend on community contributors. |
{{</table>}}

### Provider families

The Marketplace segments the AWS, Azure, and GCP providers into distinct resource areas
called **provider families**. For instance, the `provider-family-aws` handles the
`ProviderConfig` for your deployments, but sub-providers like `provider-aws-s3`
manages individual S3 resources. When you install a sub-provider, the
root family provider is also installed automatically.

## Install a Provider

You can install providers into your control plane project as a dependency or you can
use Helm to deploy directly to an Upbound control plane.

### `up` CLI

In your control plane project file, you can add your providers with the `up add
dependency` command.

```shell
up add dependency xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```

In your `upbound.yaml` file, the provider information is in the
`spec.dependsOn` value:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: <projectName>
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws-s3
    version: v1.16.0
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/<userOrg>/<userProject>
```

### Control plane creation

You can manually install a provider in your control plane with a `Provider`
manifest and `kubectl apply`.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:<version>
EOF
```

## Authentication

Providers use varying methods to authenticate with their external services. AWS,
GCP, and Azure have several options for authentication.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
<!-- vale Google.Headings = NO -->
### AWS
<!-- vale Google.Headings = YES -->

For more detailed instructions or alternate authentication methods, visit the
[provider documentation](https://docs.upbound.io/providers/provider-aws/authentication/).


Using AWS access keys, or long-term IAM credentials, requires storing the AWS
keys as a Kubernetes secret.

To create the Kubernetes secret create or
[download your AWS access key](https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys)
ID and secret access key.

The format of the text file is
```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Create a Kubernetes secret
Create the Kubernetes secret with
{{<hover label="kubesecret" line="1">}}kubectl create secret generic{{</hover>}}.

<!-- vale Google.FirstPerson = NO -->
For example, name the secret
{{<hover label="kubesecret" line="2">}}aws-secret{{</hover>}} in the
{{<hover label="kubesecret" line="3">}}crossplane-system{{</hover>}} namespace
and import the text file with the credentials
{{<hover label="kubesecret" line="4">}}aws-credentials.txt{{</hover>}} and
assign them to the secret key
{{<hover label="kubesecret" line="4">}}my-aws-secret{{</hover>}}.
<!-- vale Google.FirstPerson = YES -->

```shell {label="kubesecret"}
kubectl create secret generic \
aws-secret \
-n crossplane-system \
--from-file=my-aws-secret=./aws-credentials.txt
```

To create a secret declaratively requires encoding the authentication keys as a
base-64 string.

<!-- vale Google.FirstPerson = NO -->
Create a {{<hover label="decSec" line="2">}}Secret{{</hover>}} object with
the {{<hover label="decSec" line="7">}}data{{</hover>}} containing the secret
key name, {{<hover label="decSec" line="8">}}my-aws-secret{{</hover>}} and the
base-64 encoded keys.
<!-- vale Google.FirstPerson = YES -->

```yaml {label="decSec"}
apiVersion: v1
kind: Secret
metadata:
  name: aws-secret
  namespace: crossplane-system
type: Opaque
data:
  my-aws-secret: W2RlZmF1bHRdCmF3c19hY2Nlc3Nfa2V5X2lkID0gQUtJQUlPU0ZPRE5ON0VYQU1QTEUKYXdzX3NlY3JldF9hY2Nlc3Nfa2V5ID0gd0phbHJYVXRuRkVNSS9LN01ERU5HL2JQeFJmaUNZRVhBTVBMRUtFWQ==
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
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-secret
      key: my-aws-secret
```

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
{{<hover label="pc-keys2" line="4">}}key-based-providerconfig{{</hover>}}.

```yaml {label="pc-keys2"}
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: key-based-providerconfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: aws-secret
      key: my-aws-secret
```

Apply the ProviderConfig to a
managed resource with a
{{<hover label="mr-keys" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr-keys"}
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-s3-bucket
spec:
  forProvider:
    region: us-east-2
  providerConfigRef:
    name: key-based-providerconfig
```

<!-- /AWS -->

<!-- Azure -->
### Azure


For more detailed instructions or alternate authentication methods, visit the
[provider documentation](https://docs.upbound.io/providers/provider-azure/authentication/).


A service principal is an application within the Azure Active Directory that
passes `client_id`, `client_secret`, and `tenant_id` authentication
tokens to create and manage Azure resources. As an alternative, it can also authenticate
with a `client_certificate` instead of a `client_secret`

### Create a service principal with client secret credentials using the Azure CLI tool

{{< hint "tip" >}}
If you don't have the Azure CLI, use the [install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
{{< /hint >}}

First, find the Subscription ID for your Azure account.

```shell
az account list
```

Note the value of the `id` in the return output.

Next, create a service principle `Owner` role. Update the `<subscription_id>`
with the `id` from the previous command.

```shell
az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/<subscription_id> \
  > azure.json
```

The `azure.json` file in the preceding command contains the client ID, secret, and
tenant ID of your subscription.


Next, use `kubectl` to associate your Azure credentials file with a generic
Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
```

### Configure your provider

Apply these changes to your `ProviderConfig` file.

```yaml {label="secretPC", copy-lines="5-11"}
apiVersion: azure.upbound.io/v1beta1
metadata:
  name: default
kind: ProviderConfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: upbound-system
      name: azure-secret
      key: creds
```

Your credential `source` must be `Secret` and you must specify the namespace,
name, and key if you used different values.

Apply your configuration.

<!-- /Azure -->

<!-- GCP -->
### GCP


For more detailed instructions or alternate authentication methods, visit the
[provider documentation](https://docs.upbound.io/providers/provider-gcp/authentication/).


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
<!-- /GCP -->
{{< /content-selector >}}
