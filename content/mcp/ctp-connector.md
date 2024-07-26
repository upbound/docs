---
title: MCP Connector
weight: 80
description: A guide for how to connect a Kubernetes app cluster to a managed control plane in Upbound using the Control Plane connector feature
aliases:
  - /concepts/control-plane-connector
  - /mcp/control-plane-connector/
---

Upbound's Managed Control Plane Connector (MCP Connector) allows you to make a control plane's APIs available on an app cluster. MCP Connector is for users coming from open source Crossplane and who treated Crossplane as an add-on to an existing Kubernetes application cluster. In that world, users could interact with Crossplane APIs from the same cluster they deploy their applications to. This model breaks when users move their Crossplane instances into a managed solution in Upbound.

MCP Connector connects Kubernetes application clusters---running outside of Upbound--to your managed control planes running in Upbound. This allows you to interact with your managed control plane's API right from the app cluster. The claim APIs you define via `CompositeResourceDefinition`s are available alongside Kubernetes workload APIs like `Pod`. In effect, MCP Connector providers the same experience as a locally installed Crossplane.

{{<img src="all-spaces/spaces/images/GitOps-Up-MCP_Marketecture_Dark_1440w.png" alt="Illustration of MCP Connector" deBlur="true" size="large" lightbox="true">}}

### Managed control plane connector operations

The MCP Connector creates an `APIService` resource in your
Kubernetes cluster for every claim API in your control plane. Your
Kubernetes cluster sends every request for the claim API to the MCP Connector. The MCP Connector
makes the request to the Upbound control plane it's connected to.

The claim APIs are available in your Kubernetes cluster just like
all native Kubernetes API.

### Installation

#### With the up CLI

Log in with the up CLI:

```bash
up login
```

Connect your app cluster to a namespace in an Upbound managed control plane with `up controlplane connector install <control-plane-name> <namespace-to-sync-to>`. This command creates a user token and installs the MCP Connector to your cluster. It's recommended you create a values file called `connector-values.yaml` and provide the following below. Select the tab according to which environment your managed control plane is running in.

{{< tabs >}}

{{< tab "Cloud and Connected Spaces" >}}

```yaml
upbound:
  # This is your org account in Upbound e.g. the name displayed after executing `up org list`
  account: <ORG_ACCOUNT> 
  # This is a personal access token generated in the Upbound Console
  token: <PERSONAL_ACCESS_TOKEN>

spaces:
  # If your MCP is running in Upbound's GCP Cloud Space, else use upbound-aws-us-east-1.space.mxe.upbound.io
  host: "upbound-gcp-us-west-1.space.mxe.upbound.io"
  insecureSkipTLSVerify: true
  controlPlane:
    # The name of the MCP you want the Connector to attach to
    name: <CONTROL_PLANE_NAME> 
    # The control plane group the MCP resides in
    group: <CONTROL_PLANE_GROUP> 
    # The namespace within the MCP to sync claims from the app cluster to. NOTE: This must be created before you install the connector.
    claimNamespace: <NAMESPACE_TO_SYNC_TO> 
```

{{< /tab >}}

{{< tab "Disconnected Spaces" >}}

Create a [kubeconfig]({{<ref "mcp/#connect-directly-to-your-mcp" >}}) for the managed control plane. Write it to a secret in the cluster where you plan to install the MCP Connector to. Reference this secret in the `spaces.controlPlane.kubeconfigSecret` field below.

```yaml
spaces:
  controlPlane:
    # The namespace within the MCP to sync claims from the app cluster to. NOTE: This must be created before you install the connector.
    claimNamespace: <NAMESPACE_TO_SYNC_TO> 
    kubeconfigSecret:
      name: my-controlplane-kubeconfig
      key: kubeconfig
```

{{< /tab >}}

{{< /tabs >}}


Provide the values file above when you run the CLI command:


```bash {copy-lines="3"}
up controlplane connector install my-control-plane my-app-ns-1 --file=connector-values.yaml
```

The Claim APIs from your managed control plane are now visible in the cluster. You can verify this with `kubectl api-resources`.

```bash
kubectl api-resources
```

#### With Helm

The MCP Connector is also available as a Helm chart. First add the Upbound beta repository with the `helm repo add` command.

```bash
helm repo add upbound-beta https://charts.upbound.io/beta
```

Update the local Helm chart cache with `helm repo update`.

```bash
helm repo update
```

Install the MCP Connector Helm chart with `helm install`. Make sure to update the chart values with your own. It's recommended you create a values file called `connector-values.yaml` and provide the following below. Select the tab according to which environment your managed control plane is running in.

{{< tabs >}}

{{< tab "Cloud and Connected Spaces" >}}

