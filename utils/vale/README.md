<!-- vale off -->
# Upbound Vale Configuration

This repository contains the Upbound implementation of [Vale](https://vale.sh/).

## What's Vale
Vale is an [open source](https://github.com/errata-ai/vale) command-line tool that provides English language linting. Vale enables spell checking, writing improvements and style guide enforcement in files across text and code.

Vale uses "Packages" to define the set of rules for writing to follow.

## Upbound's use of Vale
Upbound uses the following Vale packages:
- [alex](https://github.com/get-alex/alex) - Catch insensitive, inconsiderate writing. 
- [proselint](https://github.com/errata-ai/proselint) - Improve writing styles.
- [Google](https://github.com/errata-ai/Google) - The Google style guide for Developer Documentation.
- [Microsoft](https://github.com/errata-ai/Microsoft) - Based on the Microsoft Writing Style Guide.
- [write-good](https://github.com/errata-ai/write-good) - Naive linter for English prose for developers who can't write good and wanna learn to do other stuff good too.
- [GitLab](https://gitlab.com/gitlab-org/gitlab/-/tree/master/doc/.vale) - The GitLab style guide.
  
Upbound has made some modifications to these packages to remove duplicates or add Upbound specific terms.

## Warnings and errors in PR checks
Vale provides three levels of feedback:
- **Suggestions** - Helpful writing tips (shown in PR - non-blocking)
- **Warnings** - Style guide recommendations (shown in PR - non-blocking) 
- **Errors** - Critical issues that must be fixed (will block PR approval)

**PR behavior**: The GitHub Action shows all Vale feedback but only fails PRs on actual errors. Contributors can see suggestions and warnings for learning without being blocked.

## Contributing and customizing
Upbound welcomes contributions and changes to the `main` branch. 

Use these guidelines for contributions:
- Edit existing packages first. This includes removing duplicate rules (common with `Google` and `Microsoft`), [adding acronyms](https://github.com/upbound/vale/blob/main/styles/gitlab/Uppercase.yml).
- Add Upbound specific words to the Upbound [Spelling file](https://github.com/upbound/vale/blob/main/styles/Upbound/spelling-exceptions.txt).
- Try to keep any modified lists in a case-insensitive alphabetical order.

<!-- vale on -->
