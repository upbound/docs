Upgrade UXP.

#### Usage

```bash
up uxp upgrade [version] [flags]
```

#### Arguments

##### `<version>`

**Optional**

UXP version to upgrade to.

#### Flags

##### `--rollback`

Rollback to previously installed version on failed upgrade.

##### `--force`

Force upgrade even if versions are incompatible.

##### `--unstable`

Allow installing unstable versions.

##### `--set`

Set parameters.

##### `--file` / `-f`

Parameters file.

##### `--bundle`

Local bundle path.

#### Examples

```bash
# Show help
up uxp upgrade --help

# Basic usage
up uxp upgrade <version>
```