```yaml
upbound:
  # This is your org account in Upbound e.g. the name displayed after executing `up org list`
  account: <ORG_ACCOUNT> 
  # This is a personal access token generated in the Upbound Console
  token: <PERSONAL_ACCESS_TOKEN>

spaces:
  # If your MCP is running in Upbound's GCP Cloud Space, else use upbound-aws-us-east-1.space.mxe.upbound.io
  host: "upbound-gcp-us-west-1.space.mxe.upbound.io"
  insecureSkipTLSVerify: true
  controlPlane:
    # The name of the MCP you want the Connector to attach to
    name: <CONTROL_PLANE_NAME> 
    # The control plane group the MCP resides in
    group: <CONTROL_PLANE_GROUP> 
    # The namespace within the MCP to sync claims from the app cluster to. NOTE: This must be created before you install the connector.
    claimNamespace: <NAMESPACE_TO_SYNC_TO> 
```

{{< /tab >}}

{{< tab "Disconnected Spaces" >}}

Create a [kubeconfig]({{<ref "mcp/#connect-directly-to-your-mcp" >}}) for the managed control plane. Write it to a secret in the cluster where you plan to install the MCP Connector to. Reference this secret in the `spaces.controlPlane.kubeconfigSecret` field below.

```yaml
spaces:
  controlPlane:
    # The namespace within the MCP to sync claims from the app cluster to. NOTE: This must be created before you install the connector.
    claimNamespace: <NAMESPACE_TO_SYNC_TO> 
    kubeconfigSecret:
      name: my-controlplane-kubeconfig
      key: kubeconfig
```

{{< /tab >}}

{{< /tabs >}}


Provide the values file above when you `helm install` the MCP Connector:

```bash
helm install --wait mcp-connector upbound-beta/mcp-connector -n kube-system -f connector-values.yaml
```

{{<hint "tip" >}}
Create an API token from the Upbound user account settings page in the console by following [these instructions]({{<ref "console#create-a-personal-access-token" >}}).
{{< /hint >}}

### Uninstall

#### With the up CLI

Disconnect an app cluster that you prior installed the MCP connector on by running the following:

```bash
up ctp connector uninstall <namespace>
```

This command uninstalls the helm chart for the MCP connector from an app cluster. It moves any claims in the app cluster into the managed control plane at the specified namespace.

{{<hint "tip" >}}
Make sure your kubeconfig's current context is pointed at the app cluster where you want to uninstall MCP connector from.
{{< /hint >}}

#### With Helm

You can uninstall MCP connector with Helm by running the following:

```bash
helm uninstall mcp-connector
```

### Example usage

This example creates a control plane using [Configuration EKS](https://github.com/upbound/configuration-eks). `KubernetesCluster` is available as a claim API in your control plane. The following is [an example](https://github.com/upbound/configuration-eks/blob/9f86b6d/.up/examples/cluster.yaml) object you can create in your control plane.

```yaml
apiVersion: k8s.starter.org/v1alpha1
kind: KubernetesCluster
metadata:
  name: my-cluster
  namespace: default
spec:
  id: my-cluster
  parameters:
    nodes:
      count: 3
      size: small
    services:
      operators:
        prometheus:
          version: "34.5.1"
  writeConnectionSecretToRef:
    name: my-cluster-kubeconfig
```

After connecting your Kubernetes app cluster to the managed control plane, you can create the `KubernetesCluster` object in your
app cluster. Although your local cluster has an Object, the actual resources is in your managed control plane inside Upbound.

```bash {copy-lines="3"}
# Applying the claim YAML above.
# kubectl is set up to talk with your Kubernetes cluster.
kubectl apply -f claim.yaml
```

{{<img src="all-spaces/spaces/images/ClaimInCluster.png" alt="Claim in cluster" size="small" lightbox="true">}}

Once Kubernetes creates the object, view the console to see your object.

{{<img src="all-spaces/spaces/images/ClaimInConsole.png" alt="Claim by connector in console" lightbox="true">}}

You can interact with the object through your cluster just as if it
lives in your cluster.

{{<hint "note" >}}
Upbound uses the [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) to allow tools to interact with the remote object as if it was local.
{{< /hint >}}

### Connect multiple app clusters to a managed control plane

Claims are store in a unique namespace in the Upbound managed control plane. Every cluster creates a new MCP namespace.

{{<img src="all-spaces/spaces/images/ConnectorMulticlusterArch.png" alt="Multi-cluster architecture with managed control plane connector" unBlur="true" lightbox="true">}}

There's no limit on the number of clusters connected to a single control plane. Control plane operators can see all their infrastructure in a central control plane.

Without using managed control planes and MCP Connector, users have to install Crossplane and providers for cluster. Each cluster requires configuration for providers with necessary credentials. With a single control plane where multiple clusters connected through
Upbound tokens, you don't need to give out any cloud credentials to the clusters.
