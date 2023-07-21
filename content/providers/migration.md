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
<!-- vale alex.ProfanityUnlikely = NO -->
<!-- vale write-good.Passive = NO -->
<!-- ignore "execution" -->
- `kubectl`: `family-migrator` uses the `kubectl` tool in the execution phase,
and it assumes that this tool is installed locally during the
non-interactive run. Before starting the execution phase, please ensure
you have the `kubectl` tool installed.
<!-- vale alex.ProfanityUnlikely = YES -->
<!-- vale write-good.Passive = YES -->

### Installation

Please use the [Releases] page to download the `family-migrator` tool. Download
the appropriate binary for your operating system (i.e., `Linux` or `Darwin`) and
architecture (i.e., `amd64` or `arm64`). The download is an executable file
which might require the necessary file permissions to allow it to be executed.

### Usage

The `family-migrator` tool has two sub-commands, `generate` and `execute`.

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "executed" -->
- `generate`: This command generates the migration plan. After the tool creates
the migration plan, it asks the user if they want to execute the created plan.

- `execute`: Used for executing a generated migration plan. You must generate a
migration plan first before running this command.
<!-- vale alex.ProfanityUnlikely = YES -->

The `family-migrator` tool needs several inputs for generating and executing the
plan. It prompts all required options to the user when executing the command.

#### Required inputs

When running the `family-migrator generate` command, the tool prompts the
user with a series of questions to gather the required inputs:

| Input | Description |
| ----- | ----------- |
| `Please specify the path for the migration plan` | The answer represents the output path of the migration plan. Users need to provide a path for generating the plan and patch files. For example, `/tmp/generated/migration-plan.yaml` |
| `Please provide the registry and organization for the provider family packages` | The format must be `<registry host>/<organization>`, for example, `xpkg.upbound.io/upbound`. |
| `Please select the providers that will be migrated` | The tool presents user with a list of the monolithic providers they can select to migrate from. The tool supports multiple selections. |
| `Please select the providers that will be migrated` | The tool presents user with a list of the monolithic providers they can select to migrate from. The tool supports multiple selections. |
| `Please specify the version of the provider-xxx family` | The user must provide the versions of the family provider to migrate to for each selected provider. If you want to migrate to the latest version, refer to the [Upbound Marketplace] |
| `Please enter the URL of the migration source Configuration package` | The user must provide the URL of the currently installed Configuration Package. The user can take the value from the `spec.package` path of `Configuration.pkg.crossplane.io/v1` resource. |
| `Please enter the URL of the migration target Configuration package` | The tool builds a new configuration package during migration. Specify the URL to which the user pushes the built package. |
| `Please specify the source directory for the Crossplane Configuration package` | The user must specify the source directory where the location of the configuration package. This directory contains the Configuration metadata, compositions, and similar configuration package contents. Example: `/Users/user/workspace/platform-ref-gcp/package` |
| `Please specify the path to the directory containing the Crossplane package examples` | The user must specify the directory where the location of the configuration package examples. Example: `/Users/user/workspace/platform-ref-gcp/examples` |
| `Please specify the path to store the updated configuration package` | This is where the location of the newly built configuration package. |

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "execute" -->
After the tool collects all the inputs it needs, it generates and exports the
migration plan to the specified path. Then, it asks if the user wants to
continue to execute the created plan.
<!-- vale alex.ProfanityUnlikely = YES -->

{{<hint "note" >}}
Generating the plan may take some time, depending on the number of providers and
CRDs in your cluster. Please do not stop the process until it completes. After
generation, the tool shows a message to the user that the plan has been
generated.
{{< /hint >}}

#### Review generated plan, manifests, and patch files
<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "execution" -->
After the user chooses to move on to the execution phase, they're first
asked to review the generated plan and manifests. After a validation question
that the user has reviewed the plan and files, the tool asks whether to list the
instructions to execute.

The review's primary purpose is to ensure no unexpected steps are
in the plan. In the following step, execution starts. The tool performs the
instructions generated in the plan (and displayed on the screen if the user
chooses yes) step by step.

{{<hint "note" >}}
The review process is optional and does not directly affect the transition to
the execution process. However, it is strongly recommended to complete the
review process.
{{< /hint >}}

#### Execution

After collecting the inputs and reviewing the generated plan, there is no
obstacle to proceed to the execution phase. The tool has two modes for
execution:
<!-- vale alex.ProfanityUnlikely = YES -->

`? Do you want to execute the migration plan with step-by-step confirmation or
no interaction`

- **Step-by-Step (Interactive):** In this option, the tool runs each step with
the consent of the user, and the user decides how to perform the step.
- **No Interaction:** In this option, the tool runs all steps end-to-end without
any interaction.

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "execution" -->
##### Step-by-Step (interactive) execution

If the user chooses the Step-by-Step execution, then for every step, the tool
asks for confirmation of the execution option. Three execution options:

`? Step (with name "backup-managed-resources" at index 0) to execute:
sh -c "kubectl get managed -o yaml > backup/managed-resources.yaml"
What is your execution preference?`
<!-- vale alex.ProfanityUnlikely = YES -->

- **Automatically**: The tool performs the step automatically and shows
  the output.
- **Manually**: The tool doesn't perform the command and prompts the user for
confirmation whether run the command.
- **Skip**: The tool skips this step. Please be careful while choosing the Skip
option because you can't return to the skipped step.

{{<hint "note" >}}
Steps to backup the resources may take a long time, depending on the number of
resources, installed providers, and CRDs in the cluster.
{{< /hint >}}

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "execution" -->
##### Non-Interactive execution
<!-- vale alex.ProfanityUnlikely = YES -->

In this mode, the user takes no action, and the tool executes each step, and
informs the user of the progress.

<!-- vale alex.ProfanityUnlikely = NO -->
<!-- ignore "execution" -->
If no errors are reported during execution, the migration was successful.
The user can verify the correct completion of the migration by checking
the status of the cluster. The following commands can be used to check
the cluster status:

- `kubectl get providers.pkg.crossplane.io`: The user must observe the family
providers instead of monolithic.
- `kubectl get pods -n upbound-system`: The user must observe the family
provider pods in the upbound-system namespace.
- `kubectl get configurations.pkg.crossplane.io`: The user must observe the
newly built configuration package reference in the `spec.package` path.
- The user must observe the family provider references in the `spec.dependsOn`
path of Configuration.meta.pkg.crossplane.io (by default `crossplane.yaml`)
manifest. This manifest is in the source package directory (in file system).
<!-- vale alex.ProfanityUnlikely = YES -->

## Upgrading to a Official Provider version with breaking API changes

Documentation coming soon.

[Releases]: https://github.com/upbound/extensions-migration/releases
[Upbound Marketplace]: https://marketplace.upbound.io/
