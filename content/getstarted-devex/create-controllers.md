---
title: "Create cloud resources with Upbound"
description: "Define a control plane for resource abstractions in a real cloud
provider environment"
---

After deploying in a development environment, let's explore creating real cloud resources.

## Overview

This guide will help you create a control plane for provisioning and managing cloud resources across AWS, Azure, or GCP. You'll build reusable APIs that allow your development teams to deploy and configure infrastructure themselves.

By the end of this guide, you'll have:

1. A control plane project
2. Composite Resources defining your cloud resources
3. APIs for self-service infrastructure provisioning
4. A streamlined infrastructure workflow

## Key Steps

1. Create a control plane object
2. Define the schema for an API to provision database instances (AWS RDS, Azure SQL Database, or Google Cloud SQL)
3. Define parameters to make the API reusable across multiple services
4. Implement a controller using an Upbound composition
5. Set up outputs to provide necessary data to teams

This approach allows you to efficiently manage cloud resources across multiple providers, enabling your organization to scale its online services while maintaining control and consistency.

## Prerequisites

This guide assumes you are already familiar with AWS, Azure, or GCP.

Before you begin, make sure you have:


- The up CLI installed
- A cloud provider account with administrative access
- Visual Studio Code

For an introduction to the Upbound workflow, review the [Upbound CLI](link to 101) guide.

## Create a new project

First, create and initialize a new project directory with up project init. The `up project` command pulls down the necessary scaffolding files for your project.

{{< content-selector options="AWS,Azure,GCP" default="AWS" >}}
<!-- AWS -->
{{< editCode >}}
```shell
up project init up-aws-rds
```
{{</ editCode >}}
<!-- /AWS -->

<!-- Azure -->
{{< editCode >}}
```shell
up project init up-azure-db
```
{{</ editCode >}}
<!-- /Azure -->

<!-- GCP -->
{{< editCode >}}
```shell
up project init up-gcp-db
```
{{</ editCode >}}
<!-- /GCP -->
{{< /content-selector >}}
Change into your project directory. You'll notice that you have new files and subdirectories.

First, review the `upbound.yaml` file in your editor. This is the entry point
for your project.

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
metadata:
  creationTimestamp: null
  name: up-aws-rds
spec:
  description: This is where you can describe your project.
  license: Apache-2.0
  maintainer: Upbound User <user@example.com>
  readme: |
	This is where you can add a readme for your project.
  repository: xpkg.upbound.io/example/project-template
  source: github.com/upbound/project-template
```

Upbound uses the YAML markup language to build your APIs and configurations.
Let's analyze this file and define each section.

The first three fields apiVersion, kind, and metadata contain specific values to help Upbound deploy your desired infrastructure.

{{< table >}}
| Field | Description |
| :---- | :---- |
| `apiVersion` | Specifies the API version for the Upbound package format |
| `kind` | Defines the type of Upbound package |
| `metadata` | Contains metadata like name or additional annotations |
{{</ table >}}

The spec section contains the specifications for whatever kind of resource you create. In this case, it contains the necessary information for your project. We'll see more about specs in the next section and how they change based on the kind of object you are creating.

## Add project dependencies


## Generate a Composite Resource Definition

Your project now contains the base-level information required to go forward. Now, let's create some infrastructure packages.

Crossplane and Upbound use Composite Resource Definitions (XRDs) to define the parameters of your desired infrastructure. XRDs follow the same format as your project file with specific additional fields.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xrds.devex.com
```

The apiVersion field defines the API group and version of the resource you're creating. For example, in this scenario, add dbaas.upbound.io/v1alpha1 . This is the group and version of the API you are currently creating and how your other composition components will be referenced.

The kind specifies what you are creating in this file. In this case, it's CompositeResourceDefinition. Defining the kind makes sure your control plane knows how to process the information you give it in this file

The metadata field applies identifying information to the object you are creating. We'll give this XRD the name `rds.devex.com` so we can search for it easily.


The spec section is where you begin to define the schema for the resources you want to create. This creates the general shape of your desired infrastructure and everything required to build those objects in your cloud provider.


Let's apply this XRD to your Upbound cluster.


$


