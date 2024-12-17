---
title: "Workload-identity Configuration"
weight: 5
---

Upbound Spaces supports workload identity configuration for authentication with
major cloud providers (AWS, Azure, and GCP). This document explains how to
configure workload identity for the following use cases:

1. Backup and Restore Operations - Handled by the `mxp-controller` component
2. Billing Management - Managed through the `vector.dev` component
3. Kubernetes Secrets Synchronization - Implemented via the `external-secrets-controller`

## Configuration requirements

Each workload identity configuration requires two key elements:

1. **Service Account Annotation**: Associates the Kubernetes service account with a cloud provider principal (such as an IAM role, service account, or enterprise application)
2. **Workload Label**: Enables injection of temporary authentication credentials into the workload

## Component configuration parameters

{{< hint "warning">}}
All control planes in a Space share Helm parameters. Space-wide parameters can't be overridden for individual control planes. When you attempt to change these parameters for a specific control plane, the Space-wide parameters take precedence.
{{</hint>}}


The following Spaces components support workload identity configuration:

{{< tabs >}}

{{< tab "Backup and Restore" >}}

The `mxp-controller` handles backup and restore operations:


```yaml
controlPlanes:
  mxpController:
    serviceAccount:
      annotations: {}  # Configure service account annotations
    pod:
      customLabels: {} # Configure pod labels
```
{{</tab>}}


{{< tab "Billing" >}}

{{< hint "important" >}}
To use the `vector.dev` billing feature, you **must** set
`billing.storage.secretRef.name` to an empty string.
{{</hint>}}

The `vector.dev` component manages billing capabilities.


```yaml
controlPlanes:
  vector:
    serviceAccount:
      customAnnotations: {}  # Configure service account annotations
    pod:
      customLabels: {}      # Configure pod labels
    billing:
      storage:
        secretRef:
          name: ""  # Must be set to empty string to enable billing feature
```

{{</tab>}}

{{< tab "External secrets controller" >}}

The `external-secrets-controller` synchronizes Kubernetes secrets.

```yaml
controlPlanes:
  sharedSecrets:
    serviceAccount:
      customAnnotations: {}  # Configure service account annotations
    pod:
      customLabels: {}      # Configure pod labels
```

{{</tab>}}

{{</tabs>}}


## AWS provider configuration

Upbound supports workload-identity configurations in AWS with IAM Roles for
Service Accounts and EKS pod identity association.

<!-- vale Microsoft.HeadingAcronyms = NO -->

### IRSA

<!-- vale Microsoft.HeadingAcronyms = YES -->
With IRSA, you can associate a Kubernetes service account in an EKS cluster with
an AWS IAM role. Upbound authenticates workloads with that service account as
the IAM role using temporary credentials instead of static role credentials.
IRSA relies on AWS `AssumeRoleWithWebIdentity` `STS` to exchange OIDC ID tokens
with the IAM role's temporary credentials. IRSA uses the
`eks.amazon.aws/role-arn` annotation to link the service account and the IAM
role.

<!-- vale Upbound.Spelling = NO -->

Upbound deploys the `mxp-controller`, `vector.dev`, and
`external-secrets-contoller` in the ControlPlane's namespace and sets the
related pod names at ControlPlane namespace creation. IAM roles associated with
these service accounts must have trust policies conditioned on the sub-claim of
the projected OIDC token. Sub claims identify the namespaced service
account as `system:serviceaccount:<ControlPlane namespace>:<service account
name>`.

<!-- vale Upbound.Spelling = YES -->
You must configure the IAM role trust policy with the exact match for each
provisioned control plane. For example, for two ControlPlanes, you would
configure the trust policy as:

```yaml
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS account ID>:oidc-provider/<OIDC provider>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC provider>:aud": "sts.amazonaws.com",
          "<OIDC provider>:sub": [
"system:serviceaccount:<ctp1 namespace>:<service account name>",
"system:serviceaccount:<ctp2 namespace>:<service account name>"
]
        }
      }
    }
  ]
}
```

You can also share IAM roles between the workloads across all ControlPlanes in a
Space with wildcard matches for the IAM role trust policy conditions:

```yaml
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS account ID>:oidc-provider/<OIDC provider>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OIDC provider>:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "<OIDC provider>:sub": "system:serviceaccount:*:mxp-controller"
        }
      }
    }
  ]
}
```

The example uses wildcard matches on the sub claim to match the
`mxp-controller` service account in all ControlPlanes of a Space. Then, in your
command line, pass the a `--set` flag with the Spaces Helm chart.

```yaml
--set controlPlanes.mxpController.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="<IAM role ARN>"
```

This command allows the `mxp-controller` workloads with authenticate with a dedicated IAM role in an IRSA enabled EKS cluster

{{<hint "important">}}
You must manually restart a workload's pod when you add the `eks.amazonaws.com/role-arn` key annotation to its service account after provisioning. This restart enables the EKS pod identity webhook to inject the necessary environment for using IRSA.
{{</hint>}}

A full example of Helm parameters for workloads using IRSA:

```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=aws"
--set "billing.storage.aws.region=${SPACES_REGION}"
--set "billing.storage.aws.bucket=${SPACES_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
--set controlPlanes.vector.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="${SPACES_BILLING_IAM_ROLE_ARN}"
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="${SPACES_ESO_IAM_ROLE_ARN}"
--set controlPlanes.mxpController.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="${SPACES_BR_IAM_ROLE_ARN}"
```

