# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands
- Start local docs server: `hugo server`
- Build documentation: `hugo`
- Check Vale linting: Clone and run Vale from [upbound/vale](https://github.com/upbound/vale)

## Style Guidelines
- **Markdown**: Follow standard markdown syntax for docs
- **Links**: Use Hugo ref shortcode for internal links: `{{</* ref "path/to/file.md" */>}}`
- **Images**: Place in `/static/images/`, reference with `/images/path/to/image.png`
- **Vale Rules**: Follow Google, Microsoft, and Upbound style guides enforced by Vale
- **Content Structure**: Keep front matter with `title` and `weight` at top of each file
- **Shortcodes**: Use `hint`, `tabs`, and `expand` for formatting special content

## Repository Structure
- `content/`: Markdown files for documentation pages
- `static/images/`: All image files
- `themes/`: HTML templates and Hugo tooling
- `utils/`: Utility files for documentation and build process