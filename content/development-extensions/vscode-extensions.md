---
title: "VSCode Extension" 
description: "Use popular VSCode extentions to author your Upbound
configurations"
---

Official Upbound providers are built with bundled schemas that you can
leverage with popular VSCode extensions to enhance your Upbound
development experience when authoring compositions. In VSCode, your Upbound
project now has access to:

- Inline schema information
- Linting
- Autocompletion

Upbound supports Python and KCL schemas.

## Installation
{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
To install the Python extension, search for Python in your extensions search bar
in VSCode or visit the <a>https://marketplace.visualstudio.com/items?itemName=ms-python.python</a>.
<!-- /Python -->
<!-- KCL -->

To install the KCL extension, search for KCL in your extensions search bar
in VSCode or go to the [Marketplace](https://marketplace.visualstudio.com/items?itemName=kcl.kcl-vscode-extension).

<!-- /KCL -->

{{< /content-selector >}}

## Usage

Once you have the extensions installed, you need to use an [official Upbound
provider](https://marketplace.upbound.io/providers?tier=official) that includes bundled schemas. 

In your project `upbound.yaml` file, specify the provider and the latest version:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws
    version: v0.13.0
```

Now, you can open Python or KCL files in VSCode and start composing your resources.

## Features

Once you have installed the appropriate extension and are working with an Upbound provider that includes bundled schemas, you'll have access to the following features:

1. Inline Schema Information

View descriptions, property types, and other schema details directly in your code editor window as you work with composed Managed Resources (MRs).
{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "cidrBlock": "10.0.0.0/16",  # Hover to see description and type
            "enableDnsHostnames": True,  # Hover to see description and type
        }
    }
}
<!-- /Python -->
<!-- KCL -->
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        cidrBlock: "10.0.0.0/16"  # Hover to see description and type
        enableDnsHostnames: True  # Hover to see description and type
    }
}
<!-- /KCL -->
{{</ content-selector >}}

2. Linting
The extension provides real-time linting for:
Mismatched property types
Missing required fields in a Managed Resource
Python Example
vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "cidrBlock": 10,  # Error: Expected string, got integer
            # Error: Missing required field 'region'
        }
    }
}

KCL Example
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        cidrBlock: 10  # Error: Expected string, got integer
        # Error: Missing required field 'region'
    }
}
3. Auto-completion
As you type, the extension suggests valid properties and values for Managed Resources.
Python Example
vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "ci"  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
        }
    }
}

KCL Example
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        ci  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
    }
}
4. Auto-generate Composed Resources
Quickly scaffold a new Managed Resource by using the auto-generate feature.
Python Example:
Start typing: vpc = {"kind": "V"}
Select "VPC" from the autocomplete suggestions
The extension generates:
vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "cidrBlock": "",
            "region": ""
        }
    }
}
KCL Example:
Start typing: vpc = {kind: "V"}
Select "VPC" from the autocomplete suggestions
The extension generates:
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        cidrBlock: ""
        region: ""
    }
}

5. Resource References
Easily navigate between related resources in your composition.
Python Example:
subnet = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "Subnet",
    "spec": {
        "forProvider": {
            "vpcIdRef": {
                "name": "my-vpc"  # Ctrl+Click (Cmd+Click on Mac) to navigate to the VPC definition
            }
        }
    }
}
KCL Example:
subnet = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "Subnet"
    spec.forProvider: {
        vpcIdRef: {
            name: "my-vpc"  # Ctrl+Click (Cmd+Click on Mac) to navigate to the VPC definition
        }
    }
}

## Troubleshooting

If you're not seeing the enhanced features:

- Ensure you're using an official Upbound provider with bundled schemas.
- Check that the provider version in your upbound.yaml file matches the installed provider version.
- Reload your VSCode window or restart VSCode.

