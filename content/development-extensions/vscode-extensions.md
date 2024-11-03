---
title: "Visual Studio Code Extension"
description: "Use popular Visual Studio Code extensions to author your Upbound
configurations"
---

Official Upbound providers come with bundled schemas that you can leverage with
popular Visual Studio Code extensions to enhance your Upbound development
experience when authoring compositions. In Visual Studio Code, your Upbound
project gets:

- Inline schema information
- Linting
- Autocompletion

Upbound supports Python and KCL schemas.


{{<hint "tip">}}
This documentation focuses on Visual Studio code, but other popular editors also 
support Python and KCL schemas, linting, and autocompletion.

Refer to the [KCL language server](https://www.kcl-lang.io/docs/user_docs/getting-started/install)
or [Python language server](https://github.com/microsoft/pyright/blob/main/docs/installation.md)
documentation to learn how to configure support for your preferred editor.
{{</hint>}}

## Installation

<!-- vale gitlab.SentenceSpacing = NO -->

{{< content-selector options="Python,KCL" default="Python" >}}
<!-- Python -->
To install the Python extension, search for Python in your extensions search bar
or go to the
[Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
in Visual Studio Code.

<!-- vale gitlab.FutureTense = NO -->
You'll also need a Python interpreter v3.12 installed on your machine.
https://code.visualstudio.com/docs/python/python-tutorial#_install-a-python-interpreter.
<!-- vale gitlab.FutureTense = YES -->


Create a [virtual environment](https://code.visualstudio.com/docs/python/environments#_using-the-create-environment-command)
to make sure the extension uses the correct version.

<!-- /Python -->
<!-- KCL -->

To install the KCL extension, search for KCL in your extensions search bar
in Visual Studio Code or go to the [Marketplace](https://marketplace.visualstudio.com/items?itemName=kcl.kcl-vscode-extension).

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

Once configured, you can open Python or KCL files in Visual Studio Code and start
compositing your resources.

## Features

With the extensions and compatible Upbound provider, the following features are
available:

### Inline schema information

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

### Linting

Real-time linting ensures:

<!-- vale write-good.Passive = NO -->

- Property types are matched
- Managed Resource required fields are populated
<!-- vale write-good.Passive = YES -->

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

<!-- vale Microsoft.Auto = NO -->

### Auto-completion

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


### Auto-generate composed resources

Scaffold a new Managed Resource by using the auto-generate feature.

<!-- vale Microsoft.Auto = YES -->

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


### Resource references

Navigate between related resources in your composition.

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

<!-- vale gitlab.SentenceSpacing = YES -->


## Troubleshooting

If you're not seeing the enhanced features:

- Ensure you're using an official Upbound provider with bundled schemas.
- Check that the provider version in your `upbound.yaml` file matches the installed provider version.
- Reload your Visual Studio Code window or restart Visual Studio Code.