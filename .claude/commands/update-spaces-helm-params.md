---
description: Updates Spaces Helm Chart Reference documentation by comparing current parameters with latest from GitHub
argument-hint: <github-repo-path-to-helm-chart-params>
allowed-tools: Bash, Read, Edit, WebFetch
---

Update the Spaces Helm Chart Reference documentation by:

1. **Fetching latest parameters** from GitHub repository path: $ARGUMENTS
2. **Comparing current vs latest** parameters to identify new, removed, and changed entries
3. **Updating documentation** by editing the parameter table in `docs/reference/helm-reference.md`
4. **Providing detailed summary** of all changes made

## Process

Use the GitHub CLI (`gh`) to fetch the latest README.md content from the specified repository path.
Make sure to respect the branch/commit/tag reference to the file in the passed in repository path as it could differ from simply reading the latest values from main branch..  
Create a script to parse both the current documentation table and the latest GitHub version to extract Helm parameters.

Compare them systematically to identify:

- New parameters (in latest but not current)
- Removed parameters (in current but not latest)
- Changed parameters (different type/default/description)

Update the parameter table in the documentation file.

After updating run the script again to confirm there are no diffs.
Clean up any temporary files created.

## Example Usage

```
/update-spaces-helm-params github.com/upbound/spaces/blob/v1.13.1/cluster/charts/spaces/README.md
```

## Expected Format

The GitHub repository path passed in should contain a README.md with a parameter table in this format:

```markdown
| Key            | Type   | Default | Description      |
| -------------- | ------ | ------- | ---------------- |
| parameter.name | string | "value" | Description text |
```

The command will extract this table, compare it with the current documentation, and update accordingly while providing a comprehensive summary of changes.

## Docusaurus Formatting Guidelines

When updating documentation content, ensure proper Docusaurus rendering by:

- **Use closing tags for `<br/>`**: Always write `<br/>` instead of `<br>`
- **Wrap angle brackets in backticks**: Wrap any content with `<>` in backticks to prevent JSX parsing issues (except for HTML tags like <br/>)
  - Example: `<provider>`.tls.`<key>` must also be set to true. <br/> "ca.crt": Custom CA certificate.
