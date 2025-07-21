---
title: API Connector
weight: 90
description: Connect Kubernetes clusters to remote Crossplane control planes for resource synchronization
aliases:
    - /api-connector
    - /concepts/api-connector
---

:::warning
API Connector is currently in **Alpha**. The feature is under active development and subject to breaking changes. Use for testing and evaluation purposes only.
:::

API Connector enables seamless integration between Kubernetes application clusters consuming APIs and remote Crossplane control planes providing and reconciling APIs. This component allows you to decouple where Crossplane is running (for example in a managed control plane), and where APIs are consumed (for example in an existing Kubernetes cluster). Thus can you achieve flexibility and consistency in terms of operation.

Unlike the [Control Plane Connector](ctp-connector.md) which focuses on managed control planes, API Connector provides a more flexible solution for connecting to any Crossplane-enabled cluster. But for now it's only supported for managed control planes.

## Architecture overview

![API Connector Architecture](images/api-connector.png)

API Connector uses a **provider-consumer** model:

- **Provider control plane**: The remote cluster running Crossplane that provides APIs and manages infrastructure. It can for example be a managed control plane from Upbound Spaces.
- **Consumer cluster**: Any Kubernetes cluster where its users wants to use APIs provided by the provider control plane, without having to run Crossplane. API connector is installed in the consumer cluster, and bidirectionally syncs API objects to the provider.

### Key components

**Custom Resource Definitions (CRDs)**:
- `ClusterConnection`: Establishes a connection from the consumer to the provider cluster. Pulls bindable CRD APIs from the provider into the consumer cluster for use.
- `ClusterAPIBinding`: Instructs API connector to sync all API objects cluster-wide with a given API group to a given provider cluster.
- `APIBinding`: Namespaced version of `ClusterAPIBinding`. Instructs API connector to sync API objects within a given namespace and with a given API group to a given provider cluster.

## Prerequisites

Before using API Connector, ensure:

1. **Provider control plane** has Crossplane installed and configured
1. **Consumer cluster** has network access to the provider control plane
1. You have an license to use API connector. If you are unsure, [contact Upbound](https://www.upbound.io/contact) or your sales representative.

This getting started guide has two parallel paths that may be taken, an automated, one-click path for connecting any Kubernetes cluster to managed control planes in Upbound Cloud, or a manual path for connecting to any Crossplane-enabled provider cluster.

## Publishing APIs in the provider cluster

First, log into your provider control plane, where Crossplane is running, and choose which CRD APIs you want to make accessible to the consumer cluster's. API connector will only ever sync these "bindable" CRDs.


<Tabs>
<TabItem value="upbound-cloud" label="Upbound Cloud">

```bash
up login
```

```bash
up ctx <organization-name/space-name/group/provider-control-plane-name>
```

Check what CRDs are available

```bash
kubectl get crds
``` 

Label all CRDs you want to publish with the bindable label

```bash
kubectl label crd <crd-name> 'connect.upbound.io/bindable'='true' --overwrite
```

</TabItem>
<TabItem value="manual" label="Manual">

Change context to the provider cluster
```bash
kubectl config set-context <provider-cluster-context>
```

Check what CRDs are available
```bash
kubectl get crds
```

Label all CRDs you want to publish with the bindable label
```bash
kubectl label crd <CRD API name> 'connect.upbound.io/bindable'='true' --overwrite
```
</TabItem>
</Tabs>

## Installation

<Tabs>
<TabItem value="up-cli" label="up CLI">

The up CLI provides the simplest installation method with automatic configuration:

Make sure the current Kubeconfig context is set to the **provider control plane**
```bash
up ctx <organization-name/space-name/group/provider-control-plane-name>

up controlplane api-connector install --consumer-kubeconfig <consumer-cluster-kubeconfig> [OPTIONS]
```

The command:
1. creates a Robot account (named `<provider-control-plane-name>`) in the Upbound Cloud organization `<organization-name>`,
1. Gives the created robot account `admin` permissions to the provider control plane `<provider-control-plane-name>`
1. Generates a JWT token for the robot account, and stores it in a Kubernetes Secret in the consumer cluster.
1. Installs the API connector Helm chart in the consumer cluster.
1. Creates a `ClusterConnection` object in the consumer cluster, referring to the newly generated Secret, so that API connector can authenticate successfully to the provider control plane.
1. API connector will pull all CRDs that are published in the previous step into the consumer cluster.

**Example**:
```bash
up controlplane api-connector install \
  --consumer-kubeconfig ~/.kube/config \
  --consumer-context my-cluster \
  --upbound-token <your-token>
```

Command uses provided token to authenticate with the **Provider control plane**
and create a `ClusterConnection` resource in the **Consumer cluster** to connect to the
**Provider control plane**. 

**Key Options**:
- `--consumer-kubeconfig`: Path to consumer cluster kubeconfig (required)
- `--consumer-context`: Context name for consumer cluster (required)
- `--name`: Custom name for connection resources (optional)
- `--upbound-token`: API token for authentication (optional)
- `--upgrade`: Upgrade existing installation (optional)
- `--version`: Specific version to install (optional)

</TabItem>
<TabItem value="manual" label="Manual">

For manual installation or custom configurations:

```bash
helm upgrade --install api-connector oci://xpkg.upbound.io/spaces-artifacts/api-connector \
  --namespace upbound-system \
  --create-namespace \
  --version <version> \
  --set consumerClusterDisplayName=<cluster-name>
```

### Authentication Methods

API Connector supports two authentication methods:

<Tabs>
<TabItem value="upbound-robot-token" label="Upbound Robot Token">

For Upbound Spaces integration:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: spaces-secret
  namespace: upbound-system
type: Opaque
stringData:
  token: <robot-token>
  organization: <organization-name>
  spacesBaseURL: <spaces-base-url>
  controlPlaneGroupName: <control-plane-group-name>
  controlPlaneName: <control-plane-name>
```
</TabItem>
<TabItem value="kubeconfig" label="Kubeconfig">

For direct cluster access:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: provider-kubeconfig
  namespace: upbound-system
type: Opaque
data:
  kubeconfig: <base64-encoded-kubeconfig>
```
</TabItem>
</Tabs>


### Connection Setup

Create a `ClusterConnection` to establish connectivity:

<Tabs>
<TabItem value="upbound-token" label="Upbound Token">

```yaml
apiVersion: connect.upbound.io/v1alpha1
kind: ClusterConnection
metadata:
  name: spaces-connection
  namespace: upbound-system
spec:
  secretRef:
    kind: UpboundRobotToken
    name: spaces-secret
    namespace: upbound-system
  crdManagement:
    pullBehavior: Pull
```

</TabItem>
<TabItem value="kubeconfig" label="Kubeconfig">

```yaml
apiVersion: connect.upbound.io/v1alpha1
kind: ClusterConnection
metadata:
  name: provider-connection
  namespace: upbound-system
spec:
  secretRef:
    kind: KubeConfig
    name: provider-kubeconfig
    namespace: upbound-system
  crdManagement:
    pullBehavior: Pull
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

### Configuration

Bind APIs to make them available in your consumer cluster:

```yaml
apiVersion: connect.upbound.io/v1alpha1
kind: ClusterAPIBinding
metadata:
  name: <api-group-name>
spec:
  connectionRef:
    kind: ClusterConnection
    name: <provider-controlplane-name> # Or --name value
```

The `ClusterAPIBinding` name must match the **API Group** of the CRD you want to bind.

## Usage Example

After configuration, you can create API objects (in the consumer cluster) that will be synchronized to the provider cluster:

```yaml
apiVersion: nop.example.org/v1alpha1
kind: NopResource
metadata:
  name: my-resource
  namespace: default
spec:
  coolField: "Synchronized resource"
  compositeDeletePolicy: Foreground
```

Verify the resource status:

```bash
kubectl get nopresource my-resource -o yaml
```
When the `APIBound=True` condition is present, it means that the API object has been synced to the provider cluster, and is being reconciled there. Whenever the API object in the provider cluster gets status updates (for example `Ready=True`), that status is synced back to the consumer cluster.

Switch contexts to the provider cluster to see the API object being created:

```bash
up ctx <organization-name/space-name/group/provider-control-plane-name>
# or kubectl config set-context <provider-cluster-context>
```

```bash
kubectl get nopresource my-resource -o yaml
```

Note that in the provider cluster, the API object is labeled with information on where the API object originates from, and `connect.upbound.io/managed=true`.
## Monitoring and Troubleshooting

### Check Connection Status

```bash
kubectl get clusterconnection
```

Expected output:
```
NAME                 STATUS   MESSAGE
spaces-connection    Ready    Provider controlplane is available
```

### View Available APIs

```bash
kubectl get clusterconnection spaces-connection -o jsonpath='{.status.offeredAPIs[*].name}'
```

### Check API Binding Status

```bash
kubectl get clusterapibinding
```

### Debug Resource Synchronization

```bash
kubectl describe <resource-type> <resource-name>
```

## Removal

### Using the up CLI

```bash
up controlplane api-connector uninstall \
  --consumer-kubeconfig ~/.kube/config \
  --all
```

The `--all` flag removes all resources including connections and secrets.
Without the flag, only runtime related resources won't be removed.

**Note**: Uninstall won't remove any API objects in the provider control plane. If you want to clean up all API objects there, delete all API objects from the consumer cluster before API connector uninstallation, and wait for the objects to get deleted.

### Using Helm

```bash
helm uninstall api-connector -n upbound-system
```

## Limitations

- **Alpha maturity**: Subject to breaking changes. Not yet production grade.
- **CRD updates**: CRDs are pulled once but not automatically updated. If multiple Crossplane clusters offer the same CRD API, API changes must be synchronized out of band, for example using a [Crossplane Configuration](https://docs.crossplane.io/latest/concepts/packages/).
- **Network requirements**: Consumer cluster must have direct network access to provider cluster.
- **Wide permissions needed in consumer cluster**: Because the API connector doesn't know up front the names of the APIs it needs to reconcile, it currently runs with full "root" privileges in the consumer cluster.
- **Connector polling**: API Connector for checks for drift between the consumer and provider cluster
   periodically through polling. The poll interval can be changed with the `pollInterval` Helm value.

## Advanced Configuration

### Multiple Connections

You can connect to multiple provider clusters simultaneously by creating multiple `ClusterConnection` resources with different names and configurations.