This XRD file is the template of the resources you want to create, but does not create any actual resources in your cloud provider. Instead, when you apply this XRD, you give Upbound the ability to make decisions about resources based on the parameters you define.

This XRD creates a controller on your cluster. A controller is a set of services that reconcile your desired infrastructure state (your composition) with your actual infrastructure state (your cloud provider resources). The controller performs continuous checks against your real-world cloud resources and determines if they meet the specifications you set in your composition. For example, if you want to create an EC2 instance with a dev metadata tag, the controller will constantly check the instance after it's deployed to ensure that no out of sync changes take place, like another user changing the tag to qa. If the infrastructure is out of sync, the controller will use the composition specification as API endpoints and change or recreate your infrastructure.

In order to create actual resources with Upbound, we'll need to tell Upbound what to do based on the definitions above.
Composition

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: aws-rds
  labels:
    provider: aws
spec:
  writeConnectionSecretsToNamespace: crossplane-system
  compositeTypeRef:
    apiVersion: devex.com/v1alpha1
    kind: SQL
  resources:
  - name: rdsinstance
    base:
      apiVersion: database.aws.crossplane.io/v1beta1
      kind: RDSInstance
      spec:
        forProvider:
          dbInstanceClass: db.t3.micro
          engine: mysql
          engineVersion: '8.0'
          masterUsername: masteruser
          allocatedStorage: 20
          region: us-east-1
          skipFinalSnapshotBeforeDeletion: true
          publiclyAccessible: false
          vpcSecurityGroupIDRefs:
          - name: my-vpc-sg
        writeConnectionSecretToRef:
          namespace: crossplane-system
          name: rds-conn
  - name: rdssecuritygroup
    base:
      apiVersion: ec2.aws.crossplane.io/v1beta1
      kind: SecurityGroup
      spec:
        forProvider:
          description: RDS security group
          groupName: rds-sg
          region: us-east-1
          ingress:
          - fromPort: 3306
            toPort: 3306
            protocol: tcp
            ipRanges:
            - cidrIp: '0.0.0.0/0'
          vpcIdRef:
            name: my-vpc
```

```kcl
apiVersion = "apiextensions.crossplane.io/v1"
kind = "Composition"

metadata = {
	name = "aws-rds"
	labels = {
    	"provider" = "aws"
	}
}

spec = {
	writeConnectionSecretsToNamespace = "crossplane-system"
	compositeTypeRef = {
    	apiVersion = "devex.com/v1alpha1"
    	kind = "SQL"
	}
	resources = [
    	{
        	name = "rdsinstance"
        	base = {
            	apiVersion = "database.aws.crossplane.io/v1beta1"
            	kind = "RDSInstance"
            	spec = {
                	forProvider = {
                    	dbInstanceClass = "db.t3.micro"
                    	engine = "mysql"
                    	engineVersion = "8.0"
                    	masterUsername = "masteruser"
                    	allocatedStorage = 20
                    	region = "us-east-1"
                    	skipFinalSnapshotBeforeDeletion = True
                    	publiclyAccessible = False
                    	vpcSecurityGroupIDRefs = [
                        	{
                            	name = "my-vpc-sg"
                        	}
                    	]
                	}
                	writeConnectionSecretToRef = {
                    	namespace = "crossplane-system"
                    	name = "rds-conn"
                	}
            	}
        	}
    	}
    	{
        	name = "rdssecuritygroup"
        	base = {
            	apiVersion = "ec2.aws.crossplane.io/v1beta1"
            	kind = "SecurityGroup"
            	spec = {
                	forProvider = {
                    	description = "RDS security group"
                    	groupName = "rds-sg"
                    	region = "us-east-1"
                    	ingress = [
                        	{
                            	fromPort = 3306
                            	toPort = 3306
                            	protocol = "tcp"
                            	ipRanges = [
                                	{
                                    	cidrIp = "0.0.0.0/0"
                                	}
                            	]
                        	}
                    	]
                    	vpcIdRef = {
                        	name = "my-vpc"
                    	}
                	}
            	}
        	}
    	}
	]
}
```

Provider Configuration



Build your configuration

Deploy to Upbound
