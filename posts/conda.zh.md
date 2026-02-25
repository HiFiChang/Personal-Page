---
title: "Conda 环境激活后 pip 仍定位到全局路径的解决方案"
date: "2025-05-19"
description: "解决conda环境激活，但pip依旧定位到全局的问题"
tags: ["conda"]
---

## 问题表现

已经用which python/which pip验证过都是在本conda环境下，但用pip install就是会定位到/usr/local/lib/

如何检查是否存在这种错误？

```bash
which pip                                                                               
which python3
```

## 解决方案

（5.19更新）

解决方法很简单，用**python -m pip install** 就好

除此之外的upgrade、清理缓存等等（包括网上和GPT的策略）通通无效

（6.21更新）

这种做法当在.sh里面执行python就又失效了。

在./zshrc中注释掉：

```bash
# . "$HOME/.local/bin/env"
```

保证conda逻辑在最后：

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

### ssh服务器的解决办法

不仅要审查~/.bashrc，由于通过 SSH 登录服务器时，系统会加载 `~/.profile` 文件，因此这里也要检查。

要保证bashrc在后，不然改了bashrc也没用，又会回到 PATH="$HOME/.local/bin:$PATH”

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
    . "$HOME/.bashrc"                                                                                                       fi
fi   
```

（6.25更新）

还有一种就是，conda创建的时候不会自动安装pip，所以定位不到环境内的原因是没有pip和python

```bash
ls -l /home/chang/anaconda3/envs/test5/bin/pip
ls: cannot access '/home/chang/anaconda3/envs/test5/bin/pip': No such file or directory

conda install pip
```
