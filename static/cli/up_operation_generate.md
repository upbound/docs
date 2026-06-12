---
mdx:
  format: md
---

Generate an Operation.

The `generate` command creates a new, empty operation.

#### Examples

Generates a new, empty, one-shot operation named `my-operation`:

```shell
up operation generate my-operation
```

Generate a new, empty cron operation named `my-operation` that runs every hour:

```shell
up operation generate my-operation --cron "0 0 * * *"
```

Generate a new, empty watch operation named `my-operation` triggered by changes
to Deployments in the namespace `my-namespace`:

```shell
up operation generate my-operation --watch-group-version-kind "apps/v1/Deployment" \
    --watch-namespace "my-namespace"
```

Generate a new operation named `claude-pod-watcher` that invokes a Claude prompt
when pods in the `default` namespace change:

```shell
up operation generate claude-pod-watcher --watch-group-version-kind "apps/v1/Pod" \
    --watch-namespace "default" --functions xpkg.upbound.io/upbound/function-claude
```


#### Usage

`up operation generate <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name for the new operation. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--git-token` | | Token for git HTTPS authentication (GitHub PAT, GitLab token, etc.). |
| `--git-username` | | Username for git HTTPS authentication. Defaults to 'x-access-token'. Use your Bitbucket username for Bitbucket app passwords. |
| `--git-proxy` | | Proxy URL for git operations (e.g., http://proxy:8080). Supports HTTP CONNECT for SSH tunneling. |
| `--git-insecure-host-key` | | Skip SSH host key verification. Only use if you understand the MITM risks. |
| `--path` | | Optional path to the output file where the generated Operation will be saved. |
| `--project-file` | `-f` | Path to project definition file. |
| `--output` | `-o` | Output format for the results: 'file' to save to a file, 'yaml' to print the Operation in YAML format, 'json' to print the operation in JSON format. |
| `--cache-dir` | | Directory used for caching dependency images. |
| `--cron` | | Cron schedule for the operation. |
| `--watch-labels` | | Labels to match on the resource. |
| `--watch-group-version-kind` | | The GVK of resources to watch. For example, 'apps/v1/Deployment'. |
| `--watch-namespace` | | The namespace in which to watch resources. |
| `--functions` | | Comma-separated list of functions to call in the generated operation's pipeline. |
