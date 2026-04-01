---
title: "LightGBM加速方案 - lleaves"
date: "2026-03-30"
description: "CPU上加速LightGBM推理的有效手段"
tags: ["lightgbm", "lleaves", "cpp", "llvm"]
---

https://github.com/siboehm/lleaves

lleaves是CPU上的LightGBM推理加速方案。从性质上来看，lleaves是一个编译器，将 LightGBM 模型（`.txt`）解析并借助 LLVM 编译成当前 CPU 架构的机器码，从而极大的解决了树遍历过程中严重的内存局部性差、分支预测失败等问题。

lleaves在使用上非常简单。整体可以分为两步走的过程：先编译模型，再实际推理。

## 01 预编译

这里用python实现，`pip install lleaves`引入lleaves包，通过

```csharp
model = lleaves.Model(model_file="model.txt")
model.compile()
```

即可将 LightGBM 文本模型编译为本地可执行代码。在这个过程中，lleaves 负责解析模型（转换成LLVM IR），借助 LLVM 完成优化和目标代码生成。

python中没有必要保存编译产物，但我们要在cpp环境中推理，就需要先把编译的结果保存下来，另外写一个脚本来进行cpp中的推理。

因此，我们需要通过`compile`函数的`cache`参数进行缓存，并通过gcc链接生成共享库文件（.so）保存下来；通过`froot_func_name`可以指定共享库的入口函数。此时模型对应的推理逻辑已经被编译为目标平台上的本地代码，并封装为共享库供 C++ 调用。

## 02 推理

在python中，可以使用`model.predict()`直接进行推理。lleaves会自动按照CPU核心数多线程处理。

在cpp中的推理要复杂很多。由于模型已经变成了动态链接库，我们推理就不需要引入LightGBM依赖和lleaves依赖，环境配置上变得非常简单。

要想调用动态库状态的模型，我们需要dlopen将动态库加载到内存中，dlsym定位到入口地址，reinterpret_cast转换到明确定义的函数指针类型，就可以像调用函数一样使用模型了。

在多线程的处理方面，现在的设计是手动管理线程池，预先创建好ThreadPool，在任务到来的时候唤醒。任务划分就是把行数按照线程数平均切分。不同线程之间的读取和写入指针位置不重叠，也就不需要锁。

计算推理耗时的时候也把线程创建开销排除在外，只统计纯粹的计算开销。