# 任务五：模块作业

## 回答：

### 1. 请简述 React 16 版本中初始渲染的流程

将 React 元素渲染到页面中，分为两个阶段，render 阶段和 commit 阶段。

render 阶段负责创建 Fiber 数据结构并为 Fiber 节点打标记，标记当前 Fiber 节点要进行的 DOM 操作。render阶段是 协调层负责的阶段，为每一个 ReactElement 构建 Fiber 对象，同时为此 Fiber 对象创建 DOM 对象，并且添加 effectTag 属性（CRUD）。新构建的 Fiber 对象就是 workInProgress Fiber 树（待提交的 Fiber 树）。render 结束后，workInProgress Fiber 树 会保存在 fiberRoot 中。

commit 阶段负责根据 Fiber 节点标记 ( effectTag ) 进行相应的 DOM 操作。先获取  render 阶段的成果，就是保存在 fiberRoot 中的workInProgress Fiber 树，然后根据 Fiber 中的 effectTag 属性进行相应的 DOM 操作。

### 2. 为什么 React 16 版本中 render 阶段放弃了使用递归

在 React 15 的版本中，采用了循环加递归的方式进行了 virtualDOM 的比对，由于递归使用 JavaScript 自身的执行栈，一旦开始就无法停止，直到任务执行完成。如果 VirtualDOM 树的层级比较深，virtualDOM 的比对就会长期占用 JavaScript 主线程，由于 JavaScript 又是单线程的无法同时执行其他任务，所以在比对的过程中无法响应用户操作，无法即时执行元素动画，造成了页面卡顿的现象。

在 React 16 的版本中，放弃了 JavaScript 递归的方式进行 virtualDOM 的比对，而是采用循环模拟递归。而且比对的过程是利用浏览器的空闲时间完成的，不会长期占用主线程，这就解决了 virtualDOM 比对造成页面卡顿的问题。

总之，渲染器的工作被设定成不可以被打断，所以不存在DOM 渲染不完全的问题。递归是可以被打断的，协调层采用循环模拟递归，所以调度器和协调器的工作是在内存中完成的是可以被打断的。

### 3. 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情

第一阶段：before mutation 阶段（执行 DOM 操作前，比如 生命周期函数getSnapshotBeforeUpdate），执行函数 commitBeforeMutationEffects。

第二阶段：mutation 阶段（执行 真正的 DOM 操作），执行函数 commitMutationEffects。

第三阶段：layout 阶段（执行 DOM 操作后，比如调用 生命周期函数或钩子函数），执行函数 commitLayoutEffects。

### 4. 请简述 workInProgress Fiber 树存在的意义是什么

因为要删除页面帧上的元素，会花费些时间，如果同时在内存中生成新的fiber树，从而在删除结束时，直接替换到页面上，节约了时间。react 16的双缓存技术解决了这个问题，使用Fiber树进行构建和替换。

利用 Fiber 存在 current 和 alternate 属性。workInProgress 会在其中的 alternate 进行构建。在render 的过程中，进行替换，一旦 workInProgress 构建完成，React 会替换 current 属性，从而在屏幕上重新展现新的内容。