---
title: "Migration tooling"
weight: 40
---

Upbound maintains migration tooling to support customers migrating from either
community providers or the monolithic Official Providers to the new family
provider architecture.

The tooling further supports the upgrading from one version of an Official
Provider to another when there are breaking API changes.

## Migrating from community to Official Providers

Documentation coming soon.

## Migrating from monolithic to family Official Providers

For manual migration to the family Official Providers refer to the
[migration guide]({{<ref "/knowledge-base/migrate-to-provider-families">}}).

`family-migrator` is a tool to automate the migration process from the
monolithic to provider family architecture. The tool supports an interactive and
non-interactive migration path.

### Pre-requisites

- `kubectl`: Before starting the execution phase, please ensure you have the
`kubectl` tool installed. `family-migrator` uses the `kubectl` tool in the
execution phase, and it assumes availability of this tool locally during the
non-interactive run.
<!-- vale Upbound.Spelling = NO -->
<!-- vale gitlab.SubstitutionWarning = NO -->
<!-- ignore "kubeconfig" -->
- The user needs to be on the device that has access to the Kubernetes cluster.
If the default config file `(~/.kube/config)` doesn't refer to the cluster to
migrate, the user must configure the `--kubeconfig` flag of the tool. The value
of the `--kubeconfig` flag must refer to the cluster to migrate.
<!-- vale Upbound.Spelling = YES -->
<!-- vale gitlab.SubstitutionWarning = YES -->
- The `family-migrator` tool currently supports a limited scenario. The relevant
scenario has some prerequisites:
  - The user must have an installed configuration package in cluster. In other
  words, the cluster must has a `Configuration.pkg.crossplane.io/v1` resource
  and the monolithic providers.
  - The user must have a configuration package and examples in local file
  system.
    - Content of Package: This directory contains the
    Configuration.meta.pkg.crossplane.io manifest that contains the provider
    dependencies, Compositions, and CompositeResourceDefinitions. Example
    configuration package:
    https://github.com/upbound/platform-ref-gcp/tree/main/package.
    - Content of Examples: This directory may contain Claims, and
    Configuration.pkg.crossplane.io resource. Example configuration examples:
    https://github.com/upbound/platform-ref-gcp/tree/main/package.
  - To push the new configuration package image during migration, the user
  requires push authorization to the registry.

### Installation

1. Please use the [Releases] page to download the `family-migrator` tool. Download
the appropriate binary for your operating system (`Linux` or `Darwin/macOS`) and
architecture (`amd64` or `arm64`). The download is an executable file
which might require the necessary file permissions to allow execution.
2. Move the downloaded binary to `/usr/local/bin`
3. Give permission to execute the binary
```shell
chmod +x family-migrator_darwin-arm64
```


{{<img src="providers/images/malicious-software.jpeg" alt="Malicious Software Error" size="small" lightbox="true">}}
{{<hint "note" >}}
In Darwin/macOS, this error can be shown while trying to run the executable.
Please allow this application in the Security Settings by using the
`Allow Anyway`.
{{< /hint >}}
{{<img src="providers/images/allow-anyway.jpeg" alt="Allow Anyway" size="small" lightbox="true">}}


### Usage

The `family-migrator` tool has two sub-commands, `generate` and `execute`.

The help output of the `family-migrator`:

{{<img src="providers/images/family-migrator-help.jpeg" alt="family-migrator help output" size="small" lightbox="true">}}

- `generate`: This command generates the migration plan. After the tool creates
the migration plan, it confirms if execution of the created plan should proceed.

- `execute`: Used for executing a generated migration plan. You must generate a
migration plan first before running this command.

The `family-migrator` tool needs several inputs for generating and executing the
plan. It prompts for all required options when executing the command.

#### Required inputs

When running the `family-migrator generate` command, the tool prompts the
user with a series of questions to gather the required inputs:

