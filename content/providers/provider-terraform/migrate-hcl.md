---
title: "Rewrite HCL for Crossplane or Upbound"
weight: 2
description:
---

In the previous guide, you used `provider-terraform` to "lift and shift" your Terraform code into a basic Crossplane configuration. Using the provider is a great way to get started in your Crossplane journey; however, you can go even
further by converting your Terraform HCL into Kubernetes-like manifests for more
Crossplane benefits.

## Why go all in on Crossplane?

Moving away from HCL to fully utilize Crossplane configurations can significantly simplify your deployment workflow. You can manage your applications and infrastructure in the same control plane and leverage the continuous reconciliation processes of Crossplane in Kubernetes to make sure your infrastructure and configurations are always in sync.

## Prerequisites

For this guide, you will convert the HCL configuration from the previous guide
to use Crossplane native resources. You will need:

- Crossplane installed
- A Kubernetes cluster
- An AWS account

## Create a Crossplane managed resource

The managed resource configuration in the previous step created a virtual machine with the provider-terraform:

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

An equivalent Crossplane native managed resource relies on the provider-aws
instead:

```yaml
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
```

This CRD example uses the same fields as the Terraform configuration, with a few
key differences.
First, the `apiVersion` field references the API group for the AWS Crossplane
provider. The provider here focuses explicitly on the EC2 service of AWS.

The `kind` field identifies the schema type for the configuration. In this case,
you'll use the Instance kind.

The `metadata` is a required field that contains information about the resource,
like the name or other identifying values.

The `spec` field defines the parameters of the instance.

The `forProvider` sub-field defines the information you need for the instance
configuration. Instead of relying on the Terraform configuration to define how
you want to configure the instance, you'll use the Kubernetes manifest
configuration language.

## Create a resource definition

You'll rarely work with individual resources in your configurations so add a new
resource here. In this example, you will create a complete deployment with an
EC2 instance, supporting, network resources, and SSH key pair for your
instance as a new resource in your Crossplane configuration.

Create a new file called `complete-instance-definition.yaml`.

Copy and paste the definition below:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xinstances.aws.example.corp
spec:
  group: aws.example.corp
  names:
    kind: XInstance
    plural: xinstances
  claimNames:
    kind: Instance
    plural: instances
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
                  description: Instance configuration parameters.
                  properties:
                    amiId:
                      type: string
                    publicKey:
                      type: string
                    region:
                      type: string
                  required:
                    - region
                    - publicKey
              required:
                - parameters
