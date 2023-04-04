---
title: "up install-completions"
---

outputs shell commands that you can use to configure tab completion in your shell. 
You can run the output directly, or install it in your shell profile (e.g. .bashrc). 

Once the completion commands have been installed, you can use the tab key to auto-complete up commands.

### `up install-completions`


#### Examples
```shell
up install-completions
autoload -U +X bashcompinit && bashcompinit
complete -C <path-to-up> up
```
