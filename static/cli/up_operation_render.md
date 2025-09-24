---
mdx:
  format: md
---

Render an Operation.

The `render` command shows you what resources an Operation would create or mutate
by printing them to stdout. It also prints any changes that would be made to the
status of the Operation. It doesn't talk to Crossplane. Instead it runs the Operation
Function pipeline specified by the Operation locally, and uses that to render
the Operation.

#### Examples

Render an Operation:

```shell
up operation render operations/op1/operation.yaml
```

Pass context values to the Function pipeline:

```shell
up operation render operations/op1/operation.yaml \
    --context-values=apiextensions.crossplane.io/environment='{"key": "value"}'
```

Pass required resources requested by functions in the pipeline:

```shell
up operation render operations/op1/operation.yaml \
    --required-resources=required-resources.yaml
```

Pass credentials needed by functions in the pipeline:

```shell
up operation render operations/op1/operation.yaml \
    --function-credentials=credentials.yaml
```

Include function results and context in the output:

```shell
up operation render operations/op1/operation.yaml -f -c
```

Include the full Operation with original spec and metadata:

```shell
up operation render operations/op1/operation.yaml -o
```

#### Docker Configuration

The render command uses Docker (or any Docker-compatible container runtime) to
run operation functions. Configure the Docker connection using these standard
environment variables:

* `DOCKER_HOST`:        Docker daemon socket (e.g., `unix:///var/run/docker.sock`)
* `DOCKER_API_VERSION`: Docker API version to use
* `DOCKER_CERT_PATH`:   Path to Docker TLS certificates
* `DOCKER_TLS_VERIFY`:  Enable TLS verification (1 or 0)

#### Usage

`up operation render <operation> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<operation>` | A YAML file specifying the Operation to render. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--required-resources` | `-r` | A YAML file or directory of YAML files specifying required resources that functions can request. |
| `--context-files` | | Comma-separated context key-value pairs to pass to the Function pipeline. Values must be files containing JSON. |
| `--context-values` | | Comma-separated context key-value pairs to pass to the Function pipeline. Values must be JSON. Keys take precedence over --context-files. |
| `--include-function-results` | `-f` | Include informational and warning messages from Functions in the rendered output as resources of kind: Result. |
| `--include-full-operation` | `-o` | Include the full Operation with original spec and metadata in the rendered output. |
| `--include-context` | `-c` | Include the context in the rendered output as a resource of kind: Context. |
| `--function-credentials` | | A YAML file or directory of YAML files specifying credentials to use for Functions to render the Operation. |
| `--timeout` | | How long to run before timing out. |
| `--max-concurrency` | | Maximum number of functions to build at once. |
| `--project-file` | `-p` | Path to project definition file. |
| `--cache-dir` | | Directory used for caching dependency images. |
| `--no-build-cache` | | Don't cache image layers while building. |
| `--build-cache-dir` | | Path to the build cache directory. |
