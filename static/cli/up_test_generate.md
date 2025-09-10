---
mdx:
  format: md
---

Generate a Test for a project.

The `generate` command creates tests in the specified language.

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


#### Usage

`up test generate <name> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<name>` | Name for the new Function. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--cache-dir` | | Directory used for caching dependency images. |
| `--language` | `-l` | Language for test. |
| `--e2e` | | create e2e tests |
| `--operation` | | create operation tests |
