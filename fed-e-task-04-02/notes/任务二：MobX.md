# 任务二：MobX

## 1. MobX 简介

### 1.1 介绍

简单, 可扩展的状态管理库，很少样板代码。

MobX 是由 Mendix，Coinbase，Facebook 开源和众多个人赞助商所赞助的。

React 和 MobX 是一对强力组合，React 负责渲染应用的状态，MobX 负责管理应用状态供 React 使用。

### 1.2 浏览器支持

现在通用两个版本 `MobX 4` 和 `MobX 5`。

`MobX 5` 版本运行在任何支持 `ES6` proxy 的浏览器，不支持 `IE11`，`Node.js 6`一下版本。（版本要求高）

`MobX 4` 可以运行在任何支持 `ES5` 的浏览器上。（版本要求低）

`MobX 4` 和 5的 API 是相同的。学习任何版本，都可以使用。

## 2. 开发前的准备

### 2.1 启用装饰器语法支持 (方式一)

```jsx
// 1.弹射项目底层配置
$ npm run eject
// 2.下载装饰器语法 babel 插件
$ npm install @babel/plugin-proposal-decorators
// 3.在 package.json 文件中加入配置
package.json

"babel": {
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ]
    ]
}
```

### 2.1 启用装饰器语法支持 (方式二) — 这里选用此方式

```jsx
// 注意：版本问题，否则下面的计数器不能使用
// 我们用： Mobx 5 + React 16

// 1.
npm install react-app-rewired @babel/plugin-proposal-decorators customize-cra
// 2. 在项目根目录下创建 config-overrides.js 并加入配置
const { override, addDecoratorsLegacy } = require("customize-cra");
module.exports = override(addDecoratorsLegacy());
// 3. 3. 更改 package.json 文件中的项目启动配置
"scripts": {
	"start": "react-app-rewired start",
	"build": "react-app-rewired build",
	"test": "react-app-rewired test",
}
```

### 2.2 解决 vscode 编辑器关于装饰器语法的警告

VSCode → 做下角选 Settings → 复制以下代码，search bar 搜索，设置成 true。

修改配置："javascript.implicitProjectConfig.experimentalDecorators": true

## 3. MobX + React

### 3.1 下载 MobX

```jsx
$ npm install mobx mobx-react
```

### 3.2 MobX 工作流程

```jsx
Action --> State --> Views
  /|\                  |
   |___________________|
```

### 3.3 MobX 基本使用

案例：计数器 Counter

1. 定义 Store 类

```jsx
// path: src/stores/counterStore.js

// 1. 创建store对象 存储默认状态0
// 2. 将store对象放在一个全局的 组件可以够的到的地方
// 3. 让组件获取store对象中的状态 并将状态显示在组件中

import { observable } from "mobx";

class CounterStore {
  @observable count = 0;

  increment = () => {
    this.count = this.count + 1;
  }

  decrement = () => {
    this.count = this.count - 1;
  }
}

const counter = new CounterStore();

export default counter;
```

2. 创建 Store 对象，通过 Provider 组件将 Store 对象放置在全局

```jsx
// path: src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import counter from './stores/counterStore'

ReactDOM.render(
  <Provider counter={counter}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

3. 将 Store 注入组件，将组件变成响应式组件

```jsx
// path: src/App.js
// 注意：必须使用 react class，不能用 react 函数式。

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('counter')
@observer
class App extends Component {
  render () {
    const { counter } = this.props;

    return (
      <div className="App">
        <button onClick={counter.increment}>+</button>
        <span>{counter.count}</span>
        <button onClick={counter.decrement}>-</button>
      </div>
    );
  }
}

export default App;
```

4. 另外：

（1）数据变成可观测数据：

`@observable` — 状态对象（比如 src/stores/counterStore.js 中 `@observable count = 0;`）

（2）数据变成可观察数据：

`@observer` — 状态对象（比如 src/App.js 中 `@observer class App ...` ）

（3）禁止普通函数更改程序状态：如3.4

`@action` — 只有action可以改变状态

### 3.4 禁止普通方法更改可观察的状态

默认情况下任何方法都可以更改可观察的状态，可以通过配置约束状态只能通过 Action 函数更改。

```jsx
import { configure } from "mobx";

