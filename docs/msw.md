---
description: Mock Service Worker 辅助工具，简化 API Mock 响应的创建
---

# MSW

Mock Service Worker 辅助工具模块，提供便捷的 Mock 响应生成函数，简化 MSW 的使用。

<llm-only>
Mock Service Worker helper utilities for creating mock responses.
Provides functions for generating standard response formats with optional delays.
Includes helpers for single object, array, and paginated responses.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils msw --save-dev

# 或单独安装子包
npm add @jhqn/utils-msw msw --save-dev
```

## 导入方式

```ts
// 推荐：从主包导入
import { getMockData, commonRes, commonPageRes } from '@jhqn/utils'

// 可选：从子包导入
import { getMockData, commonRes, commonPageRes } from '@jhqn/utils-msw'
```

## getMockData

生成标准的单对象响应数据格式

| 参数      | 类型     | 是否必填 | 描述        |
|:--------|:-------|:-----|:----------|
| data    | T      | true | 响应数据      |
| code    | number | false | 状态码，默认 200 |
| message | string | false | 消息，默认 'success' |

**用法**
```ts
import { getMockData } from '@jhqn/utils'

// 生成标准响应格式
const response = getMockData({ name: '张三', age: 18 })
console.log(response)
// {
//   data: { name: '张三', age: 18 },
//   code: 200,
//   message: 'success'
// }

// 自定义状态码和消息
const customResponse = getMockData({ id: 1 }, 201, '创建成功')
```

## getMockDataList

生成标准的分页列表响应数据格式

| 参数      | 类型     | 是否必填 | 描述        |
|:--------|:-------|:-----|:----------|
| data    | T[]    | true | 数据数组      |
| total   | number | true | 总数        |
| code    | number | false | 状态码，默认 200 |
| message | string | false | 消息，默认 'success' |

**用法**
```ts
import { getMockDataList } from '@jhqn/utils'

