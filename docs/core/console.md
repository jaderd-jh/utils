---
description: 增强版控制台日志工具，提供彩色输出的调试信息
---

# Console

增强版控制台日志模块，提供带样式和颜色的日志输出，方便开发和调试。

<llm-only>
Enhanced console logging utilities with colored output for debugging.
Provides styled logging methods like jLog, jDebug, jWarn, jError, jInfo.
jLog only works in development environment (__DEV__ must be true).
</llm-only>

## jLog

控制台打印，只在开发环境下有效（需要 `__DEV__` 为 `true`）

| 参数 | 类型 | 是否必填 | 描述         |
| :--- | :--- | :------- | :----------- |
| args | any  | true     | 要打印的内容 |

**用法**

```ts
import { jLog } from '@jhqn/utils'

jLog('消息', 'hello word!')
jLog('用户数据', { name: '张三', age: 18 })
```

## jDebug

控制台调试打印，带醒目的调试样式

| 参数 | 类型 | 是否必填 | 描述         |
| :--- | :--- | :------- | :----------- |
| args | any  | true     | 要打印的内容 |

**用法**

```ts
import { jDebug } from '@jhqn/utils'

jDebug('调试', '检查变量值')
```

## jWarn

控制台打印警告信息，带红色背景

| 参数 | 类型 | 是否必填 | 描述     |
| :--- | :--- | :------- | :------- |
| args | any  | true     | 警告信息 |

**用法**

```ts
import { jWarn } from '@jhqn/utils'

jWarn('警告', '这是一个警告信息')
```

## jError

控制台打印错误信息，带深红色背景

| 参数 | 类型 | 是否必填 | 描述     |
| :--- | :--- | :------- | :------- |
| args | any  | true     | 错误信息 |

**用法**

```ts
import { jError } from '@jhqn/utils'

jError('错误', '这是一个错误信息')
```

## jInfo

控制台打印普通信息，带蓝色背景

| 参数 | 类型 | 是否必填 | 描述     |
| :--- | :--- | :------- | :------- |
| args | any  | true     | 信息内容 |

**用法**

```ts
import { jInfo } from '@jhqn/utils'

jInfo('提示', '操作成功')
```

## jGroup / jGroupC / jGroupE

控制台分组打印，用于组织相关日志

| 参数 | 类型   | 是否必填 | 描述     |
| :--- | :----- | :------- | :------- |
| str  | string | true     | 分组标题 |

**用法**

```ts
import { jGroup, jGroupC, jGroupE, jLog } from '@jhqn/utils'

// jGroup - 展开的分组
jGroup('FieldUploader')
jLog('props', { disabled: false })
jLog('value', 'test')
jGroupE()

// jGroupC - 折叠的分组
jGroupC('FieldUploader')
jLog('mergedFieldProps', mergedFieldProps)
jLog('mergedUploaderProps', mergedUploaderProps)
jGroupE()
```

## jTime / jTimeEnd

控制台计时器，用于测量代码执行时间

| 参数 | 类型   | 是否必填 | 描述       |
| :--- | :----- | :------- | :--------- |
| str  | string | true     | 计时器名称 |

**用法**

```ts
import { jTime, jTimeEnd } from '@jhqn/utils'

jTime('数据处理')
// ... 执行一些操作
jTimeEnd('数据处理') // [数据处理]: 123.45ms
```

## jClear

清空控制台

**用法**

```ts
import { jClear } from '@jhqn/utils'

jClear()
```

## jLogDedupe

不连续打印相同的值（去重打印）

| 参数 | 类型 | 是否必填 | 描述         |
| :--- | :--- | :------- | :----------- |
| args | any  | true     | 要打印的内容 |

**用法**

```ts
import { jLogDedupe } from '@jhqn/utils'

// 连续打印相同内容只会输出一次
for (let i = 0; i < 10; i++) {
  jLogDedupe('重复消息', { status: 'loading' })
}
// 控制台只会输出一次

// 当内容变化时才会再次输出
jLogDedupe('状态', { value: 1 }) // 输出
jLogDedupe('状态', { value: 1 }) // 不输出（内容相同）
jLogDedupe('状态', { value: 2 }) // 输出（内容变化）
```

**使用场景**：

- 循环中的调试日志（避免刷屏）
- 高频事件监听（如 scroll、resize）
- 状态监控（只在状态变化时打印）

## jLogOnce

只打印一次（整个应用生命周期）

| 参数 | 类型 | 是否必填 | 描述         |
| :--- | :--- | :------- | :----------- |
| args | any  | true     | 要打印的内容 |

**用法**

```ts
import { jLogOnce } from '@jhqn/utils'

// 只在第一次调用时输出
function handleButtonClick() {
  jLogOnce('按钮被点击了')
  // 执行其他逻辑
}

// 即使多次调用，日志只会输出一次
handleButtonClick() // 输出: 按钮被点击了
handleButtonClick() // 不输出
handleButtonClick() // 不输出
```

**使用场景**：

- 组件挂载警告（如废弃 API 提示）
- 一次性调试信息
- 首次运行提示

## API 速查表

| 函数         | 说明       | 备注                 |
| :----------- | :--------- | :------------------- |
| `jLog`       | 控制台打印 | 仅开发环境有效       |
| `jDebug`     | 调试打印   | 带醒目样式           |
| `jWarn`      | 警告打印   | 红色背景             |
| `jError`     | 错误打印   | 深红色背景           |
| `jInfo`      | 信息打印   | 蓝色背景             |
| `jGroup`     | 展开的分组 | 配合 jGroupE 使用    |
| `jGroupC`    | 折叠的分组 | 配合 jGroupE 使用    |
| `jGroupE`    | 结束分组   | -                    |
| `jTime`      | 开始计时   | 配合 jTimeEnd 使用   |
| `jTimeEnd`   | 结束计时   | -                    |
| `jClear`     | 清空控制台 | -                    |
| `jLogDedupe` | 去重打印   | 相同内容不重复输出   |
| `jLogOnce`   | 单次打印   | 全生命周期只输出一次 |

::: tip
所有日志函数都会自动添加彩色样式，使控制台输出更易读。建议在开发环境中使用这些工具函数，生产环境会自动移除 `jLog` 的输出。
:::

::: warning 注意事项

- `jLog` 只在 `__DEV__` 为 `true` 时生效
- `jLogDedupe` 和 `jLogOnce` 不会自动清理状态，页面刷新后重置
- 分组函数需要正确配对使用 `jGroup`/`jGroupC` 和 `jGroupE`
  :::
