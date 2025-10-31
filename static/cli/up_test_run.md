---
mdx:
  format: md
---

Run project tests.

The `run` command executes project tests. By default, only composition tests are
executed; with the `--e2e` flag, only e2e tests are executed.

#### Examples

Run all composition tests located in the 'tests/' directory:

```shell
up test run tests/*
```

Override function annotations for a remote Docker daemon:
```shell
DOCKER_HOST=tcp://192.168.1.100:2376 up test run tests/*  \
	--function-annotations render.crossplane.io/runtime-docker-publish-address=0.0.0.0 \
	--function-annotations render.crossplane.io/runtime-docker-target=192.168.1.100
```


Run all end-to-end (e2e) tests located in the 'tests/' directory:

```shell
up test run tests/* --e2e
```

Run all operation tests located in the 'tests/' directory:

```shell
up test run tests/* --operation
```

Run e2e tests in `tests/` while specifying custom paths for the `kubectl`
binary:

```shell
up test run tests/* --e2e --kubectl=.tools/kubectl
```

Run e2e tests in `tests/`, overriding the default control plane version:

```shell
up test run tests/* --e2e --control-plane-version=v2.0.2-up.5
```


#### Usage

`up test run <patterns> ... [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<patterns>` | The path to the test manifests |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--repository` | | Repository for the built package. Overrides the repository specified in the project file. |
| `--no-build-cache` | | Don't cache image layers while building. |
| `--build-cache-dir` | | Path to the build cache directory. |
| `--max-concurrency` | | Maximum number of functions to build and push at once. |
| `--control-plane-group` | | The control plane group that the control plane to use is contained in. This defaults to the group specified in the current context. |
| `--control-plane-name-prefix` | | Prefix of the control plane name to use. It will be created if not found. |
| `--control-plane-version` | | Version of Crossplane to use for the control plane. By default, the latest compatible version will be used. |
| `--skip-control-plane-check` | | Allow running on a non-development control plane. |
| `--local` | | Use a local dev control plane, even if Spaces is available. |
| `--cluster-admin` | | Allow Crossplane cluster admin privileges in the local dev control plane. Defaults to true. |
| `--local-registry-path` | | Directory to use for local registry images. The default is system-dependent. |
| `--skip-control-plane-cleanup` | | Skip cleanup of the control plane after the test run. |
| `--use-current-context` | | Run the project with the current kubeconfig context rather than creating a new dev control plane. |
| `--cache-dir` | | Directory used for caching dependencies. |
| `--function-annotations` | | Override function annotations for all functions (compositionTests and operationTests). Can be repeated. |
| `--kubectl` | | Absolute path to the kubectl binary. Defaults to the one in $PATH. |
| `--public` | | Create new repositories with public visibility. |
| `--e2e` | | Run E2E tests |
| `--operation` | | Run Operation tests |
