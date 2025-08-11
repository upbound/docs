---
mdx:
  format: md
---

Add a dependency to the current project.

The `add` command retrieves a Crossplane package from a specified registry with
an optional version tag and adds it to a project as a dependency. Langauge
schemas will be added to the project if the package provides them.

API dependencies can be added using the `--api` flag. This automatically
generates schemas for the dependency.

#### Examples

Retrieve the latest available version of the EKS provider, add all CRDs to the
cache folder, and place language schemas in the project's `.up/` folder:

```shell
up dependency add xpkg.upbound.io/upbound/provider-aws-eks
```

Retrieves the latest available version greater than `v1.1.0` of the
`platform-ref-aws` configuration, add all XRDs to the cache folder, and place
language schemas in the project's `.up/` folder:

```shell
up dependency add 'xpkg.upbound.io/upbound/platform-ref-aws:>v1.1.0'
```

Retrieves version `v0.4.1` of `function-status-transformer`:

```shell
up dependency add 'xpkg.upbound.io/crossplane-contrib/function-status-transformer:>v0.4.1'
```

Add core resources from Kubernetes v1.33.0 as an API dependency, adding language
schemas to the project's `.up/` folder:

```shell
up dependency add --api k8s:v1.33.0
```

Add a specific CRD from an HTTP URL as an API dependency, adding language
schemas to the project's `.up/` folder:

```shell
up dependency add --api https://raw.githubusercontent.com/cert-manager/cert-manager/refs/heads/master/deploy/crds/cert-manager.io_certificaterequests.yaml
```

Add CRDs from a git repository as an API dependency, adding language schemas to
the project's `.up/` folder:

```shell
up dependency add --api https://github.com/kubernetes-sigs/cluster-api \
    --git-ref=release-1.11 --git-path=config/crd/bases
```


#### Usage

`up dependency add <package> [flags]`
#### Arguments

| Argument | Description |
| -------- | ----------- |
| `<package>` | Package to be added. |
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--api` | | Treat the dependency as an API dependency (k8s or CRD). |
| `--git-ref` | | Git ref for CRD dependencies (branch, tag, or commit SHA). If provided, the CRD will be fetched from git. |
| `--git-path` | | Path within the git repository for CRD dependencies. |
| `--cache-dir` | | Directory used for caching package images. |
