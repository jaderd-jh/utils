---
description: 从零开始安装和使用 @jhqn/utils 工具库的完整指南
---

# 快速上手

本节将帮助你从头开始使用utils

## 步骤一：创建一个项目

用你喜欢的方式搭一个项目，例如https://cn.vitejs.dev/guide/

``` sh
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue
```

## 步骤二：安装依赖

### 方式一：安装主包（推荐）✅

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

### 方式二：安装子包（可选）

如果你只需要特定的功能，可以只安装对应的子包：

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

::: tip 如何选择？
- **主包**：统一入口，导入更简洁，推荐大多数场景使用
- **子包**：按需安装，依赖更清晰，适合库开发或对体积敏感的场景

详见 [导入方式说明](/IMPORT-GUIDE.md)
:::

## 步骤三：使用

### 1. 在工具函数中使用

``` ts
import { dateFmt, toThousands } from '@jhqn/utils'

console.log(dateFmt('2021-01-01','YYYY/MM/DD HH:mm:ss')) // 2021/01/01 00:00:00

console.log(toThousands(123456789.88)) // 123,456,789.88
```

### 2. 在 Vue 中使用

``` vue
<script lang="ts" setup>
import { toThousands } from '@jhqn/utils'
</script>

<template>
<div>
  <p>{{ toThousands(123456789.88) }}</p>
</div>
</template>
```

### 3. 在 React 中使用

``` tsx
import { toThousands } from '@jhqn/utils'

const Index = () => {
  return (
    <div>
      <p>{ toThousands(123456789.88) }</p>
    </div>
  )
}
```

### 4. 类型校验示例

```ts
import { isPhone, isIdCard, isEmail } from '@jhqn/utils'

// 手机号验证
console.log(isPhone('13800138000')) // true
console.log(isPhone('12345678901')) // false

// 身份证验证
console.log(isIdCard('330102199001011234')) // true

// 邮箱验证
console.log(isEmail('test@example.com')) // true
```

### 5. 数据脱敏示例

```ts
import { hidePhone, hideCardNo, hideEmail } from '@jhqn/utils'

// 手机号脱敏
console.log(hidePhone('13800138000')) // 138****8000

// 身份证脱敏
console.log(hideCardNo('330102199001011234')) // 3***************4

// 邮箱脱敏
console.log(hideEmail('test@example.com')) // test***@example.com
```

## 下一步

- 查看 [API 文档](/core/validate) 了解所有可用的工具函数
- 了解 [数据脱敏](/core/desensitize) 功能
- 学习 [字符串转换](/core/case) 工具

<llm-only>
This guide covers installing @jhqn/utils in your project and using it in different frameworks.
You can install either the main package or individual sub-packages.
Examples include basic formatting, validation, and data desensitization functions.
</llm-only>

