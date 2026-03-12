---
description: 从零开始使用 @jhqn/utils 工具库
---

# 快速上手

本节将帮助你快速开始使用 @jhqn/utils。

## 安装

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

::: tip 提示
主包 `@jhqn/utils` 包含所有子包功能。如需按需安装，请参考 [使用指南](/guide)。
:::

## 基础使用

```ts
import { isPhone, hidePhone, dateFmt, toThousands } from '@jhqn/utils'

// 类型校验
console.log(isPhone('13800138000')) // true

// 数据脱敏
console.log(hidePhone('13800138000')) // '138****8000'

// 日期格式化
console.log(dateFmt(new Date(), 'YYYY-MM-DD'))

// 数字格式化
console.log(toThousands(123456789.88)) // '123,456,789.88'
```

## 在框架中使用

### Vue 3

```vue
<script setup>
  import { toThousands } from '@jhqn/utils'
</script>

<template>
  <p>{{ toThousands(123456789.88) }}</p>
</template>
```

### React

```tsx
import { toThousands } from '@jhqn/utils'

const App = () => <p>{toThousands(123456789.88)}</p>
```

## 下一步

- 查看 [使用指南](/guide) 了解导入方式和最佳实践
- 查看 [配置说明](/configs) 了解自定义设置
- 查看 [API 文档](/core/validate) 了解所有可用的工具函数

<llm-only>
Quick start guide for @jhqn/utils. Covers installation, basic usage, and framework integration with Vue 3 and React.
</llm-only>