<!-- vale Google.Will = NO -->
<!-- vale gitlab.FutureTense = NO -->
<!-- vale write-good.Passive = NO -->
{{< table "table table-sm table-striped">}}
| Required input | Description |
| ----- | ----------- |
| **Please specify the path for the migration plan** | The answer represents the output path of the migration plan. Users need to provide a path for generating the plan and patch files. For example, `/tmp/generated/migration-plan.yaml` |
| **Please provide the registry and organization for the provider family packages** | The format must be `<registry host>/<organization>`, for example, `xpkg.upbound.io/upbound`. |
| **Please select the providers that will be migrated** | The tool presents user with a list of the monolithic providers they can select to migrate from. The tool supports multiple selections. |
| **Please specify the version of the provider-abc family** | Provide the versions of the family provider to migrate to for each selected provider. If you want to migrate to the latest version, refer to the [Upbound Marketplace](https://marketplace.upbound.io). The version format must be `v0.y.y` |
| **Please enter the URL of the migration source Configuration package** | Provide the registry URL of the currently installed Configuration Package. The value appears in the `spec.package` path of `Configuration.pkg.crossplane.io/v1` resource. For example, `xpkg.upbound.io/upbound/platform-ref-gcp:v0.3.0` |
| **Please enter the URL of the migration target Configuration package** | The tool builds a new configuration package during migration. Specify the registry URL where to update the built package. For example, `<registry-host>/<organization>/platform-ref-gcp:v0.3.0-migrated` |
| **Please specify the source directory for the Crossplane Configuration package** | Specify the source directory to the location of the configuration package. This directory contains the Configuration.meta.pkg.crossplane.io manifest that contains the provider dependencies, Compositions, and CompositeResourceDefinitions. For example: `/Users/user/workspace/platform-ref-gcp/package` Example configuration package: https://github.com/upbound/platform-ref-gcp/tree/main/package. |
| **Please specify the path to the directory containing the Crossplane package examples** | Specify the directory to the location of the configuration package examples. This directory may contain Claims, and Configuration.pkg.crossplane.io resource. For example: `/Users/user/workspace/platform-ref-gcp/examples` Example configuration examples: https://github.com/upbound/platform-ref-gcp/tree/main/examples. |
| **Please specify the path to store the updated configuration package** | The location to store the newly built configuration package. |
{{< /table >}}
<!-- vale Google.Will = YES -->
<!-- vale gitlab.FutureTense = YES -->
<!-- vale write-good.Passive = YES -->

After the tool collects all the inputs it needs, it generates and exports the
migration plan to the specified path. It then asks whether to continue to
execute the created plan.

{{<hint "note" >}}
Generating the plan may take some time, depending on the number of providers and
CRDs in your cluster. Please do not stop the process until it completes. After
generation, the tool shows a message that the plan has been generated.
{{< /hint >}}

#### Review generated plan, manifests, and patch files

After moving on to the execution phase, confirm the review of the generated
plan and manifests. After confirmation, you have the
option to list the execution instructions.

{{<hint "note" >}}
The purpose of this intermediary step is to allow for manual verification to ensure
no unexpected steps are introduced in the plan. While the review process is optional
and does not directly affect the transition to the execution phase, it is strongly
recommended to complete the review process.
{{< /hint >}}

#### Execution

Having collected the required inputs, generated the migration plan, and reviewed the plan,
the execution phase can now proceed.

The tool has two modes for execution:

`Do you want to execute the migration plan with step-by-step confirmation or
no interaction`

- **Step-by-Step (Interactive):** In this option, the tool executes each step
individually, providing context and asking for confirmation.
- **No Interaction:** In this option, the tool executes all steps without any
interaction.

##### Step-by-Step (interactive) execution

With the interactive execution mode, for each step, there are three options:

```bash
? Step (with name "backup-managed-resources" at index 0) to execute:
sh -c "kubectl get managed -o yaml > backup/managed-resources.yaml"
What is your execution preference?
```

- **Automatically**: The step gets executed and the output shown.
- **Manually**: The step needs to be manually executed by the user.
- **Skip**: No execution takes place. Be careful since you can't return
to a skipped step.

{{<hint "note" >}}
Steps to backup the resources may take a long time, depending on the number of
resources, installed providers, and CRDs in the cluster.
{{< /hint >}}

##### Non-Interactive execution

In this mode execution of the migration plan proceeds without user interaction.

You can verify the correct completion of the migration by checking
the status of the cluster. Use the following commands to confirm the cluster
status:

- `kubectl get providers.pkg.crossplane.io`: The family
providers should show instead of monolithic ones.
- `kubectl get pods -n upbound-system`: The family
provider pods should show in the `upbound-system` namespace.
- `kubectl get configurations.pkg.crossplane.io`: The newly built configuration
package appears in the `spec.package` path. The family provider references
appear in the `spec.dependsOn` path of Configuration.meta.pkg.crossplane.io
(by default `crossplane.yaml`) manifest. This manifest is in the source package
directory on the file system.

## Upgrading to a Official Provider version with breaking API changes

Documentation coming soon.

[Releases]: https://github.com/upbound/extensions-migration/releases
