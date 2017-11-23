# Babel

`Babel` 包括三大核心概念：

- babel-core
- babel-polyfill
- Plugins

下面我们来好好体味一下这些概念😆。



## babel-core

首先确保安装[Node](https://nodejs.org/en/) 。

然后执行以下命令：

```shell
npm install --save-dev babel-core
```

然后新建一个 `JS` 文件：

```shell
touch index.js
```

在文件中头部插入如下代码：

```javascript
import { transform } from 'babel-core';
// or var babel = require('babel-core');
// or import * as babel from 'babel-core';
```



