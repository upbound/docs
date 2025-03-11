---
title: MCP Connector
weight: 80
description: A guide for how to connect a Kubernetes app cluster to a managed control plane in Upbound using the Control Plane connector feature
aliases:
    - /mcp/ctp-connector
    - /concepts/control-plane-connector
    - /mcp/control-plane-connector/
    - mcp/ctp-connector
---

MCP Connector connects arbitrary Kubernetes application clusters outside the
Upbound Spaces to your managed control planes (MCPs) running in Upbound Spaces.
This lets you interact with your MCP's API from the app cluster. The claim APIs
you define via CompositeResourceDefinitions (XRDs) in the MCP, are available in
your app cluster alongside Kubernetes workload APIs like Pod. MCP Connector
enables the same experience as a locally installed Crossplane.

{{<img src="deploy/spaces/images/ConnectorFlow.png" alt="managed control plane connector operations flow" unBlur="true" lightbox="true" size="large">}}

### Managed control plane connector operations

MCP connector leverages the [Kubernetes API AggregationLayer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
to create an extension API server and serve the claim APIs in the MCP. It
discovers the claim APIs available in the MCP and registers corresponding
APIService resources on the app cluster. Those APIService resources refer to the
extension API server of MCP connector.

The claim APIs are available in your Kubernetes cluster, just like all native
Kubernetes APIs.

Every request targeting the claim APIs goes through the MCP connector and the
relevant requests are made to the connected MCP by MCP connector.

The claims created in the app cluster are stored and processed solely at the
connected MCP. No storage is used at the application cluster. The MCP connector
provisions a target namespace at the MCP for the app cluster, and the claims are
stored in the target namespace.

For managing the claims, the MCP Connector creates a unique identifier for a
resource by combining input parameters from claims, including:
- `metadata.name`
- `metadata.namespace`
- `your cluster name`

It employs SHA-256 hashing to generate a hash value and then extracts the first
16 characters of that hash. This ensures the resulting identifier remains within
the 64-character limit in Kubernetes.

For instance, if we have a claim named my-bucket in the test namespace within
the cluster-dev cluster, we'll calculate the SHA-256 hash from
`my-bucket-x-test-x-00000000-0000-0000-0000-000000000000` and take the initial 16
characters. As a result, the name for the claim on the MCP control plane side
will be `claim-c603e518969b413e`

### Installation

{{< tabs >}}
{{< tab "up CLI" >}}

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

Create a [kubeconfig]({{<ref "operate#connect-directly-to-your-mcp" >}}) for the
managed control plane. Write it to a secret in the cluster where you plan to
install the MCP Connector to. Reference this secret in the
`spaces.controlPlane.kubeconfigSecret` field below.

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

<!-- vale Google.WordList = NO -->
Provide the values file above when you run the CLI command:


```bash {copy-lines="3"}
up controlplane connector install my-control-plane my-app-ns-1 --file=connector-values.yaml
```

The Claim APIs from your managed control plane are now visible in the cluster.
You can verify this with `kubectl api-resources`.

```bash
kubectl api-resources
```

### Uninstall

Disconnect an app cluster that you prior installed the MCP connector on by
running the following:

```bash
up ctp connector uninstall <namespace>
```

This command uninstalls the helm chart for the MCP connector from an app
cluster. It moves any claims in the app cluster into the managed control plane
at the specified namespace.

{{<hint "tip" >}}
Make sure your kubeconfig's current context is pointed at the app cluster where
you want to uninstall MCP connector from.
{{< /hint >}}

{{< /tab >}}
{{< tab "Helm" >}}

It's recommended you create a values file called `connector-values.yaml` and
provide the following below. Select the tab according to which environment your
managed control plane is running in.

{{< tabs >}}

{{< tab "Cloud and Connected Spaces" >}}

```yaml
upbound:
  # This is your org account in Upbound e.g. the name displayed after executing `up org list`
  account: <ORG_ACCOUNT>
  # This is a personal access token generated in the Upbound Console
  token: <PERSONAL_ACCESS_TOKEN>

spaces:
  # Upbound GCP US-West-1     upbound-gcp-us-west-1.space.mxe.upbound.io
  # Upbound AWS US-East-1     upbound-aws-us-east-1.space.mxe.upbound.io
  # Upbound GCP US-Central-1  upbound-gcp-us-central-1.space.mxe.upbound.io
  host: "<Upbound Space Region>"
  insecureSkipTLSVerify: true
  controlPlane:
    # The name of the MCP you want the Connector to attach to
    name: <CONTROL_PLANE_NAME>
    # The control plane group the MCP resides in
    group: <CONTROL_PLANE_GROUP>
    # The namespace within the MCP to sync claims from the app cluster to.
    # NOTE: This must be created before you install the connector.
    claimNamespace: <NAMESPACE_TO_SYNC_TO>
```

{{< /tab >}}

{{< tab "Disconnected Spaces" >}}

Create a [kubeconfig]({{<ref "operate#connect-directly-to-your-mcp" >}}) for the
managed control plane. Write it to a secret in the cluster where you plan to
install the MCP Connector to. Reference this secret in the
`spaces.controlPlane.kubeconfigSecret` field below.

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

<!-- vale Google.WordList = YES -->
```bash
helm install --wait mcp-connector oci://xpkg.upbound.io/spaces-artifacts/mcp-connector -n kube-system -f connector-values.yaml
```

{{<hint "tip" >}}
Create an API token from the Upbound user account settings page in the console by following [these instructions]({{<ref "console#create-a-personal-access-token" >}}).
{{< /hint >}}

### Uninstall

You can uninstall MCP connector with Helm by running the following:

```bash
helm uninstall mcp-connector
```

{{< /tab >}}
{{< /tabs >}}


### Example usage

This example creates a control plane using [Configuration
EKS](https://github.com/upbound/configuration-eks). `KubernetesCluster` is
available as a claim API in your control plane. The following is [an
example](https://github.com/upbound/configuration-eks/blob/9f86b6d/.up/examples/cluster.yaml)
object you can create in your control plane.

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

After connecting your Kubernetes app cluster to the managed control plane, you
can create the `KubernetesCluster` object in your app cluster. Although your
local cluster has an Object, the actual resources is in your managed control
plane inside Upbound.

```bash {copy-lines="3"}
# Applying the claim YAML above.
# kubectl is set up to talk with your Kubernetes cluster.
kubectl apply -f claim.yaml


kubectl get claim -A
NAME          SYNCED   READY   CONNECTION-SECRET       AGE
my-cluster    True     True    my-cluster-kubeconfig   2m
```

Once Kubernetes creates the object, view the console to see your object.

{{<img src="deploy/spaces/images/ClaimInConsole.png" alt="Claim by connector in console" lightbox="true">}}

You can interact with the object through your cluster just as if it
lives in your cluster.

### Migration to managed control planes

This guide details the migration of a Crossplane installation to Upbound-managed
control planes using the MCP Connector to manage claims on an application
cluster.

{{<img src="deploy/spaces/images/ConnectorMigration.png" alt="migration flow application cluster to managed control plane" unBlur="true" lightbox="true" size="large">}}

#### Export all Resources

Before proceeding, ensure that you have set the correct kubecontext for your application
cluster.

1. Export

```bash
up alpha migration export --pause-before-export --output=my-export.tar.gz --yes
```

This command performs the following:
- Pauses all claim, composite, and managed resources before export.
- Scans the control plane for resource types.
- Exports Crossplane and native resources.
- Archives the exported state into my-export.tar.gz.

Example output:
```bash
Exporting control plane state...
  ✓   Pausing all claim resources before export... 1 resources paused! ⏸️
  ✓   Pausing all composite resources before export... 7 resources paused! ⏸️
  ✓   Pausing all managed resources before export... 34 resources paused! ⏸️
  ✓   Scanning control plane for types to export... 231 types found! 👀
  ✓   Exporting 231 Crossplane resources...125 resources exported! 📤
  ✓   Exporting 3 native resources...19 resources exported! 📤                                                                 ✓   Archiving exported state... archived to "my-export.tar.gz"! 📦

Successfully exported control plane state!
```

#### Import all Resources

The target managed control plane will be restored with the exported resources
and will serve as the destination for the MCP Connector.

2. Set Up the Managed Control Plane

Ensure you are logged into Upbound and have the correct context:

```bash
up login
up ctx
up ctp create ctp-a
```

Output:
```bash
ctp-a created
```

Verify that the Crossplane version on both the application cluster and the new managed
control plane matches the core Crossplane version.

3. Import Resources

Use the following command to import the resources:
```bash
up alpha migration import -i my-export.tar.gz \
 --unpause-after-import \
 --mcp-connector-cluster-id=my-appcluster \
 --mcp-connector-claim-namespace=my-appcluster
```

This command:
- Note: `--mcp-connector-cluster-id` needs to be uniq per application cluster
- Note: `--mcp-connector-claim-namespace` the namespace will be created during the import
- Restores base resources.
- Waits for XRDs and packages to establish.
- Imports Claims, XRs resources.
- Finalizes the import and unpauses managed resources.

Example output:
```bash
Importing control plane state...
  ✓   Reading state from the archive... Done! 👀
  ✓   Importing base resources... 56 resources imported!📥
  ✓   Waiting for XRDs... Established! ⏳
  ✓   Waiting for Packages... Installed and Healthy! ⏳
  ✓   Importing remaining resources... 88 resources imported! 📥
  ✓   Finalizing import... Done! 🎉
  ✓   Unpausing managed resources ... Done! ▶️

fully imported control plane state!
```

Verify Imported Claims

All claims will be renamed and have additional labels.

```bash
kubectl get claim -A
```

Example output:
```bash
NAMESPACE       NAME                                                        SYNCED   READY   CONNECTION-SECRET             AGE
my-appcluster   cluster.aws.platformref.upbound.io/claim-e708ff592b974f51   True     True    platform-ref-aws-kubeconfig   3m17s
```

Inspect the labels:
```bash
kubectl get -n my-appcluster   cluster.aws.platformref.upbound.io/claim-e708ff592b974f51  -o yaml | yq .metadata.labels
```

Example output:
```bash
mcp-connector.upbound.io/app-cluster: my-appcluster
mcp-connector.upbound.io/app-namespace: default
mcp-connector.upbound.io/app-resource-name: example
```

#### Cleanup App Cluster

4. Remove all Crossplane-related resources from the application cluster, including:
- Managed Resources
- Claims
- Compositions
- XRDs
- Packages (Functions, Configurations, Providers)
- Crossplane and all associated CRDs

#### Install MCP Connector

5. Install MCP Connector

Follow the installation guide in the documentation above, ensuring that
`connector-values.yaml` is correctly configured:

```yaml
# NOTE: clusterID needs to match --mcp-connector-cluster-id used in the import on the managed control Plane
clusterID: my-appcluster
upbound:
  account: <ORG_ACCOUNT>
  token: <PERSONAL_ACCESS_TOKEN>

spaces:
  host: "<Upbound Space Region>"
  insecureSkipTLSVerify: true
  controlPlane:
    name: <CONTROL_PLANE_NAME>
    group: <CONTROL_PLANE_GROUP>
    # NOTE: This is the --mcp-connector-claim-namespace used during the import to the managed control plane
    claimNamespace: <NAMESPACE_TO_SYNC_TO>
```

Once the MCP Connector is successfully installed, verify that resources are
available in the application cluster:

```bash
kubectl api-resources  | grep platform
```

Example output:
```bash
awslbcontrollers                                 aws.platform.upbound.io/v1alpha1       true         AWSLBController
podidentities                                    aws.platform.upbound.io/v1alpha1       true         PodIdentity
sqlinstances                                     aws.platform.upbound.io/v1alpha1       true         SQLInstance
clusters                                         aws.platformref.upbound.io/v1alpha1    true         Cluster
osss                                             observe.platform.upbound.io/v1alpha1   true         Oss
apps                                             platform.upbound.io/v1alpha1           true         App
```

6. Restore claims in application cluster:

The MCP Connector will restore claims from the managed control plane to the application cluster:

```bash
kubectl get claim -A
```

Example output:
```bash
NAMESPACE   NAME                                              SYNCED   READY   CONNECTION-SECRET             AGE
default     cluster.aws.platformref.upbound.io/example        True     True    platform-ref-aws-kubeconfig   127m
```

By following these steps, you have successfully migrated your Crossplane
installation to Upbound-managed control planes while ensuring seamless
integration with your application cluster using the MCP Connector.

### Connect multiple app clusters to a managed control plane

Claims are store in a unique namespace in the Upbound managed control plane.
Every cluster creates a new MCP namespace.

{{<img src="deploy/spaces/images/ConnectorMulticlusterArch.png" alt="Multi-cluster architecture with managed control plane connector" unBlur="true" lightbox="true">}}

There's no limit on the number of clusters connected to a single control plane.
Control plane operators can see all their infrastructure in a central control
plane.

Without using managed control planes and MCP Connector, users have to install
Crossplane and providers for cluster. Each cluster requires configuration for
providers with necessary credentials. With a single control plane where multiple
clusters connected through Upbound tokens, you don't need to give out any cloud
credentials to the clusters.
