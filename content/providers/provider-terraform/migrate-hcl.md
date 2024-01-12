---
title: "Rewrite HCL for Crossplane or Upbound"
weight: 2
description:
---

In the previous guide, you used the provider-terraform Crossplane provider to "lift and shift" your Terraform code into a basic Crossplane configuration. Using the provider is a great way to get started in your Crossplane journey; however, you can go even further by converting your Terraform HCL into Kubernetes-like manifests for more Crossplane benefits.

## Why go all in on Crossplane?

Moving away from HCL to fully utilize Crossplane configurations can significantly simplify your deployment workflow. You can manage your applications and infrastructure in the same control plane and leverage the continuous reconciliation processes of Crossplane in Kubernetes to make sure your infrastructure and configurations are always in sync.

## Prerequisites

For this guide, you will convert the HCL configuration from the previous guide to use Crossplane native resources. You will need:

- Crossplane installed
- A Kubernetes cluster
- An AWS account

## Create a Crossplane managed resource

The managed resource configuration in the previous step created a virtual machine with the provider-terraform:


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


An equivalent Crossplane native managed resource relies on the provider-aws instead:

apiVersion: ec2.aws.crossplane.io/v1alpha1
kind: Instance
metadata:
 name: crossplane-vm
spec:
 forProvider:
   region: us-west-2
   imageId: ami-065deacbcaac64cf2
   instanceType: t2.micro
 providerConfigRef:
   name: awsconfig



This CRD example uses the same fields as the Terraform configuration, with a few key differences.

First, the `apiVersion` field references the API group for the AWS Crossplane provider. The provider here focuses explicitly on the EC2 service of AWS.

The `kind` field identifies the schema type for the configuration. In this case, you'll use the Instance kind.

The `metadata` is a required field that contains information about the resource, like the name or other identifying values.

The `spec` field defines the parameters of the instance.

The `forProvider` sub-field defines the information you need for the instance configuration. Instead of relying on the Terraform configuration to define how you want to configure the instance, you'll use the Kubernetes manifest configuration language.

## Add a new resource

You'll rarely work with individual resources in your configurations so add a new resource here. In this example, you will create an SSH key pair for your instance as a new resource in your Crossplane configuration.

Create a new file called aws-key-pair-configuration.yaml


apiVersion: ec2.aws.upbound.io/v1beta1
kind: KeyPair
  name: crossplane-keypair
spec:
  forProvider:
    publicKey: <public-key>
    region: us-west-1



Copy and paste the contents of your public key (typically `~/.ssh/id_rsa.pub`) into the publicKey field.

## Create a composition

Compositions are templates to create and manage multiple resources. This composition is similar to the Terraform "module" concept.


apiVersion: apiextensions.crossplane.io/v1
kind: Composition
spec:
  resources:
    - name: KeyPair
      base:
        apiVersion: ec2.aws.upbound.io/v1beta1
        kind: KeyPair
        spec:
          forProvider:
            region:
    - name: VM
      base:
        apiVersion: ec2.aws.upbound.io/v1beta1
        kind: Instance
        spec:
          forProvider:
            ami:
            instanceType: t2.micro
            region:

XRD
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name:
spec:
  group:
  names:
	kind: CompositeEC2Instance
	plural: compositeec2instances
  claimNames:
	kind: EC2Instance
	plural: ec2instances
  versions:
	- name: v1alpha1
  	served: true
  	referenceable: true
  	schema:
    	openAPIV3Schema:
      	type: object
      	properties:
        	spec:
          	type: object
          	properties:
            	parameters:
              	type: object
              	properties:
                	region:
                  	type: string
                	ami:
                  	type: string
              	required:
                	- region
                	- ami
          	required:
            	- parameters
  connectionSecretKeys:
	-
	-
  defaultCompositionRef:
	name:
  compositeResourceAllowedNamespaces:
	- "*"


## Authenticate with AWS

The Crossplane AWS provider configuration handles authentication. You must create a Kubernetes secret file to authenticate with your AWS account.

Crossplane supports AWS authentication with:
Authentication Keys
Web Identity
Service Accounts

For more information on cloud provider authentication, checkout the Provider Azure and Provider GCP authentication documentation.

In this example, the credentials.source attribute references the authentication key method as a secret.


## Install the provider


apiVersion: aws.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
  name: aws-provider
spec:
  credentials:
	source: Secret
	secretRef:
  	namespace: crossplane-system
  	name: aws-creds
  	key: creds
  defaultRegion: us-west-2

```ssh
$kubectl apply -f aws-provider-config.yaml
```



## Deploy your configuration

Next, apply your Crossplane Composition.

```shell
```


## Verify your deployment

```ssh
ssh <>@<> -i key
```



## Recommended practices

When you move from Terraform to Crossplane, the provider-terraform approach will help ease the transition. When you get more comfortable with Crossplane, the native Kubernetes spec configuration enables you to eliminate your original HCL resource definitions.

Upbound's Marketplace can help you recreate your Terraform configurations with Crossplane providers. In the EC2 example, the Marketplace has a dedicated section for all the managed resources of the EC2 API group. The original Terraform resource requires two attributes to be valid, ami and instance_type.

In the Upbound Marketplace, these resources are represented by an API schema. The ami and instance_type keys are set in the forProvider object. The attributes required by Terraform are the same values required by Crossplane.

## Next steps

You just created an EC2 instance with an SSH key with Crossplane! You created a Composite Resource Definition and a Composition from your original Terraform configuration.