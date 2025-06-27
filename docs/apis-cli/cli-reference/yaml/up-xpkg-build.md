Build a package, by default from the current directory.

#### Usage

```bash
up xpkg build [flags]
```

#### Flags

##### `--name`

[DEPRECATED: use --output] Name of the package to be built. Uses name in crossplane.yaml if not specified. Does not correspond to package tag.

##### `--output` / `-o`

Path for package output.

##### `--controller`

Controller image used as base for package.

##### `--package-root` / `-f`

**Default:** `.`

Path to package directory.

##### `--examples-root` / `-e`

**Default:** `./examples`

Path to package examples directory.

##### `--helm-root` / `-h`

**Default:** `./helm`

Path to helm directory.

##### `--auth-ext` / `-a`

**Default:** `auth.yaml`

Path to an authentication extension file.

##### `--ignore`

Paths, specified relative to --package-root, to exclude from the package.

#### Examples

```bash
# Show help
up xpkg build --help
```
