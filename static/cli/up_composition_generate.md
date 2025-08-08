---
mdx:
  format: md
---

Generate a Composition.

The `generate` command creates a composition and adds the required function
packages to the project as dependencies.

#### Examples

Generate a composition from a CompositeResourceDefinition (XRD) and save output
to `apis/xnetworks/composition.yaml`:

```shell
up composition generate apis/xnetwork/definition.yaml
```

Generate a composition from a Composite Resource (XR) and save output to
`apis/xnetworks/composition.yaml`:

```shell
up composition generate examples/xnetwork/xnetwork.yaml
```

Generate a composition from a Composite Resource (XR), prefixing the
`metadata.name` with `aws` and save output to
`apis/xnetworks/composition-aws.yaml`:

```shell
up composition generate examples/network/network-aws.yaml --name aws
```

Generate a composition from a Composite Resource (XR) with a custom plural form
and save output to `apis/xdatabases/composition.yaml`:

```shell
up composition generate examples/xdatabase/database.yaml --plural postgreses
```


#### Usage

`up composition generate <resource> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<resource>` | File path to Composite Resource Claim (XRC) or Composite Resource (XR) or CompositeResourceDefinition (XRD). |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--name` | | Name for the new composition. |
| `--plural` | | Optional custom plural for the CompositeTypeRef.Kind |
| `--path` | | Optional path to the output file where the generated Composition will be saved. |
| `--project-file` | `-f` | Path to project definition file. |
| `--output` | `-o` | Output format for the results: 'file' to save to a file, 'yaml' to print XRD in YAML format, 'json' to print XRD in JSON format. |
| `--cache-dir` | | Directory used for caching dependency images. |
