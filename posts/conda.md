---
title: "Fix: pip Still Points to Global Path After Activating a Conda Environment"
date: "2025-05-19"
description: "Solving the issue where pip installs to the global path even though the conda environment is activated."
tags: ["conda"]
---

## Symptoms

Even after verifying with `which python` / `which pip` that both resolve to the current conda environment, running `pip install` still installs packages into `/usr/local/lib/`.

How to check whether this problem exists:

```bash
which pip
which python3
```

## Solution

### Update (May 19)

The fix is simple — use **`python -m pip install`** instead of `pip install`.

Other approaches such as upgrading pip, clearing caches, etc. (including suggestions from the web and GPT) are all ineffective.

---

### Update (Jun 21)

This workaround breaks again when `python` is invoked inside a `.sh` script.

**Step 1**: In `~/.zshrc`, comment out the following line:

```bash
# . "$HOME/.local/bin/env"
```

**Step 2**: Make sure the conda initialization block appears *last* in `~/.zshrc`:

```bash
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/home/chang/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/home/chang/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/home/chang/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/home/chang/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

#### Fix for SSH servers

When logging in via SSH, the system loads `~/.profile` in addition to `~/.bashrc`, so you must check both files.

Make sure `~/.bashrc` is sourced *after* the `PATH` assignments in `~/.profile`, otherwise the change to `~/.bashrc` will be overridden and `PATH` will revert to `"$HOME/.local/bin:$PATH"`.

```bash
# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi
```

---

### Update (Jun 25)

Another root cause: conda does **not** automatically install `pip` when creating a new environment. If `pip` and `python` are missing from the environment's `bin/` directory, pip will naturally fall back to the global one.

```bash
ls -l /home/chang/anaconda3/envs/test5/bin/pip
# ls: cannot access '/home/chang/anaconda3/envs/test5/bin/pip': No such file or directory

conda install pip
```
