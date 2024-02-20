---
title: Authentication 
weight: 10
description: Authentication options with the Upbound AWS official provider
---

The Upbound Official AWS Provider supports multiple authentication methods.

* [AWS Access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
* [Assume role with web identity](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
* [IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) with AWS managed Kubernetes.

## AWS authentication keys

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

### Role chaining

To use 
[AWS IAM role chaining](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining)
add a 
{{<hover label="keychains" line="12">}}assumeRoleChain{{</hover>}} object to the 
{{<hover label="keychains" line="2">}}ProviderConfig{{</hover>}}.

Inside the {{<hover label="keychains" line="12">}}assumeRoleChain{{</hover>}}
list one or more roles to assume, in order. 

```yaml {label="keychains"}
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

<!-- vale off -->
## WebIdentity
<!-- vale on -->
When running the AWS Provider in an Amazon managed Kubernetes cluster (`EKS`)
the Provider may use 
[AssumeRoleWithWebIdentity](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html)
for authentication. 

WebIdentity uses an OpenID Connect ID token to authenticate and use a specific
AWS IAM role.

{{<hint "important">}}
WebIdentity is only supported with Crossplane running in Amazon managed
Kubernetes clusters (`EKS`).
{{< /hint >}}

Configuring WebIdentity with the AWS Provider requires:
* an AWS 
[IAM OIDC Provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
* an AWS IAM Role with an editable [trust policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#term_trust-policy)
* a ProviderConfig to enable WebIdentity authentication

### Create an IAM OIDC provider

WebIdentity relies on the EKS cluster OIDC provider. 

Follow the [AWS instructions](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) 
to create an _IAM OIDC provider_ with your _EKS OIDC provider URL_. 

### Edit the IAM role

Supporting WebIdentity requires matching the EKS OIDC information to the 
specific role through a role trust policy. 

{{<hint "tip" >}}
Read the [AWS trust policies blog](https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/) 
for more information on trust policies.
{{< /hint >}}

The trust policy references the OIDC provider ARN and the provider AWS service
account.

In the policy {{<hover label="trust" line="6">}}Principal{{</hover>}} enter
{{<hover label="trust" line="7">}}"Federated": "&lt;OIDC_PROVIDER_ARN&gt;"{{</hover>}}.

Add a {{<hover label="trust" line="10">}}Condition{{</hover>}} to restrict
access to the role to only the Provider's service account.  

The {{<hover label="trust" line="10">}}Condition{{</hover>}} uses 
{{<hover label="trust" line="11">}}StringLike{{</hover>}} to generically match
the Provider's service account.

{{<expand "Why use a generic match?">}}
The token used for authentication includes the full name of the AWS Provider's
Kubernetes service account.  

The Provider's service account name ends in a hash. If the hash changes the
{{<hover label="trust" line="10">}}Condition{{</hover>}} doesn't match.
{{< /expand >}}

Enter the string (with quotation marks)  
{{<hover label="trust" line="11">}}""&lt;OIDC_PROVIDER_ARN&gt;:sub": "system:serviceaccount:upbound-system:provider-aws-*"{{</hover>}}.

{{<hint "tip" >}}
Be sure to include `:sub` after the OIDC provider ARN.  

The `system:serviceaccount:` matches the namespace where the Provider pod runs.  

By default UXP uses `upbound-system` and Crossplane uses `crossplane-system`.
{{< /hint >}}

The following is a full example trust policy.
```json {label="trust"}
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

### Create a ProviderConfig

Create a 
{{<hover label="web" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to 
{{<hover label="web" line="7">}}WebIdentity{{</hover>}}.

{{<hint "tip" >}}
To apply WebIdentity authentication by default name the ProviderConfig 
{{<hover label="web" line="4">}}default{{</hover>}}.
{{< /hint >}}

Apply the ARN of the role with the OIDC trust relationship as the 
{{<hover label="web" line="9">}}roleARN{{</hover>}} field. 

```yaml {label="web"}
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

To selectively apply WebIdentity authentication name the ProviderConfig and
apply it when creating managed resources.

For example, creating an ProviderConfig named 
{{<hover label="pc2" line="4">}}webid-providerconfig{{</hover>}}.

```yaml {label="pc2"}
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

Apply the ProviderConfig to a 
managed resource with a 
{{<hover label="mr" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr"}
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

### Role chaining

To use 
[AWS IAM role chaining](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining)
add a 
{{<hover label="idchains" line="10">}}assumeRoleChain{{</hover>}} object to the 
{{<hover label="idchains" line="2">}}ProviderConfig{{</hover>}}.

Inside the {{<hover label="idchains" line="11">}}assumeRoleChain{{</hover>}}
list one or more roles to assume, in order. 

```yaml {label="idchains"}
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

## IAM roles for service accounts

When running the AWS Provider in an Amazon managed Kubernetes cluster (`EKS`)
the Provider may use 
[AWS IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 
(`IRSA`) for authentication. 

IRSA works by using an annotation on a Kubernetes ServiceAccount used by a Pod
requesting AWS resources. The annotation matches an AWS IAM Role ARN configured
with the desired permissions. 

Configuring IRSA with the AWS Provider requires:
* an AWS 
[IAM OIDC Provider](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
* an AWS IAM Role with an editable [trust policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#term_trust-policy)
* a ControllerConfig to add an annotation on the AWS Provider service account
* a ProviderConfig to enable IRSA authentication

### Create an IAM OIDC provider

IRSA relies on the EKS cluster OIDC provider. 

Follow the [AWS instructions](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) 
to create an _IAM OIDC provider_ with your _EKS OIDC provider URL_. 

### Edit the IAM role

Supporting IRSA requires matching the EKS OIDC information to the specific role
through a role trust policy. 

{{<hint "tip" >}}
Read the [AWS trust policies blog](https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/) 
for more information on trust policies.
{{< /hint >}}

The trust policy references the OIDC provider ARN and the provider AWS service
account.

In the policy {{<hover label="trust" line="6">}}Principal{{</hover>}} enter
{{<hover label="trust" line="7">}}"Federated": "&lt;OIDC_PROVIDER_ARN&gt;"{{</hover>}}.

Add a {{<hover label="trust" line="10">}}Condition{{</hover>}} to restrict
access to the role to only the Provider's service account.  

The {{<hover label="trust" line="10">}}Condition{{</hover>}} uses 
{{<hover label="trust" line="11">}}StringLike{{</hover>}} to generically match
the Provider's service account.

{{<expand "Why use a generic match?">}}
The token used for authentication includes the full name of the AWS Provider's
Kubernetes service account.  

The Provider's service account name ends in a hash. If the hash changes the
{{<hover label="trust" line="10">}}Condition{{</hover>}} doesn't match.
{{< /expand >}}

Enter the string (with quotation marks)  
{{<hover label="trust" line="11">}}""&lt;OIDC_PROVIDER_ARN&gt;:sub": "system:serviceaccount:upbound-system:provider-aws-*"{{</hover>}}.

{{<hint "tip" >}}
Be sure to include `:sub` after the OIDC provider ARN.  

The `system:serviceaccount:` matches the namespace where the Provider pod runs.  

By default UXP uses `upbound-system` and Crossplane uses `crossplane-system`.
{{< /hint >}}

The following is a full example trust policy.
```json {label="trust"}
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

### Create a ControllerConfig

IRSA relies on an annotation on the service account attached to a pod to
identify the IAM role to use. 

Crossplane uses a ControllerConfig to apply settings to the provider, including 
the provider service account.

Create a {{<hover label="cc" line="2">}}ControllerConfig{{</hover>}} object to
apply a custom annotation to the provider service account. 

In the {{<hover label="cc" line="3">}}metadata{{</hover>}} create an 
{{<hover label="cc" line="5">}}annotation{{</hover>}} with the key 
{{<hover label="cc" line="6">}}eks.amazonaws.com/role-arn{{</hover>}} and the
value of the ARN of the AWS IAM role.

The {{<hover label="cc" line="7">}}spec{{</hover>}} is empty.

```yaml {label="cc"}
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: irsa-controllerconfig
  annotations:    
    eks.amazonaws.com/role-arn: arn:aws:iam::622346257358:role/my-custom-role
spec: {}    
```

### Apply the ControllerConfig

Install or update the provider with a 
{{<hover label="provider" line="7">}}controllerConfigRef{{</hover>}} with the
{{<hover label="provider" line="8">}}name{{</hover>}} of the 
{{<hover label="cc" line="4">}}ControllerConfig{{</hover>}}.

```yaml {label="provider"}
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v0.37.0
  controllerConfigRef:
    name: irsa-controllerconfig
```

After the provider finishes installing verify Crossplane applied the 
{{<hover label="sa" line="5">}}annotation{{</hover>}}
on the service account from the ControllerConfig. 

{{<hint "note" >}}
<!-- vale Google.WordList = NO -->
Kubernetes applies a unique hash to the end of the service account name.  
Find the specific service account name with  
`kubectl get sa -n crossplane-system`  for Crossplane or  
`kubectl get sa -n upbound-system` for UXP.
<!-- vale Google.WordList = YES -->
{{< /hint >}}

```yaml {label="sa",copy-lines="1"}
kubectl describe sa -n crossplane-system provider-aws-s3-dbc7f981d81f
Name:                provider-aws-s3-dbc7f981d81f
Namespace:           crossplane-system
Labels:              <none>
Annotations:         eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/my-custom-role
# Removed for brevity
```

Apply the `controllerConfig` to each family provider using the same IAM role.

### Create a ProviderConfig

Create a 
{{<hover label="pc" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to 
{{<hover label="pc" line="7">}}IRSA{{</hover>}}.

{{<hint "tip" >}}
To apply IRSA authentication by default name the ProviderConfig 
{{<hover label="pc" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc"}
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: IRSA
```

To selectively apply IRSA authentication name the ProviderConfig and apply it
when creating managed resources.

For example, creating an ProviderConfig named 
{{<hover label="pc2" line="4">}}irsa-providerconfig{{</hover>}}.

```yaml {label="pc2"}
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: irsa-providerconfig
spec:
  credentials:
    source: IRSA
```

Apply the ProviderConfig to a 
managed resource with a 
{{<hover label="mr" line="8">}}providerConfigRef{{</hover>}}.

```yaml {label="mr"}
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

### Role chaining

To use 
[AWS IAM role chaining](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html#iam-term-role-chaining)
add a 
{{<hover label="irsachains" line="8">}}assumeRoleChain{{</hover>}} object to the 
{{<hover label="irsachains" line="2">}}ProviderConfig{{</hover>}}.

Inside the {{<hover label="irsachains" line="9">}}assumeRoleChain{{</hover>}}
list one or more roles to assume, in order. 

```yaml {label="irsachains"}
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
