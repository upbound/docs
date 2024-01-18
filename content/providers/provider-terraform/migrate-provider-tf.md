---
title: "Migrate from Terraform to Crossplane or Upbound"
weight: 1
description:
---

Crossplane and Terraform are powerful tools for managing and provisioning cloud
resources. Both offer consistent infrastructure provisioning through declarative
configurations and support multiple cloud providers for more resilient
multi-cloud strategies. Both tools also extend beyond traditional infrastructure
management and allow users to create and manage various resource types with
provider plugins.

<!-- vale Microsoft.HeadingPunctuation = NO -->

## Why Crossplane?

<!-- vale Microsoft.HeadingPunctuation = YES -->

While both Crossplane and Terraform help teams manage resources, Crossplane has
several features that may fit better with your deployment workflow.

The Control Plane is the centralized management layer that orchestrates and
coordinates the provisioning and lifecycle management of cloud resources.
Crossplane leverages Kubernetes as its control plane, utilizing the Kubernetes
API to manage infrastructure and resources. If your organization already uses
Kubernetes, Crossplane allows you to simplify your workflow and minimizes tool
sprawl.

Crossplane also manages state for you as a Kubernetes Controller. If your
external resource changes outside of the desired Crossplane configuration,
Crossplane automatically reconciles the resource for you.

## Migration prerequisites

If you have resources in Terraform and want to migrate to Crossplane, make sure
you have the following prerequisites:

- A Kubernetes cluster
- Crossplane installed

- A cloud provider account

This guide reviews a small Terraform configuration using AWS and use
Crossplane's `provider-terraform` to migrate the resources to a new control
plane.

The Terraform configuration you'll work with creates a new virtual machine:

```hcl
	resource "aws_instance" "my_vm" {
    	ami                   	= "ami-065deacbcaac64cf2"
    	instance_type         	= "t2.micro"
    	tags = {
        	Name = var.vmName,
    	}
  	}
	variable "vmName" {
    	description = "VM name"
    	type    	= string
  	}
```

`provider-terraform` is a Crossplane provider that parses and executes your
Terraform configurations as a Crossplane Managed Resource(MR). You don't have to
rewrite all your Terraform configurations to begin working with Crossplane.

## Create a managed resource

Crossplane managed resources are declarative specifications that define your
desired infrastructure and resources. These configurations are a Kubernetes
manifest YAML file. Crossplane uses them to create and manage resources within
your Kubernetes cluster.

```yaml
apiVersion: tf.upbound.io/v1beta1
kind: Workspace
metadata:
  name: tf-vm
spec:
  forProvider:
	source: Inline
	module: |

	###

	vars:
  	- key:
    	value:
```

The `apiVersion` field is a standard field in Kubernetes manifests and
references the API group of the Terraform provider plugin installed in a later
step.

The `kind` field identifies the schema type for the configuration. `Workspace`
is a Managed Resource type defined in the provider. The `Workspace` kind expects
certain values for the configuration to deploy.

The `metadata` is a standard, required Kubernetes field that contains
information about the resource, like the name or other identifying values.

The `spec` field defines the parameters of the Workspace you want to create. The
provider defines the fields inside the `spec`.

The `forProvider` sub-field lets you define the `source` of the Terraform
configuration you want to deploy with Crossplane. In this example, the `source`
is `Inline` meaning you define the HCL in this file with the `module` field.

The `module` field refers to the root module of your Terraform configuration.
For an `Inline` source, you can write the contents of the main module directly
in the file.

The `vars` field allows you to create configuration variables to pass to your
Terraform configuration.

Create a new file called `terraform-configuration.yaml`. Your complete configuration
file should match the following:

```yaml
apiVersion: tf.upbound.io/v1beta1
kind: Workspace
metadata:
  name: tf-vm
spec:
  forProvider:
	source: Inline
	module: |

	resource "aws_instance" "my_vm" {
    	ami                   	= "ami-065deacbcaac64cf2"
    	instance_type         	= "t2.micro"
    	tags = {
        	Name = var.vmName,
    	}
  	}
	variable "vmName" {
    	description = "VM name"
    	type    	= string
  	}

	vars:
  	- key: vmName
    	value: crossplanevm
```

## Install the provider

You wrote a managed resource in the previous step. Next, install the
`provider-terraform` into your Kubernetes cluster with a Kubernetes
configuration file.

Create a new file called `provider-terraform-install.yaml`.

Copy and paste the configuration below.

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-terraform
spec:
  package: xpkg.upbound.io/upbound/provider-terraform
```

Crossplane uses this Kubernetes manifest file to download and install the
provider package into your cluster.

Deploy the configuration file with `kubectl apply -f`

`$ kubectl apply -f provider-terraform-install.yaml`

Verify the provider with `kubectl get pods`.

```yaml
$ kubectl get pods -n upbound-system
NAME                                                              READY   STATUS    RESTARTS   AGE
crossplane-6979f579f9-x7nkr                                       2/2     Running   0          31m
upbound-provider-aws-ec2-64262f355830-7b6b976c66-4b5wt            1/1     Running   0          29m
upbound-provider-family-aws-fec919bd2218-5f85944578-rdxjm         1/1     Running   0          29m
```


## Authenticate with your cloud provider

The Crossplane AWS provider configuration handles authentication. You must
create a Kubernetes secret file to authenticate with your AWS account.

Crossplane supports AWS authentication with:
Authentication Keys
Web Identity
Service Accounts

For more information on cloud provider authentication, checkout the Provider
Azure and Provider GCP authentication documentation.

In this example, the credentials.source attribute references the authentication
key method as a secret.

## Deploy your configuration

Next, apply the manifest.

`$ kubectl apply -f terraform-config.yaml`

## State management

For greenfield deployments, this approach works well for users who are already
familiar with Terraform. If your organization wants to maintain state parity
with a remote Terraform state file, you can use a `ProviderConfig` to point your
Crossplane-controlled Terraform provider to the correct backend.

The example below uses the `kubernetes` backend:

```yaml
apiVersion: tf.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: aws-tf-config
spec:
  credentials:
  - filename: aws-creds.ini
	source: Secret
	secretRef:
  	namespace: upbound-system
  	name: aws-creds
  	key: credentials
  configuration: |
  	terraform {
    	required_providers {
      	aws = {
        	source = "hashicorp/aws"
        	version = "5.6.1"
      	}
    	}
    	backend "kubernetes" {
      	secret_suffix 	= "providerconfig"
      	namespace     	= "upbound-system"
      	in_cluster_config = true
    	}
  	}
  	provider "aws" {
    	shared_credentials_files = ["${path.module}/aws-creds.ini"]
    	region = "us-east-1"
  	}
```

You can apply this `ProviderConfig` and let Crossplane continuously reconcile
the resources in the cloud and update the state file.

## Next steps

You created a resource with the Crossplane `provider-terraform`! For more
information on advanced migration tactics, check out this Upbound [sponsored
webinar](https://www.youtube.com/watch?v=crM-zng8LfI) with the team behind the
Crossplane `provider-terraform`
