---
title: Configure Workload Identity for Billing
weight: 1
description: Description of the document
aliases:
    - concepts/path
---

The `vector.dev` component manages billing functionality. This guide explains how to configure **workload identity** for billing authentication with **AWS, GCP, and Azure**.

## **Configuration Requirements**
To authenticate workloads, you need:
1. **Service Account Annotations** – Links Kubernetes service accounts to cloud provider identities.
2. **Workload Labels** – Enables temporary credentials injection into the workload.

## **Configuration Parameters**
```yaml
controlPlanes:
  vector:
    serviceAccount:
      customAnnotations: {}  # Set cloud provider-specific annotations
    pod:
      customLabels: {}        # Set labels if required
    billing:
      storage:
        secretRef:
          name: ""  # Must be empty to enable billing feature
```

---

## **Cloud-Specific Configuration**

### **AWS: Using IAM Roles for Service Accounts (IRSA)**
IRSA allows Kubernetes workloads to authenticate with AWS IAM roles.

#### **1. IAM Role Trust Policy**
Modify the IAM role to allow workload identity authentication:
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
          "<OIDC_PROVIDER>:sub": "system:serviceaccount:<namespace>:vector"
        }
      }
    }
  ]
}
```

#### **2. Apply IAM Role to Kubernetes Service Account**
```yaml
--set controlPlanes.vector.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="<IAM_ROLE_ARN>"
```

#### **3. Restart Workload**
```sh
kubectl rollout restart deployment vector
```

---

### **GCP: Workload Identity Federation**
GCP offers two methods:
1. **IAM Principal Identifiers (Recommended)**
2. **Kubernetes Service Account to IAM Role Linking**

#### **IAM Principal Identifiers (Recommended)**
```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_BILLING_BUCKET}"
--set "billing.storage.secretRef.name="
```

#### **Linking Kubernetes Service Account to IAM Role**
```yaml
--set controlPlanes.vector.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_BILLING_IAM_SA}"
```

---

### **Azure: Microsoft Entra Workload ID**
#### **1. Configure Kubernetes Service Account**
```yaml
--set controlPlanes.vector.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_BILLING_APP_ID}"
--set controlPlanes.vector.pod.customLabels."azure\.workload\.identity/use"="true"
```

#### **2. Restart Workload**
```sh
kubectl rollout restart deployment vector
```

---

# **Guide 2: Configuring Workload Identity for Backup & Restore**

## **Overview**
The `mxp-controller` component handles **backup and restore** for workloads. This guide explains how to configure workload identity for **AWS, GCP, and Azure**.

## **Configuration Parameters**
```yaml
controlPlanes:
  mxpController:
    serviceAccount:
      annotations: {}  # Cloud provider-specific annotations
    pod:
      customLabels: {} # Optional labels
```

---

## **Cloud-Specific Configuration**

### **AWS: Using IRSA**
#### **1. IAM Role Trust Policy**
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

#### **2. Apply IAM Role**
```yaml
--set controlPlanes.mxpController.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"="${SPACES_BR_IAM_ROLE_ARN}"
```

#### **3. Restart Workload**
```sh
kubectl rollout restart deployment mxp-controller
```

---

### **GCP: Workload Identity Federation**
#### **IAM Principal Identifiers (Recommended)**
```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_BACKUP_BUCKET}"
--set "billing.storage.secretRef.name="
```

#### **Linking Kubernetes Service Account to IAM Role**
```yaml
--set controlPlanes.mxpController.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_BR_IAM_SA}"
```

---

### **Azure: Microsoft Entra Workload ID**
#### **1. Configure Kubernetes Service Account**
```yaml
--set controlPlanes.mxpController.serviceAccount.annotations."azure\.workload\.identity/client-id"="${SPACES_BR_APP_ID}"
--set controlPlanes.mxpController.pod.customLabels."azure\.workload\.identity/use"="true"
```

#### **2. Restart Workload**
```sh
kubectl rollout restart deployment mxp-controller
```

---

# **Guide 3: Configuring Workload Identity for Kubernetes Secrets**
## **Overview**
The `external-secrets-controller` synchronizes **Kubernetes secrets** across cloud providers.

## **Configuration Parameters**
```yaml
controlPlanes:
  sharedSecrets:
    serviceAccount:
      customAnnotations: {}  # Cloud provider-specific annotations
    pod:
      customLabels: {}        # Optional labels
```

---

## **Cloud-Specific Configuration**

### **AWS: Using IRSA**
#### **1. IAM Role Trust Policy**
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

#### **2. Apply IAM Role**
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="${SPACES_ESO_IAM_ROLE_ARN}"
```

#### **3. Restart Workload**
```sh
kubectl rollout restart deployment external-secrets-controller
```

---

### **GCP: Workload Identity Federation**
#### **IAM Principal Identifiers (Recommended)**
```yaml
--set "billing.enabled=true"
--set "billing.storage.provider=gcp"
--set "billing.storage.gcp.bucket=${SPACES_SECRETS_BUCKET}"
--set "billing.storage.secretRef.name="
```

#### **Linking Kubernetes Service Account to IAM Role**
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="${SPACES_ESO_IAM_SA}"
```

---

### **Azure: Microsoft Entra Workload ID**
#### **1. Configure Kubernetes Service Account**
```yaml
--set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="${SPACES_ESO_APP_ID}"
--set controlPlanes.sharedSecrets.pod.customLabels."azure\.workload\.identity/use"="true"
```

#### **2. Restart Workload**
```sh
kubectl rollout restart deployment external-secrets-controller
```

---

## **Final Notes**
- **AWS**: Use IRSA (`eks.amazonaws.com/role-arn` annotation).
- **GCP**: Use **IAM principal identifiers** (recommended) or link Kubernetes service accounts to IAM roles.
- **Azure**: Use **Microsoft Entra Workload ID** with client ID annotations and pod labels.

Would you like additional troubleshooting steps or automation scripts? 🚀