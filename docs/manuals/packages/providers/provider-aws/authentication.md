---
title: Authentication
sidebar_position: 1
description: Authentication options with the Upbound AWS official provider
---

The Upbound Official AWS Provider supports multiple authentication methods.

* [Upbound auth (OIDC)][upbound-auth-oidc]
* [AWS Access keys][aws-access-keys]
* [Assume role with web identity][assume-role-with-web-identity]
* [IAM roles for service accounts][iam-roles-for-service-accounts] with AWS managed Kubernetes.

## Upbound auth (OIDC)
:::note
This method of authentication is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces]
:::

When your control plane runs in an Upbound Cloud Space, you can use this authentication method. Upbound authentication uses OpenID Connect (OIDC) to authenticate to AWS without requiring you to store credentials in Upbound.

### Add Upbound as an OpenID Connect provider

1. Open the **[AWS IAM console][aws-iam-console]**.
2. Under the AWS IAM services, select **[Identity Providers > Add Provider][identity-providers-add-provider]**.
3. Select **OpenID Connect** and use
 **https://proidc.upbound.io** as the Provider URL and
 **sts.amazonaws.com** as the Audience.
  Select **Get thumbprint**.
  Select **Add provider**.

<!-- vale Google.Headings = NO -->
### Create an AWS IAM Role for Upbound
<!-- vale Google.Headings = YES -->

1. Create an [AWS IAM Role][aws-iam-role] with a **Custom trust policy** for the OIDC connector.
:::tip
Provide your [AWS account ID][aws-account-id], Upbound organization and control plane names in the JSON Policy below.

You can find your AWS account ID by selecting the account dropdown in the upper right corner of the AWS console.
:::
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": {
				"Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/proidc.upbound.io"
			},
			"Action": "sts:AssumeRoleWithWebIdentity",
			"Condition": {
				"StringEquals": {
					"proidc.upbound.io:sub": "mcp:ORG_NAME/CONTROL_PLANE_NAME:provider:provider-aws",
					"proidc.upbound.io:aud": "sts.amazonaws.com"
				}
			}
		}
	]
}
```
1. Attach the permission policies you want for the control plane assuming this role.
2. Name and create the role.
3. View the new role and copy the role ARN.

### Create a ProviderConfig

Create a
<Hover label="pc-upbound-auth" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="pc-upbound-auth" line="7">Upbound</Hover>.

Supply the <Hover label="pc-upbound-auth" line="10">role ARN</Hover> created in the previous section.
:::tip
To apply Upbound based authentication by default name the ProviderConfig
<Hover label="pc-upbound-auth" line="4">default</Hover>.
:::

<div id="pc-upbound-auth">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Upbound
    upbound:
      webIdentity:
        roleARN: <roleARN-for-provider-identity>
```
</div>

<!-- vale Google.Headings = NO -->
## AWS authentication keys
<!-- vale Google.Headings = YES -->

Using AWS access keys, or long-term IAM credentials, requires storing the AWS
keys as a Kubernetes secret.

To create the Kubernetes secret create or
[download your AWS access key][download-your-aws-access-key]
ID and secret access key.

