---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud provider environment"
---

Now that you have a conceptual understanding of Upbound, let's get hands-on. In this guide, you'll create a control plane for provisioning and managing cloud resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

This approach allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Step 0: Prerequisites
This guide assumes you are already familiar with AWS, Azure, or GCP.

For this guide, you will need:
- The Up CLI installed
- An Upbound free-tier account
- A cloud provider account with administrative access
- Docker Desktop
- Visual Studio Code
- KCL or Python VSCode Extension

### Install the `up` CLI
To use Upbound, you'll need to install the `up` CLI. You can download it as a binary package or with Homebrew.
{{< tabs >}}
  {{< tab "Binary" >}}
  ```shell
    curl -sL "https://cli.upbound.io" | sh
  ````
  {{< /tab >}}
  {{< tab "Homebrew" >}}
    ```bash
      brew install upbound/tap/up
    ```
    {{< /tab >}}
{{< /tabs >}}

### Verify your installation
To verify your CLI installation and version, use the `up version` command:
```shell
  up version
```
You should see the installed version of the `up` CLI. Since you aren't logged in yet, `Crossplane Version` and `Spaces Control Version` returns `unknown`.

### Login to Upbound
Authenticate your CLI with your Upbound account by using the login command. This opens a browser window for you to log into your Upbound account.

```shell
  up login
```

## Step 1: Create a new project
Upbound uses project directories containing configuration files to deploy infrastructure. Use the `up project init` command to create a project directory with the necessary scaffolding. Previously, this would require manually creating directories, writing configuration files, and manually defining resources.

### Init the project
```shell
  up project init upbound-qs && cd upbound-qs
```

The `up project init` command creates:
*   `upbound.yaml`: Project configuration file.
*   `apis/`: Directory for Crossplane composition definitions.
*   `examples/`: Directory for example claims.
*   `.github/` and `.vscode/`: Directories for CI/CD and local development.
*   `Makefile`: A file to execute project commands.

### Review the project configuration
Review the files in your project directory, starting with `upbound.yaml`. The `upbound.yaml` file in each project directory is the entry point for your project configuration. This file contains metadata and specifications necessary to build your APIs and configurations. Open it in your editor and explore fields like `apiVersion`, `kind`, `metadata`, and `spec`.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  name: upbound-qs
spec:
  maintainer: Upbound User <user@example.com>
  source: github.com/upbound/project-template
  license: Apache-2.0
  description: "This is where you can describe your project."
  readme: |
    This is where you can add a readme for your project.
  repository: xpkg.upbound.io/example/project-template
  dependsOn: []
```

{{< table >}}
| Field        | Description                                              |
| ------------ | -------------------------------------------------------- |
| `apiVersion` | Specifies the API version for the Upbound package format |
| `kind`       | Defines the type of Upbound package                      |
| `metadata`   | Contains metadata like name or additional annotations    |
{{</ table >}}

## Step 2: Add project dependencies

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
### Add the AWS RDS provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.16.0
```
<!-- /AWS -->

<!-- Azure -->
### Add the Azure DB provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-azure-storage:v1.7.0
```
<!-- /Azure -->

<!-- GCP -->
### Add the GCP SQL provider
```shell
up dependency add xpkg.upbound.io/upbound/provider-gcp-storage:v1.8.3
```
<!-- /GCP -->
{{< /content-selector >}}

The **provider** in your project creates external resources for Upbound to manage. Functions add logic to automate complex provisioning processes. After adding these dependencies, your `upbound.yaml` file's `dependsOn` section should reflect the changes.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-aws-ec2
    version: v1.16.0
```
<!-- /AWS -->

<!-- Azure-->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-azure-storage
    version: v1.7.0
```
<!-- /Azure -->

<!-- GCP -->
```yaml
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upboundcare/provider-gcp-storage
    version: v1.8.3
```
<!-- /GCP -->
{{< /content-selector >}}

### Create provider credentials
Your project configuration now includes your provider dependency and requires an authentication method.

A `ProviderConfig` is a custom resource that defines how your control plane authenticates and connects with cloud providers like AWS. It acts as a configuration bridge between your control plane's managed resources and the cloud provider's API.

