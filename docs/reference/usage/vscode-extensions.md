---
title: Visual Studio Code extensions
description: Use popular Visual Studio Code extensions to author your Upbound configurations
---

Official Upbound providers include schemas that you can leverage to enhance your
Upbound development experience when authoring compositions. In Visual Studio
Code, your Upbound project gets:

- Inline schema information
- Linting
- Autocompletion

Upbound supports Python, KCL, and Go schemas.

:::tip
This documentation focuses on Visual Studio code, but other popular editors also
support Python and KCL schemas, linting, and autocompletion.

Refer to the [KCL language server][kcl-language-server],
[Python language server][python-language-server],
or [Go language server][go-language-server]
documentation to learn how to configure support for your preferred editor.
:::

## Installation

<!-- vale gitlab.SentenceSpacing = NO -->

<Tabs>
<TabItem value="Python" label="Python">


To install the Python extension, search for Python in your extensions search bar
or go to the [Marketplace][marketplace]
in Visual Studio Code.

Crossplane functions require Python 3.11 or newer. Follow the
[Python extension documentation][python-extension-documentation]
to learn how to install Python.

Upbound uses [Pydantic][pydantic] Python schemas. Follow the
[Pydantic Visual Studio Code guide][pydantic-visual-studio-code-guide]
to enable autocompletion and type checking.

:::tip
Use a `venv` virtual environment for each function to isolate its dependencies.
Follow the [Python extension documentation][python-extension-documentation-1]
to learn how to create and select a virtual environment.
:::

</TabItem>
<TabItem value="KCL" label="KCL">
To install the KCL extension, search for KCL in your extensions search bar
in Visual Studio Code or go to the [Marketplace][marketplace-2].

</TabItem>
<TabItem value="Go" label="Go">

To install the Go extension, search for Go in your extensions search bar
in Visual Studio Code or go to the [Marketplace][marketplace-3].

</TabItem>
<TabItem value="Go Templating" label="Go Templating">

When editing Go Templating functions, use The YAML extension. To install it,
search for YAML in your extensions search bar in Visual Studio Code or go to the
[Marketplace][marketplace-4].

Go Templating functions generated with `up function generate` contain modelines
that instruct Visual Studio Code to use the YAML extension when editing
them. This requires the
[Modelines][modelines]
extension.
</TabItem>
</Tabs>

## Usage

After you install the extensions, you must use an official Upbound provider that
includes bundled [schemas][schemas].

In your project `upbound.yaml` file, specify the provider and the latest version:

```yaml
apiVersion: meta.dev.upbound.io/v1alpha1
kind: Project
spec:
  dependsOn:
  - provider: xpkg.upbound.io/upbound/provider-aws
    version: v0.13.0
```

Once configured, you can generate functions, open the code files in Visual
Studio Code and start composing your resources.

## Features

With the extensions and compatible Upbound provider, the following features are
available:

### Inline schema information

View descriptions, property types, and other schema details directly in your
code editor window as you work with composed managed resources (MRs).

<Tabs>
<TabItem value="Python" label="Python">

```python
vpc = v1beta1.VPC(
    apiVersion="ec2.aws.upbound.io/v1beta1",
    kind="VPC",
    spec=v1beta1.Spec(
        forProvider=v1beta1.ForProvider(
            region="us-west-2",  # Hover to see description and type.
        ),
    ),
)
```

</TabItem>
<TabItem value="KCL" label="KCL">
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

</TabItem>
<TabItem value="Go" label="Go">

```go
vpc := &v1beta1.VPC{
	APIVersion: ptr.To("ec2.aws.upbound.io/v1beta1"),
	Kind:       ptr.To("VPC"),
	Spec: &v1beta1.VPCSpec{
		ForProvider: &v1beta1.VPCSpecForProvider{
			CidrBlock:          ptr.To("10.0.0.0/16"), / Hover to see description and type
			EnableDNSHostnames: ptr.To(true),          / Hover to see description and type
		},
	},
}
```
</TabItem>
<TabItem value="Go Templating" label="Go Templating">


```yaml
---
apiVersion: ec2.aws.upbound.io/v1beta1
kind: VPC
spec:
  forProvider:
    cidrBlock: "10.0.0.0/16" / Hover to see description and type
    enableDNSHostnames: true / Hover to see description and type
```

</TabItem>
</Tabs>

### Linting

Real-time linting ensures:

<!-- vale write-good.Passive = NO -->

- Property types are matched
- Managed resource required fields are populated
<!-- vale write-good.Passive = YES -->

<Tabs>
<TabItem value="Python" label="Python">

```python
vpc = v1beta1.VPC(
    apiVersion="ec2.aws.upbound.io/v1beta1",
    kind="VPC",
    spec=v1beta1.Spec(
        forProvider=v1beta1.ForProvider(
            cidrBlock=10,  # Warning: Argument of type "Literal[10]" cannot be assigned to parameter "cidrBlock" of type "str | None"
            # Warning: Argument missing for parameter "region"
        ),
    ),
)
```

</TabItem>
<TabItem value="KCL" label="KCL">

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

</TabItem>
<TabItem value="Go" label="Go">

```go
vpc := &v1beta1.VPC{
	APIVersion: ptr.To("ec2.aws.upbound.io/v1beta1"),
	Kind:       ptr.To("VPC"),
	Spec: &v1beta1.VPCSpec{
		ForProvider: &v1beta1.VPCSpecForProvider{
			CidrBlock: 10, / Error: cannot use 10 (untyped int constant) as *string value in struct literal
		},
	},
}
```
</TabItem>
<TabItem value="Go Templating" label="Go Templating">

