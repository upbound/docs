---
title: Authentication
sidebar_position: 1
description: Authentication options with the Upbound Kubernetes official provider
---


The Upbound Official Kubernetes Provider supports many authentication methods.

* [Upbound Identity][upbound-identity]
* Injected Identity
* Kubeconfigs
* AWS, Azure, and GCP auth mechanisms

## Upbound Identity

:::note
This method of authentication is only supported in control planes running on [Upbound Cloud Spaces][upbound-cloud-spaces]
:::

Use this auth mechanism when you want to use a control plane with provider-kubernetes to interact with [Upbound APIs][upbound-apis]. Upbound Identity can be configured to use the following to authenticate with Upbound:

- a user's personal access token (PAT) 
- a token generated from a robot

<!-- vale Google.Headings = NO -->
### Create an access token

<Tabs>
<TabItem value="robot" label="Robot">
This method creates a Robot, the Upbound-equivalent of a service account, and uses it's identity to authenticate and perform actions.

1. Login to Upbound
```ini
up login
```

2. Create a robot
```ini
up robot create "provider-kubernetes" --description="Robot used for authenticating to Upbound by provider-kubernetes"
```

3. Create and store an access token for this robot as an environment variable:
```ini
export UPBOUND_TOKEN=$(up robot token create "provider-kubernetes" "provider-kubernetes-token" --output=-| awk -F': ' '/Token:/ {print $2}')
```
4. Assign the robot [to a team][to-a-team] and use Upbound RBAC to [grant the team a role][grant-the-team-a-role] for permissions.
</TabItem>

<TabItem value="pat" label="Personal Access Token">
Create a personal access token and store it as an environment variable.

```ini
export UPBOUND_TOKEN="YOUR_API_TOKEN"
```
</TabItem>
</Tabs>
<!-- vale Google.Headings = YES -->

### Generate a kubeconfig for Upbound APIs

Upbound APIs are Kubernetes-compatible. Generate a kubeconfig for the context you want to interact with:

- [Generate a kubeconfig for a Space][generate-a-kubeconfig-for-a-space]
- [Generate a kubeconfig for a control plane in a Space][generate-a-kubeconfig-for-a-control-plane-in-a-space]

Set the desired context path below depending on your use case. Generate a kubeconfig according to the token method you followed in the prior section.

<Tabs>
<TabItem value="robot" label="Robot">

1. Login to Upbound with the robot access token:
```ini
up login -t $UPBOUND_TOKEN
```

2. Set your Upbound context:
```ini
up ctx org/space/group/control-plane
up ctx . -f - > upbound-context.yaml
```

</TabItem>

<TabItem value="user" label="User account">

1. Login to Upbound:
```ini
up login
```

2. Set your Upbound context:
```ini
up ctx org/space/group/control-plane
up ctx . -f - > upbound-context.yaml
```

</TabItem>
</Tabs>

Store the generated context as an environment variable:

```ini
export CONTROLPLANE_CONFIG=upbound-context.yaml
```

### Create secrets to store configs

In the control plane where you've installed provider-kubernetes, store the tokens created in the earlier step as secrets:

```ini
kubectl -n crossplane-system create secret generic cluster-config --from-file=kubeconfig=$CONTROLPLANE_CONFIG
kubectl -n crossplane-system create secret generic upbound-credentials --from-literal=token=$UPBOUND_TOKEN
```

### Create a ProviderConfig

Create a ProviderConfig to set the provider authentication method to UpboundTokens.

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    secretRef:
      key: kubeconfig
      name: cluster-config
      namespace: crossplane-system
    source: Secret
  identity:
    secretRef:
      key: token
      name: upbound-credentials
      namespace: crossplane-system
    source: Secret
    type: UpboundTokens
```

## Injected Identity

Use this auth mechanism when you want to configure a control plane to use provider-kubernetes to manage or interact with resources in itself. Injected Identity configures the provider to use a `cluster-admin` role defined in itself.

### Create a ProviderConfig

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: InjectedIdentity
```

### Create a DeploymentRuntimeConfig

Create a _ClusteRoleBinding_ and _DeploymentRuntimeConfig_ to allow the provider to be granted the `cluster-admin` role.

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: provider-kubernetes
spec:
  serviceAccountTemplate:
    metadata:
      name: provider-kubernetes
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: provider-kubernetes-cluster-admin
subjects:
  - kind: ServiceAccount
    name: provider-kubernetes
    namespace: crossplane-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

Reference this _DeploymentRuntimeConfig_ to complete the configuration of the provider:

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-kubernetes
spec:
  package: xpkg.upbound.io/upbound/provider-kubernetes:v0.16.0
  runtimeConfigRef:
    apiVersion: pkg.crossplane.io/v1beta1
    kind: DeploymentRuntimeConfig
    name: provider-kubernetes
```

## Other auth mechanisms

Read the provider-kubernetes examples for examples of how to configure the provider with other auth mechanisms.

[upbound-identity]: /manuals/platform/oidc
[upbound-cloud-spaces]: /deploy
[upbound-apis]: /connect/gitops/#gitops-for-upbound-resources
[to-a-team]: /operate/accounts/identity-management/robots/#assign-a-robot-to-a-team
[grant-the-team-a-role]: /operate/accounts/authorization/upbound-rbac/#assign-group-role-permissions
[generate-a-kubeconfig-for-a-space]: /operate/cli/contexts/#generate-a-kubeconfig-for-a-space
[generate-a-kubeconfig-for-a-control-plane-in-a-space]: /operate/cli/contexts/#generate-a-kubeconfig-for-a-control-plane-in-a-group