<!-- vale Google.Headings = NO -->

### EKS pod identities

<!-- vale Google.Headings = YES -->
EKS pod identities don't require service account annotations, unlike IRSA. You only need to set the `billing.storage.secretRef.name` Helm parameter to authenticate using pod identities. Here's an example:

```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=aws"
--set "billing.storage.aws.region=${SPACES_REGION}"
--set "billing.storage.aws.bucket=${SPACES_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
```


Like IRSA, you must know the ControlPlane namespace to define pod identity
associations for workloads. While IAM role trust policies for IRSA allow
wildcard matches in conditions, EKS pod identities don't support wildcard
specifications. This means you can't create a pod identity association for
multiple service accounts with the same name across different ControlPlane
host namespaces. You must provision a ControlPlane to determine the host namespace
before defining pod identity associations for the `mxp-controller`,
`external-secrets-controller`, and `vector` service accounts in the EKS cluster.

EKS pod identities, like IRSA, inject credentials into the pod's
environment (including a JWT in a projected volume and environment variables for
credential exchange). You must restart your workload after associating its
service account with an IAM role for these changes to take effect.

## Azure provider configuration

To use Microsoft Entra Workload ID with AKS, you must:

1. Annotate the workload service accounts with `azure.workload.identity/client-id` pointing to the Microsoft Entra application client ID associated with the pod's Kubernetes service account
2. Label the workload (pod) with `azure.workload.identity/use=true`

Below is a complete example of the Spaces Helm chart parameters for configuring
these workloads:

```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=azure"
--set "billing.storage.azure.storageAccount=${SPACES_BILLING_STORAGE_ACCOUNT}"
--set "billing.storage.azure.container=${SPACES_BILLING_STORAGE_CONTAINER}"
--set "billing.storage.secretRef.name="
--set controlPlanes.vector.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_BILLING_APP_ID}"
--set controlPlanes.vector.pod.customLabels."azure\.workload\.identity/use"="true"
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_ESO_APP_ID}"
--set controlPlanes.sharedSecrets.pod.customLabels."azure\.workload\.identity/use"="true"
--set controlPlanes.mxpController.serviceAccount.annotations."azure\.workload\.identity/client-id"="${SPACES_BR_APP_ID}"
--set controlPlanes.mxpController.pod.customLabels."azure\.workload\.identity/use"="true"
```

If you annotate a running workload's service account, you must manually restart
the pod. The Azure AD workload identity mutating admission webhook requires a
restart to inject the necessary environment.

For workloads labeled with `azure.workload.identity/use: true` and service accounts annotated with the correct `azure.workload.identity/client-id`, you may not need to restart after provisioning federated credentials. The need to restart depends on when your workload requires these credentials. For example:

<!-- vale Google.WordList = NO -->
- `mxp-controller` and ESO only need credentials when reconciling custom resources
- `vector.dev` validates credentials during initialization via health-check
<!-- vale Google.WordList = YES -->

You can provision federated credentials after the workload starts running in the
ControlPlane's host namespace, when you know the workload's namespace. This
method still crosses the boundary between ControlPlane
management and IAM infrastructure management in a Space.

## GCP provider configuration

GCP offers two methods to configure GKE workload identity federation:

1. Using IAM principal identifiers
2. Linking workload service accounts to IAM roles

Upbound recommends using IAM principal identifiers.

### Using IAM principal identifiers

This method lets you represent workloads, namespaces, or Kubernetes service
accounts with IAM principal identifiers. This flexibility helps when setting up
IAM policy bindings due to non-deterministic ControlPlane host namespace names
discussed for other cloud providers. For example, you can create an IAM
principal identifier to represent all pods in a specific cluster.

{{<hint "important">}}
Principal identifiers don't support wildcard namespace specifications.
{{</hint>}}


IAM principal identifiers don't require service account annotations or workload
labels (unlike AKS workload identity federation). This Spaces Helm chart example
shows how to enable workload identities for the Spaces components:

```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
```

You may not need to restart workloads after binding IAM policies to their principals if you bind after startup. This depends on when your workload needs credentials. If your workload can handle it, you can bind the IAM policy after it starts running in the ControlPlane's host namespace.

GCP cloud storage bucket workloads, like backup and restore or billing, require
uniform bucket-level access on target buckets for IAM principal identifiers.

### Linking Kubernetes service accounts to IAM roles

This method requires you to:

1. Annotate the workload's Kubernetes service account with `iam.gke.io/gcp-service-account` pointing to the GCP IAM service account's identifier
2. Know the ControlPlane's namespace to grant the `roles/iam.workloadIdentityUser` role, allowing the Kubernetes service account to impersonate the IAM service account

Here's an example of Spaces Helm chart parameters using this configuration:

```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
--set controlPlanes.vector.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_BILLING_IAM_SA}"
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_ESO_IAM_SA}"
--set controlPlanes.mxpController.serviceAccount.annotations."iam\.gke\.io/gcp-service-account"="${SPACES_BR_IAM_SA}"
```


To link a workload Kubernetes service account to a GCP IAM service account, add
the `iam.gke.io/gcp-service-account` annotation. This change doesn't require a
restart. Your workload's success depends on when it attempts authentication and
retries of failed attempts.
