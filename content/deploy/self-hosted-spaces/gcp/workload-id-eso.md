---
title: Workload-identity for Shared Secrets
weight: 1
description: Configure GCP workload identityt for Spaces Shared Secrets
---

Workload-identity authentication lets you use access policies to grant your
self-hosted Space cluster access to your cloud providers. Workload identity
authentication grants temporary GCP credentials to your Kubernetes pod based on
a service account. Assigning IAM roles and service accounts allows the pod to
access cloud resources dynamically and much more securely than static
credentials.

This guide walks you through configuring workload identity for your GKE
cluster's Shared Secrets component.

## Prerequisites

<!-- vale FutureTense = NO -->
To set up a workload-identity, you'll need:
<!-- vale FutureTense = YES -->

* A self-hosted Space cluster
* Adminstrator access in your cloud provider
* Helm and `kubectl`

## About the shared secrets component

The External Secrets Operator (ESO) component runs in each control plane's host
namespace as `external-secrets-controller`. It synchronizes secrets from
external APIs into Kubernetes secrets. Shared secrets allow you to manage
credentials outside your Kuberentes cluster while making them available to your
application

## Configuration

Upbound supports workload-identity configurations in GCP with IAM principal
identifiers or service account impersonation.

### IAM principal identifiers

IAM principal identifiers allow you to grant permissions directly to 
Kubernetes service accounts without additional annotation. Upbound recommends
this approach for ease-of-use and flexibility.

First, enable Workload Identity Federation on your GKE cluster:

```shell
gcloud container clusters update ${YOUR_CLUSTER_NAME} \
    --workload-pool=${YOUR_PROJECT_ID}.svc.id.goog \
    --region=${YOUR_REGION}
```

Next, grant the necessary permissions to your Kubernetes service account:

```shell
gcloud projects add-iam-policy-binding ${YOUR_PROJECT_ID} \
  --member="principalSet://iam.googleapis.com/projects/${YOUR_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${YOUR_PROJECT_ID}.svc.id.goog/attribute.kubernetes_namespace/${YOUR_CONTROL_PLANE_NAMESPACE}/attribute.kubernetes_service_account/external-secrets-controller" \
  --role="roles/secretmanager.secretAccessor"
```

### Service account impersonation

Service account impersonation allows you to link a Kubernetes service account to
a GCP service account. The Kubernetes service account assumes the permissions of
the GCP service account you specify.

Enable workload id federation on your GKE cluster:

```shell
gcloud container clusters update ${YOUR_CLUSTER_NAME} \
  --workload-pool=${YOUR_PROJECT_ID}.svc.id.goog \
  --region=${YOUR_REGION}
```

Next, create a dedicated service account for your billing operations:

```shell
gcloud iam service-accounts create secrets-sa \
  --project=${YOUR_PROJECT_ID}
```

Grant storage permissions to the service account you created:

```shell
gcloud projects add-iam-policy-binding ${YOUR_PROJECT_ID} \
  --member="serviceAccount:secrets-sa@${YOUR_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

```
Link the Kubernetes service account to the GCP service account:


```shell
gcloud iam service-accounts add-iam-policy-binding \
  secrets-sa@${YOUR_PROJECT_ID}.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:${YOUR_PROJECT_ID}.svc.id.goog[${YOUR_CONTROL_PLANE_NAMESPACE}/external-secrets-controller]"
```


In your control plane, pass the `--set` flag with the Spaces Helm chart
parameters for the shared secrets component:

```shell
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="secrets-sa@${YOUR_PROJECT_ID}.iam.gserviceaccount.com"
```

### Verify your configuration

After you apply the configuration use `kubectl` to verify the service account
has the correct annotation:

```shell
kubectl get serviceaccount external-secrets-controller -n ${YOUR_CONTROL_PLANE_NAMESPACE} -o yaml
```

Verify the `mxp-controller` pod is running correctly:

```shell
kubectl get pods -n ${YOUR_CONTROL_PLANE_NAMESPACE} | grep external secrets
```

### Restart workload

GCP workload identity doesn't require pod restarts after configuration changes.
If you do need to restart the workload, use the `kubectl` command to force the
component restart:

```shell
kubectl rollout restart deployment external-secrets
```

## Use cases

Configuring the external secrets operator with workload identity eliminates the need for
static credentials in your cluster and the overhead of credential rotation.
These benefits are particularly helpful in:

* Secure application credentials management
* Database connection string storage
* API token management
* Compliance with secret rotation security standards

## Next steps

Now that you have a workload identity configured for the Shared Secrets 
component, visit the Shared Secrets Configuration documentation.

Other workload identity guides are:
* Backup and restore
* Billing
