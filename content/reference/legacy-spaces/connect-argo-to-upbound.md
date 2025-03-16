---
title: (deprecated) Connect Argo to Upbound
weight: 10
description: A tutorial for connecting Argo to a control plane.
aliases:
    - /deploy/legacy-spaces/connect-argo-to-upbound
---

{{< hint "important" >}}
This tutorial is deprecated and only applicable to users running in Upbound's Legacy Space.
{{< /hint >}}

In this tutorial, you learn how to create a control plane in Upbound and connect it to [Argo CD](https://argoproj.github.io/cd/). Argo CD is a continuous delivery tool for Kubernetes that you can use to deliver configurations to control planes in Upbound.

## Prerequisites

To complete this tutorial, you need the following:

<!-- vale Upbound.Spelling = NO -->
- An [account in Upbound](https://accounts.upbound.io/register).
<!-- vale Upbound.Spelling = NO -->
- Have already deployed an instance of Argo CD on a Kubernetes cluster (or using a hosted service such as [Akuity](https://akuity.io/)).
<!-- vale Upbound.Spelling = YES -->
- The [up CLI]({{<ref "reference/cli/#install-the-up-command-line" >}}) on your local machine.
<!-- vale Upbound.Spelling = YES -->



## Create a control plane

Create a new control plane inside your Upbound account.

{{< tabs >}}

{{< tab "up CLI" >}}
Run the following command in a terminal:

```bash
up ctp create my-control-plane
```
{{< /tab >}}

{{< tab "Upbound Console" >}}
In the Upbound Console, select the `Create Control Plane` button. Give the control plane a name and select the `Create Control Plane` button at the bottom of the form.

{{<img src="/deploy/spaces/images/console-ctp-create.jpeg" alt="Create control plane in Console">}}
{{< /tab >}}

{{< /tabs >}}

## Fetch the control plane's connection details

To add the control plane as a target context in Argo, you need its connection details. You need to generate a kubeconfig for your control plane.

### Create a personal access token

<!-- vale Google.FirstPerson = NO -->
You need a personal access token (PAT) to generate a kubeconfig. You create PATs on a per-user basis in the Upbound Console. Go to [My Account - API tokens](https://accounts.upbound.io/settings/tokens) and select `Create New Token`. Give the token a name and save the secret value to somewhere safe.
<!-- vale Google.FirstPerson = YES -->

### Generate a kubeconfig

Run the following command in a terminal:

{{< editCode >}}
```ini
export UPBOUND_MCP_PATH="$@org-name/space-name/group-name/mcp-name$@"
export UPBOUND_CTP_KUBECONFIG="$@mcp-kubeconfig.yaml$@"
up ctx "${UPBOUND_MCP_PATH}" -f "${UPBOUND_CTP_KUBECONFIG}"
```
{{< /editCode >}}

This command saves the kubeconfig for the control plane to a file in your working directory.

## Add the control plane as a context to Argo

Switch contexts to the Kubernetes cluster where you've installed Argo. Create a secret on the Argo cluster whose data contains the connection details fetched from the previous step.

{{< hint "important" >}}
Make sure the following commands are executed against your **Argo** cluster, not your control plane.
{{< /hint >}}

Run the following command in a terminal:

{{< editCode >}}
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
  server: https://<space-name>.space.mxe.upbound.io/apis/spaces.upbound.io/v1beta1/namespaces/<group>/controlplanes/clusters/k8s
  config: |
    {
      "bearerToken": "${UPBOUND_API_TOKEN}",
      "tlsClientConfig": {
        "insecure": true
      }
    }
EOF
```
{{< /editCode >}}

## Create an Argo Application

Use the Argo CD `Application` resource to represent a Git repository that contains Crossplane configuration objects you want deployed on your control plane.

Keeping your context pointed at the Argo cluster, run the following command in a terminal:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: control-plane-config
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/upbound/mcp-config-argo.git
    targetRevision: HEAD
    path: configuration
  destination:
    name: my-control-plane-context
EOF
```

This application points at a sample repository that contains a reference Crossplane configuration.

## Inspect the configuration of your control plane

Once synced, Argo installs the configuration on your control plane in Upbound. You can confirm this by switching your kubeconfig context back to your control plane. Then run the following command in a terminal:

```bash {copy-lines="none"}
kubectl get configuration

# The output should look like this:
NAME                                      INSTALLED   HEALTHY   PACKAGE                                                          AGE
platform-ref-aws                          True        True      xpkg.upbound.io/upbound/platform-ref-aws:v0.9.0                  2m51s
upbound-configuration-app                 True        True      xpkg.upbound.io/upbound/configuration-app:v0.2.0                 2m43s
upbound-configuration-aws-database        True        True      xpkg.upbound.io/upbound/configuration-aws-database:v0.5.0        2m47s
upbound-configuration-aws-eks             True        True      xpkg.upbound.io/upbound/configuration-aws-eks:v0.5.0             2m45s
upbound-configuration-aws-network         True        True      xpkg.upbound.io/upbound/configuration-aws-network:v0.7.0         2m49s
upbound-configuration-gitops-flux         True        True      xpkg.upbound.io/upbound/configuration-gitops-flux:v0.2.0         2m40s
upbound-configuration-observability-oss   True        True      xpkg.upbound.io/upbound/configuration-observability-oss:v0.2.0   2m42s
```
