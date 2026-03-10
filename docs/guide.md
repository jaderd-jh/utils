---
description: 工具库使用指南
---

# 使用指南

欢迎使用 `@jhqn/utils` 工具库！本指南将帮助您快速掌握库的核心功能。

## 📦 安装

### 安装主包（推荐）

```bash
# npm
npm add @jhqn/utils

# pnpm
pnpm add @jhqn/utils

# yarn
yarn add @jhqn/utils
```

### 安装子包（可选）

如果只需要特定功能，可以单独安装子包：

```bash
# 核心工具（格式化、验证、脱敏等）
npm add @jhqn/utils-core

# 加密工具
npm add @jhqn/utils-crypto

# 存储管理
npm add @jhqn/utils-storage

# 模拟数据
npm add @jhqn/utils-faker

# Mock Service Worker
npm add @jhqn/utils-msw
```

## 🚀 导入方式

### 方式一：主包导入（推荐）✅

```ts
// 从主包统一导入
import { parseToJSON, isPhone, setLocal, aes } from '@jhqn/utils'
```

**优点**：
- ✅ 简单方便，一个导入语句
- ✅ 自动包含所有子包功能
- ✅ 支持 tree-shaking，未使用的代码不会被打包

### 方式二：子包导入

```ts
// 按需导入特定子包
import { parseToJSON, isPhone } from '@jhqn/utils-core'
import { setLocal, getLocal } from '@jhqn/utils-storage'
import { aes } from '@jhqn/utils-crypto'
```

**优点**：
- ✅ 更明确的依赖关系
- ✅ 更清晰的模块划分

<llm-only>
The library supports two import methods: main package import (recommended) and sub-package import.
Main package import provides a unified entry point while sub-package import offers more explicit dependencies.
</llm-only>

## 🎯 核心功能

### 1. 数据格式化 (`@jhqn/utils-core`)

处理数据格式转换和解析：

```ts
import { parseToJSON, formatNumber, formatBytes } from '@jhqn/utils'

// JSON 解析（带容错）
const data = parseToJSON('{"name": "张三"}')

// 数字格式化
const money = formatNumber(1234567.89, 2)  // '1,234,567.89'

// 字节格式化
const size = formatBytes(1024 * 1024)  // '1 MB'
```

### 2. 数据验证 (`@jhqn/utils-core`)

验证用户输入和数据格式：

```ts
import { isPhone, isEmail, isIdCard } from '@jhqn/utils'

// 验证手机号
isPhone('13800138000')  // true

// 验证邮箱
isEmail('test@example.com')  // true

// 验证身份证号
isIdCard('330723199001011234')  // true
```

### 3. 数据脱敏 (`@jhqn/utils-core`)

隐藏敏感信息：

```ts
import { hidePhone, hideCardNo, hideEmail } from '@jhqn/utils'

// 手机号脱敏
hidePhone('13800138000')  // '138****8000'

// 身份证脱敏
hideCardNo('330723199001011234')  // '3****************4'

// 邮箱脱敏
hideEmail('test@example.com')  // 'tes***@example.com'
```

### 4. 数据加密 (`@jhqn/utils-crypto`)

AES 加密解密：

```ts
import { aes } from '@jhqn/utils'

// 加密
const encrypted = aes.encrypt('敏感数据')
// 'U2FsdGVkX1+vupppZksvRf5pq5z5...'

// 解密
const decrypted = aes.decrypt(encrypted)
// '敏感数据'
```

### 5. 本地存储 (`@jhqn/utils-storage`)

增强的 localStorage/sessionStorage：

#### Vue 3 Composition API

```ts
import { useLocal, useSession } from '@jhqn/utils/storage/vue'

// 响应式 localStorage
const token = useLocal('token', '')
token.value = 'new-token'  // 自动同步到 localStorage

// 带加密
const userInfo = useLocal('user', null, true)
```

#### React (Jotai)

```ts
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'
import { useAtom } from 'jotai'

// 创建 atom
const tokenAtom = atomWithLocal('token', '')

// 使用
const [token, setToken] = useAtom(tokenAtom)
```

<llm-only>
Storage functions support both Vue 3 (Composition API with useStorage) and React (Jotai atoms).
Both implementations support optional AES encryption and automatic synchronization.
</llm-only>

### 6. 模拟数据 (`@jhqn/utils-faker`)

生成测试数据：

```ts
import { fakeName, fakePhone, fakeEmail } from '@jhqn/utils'

// 生成姓名
fakeName()  // '张三'

// 生成手机号
fakePhone()  // '13800138000'

// 生成邮箱
fakeEmail()  // 'test@example.com'
```

## 📚 最佳实践

### 1. 统一导入

推荐从主包统一导入：

```ts
// ✅ 推荐
import { isPhone, hidePhone, setLocal, aes } from '@jhqn/utils'

// ⚠️ 不推荐（除非有特殊需求）
import { isPhone } from '@jhqn/utils-core'
import { hidePhone } from '@jhqn/utils-core'
import { setLocal } from '@jhqn/utils-storage'
import { aes } from '@jhqn/utils-crypto'
```

### 2. 按需导入

只导入需要的功能，利用 tree-shaking：

```ts
// ✅ 好 - 只导入需要的函数
import { isPhone, hidePhone } from '@jhqn/utils'

// ❌ 避免 - 导入整个库
import * as utils from '@jhqn/utils'
```

### 3. TypeScript 支持

库完全使用 TypeScript 编写，提供完整的类型定义：

```ts
import type { StorageObj } from '@jhqn/utils'

interface User {
  id: number
  name: string
}

const data: StorageObj<User> = {
  data: { id: 1, name: '张三' },
  timestamp: Date.now()
}
```

### 4. 错误处理

库中的函数都有完善的错误处理，无需额外 try-catch：

```ts
// 自动容错，返回 null
const data = parseToJSON('invalid json')  // null

// 自动处理无效输入
const phone = hidePhone('')  // ''
```

## 🔗 相关链接

- [快速上手](/getting-started) - 快速开始使用
- [配置说明](/configs) - 详细的配置选项
- [API 参考](/core/format) - 完整的 API 文档

## 💡 小贴士

::: tip Tree-shaking 支持
使用现代打包工具（Vite、Webpack 5+、Rollup）时，未使用的代码会被自动移除，不会增加打包体积。
:::

::: warning 浏览器兼容性
库主要面向现代浏览器和 Node.js 环境。如需支持旧浏览器，请确保您的构建工具配置了正确的转译规则。
:::

<llm-only>
Best practices include: unified imports from main package, on-demand imports for tree-shaking,
TypeScript support, and built-in error handling. The library supports modern browsers and Node.js.
</llm-only>
