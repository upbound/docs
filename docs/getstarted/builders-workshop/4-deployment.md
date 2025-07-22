---
title: 4. Deploy your resources to a control plane
description: Create a dev control plane and deploy to your cloud
---
import GlobalLanguageSelector, { CodeBlock } from '@site/src/components/GlobalLanguageSelector';

<GlobalLanguageSelector />

In the previous guide, you created a test for your composition logic. In this
guide, you'll create a `ProviderConfig` and authenticate to your cloud provider
to deploy your resources.

## Prerequisites

Make sure you've completed the previous guide and have:

* [An Upbound account][up-account]
* [The Up CLI installed][up-cli]
* [kubectl installed][kubectl-installed]
* [Docker Desktop][docker-desktop] running
* A project with the basic structure (`upbound.yaml`, `apis/`, `examples/`)
* Provider dependencies added 
* An XRD generated from your example claim
* An embedded function that defines your composition logic

If you missed any of the previous steps, go to the [project
foundations][project-foundations] guide to get started.

## Authenticate with your cloud provider

Your project configuration requires an authentication method.

A `ProviderConfig` is a custom resource that defines how your control plane
authenticates and connects with cloud providers like AWS. It acts as a
configuration bridge between your control plane's managed resources and the
cloud provider's API.

### Create a secret

<CodeBlock cloud="aws">

First, create a secret with your AWS credentials. To create the secret download
your AWS access key ID and secret access key. 

In the root of your project, create a new file called `aws-credentials.txt` and
paste your AWS access key ID and secret access key.

<EditCode language="shell">
{`
[default]
aws_access_key_id = $@YOUR_ACCESS_KEY_ID$@
aws_secret_access_key = $@YOUR_SECRET_ACCESS_KEY$@
`}
</EditCode>

Next, create a new secret to store your credentials in your control plane. The
`kubectl create secret` command puts your AWS login details in the control plane
secure storage:

```shell
kubectl create secret generic aws-secret \
    -n crossplane-system \
    --from-file=my-aws-secret=./aws-credentials.txt
```

</CodeBlock>

<CodeBlock cloud="azure">

A service principal is an application within the Azure Active Directory that
passes client_id, client_secret, and tenant_id authentication tokens to create
and manage Azure resources. You can also authenticate with a
client_certificate instead of a client_secret.


First, find the Subscription ID for your Azure account.

```shell
az account list
```

Note the value of the id in the return output.

In the root of your project, create a service principle `Owner` role. Update the `<subscription_id>` with the `id` from the previous command.

<EditCode language="shell">
{`
az ad sp create-for-rbac --sdk-auth --role Owner --scopes /subscriptions/$@<SUBSCRIPTION_ID>$@ \ > azure.json
`}
</EditCode>


This command writes your client ID, secret, and subscription tenant ID in the
`azure.json` file.

Next, use `kubectl` to associate your `azure.json` file with a generic Kubernetes secret.

```shell
kubectl create secret generic azure-secret -n crossplane-system --from-file=creds=./azure.json
```

</CodeBlock>

<CodeBlock cloud="gcp">

To authenticate with GCP, you need to store your GCP account key as a Kubernetes
secret.

First, create or download your GCP service account key JSON file in the root of
your project.

Next, create the Kubernetes secret with `kubectl create secret`:

```shell
kubectl create secret generic \
gcp-secret \
-n crossplane-system \
--from-file=my-gcp-secret=./gcp-credentials.json
```

You must encode your authentication key as a base-64 string. 

```shell
base64 --input gcp-credentials.json
```

Create a new file called `my-gcp-secret.yaml`. Copy and paste the configuration
below to create your Secret object:

<EditCode language="yaml">
{`
apiVersion: v1
kind: Secret
metadata:
    name: gcp-secret
    namespace: crossplane-system
    type: Opaque
data:
    my-gcp-secret: $@<YOUR_BASE_64_ENCODED_KEY>$@
`}
</EditCode>


</CodeBlock>

### Create a `ProviderConfig`

<CodeBlock cloud="aws">

Next, create a new file called `provider-config.yaml` and paste the
configuration below:

```yaml title="upbound-hello-world/provider-config.yaml"
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

</CodeBlock>

<CodeBlock cloud="azure">

Next, create a new file called `provider-config.yaml` and paste the
configuration below:

```yaml title="upbound-hello-world/provider-config.yaml"
apiVersion: azure.upbound.io/v1beta1
metadata:
  name: default
kind: ProviderConfig
spec:
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: azure-secret
      key: creds
```

</CodeBlock>

<CodeBlock cloud="gcp">

Next, create a new file called `provider-config.yaml` and paste the
configuration below:

<EditCode language="yaml">
{`
apiVersion: gcp.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: default
spec:
  projectID: $@<YOUR_GCP_PROJECT_ID>$@
  credentials:
    source: Secret
    secretRef:
      namespace: crossplane-system
      name: gcp-secret
      key: my-gcp-secret
`}
</EditCode>
</CodeBlock>

Next, apply your provider configuration:

```shell
kubectl apply -f provider-config.yaml
```

When you create a composition and deploy with the control plane, Upbound uses
the `ProviderConfig` to locate and retrieve the credentials in the secret store.

## Create your control plane

Now that you have an authentication method, create your control plane:

```shell
up project run
```

The `run` command installs your project functions and dependencies to a control plane.

Make sure you're in your control plane context. 

Use the `up ctx` command to set your `kubecontext` to your control plane project name:

```shell
up ctx
```

## Deploy your resources to your control plane

Now that you have a control plane, use the `kubectl apply` command in the root
of your project to deploy your resources:

```shell
kubectl apply --filename examples/storagebucket/example.yaml
```


Return the resource state with the up CLI.

```shell
up alpha get managed -o yaml
```

Now, you can validate your results through the Upbound Console, and make any
changes to test your resources required.


## Next steps

You just created an Upbound project from scratch with an embedded function and a
resource claim.

Be sure to destroy your resources to avoid cloud costs:

```shell
kubectl delete --filename examples/storagebucket/example.yaml
```

Destroy your control plane:

```shell
up ctp delete upbound-ctp
```

[up-account]: https://www.upbound.io/register/a
[project-foundations]: /builders-workshop/project-foundations
[up-cli]: /operate/cli
[kubectl-installed]: https://kubernetes.io/docs/tasks/tools/
[docker-desktop]: https://www.docker.com/products/docker-desktop/
