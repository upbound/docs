# AWS IRSA Authentication Setup for Upbound Official AWS Provider

This guide provides step-by-step instructions to configure IAM Roles for Service Accounts (IRSA) authentication between your Crossplane control plane running on Amazon EKS and AWS services.

## Prerequisites

- An existing Amazon EKS cluster
- `kubectl` configured to access your EKS cluster
- AWS CLI installed and configured with appropriate permissions
- A control plane (Crossplane V2/UXPv2/Upbound Space managed control plane) on your EKS cluster

## Overview

IRSA enables Kubernetes pods to assume AWS IAM roles without storing credentials. It works by:
1. Annotating a Kubernetes ServiceAccount with an IAM Role ARN
2. AWS validates the pod's identity token against the EKS OIDC provider
3. The pod receives temporary AWS credentials to assume the role

---

## Step 1: Create an IAM OIDC Provider for Your EKS Cluster

IRSA requires an IAM OIDC identity provider associated with your EKS cluster.

### 1.1 Get your EKS cluster's OIDC issuer URL

```bash
# Set your cluster name and region
export CLUSTER_NAME="your-cluster-name"
export AWS_REGION="us-east-2"

# Get the OIDC issuer URL
export OIDC_URL=$(aws eks describe-cluster \
  --name $CLUSTER_NAME \
  --region $AWS_REGION \
  --query "cluster.identity.oidc.issuer" \
  --output text)

echo $OIDC_URL
# Example output: https://oidc.eks.us-east-2.amazonaws.com/id/5C64F628ACFB6A892CC25AF3B67124C5
```

### 1.2 Check if OIDC provider already exists

```bash
# Extract the OIDC ID from the URL
export OIDC_ID=$(echo $OIDC_URL | cut -d '/' -f 5)

# Check if the OIDC provider exists
aws iam list-open-id-connect-providers | grep $OIDC_ID
```

### 1.3 Create the OIDC provider (if it doesn't exist)

```bash
eksctl utils associate-iam-oidc-provider \
  --cluster $CLUSTER_NAME \
  --region $AWS_REGION \
  --approve
```

---

## Step 2: Create an IAM Role with Trust Policy

### 2.1 Get your AWS Account ID

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"
```

### 2.2 Determine your Crossplane namespace

```bash
# Set your namespace
export CROSSPLANE_NAMESPACE="crossplane-system"
```

### 2.3 Create the trust policy document

Create a file named `trust-policy.json`:

```bash
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/oidc.eks.${AWS_REGION}.amazonaws.com/id/${OIDC_ID}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "oidc.eks.${AWS_REGION}.amazonaws.com/id/${OIDC_ID}:sub": "system:serviceaccount:${CROSSPLANE_NAMESPACE}:upbound-provider-aws-*"
        }
      }
    }
  ]
}
EOF
```

> **Note**: The `StringLike` condition with `upbound-provider-aws-*` is used because the AWS Provider's service account name includes a hash that may change between upgrades. This is also the most common mistake when configuring your `providerConfig` be sure that this values matches what is deployed to your control plane.

### 2.4 Create the IAM role

```bash
export ROLE_NAME="crossplane-provider-aws"

aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://trust-policy.json \
  --description "IAM role for Crossplane AWS Provider using IRSA"
```

### 2.5 Attach permission policies to the role

Attach the policies your Crossplane provider needs. For full access (not recommended for production):

```bash
# Example: Attach AdministratorAccess (for testing only)
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

**Recommended: Use least-privilege policies**

```bash
# Example: Attach specific service policies
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess

aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess
```

### 2.6 Get the Role ARN

```bash
export ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query "Role.Arn" --output text)
echo "Role ARN: $ROLE_ARN"
```

---

## Step 3: Create a DeploymentRuntimeConfig

The DeploymentRuntimeConfig annotates the provider's service account with the IAM role ARN.

### 3.1 Create the DeploymentRuntimeConfig manifest

```bash
cat > deployment-runtime-config.yaml << EOF
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: irsa-runtimeconfig
spec:
  serviceAccountTemplate:
    metadata:
      annotations:
        eks.amazonaws.com/role-arn: ${ROLE_ARN}
EOF
```

### 3.2 Apply the DeploymentRuntimeConfig

```bash
kubectl apply -f deployment-runtime-config.yaml
```

---

## Step 4: Install or Update the AWS Provider

### 4.1 Create the Provider manifest with runtimeConfigRef

