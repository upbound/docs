Generate an Example Claim (XRC) or Composite Resource (XR).

#### Usage

```bash
up example generate [xrd-file-path] [flags]
```

#### Arguments

##### `<xrd-file-path>`

**Optional**

Specifies the path to the Composite Resource Definition (XRD) file used to generate an example resource.

#### Flags

##### `--path`

Specifies the path to the output file where the  Composite Resource (XR) or Composite Resource Claim (XRC) will be saved.

##### `--output` / `-o`

**Default:** `file`

Specifies the output format for the results. Use 'file' to save to a file, 'yaml' to display the  Composite Resource (XR) or Composite Resource Claim (XRC) in YAML format, or 'json' to display in JSON format.

##### `--type`

Specifies the type of resource to create: 'xrc' for Composite Resource Claim (XRC), 'xr' for Composite Resource (XR).

##### `--api-group`

Specifies the API group for the resource.

##### `--api-version`

Specifies the API version for the resource.

##### `--kind`

Specifies the Kind of the resource.

##### `--name`

Specifies the Name of the resource.

##### `--namespace`

Specifies the Namespace of the resource.

##### `--project-file` / `-f`

**Default:** `upbound.yaml`

Path to project definition file.

#### Examples

```bash
# Show help
up example generate --help

# Basic usage
up example generate <xrd-file-path>
```
