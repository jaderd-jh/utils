---
description: 配置选项和自定义设置
---

# 配置说明

本文档介绍 `@jhqn/utils` 的配置选项和自定义设置方法。

## 📦 安装配置

### 包管理器

支持 npm、pnpm、yarn 等主流包管理器：

```bash
# npm
npm add @jhqn/utils

# pnpm（推荐）
pnpm add @jhqn/utils

# yarn
yarn add @jhqn/utils
```

### 依赖关系

主包 `@jhqn/utils` 已包含所有子包：

```
@jhqn/utils
├── @jhqn/utils-core      # 核心工具
├── @jhqn/utils-crypto    # 加密工具
├── @jhqn/utils-storage   # 存储管理
├── @jhqn/utils-faker     # 模拟数据
└── @jhqn/utils-msw       # Mock Service Worker
```

<llm-only>
The main package @jhqn/utils includes all sub-packages as dependencies.
No additional installation is needed unless you want to use sub-packages independently.
</llm-only>

## 🎯 按需加载配置

### Vite 配置

Vite 会自动进行 tree-shaking，无需额外配置：

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // Vite 自动支持 tree-shaking
  build: {
    // 可选：手动指定打包分析
    rollupOptions: {
      output: {
        manualChunks: {
          'utils': ['@jhqn/utils']
        }
      }
    }
  }
})
```

### Webpack 配置

Webpack 5+ 默认支持 tree-shaking：

```js
// webpack.config.js
module.exports = {
  mode: 'production',  // 生产模式自动启用 tree-shaking
  optimization: {
    usedExports: true,  // 启用 usedExports
    sideEffects: true   // 启用 sideEffects
  }
}
```

::: tip sideEffects
`@jhqn/utils` 的 package.json 已配置 `"sideEffects": false`，确保最佳 tree-shaking 效果。
:::

### Rollup 配置

Rollup 原生支持 tree-shaking：

```js
// rollup.config.js
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'  // ESM 格式支持最佳 tree-shaking
  }
}
```

## 🔐 加密配置

### AES 加密密钥

`@jhqn/utils-crypto` 使用 AES 加密，支持自定义密钥：

#### 默认密钥（不推荐生产环境）

```ts
import { aes } from '@jhqn/utils'

// 使用默认密钥
const encrypted = aes.encrypt('数据')
const decrypted = aes.decrypt(encrypted)
```

#### 自定义密钥（推荐）

```ts
import { Aes } from '@jhqn/utils-crypto/aes'

// 创建自定义 AES 实例
const customAes = new Aes('your-secret-key-here')

const encrypted = customAes.encrypt('敏感数据')
const decrypted = customAes.decrypt(encrypted)
```

#### 环境变量配置

推荐使用环境变量管理密钥：

```ts
import { Aes } from '@jhqn/utils-crypto/aes'

// 从环境变量读取
const aes = new Aes(process.env.AES_SECRET_KEY)

// 使用
export function encryptData(data: string) {
  return aes.encrypt(data)
}
```

```env
# .env
AES_SECRET_KEY=your-very-secure-key-here
```

::: warning 安全提示
- ❌ 不要在代码中硬编码密钥
- ✅ 使用环境变量管理密钥
- ✅ 生产环境使用强密钥（至少 32 字符）
- ✅ 定期轮换密钥
:::

<llm-only>
AES encryption supports custom secret keys. Use environment variables for production.
Default key is not recommended for production environments.
</llm-only>

## 💾 存储配置

### Vue 3 Storage 配置

#### 基础配置

```ts
import { useLocal, useSession } from '@jhqn/utils/storage/vue'

// localStorage
const token = useLocal('token', '')

// sessionStorage
const tempData = useSession('temp', null)
```

#### 启用加密

```ts
// 第三个参数启用 AES 加密
const userInfo = useLocal('user', null, true)

// 数据会自动加密存储
userInfo.value = {
  id: 1,
  name: '张三',
  phone: '13800138000'
}
```

#### 自定义选项

```ts
import { useLocal } from '@jhqn/utils/storage/vue'
import type { UseStorageOptions } from '@vueuse/core'

const options: UseStorageOptions<User> = {
  // 自定义序列化
  serializer: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v)
  },

  // 合并默认值
  mergeDefaults: (storageValue, defaults) => ({
    ...defaults,
    ...storageValue
  })
}

