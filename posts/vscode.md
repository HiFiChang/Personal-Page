---
title: "Fix: VS Code Crashes with OOM When Connected to a Remote Server"
date: "2026-02-21"
description: "Fixing out-of-memory crashes caused by font rendering in VS Code."
tags: ["VS Code", "SSH"]
---

Over the past week, I kept running into frequent crashes while using VS Code to connect to remote servers via SSH.

The issue would specifically occur when running commands in the VS Code terminal: the UI would freeze while memory usage climbed steadily in the background, eventually causing VS Code to crash entirely and prompt for a reload. Even after reloading, the problem persisted — it took repeatedly disconnecting and reconnecting to get things working again.

At first I suspected it was a problem specific to a particular server connection, but I later found that connecting through Windows Terminal or Termius worked fine. The issue also reproduced when connecting to WSL, which strongly pointed to VS Code itself as the culprit.

A quick search confirmed this wasn't an isolated case:

https://github.com/microsoft/vscode/issues/239541

The suspected cause is font rendering with the CommitMono font. Following the temporary workaround in the issue thread, I changed the **Terminal › Integrated: Font Family** setting from `CommitMono` to `default` — and the crashes stopped.

![image.png](/images/vscode/image.png)
