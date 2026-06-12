---
mdx:
  format: md
---

Generate a Test for a project.

The `generate` command creates tests in the specified language.

Supported languages: `kcl` (default), `python`, `go`, `go-templating`, `yaml`

#### Examples

Create a composition test with the default language (KCL) in the folder
`tests/test-xstoragebucket`:

```shell
up test generate xstoragebucket
```

Create a composition test in Python and write it to the folder
`tests/test-xstoragebucket`:

```shell
up test generate xstoragebucket --language python
```

Create an e2e test in Python and write it to the folder
`tests/e2etest-xstoragebucket`:

```shell
up test generate xstoragebucket --language python --e2e
```

Create a composition test in raw YAML and write it
to the folder `tests/test-xstoragebucket`:

```shell
up test generate xstoragebucket --language yaml
```

#### Usage

`up test generate <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name for the new Function. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--git-token` | | Token for git HTTPS authentication (GitHub PAT, GitLab token, etc.). |
| `--git-username` | | Username for git HTTPS authentication. Defaults to 'x-access-token'. Use your Bitbucket username for Bitbucket app passwords. |
| `--git-proxy` | | Proxy URL for git operations (e.g., http://proxy:8080). Supports HTTP CONNECT for SSH tunneling. |
| `--git-insecure-host-key` | | Skip SSH host key verification. Only use if you understand the MITM risks. |
| `--project-file` | `-f` | Path to project definition file. |
| `--cache-dir` | | Directory used for caching dependency images. |
| `--language` | `-l` | Language for test. |
| `--e2e` | | create e2e tests |
| `--operation` | | create operation tests |
