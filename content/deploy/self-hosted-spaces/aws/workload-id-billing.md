---
title: Workload-identity for Billing
weight: 1
description: Configure AWS workload identity for Spaces Billing
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary AWS credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it to your EKS
cluster for billing in your Space cluster.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the billing component

The `vector.dev` component handles billing metrics collection in spaces. It
stores account data in your cloud storage. By default, this component runs in
each control plane's host namespace.


## Configuration

Upbound supports workload-identity configurations in AWS with IAM Roles for
Service Accounts and EKS pod identity association.

### IAM Roles for Service Accounts (IRSA)

With IRSA, you can associate a Kubernetes service account in an EKS cluster with
an AWS IAM role. Upbound authenticates workloads with that service account as
the IAM role using temporary credentials instead of static role credentials.
IRSA relies on AWS `AssumeRoleWithWebIdentity` `STS` to exchange OIDC ID tokens with
the IAM role's temporary credentials. IRSA uses the `eks.amazon.aws/role-arn`
annotation to link the service account and the IAM role.

#### Create an IAM role and trust policy

First, create an IAM role appropriate permissions to access your S3 bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::${YOUR_BILLING_BUCKET}",
        "arn:aws:s3:::${YOUR_BILLING_BUCKET}/*"
      ]
    }
  ]
}
```


You must configure the IAM role trust policy with the exact match for each
provisioned control plane. An example of a trust policy for a single control
plane is below:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
       "Federated": "arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:oidc-provider/${YOUR_OIDC_PROVIDER>}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC_PROVIDER>:aud": "sts.amazonaws.com",
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:${YOUR_NAMESPACE}:vector"
        }
      }
    }
  ]
}
```

#### Configure the EKS OIDC provider

Next, ensure your EKS cluster has an OIDC identity provider:

```shell
eksctl utils associate-iam-oidc-provider --cluster ${YOUR-CLUSTER-NAME} --approve
```

#### Apply the IAM role

In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the Billing component:

```shell
--set "billing.enabled=true"
--set "billing.storage.provider=aws"
--set "billing.storage.aws.region=${YOUR_AWS_REGION}"
--set "billing.storage.aws.bucket=${YOUR_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
--set controlPlanes.vector.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:role/${YOUR_BILLING_ROLE_NAME}"
```

{{< hint "important" >}}
You **must** set the `billing.storage.secretRef.name` to en empty string to
enable workload identity for the billing component
{{</ hint >}}

### EKS pod identities

Upbound also supports EKS Pod Identity configuration. EKS Pod Identities allow
you to create a pod identity association with your Kubernetes namespace, a
service account, and an IAM role, which allows the EKS control plane to
automatically handle the credential exchange.

#### Create an IAM role

First, create an IAM role appropriate permissions to access your S3 bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::${YOUR_BILLING_BUCKET}",
        "arn:aws:s3:::${YOUR_BILLING_BUCKET}/*"
      ]
    }
  ]
}
```

#### Configure your Space with Helm

When you install or upgrade your Space with Helm, add the billing values:

```shell
helm upgrade spaces spaces-helm-chart \
  --set "billing.enabled=true" \
  --set "billing.storage.provider=aws" \
  --set "billing.storage.aws.region=${YOUR_AWS_REGION}" \
  --set "billing.storage.aws.bucket=${YOUR_BILLING_BUCKET}" \
  --set "billing.storage.secretRef.name="
```

#### Create a Pod Identity Association

After Upbound provisions your control plane, create a Pod Identity Association
with the `aws` CLI:


```shell
aws eks create-pod-identity-association \
  --cluster-name ${YOUR_CLUSTER_NAME} \
  --namespace ${YOUR_CONTROL_PLANE_NAMESPACE} \
  --service-account vector \
  --role-arn arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:role/${YOUR_BILLING_ROLE_NAME}
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount vector -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the `vector` pod is running correctly:


```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep vector
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.


```shell
kubectl rollout restart deployment vector 
```

## Use cases

Using workload identity authentication for billing eliminates the need for static
credentials in your cluster as well as the overhead of credential rotation.
These benefits are particularly helpful in:

* Resource usage tracking across teams/projects
* Cost allocation for multi-tenant environments
* Financial auditing requirements
* Capacity billing and resource optimization
* Automated billing workflows

## Next steps

Now that you have workload identity configured for the billing component, visit
the Billing guide for more information.