The format of the text file is
```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

<details>

<summary>Authentication keys with SSO</summary>


To generate authentication keys for SSO login, access your
organization's AWS SSO portal.

Select "Command line or programmatic access"

![AWS SSO screen highlighting the option command line or programmatic access](/img/aws-sso-screen.png)

Expand "Option 2" and copy the provided AWS credentials.

![AWS screen showing Option 2 credentials](/img/aws-auth-option2.png)

Use this as the contents of the `aws-credentials.txt` file.

Below is an example `aws-credentials.txt` file with SSO authentication.
```ini
[622346257358_AdministratorAccess]
aws_access_key_id=ASIAZBZV2IPHFUYQ2TFX
aws_secret_access_key=PPF/Wu9vTja98L5t/YNycbzEMw++aMt+jUZOpvtJ
aws_session_token=ArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zXArrGMPb4X3zjshBuQHLa79fyNZ8tDHpi9ogiA8DX6HkKLJxMA6LXcUyMGN6MUe3tYuhRKwdCTkfwt6qCVMT8Ctab//3jMmrV9zX
```

:::tip
These credentials are only valid as long as your SSO session. When the
credentials expire Crossplane can't monitor or change AWS resources.
:::

</details>

### Create a Kubernetes secret

Create the Kubernetes secret with
<Hover label="kubesecret" line="1">kubectl create secret generic</Hover>.

<!-- vale Google.FirstPerson = NO -->
For example, name the secret
<Hover label="kubesecret" line="2">aws-secret</Hover> in the
<Hover label="kubesecret" line="3">crossplane-system</Hover> namespace
and import the text file with the credentials
<Hover label="kubesecret" line="4">aws-credentials.txt</Hover> and
assign them to the secret key
<Hover label="kubesecret" line="4">my-aws-secret</Hover>.
<!-- vale Google.FirstPerson = YES -->

<div id="kubesecret">
```shell
kubectl create secret generic \
aws-secret \
-n crossplane-system \
--from-file=my-aws-secret=./aws-credentials.txt
```
</div>

To create a secret declaratively requires encoding the authentication keys as a
base-64 string.

<!-- vale Google.FirstPerson = NO -->
Create a <Hover label="decSec" line="2">Secret</Hover> object with
the <Hover label="decSec" line="7">data</Hover> containing the secret
key name, <Hover label="decSec" line="8">my-aws-secret</Hover> and the
base-64 encoded keys.
<!-- vale Google.FirstPerson = YES -->

<div id="decSec">
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: aws-secret
  namespace: crossplane-system
type: Opaque
data:
  my-aws-secret: W2RlZmF1bHRdCmF3c19hY2Nlc3Nfa2V5X2lkID0gQUtJQUlPU0ZPRE5ON0VYQU1QTEUKYXdzX3NlY3JldF9hY2Nlc3Nfa2V5ID0gd0phbHJYVXRuRkVNSS9LN01ERU5HL2JQeFJmaUNZRVhBTVBMRUtFWQ==
```
</div>


### Create a ProviderConfig

Create a
<Hover label="pc-keys" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="pc-keys" line="7">Secret</Hover>.

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
</div>

To selectively apply key based authentication name the ProviderConfig and apply
it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="pc-keys2" line="4">key-based-providerconfig</Hover>.

<div id="pc-keys2">
```yaml
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
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr-keys" line="8">providerConfigRef</Hover>.

<div id="mr-keys">
```yaml
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
</div>

### Role chaining

To use
[AWS IAM role chaining][aws-iam-role-chaining]
add a
<Hover label="keychains" line="12">assumeRoleChain</Hover> object to the
<Hover label="keychains" line="2">ProviderConfig</Hover>.

Inside the <Hover label="keychains" line="12">assumeRoleChain</Hover>
list one or more roles to assume, in order.

<div id="keychains">
```yaml
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
  assumeRoleChain:
    - roleARN: "arn:aws:iam::111122223333:role/my-custom-role"
```
</div>

<!-- vale off -->
## WebIdentity
<!-- vale on -->
When running the AWS Provider in an Amazon managed Kubernetes cluster (`EKS`)
the Provider may use
[AssumeRoleWithWebIdentity][assumerolewithwebidentity]
for authentication.

WebIdentity uses an OpenID Connect ID token to authenticate and use a specific
AWS IAM role.

:::tip
WebIdentity is only supported with Crossplane running in Amazon managed
Kubernetes clusters (`EKS`).
:::

Configuring WebIdentity with the AWS Provider requires:
* an AWS
[IAM OIDC Provider][iam-oidc-provider]
* an AWS IAM Role with an editable [trust policy][trust-policy]
* a ProviderConfig to enable WebIdentity authentication