const response = getMockDataList(
  [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
  100
)
console.log(response)
// {
//   data: {
//     records: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
//     total: 100
//   },
//   code: 200,
//   message: 'success'
// }
```

## commonRes

通用响应辅助函数，自动包装数据并添加随机延迟（100-1000ms）

| 参数  | 类型          | 是否必填 | 描述              |
|:----|:------------|:-----|:----------------|
| fn  | MaybeFn\<T\> | true | 数据或返回数据的函数      |
| ...args | MSW 参数    | true | MSW handler 参数 |

**用法**
```ts
import { setupWorker, rest } from 'msw'
import { commonRes } from '@jhqn/utils'

const worker = setupWorker(
  rest.get('/api/user', (...args) => {
    return commonRes({ name: '张三', age: 18 }, ...args)
  }),

  // 使用函数动态生成数据
  rest.get('/api/time', (...args) => {
    return commonRes(() => ({ timestamp: Date.now() }), ...args)
  })
)

worker.start()
```

## commonArrRes

通用数组响应辅助函数，自动生成随机数量的数据

| 参数   | 类型              | 是否必填 | 描述              |
|:-----|:----------------|:-----|:----------------|
| fn   | MaybeFn\<T\>     | true | 数据模板或返回数据的函数    |
| range | [min, max]       | true | 数组长度范围          |
| ...args | MSW 参数        | true | MSW handler 参数 |

**用法**
```ts
import { setupWorker, rest } from 'msw'
import { commonArrRes } from '@jhqn/utils'

const worker = setupWorker(
  // 生成 5-10 个用户
  rest.get('/api/users', (...args) => {
    return commonArrRes(
      { id: 1, name: '张三', email: 'test@example.com' },
      [5, 10],
      ...args
    )
  }),

  // 使用函数动态生成
  rest.get('/api/products', (...args) => {
    return commonArrRes(
      () => ({ id: Math.random(), name: '产品' }),
      [3, 8],
      ...args
    )
  })
)

worker.start()
```

## commonPageRes

通用分页响应辅助函数，自动处理分页逻辑

| 参数   | 类型          | 是否必填 | 描述              |
|:-----|:------------|:-----|:----------------|
| fn   | MaybeFn\<T\> | true | 数据模板或返回数据的函数    |
| ...args | MSW 参数    | true | MSW handler 参数 |

**特性**
- 自动读取 URL 参数 `page` 和 `count`
- 自动计算返回数据数量
- 固定总数为 45（可自行修改源码）

**用法**
```ts
import { setupWorker, rest } from 'msw'
import { commonPageRes } from '@jhqn/utils'

const worker = setupWorker(
  rest.get('/api/users/page', (...args) => {
    return commonPageRes(
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      ...args
    )
  })
)

worker.start()

// 请求：GET /api/users/page?page=1&count=10
// 返回：{ data: { records: [...], total: 45 }, code: 200, message: 'success' }
```

## commonSuccessDelayedRes

带随机延迟的成功响应组合函数（100-1000ms）

**用法**
```ts
import { context, createResponseComposition } from 'msw'
import { commonSuccessDelayedRes } from '@jhqn/utils'

// 在自定义 handler 中使用
const customHandler = rest.get('/api/custom', (req, res, ctx) => {
  return commonSuccessDelayedRes(
    ctx.json({ message: '带延迟的响应' })
  )
})
```

## 完整示例

### 配合 Vite 使用

创建 `src/mocks/browser.ts`：

```ts
import { setupWorker, rest } from 'msw'
import { commonRes, commonArrRes, commonPageRes } from '@jhqn/utils'

const handlers = [
  // 单个对象
  rest.get('/api/user/:id', (req, res, ctx) => {
    return commonRes(
      { id: req.params.id, name: '张三', email: 'zhangsan@example.com' },
      req, res, ctx
    )
  }),

  // 数组
  rest.get('/api/products', (req, res, ctx) => {
    return commonArrRes(
      { id: 1, name: '产品', price: 99.9 },
      [3, 8],
      req, res, ctx
    )
  }),

  // 分页
  rest.get('/api/orders', (req, res, ctx) => {
    return commonPageRes(
      () => ({ id: Math.random(), amount: 100 }),
      req, res, ctx
    )
  })
]

export const worker = setupWorker(...handlers)
```

在 `src/main.ts` 中启动：

```ts
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

enableMocking().then(() => {
  // 启动应用
  console.log('Mock Service Worker 已启动')
})
```

### 配合 Vue/React 项目使用

```ts
// src/mocks/handlers.ts
import { rest } from 'msw'
import { commonRes, commonPageRes } from '@jhqn/utils'

export const handlers = [
  // 获取用户信息
  rest.get('/api/user', (req, res, ctx) => {
    return commonRes({ name: '用户名', avatar: 'url' }, req, res, ctx)
  }),

  // 获取列表数据
  rest.get('/api/list', (req, res, ctx) => {
    return commonPageRes({ id: 1, title: '标题' }, req, res, ctx)
  })
]
```

## 类型定义

```ts
// MaybeFn 类型：可以是值或返回值的函数
type MaybeFn<T> = T | (() => T)

// 标准响应格式
interface MockDataResponse<T> {
  data: T
  code: number
  message: string
}

// 分页响应格式
interface MockDataListResponse<T> {
  data: {
    records: T[]
    total: number
  }
  code: number
  message: string
}
```

## 特性

- ✅ 统一的响应数据格式
- ✅ 自动添加随机延迟，模拟真实网络
- ✅ 支持动态数据生成
- ✅ 简化 MSW handler 编写
- ✅ TypeScript 类型支持
- ✅ 开箱即用的分页逻辑

## 相关资源

- [MSW 官方文档](https://mswjs.io/)
- [快速开始指南](https://mswjs.io/docs/getting-started)
- [MSW with Vite](https://mswjs.io/docs/integrations/vite)

::: tip
`@jhqn/utils-msw` 需要配合 `msw` 库使用，请确保已安装 MSW。
:::