```

A `definition` is a Crossplane spec that defines the allowed and required
resources you want to deploy.

## Create a Composition

Compositions are templates to create and manage multiple resources. This
composition is similar to the Terraform "module" concept.

Create a new file called `complete-instance-composition.yaml`.

Expand the Composition below and copy and paste it into your file.

{{< expand >}}
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: xinstance.aws.example.corp
spec:
  writeConnectionSecretsToNamespace: upbound-system
  compositeTypeRef:
    apiVersion: aws.example.corp/v1alpha1
    kind: XInstance
  resources:
  - name: test-env
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: VPC
      spec:
        forProvider:
          cidrBlock: 10.0.0.0/16
          enableDnsHostnames: true
          enableDnsSupport: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: subnet
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: Subnet
      spec:
        forProvider:
          cidrBlock: 10.0.0.0/24
          vpcIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.availabilityZone
      transforms:
      - type: string
        string:
          fmt: '%sa'
          type: Format

  - name: ingress-all-test
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: SecurityGroup
      spec:
        forProvider:
          name: allow-all-sg
          vpcIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: ingress-all-test-ingress
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: SecurityGroupIngressRule
      spec:
        forProvider:
          cidrIpv4: 0.0.0.0/0
          fromPort: 22
          toPort: 22
          ipProtocol: tcp
          securityGroupIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: ingress-all-test-egress
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: SecurityGroupEgressRule
      spec:
        forProvider:
          cidrIpv4: 0.0.0.0/0
          fromPort: 0
          toPort: 0
          ipProtocol: '-1'
          securityGroupIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: test-env-gw
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: InternetGateway
      spec:
        forProvider:
          vpcIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: route-table-test-env
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: RouteTable
      spec:
        forProvider:
          vpcIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: route-table-test-env-route
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: Route
      spec:
        forProvider:
          destinationCidrBlock: 0.0.0.0/0
          gatewayIdSelector:
            matchControllerRef: true
          routeTableIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: subnet-association
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: RouteTableAssociation
      spec:
        forProvider:
          routeTableIdSelector:
            matchControllerRef: true
          subnetIdSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region

  - name: keypair
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: KeyPair
      metadata:
        labels:
          testing.upbound.io/example-name: keypair
        name: keypair
      spec:
        forProvider:
          publicKey:
            matchControllerRef: true
          region:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.publicKey
      toFieldPath: spec.forProvider.publicKey

  - name: ec2-instance
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: Instance
      metadata:
        labels:
          testing.upbound.io/example-name: test
        name: test
      spec:
        forProvider:
          instanceType: t3.micro
          vpcSecurityGroupIdSelector:
            matchControllerRef: true
          subnetIdSelector:
            matchControllerRef: true
          keyPairName:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.amiId
      toFieldPath: spec.forProvider.ami
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.keyPairName
      toFieldPath: spec.forProvider.keyName

  - name: ip-test-env
    base:
      apiVersion: ec2.aws.upbound.io/v1beta1
      kind: EIP
      metadata:
        labels:
          testing.upbound.io/example-name: lb
        name: lb
      spec:
        forProvider:
          instanceSelector:
            matchControllerRef: true
    patches:
    - type: FromCompositeFieldPath
      fromFieldPath: spec.parameters.region
      toFieldPath: spec.forProvider.region
```
{{< /expand >}}

Your Composition sets the explicit values you want to deploy based on the
definition file you created above.

## Create a claim

Now that you have a definition and a composition, you can create a claim to
determine the variable parameters of the infrastructure you want to deploy. The
claim is a set of resources to deploy within a single namespace. Creating claims
is comparable to different Terraform workspaces in that resources within one
namespace do not impact resources within another.

```yaml
apiVersion: aws.example.corp/v1alpha1
kind: Instance
metadata:
  name: example
  namespace: default
spec:
  parameters:
    region: us-east-1
    amiId: ami-0005e0cfe09cc9050
    keyPairName: test-keypair
    publicKey: |
      ssh-rsa AAAAB3NzaC1...
```

Copy and paste the contents of your public key (typically `~/.ssh/id_rsa.pub`)
into the publicKey field.

## Authenticate with AWS

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

## Install the provider

```yaml
apiVersion: aws.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
name: aws-provider-ec2
spec:
credentials:
source: Secret
secretRef:
namespace: crossplane-system
name: aws-creds
key: creds
 defaultRegion: us-west-2
```

```shell
kubectl apply -f aws-provider-config.yaml
```

## Deploy your claim

Next, apply your Crossplane Composition.

```shell
kubectl apply -f claim.yaml
```

## Verify your deployment

```shell
ssh <>@<> -i key
```

## Recommended practices

When you move from Terraform to Crossplane, the `provider-terraform`` approach will
help ease the transition. When you get more comfortable with Crossplane, the
native Kubernetes spec configuration enables you to eliminate your original HCL
resource definitions.

Upbound's Marketplace can help you recreate your Terraform configurations with
Crossplane providers. In the EC2 example, the Marketplace has a dedicated
section for all the managed resources of the EC2 API group. The original
Terraform resource requires two attributes to be valid, `ami` and `instance_type`.

In the Upbound Marketplace, these resources are represented by an API schema.
The `ami` and `instance_type` keys are set in the `forProvider` object. The attributes
required by Terraform are the same values required by Crossplane.

## Next steps

You just created an EC2 instance with an SSH key with Crossplane! You created a
Composite Resource Definition and a Composition from your original Terraform
configuration.

For more information on Upbound, Crossplane, and control planes, check out the
Crossplane Architecture Framework for best practices when building your infrastructure.