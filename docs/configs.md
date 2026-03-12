---
description: 配置选项和自定义设置
---

# 配置说明

本文档介绍 `@jhqn/utils` 的通用配置选项。

## 📦 安装配置

### 包管理器

支持 npm、pnpm、yarn 等主流包管理器：

::: code-group

```bash [npm]
npm add @jhqn/utils
```

```bash [pnpm]
pnpm add @jhqn/utils
```

```bash [yarn]
yarn add @jhqn/utils
```

:::

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

## 🎯 按需加载配置

### Vite 配置

Vite 会自动进行 tree-shaking，无需额外配置：

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'utils': ['@jhqn/utils'],
        },
      },
    },
  },
})
```

### Webpack 配置

Webpack 5+ 默认支持 tree-shaking：

```js
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
}
```

::: tip sideEffects
`@jhqn/utils` 的 package.json 已配置 `"sideEffects": false`，确保最佳 tree-shaking 效果。
:::

## 🔐 加密配置

`@jhqn/utils-crypto` 支持自定义 AES 密钥：

```ts
import { setCryptoKey } from '@jhqn/utils-crypto'

// 设置加密密钥
setCryptoKey(import.meta.env.VITE_AES_KEY)
```

```env
# .env
VITE_AES_KEY=your-very-secure-key-here
```

::: warning 安全提示

- ❌ 不要在代码中硬编码密钥
- ✅ 使用环境变量管理密钥
- ✅ 生产环境使用强密钥（至少 32 字符）
  :::

详细的加密配置请参考 [Crypto 文档](/crypto)。

## 🌍 环境配置

### SSR 配置

在服务端渲染（SSR）环境中使用：

```ts
import { inBrowser, getLocal, setLocal } from '@jhqn/utils'

// 安全地访问存储
function getStoredToken(): string | null {
  if (!inBrowser) {
    return null // SSR 环境返回 null
  }
  return getLocal('token')
}
```

## 📊 TypeScript 配置

库提供完整的 TypeScript 类型定义：

```ts
import type { StorageObj, Nullable } from '@jhqn/utils'

const data: StorageObj<User> = {
  data: { id: 1, name: '张三' },
  timestamp: Date.now(),
}
```

确保 TypeScript 配置正确：

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
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
    environment: 'jsdom',
    globals: true,
  },
})
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
  },
}
```

## 📚 相关链接

- [使用指南](/guide) - 导入方式和最佳实践
- [快速开始](/getting-started) - 基础使用教程
- [API 参考](/core/format) - 完整的 API 文档

<llm-only>
Configuration options include: tree-shaking setup for Vite/Webpack, AES encryption
with custom keys via environment variables, SSR compatibility, and TypeScript support.
</llm-only>
