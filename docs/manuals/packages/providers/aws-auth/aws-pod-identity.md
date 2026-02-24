
# AWS EKS Pod Identity Authentication for Upbound Official AWS Provider

This guide provides step-by-step instructions to configure EKS Pod Identity authentication between your Crossplane control plane running on Amazon EKS and AWS services. Unlike IRSA, EKS Pod Identity does not require an OIDC provider. It uses the EKS Pod Identity Agent and the built-in `pods.eks.amazonaws.com` service principal for managing IAM roles and credentials.

## Prerequisites

- An existing Amazon EKS cluster running Kubernetes 1.24 or later
- `kubectl` configured to access your EKS cluster
- AWS CLI installed and configured with appropriate permissions
- Crossplane or UXPv2 installed on your EKS cluster
- At least one Upbound AWS Provider installed on the cluster

---

## Overview

EKS Pod Identity simplifies IAM role association for Kubernetes workloads by eliminating the need for OIDC provider configuration:
1. The EKS Pod Identity Agent runs as a DaemonSet on your cluster nodes
2. An EKS Pod Identity association maps a Kubernetes ServiceAccount (in a specific namespace) to an IAM role
3. When a pod using that ServiceAccount starts, the agent intercepts credential requests and provides temporary AWS credentials for the associated role
4. The provider uses these credentials to manage AWS resources

### How Pod Identity Differs from IRSA

| | IRSA | EKS Pod Identity |
|---|---|---|
| Requires OIDC provider | Yes | No |
| Role association | ServiceAccount annotation | EKS Pod Identity association (API/CLI) |
| Credential delivery | EKS pod identity webhook injects env vars | Pod Identity Agent intercepts credential requests |
| Trust policy | Custom per-cluster OIDC trust policy | Standardized `pods.eks.amazonaws.com` trust policy |
| Cross-account | Requires OIDC provider per cluster | Reusable trust policy across clusters |
| ProviderConfig `source` | `IRSA` | `PodIdentity` |

Pod Identity is simpler to set up than IRSA because the trust policy is standardized and does not contain cluster-specific OIDC provider ARNs.

---

## Step 1: Install the EKS Pod Identity Agent

The Pod Identity Agent is an EKS add-on that must be installed on your cluster.

### 1.1 Set environment variables

```bash
export CLUSTER_NAME="your-cluster-name"
export AWS_REGION="us-east-2"
```

### 1.2 Install the add-on

```bash
aws eks create-addon \
  --cluster-name $CLUSTER_NAME \
  --addon-name eks-pod-identity-agent \
  --region $AWS_REGION
```

### 1.3 Verify the agent is running

```bash
kubectl get daemonset eks-pod-identity-agent -n kube-system
```

Expected output should show the agent running on all nodes:

```
NAME                      DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE
eks-pod-identity-agent    3         3         3       3            3
```

---

## Step 2: Create an IAM Role with Trust Policy

### 2.1 Get your AWS Account ID

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"
```

### 2.2 Create the trust policy document

Unlike IRSA, the Pod Identity trust policy uses the standardized `pods.eks.amazonaws.com` service principal. This trust policy works across all EKS clusters without modification:

```bash
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "pods.eks.amazonaws.com"
      },
      "Action": [
        "sts:AssumeRole",
        "sts:TagSession"
      ]
    }
  ]
}
EOF
```

> **Note**: The `sts:TagSession` action is required for EKS Pod Identity. The agent tags sessions with cluster and namespace metadata that can be used in IAM condition keys for additional access control.

### 2.3 Create the IAM role

```bash
export ROLE_NAME="crossplane-provider-aws-pod-identity"

aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://trust-policy.json \
  --description "IAM role for Crossplane AWS Provider using EKS Pod Identity"
```

### 2.4 Attach permission policies to the role

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

### 2.5 Get the Role ARN

```bash
export ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query "Role.Arn" --output text)
echo "Role ARN: $ROLE_ARN"
```

---

## Step 3: Create a DeploymentRuntimeConfig

EKS Pod Identity matches pods to roles by ServiceAccount **name** and **namespace**. The provider's auto-generated ServiceAccount name includes a random hash, so you must use a DeploymentRuntimeConfig to set a predictable ServiceAccount name that matches the Pod Identity association you will create in Step 4.

### 3.1 Determine your Crossplane namespace

```bash
export CROSSPLANE_NAMESPACE="crossplane-system"
```

### 3.2 Create the DeploymentRuntimeConfig manifest

```bash
export SA_NAME="provider-aws-pod-identity"

cat > deployment-runtime-config.yaml << EOF
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: pod-identity-runtimeconfig
spec:
  serviceAccountTemplate:
    metadata:
      name: ${SA_NAME}
EOF
```

### 3.3 Apply the DeploymentRuntimeConfig

```bash
kubectl apply -f deployment-runtime-config.yaml
```

---

## Step 4: Create the EKS Pod Identity Association

The association links the ServiceAccount name and namespace to the IAM role.

### 4.1 Create the association

```bash
aws eks create-pod-identity-association \
  --cluster-name $CLUSTER_NAME \
  --namespace $CROSSPLANE_NAMESPACE \
  --service-account $SA_NAME \
  --role-arn $ROLE_ARN \
  --region $AWS_REGION
```

### 4.2 Verify the association

```bash
aws eks list-pod-identity-associations \
  --cluster-name $CLUSTER_NAME \
  --region $AWS_REGION
```

You should see your association in the output with the correct namespace, service account, and role ARN.

---

## Step 5: Install or Update the AWS Provider

### 5.1 Create the Provider manifest with runtimeConfigRef

```bash
cat > provider-aws.yaml << EOF
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-s3
spec:
  package: xpkg.upbound.io/upbound/provider-aws-s3:v2.3.0
  runtimeConfigRef:
    name: pod-identity-runtimeconfig
EOF
```

### 5.2 Apply the Provider

```bash
kubectl apply -f provider-aws.yaml
```

Wait for the Provider to become healthy.

### 5.3 Verify the service account name

```bash
kubectl get sa -n $CROSSPLANE_NAMESPACE $SA_NAME
```

Confirm the ServiceAccount exists and its name matches the Pod Identity association.

---

## Step 6: Create the ProviderConfig

### 6.1 Create the ProviderConfig manifest

```bash
cat > provider-config.yaml << EOF
apiVersion: aws.m.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
  namespace: default
spec:
  credentials:
    source: PodIdentity
EOF
```

### 6.2 Apply the ProviderConfig

```bash
kubectl apply -f provider-config.yaml
```

> **Tip**: Naming the ProviderConfig `default` applies this authentication method automatically to all AWS managed resources that don't specify a different `providerConfigRef`.

---

## Step 7: Verify the Configuration

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

If you need to assume additional roles after the initial Pod Identity authentication (e.g., to access resources in a different AWS account), add an `assumeRoleChain` to your ProviderConfig:

```yaml
apiVersion: aws.m.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
  namespace: default
spec:
  credentials:
    source: PodIdentity
  assumeRoleChain:
    - roleARN: "arn:aws:iam::111122223333:role/my-cross-account-role"
```

The provider first authenticates via Pod Identity, then sequentially assumes each role in the chain. This is useful for:
- **Cross-account access**: Managing resources in AWS accounts different from the one hosting the EKS cluster
- **Privilege separation**: Using a minimal initial role that escalates to a more permissive role for specific operations

> **Note**: The target role in the chain must have a trust policy that allows `sts:AssumeRole` from the initial Pod Identity role.

---

## Multiple Provider Families

When using multiple AWS provider families (S3, EC2, RDS, etc.), each provider needs a Pod Identity association. You can either:

**Option A: Shared ServiceAccount name** — Use the same `serviceAccountTemplate.metadata.name` across all providers so a single Pod Identity association covers them all:

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: pod-identity-runtimeconfig
spec:
  serviceAccountTemplate:
    metadata:
      name: provider-aws-pod-identity
```

Apply the same `runtimeConfigRef` to each provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-ec2
spec:
  package: xpkg.upbound.io/upbound/provider-aws-ec2:v2.3.0
  runtimeConfigRef:
    name: pod-identity-runtimeconfig
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-rds
spec:
  package: xpkg.upbound.io/upbound/provider-aws-rds:v2.3.0
  runtimeConfigRef:
    name: pod-identity-runtimeconfig
```

> **Note**: With this approach, all provider family pods share the same ServiceAccount name. Since EKS Pod Identity matches on namespace + ServiceAccount name, a single association covers all providers.

**Option B: Separate associations per provider** — Create distinct ServiceAccount names and Pod Identity associations for each provider family. This enables per-provider IAM role isolation but requires more configuration.

---

## Troubleshooting

### Check Provider Logs

```bash
# Find the provider pod
kubectl get pods -n $CROSSPLANE_NAMESPACE | grep provider-aws

# View logs
kubectl logs -n $CROSSPLANE_NAMESPACE <provider-pod-name> -f
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `AccessDenied` when calling AWS APIs | Verify the Pod Identity association has the correct namespace, ServiceAccount name, and role ARN |
| Provider pod not receiving credentials | Confirm the `eks-pod-identity-agent` DaemonSet is running on the node where the provider pod is scheduled |
| ServiceAccount name mismatch | Check that the DeploymentRuntimeConfig `serviceAccountTemplate.metadata.name` matches the Pod Identity association's service account |
| Provider pod not authenticating | Ensure `credentials.source` is set to `PodIdentity` (not `IRSA`, `Secret`, or `WebIdentity`) |
| Role chaining `AccessDenied` | Verify the target role's trust policy allows `sts:AssumeRole` from the initial Pod Identity role ARN |
| `sts:TagSession` errors | Confirm the IAM role's trust policy includes the `sts:TagSession` action |

### Verify the Pod Identity Agent

```bash
# Check agent pods are running
kubectl get pods -n kube-system -l app.kubernetes.io/name=eks-pod-identity-agent

# Check agent logs for errors
kubectl logs -n kube-system -l app.kubernetes.io/name=eks-pod-identity-agent --tail=50
```

### Verify the Pod Identity Association

```bash
aws eks list-pod-identity-associations \
  --cluster-name $CLUSTER_NAME \
  --region $AWS_REGION \
  --query "associations[?serviceAccount=='${SA_NAME}']"
```

### Verify the Trust Policy

```bash
aws iam get-role --role-name $ROLE_NAME --query "Role.AssumeRolePolicyDocument" --output json
```

Confirm the output contains the `pods.eks.amazonaws.com` service principal with both `sts:AssumeRole` and `sts:TagSession` actions.

---

## Security Considerations

- **No stored credentials** - Pod Identity uses the EKS Pod Identity Agent to inject temporary credentials, eliminating static secrets
- **No OIDC provider required** - Reduces the IAM configuration surface compared to IRSA; no cluster-specific OIDC trust policies to manage
- **Standardized trust policy** - The `pods.eks.amazonaws.com` service principal trust policy is portable across clusters and does not contain cluster-specific identifiers
- **Use least privilege** - Grant only the permissions the provider needs via IAM policies
- **Use session tags for fine-grained access** - Pod Identity tags sessions with `eks-cluster-arn`, `kubernetes-namespace`, and `kubernetes-service-account` attributes that can be used in IAM policy conditions for additional access control
- **Audit role assumptions** - Enable AWS CloudTrail to log all `AssumeRole` calls from the `pods.eks.amazonaws.com` service principal
- **Prefer Pod Identity or IRSA over Access Keys** - When running on EKS, identity-based methods are strictly more secure than storing access keys as Kubernetes secrets
