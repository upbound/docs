---
title: GitOps with control planes
weight: 90
description: An introduction to doing GitOps with control planes on Upbound
aliases:
    - /mcp/gitops
    - /spaces/control-plane-connector
    - mcp/gitops
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. Upbound's control planes are compatible with this pattern and it's strongly recommended you integrate GitOps in the platforms you build on Upbound.

<!-- vale Google.Headings = NO -->
## Integrate with Argo CD
<!-- vale Google.Headings = YES -->

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) is a project in the Kubernetes ecosystem commonly used for GitOps. You can use it in tandem with Upbound control planes to achieve GitOps flows. The sections below explain how to integrate these tools with Upbound.

How you integrate Argo with Upbound depends on which Space type you're running your control plane in. Follow the instructions according to your Space type.

<!-- vale Google.Headings = NO -->
### Cloud and Connected Spaces
<!-- vale Google.Headings = YES -->

#### Generate a kubeconfig for your control plane

Use the up CLI to [generate a kubeconfig]({{<ref "operate/cli/contexts.md#storing-a-context-to-a-file" >}}) for your control plane.

```bash
up ctx <org-name>/<space-name>/<group-name>/<control plane> -f - > context.yaml
```

#### Create an API token

<!-- vale Google.FirstPerson = NO -->
You need a personal access token (PAT). You create PATs on a per-user basis in the Upbound Console. Go to [My Account - API tokens](https://accounts.upbound.io/settings/tokens) and select Create New Token. Give the token a name and save the secret value to somewhere safe.
<!-- vale Google.FirstPerson = YES -->

#### Add the up CLI init container to Argo

Create a new file called `up-plugin-values.yaml` and paste the following YAML:

```yaml
controller:
  volumes:
    - name: up-plugin
      emptyDir: {}
    - name: up-home
      emptyDir: {}

  volumeMounts:
    - name: up-plugin
      mountPath: /usr/local/bin/up
      subPath: up
    - name: up-home
      mountPath: /home/argocd/.up

  initContainers:
    - name: up-plugin
      image: xpkg.upbound.io/upbound/up-cli:v0.39.0-0.rc.0.102.g3f384b68
      command: ["cp"]
      args:
        - /usr/local/bin/up
        - /plugin/up
      volumeMounts:
        - name: up-plugin
          mountPath: /plugin

server:
  volumes:
    - name: up-plugin
      emptyDir: {}
    - name: up-home
      emptyDir: {}

  volumeMounts:
    - name: up-plugin
      mountPath: /usr/local/bin/up
      subPath: up
    - name: up-home
      mountPath: /home/argocd/.up

  initContainers:
    - name: up-plugin
      image: xpkg.upbound.io/upbound/up-cli:v0.39.0-0.rc.0.102.g3f384b68
      command: ["cp"]
      args:
        - /usr/local/bin/up
        - /plugin/up
      volumeMounts:
        - name: up-plugin
          mountPath: /plugin
```

#### Install or upgrade Argo using the values file

Install or upgrade Argo via Helm, including the values from the `up-plugin-values.yaml` file:

```bash
helm upgrade --install -n argocd -f up-plugin-values.yaml --reuse-values argocd argo/argo-cd
```

<!-- vale Google.Headings = NO -->
#### Configure Argo CD
<!-- vale Google.Headings = YES -->

To configure Argo CD for Annotation resource tracking, edit the Argo CD ConfigMap in the Argo CD namespace.
Add `application.resourceTrackingMethod: annotation` to the data section as below.
This configuration turns off Argo CD auto pruning, preventing the deletion of Crossplane resources.

Next, configure the [auto respect RBAC for the Argo CD controller](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#auto-respect-rbac-for-controller).
By default, Argo CD attempts to discover some Kubernetes resource types that don't exist in a control plane.
You must configure Argo CD to respect the cluster's RBAC rules so that Argo CD can sync.
Add `resource.respectRBAC: normal` to the data section as below.

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  ...
  application.resourceTrackingMethod: annotation
  resource.respectRBAC: normal
```

{{< hint "tip" >}}
The `resource.respectRBAC` configuration above tells Argo to respect RBAC for _all_ cluster contexts. If you're using an Argo CD instance to manage more than only control planes, you should consider changing the `clusters` string match for the configuration to apply only to control planes. For example, if every control plane context name followed the convention of being named `controlplane-<name>`, you could set the string match to be `controlplane-*`
{{< /hint >}}

<!-- vale Google.Headings = NO -->
#### Create a cluster context definition
<!-- vale Google.Headings = YES -->

Replace the variables and run the following script to configure a new Argo cluster context definition.

To configure Argo for a control plane in a Connected Space, replace `stringData.server` with the ingress URL of the control plane. This URL is what's outputted when using `up ctx`.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-control-plane
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: cluster
type: Opaque
stringData:
  name: my-control-plane-context
  server: https://<space-name>.space.mxe.upbound.io/apis/spaces.upbound.io/v1beta1/namespaces/<group>/controlplanes/<control plane>/k8s
  config: |
    {
      "execProviderConfig": {
        "apiVersion": "client.authentication.k8s.io/v1",
        "command": "up",
        "args": [ "org", "token" ],
        "env": {
          "ORGANIZATION": "<org>",
          "UP_TOKEN": "<api token>"
        }
      },
      "tlsClientConfig": {
        "insecure": false,
        "caData": "<base64 encoded certificate>"
      }
    }
```

<!-- vale Google.Headings = NO -->
### Disconnected Spaces
<!-- vale Google.Headings = YES -->

#### Configure connection secrets for control planes

You can configure control planes to write their connection details to a secret. Do this by setting the [`spec.writeConnectionSecretToRef`](https://docs.upbound.io/reference/space-api/#ControlPlane-spec-writeConnectionSecretToRef) field in a control plane manifest. For example:

```yaml
apiVersion: spaces.upbound.io/v1beta1
kind: ControlPlane
metadata:
  name: ctp1
  namespace: default
spec:
  writeConnectionSecretToRef:
    name: kubeconfig-ctp1
    namespace: default
```

<!-- vale Google.Headings = NO -->
#### Configure Argo CD
<!-- vale Google.Headings = YES -->

To configure Argo CD for Annotation resource tracking, edit the Argo CD ConfigMap in the Argo CD namespace.
Add `application.resourceTrackingMethod: annotation` to the data section as below.

Next, configure the [auto respect RBAC for the Argo CD controller](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#auto-respect-rbac-for-controller).
By default, Argo CD attempts to discover some Kubernetes resource types that don't exist in a control plane.
You must configure Argo CD to respect the cluster's RBAC rules so that Argo CD can sync.
Add `resource.respectRBAC: normal` to the data section as below.

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  ...
  application.resourceTrackingMethod: annotation
  resource.respectRBAC: normal
```

{{< hint "tip" >}}
The `resource.respectRBAC` configuration above tells Argo to respect RBAC for _all_ cluster contexts. If you're using an Argo CD instance to manage more than only control planes, you should consider changing the `clusters` string match for the configuration to apply only to control planes. For example, if every control plane context name followed the convention of being named `controlplane-<name>`, you could set the string match to be `controlplane-*`
{{< /hint >}}

<!-- vale Google.Headings = NO -->
#### Create a cluster context definition
<!-- vale Google.Headings = YES -->

Once the control plane is ready, extract the following values from the secret containing the kubeconfig:

```bash
kubeconfig_content=$(kubectl get secrets kubeconfig-ctp1 -n default -o jsonpath='{.data.kubeconfig}' | base64 -d)
server=$(echo "$kubeconfig_content" | grep 'server:' | awk '{print $2}')
bearer_token=$(echo "$kubeconfig_content" | grep 'token:' | awk '{print $2}')
ca_data=$(echo "$kubeconfig_content" | grep 'certificate-authority-data:' | awk '{print $2}')
```

Generate a new secret in the cluster where you installed Argo, using the prior values extracted:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: ctp-secret
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: cluster
type: Opaque
stringData:
  name: ctp
  server: $server
  config: |
    {
      "bearerToken": "$bearer_token",
      "tlsClientConfig": {
        "insecure": false,
        "caData": "$ca_data"
      }
    }
EOF
```

<!-- vale Google.Headings = NO -->
## GitOps for Upbound resources
<!-- vale Google.Headings = YES -->

Like any other cloud service, you can drive the lifecycle of Upbound Cloud resources with Crossplane. This lets you establish GitOps flows to declaratively create and manage:

- [control plane groups]({{<ref "/operate/groups/" >}})
- [control planes]({{<ref "learn/core-concepts/control-planes/" >}})
- [Upbound IAM resources]({{<ref "operate/accounts/" >}})

Use a control plane installed with [provider-upbound](https://marketplace.upbound.io/providers/upbound/provider-upbound) and [provider-kubernetes](https://marketplace.upbound.io/providers/upbound/provider-kubernetes) to achieve this.

### Provider-upbound

[Provider-upbound](https://marketplace.upbound.io/providers/upbound/provider-upbound) is a Crossplane provider built by Upbound to interact with Upbound resources. use _provider-upbound_ to declaratively create and manage the lifecycle of IAM resources and repositories:

- [Robots](https://marketplace.upbound.io/providers/upbound/provider-upbound/v0.8.0/resources/iam.upbound.io/Robot/v1alpha1) and their membership to teams
- [Teams](https://marketplace.upbound.io/providers/upbound/provider-upbound/v0.8.0/resources/iam.upbound.io/Team/v1alpha1)
- [Repositories](https://marketplace.upbound.io/providers/upbound/provider-upbound/v0.8.0/resources/repository.upbound.io/Repository/v1alpha1) and [permissions](https://marketplace.upbound.io/providers/upbound/provider-upbound/v0.8.0/resources/repository.upbound.io/Permission/v1alpha1) on those repositories.

{{<hint "tip">}}
This provider defines managed resources for control planes, their auth, and permissions. These resources only applicable for customers who run in Upbound's **Legacy Spaces** control plane hosting environments. Customers should use provider-kubernetes explained below to manage the lifecycle of control planes with Crossplane.
{{</hint>}}

### Provider-kubernetes

[Provider-kubernetes](https://marketplace.upbound.io/providers/upbound/provider-kubernetes) is a Crossplane provider that defines an [Object](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.17.0/resources/kubernetes.crossplane.io/Object/v1alpha2) resource. Use _Objects_ as general-purpose resources to wrap _any_ Kubernetes resource for Crossplane to manage.

Upbound [Space APIs]({{<ref "/reference/space-api/" >}}) are Kube-like APIs and have implemented support for most Kubernetes-style API concepts. You can use kubectl or any other Kubernetes-compatible tooling to interact with the API. This means you can use _provider-kubernetes_ to drive interactions with Space APIs.

{{<hint "important">}}
When interacting with a Cloud Space's API, the Kubernetes [watch](https://kubernetes.io/docs/reference/using-api/api-concepts/#watch-bookmarks) feature **isn't implemented.** Argo CD requires _watch_ support to function as expected, meaning you can't point Argo directly at a Cloud Space until it's implemented.
{{</hint>}}

Use _provider-kubernetes_ to declaratively drive interactions with all [Space APIs]({{<ref "/reference/space-api/" >}}). Wrap the desired API resource in an _Object_. See the example below for a control plane:

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha2
kind: Object
metadata:
  name: my-controlplane
spec:
  forProvider:
    manifest:
      apiVersion: spaces.upbound.io/v1beta1
      kind: ControlPlane
      metadata:
        name: my-controlplane
        namespace: default
      spec:
        crossplane:
          autoUpgrade:
            channel: Rapid
```

[Control plane groups]({{<ref "/operate/groups/" >}}) are a special case because they technically map to an underlying Kubernetes namespace. You should create a `kind: namespace` with the  `spaces.upbound.io/group` label to create a control plane group in a Space. See the example below:

```yaml
apiVersion: kubernetes.crossplane.io/v1alpha2
kind: Object
metadata:
  name: group1
spec:
  forProvider:
    manifest:
      apiVersion: v1
      kind: Namespace
      metadata:
        name: group1
        labels:
          spaces.upbound.io/group: "true"
      spec: {}
```

### Configure auth for provider-kubernetes

Like any other Crossplane provider, _provider-kubernetes_ requires a valid [ProviderConfig](https://marketplace.upbound.io/providers/upbound/provider-kubernetes/v0.17.0/resources/kubernetes.crossplane.io/ProviderConfig/v1alpha1) to authenticate with Upbound before interacting with its APIs. Follow the steps below to configure auth for a ProviderConfig on a control plane that you want to use to interact with Upbound resources.

1. Define an environment variable for the name of your Upbound org account. Use `up org list` to retrieve this value.
{{< editCode >}}
```ini
export UPBOUND_ACCOUNT="$@<YOUR_ACCOUNT>$@"
```
{{< /editCode >}}

2.  Create a [personal access token](https://accounts.upbound.io/settings/tokens) and store it as an environment variable.
{{< editCode >}}
```ini
export UPBOUND_TOKEN="$@<YOUR_API_TOKEN>$@"
```
{{< /editCode >}}

3.  Log on to Upbound.
{{< editCode >}}
```ini
up login
```
{{< /editCode >}}

4.  Create a kubeconfig for the desired Cloud Space instance you want to interact with.
{{< editCode >}}
```ini
export CONTROLPLANE_CONFIG=/tmp/controlplane-kubeconfig
KUBECONFIG=$CONTROLPLANE_CONFIG up ctx $UPBOUND_ACCOUNT/upbound-gcp-us-west-1 # Replace this path with whichever Cloud Space you want to communicate with.
```
{{< /editCode >}}

5. On the control plane you want to use to interact with Upbound resources, create a secret containing the credentials:
{{< editCode >}}
```ini
kubectl -n crossplane-system create secret generic cluster-config --from-file=kubeconfig=$CONTROLPLANE_CONFIG
kubectl -n crossplane-system create secret generic upbound-credentials --from-literal=token=$UPBOUND_TOKEN
```
{{< /editCode >}}

6. Create a ProviderConfig that references the credentials created in the prior step. Create this resource in your control plane:
{{< editCode >}}
```yaml
apiVersion: kubernetes.crossplane.io/v1alpha1
kind: ProviderConfig
metadata:
  name: default
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: cluster-config
      key: kubeconfig
  identity:
    type: UpboundTokens
    source: Secret
    secretRef:
      name: upbound-credentials
      namespace: crossplane-system
      key: token
```
{{< /editCode >}}

You can now create _Objects_ in the control plane which wrap Space APIs.

