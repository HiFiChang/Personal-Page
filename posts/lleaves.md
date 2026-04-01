---
title: "LightGBM Acceleration Solution - lleaves"
date: "2026-03-30"
description: "An effective method for accelerating LightGBM inference on the CPU"
tags: ["lightgbm", "lleaves", "cpp", "llvm"]
---

https://github.com/siboehm/lleaves

lleaves is a LightGBM inference acceleration solution running on CPUs. In essence, lleaves is a compiler that parses LightGBM models (`.txt`) and compiles them into machine code for the target CPU architecture using LLVM. This significantly resolves severe issues encountered during tree traversal, such as poor memory locality and branch prediction failures.

Using lleaves is very straightforward. The overall process can be divided into two steps: first pre-compiling the model, and then performing the actual inference.

## 01 Pre-compilation

Implemented in Python, you can import the lleaves package using `pip install lleaves`, and execute:

```python
model = lleaves.Model(model_file="model.txt")
model.compile()
```

This compiles the LightGBM text model into local executable code. During this process, lleaves parses the model (converting it into LLVM IR) and relies on LLVM to accomplish optimization and target code generation.

While there's no need to save the compiled product in Python, if we intend to run inference in a C++ environment, the compilation results must be saved first, accompanied by a separate script written to handle inference in C++.

Therefore, we need to cache it via the `cache` parameter of the `compile` function, and save the result as a shared library file (`.so`) using GCC. You can specify the entry function of the shared library through `froot_func_name`. At this point, the inference logic of the model has been compiled into native code on the target platform and encapsulated as a shared library ready for C++ to call.

## 02 Inference

In Python, we can simply call `model.predict()` to perform inference directly. lleaves will automatically utilize multi-threading based on the exact number of CPU cores available.

Inference in C++ is considerably more complex. However, since the model has been converted into a dynamic link library, our inference process no longer requires importing LightGBM or lleaves dependencies, making the environment setup incredibly minimal.

To invoke the model in the form of a dynamic library, we use `dlopen` to load the dynamic library into memory, `dlsym` to locate the entry address, and `reinterpret_cast` to cast it to an explicitly defined function pointer type. Once done, the model can be utilized just like calling a standard function.

Regarding multi-threading, the current design involves manually managing a thread pool, pre-creating a `ThreadPool` and waking it up when tasks arrive. The tasks are partitioned by splitting the number of rows equally among the threads. Because the read and write pointer positions for different threads do not overlap, locking mechanisms are unnecessary.

When calculating the inference duration, the thread creation overhead is excluded, focusing solely on the pure computational cost.
