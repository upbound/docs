---
title: Workload-identity for Backup and Restore
weight: 1
description: Configure AWS workload identity for Spaces Backup and Restore
---

Workload-identity authentication lets you use access policies to grant temporary
AWS credentials to your Kubernetes pod with a service account. Assigning IAM roles and service accounts allows the pod to assume the IAM role dynamically and much more securely than static credentials.

This guide walks you through creating an IAM trust role policy and applying it
to your EKS cluster to handle backup and restore storage.

## Prerequisites

<!-- vale gitlab.FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale gitlab.FutureTense = YES -->

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

## About the backup and restore component

The `mxp-controller` component handles backup and restore workloads. It needs to
access your cloud storage to store and retrieve backups. By default, this
component runs in each control plane's host namespace. 

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


First, create an IAM role with appropriate permissions to access your S3 bucket:

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
        "arn:aws:s3:::${YOUR_BACKUP_BUCKET}",
        "arn:aws:s3:::${YOUR_BACKUP_BUCKET}/*"
      ]
    }
  ]
}
```


Next, ensure your EKS cluster has an OIDC identity provider:

```shell
eksctl utils associate-iam-oidc-provider --cluster ${YOUR_CLUSTER_NAME} --approve
```

Configure the IAM role trust policy with the namespace for each
provisioned control plane.

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
          "${YOUR_OIDC_PROVIDER}:aud": "sts.amazonaws.com",
          "${YOUR_OIDC_PROVIDER}:sub": "system:serviceaccount:${YOUR_NAMESPACE}:mxp-controller"
        }
      }
    }
  ]
}
```

In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the Backup and Restore component:

```shell
--set controlPlanes.mxpController.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="${SPACES_BR_IAM_ROLE_ARN}"
```

This command allows the backup and restore component to authenticate with your
dedicated IAM role in your EKS cluster environment.


### EKS pod identities

Upbound also supports EKS Pod Identity configuration. EKS Pod Identities allow
you to create a pod identity association with your Kubernetes namespace, a
service account, and an IAM role, which allows the EKS control plane to
automatically handle the credential exchange.


First, create an IAM role with appropriate permissions to access your S3 bucket:

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
        "arn:aws:s3:::${YOUR_BACKUP_BUCKET}",
        "arn:aws:s3:::${YOUR_BACKUP_BUCKET}/*"
      ]
    }
  ]
}
```

When you install or upgrade your Space with Helm, add the backup/restore values:

```shell
helm upgrade spaces spaces-helm-chart \
  --set "billing.enabled=true" \
  --set "backup.enabled=true" \
  --set "backup.storage.provider=aws" \
  --set "backup.storage.aws.region= ${YOUR_AWS_REGION}" \
  --set "backup.storage.aws.bucket= ${YOUR_BACKUP_BUCKET}"
```

After Upbound provisions your control plane, create a Pod Identity Association
with the `aws` CLI:

```shell
aws eks create-pod-identity-association \
  --cluster-name ${YOUR_CLUSTER_NAME} \
  --namespace ${YOUR_CONTROL_PLANE_NAMESPACE} \
  --service-account mxp-controller \
  --role-arn arn:aws:iam::${YOUR_AWS_ACCOUNT_ID}:role/backup-restore-role
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount mxp-controller -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the `mxp-controller` pod is running correctly:

```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep mxp-controller
```

### Restart workload

You must manually restart a workload's pod when you add the
`eks.amazonaws.com/role-arn` annotation to the running pod's service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.

```shell
kubectl rollout restart deployment mxp-controller
```

## Use cases

Configuring backup and restore with workload identity eliminates the need for
static credentials in your cluster and the overhead of credential rotation.
These benefits are particularly helpful in:

* Disaster recovery scenarios
* Control plane migration
* Compliance requirements
* Rollbacks after unsuccessful upgrades

## Next steps

Now that you have a workload identity configured for the backup and restore
component, visit the Backup Configuration documentation.

Other workload identity guides are:
* Billing
* Shared secrets

