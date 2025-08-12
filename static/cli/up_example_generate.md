---
mdx:
  format: md
---

Generate an Example Composite Resource (XR) or Claim (XRC)

The `generate` command is used to create an example Composite Resource (XR) or
Composite Resource Claim (XRC). For v2 projects only Composite Resources (XRs)
are supported. XRs are namespace-scoped by default, but you can choose
cluster-scoped using the `--scope=cluster` flag.

#### Examples

Creates an example Composite Resource (XR) or Composite Resource Claim (XRC)
resource using an interactive wizard:

```shell
up example generate
```

Create an example named `example` in the namespace `default` using an
interactive wizard to collect additional inputs:

```shell
up example generate --name example --namespace default
```

Create an example Composite Resource Claim (XRC) with specified api-group,
api-version, kind, and name, using an interactive wizard to collect additional
inputs:

```shell
up example generate --type claim --api-group platform.example.com \
    --api-version v1beta1 --kind Cluster --name example
```

Create an example Composite Resource (XR) or Composite Resource Claim (XRC)
based on the fields and default values in an existing
CompositeResourceDefinition (XRD). Use an interactive wizard to collect inputs:

```shell
up example generate apis/xnetworks/definition.yaml
```

Create an example Composite Resource (XR) based on the fields and default values
in an existing CompositeResourceDefinition (XRD). Use an interactive wizard to
collect inputs:

```shell
up example generate apis/xnetworks/definition.yaml --type xr
```


#### Usage

`up example generate [<xrd-file-path>] [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<xrd-file-path>` |**Optional** Specifies the path to the Composite Resource Definition (XRD) file used to generate an example resource. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--path` | | Specifies the path to the output file where the  Composite Resource (XR) or Composite Resource Claim (XRC) will be saved. |
| `--output` | `-o` | Specifies the output format for the results. Use 'file' to save to a file, 'yaml' to display the  Composite Resource (XR) or Composite Resource Claim (XRC) in YAML format, or 'json' to display in JSON format. |
| `--type` | | Specifies the type of resource to create: 'xrc' for Composite Resource Claim (XRC), 'xr' for Composite Resource (XR). |
| `--scope` | | Specifies the XR scope (v2 only). |
| `--api-group` | | Specifies the API group for the resource. |
| `--api-version` | | Specifies the API version for the resource. |
| `--kind` | | Specifies the Kind of the resource. |
| `--name` | | Specifies the Name of the resource. |
| `--namespace` | | Specifies the Namespace of the resource. |
| `--project-file` | `-f` | Path to project definition file. |