{{<hint>}}
  For more detailed instructions or alternate authentication methods, visit the [provider documentation](https://docs.upbound.io/providers/provider-aws/authentication/).
{{</hint>}}

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
  Using AWS access keys, or long-term IAM credentials, requires storing the AWS keys as a control plane secret. To create the secret [download your AWS access key](https://aws.github.io/aws-sdk-go-v2/docs/getting-started/#get-your-aws-access-keys) ID and secret access key. Create a new file called `aws-credentials.txt` and paste your AWS access key ID and secret access key.

  ```ini
    [default]
    aws_access_key_id = YOUR_ACCESS_KEY_ID
    aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
  ```

  Next, create a new secret to store your credentials in your control plane. The `kubectl create secret` command puts your AWS login details in the control plane secure storage:

  ```shell
    kubectl create secret generic aws-secret \
      -n crossplane-system \
      --from-file=my-aws-secret=./aws-credentials.txt
  ```

  Next, create a new file called `provider-config.yaml` and paste the configuration below.
  ```yaml
    apiVersion: aws.upbound.io/v1beta1
    kind: ProviderConfig
    metadata:
      name: default
    spec:
      credentials:
        source: Secret
        secretRef:
          namespace: crossplane-system
          name: aws-secret
          key: my-aws-secret
  ```
  Apply the provider configuration.

  ```bash
    kubectl apply -f provider-config.yaml
  ```
  Later, when you create a composition and deploy your infrastructure with the control plane, Upbound will use the `ProviderConfig` to locate and retrieve the credentials in the secret store.
<!-- /AWS -->

<!-- Azure -->
  A service principal is an application within the Azure Active Directory that passes `client_id`, `client_secret`, and `tenant_id` authentication tokens to create and manage Azure resources. As an alternative, it can also authenticate with a `client_certificate` instead of a `client_secret`.

  {{< hint "tip" >}}
  If you don't have the Azure CLI, use the [install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
  {{< /hint >}}

  First, find the Subscription ID for your Azure account.

  ```shell
    az account list
  ```

  Note the value of the `id` in the return output.

  Next, create a service principle `Owner` role. Update the `<subscription_id>` with the `id` from the previous command.

  ```shell
    az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/<subscription_id> \
    > azure.json
  ```

  The `azure.json` file in the preceding command contains the client ID, secret, and tenant ID of your subscription.


  Next, use `kubectl` to associate your Azure credentials file with a generic Kubernetes secret.

  ```shell
    kubectl create secret generic azure-secret -n upbound-system --from-file=creds=./azure.json
  ```

  Next, create a new file called `provider-config.yaml` and paste the configuration below.
  
  ```yaml
    apiVersion: azure.upbound.io/v1beta1
    metadata:
      name: default
    kind: ProviderConfig
    spec:
      credentials:
        source: Secret
        secretRef:
          namespace: upbound-system
          name: azure-secret
          key: creds
  ```
<!-- /Azure -->

<!-- GCP -->
  Using GCP service account keys requires storing the GCP account keys JSON file as a Kubernetes secret.

  To create the Kubernetes secret create or [download your GCP service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) JSON file.

  First, you'll need a Kubernetes secret. Create the Kubernetes secret with the following command.

  ```shell {label="kubesecret"}
    kubectl create secret generic \
    gcp-secret \
    -n crossplane-system \
    --from-file=my-gcp-secret=./gcp-credentials.json
  ```

To create a secret declaratively requires encoding the authentication keys as a base-64 string. Create a Secret object with the data containing the secret key name, my-gcp-secret and the base-64 encoded keys.

```yaml
  apiVersion: v1
  kind: Secret
  metadata:
    name: gcp-secret
    namespace: crossplane-system
  type: Opaque
  data:
    my-gcp-secret: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZG9jcyIsCiAgInByaXZhdGVfa2V5X2lkIjogIjEyMzRhYmNkIiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJkb2NzQHVwYm91bmQuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTIzNDUiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2RvY3MuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0=
```

Next, create a new file called `provider-config.yaml` and paste the configuration below.

```yaml
  apiVersion: gcp.upbound.io/v1beta1
  kind: ProviderConfig
  metadata:
    name: default
  spec:
    credentials:
      source: Secret
      secretRef:
        namespace: crossplane-system
        name: gcp-secret
        key: my-gcp-secret
```
<!-- /GCP -->
{{< /content-selector >}}

Lastly, apply the provider configuration.

```bash
  kubectl apply -f provider-config.yaml
```

Later, when you create a composition and deploy your infrastructure with the control plane, Upbound will use the `ProviderConfig` to locate and retrieve the credentials in the secret store.

## Step 3: Create a claim and generate your API
Claims are the user facing resource of the API you will define. The `up` CLI can generate compositions for you based on the minimal information you provide in the claim.

Run the following command to generate a new example claim. Choose `Composite Resource Claim` in your terminal and give it a name describing what it creates.

```yaml
up example generate

What do you want to create?:
  > Composite Resource Claim (XRC)
What is your Composite Resource Claim (XRC) named?: StorageBucket
What is the API group named?: devexdemo.upbound.io
What is the API Version named?: v1alpha1
What is the metadata name?: example
What is the metadata namespace?: default
Successfully created resource and saved to examples/storagebucket/example.yaml
```
This command creates a minimal claim file. Copy and paste the claim below into the `examples/storagebucket/example.yaml` claim file.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS
{{< editCode >}}
```yaml
  apiVersion: platform.example.com/v1alpha1
  kind: StorageBucket
  metadata:
    name: example
    namespace: default
  spec:
    region: us-west-1
    versioning: true
    acl: public
```
{{</ editCode >}}

This StorageBucket claim is based on the fields AWS requires to create an S3 bucket instance. You can discover required fields in the Marketplace for the provider.
<!-- /AWS -->

<!-- Azure -->
### Azure
{{< editCode >}}
```yaml
apiVersion: devexdemo.example.com/v1alpha1
kind: StorageBucket
metadata:
  name: example
  namespace: default
spec:
  location: eastus
  versioning: true
  acl: public
```
{{</ editCode >}}

This Azure StorageContainer claim is based on the fields Azure requires to create an Azure blob storage instance. You can discover required fields in the Marketplace for the provider.
<!-- /Azure -->

<!-- GCP -->
### GCP
{{< editCode >}}
```yaml
apiVersion: devexdemo.example.com/v1alpha1
kind: StorageBucket
metadata:
  name: example
  namespace: default
spec:
  location: US
  versioning: true
  acl: publicRead
```
{{</ editCode >}}

This GCP StorageBucket claim is based on the fields GCP requires to create a Google Cloud Storage instance. You can discover required fields in the Marketplace for the provider.
<!-- /GCP -->
{{< /content-selector >}}

Use this claim to generate a composite resource definition with the following command:

```shell
up xrd generate examples/storagebucket/example.yaml
```

A new file called a Composite Resource Definition (XRD) was created in `apis/xstoragebuckets/definition.yaml`. This represents the custom schema for the bucket API you defined in your claim. The `up xrd generate` command automatically infered the variable types based on the input parameters in your example claim.

## Step 4: Define your cloud resource composition

Now we will write our composition based on our XRD that we generated. In the root folder of your control plane project, run the following command.

```bash
up composition generate apis/xstoragebuckets/definition.yaml
```

This will scaffold a composition for you in `apis/xstoragebuckets/composition.yaml`

Now we want to define the logic of our composition. We will do so via embedded functions. Embedded functions are composition functions that are built, packaged, and managed as part of a configuration. You can author your embedded functions in either KCL or Python to avoid having to do manual patch & transforms within your YAML files. 

Run the following command
```shell
up function generate --language=<KCL or Python> test-function apis/xstoragebuckets/composition.yaml
```

This command will generate an embedded function called `test-function` inside `functions/test-function` in the language you specified. Your composition file should also have updated to include the newly generated function in its pipeline.

Now, open up your function file (either `main.k` or  `main.py`) and paste in the following to your function.


{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}

<!-- AWS -->
### AWS composition
{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    ```shell
      import models.v1beta1 as v1beta1
      oxr = option("params").oxr # observed composite resource

      bucketName = "{}-bucket".format(oxr.metadata.name)
      _items: [any] = [
          # Bucket in the desired region
          v1beta1.Bucket{
              metadata.name = bucketName
              spec = v1beta1.S3AwsUpboundIoV1beta1BucketSpec{
                  forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketSpecForProvider{
                      region = oxr.spec.region
                  }
              }
          },
          # ACL for the bucket
          v1beta1.BucketACL{
              metadata.name = "{}-acl".format(oxr.metadata.name)
              spec = v1beta1.S3AwsUpboundIoV1beta1BucketACLSpec{
                  forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketACLSpecForProvider{
                      region = oxr.spec.region
                      acl = oxr.spec.acl
                  }
              }
          },
          # Default encryption for the bucket
          v1beta1.BucketServerSideEncryptionConfiguration{
              metadata.name = "{}-encryption".format(oxr.metadata.name)
              spec = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpec{
                  forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProvider{
                      region = oxr.spec.region
                      bucketRef = v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderBucketRef{
                          name = bucketName
                      }
                      rule = [
                          v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderRuleItems0{
                              applyServerSideEncryptionByDefault = [
                                  v1beta1.S3AwsUpboundIoV1beta1BucketServerSideEncryptionConfigurationSpecForProviderRuleItems0ApplyServerSideEncryptionByDefaultItems0{
                                      sseAlgorithm = "AES256"
                                  }
                              ]
                              bucketKeyEnabled = True
                          }
                      ]
                  }
              }
          }
      ]

      # Set up versioning for the bucket if desired
      if oxr.spec.versioning:
          _items += [
              v1beta1.BucketVersioning{
                  metadata.name = "{}-versioning".format(oxr.metadata.name)
                  spec = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpec{
                      forProvider = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProvider{
                          region = oxr.spec.region
                          bucketRef = v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProviderBucketRef{
                              name = bucketName
                          }
                          versioningConfiguration = [
                              v1beta1.S3AwsUpboundIoV1beta1BucketVersioningSpecForProviderVersioningConfigurationItems0{
                                  status = "Enabled"
                              }
                          ]
                      }
                  }
              }
          ]

      items = _items
    ```    
  {{< /tab >}}

  {{< tab "Python" >}}
    ```shell
      from crossplane.function import resource
      from crossplane.function.proto.v1 import run_function_pb2 as fnv1
      from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
      from .model.com.example.platform.xstoragebucket import v1alpha1
      from .model.io.upbound.aws.s3.bucket import v1beta1 as bucketv1beta1
      from .model.io.upbound.aws.s3.bucketacl import v1beta1 as aclv1beta1
      from .model.io.upbound.aws.s3.bucketversioning import v1beta1 as verv1beta1
      from .model.io.upbound.aws.s3.bucketserversideencryptionconfiguration import v1beta1 as ssev1beta1

      def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
          observedXR = v1alpha1.XStorageBucket(**req.observed.composite.resource)
          xrName = observedXR.metadata.name
          bucketName = xrName + "-bucket"

          bucket = bucketv1beta1.Bucket(
              apiVersion="s3.aws.upbound.io/v1beta1",
              kind="Bucket",
              metadata=metav1.ObjectMeta(
                  name=bucketName,
              ),
              spec=bucketv1beta1.Spec(
                  forProvider=bucketv1beta1.ForProvider(
                      region=observedXR.spec.region,
                  ),
              ),
          )
          resource.update(rsp.desired.resources[bucket.metadata.name], bucket)

          acl = aclv1beta1.BucketACL(
              apiVersion="s3.aws.upbound.io/v1beta1",
              kind="BucketACL",
              metadata=metav1.ObjectMeta(
                  name=xrName + "-acl",
              ),
              spec=aclv1beta1.Spec(
                  forProvider=aclv1beta1.ForProvider(
                      region=observedXR.spec.region,
                      bucketRef=aclv1beta1.BucketRef(
                          name = bucketName,
                      ),
                      acl=observedXR.spec.acl,
                  ),
              ),
          )
          resource.update(rsp.desired.resources[acl.metadata.name], acl)

          sse = ssev1beta1.BucketServerSideEncryptionConfiguration(
              apiVersion="s3.aws.upbound.io/v1beta1",
              kind="BucketServerSideEncryptionConfiguration",
              metadata=metav1.ObjectMeta(
                  name=xrName + "-encryption",
              ),
              spec=ssev1beta1.Spec(
                  forProvider=ssev1beta1.ForProvider(
                      region=observedXR.spec.region,
                      bucketRef=ssev1beta1.BucketRef(
                          name=bucketName,
                      ),
                      rule=[
                          ssev1beta1.RuleItem(
                              applyServerSideEncryptionByDefault=[
                                  ssev1beta1.ApplyServerSideEncryptionByDefaultItem(
                                      sseAlgorithm="AES256",
                                  ),
                              ],
                              bucketKeyEnabled=True,
                          ),
                      ],
                  ),
              ),
          )
          resource.update(rsp.desired.resources[sse.metadata.name], sse)

          if observedXR.spec.versioning:
              versioning = verv1beta1.BucketVersioning(
                  apiVersion="s3.aws.upbound.io/v1beta1",
                  kind="BucketVersioning",
                  metadata=metav1.ObjectMeta(
                      name=xrName + "-versioning",
                  ),
                  spec=verv1beta1.Spec(
                      forProvider=verv1beta1.ForProvider(
                          region=observedXR.spec.region,
                          bucketRef=verv1beta1.BucketRef(
                              name=bucketName,
                          ),
                          versioningConfiguration=[
                              verv1beta1.VersioningConfigurationItem(
                                  status="Enabled",
                              ),
                          ],
                      ),
                  )
              )
              resource.update(rsp.desired.resources[versioning.metadata.name], versioning)
    ```
  {{< /tab >}}
{{< /tabs >}}
<!-- /AWS -->

<!-- Azure -->
### Azure composition
{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    ``shell
      import models.v1beta1 as v1beta1

      oxr = option("params").oxr # observed composite resource

      containerAccessType = "blob" if oxr.spec.acl == "public" else "private"
      accountName = "{}-account".format(oxr.metadata.name)
      _items = [
          v1beta1.Account{
              metadata.name = accountName
              spec = v1beta1.StorageAzureUpboundIoV1beta1AccountSpec{
                  forProvider = v1beta1.StorageAzureUpboundIoV1beta1AccountSpecForProvider{
                      accountTier = "Standard"
                      accountReplicationType = "LRS"
                      location = oxr.spec.location
                      blobProperties = [
                          v1beta1.StorageAzureUpboundIoV1beta1AccountSpecForProviderBlobPropertiesItems0{
                              versioningEnabled = oxr.spec.versioning
                          }
                      ]
                      infrastructureEncryptionEnabled = True
                  }
              }
          },
          v1beta1.Container{
              metadata.name = "{}-container".format(oxr.metadata.name)
              spec = v1beta1.StorageAzureUpboundIoV1beta1ContainerSpec{
                  forProvider = v1beta1.StorageAzureUpboundIoV1beta1ContainerSpecForProvider{
                      containerAccessType = containerAccessType
                  }
              }
          }
      ]
      items = _items
    ```    
  {{< /tab >}}

  {{< tab "Python" >}}
    ``shell
      from crossplane.function import resource
      from crossplane.function.proto.v1 import run_function_pb2 as fnv1
      from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
      from .model.io.upbound.azure.storage.account import v1beta1 as acctv1beta1
      from .model.io.upbound.azure.storage.container import v1beta1 as contv1beta1
      from .model.com.example.platform.xstoragecontainer import v1alpha1

      def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
          observedXR = v1alpha1.XStorageContainer(**req.observed.composite.resource)
          xrName = observedXR.metadata.name
          acctName = xrName + "-account"

          acct = acctv1beta1.Account(
              apiVersion="storage.azure.upbound.io/v1beta1",
              kind="Account",
              metadata=metav1.ObjectMeta(
                  name=acctName,
              ),
              spec=acctv1beta1.Spec(
                  forProvider=acctv1beta1.ForProvider(
                      accountTier="Standard",
                      accountReplicationType="LRS",
                      location=observedXR.spec.location,
                      infrastructureEncryptionEnabled=True,
                      blobProperties=[
                          acctv1beta1.BlobProperty(
                              versioningEnabled=observedXR.spec.versioning,
                          ),
                      ],
                  ),
              ),
          )
          resource.update(rsp.desired.resources[acct.metadata.name], acct)

          accessType = "blob" if observedXR.spec.acl == "public" else "private"
          cont = contv1beta1.Container(
              apiVersion="storage.azure.upbound.io/v1beta1",
              kind="Container",
              metadata=metav1.ObjectMeta(
                  name=xrName + "-container",
              ),
              spec=contv1beta1.Spec(
                  forProvider=contv1beta1.ForProvider(
                      containerAccessType=accessType,
                  ),
              ),
          )
          resource.update(rsp.desired.resources[cont.metadata.name], cont)
    ```    
  {{< /tab >}}
{{< /tabs >}}


<!-- /Azure -->

<!-- GCP -->

### GCP composition
{{< tabs "Functions" >}}
  {{< tab "KCL" >}}
    ``shell
      import models.v1beta1 as v1beta1

      oxr = option("params").oxr # observed composite resource

      bucketName = "{}-bucket".format(oxr.metadata.name)
      _items: [any] = [
          v1beta1.Bucket{
              metadata.name = bucketName
              spec = v1beta1.StorageGcpUpboundIoV1beta1BucketSpec{
                  forProvider = v1beta1.StorageGcpUpboundIoV1beta1BucketSpecForProvider{
                      location = oxr.spec.location
                      versioning = [
                          v1beta1.StorageGcpUpboundIoV1beta1BucketSpecForProviderVersioningItems0{
                              enabled = oxr.spec.versioning
                          }
                      ]
                  }
              }
          },
          v1beta1.BucketACL{
              metadata.name = "{}-acl".format(oxr.metadata.name)
              spec = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpec{
                  forProvider = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpecForProvider{
                      bucketRef = v1beta1.StorageGcpUpboundIoV1beta1BucketACLSpecForProviderBucketRef{
                          name = bucketName
                      }
                      predefinedAcl = oxr.spec.acl
                  }
              }
          }
      ]

      items = _items
    ```    
  {{< /tab >}}

  {{< tab "Python" >}}
    ``shell
      from crossplane.function import resource
      from crossplane.function.proto.v1 import run_function_pb2 as fnv1
      from .model.io.k8s.apimachinery.pkg.apis.meta import v1 as metav1
      from .model.io.upbound.gcp.storage.bucket import v1beta1 as bucketv1beta1
      from .model.io.upbound.gcp.storage.bucketacl import v1beta1 as aclv1beta1
      from .model.com.example.platform.xstoragebucket import v1alpha1

      def compose(req: fnv1.RunFunctionRequest, rsp: fnv1.RunFunctionResponse):
          observedXR = v1alpha1.XStorageBucket(**req.observed.composite.resource)
          xrName = observedXR.metadata.name
          bucketName = xrName + "-bucket"

          bucket = bucketv1beta1.Bucket(
              apiVersion="storage.gcp.upbound.io/v1beta1",
              kind="Bucket",
              metadata=metav1.ObjectMeta(
                  name=bucketName,
              ),
              spec=bucketv1beta1.Spec(
                  forProvider=bucketv1beta1.ForProvider(
                      location=observedXR.spec.location,
                      versioning=[bucketv1beta1.VersioningItem(
                          enabled=observedXR.spec.versioning,
                      )],
                  ),
              ),
          )
          resource.update(rsp.desired.resources[bucket.metadata.name], bucket)

          acl = aclv1beta1.BucketACL(
              apiVersion="storage.gcp.upbound.io/v1beta1",
              kind="BucketACL",
              metadata=metav1.ObjectMeta(
                  name=xrName + "-acl",
              ),
              spec=aclv1beta1.Spec(
                  forProvider=aclv1beta1.ForProvider(
                      bucketRef=aclv1beta1.BucketRef(
                          name=bucketName,
                      ),
                      predefinedAcl=observedXR.spec.acl,
                  ),
              ),
          )
          resource.update(rsp.desired.resources[acl.metadata.name], acl)
    ```    
  {{< /tab >}}
{{< /tabs >}}
<!-- /GCP -->
{{< /content-selector >}}

When writing out your function, you'll see the magic at work. With the import statements of each function, we import in schemas that were automatically generated when we created the function. The VSCode extensions for KCL and Python were able to pick this up and provide you capabiltiies such as autocompletion, linting for type mismatches, missing variables and more.

In a programmatic fashion, we were able to refer to our composite resources that we defined via our XRD, and wrote custom logic so that the bucket generated will have server side encryption. All that is left is to run and test our composition.

## Step 5: Run and test your project
Use the `up project run` command to run and test your control plane project on a development control plane that is hosted in the cloud by Upbound.

```shell
up project run
```

This command will instantaneously create a development control plane in the cloud, and deploy your project's package to it. Now, you can validate your results through the Upbound Console, and make any changes to test your resources required.

## Step 6: Build and push your project to the Upbound Marketplace
When you're ready to share your work, you can build your project and publish it to the Upbound Marketplace with a few CLI commands.

### Building your control plane project
Run:
```shell
up project build -t 1.0
```
This command takes all of your project's dependencies and metadata, and builts it into a single OCI image at `_output/upbound-qs-1.uppkg`. 


### Pushing your control plane project to the Upbound Marketplace
First, login to Upbound.
```shell
up login
```

Once you are logged in, run the following command.
```shell
up project push
```

Your package is now pushed to the Upbound Marketplace! 