---
title: "Schemas"
weight: 30
---

Upbound Official Providers and some other packages include [JSON
Schemas](https://json-schema.org/) for their resources, plus a generated
"meta-schema" that references all the individual schemas. The YAML language
server (via editor extensions) uses these schemas to enable in-line
documentation, linting, autocompletion, and other features when writing embedded
Go templating functions.

## Make schemas available to a function

Use `up dependency add` to make schemas from a dependency available to a
function. Dependencies are most often Crossplane providers, but they can also be
configurations that include XRDs.

```console
up dependency add xpkg.upbound.io/upbound/provider-aws-s3:v1.20.0
```

Use `up project build` to make schemas available for XRDs defined by your
project.

```console
up project build
```

## Use schemas in a Go templating file

The YAML language server reads a special comment at the top of the file to
determine the file's schema. This comment indicates the location of the schema
file built by `up` based on all the schemas available in the project:

```text
# yaml-language-server: $schema=../../.up/json/models/index.schema.json
```

## Supported packages

All Upbound Official Providers include JSON Schemas.

<!-- vale Google.WordList = NO -->
When you build your project with `up project build`, the generated artifact
contains the generated schemas for your XRDs. You can build a project and then
import that project as a dependency for the resources you define. Your own
project's schemas are also available when editing your functions as described
above.
<!-- vale Google.WordList = YES -->