// 通过配置强制程序使用action函数更改应用程序中的状态
configure({enforceActions: 'observed'});

@action increment = () => {}
```

### 3.5 更正 Action 函数中的 this 指向

更正类中普通函数的this指向。在类中定义方法时，使用非箭头函数的定义方式时 this 指向为 undefined

`@action.bound` 改变 this 指向（箭头函数变成普通函数，使用）

```jsx
// path: src/stores/counterStore.js

import { observable, configure, action } from "mobx";

// 通过配置强制程序使用action函数更改应用程序中的状态
configure({enforceActions: 'observed'});

class CounterStore {
  @observable count = 0;

  // @action increment = () => {
  //   this.count = this.count + 1;
  // }

  // @action decrement = () => {
  //   this.count = this.count - 1;
  // }

  @action.bound increment () {
    this.count = this.count + 1;
  }

  @action.bound decrement () {
    this.count = this.count - 1;
  }
}

const counter = new CounterStore();

export default counter;
```

## 4. MobX 异步

### 4.1 异步更新状态方式一：runInAction

在action方法中使用 runInAction — 异步方法中，改变状态。

### 4.2 异步更新状态方式二：flow

flow — 设置 generator 函数改变状态。

```jsx
import { observable, configure, action, runInAction, flow } from "mobx";
import axios from 'axios';

// 通过配置强制程序使用action函数更改应用程序中的状态
configure({enforceActions: 'observed'});

class CounterStore {
  @observable count = 0;
  @observable users = [];

  // runInAction
  @action.bound async getData () {
     let { data } = await axios.get('https://api.github.com/users');
     console.log(data);
     runInAction(() => this.users = data);
  }

  // flow
  getData = flow(function* () {
    let { data } = yield axios.get('https://api.github.com/users');
    this.users = data;
  }).bind(this)
}

const counter = new CounterStore();

export default counter;

// App.js
	componentDidMount () {
    const { getData } = this.props.counter;
    getData();
  }

				<div>
          {counter.users.map(user => (
            <div key={user.id}>
              <span>{user.id}</span>
              <span>{user.login}</span>
            </div>
          ))}
        </div>
```

## 5. MobX 数据监测

方式一：@computed get getName()

方式二：autorun

### 5.1 computed 计算值

1. 什么计算值

计算值是可以根据现有的状态或其它计算值衍生出的值

2. 什么时候使用计算值

将复杂的业务逻辑从模板中进行抽离

3. 计算值示例

```jsx
// counterStore.js
import { computed } from "mobx";

@computed get getResult ()  {
    return this.count * 10;
}

// App.js
<span>{counter.getResult}</span>
```

### 5.2 autorun 方法

当监测的状态发生变化时，你想根据状态产生 "效果"，请使用 autorun。

autorun 会在初始化的时候执行一次，会在每次状态发生变化时执行。

```jsx
// 1. 创建store对象 存储默认状态0
// 2. 将store对象放在一个全局的 组件可以够的到的地方
// 3. 让组件获取store对象中的状态 并将状态显示在组件中

import { observable, configure, action, autorun } from "mobx";
import axios from 'axios';

// 通过配置强制程序使用action函数更改应用程序中的状态
configure({enforceActions: 'observed'});

class CounterStore {

  constructor () {
    autorun(() => {
      try {
        uniqueUsername(this.username);
        console.log('用户可用');
      } catch (e) {
        console.log(e.message);
      }
    }, {
      delay: 2000
    })
  }

  @observable username = '';

  @action.bound changeUsername (username) {
    this.username = username;
  }
}

const counter = new CounterStore();

function uniqueUsername (username) {
  return new Promise((resolve, reject) => {
    if (username === 'admin') {
      reject('用户名已存在');
    } else {
      resolve();
    }
  })
}

export default counter;

// App.js
				<div>
          <input type="text" value={counter.username} onChange={(e) => counter.changeUsername(e.target.value)} />
          {counter.username}
        </div>
```

## 6. 综合案例: Todo案例构建项目组件

## MobX 使用（装饰器语法）

构建 MobX 工作流

Todo 添加任务

Todo 列表展示

Todo 删除任务

Todo 更改任务状态

计算未完成任务数量

Todo 任务筛选