---
title: "up install-completions"
---

Outputs shell commands that you can use to configure tab completion in your shell. 
You can run the output directly, or install it in your shell profile, for example, in the `.bashrc` file. 

### `up install-completions`


#### Examples
```shell
up install-completions
autoload -U +X bashcompinit && bashcompinit
complete -C <path-to-up> up
```
