---
mdx:
  format: md
---

Generate AI tooling configurations for the project.

The `configure-tools` command generates configuration to make commonly-used AI
development tools more effective at working in an Upbound project.

#### Supported Tools

* Claude Code
* Cursor
* Gemini CLI

#### Examples

Create `GEMINI.md` and `.gemini/settings.json`:

```shell
up project ai configure-tools --gemini-cli
```

Create `CLAUDE.md`, `.claude/settings.json`, and `.mcp.json`:

```shell
up project ai configure-tools --claude-code
```

Create `.cursor`:

```shell
up project ai configure-tools --cursor
```

Create configuration for all three tools:

```shell
up project ai configure-tools --gemini-cli --claude-code --cursor
```


#### Usage

`up project ai configure-tools [flags]`
#### Flags

| Flag | Short Form | Description |
| ---- | ---------- | ----------- |
| `--project-file` | `-f` | Path to project definition file. |
| `--gemini-cli` | | Generate gemini CLI configurations. |
| `--claude-code` | | Generate claude code CLI configurations. |
| `--cursor` | | Generate cursor configurations. |
| `--copilot` | | Generate GitHub Copilot configurations. |
