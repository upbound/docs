---
mdx:
  format: md
---

Generate an XRD from a Composite Resource (XR) or Claim (XRC).

The `generate` command creates a CompositeResourceDefinition (XRD) from a given
Composite Resource (XR) and generates associated language models for function
usage.

#### Examples

Generate a CompositeResourceDefinition (XRD) based on the specified Composite
Resource and save it to the default APIs folder in the project:

```shell
up xrd generate examples/cluster/example.yaml
```

Generate a CompositeResourceDefinition (XRD) with a specified plural form,
useful for cases where automatic pluralization may not be accurate (e.g.,
"postgres"):

```shell
up xrd generate examples/postgres/example.yaml --plural postgreses
```

Generate a CompositeResourceDefinition (XRD) and save it to a custom path within
the project's default APIs folder.

```shell
up xrd generate examples/postgres/example.yaml --path database/definition.yaml
```


#### Usage

`up xrd generate <file> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<file>` | Path to the file containing the Composite Resource (XR) or Composite Resource Claim (XRC). |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--cache-dir` | | Directory used for caching dependency images. |
| `--path` | | Path to the output file where the Composite Resource Definition (XRD) will be saved. |
| `--plural` | | Optional custom plural form for the Composite Resource Definition (XRD). |
| `--output` | `-o` | Output format for the results: 'file' to save to a file, 'yaml' to print XRD in YAML format, 'json' to print XRD in JSON format. |
| `--project-file` | `-f` | Path to project definition file. |
