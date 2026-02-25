---
title: "解决VS Code连接服务器OOM崩溃问题"
date: "2026-02-21"
description: "解决字体渲染导致的OOM崩溃问题"
tags: ["VS Code", "SSH"]
---

最近一周，使用vscode连接ssh服务器的时候频繁遇到crush的问题。

这种问题特发于在vscode terminal中执行指令的时候，表现为界面卡死；同时检测到内存占用在卡死期间不断上升。随后会提示vscode彻底崩溃，需要reload。但在reload之后依旧不行，必须反复几次彻底断开重连才能解决。

最初以为是特定服务器的连接的毛病，后来发现直接通过Windows terminal \ termius 连接都不存在问题。并且连接wsl也出现了crush，基本确定是vscode导致的。

随后搜索发现并非个例：

https://github.com/microsoft/vscode/issues/239541

疑似CommitMono字体渲染引起的问题。按照临时解决方法，将 **Terminal › Integrated: Font Family** 的设置从CommitMono改为default，问题解决。

![image.png](/images/vscode/image.png)