### Create an IAM OIDC provider

WebIdentity relies on the EKS cluster OIDC provider.

Follow the [AWS instructions][aws-instructions]
to create an _IAM OIDC provider_ with your _EKS OIDC provider URL_.

### Edit the IAM role

Supporting WebIdentity requires matching the EKS OIDC information to the
specific role through a role trust policy.

:::tip
Read the [AWS trust policies blog][aws-trust-policies-blog]
for more information on trust policies.
:::

The trust policy references the OIDC provider ARN and the provider AWS service
account.

In the policy <Hover label="trust" line="6">Principal</Hover> enter
<Hover label="trust" line="7">"Federated": "&lt;OIDC_PROVIDER_ARN&gt;"</Hover>.

Add a <Hover label="trust" line="10">Condition</Hover> to restrict
access to the role to only the Provider's service account.

The <Hover label="trust" line="10">Condition</Hover> uses
<Hover label="trust" line="11">StringLike</Hover> to generically match
the Provider's service account.


<details>

<summary>Why use a generic match?</summary>

The token used for authentication includes the full name of the AWS Provider's
Kubernetes service account.

The Provider's service account name ends in a hash. If the hash changes the
<Hover label="trust" line="10">Condition</Hover> doesn't match.

</details>

Enter the string (with quotation marks)
<Hover label="trust" line="11">""&lt;OIDC_PROVIDER_ARN&gt;:sub": "system:serviceaccount:upbound-system:provider-aws-*"</Hover>.

:::tip
Be sure to include `:sub` after the OIDC provider ARN.

The `system:serviceaccount:` matches the namespace where the Provider pod runs.

By default UXP uses `upbound-system` and Crossplane uses `crossplane-system`.
:::

The following is a full example trust policy.
<div id="trust">
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::111122223333:oidc-provider/oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringLike": {
                    "oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5:sub": "system:serviceaccount:crossplane-system:provider-aws-*"
                }
            }
        }
    ]
}
```
</div>

### Create a ProviderConfig

Create a
<Hover label="web" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="web" line="7">WebIdentity</Hover>.

:::tip
To apply WebIdentity authentication by default name the ProviderConfig
<Hover label="web" line="4">default</Hover>.
:::

Apply the ARN of the role with the OIDC trust relationship as the
<Hover label="web" line="9">roleARN</Hover> field.

<div id="web">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: WebIdentity
    webIdentity:
      roleARN: "arn:aws:iam::111122223333:role/my-custom-role"
```
</div>

To selectively apply WebIdentity authentication name the ProviderConfig and
apply it when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="pc2" line="4">webid-providerconfig</Hover>.

<div id="pc2">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: webid-providerconfig
spec:
  credentials:
    source: WebIdentity
    webIdentity:
      roleARN: "arn:aws:iam::111122223333:role/my-custom-role"
```
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr" line="8">providerConfigRef</Hover>.

<div id="mr">
```yaml
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-s3-bucket
spec:
  forProvider:
    region: us-east-2
  providerConfigRef:
    name: webid-providerconfig
```
</div>

### Role chaining

To use
[AWS IAM role chaining][aws-iam-role-chaining-1]
add a
<Hover label="idchains" line="10">assumeRoleChain</Hover> object to the
<Hover label="idchains" line="2">ProviderConfig</Hover>.

Inside the <Hover label="idchains" line="11">assumeRoleChain</Hover>
list one or more roles to assume, in order.

<div id="idchains">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: webid-providerconfig
spec:
  credentials:
    source: WebIdentity
    webIdentity:
      roleARN: "arn:aws:iam::111122223333:role/my-custom-role"
  assumeRoleChain:
    - roleARN: "arn:aws:iam::111122223333:role/my-assumed-role"
```
</div>

## IAM roles for service accounts

