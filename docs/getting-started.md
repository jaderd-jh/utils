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

```sh [bun]
$ bun add @jhqn/utils
```

:::

## 步骤三：使用
### 1.在工具函数中使用
``` ts
import { getHostEnv } from '@jhqn/utils'
console.log(getHostEnv())
```
### 2.在vue中使用
``` vue
<script lang="ts" setup>
import { dayjs } from '@jhqn/utils'
</script>

<template>
<div>
  <p>{{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}</p>
</template>
```
### 3.在react中使用
``` tsx
 import { dayjs } from '@jhqn/utils'
 const Index = () => {
    return (
        <div>
          <p>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
    )
```
