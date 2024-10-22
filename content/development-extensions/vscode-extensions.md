---
title: "VSCode Extension" 
description: "Use popular VSCode extentions to author your Upbound
configurations"
---

Official Upbound providers come with bundled schemas that you can
leverage with popular VSCode extensions to enhance your Upbound
development experience when authoring compositions. In VSCode, your Upbound
project gets:

- Inline schema information
- Linting
- Autocompletion

Upbound supports Python and KCL schemas.

## Installation

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
To install the Python extension, search for Python in your extensions search bar
in VSCode.
<!-- /Python -->
<!-- KCL -->

To install the KCL extension, search for KCL in your extensions search bar
in VSCode or go to the [Marketplace](https://marketplace.visualstudio.com/items?itemName=kcl.kcl-vscode-extension).

<!-- /KCL -->

{{< /content-selector >}}

## Usage

After you install the extensions, you must use an official Upbound provider that
includes bundled [schemas](https://marketplace.upbound.io/providers?tier=official). 

In your project `upbound.yaml` file, specify the provider and the latest version:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws
    version: v0.13.0
```

Once configured, you can open Python or KCL files in VSCode and start
compositing your resources.

## Features

With the extensions and compatible Upbound provider, the following features are
available:

1. Inline Schema Information

View descriptions, property types, and other schema details directly in your code editor window as you work with composed Managed Resources (MRs).

{{< content-selector options="Python,KCL" default="Python" >}}

<!-- Python -->
{{< editCode >}}
```python
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
```
{{< /editCode >}}
<!-- /Python -->
<!-- KCL -->
{{< editCode >}}
```yaml
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        cidrBlock: "10.0.0.0/16"  # Hover to see description and type
        enableDnsHostnames: True  # Hover to see description and type
    }
}
```
{{</ editCode >}}
<!-- /KCL -->
{{</ content-selector >}}

2. Linting

Real-time linting ensures:

- Property types are correctly matched
- Managed Resource required fields are popluated

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
{{< editCode >}}
```python
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
```
{{< /editCode >}}
<!-- /Python -->
<!-- KCL -->
{{< editCode >}}
```yaml
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        cidrBlock: 10  # Error: Expected string, got integer
        # Error: Missing required field 'region'
    }
}
```
{{</ editCode >}}
<!-- /KCL -->
{{</ content-selector >}}


3. Auto-completion

As you type, the extension suggests valid properties and values for Managed Resources.

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
{{< editCode >}}
```python
vpc = {
    "apiVersion": "ec2.aws.upbound.io/v1beta1",
    "kind": "VPC",
    "spec": {
        "forProvider": {
            "ci"  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
        }
    }
}
```
{{< /editCode >}}
<!-- /Python -->
<!-- KCL -->
{{< editCode >}}
```yaml
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        ci  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
    }
}
```
{{</ editCode >}}
<!-- /KCL -->
{{</ content-selector >}}


4. Auto-generate Composed Resources

Quickly scaffold a new Managed Resource by using the auto-generate feature.

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
{{< editCode >}}
```python
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
```
{{< /editCode >}}
<!-- /Python -->
<!-- KCL -->
{{< editCode >}}
```yaml
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
```
{{</ editCode >}}
<!-- /KCL -->
{{</ content-selector >}}


5. Resource References

Easily navigate between related resources in your composition.

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
{{< editCode >}}
```python
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
```
{{< /editCode >}}
<!-- /Python -->
<!-- KCL -->
{{< editCode >}}
```yaml
subnet = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "Subnet"
    spec.forProvider: {
        vpcIdRef: {
            name: "my-vpc"  # Ctrl+Click (Cmd+Click on Mac) to navigate to the VPC definition
        }
    }
}
```
{{</ editCode >}}
<!-- /KCL -->
{{</ content-selector >}}


## Troubleshooting

If you're not seeing the enhanced features:

- Ensure you're using an official Upbound provider with bundled schemas.
- Check that the provider version in your upbound.yaml file matches the installed provider version.
- Reload your VSCode window or restart VSCode.

