Workload Identity for Kubernetes Secrets
## Overview
The `external-secrets-controller` synchronizes Kubernetes secrets across cloud providers.

## Configuration Parameters
```yaml
controlPlanes:
  sharedSecrets:
    serviceAccount:
      customAnnotations: {}  # Cloud provider-specific annotations
    pod:
      customLabels: {}        # Optional labels
```

---

## Cloud-Specific Configuration

### AWS: Using IRSA
#### 1. IAM Role Trust Policy
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
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:<namespace>:external-secrets-controller"
        }
      }
    }
  ]
}
```

#### 2. Apply IAM Role
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="${SPACES_ESO_IAM_ROLE_ARN}"
```

#### 3. Restart Workload
```sh
kubectl rollout restart deployment external-secrets-controller
```

---

### GCP: Workload Identity Federation
#### IAM Principal Identifiers (Recommended)
```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_SECRETS_BUCKET}"
--set "billing.storage.secretRef.name="
```

#### Linking Kubernetes Service Account to IAM Role
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_ESO_IAM_SA}"
```

---

### Azure: Microsoft Entra Workload ID
#### 1. Configure Kubernetes Service Account
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_ESO_APP_ID}"
--set controlPlanes.sharedSecrets.pod.customLabels."azure\.workload\.identity/use"="true"
```

#### 2. Restart Workload
```sh
kubectl rollout restart deployment external-secrets-controller
```
