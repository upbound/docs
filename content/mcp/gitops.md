---
title: GitOps with control planes
weight: 90
description: An introduction to doing GitOps with control planes on Upbound
aliases:
  - /spaces/control-plane-connector
---

GitOps is an approach for managing a system by declaratively describing desired resources' configurations in Git and using controllers to realize the desired state. Upbound's managed control planes are compatible with this pattern and it's strongly recommended you integrate GitOps in the platforms you build on Upbound.

<!-- vale Google.Headings = NO -->
## Integrate with Argo CD 
<!-- vale Google.Headings = YES -->

[Argo CD](https://argo-cd.readthedocs.io/en/stable/) is a project in the Kubernetes ecosystem commonly used for GitOps. You can use it in tandem with Upbound managed control planes to achieve GitOps flows. The sections below explain how to integrate these tools with Upbound.

### Generate a kubeconfig for your MCP

Use the up CLI to [generate a kubeconfig]({{<ref "reference/cli/contexts.md#storing-a-context-to-a-file" >}}) for your managed control plane.

```bash
up ctx <org-name>/<space-name>/<group-name>/<control plane> -f context.yaml
```

### Create an API token

<!-- vale Google.FirstPerson = NO -->
You need a personal access token (PAT). You create PATs on a per-user basis in the Upbound Console. Go to [My Account - API tokens](https://accounts.upbound.io/settings/tokens) and select Create New Token. Give the token a name and save the secret value to somewhere safe.
<!-- vale Google.FirstPerson = YES -->

<!-- vale Google.Headings = NO -->
### Configure Argo CD
<!-- vale Google.Headings = YES -->

To configure Argo CD for Annotation resource tracking, edit the Argo CD ConfigMap in the Argo CD namespace. Add {{<hover label="argoCM" line="3">}}application.resourceTrackingMethod: annotation{{</hover>}} to the data section as below:

```bash {label="argoCM"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
data:
  application.resourceTrackingMethod: annotation
```

This configuration turns off Argo CD auto pruning, preventing the deletion of Crossplane resources.

<!-- vale Google.Headings = NO -->
### Create the cluster definition
<!-- vale Google.Headings = YES -->

Replace the variables and run the following script to configure the Argo cluster definition.

The `tlsClientConfig.caData` should come from the cluster definition in the Kubeconfig. If the CA data field isn't defined in the cluster definition (only `up` in `main` supports this for now), then set `insecure` to `true` and delete the `caData` field.

To configure Argo for an MCP in a single-tenant Upbound Space (Connected or Disconnected), replace `<space-name>` with the Space ingress URL configured for the Space.

```yaml
cat <<EOF | kubectl apply -f -
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
EOF
```

### Add the up CLI init container to Argo

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
        - wget -qO /plugin/up https://cli.upbound.io/build/main/v0.31.0-rc.0.22.gcd944f6/bin/${OS}_${ARCH}/up && chmod +x /plugin/up
      image: alpine:3.8
      env:
        - name: ARCH
          value: arm64 # TODO: fix this upstream https://github.com/upbound/up/issues/530
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
        - wget -qO /plugin/up https://cli.upbound.io/build/main/v0.31.0-rc.0.22.gcd944f6/bin/${OS}_${ARCH}/up && chmod +x /plugin/up
      image: alpine:3.8
      env:
        - name: ARCH
          value: arm64 # TODO: fix this upstream https://github.com/upbound/up/issues/530
        - name: OS
          value: linux
      volumeMounts:
        - name: up-plugin
          mountPath: /plugin
```

### Install Argo using the values file

Install Argo via Helm, including the values from the `up-plugin-values.yaml` file:

```bash
helm upgrade --install -n argocd -f up-plugin-values.yaml argocd argo/argo-cd
```