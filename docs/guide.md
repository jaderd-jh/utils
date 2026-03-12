---
description: 工具库使用指南
---

# 使用指南

欢迎使用 `@jhqn/utils` 工具库！本指南将帮助您快速掌握库的核心功能。

## 📦 安装

### 安装主包（推荐）

::: code-group

```sh [npm]
$ npm add @jhqn/utils
```

```sh [pnpm]
$ pnpm add @jhqn/utils
```

```sh [yarn]
$ yarn add @jhqn/utils
```

:::

### 安装子包（可选）

如果只需要特定功能，可以单独安装子包：

::: code-group

```sh [npm]
$ npm add @jhqn/utils-core      # 核心工具函数
$ npm add @jhqn/utils-crypto    # 加密解密
$ npm add @jhqn/utils-storage   # 存储管理
$ npm add @jhqn/utils-faker     # 模拟数据
$ npm add @jhqn/utils-msw       # Mock Service Worker
```

```sh [pnpm]
$ pnpm add @jhqn/utils-core      # 核心工具函数
$ pnpm add @jhqn/utils-crypto    # 加密解密
$ pnpm add @jhqn/utils-storage   # 存储管理
$ pnpm add @jhqn/utils-faker     # 模拟数据
$ pnpm add @jhqn/utils-msw       # Mock Service Worker
```

```sh [yarn]
$ yarn add @jhqn/utils-core      # 核心工具函数
$ yarn add @jhqn/utils-crypto    # 加密解密
$ yarn add @jhqn/utils-storage   # 存储管理
$ yarn add @jhqn/utils-faker     # 模拟数据
$ yarn add @jhqn/utils-msw       # Mock Service Worker
```

:::

## 🚀 导入方式

### 方式一：主包导入（推荐）✅

```ts
// 从主包统一导入
import { parseJSON, isPhone, hidePhone, setLocal, aes } from '@jhqn/utils'

// 或使用主包的子路径（框架集成）
import { useLocal } from '@jhqn/utils/storage/vue'
import { atomWithLocal } from '@jhqn/utils/storage/react'
```

**优点**：

- ✅ 统一入口，导入更简洁
- ✅ 一次安装，按需使用
- ✅ 自动 Tree-shaking
- ✅ 完整的 TypeScript 支持

### 方式二：子包导入

```ts
// 从各个子包单独导入
import { parseJSON, isPhone, hidePhone } from '@jhqn/utils-core'
import { setLocal, getLocal } from '@jhqn/utils-storage'
import { aes } from '@jhqn/utils-crypto'
import { fakeName } from '@jhqn/utils-faker'
```

**优点**：

- ✅ 更精确的依赖控制
- ✅ 减小 node_modules 体积
- ✅ 清晰的模块边界

### 对比

| 特性             | 主包导入    | 子包导入    |
| ---------------- | ----------- | ----------- |
| **简洁性**       | ✅ 更简洁   | ⚠️ 较繁琐   |
| **依赖管理**     | ✅ 统一管理 | ⚠️ 手动管理 |
| **Tree-shaking** | ✅ 支持     | ✅ 支持     |
| **TypeScript**   | ✅ 完整     | ✅ 完整     |
| **适合场景**     | 应用开发    | 库开发      |

::: tip 如何选择？

- **主包**：统一入口，导入更简洁，推荐大多数场景使用
- **子包**：按需安装，依赖更清晰，适合库开发或对体积敏感的场景
  :::

## 📦 包结构

```
@jhqn/utils (主包)
├── core      → @jhqn/utils-core
├── crypto    → @jhqn/utils-crypto
├── faker     → @jhqn/utils-faker
├── msw       → @jhqn/utils-msw
└── storage   → @jhqn/utils-storage
    ├── vue
    └── react
```

## 🎯 核心功能

### 1. 数据格式化

```ts
import { parseJSON, toThousands, currencyFmt } from '@jhqn/utils'

// JSON 解析（带容错）
const data = parseJSON('{"name": "张三"}')

// 数字格式化
console.log(toThousands(123456789.88)) // 123,456,789.88

// 货币格式化
console.log(currencyFmt(1234.56)) // ¥1,234.56
```

### 2. 数据验证

```ts
import { isPhone, isEmail, isIdCard } from '@jhqn/utils'

isPhone('13800138000') // true
isEmail('test@example.com') // true
isIdCard('330723199001011234') // true
```

### 3. 数据脱敏

```ts
import { hidePhone, hideCardNo, hideEmail } from '@jhqn/utils'

hidePhone('13800138000') // '138****8000'
hideCardNo('330723199001011234') // '3****************4'
hideEmail('test@example.com') // 'tes***@example.com'
```

### 4. 数据加密

```ts
import { aes, setCryptoKey } from '@jhqn/utils'

// 设置加密密钥（推荐）
setCryptoKey('your-secret-key')

// 加密
const encrypted = aes.encrypt('敏感数据')

// 解密
const decrypted = aes.decrypt(encrypted)
```

### 5. 本地存储

#### Vue 3

```ts
import { useLocal, useSession } from '@jhqn/utils/storage/vue'

// 响应式 localStorage
const token = useLocal('token', '')
token.value = 'new-token' // 自动同步

// 带加密
const userInfo = useLocal('user', null, true)
```

#### React (Jotai)

```ts
import { atomWithLocal } from '@jhqn/utils/storage/react'
import { useAtom } from 'jotai'

const tokenAtom = atomWithLocal('token', '')
const [token, setToken] = useAtom(tokenAtom)
```

### 6. 模拟数据

```ts
import { fakeName, fakePhone, fakeId } from '@jhqn/utils'

fakeName() // '张三'
fakePhone() // '13800138000'
fakeId() // '1234567890123456'
```

## 📚 最佳实践

### 1. 统一导入

```ts
// ✅ 推荐
import { isPhone, hidePhone, setLocal } from '@jhqn/utils'

// ⚠️ 不推荐（除非有特殊需求）
import { isPhone } from '@jhqn/utils-core'
import { hidePhone } from '@jhqn/utils-core'
import { setLocal } from '@jhqn/utils-storage'
```

### 2. 按需导入

```ts
// ✅ 好 - 只导入需要的函数
import { isPhone, hidePhone } from '@jhqn/utils'

// ❌ 避免 - 导入整个库
import * as utils from '@jhqn/utils'
```

### 3. 不要混用

```ts
// ❌ 不要混用
import { isPhone } from '@jhqn/utils'
import { hidePhone } from '@jhqn/utils-core'
```

## 💡 小贴士

::: tip Tree-shaking 支持
使用现代打包工具（Vite、Webpack 5+、Rollup）时，未使用的代码会被自动移除，不会增加打包体积。`@jhqn/utils` 的 package.json 已配置 `"sideEffects": false`。
:::

::: warning 浏览器兼容性
库主要面向现代浏览器和 Node.js 环境。如需支持旧浏览器，请确保您的构建工具配置了正确的转译规则。
:::

## 🔗 相关链接

- [快速上手](/getting-started) - 快速开始使用
- [配置说明](/configs) - 详细的配置选项
- [API 参考](/core/validate) - 完整的 API 文档

<llm-only>
The library supports two import methods: main package import (recommended) and sub-package import.
Main package import provides a unified entry point while sub-package import offers more explicit dependencies.
Best practices include unified imports, on-demand imports, and avoiding mixed usage.
</llm-only>
