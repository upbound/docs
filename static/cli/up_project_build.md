---
mdx:
  format: md
---

Build a project into a Crossplane package.



#### Usage

`up project build [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--repository` | | Repository for the built package. Overrides the repository specified in the project file. |
| `--output-dir` | `-o` | Path to the output directory, where packages will be written. |
| `--no-build-cache` | | Don't cache image layers while building. |
| `--build-cache-dir` | | Path to the build cache directory. |
| `--max-concurrency` | | Maximum number of functions to build at once. |
| `--cache-dir` | | Directory used for caching dependencies. |
