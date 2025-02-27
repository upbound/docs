---
title: GitOps with control planes
weight: 90
description: An introduction to doing GitOps with control planes on Upbound
aliases:
    - /mcp/gitops
    - /spaces/control-plane-connector
    - mcp/gitops
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. Upbound's managed control planes are compatible with this pattern and it's strongly recommended you integrate GitOps in the platforms you build on Upbound.

<!-- vale Google.Headings = NO -->
## Integrate with Argo CD
<!-- vale Google.Headings = YES -->

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) is a project in the Kubernetes ecosystem commonly used for GitOps. You can use it in tandem with Upbound managed control planes to achieve GitOps flows. The sections below explain how to integrate these tools with Upbound.

How you integrate Argo with Upbound depends on which Space type you're running your control plane in. Follow the instructions according to your Space type.

<!-- vale Google.Headings = NO -->
### Cloud and Connected Spaces
<!-- vale Google.Headings = YES -->

#### Generate a kubeconfig for your MCP

Use the up CLI to [generate a kubeconfig]({{<ref "reference/cli/contexts.md#storing-a-context-to-a-file" >}}) for your managed control plane.

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
      command:
        - sh
        - -c
      args:
        - wget -qO /plugin/up https://cli.upbound.io/stable/current/bin/${OS}_${ARCH}/up && chmod +x /plugin/up

      image: alpine:3.8
      env:
        - name: ARCH
          value: arm64
        - name: OS
          value: linux
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
      command:
        - sh
        - -c
      args:
        - wget -qO /plugin/up https://cli.upbound.io/stable/current/bin/${OS}_${ARCH}/up && chmod +x /plugin/up
      image: alpine:3.8
      env:
        - name: ARCH
          value: arm64
        - name: OS
          value: linux
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

To configure Argo CD for Annotation resource tracking, edit the Argo CD ConfigMap in the Argo CD namespace. Add {{<hover label="argocm" line="6">}}application.resourceTrackingMethod: annotation{{</hover>}} to the data section as below:

```bash {label="argocm"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  application.resourceTrackingMethod: annotation
```

This configuration turns off Argo CD auto pruning, preventing the deletion of Crossplane resources.

Next, configure the [auto respect RBAC for the Argo CD controller](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#auto-respect-rbac-for-controller). By default, Argo CD attempts to discover some Kubernetes resource types that don't exist in a managed control plane. You must configure Argo CD to respect cluster's RBAC rules so that Argo CD can sync. Add a {{<hover label="respectrbac" line="7">}}resource.respectRBAC{{</hover>}} to the data section as below.

```bash {label="respectrbac"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  ...
  resource.respectRBAC: normal
```

{{< hint "tip" >}}
The `resource.respectRBAC` configuration above tells Argo to respect RBAC for _all_ cluster contexts. If you're using an Argo CD instance to manage more than only managed control planes, you should consider changing the `clusters` string match for the configuration to apply only to managed control planes. For example, if every managed control plane context name followed the convention of being named `controlplane-<name>`, you could set the string match to be `controlplane-*`
{{< /hint >}}

<!-- vale Google.Headings = NO -->
#### Create a cluster context definition
<!-- vale Google.Headings = YES -->

Replace the variables and run the following script to configure a new Argo cluster context definition.

To configure Argo for an MCP in a Connected Space, replace `stringData.server` with the ingress URL of the control plane. This URL is what's outputted when using `up ctx`.

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

To configure Argo CD for Annotation resource tracking, edit the Argo CD ConfigMap in the Argo CD namespace. Add {{<hover label="argocm" line="6">}}application.resourceTrackingMethod: annotation{{</hover>}} to the data section as below:

```bash {label="argocm"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  application.resourceTrackingMethod: annotation
```

This configuration turns off Argo CD auto pruning, preventing the deletion of Crossplane resources.

Next, configure the [auto respect RBAC for the Argo CD controller](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#auto-respect-rbac-for-controller). By default, Argo CD attempts to discover some Kubernetes resource types that don't exist in a managed control plane. You must configure Argo CD to respect cluster's RBAC rules so that Argo CD can sync. Add a {{<hover label="argocm" line="7">}}resource.respectRBAC{{</hover>}} to the data section as below:

```bash {label="argocm"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  ...
  resource.respectRBAC: normal
```

{{< hint "tip" >}}
The `resource.respectRBAC` configuration above tells Argo to respect RBAC for _all_ cluster contexts. If you're using an Argo CD instance to manage more than only managed control planes, you should consider changing the `clusters` string match for the configuration to apply only to managed control planes. For example, if every managed control plane context name followed the convention of being named `controlplane-<name>`, you could set the string match to be `controlplane-*`
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