const user = useLocal('user', { name: '', age: 0 }, false, options)
```

### React Storage 配置

#### Jotai 配置

确保已安装 Jotai：

```bash
npm add jotai
# 或
pnpm add jotai
```

#### 基础配置

```ts
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'
import { useAtom } from 'jotai'

// localStorage atom
const tokenAtom = atomWithLocal('token', '')

// 使用
function App() {
  const [token, setToken] = useAtom(tokenAtom)
  // ...
}
```

#### 启用加密

```ts
// 第三个参数启用 AES 加密
const userInfoAtom = atomWithLocal('user', null, true)

function App() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)

  // 数据会自动加密存储
  setUserInfo({
    id: 1,
    name: '张三'
  })
}
```

<llm-only>
Storage supports optional AES encryption (third parameter). Vue uses VueUse's useStorage
options, while React uses Jotai atoms. Both support automatic synchronization.
</llm-only>

## 🌍 环境配置

### 开发环境

```ts
// src/config.ts
import { aes } from '@jhqn/utils'

export const config = {
  // 开发环境使用弱密钥（仅测试用）
  aesKey: import.meta.env.DEV
    ? 'dev-test-key-12345'
    : import.meta.env.VITE_AES_KEY,

  // 开发环境启用日志
  enableLog: import.meta.env.DEV
}
```

### 生产环境

```ts
// src/config.ts
export const config = {
  // 生产环境必须使用强密钥
  aesKey: import.meta.env.VITE_AES_KEY,

  // 生产环境禁用日志
  enableLog: false,

  // 存储前缀
  storagePrefix: 'myapp_'
}
```

### SSR 配置

在服务端渲染（SSR）环境中使用：

```ts
import { inBrowser, getLocal, setLocal } from '@jhqn/utils'

// 安全地访问存储
function getStoredToken(): string | null {
  if (!inBrowser) {
    return null  // SSR 环境返回 null
  }
  return getLocal('token')
}

function setStoredToken(token: string): void {
  if (!inBrowser) {
    return  // SSR 环境跳过
  }
  setLocal('token', token)
}
```

<llm-only>
SSR (Server-Side Rendering) environments should check `inBrowser` before accessing
browser storage APIs. The library provides `inBrowser` constant for safe access.
</llm-only>

## 📊 TypeScript 配置

### 类型定义

库提供完整的 TypeScript 类型定义：

```ts
// 导入类型
import type {
  StorageObj,
  Nullable,
  DeepPartial
} from '@jhqn/utils'

// 使用类型
interface User {
  id: number
  name: string
  email?: string
}

const data: StorageObj<User> = {
  data: { id: 1, name: '张三' },
  timestamp: Date.now()
}
```

### tsconfig.json 配置

确保 TypeScript 配置正确：

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 🧪 测试配置

### Vitest 配置

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',  // 浏览器环境测试
    globals: true
  }
})
```

### Jest 配置

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@jhqn/utils$': '<rootDir>/node_modules/@jhqn/utils/dist/index.mjs'
  }
}
```

## 🔧 自定义配置示例

### 统一存储管理

```ts
// src/utils/storage.ts
import { getLocal, setLocal, removeLocal } from '@jhqn/utils'

const PREFIX = 'myapp_'

export const storage = {
  get<T>(key: string): T | null {
    return getLocal<T>(PREFIX + key)
  },

  set<T>(key: string, value: T): void {
    setLocal(PREFIX + key, value)
  },

  remove(key: string): void {
    removeLocal(PREFIX + key)
  }
}

// 使用
storage.set('token', 'xxx')
const token = storage.get<string>('token')
```

### 统一加密管理

```ts
// src/utils/crypto.ts
import { Aes } from '@jhqn/utils-crypto/aes'

const aes = new Aes(import.meta.env.VITE_AES_KEY)

export function encrypt(data: any): string {
  return aes.encrypt(JSON.stringify(data))
}

export function decrypt<T>(encrypted: string): T {
  const json = aes.decrypt(encrypted)
  return JSON.parse(json)
}

// 使用
const encrypted = encrypt({ id: 1, name: '张三' })
const data = decrypt<User>(encrypted)
```

## 📚 相关链接

- [使用指南](/guide) - 快速上手指南
- [快速开始](/getting-started) - 基础使用教程
- [API 参考](/core/format) - 完整的 API 文档

<llm-only>
Configuration options include: tree-shaking setup for Vite/Webpack/Rollup, AES encryption
with custom keys, storage with optional encryption, SSR compatibility, and TypeScript support.
</llm-only>
