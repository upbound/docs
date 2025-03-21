---
title: Authentication
weight: 10
description: Authentication options with the Upbound Kubernetes official provider
---

The Upbound Official Kubernetes Provider supports many authentication methods.

* [Upbound Identity]({{<ref "connect/oidc" >}})
* Injected Identity
* Kubeconfigs
* AWS, Azure, and GCP auth mechanisms

## Upbound Identity

{{< hint "note" >}}
This method of authentication is only supported in control planes running on [Upbound Cloud Spaces]({{<ref "deploy" >}})
{{< /hint >}}

Use this auth mechanism when you want to use a control plane with provider-kubernetes to interact with [Upbound APIs]({{<ref "connect/gitops/#gitops-for-upbound-resources" >}}). Upbound Identity can be configured to use the following to authenticate with Upbound:

- a user's personal access token (PAT) 
- a token generated from a robot

<!-- vale Google.Headings = NO -->
### Create an access token

{{< tabs "hints" >}}

{{< tab "Robot Token">}}
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
4. Assign the robot [to a team]({{<ref "operate/accounts/identity-management/robots/#assign-a-robot-to-a-team" >}}) and use Upbound RBAC to [grant the team a role]({{<ref "operate/accounts/authorization/upbound-rbac/#assign-group-role-permissions" >}}) for permissions.
{{< /tab >}}

{{< tab "Personal Access Token">}}
Create a [personal access token](https://accounts.upbound.io/settings/tokens) and store it as an environment variable.

{{< editCode >}}
```ini
export UPBOUND_TOKEN="$@<YOUR_API_TOKEN>$@"
```
{{< /editCode >}}
{{< /tab >}}

{{< /tabs >}}
<!-- vale Google.Headings = YES -->

### Generate a kubeconfig for Upbound APIs

Upbound APIs are Kubernetes-compatible. Generate a kubeconfig for the context you want to interact with:

- [Generate a kubeconfig for a Space]({{<ref "operate/cli/contexts/#generate-a-kubeconfig-for-a-space" >}})
- [Generate a kubeconfig for a control plane in a Space]({{<ref "operate/cli/contexts/#generate-a-kubeconfig-for-a-control-plane-in-a-group" >}})

Set the desired context path below depending on your use case. Generate a kubeconfig according to the token method you followed in the prior section.

{{< tabs "hints" >}}

{{< tab "Robot">}}
1. Login to Upbound with the robot access token:
```ini
up login -t $UPBOUND_TOKEN
```
2. Set your Upbound context:
```ini
up ctx $@<org>/<space>>/<group>/<control-plane>$@
up ctx . -f - > upbound-context.yaml
```
{{< /tab >}}

{{< tab "User account">}}
1. Login to Upbound:
```ini
up login
```
2. Set your Upbound context:
```ini
up ctx $@<org>/<space>>/<group>/<control-plane>$@
up ctx . -f - > upbound-context.yaml
```
{{< /tab >}}

{{< /tabs >}}

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

Create a
{{<hover label="pc-upbound-auth" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="pc-upbound-auth" line="18">}}UpboundTokens{{</hover>}}.

Supply the {{<hover label="pc-upbound-auth" line="9">}}cluster-config{{</hover>}} and {{<hover label="pc-upbound-auth" line="15">}}upbound-credentials{{</hover>}} secrets created in the earlier section.

{{<hint "tip" >}}
To apply Upbound based authentication by default name the ProviderConfig
{{<hover label="pc-upbound-auth" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc-upbound-auth"}
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

Create a
{{<hover label="pc-injected-identity" line="2">}}ProviderConfig{{</hover>}} to set the
provider authentication method to
{{<hover label="pc-injected-identity" line="7">}}InjectedIdentity{{</hover>}}.

{{<hint "tip" >}}
To apply Injected Identity authentication by default name the ProviderConfig
{{<hover label="pc-injected-identity" line="4">}}default{{</hover>}}.
{{< /hint >}}

```yaml {label="pc-injected-identity"}
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

Read the [provider-kubernetes examples](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.17.1/resources/kubernetes.crossplane.io/ProviderConfig/v1alpha1) for examples of how to configure the provider with other auth mechanisms.
