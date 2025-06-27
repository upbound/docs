Deprecated. Please migrate to up project or use the crossplane CLI.

#### Usage

```bash
up xpkg [subcommand]
```

#### Subcommands

- `build` - Build a package, by default from the current directory.
- `xp-extract` - Extract package contents into a Crossplane cache compatible format. Fetches from a remote registry by default.
- `push` - Push a package.
- `batch` - Batch build and push a family of service-scoped provider packages.
- `append` - Append additional files to an xpkg.

#### Examples

```bash
# Show help
up xpkg --help
```