When running the AWS Provider in an Amazon managed Kubernetes cluster (`EKS`)
the Provider may use
[AWS IAM roles for service accounts][aws-iam-roles-for-service-accounts]
(`IRSA`) for authentication.

IRSA works by using an annotation on a Kubernetes ServiceAccount used by a Pod
requesting AWS resources. The annotation matches an AWS IAM Role ARN configured
with the desired permissions.

Configuring IRSA with the AWS Provider requires:
* an AWS
[IAM OIDC Provider][iam-oidc-provider-2]
* an AWS IAM Role with an editable [trust policy][trust-policy-3]
* a DeploymentRuntimeConfig to add an annotation on the AWS Provider service account
* a ProviderConfig to enable IRSA authentication

### Create an IAM OIDC provider

IRSA relies on the EKS cluster OIDC provider.

Follow the [AWS instructions][aws-instructions-4]
to create an _IAM OIDC provider_ with your _EKS OIDC provider URL_.

### Edit the IAM role

Supporting IRSA requires matching the EKS OIDC information to the specific role
through a role trust policy.

:::tip
Read the [AWS trust policies blog][aws-trust-policies-blog-5]
for more information on trust policies.
:::

The trust policy references the OIDC provider ARN and the provider AWS service
account.

In the policy <Hover label="trust" line="6">Principal</Hover> enter
<Hover label="trust" line="7">"Federated": "&lt;OIDC_PROVIDER_ARN&gt;"</Hover>.

Add a <Hover label="trust" line="10">Condition</Hover> to restrict
access to the role to only the Provider's service account.

The <Hover label="trust" line="10">Condition</Hover> uses
<Hover label="trust" line="11">StringLike</Hover> to generically match
the Provider's service account.

<details>

<summary>Why use a generic match?</summary>

The token used for authentication includes the full name of the AWS Provider's
Kubernetes service account.

The Provider's service account name ends in a hash. If the hash changes the
<Hover label="trust" line="10">Condition</Hover> doesn't match.

</details>

Enter the string (with quotation marks)
<Hover label="trust" line="11">""&lt;OIDC_PROVIDER_ARN&gt;:sub": "system:serviceaccount:upbound-system:provider-aws-*"</Hover>.

:::tip
Be sure to include `:sub` after the OIDC provider ARN.

The `system:serviceaccount:` matches the namespace where the Provider pod runs.

By default UXP uses `upbound-system` and Crossplane uses `crossplane-system`.
:::

The following is a full example trust policy.
<div id="trust">
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::622346257358:oidc-provider/oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringLike": {
                    "oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5:sub": "system:serviceaccount:crossplane-system:provider-aws-*"
                }
            }
        }
    ]
}
```
</div>

### Create a DeploymentRuntimeConfig

IRSA relies on an annotation on the service account attached to a pod to
identify the IAM role to use.

Crossplane uses a DeploymentRuntimeConfig to apply settings to the provider, including
the provider service account.

Create a <Hover label="cc" line="2">DeploymentRuntimeConfig</Hover> object to
apply a custom annotation to the provider service account.

In the <Hover label="cc" line="3">metadata</Hover> create an
<Hover label="cc" line="5">annotation</Hover> with the key
<Hover label="cc" line="6">eks.amazonaws.com/role-arn</Hover> and the
value of the ARN of the AWS IAM role.

The <Hover label="cc" line="7">spec</Hover> is empty.

<div id="cc">
```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: irsa-runtimeconfig
spec:
  serviceAccountTemplate:
    metadata:
      annotations:
        eks.amazonaws.com/role-arn: arn:aws:iam::622346257358:role/my-custom-role
```
</div>

### Apply the DeploymentRuntimeConfig

Install or update the provider with a
<Hover label="provider" line="7">runtimeConfigRef</Hover> with the
<Hover label="provider" line="8">name</Hover> of the
<Hover label="cc" line="4">DeploymentRuntimeConfig</Hover>.

<div id="provider">
```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  runtimeConfigRef:
    name: irsa-runtimeconfig
