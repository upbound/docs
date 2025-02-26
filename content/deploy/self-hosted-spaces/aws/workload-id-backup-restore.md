---
title: Workload-identity for Backup and Restore
weight: 1
description: Description of the document
aliases:
    - concepts/path
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers.

This guide walks you through creating an IAM trust role policy and applying it to your EKS
cluster for backup and restore storage.

## Prerequisites

To set up a workload-identity, you'll need:

- A self-hosted Space cluster
- Administrator access in your cloud provider
- Helm and `kubectl`

The `mxp-controller` component handles backup and restore workloads. To
configure your backup and restore workflow controller, use the following Helm
chart parameters:

*  `controlPlanes.mxpController.serviceAccount.annotations` - Configures service
   account annotations
* `controlPlanes.mxpController.pod.customLabels` - Sets custom labels for the
  back and restore workflow pods

## Requirements

To enable workload-identity for backup and restore, you must:

* Annotate the Kubernetes service account to associate it with a cloud-side
  principal (such as an IAM role, service account, or enterprise application).
  This service account must then be used by the workload.

* Label the workload (pod) to allow the injection of a temporary credential set,
  enabling authentication.

## Configuration

Upbound supports workload-identity configurations in AWS with IAM Roles for
Service Accounts and EKS pod identity association.

With IRSA, you can associate a Kubernetes service account in an EKS cluster with
an AWS IAM role. Upbound authenticates workloads with that service account as
the IAM role using temporary credentials instead of static role credentials.
IRSA relies on AWS `AssumeRoleWithWebIdentity` `STS` to exchange OIDC ID tokens with
the IAM role’s temporary credentials. IRSA uses the `eks.amazon.aws/role-arn`
annotation to link the service account and the IAM role.

### Create an IAM role trust policy

You must configure the IAM role trust policy with the exact match for each
provisioned control plane. An example of a trust policy for a single control
plane is below:

<!--- TODO(tr0njavolta): make editable --->
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/<OIDC_PROVIDER>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC_PROVIDER>:aud": "sts.amazonaws.com",
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:<namespace>:mxp-controller"
        }
      }
    }
  ]
}
```

### Apply the IAM role

Next, in your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the Backup and Restore component. Update
`${SPACES_BR_IAM_ROLE_ARN}` with the IRN of the role you just created.

```yaml
--set controlPlanes.mxpController.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="${SPACES_BR_IAM_ROLE_ARN}"
```

This command allows the backup and restore component to authenticate with you
dedicated IAM role in your EKS cluster environment.

### Restart workload

You must manually restart a workload’s pod when you add the
`eks.amazonaws.com/role-arn key` annotation to the running pod’s service
account.

This restart enables the EKS pod identity webhook to inject the necessary
environment for using IRSA.


```sh
kubectl rollout restart deployment mxp-controller
```

