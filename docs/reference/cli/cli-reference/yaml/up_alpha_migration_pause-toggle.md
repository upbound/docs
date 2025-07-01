The 'pause-toggle' command is used to pause or unpause resources affected by a migration, ensuring that only migration-induced pauses are undone.

#### Options

##### `--pause`
*Default:* `false`  
Set to 'true' to pause all resources in the target control plane after a faulty migration, or 'false' to remove the paused annotation in the source control plane after a failed migration.

##### `--yes`
*Default:* `false`  
When set to true, automatically accepts any confirmation prompts that may appear during the process.

