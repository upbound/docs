---
title: Workload-identity for Kubernetes Secrets Sharing
weight: 1
description: Configure AWS workload identity for Spaces External Secrets Operator
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary AWS credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it to your EKS
cluster for secret sharing with Kubernetes.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the Shared Secrets component

The External Secrets Operator (ESO) runs in each control plane's host namespace as `external-secrets-controller`. It needs to access
your external secrets management service like AWS Secrets Manager.

To configure your shared secrets workflow controller, you must:

* Annotate the Kubernetes service account to associate it with a cloud-side
  principal (such as an IAM role, service account, or enterprise application). The workload must then
  use this service account.
* Label the workload (pod) to allow the injection of a temporary credential set,
  enabling authentication.

## Configuration

Upbound supports workload-identity configurations in AWS with IAM Roles for
Service Accounts or EKS pod identity association.

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
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:aws:secretsmanager:${YOUR_REGION}:${YOUR_AWS_ACCOUNT_ID}:secret:${YOUR_SECRET_PREFIX}*",
        "arn:aws:ssm:${YOUR_REGION}:${YOUR_AWS_ACCOUNT_ID}:parameter/${YOUR_PARAMETER_PREFIX}*"
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
        "Federated": "arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:oidc-provider/${YOUR_OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC_PROVIDER>:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:*:external-secrets-controller"
        }
      }
    }
  ]
}
```

#### Configure the EKS OIDC provider

Next, ensure your EKS cluster has an OIDC identity provider:

```shell
eksctl utils associate-iam-oidc-provider --cluster ${YOUR_CLUSTER_NAME} --approve
```

#### Apply the IAM role

In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the shared secrets component:

```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:role/${YOUR_ESO_ROLE_NAME}"
```

This command allows the backup and restore component to authenticate with you
dedicated IAM role in your EKS cluster environment.

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
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:aws:secretsmanager:${YOUR_AWS_REGION}:${YOUR_AWS_ACCOUNT_ID}:secret:${YOUR_SECRET_PREFIX}*",
        "arn:aws:ssm:${YOUR_AWS_REGION}:${YOUR_AWS_ACCOUNT_ID}:parameter/${YOUR_PARAMETER_PREFIX}*"
      ]
    }
  ]
}
```

#### Configure your Space with Helm

When you install or upgrade your Space with Helm, add the shared secrets value:

```shell
helm upgrade spaces spaces-helm-chart \
  --set "sharedSecrets.enabled=true"
```


#### Create a Pod Identity Association

After Upbound provisions your control plane, create a Pod Identity Association
with the `aws` CLI:

```shell
aws eks create-pod-identity-association \
  --cluster-name ${YOUR_CLUSTER_NAME} \
  --namespace ${YOUR_CONTROL_PLANE_NAMESPACE} \
  --service-account external-secrets-controller \
  --role-arn arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:role/${YOUR_ROLE_NAME}
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount external-secrets-controller -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```


Verify the `external-secrets` pod is running correctly:

```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep external-secrets
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.


```sh
kubectl rollout restart deployment external-secrets
```

## Use cases

+Shared secrets with workload identity eliminates the need for static credentials
in your cluster. These benefits are particularly helpful in:

* Secure application credentials management
* Database connection string storage
* API token management
* Compliance with secret rotation security standards
* Multi-environment configuration with centralized secret management

## Next steps

Now that you've configured workload identity for the shared secrets component,
visit the Share Secrets documentation to create a SharedSecretStore resource and
connect to AWS Secrets Manager.