```yaml
---
apiVersion: ec2.aws.upbound.io/v1beta1
kind: VPC
spec:
  forProvider:    / Missing property "region"
    cidrBlock: 10 / Incorrect type: Expected "string"
```
</TabItem>
</Tabs>

<!-- vale Microsoft.Auto = NO -->

### Auto-completion

As you type, the extension suggests valid properties and values for managed resources.

<Tabs>
<TabItem value="Python" label="Python">

```python
vpc = v1beta1.VPC(
    apiVersion="ec2.aws.upbound.io/v1beta1",
    kind="VPC",
    spec=v1beta1.Spec(
        forProvider=v1beta1.ForProvider(
            region="us-west-2",
            ci  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
        ),
    ),
)
```
</TabItem>
<TabItem value="KCL" label="KCL">

```yaml
vpc = {
    apiVersion: "ec2.aws.upbound.io/v1beta1"
    kind: "VPC"
    spec.forProvider: {
        ci  # Auto-complete suggests: cidrBlock, cidrBlockAssociations, etc.
    }
}
```

</TabItem>
<TabItem value="Go" label="Go">

```go
vpc := &v1beta1.VPC{
	APIVersion: ptr.To("ec2.aws.upbound.io/v1beta1"),
	Kind:       ptr.To("VPC"),
	Spec: &v1beta1.VPCSpec{
		ForProvider: &v1beta1.VPCSpecForProvider{
			Ci / Auto-complete suggests: CidrBlock, AssignGeneratedCidrBlock, Ipv6CidrBlock, etc.
		},
	},
}
```
</TabItem>
<TabItem value="Go Templating" label="Go Templating">

```yaml
---
apiVersion: ec2.aws.upbound.io/v1beta1
kind: VPC
spec:
  forProvider:
    ci / Auto-complete suggests: cidr, cidrBlock, etc.
```
</TabItem>
</Tabs>

### Auto-generate composed resources

Scaffold a new managed resource by using the auto-generate feature.

<!-- vale Microsoft.Auto = YES -->

<Tabs>
<TabItem value="Python" label="Python">

```python
vpc = v1beta1.V  # Auto-complete suggests VPC
```

</TabItem>
<TabItem value="KCL" label="KCL">

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

</TabItem>
<TabItem value="Go" label="Go">

```go
vpc := &v1beta1.V / Auto-complete suggests VPC etc.
```
</TabItem>
<TabItem value="Go Templating" label="Go Templating">


```yaml
---
apiVersion: # Auto-complete suggests ec2.aws.upbound.io/v1beta1 etc.
kind: V     # Auto-complete suggests VPC etc.
spec:
  # Auto-complete generates the required fields:
  forProvider:
    region: 
```
</TabItem>
</Tabs>


### Resource references

Navigate between related resources in your composition.
<Tabs>
<TabItem value="Python" label="Python">

```python
    vpc = vpcv1beta1.VPC(**req.observed.resources["vpc"].resource)

    subnet = subnetv1beta1.Subnet(
        apiVersion="ec2.aws.upbound.io/v1beta1",
        kind="Subnet",
        spec=subnetv1beta1.Spec(
            forProvider=subnetv1beta1.ForProvider(
                region=vpc.spec.forProvider.region,  # Ctrl+Click (Cmd+Click on Mac) to navigate to the VPC definition
                vpcId=vpc.status.atProvider.arn,
            ),
        ),
    )
```

</TabItem>
<TabItem value="KCL" label="KCL">

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

</TabItem>
<TabItem value="Go" label="Go">

```go
observedComposed, _ := request.GetObservedComposedResources(req)
observedVPC := observedComposed["vpc"]
observedVPCARN, _ := observedVPC.Resource.GetString("status.atProvider.arn")

subnet := &v1beta1.Subnet{
	APIVersion: ptr.To("ec2.aws.upbound.io/v1beta1"),
	Kind:       ptr.To("Subnet"),
	Spec: &v1beta1.SubnetSpec{
		ForProvider: &v1beta1.SubnetSpecForProvider{
			VpcID: &observedVPCARN, / Ctrl+Click (Cmd+Click on Mac) to navigate to the observedVPCARN definition
		},
	},
}
```

</TabItem>

<TabItem value="Go Templating" label="Go Templating">
Navigating to references isn't supported in Go Templating files.
</TabItem>
</Tabs>
<!-- vale gitlab.SentenceSpacing = YES -->

## Troubleshooting

If you're not seeing the enhanced features:

- Ensure you're using an official Upbound provider with bundled schemas.
- Check that the provider version in your `upbound.yaml` file matches the
  installed provider version.
- Reload your Visual Studio Code window or restart Visual Studio Code.


[kcl-language-server]: https://www.kcl-lang.io/docs/user_docs/getting-started/install
[python-language-server]: https://github.com/microsoft/pyright/blob/main/docs/installation.md
[go-language-server]: https://github.com/golang/tools/blob/master/gopls/README.md
[marketplace]: https://marketplace.visualstudio.com/items?itemName=ms-python.python
[python-extension-documentation]: https://code.visualstudio.com/docs/python/python-tutorial#_install-a-python-interpreter
[pydantic]: https://docs.pydantic.dev/
[pydantic-visual-studio-code-guide]: https://docs.pydantic.dev/latest/integrations/visual_studio_code
[python-extension-documentation-1]: https://code.visualstudio.com/docs/python/environments
[marketplace-2]: https://marketplace.visualstudio.com/items?itemName=kcl.kcl-vscode-extension
[marketplace-3]: https://marketplace.visualstudio.com/items?itemName=golang.Go
[marketplace-4]: https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml
[modelines]: https://marketplace.visualstudio.com/items?itemName=chrislajoie.vscode-modelines
[schemas]: https://marketplace.upbound.io/providers?tier=official