```bash
cat > provider-aws.yaml << EOF
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v2.3.0
  runtimeConfigRef:
    name: irsa-runtimeconfig
EOF
```

### 4.2 Apply the Provider

```bash
kubectl apply -f provider-aws.yaml
```

Wait for the Provider to become healthy.

### 4.3 Verify the service account annotation

```bash
# Get the provider's service account name
SA_NAME=$(kubectl get sa -n $CROSSPLANE_NAMESPACE -o name | grep provider-aws-s3)

# Describe the service account and verify the annotation
kubectl describe $SA_NAME -n $CROSSPLANE_NAMESPACE | grep -A2 "Annotations"
```

Expected output should show:
```
Annotations:  eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/crossplane-provider-aws
```

---

## Step 5: Create the ProviderConfig

### 5.1 Create the ProviderConfig manifest

```bash
cat > provider-config.yaml << EOF
apiVersion: aws.m.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
  namespace: default
spec:
  credentials:
    source: IRSA
EOF
```

### 5.2 Apply the ProviderConfig

```bash
kubectl apply -f provider-config.yaml
```

---

## Step 6: Verify the Configuration

Check the ProviderConfig status:

```bash
kubectl get providerConfig.aws.m default -o yaml
```

Test by creating a simple resource (e.g., an S3 bucket):

```yaml
apiVersion: s3.aws.m.upbound.io/v1beta1
kind: Bucket
metadata:
  name: my-crossplane-test-bucket
spec:
  forProvider:
    region: us-east-2
  providerConfigRef:
    kind: ProviderConfig
    name: default
```

Check the resource status:

```bash
kubectl get buckets.s3.aws.m.upbound.io my-crossplane-test-bucket -o yaml
```

Look for `status.conditions` with `type: Ready` and `status: "True"` to confirm authentication is working.

> **Note**: We specify `buckets.s3.aws.m.upbound.io` to avoid any potential conflicts with other CRDs installed on a cluster.

---

## Optional: Role Chaining

If you need to assume additional roles after the initial IRSA authentication, add an `assumeRoleChain` to your ProviderConfig:

```yaml
apiVersion: aws.m.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
  namespace: default
spec:
  credentials:
    source: IRSA
  assumeRoleChain:
    - roleARN: "arn:aws:iam::111122223333:role/my-assumed-role"
```

---

## Multiple Provider Families

When using multiple AWS provider families (S3, EC2, RDS, etc.), apply the same `runtimeConfigRef` to each provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v2.1.1
  runtimeConfigRef:
    name: irsa-runtimeconfig
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-rds
spec:
  package: xpkg.upbound.io/upbound/provider-aws-rds:v2.1.1
  runtimeConfigRef:
    name: irsa-runtimeconfig
```

---

## Troubleshooting

### Common Issues

**1. Provider pod fails to start or authenticate**

Check the provider pod logs:
```bash
kubectl logs -n $CROSSPLANE_NAMESPACE -l pkg.crossplane.io/provider=provider-aws-s3
```

**2. "AccessDenied" errors**

- Verify the trust policy has the correct OIDC provider ARN
- Ensure the service account namespace matches the trust policy condition
- Check that the IAM role has the required permission policies attached

**3. Service account not annotated**

- Verify the DeploymentRuntimeConfig is correctly applied
- Restart the provider by deleting its pods
- Check if the provider references the correct runtimeConfigRef

**4. OIDC thumbprint issues**

If you see certificate validation errors:
```bash
# Get updated thumbprint
aws eks describe-cluster --name $CLUSTER_NAME --region $AWS_REGION \
  --query "cluster.identity.oidc.issuer" --output text
```

---

## Security Considerations

- **No stored credentials** - IRSA uses projected service account tokens and temporary STS credentials, eliminating static secrets
- **Use least privilege** - Grant only the permissions the provider needs via IAM policies
- **Scope trust policies narrowly** - Use the most specific `sub` condition that matches your provider service accounts; avoid overly broad wildcards
- **Audit role assumptions** - Enable AWS CloudTrail to log all `AssumeRoleWithWebIdentity` calls for this role
- **Rotate the OIDC thumbprint** - If your EKS cluster's OIDC certificate is rotated, update the IAM OIDC provider thumbprint
- **Prefer IRSA over Access Keys** - When running on EKS, IRSA is strictly more secure than storing access keys as Kubernetes secrets