```
</div>

After the provider finishes installing verify Crossplane applied the
<Hover label="sa" line="5">annotation</Hover>
on the service account from the DeploymentRuntimeConfig.

:::tip
<!-- vale Google.WordList = NO -->
Kubernetes applies a unique hash to the end of the service account name.
Find the specific service account name with
`kubectl get sa -n crossplane-system`  for Crossplane or
`kubectl get sa -n upbound-system` for UXP.
<!-- vale Google.WordList = YES -->
:::

```yaml {label="sa",copy-lines="1"}
kubectl describe sa -n crossplane-system provider-aws-s3-dbc7f981d81f
Name:                provider-aws-s3-dbc7f981d81f
Namespace:           crossplane-system
Labels:              <none>
Annotations:         eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/my-custom-role
# Removed for brevity
```

Apply the `runtimeConfig` to each family provider using the same IAM role.

### Create a ProviderConfig

Create a
<Hover label="pc" line="2">ProviderConfig</Hover> to set the
provider authentication method to
<Hover label="pc" line="7">IRSA</Hover>.

:::tip
To apply IRSA authentication by default name the ProviderConfig
<Hover label="pc" line="4">default</Hover>.
:::

<div id="pc">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: IRSA
```
</div>
To selectively apply IRSA authentication name the ProviderConfig and apply it
when creating managed resources.

For example, creating an ProviderConfig named
<Hover label="pc2" line="4">irsa-providerconfig</Hover>.

<div id="pc2">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: irsa-providerconfig
spec:
  credentials:
    source: IRSA
```
</div>

Apply the ProviderConfig to a
managed resource with a
<Hover label="mr" line="8">providerConfigRef</Hover>.

<div id="mr">
```yaml
apiVersion: s3.aws.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-s3-bucket
spec:
  forProvider:
    region: us-east-2
  providerConfigRef:
    name: irsa-providerconfig
```
</div>

### Role chaining

To use
[AWS IAM role chaining][aws-iam-role-chaining-6]
add a
<Hover label="irsachains" line="8">assumeRoleChain</Hover> object to the
<Hover label="irsachains" line="2">ProviderConfig</Hover>.

Inside the <Hover label="irsachains" line="9">assumeRoleChain</Hover>
list one or more roles to assume, in order.

<div id="irsachains">
```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: irsa-providerconfig
spec:
  credentials:
    source: IRSA
  assumeRoleChain:
    - roleARN: "arn:aws:iam::111122223333:role/my-assumed-role"
```
</div>

<!--- TODO(tr0njavolta): fix redirect --->
[upbound-auth-oidc]: /manuals/platform/oidc
[upbound-cloud-spaces]: /deploy


[aws-access-keys]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
[assume-role-with-web-identity]: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html
[iam-roles-for-service-accounts]: https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
[aws-iam-console]: https://console.aws.amazon.com/iam
[identity-providers-add-provider]: https://console.aws.amazon.com/iamv2/home#/identity_providers/create
[aws-iam-role]: https://console.aws.amazon.com/iamv2/home#/roles
[aws-account-id]: https://docs.aws.amazon.com/signin/latest/userguide/console_account-alias.html
[download-your-aws-access-key]: https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys
[aws-iam-role-chaining]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining
[assumerolewithwebidentity]: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html
[iam-oidc-provider]: https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html
[trust-policy]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#term_trust-policy
[aws-instructions]: https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html
[aws-trust-policies-blog]: https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/
[aws-iam-role-chaining-1]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining
[aws-iam-roles-for-service-accounts]: https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
[iam-oidc-provider-2]: https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html
[trust-policy-3]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#term_trust-policy
[aws-instructions-4]: https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html
[aws-trust-policies-blog-5]: https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/
[aws-iam-role-chaining-6]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining
