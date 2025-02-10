---
title: Secrets Management
weight: 150
description: A guide for how to configure synchronizing external secrets into managed control planes in a Space.
aliases:
    - /spaces/secrets-management
    - /disconnected-spaces/secrets-management
    - /self-hosted-spaces/secrets-management
---

{{< hint "important" >}}
This feature is in preview. It is enabled by default in Cloud Spaces. To enable it in a Disconnected Space, set `features.alpha.sharedSecrets.enabled=true` when installing the Space:

```bash
up space init --token-file="${SPACES_TOKEN_PATH}" "v${SPACES_VERSION}" \
  ...
  --set "features.alpha.sharedSecrets.enabled=true" \
```

{{< /hint >}}

Upbound's _Shared Secrets_ is a built-in secrets management feature that lets you store sensitive data such as passwords and certificates used by managed control planes as secrets in an external secret store. This guide explains how you can use Shared Secrets to access secrets stored in your external store and project them into managed control planes.

The Shared Secrets feature derives from the open source [External Secrets Operator (ESO)](https://external-secrets.io). Upbound offers:

1. `SharedSecretStore` and `SharedExternalSecret` APIs to manage syncing external secrets into groups of managed control planes.
2. Each managed control plane has built-in support for External Secrets Operator (ESO) APIs.

## Benefits

The Shared Secrets feature provides the following benefits:

* Access secrets from a variety of external secret stores without any operational overhead
* Configure synchronization for multiple managed control planes in a group
* Store and manage all your secrets centrally
* Use Shared Secrets across all Upbound environments (Cloud and Disconnected Spaces)

## Prerequisites

Make sure you've enabled the Shared Secrets feature in whichever Space you plan to run your managed control plane in. All Upbound-managed Cloud Spaces have this feature enabled by default. If you want to use these APIs in your own Connected Space, your Space administrator must enable them with the `features.alpha.sharedSecrets.enabled=true` setting.

<!-- vale Google.Headings = NO -->
## Configure a Shared Secret Store
<!-- vale Google.Headings = YES -->

[SharedSecretStore](https://docs.upbound.io/reference/space-api/#SharedSecretStore-spec) is a [group-scoped]({{<ref "mcp/groups" >}}) resource that you create in a group containing one or more managed control planes. It provisions [ClusterSecretStore](https://external-secrets.io/latest/api/clustersecretstore/) resources into control planes within its group.

### Secret store provider

`SharedSecretStores` need to be configured to authenticate and interact with external secret store APIs. The `spec.provider` field configures the provider of the external secret store to sync secrets from. Only one provider is settable. See the [Space API reference](https://docs.upbound.io/reference/space-api/#SharedSecretStore-spec-provider) for supported providers. 

#### AWS Secrets Manager

You can configure access to AWS Secrets Manager using static credentials or workload identity. Below are instructions for configuring either. See the [ESO provider API](https://external-secrets.io/latest/provider/aws-secrets-manager/) for more information.

{{< hint "important" >}}
If you're running in Upbound Cloud Spaces, you can **only** configure the provider with static credential auth.
{{< /hint >}}

##### Static credentials

1. Use the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds) to create access credentials.
2. Create a text file called `aws-credentials.txt` containing the AWS account `aws_access_key_id` and `aws_secret_access_key`.  
{{< editCode >}}
```ini {copy-lines="all"}
[default]
aws_access_key_id = $@<aws_access_key>$@
aws_secret_access_key = $@<aws_secret_key>$@
```
{{< /editCode >}}

3. Store the access credentials in a secret in the same namespace as the `SharedSecretStore`. 
```shell {label="kube-create-secret",copy-lines="all"}
kubectl create secret \
generic awssm-secret \
-n default \
--from-file=creds=./aws-credentials.txt
```

4. Create a `SharedSecretStore`, referencing the secret created earlier:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: aws-sm
  namespace: default
spec:
  provider:
    aws:
      service: SecretsManager
      role: iam-role
      region: $@<aws-region>$@
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: awssm-secret
            key: access-key
          secretAccessKeySecretRef:
            name: awssm-secret
            key: secret-access-key
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

{{< hint "tip" >}}
The example above maps a Shared Secret Store into a single namespace of a single control plane. Read [control plane selection]({{<ref "#control-plane-selection" >}}) amd [namespace selection]({{<ref "#namespace-selection" >}}) to learn how to map into one or more namespaces of one or more control planes.
{{< /hint >}}

##### Workload identity with IRSA

You can associate a Kubernetes service account in an EKS cluster with an AWS IAM role. IRSA relies on AWS [AssumeRoleWithWebIdentity](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithWebIdentity.html) STS to exchange OIDC ID tokens with the IAM role's temporary credentials. 

1. Ensure you have deployed the Spaces software into an [IRSA-enabled EKS cluster](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html).
2. Follow the [AWS instructions](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) to create an _IAM OIDC provider_ with your _EKS OIDC provider URL_.
3. Determine the Spaces-generated `controlPlaneID` of your control plane. When you deploy a `kind: controlplane` in a Space, the Spaces software deploys a set of pods in a new namespace following the format `mxp-<controlPlaneID>-system`.
{{< editCode >}}
```ini
kubectl get controlplane $@<control-plane-name>$@ -o jsonpath='{.status.controlPlaneID}'
```
{{< /editCode >}}

4. Create an IAM role trust policy in your AWS account to match the control plane. Grant the role associated with the trust policy [SecretsManagerReadWrite](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/SecretsManagerReadWrite.html). Replace the controlPlaneID below with the value returned in the previous step.
{{<expand "View an example trust policy for a single control plane" >}}
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
"system:serviceaccount:mxp-<controlPlaneID>-system:external-secrets-contoller"]
        }
      }
    }
  ]
}
```
{{< /expand >}}
{{<expand "View an example trust policy for multiple control planes" >}}
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
"system:serviceaccount:mxp-<controlPlaneID>-system:external-secrets-contoller",
"system:serviceaccount:mxp-<another-controlPlaneID>-system:external-secrets-contoller"
]
        }
      }
    }
  ]
}
```
{{< /expand >}}

5. Update your Spaces deployment to annotate the SharedSecrets service account with the role ARN of the trust policy created in step 4:
{{< editCode >}}
```ini
up space upgrade ... \
  --set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."eks\.amazonaws\.com/role-arn"="$@<SPACES_ESO_IAM_ROLE_ARN>$@"
```
{{< /editCode >}}

{{< hint "important" >}}
You must manually restart a workload's pod when you add the `eks.amazonaws.com/role-arn` key annotation to the running pod's service account. This enables the EKS pod identity webhook to inject the necessary environment for using IRSA.
{{< /hint >}}

6. Create a `SharedSecretStore` and reference the SharedSecrets service account:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: aws-sm
  namespace: default
spec:
  provider:
    aws:
      service: SecretsManager
      region: $@<aws-region>$@
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-controller
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

##### Workload identity with EKS Pod Identity

unlike IRSA, [EKS pod identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) don't require service account annotations. You only need to set the billing.storage.secretRef.name Helm parameter to authenticate using pod identities. Here’s an example:

<!-- vale off -->
#### Azure Key Vault
<!-- vale on -->

You can configure access to Azure Key Vault using static credentials or workload identity. Below are instructions for configuring either. See the [ESO provider API](https://external-secrets.io/latest/provider/azure-key-vault/) for more information.

{{< hint "important" >}}
If you're running in Upbound Cloud Spaces, you can **only** configure the provider with static credential auth.
{{< /hint >}}

##### Static credentials

1. Use the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/azure-cli-sp-tutorial-1) to create a service principal and authentication file.
2. Save the output in a file called `azure-credentials.json`.
{{< editCode >}}
```ini {copy-lines="all"}
{
  "appId": "myAppId",
  "displayName": "myServicePrincipalName",
  "password": "myServicePrincipalPassword",
  "tenant": "myTentantId"
}
```
{{< /editCode >}}

3. Store the access credentials in a secret in the same namespace as the `SharedSecretStore`. 
```shell {label="kube-create-secret",copy-lines="all"}
kubectl create secret \
generic azure-secret-sp \
-n default \
--from-file=creds=./azure-credentials.json
```

4. Create a `SharedSecretStore`, referencing the secret created earlier. Replace the `tenantId` with the value generated by creating a service principal. Replace the `vaultUrl` with the URL of your Key Vault instance:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: azure-kv
spec:
  provider:
    azurekv:
      tenantId: "$@<your-tenant-id>$@"
      vaultUrl: "$@<your-vault-url>$@"
      authSecretRef:
        clientId:
          name: azure-secret-sp
          key: ClientID
        clientSecret:
          name: azure-secret-sp
          key: ClientSecret
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

{{< hint "tip" >}}
The example above maps a Shared Secret Store into a single namespace of a single control plane. Read [control plane selection]({{<ref "#control-plane-selection" >}}) amd [namespace selection]({{<ref "#namespace-selection" >}}) to learn how to map into one or more namespaces of one or more control planes.
{{< /hint >}}
 
##### Workload identity

You can use [Entra Workload Identity Federation](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation) to access Azure Key Vault without needing to manage secrets. To use Entra Workload ID with AKS, do the following:

1. Ensure you have deployed the Spaces software into a [workload identity-enabled AKS cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster).
2. Retrieve the OIDC issuer URL of the AKS cluster:
{{< editCode >}}
```ini
az aks show --name "$@<CLUSTER_NAME>$@" \
    --resource-group "$@<RESOURCE_GROUP>$@" \
    --query "oidcIssuerProfile.issuerUrl" \
    --output tsv
```
{{< /editCode >}}

3. Use the Azure CLI to make a managed identity:
{{< editCode >}}
```ini
az identity create \
    --name "$@<USER_ASSIGNED_IDENTITY_NAME>$@" \
    --resource-group "$@<RESOURCE_GROUP>$@" \
    --location "$@<LOCATION>$@" \
    --subscription "$@<SUBSCRIPTION>$@"
```
{{< /editCode >}}

4. Look up the managed identity's client ID:
{{< editCode >}}
```ini
az identity show \
    --resource-group "$@<RESOURCE_GROUP>$@" \
    --name "$@<USER_ASSIGNED_IDENTITY_NAME>$@" \
    --query 'clientId' \
    --output tsv
```
{{< /editCode >}}

5. Update your Spaces deployment to annotate the SharedSecrets service account with the associated Entra application client ID from the previous step:
{{< editCode >}}
```ini
up space upgrade ... \
  --set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."azure\.workload\.identity/client-id"="$@<SPACES_ESO_CLIENT_ID>$@" \ 
  --set-string controlPlanes.sharedSecrets.pod.customLabels."azure\.workload\.identity/use"="true"
```
{{< /editCode >}}

6. Determine the Spaces-generated `controlPlaneID` of your control plane. When you deploy a `kind: controlplane` in a Space, the Spaces software deploys a set of pods in a new namespace following the format `mxp-<controlPlaneID>-system`.
{{< editCode >}}
```ini
kubectl get controlplane $@<control-plane-name>$@ -o jsonpath='{.status.controlPlaneID}'
```
{{< /editCode >}}

7. Create a federated identity credential.
{{< editCode >}}
```ini
FEDERATED_IDENTITY_CREDENTIAL_NAME=$@<FEDERATED_IDENTITY_CREDENTIAL_NAME>$@
USER_ASSIGNED_IDENTITY_NAME=$@<USER_ASSIGNED_IDENTITY_NAME>$@
RESOURCE_GROUP=$@<RESOURCE_GROUP>$@
AKS_OIDC_ISSUER=$@<AKS_OIDC_ISSUER>$@
CONTROLPLANE_ID=$@<CONTROLPLANE_ID>$@
az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --issuer "${AKS_OIDC_ISSUER}" --subject system:serviceaccount:"mxp-${CONTROLPLANE_ID}-system:external-secrets-controller" --audience api://AzureADTokenExchange
```
{{< /editCode >}}

8. Assign the `Key Vault Secrets User` role to the user-assigned managed identity that you created earlier. This step gives the managed identity permission to read secrets from the key vault:
{{< editCode >}}
```ini
az role assignment create \
    --assignee-object-id "${IDENTITY_PRINCIPAL_ID}" \
    --role "Key Vault Secrets User" \
    --scope "${KEYVAULT_RESOURCE_ID}" \
    --assignee-principal-type ServicePrincipal
```
{{< /editCode >}}

{{< hint "important" >}}
You must manually restart a workload's pod when you add the annotation to the running pod's service account. The Entra workload identity mutating admission webhook requires a restart to inject the necessary environment.
{{< /hint >}}

8. Create a `SharedSecretStore`. Replace `vaultURL` with the URL of your Azure Key Vault instance. Replace `identityId` with the client ID of the managed identity created earlier:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: azure-kv
spec:
  provider:
    azurekv:
      authType: WorkloadIdentity
      vaultUrl: "$@<KEYVAULT_URL>$@"
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

<!-- vale off -->
#### Google Cloud Secret Manager
<!-- vale on -->


You can configure access to Google Cloud Secret Manager using static credentials or workload identity. Below are instructions for configuring either. See the [ESO provider API](https://external-secrets.io/latest/provider/google-secrets-manager/) for more information.

{{< hint "important" >}}
If you're running in Upbound Cloud Spaces, you can **only** configure the provider with static credential auth.
{{< /hint >}}

##### Static credentials

1. Use the [GCP CLI](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) to create access credentials.
2. Save the output in a file called `gcp-credentials.json`.
3. Store the access credentials in a secret in the same namespace as the `SharedSecretStore`. 
```shell {label="kube-create-secret",copy-lines="all"}
kubectl create secret \
generic gcpsm-secret \
-n default \
--from-file=creds=./gcp-credentials.json
```

4. Create a `SharedSecretStore`, referencing the secret created earlier. Replace `projectID` with your GCP Project ID:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: gcp-sm
spec:
  provider:
    gcpsm:
      auth:
        secretRef:
          secretAccessKeySecretRef:
            name: gcpsm-secret
            key: creds
      projectID: $@<your-gcp-project>$@
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

{{< hint "tip" >}}
The example above maps a Shared Secret Store into a single namespace of a single control plane. Read [control plane selection]({{<ref "#control-plane-selection" >}}) amd [namespace selection]({{<ref "#namespace-selection" >}}) to learn how to map into one or more namespaces of one or more control planes.
{{< /hint >}}

##### Workload identity with Service Accounts to IAM Roles

To configure this method, you must know the control plane namespace so that you can grant the `roles/iam.workloadIdentityUser` role to the Kubernetes service account to impersonate the IAM service account. Follow these instructions:

1. Ensure you've deployed Spaces on a [Workload Identity Federation-enabled](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_on_clusters_and_node_pools) GKE cluster.
2. Determine the Spaces-generated `controlPlaneID` of your control plane. When you deploy a `kind: controlplane` in a Space, the Spaces software deploys a set of pods in a new namespace following the format `mxp-<controlPlaneID>-system`.
{{< editCode >}}
```ini
kubectl get controlplane $@<control-plane-name>$@ -o jsonpath='{.status.controlPlaneID}'
```
{{< /editCode >}}
3. Create a GCP IAM service account with the [GCP CLI](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#kubernetes-sa-to-iam):
{{< editCode >}}
```ini
gcloud iam service-accounts create $@<IAM_SA_NAME>$@ \
    --project=$@<IAM_SA_PROJECT_ID>$@
```
{{< /editCode >}}

4. Grant the IAM service account the role to access GCP Secret Manager:
{{< editCode >}}
```ini
SA_NAME=$@<IAM_SA_NAME>$@
IAM_SA_PROJECT_ID=$@<IAM_SA_PROJECT_ID>$@
gcloud projects add-iam-policy-binding IAM_SA_PROJECT_ID \
    --member "serviceAccount:SA_NAME@IAM_SA_PROJECT_ID.iam.gserviceaccount.com" \
    --role roles/secretmanager.secretAccessor
```
{{< /editCode >}}

5. When you enable the Shared Secrets feature, a service account gets created in each control plane for the External Secrets Operator. Apply a [GCP IAM policy binding](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/add-iam-policy-binding) to associate this service account with the desired GCP IAM role.
{{< editCode >}}
```ini
PROJECT_ID=$@<PROJECT_ID>$@
PROJECT_NUMBER=$@<PROJECT_NUMBER>$@
CONTROLPLANE_ID=$@<CONTROLPLANE_ID>$@
gcloud projects add-iam-policy-binding projects/${PROJECT_ID} \
    --role "roles/iam.workloadIdentityUser" \
    --member=principal://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${PROJECT_ID}.svc.id.goog/subject/ns/mxp-${CONTROLPLANE_ID}-system/sa/external-secrets-controller 
```
{{< /editCode >}}

5. Update your Spaces deployment to annotate the SharedSecrets service account with GCP IAM service account's identifier:
{{< editCode >}}
```ini
up space upgrade ... \
  --set controlPlanes.sharedSecrets.serviceAccount.customAnnotations."iam\.gke\.io/gcp-service-account"="$@<SA_NAME>$@"
```
{{< /editCode >}}

6. Create a `SharedSecretStore`. Replace `projectID` with your GCP Project ID:
{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: gcp-sm
spec:
  provider:
    gcpsm:
      projectID: $@<your-gcp-project>$@
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

{{< hint "tip" >}}
The example above maps a Shared Secret Store into a single namespace of a single control plane. Read [control plane selection]({{<ref "#control-plane-selection" >}}) amd [namespace selection]({{<ref "#namespace-selection" >}}) to learn how to map into one or more namespaces of one or more control planes.
{{< /hint >}}

### Control plane selection

To configure which managed control planes in a group you want to project a SecretStore into, use the `spec.controlPlaneSelector` field. You can either use `labelSelectors` or the `names` of a control plane directly. A control plane matches if any of the label selectors match.

This example matches all control planes in the group that have `environment: production` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          environment: production
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches control planes that have label `environment: production` or `environment: staging`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  controlPlaneSelector:
    labelSelectors:
      - matchExpressions:
        - { key: environment, operator: In, values: [production,staging] }
```

You can also specify the names of control planes directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  controlPlaneSelector:
    names:
    - controlplane-dev
    - controlplane-staging
    - controlplane-prod
```


### Namespace selection

To configure which namespaces **within each matched managed control plane** to project the secret store into, use `spec.namespaceSelector` field. The projected secret store only appears in the namespaces matching the provided selector. You can either use `labelSelectors` or the `names` of namespaces directly. A control plane matches if any of the label selectors match.

**For all control planes matched by** `spec.controlPlaneSelector`, This example matches all namespaces in each selected control plane that have `team: team1` as a label:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  namespaceSelector:
    labelSelectors:
      - matchLabels:
          team: team1
```

You can use the more complex `matchExpressions` to match labels based on an expression. This example matches namespaces that have label `team: team1` or `team: tean2`:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  namespaceSelector:
    labelSelectors:
      - matchExpressions:
        - { key: team, operator: In, values: [team1,team2] }
```

You can also specify the names of namespaces directly:

```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: my-secret-store
spec:
  ...
  namespaceSelector:
    names:
    - team1-namespace
    - team2-namespace
```

## Configure a shared external secret

[SharedExternalSecret](https://docs.upbound.io/reference/space-api/#SharedExternalSecret-spec) is a [group-scoped]({{<ref "mcp/groups" >}}) resource that you create in a group containing one or more managed control planes. It provisions [ClusterExternalSecret](https://external-secrets.io/latest/api/clusterexternalsecret/) resources into control planes within its group.

The `spec.externalSecretSpec` field configures the spec of the corresponding External Cluster Secret to project into managed control planes. Its shape depends on the referenced secret store.

Example projecting a secret from AWS Secret Manager:

{{< hint "tip" >}}
The `secretStoreRef` is of `kind: ClusterSecretStore` because a Shared Secret Store projects a `kind: ClusterSecretStore` into each matching managed control plane, which is what you reference in your Shared External Secret.
{{< /hint >}}

{{< editCode >}}
```yaml
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: my-secret
  namespace: default
spec:
  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      name: aws-sm
      kind: ClusterSecretStore
    target:
      name: my-secret
    data:
    - secretKey: secret-access-key
      remoteRef:
        key: my-secret
  controlPlaneSelector:
    names:
    - $@<control-plane-name>$@
  namespaceSelector:
    names:
    - default
```
{{< /editCode >}}

Use `spec.controlPlaneSelector` and `spec.namespaceSelector` to configure which control planes and namespaces to project the external secret into, same as for Shared Secret Stores.

## Usage example

This example uses a fake secret store provider to walk you through enabling secrets management.

1. Create two managed control planes in the default group and label them:

```bash
up ctp create ctp1
up ctp create ctp2

kubectl label controlplane ctp1 label=foo
kubectl label controlplane ctp2 label=bar
```

2. Create a Shared Secret Store using the [fake provider](https://external-secrets.io/latest/provider/fake/):

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedSecretStore
metadata:
  name: fake-store
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  provider:
    fake:
      data:
        - key: "/foo/bar"
          value: "HELLO1"
          version: "v1"
        - key: "/foo/bar"
          value: "HELLO2"
          version: "v2"
        - key: "/foo/baz"
          value: '{"john": "doe"}'
          version: "v1"
EOF
```

3. Create a Shared External Secret:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: spaces.upbound.io/v1alpha1
kind: SharedExternalSecret
metadata:
  name: fake-secret
  namespace: default
spec:
  controlPlaneSelector:
    labelSelectors:
      - matchLabels:
          org: foo
  namespaceSelector:
    names:
      - default
  externalSecretSpec:
    refreshInterval: 1h
    secretStoreRef:
      name: fake-store
      kind: ClusterSecretStore
    data:
      - secretKey: "foo"
        remoteRef:
          key: "/foo/bar"
          version: "v1"
EOF
```

<!-- vale off -->
4. Verify the secret is projected in both control planes:
<!-- vale on -->

```bash
up ctx ./ctp1
kubectl get secret fake-secret
kubectl get clustersecretstore
kubectl get clusterexternalsecret

up ctx ../ctp2
kubectl get secret fake-secret
kubectl get clustersecretstore
kubectl get clusterexternalsecret
```

## Configure secrets directly in a control plane

When you enable the Shared Secrets feature in a Space, the [External Secrets Operator](https://external-secrets.io/latest/) automatically gets deployed in each managed control plane.

<!-- vale off -->
The above explains using group-scoped resources to project secrets into multiple control planes. You can also use ESO API types directly in a control plane as you would in standalone Crossplane or Kubernetes.
<!-- vale on -->

See the [ESO documentation](https://external-secrets.io/latest/introduction/getting-started/) for a full guide on using the API types.
