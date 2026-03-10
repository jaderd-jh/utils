---
description: Vue 3 响应式存储 Hook，基于 @vueuse/core 自动同步 localStorage 和组件状态
---

# Vue Storage

Vue 3 响应式存储 Hook，基于 [@vueuse/core](https://vueuse.org/) 的 `useStorage` 实现，自动同步 localStorage/sessionStorage 和 Vue 响应式状态。

<llm-only>
Vue 3 reactive storage hooks based on @vueuse/core's useStorage.
Provides automatic synchronization between localStorage/sessionStorage and Vue reactive state.
Supports encryption and decryption with @jhqn/utils-crypto.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils @vueuse/core

# 或单独安装子包
npm add @jhqn/utils-storage @vueuse/core

# pnpm
pnpm add @jhqn/utils @vueuse/core

# yarn
yarn add @jhqn/utils @vueuse/core
```

::: warning 依赖说明
- **Vue 3**：需要 Vue 3.0.0 或更高版本
- **VueUse**：需要 @vueuse/core 10.0.0 或更高版本
:::

## 导入方式

```ts
// 推荐：从主包导入
import { useLocal, useSession } from '@jhqn/utils/storage/vue'

// 可选：从子包导入
import { useLocal, useSession } from '@jhqn/utils-storage/vue'
```

::: tip 包路径说明
- **包名**：`@jhqn/utils` 或 `@jhqn/utils-storage`
- **子路径**：`/vue`（通过 package.json exports 配置）
- **完整导入路径**：`@jhqn/utils/storage/vue`
:::

## 工作原理

### 核心机制

`useLocal` 和 `useSession` 基于 VueUse 的 `useStorage` 实现，提供了以下核心功能：

1. **双向绑定**：响应式状态和 localStorage/sessionStorage 自动同步
2. **自动序列化**：自动处理 JSON 序列化和反序列化
3. **加密支持**：可选的 AES 加密/解密
4. **响应式更新**：状态变化自动触发存储更新，反之亦然

### 数据流

```
组件状态 (Ref<T>)
    ↕ (双向绑定)
useStorage (VueUse)
    ↕ (序列化/反序列化)
localStorage/sessionStorage
    ↕ (可选加密/解密)
磁盘存储
```

### 序列化器

自定义序列化器实现了特殊的序列化逻辑：

```ts
// 读取时
serializer.read = (v: string) => {
  const decrypted = crypto ? aes.decrypt(v) : v
  const parsed = storageParse<T>(decrypted)
  return parsed.data // 返回实际数据
}

// 写入时
serializer.write = (v: T) => {
  const stringified = storageStringify(v)
  const encrypted = crypto ? aes.encrypt(stringified) : stringified
  return encrypted
}
```

**特点**：
- 自动添加时间戳（用于过期检查）
- 支持 Map 类型（使用 replacer/reviver）
- 可选的 AES 加密

## useLocal

响应式 localStorage Hook

### 参数

| 参数           | 类型                    | 是否必填 | 描述                     |
|:-------------|:----------------------|:-----|:-----------------------|
| key          | string                | true | 存储键名                   |
| initialValue | MaybeRef\<T\>          | true | 初始值（可以是 ref 或普通值） |
| crypto       | boolean               | false | 是否启用加密，默认 false     |
| options      | UseStorageOptions\<T\> | false | VueUse 配置选项          |

### 返回值

返回 `Ref<T>` - 响应式引用，自动同步到 localStorage

### 类型约束

```ts
T extends string | number | boolean | object | null
```

**支持的数据类型**：
- ✅ 字符串（string）
- ✅ 数字（number）
- ✅ 布尔值（boolean）
- ✅ 对象（object）
- ✅ null
- ✅ 数组（Array）
- ✅ Map（通过 replacer/reviver 支持）

### 基础用法

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

interface User {
  name: string
  age: number
}

// 使用对象作为初始值
const user = useLocal<User>('user', { name: '张三', age: 18 })

// 修改会自动同步到 localStorage
user.value.name = '李四'
user.value.age = 20

// 使用 ref 作为初始值
const initialName = ref('王五')
const name = useLocal('name', initialName)

// 使用简单类型
const count = useLocal('count', 0)
const enabled = useLocal('enabled', false)
const title = useLocal('title', '默认标题')
</script>

<template>
  <div>
    <p>用户名：{{ user.name }}</p>
    <p>年龄：{{ user.age }}</p>

    <input v-model="user.name" placeholder="修改用户名" />
    <input v-model.number="user.age" type="number" placeholder="修改年龄" />
  </div>
</template>
```

## useSession

响应式 sessionStorage Hook

### 参数

| 参数           | 类型                    | 是否必填 | 描述                     |
|:-------------|:----------------------|:-----|:-----------------------|
| key          | string                | true | 存储键名                   |
| initialValue | MaybeRef\<T\>          | true | 初始值（可以是 ref 或普通值） |
| crypto       | boolean               | false | 是否启用加密，默认 false     |
| options      | UseStorageOptions\<T\> | false | VueUse 配置选项          |

### 返回值

返回 `Ref<T>` - 响应式引用，自动同步到 sessionStorage

### 基础用法

```vue
<script setup lang="ts">
import { useSession } from '@jhqn/utils/storage/vue'

// 存储会话令牌
const token = useSession('token', '')

// 修改会自动同步到 sessionStorage
token.value = 'new-token-12345'

// 在页面刷新前数据会自动保存
onBeforeUnmount(() => {
  // 数据已自动保存到 sessionStorage
})

// 存储临时表单数据
const tempForm = useSession('temp-form', {
  name: '',
  email: '',
  phone: ''
})
</script>

<template>
  <div>
    <p>Token: {{ token }}</p>
    <button @click="token = ''">清除 Token</button>

    <form>
      <input v-model="tempForm.name" placeholder="姓名" />
      <input v-model="tempForm.email" placeholder="邮箱" />
      <input v-model="tempForm.phone" placeholder="电话" />
    </form>
  </div>
</template>
```

## 加密存储

### 配置加密密钥

使用加密功能前需要设置加密密钥：

```ts
// main.ts
import { createApp } from 'vue'
import { setCryptoKey } from '@jhqn/utils'
import App from './App.vue'

// 设置加密密钥（推荐使用环境变量）
setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)

createApp(App).mount('#app')
```

### 环境变量配置

```env
# .env
VITE_CRYPTO_KEY=your-secret-key-from-env

# .env.production
VITE_CRYPTO_KEY=your-production-secret-key
```

### 使用加密 Hook

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

interface SensitiveData {
  password: string
  apiKey: string
  apiSecret: string
}

// 启用加密存储（第三个参数为 true）
const credentials = useLocal<SensitiveData>('credentials', {
  password: '',
  apiKey: '',
  apiSecret: ''
}, true)

// 数据会自动加密后存储，读取时自动解密
credentials.value.password = 'my-password'
credentials.value.apiKey = 'sk-xxxxx'
credentials.value.apiSecret = 'secret-xxxxx'

// 存储在 localStorage 中的是加密后的数据
// 例如：'U2FsdGVkX1+7x8y...'
</script>

<template>
  <div>
    <input v-model="credentials.password" type="password" placeholder="密码" />
    <input v-model="credentials.apiKey" placeholder="API Key" />
    <input v-model="credentials.apiSecret" placeholder="API Secret" />
  </div>
</template>
```

### 加密存储示例

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

interface UserCredentials {
  username: string
  password: string
  rememberMe: boolean
}

// 加密存储用户登录信息
const loginCredentials = useLocal<UserCredentials>('login-credentials', {
  username: '',
  password: '',
  rememberMe: false
}, true)

// 登录
async function handleLogin() {
  // 发送登录请求
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      username: loginCredentials.value.username,
      password: loginCredentials.value.password
    })
  })

  if (response.ok) {
    // 如果勾选"记住我"，数据会自动保存（已加密）
    console.log('登录成功')
  }
}

// 自动填充
onMounted(() => {
  if (loginCredentials.value.rememberMe) {
    console.log('自动填充用户名:', loginCredentials.value.username)
  }
})
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="loginCredentials.username" placeholder="用户名" />
    <input v-model="loginCredentials.password" type="password" placeholder="密码" />
    <label>
      <input v-model="loginCredentials.rememberMe" type="checkbox" />
      记住我
    </label>
    <button type="submit">登录</button>
  </form>
</template>
```

## 完整示例

### 1. 用户偏好设置

实现持久化的用户偏好设置管理：

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'
import { computed } from 'vue'

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US' | 'ja-JP'
  fontSize: number
  notifications: boolean
  autoSave: boolean
}

// 用户偏好设置，持久化到 localStorage
const preferences = useLocal<UserPreferences>('user-preferences', {
  theme: 'light',
  language: 'zh-CN',
  fontSize: 14,
  notifications: true,
  autoSave: true
})

// 切换主题
const toggleTheme = () => {
  const themes: UserPreferences['theme'][] = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(preferences.value.theme)
  preferences.value.theme = themes[(currentIndex + 1) % themes.length]
}

// 应用主题
const applyTheme = () => {
  const root = document.documentElement

  if (preferences.value.theme === 'dark') {
    root.classList.add('dark')
  } else if (preferences.value.theme === 'light') {
    root.classList.remove('dark')
  } else {
    // auto: 根据系统设置
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
  }
}

// 监听主题变化
watch(() => preferences.value.theme, applyTheme, { immediate: true })

// 调整字体大小
const adjustFontSize = (delta: number) => {
  const newSize = preferences.value.fontSize + delta
  if (newSize >= 12 && newSize <= 20) {
    preferences.value.fontSize = newSize
  }
}

// 主题标签
const themeLabel = computed(() => {
  const labels = {
    light: '浅色',
    dark: '深色',
    auto: '自动'
  }
  return labels[preferences.value.theme]
})
</script>

<template>
  <div :class="preferences.theme" :style="{ fontSize: `${preferences.fontSize}px` }">
    <h1>用户设置</h1>

    <!-- 主题设置 -->
    <div class="setting-item">
      <label>主题：</label>
      <button @click="toggleTheme">{{ themeLabel }}</button>
    </div>

    <!-- 语言设置 -->
    <div class="setting-item">
      <label>语言：</label>
      <select v-model="preferences.language">
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
        <option value="ja-JP">日本語</option>
      </select>
    </div>

    <!-- 字体大小 -->
    <div class="setting-item">
      <label>字体大小：{{ preferences.fontSize }}px</label>
      <button @click="adjustFontSize(-1)" :disabled="preferences.fontSize <= 12">减小</button>
      <button @click="adjustFontSize(1)" :disabled="preferences.fontSize >= 20">增大</button>
    </div>

    <!-- 通知设置 -->
    <div class="setting-item">
      <label>
        <input v-model="preferences.notifications" type="checkbox" />
        启用通知
      </label>
    </div>

    <!-- 自动保存设置 -->
    <div class="setting-item">
      <label>
        <input v-model="preferences.autoSave" type="checkbox" />
        自动保存
      </label>
    </div>
  </div>
</template>

<style>
.dark {
  background: #1a1a1a;
  color: #ffffff;
}

.light {
  background: #ffffff;
  color: #1a1a1a;
}

.setting-item {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

### 2. 购物车管理

实现持久化的购物车系统：

```vue
<script setup lang="ts">
import { useLocal, useSession } from '@jhqn/utils/storage/vue'
import { computed } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

// 购物车数据持久化到 localStorage
const cart = useLocal<CartItem[]>('shopping-cart', [])

// 会话 ID 存储到 sessionStorage
const sessionId = useSession('session-id', '')

// 生成会话 ID
onMounted(() => {
  if (!sessionId.value) {
    sessionId.value = Math.random().toString(36).substring(7)
  }
})

// 添加商品
const addItem = (item: Omit<CartItem, 'quantity'>) => {
  const existing = cart.value.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.value.push({ ...item, quantity: 1 })
  }
}

// 更新数量
const updateQuantity = (id: number, quantity: number) => {
  const item = cart.value.find(i => i.id === id)
  if (item) {
    if (quantity <= 0) {
      cart.value = cart.value.filter(i => i.id !== id)
    } else {
      item.quantity = quantity
    }
  }
}

// 移除商品
const removeItem = (id: number) => {
  cart.value = cart.value.filter(i => i.id !== id)
}

// 计算总价
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 计算总数量
const totalCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 清空购物车
const clearCart = () => {
  cart.value = []
}

// 示例：添加商品
const addSampleItem = () => {
  addItem({
    id: Date.now(),
    name: `商品 ${cart.value.length + 1}`,
    price: Math.random() * 100,
    image: '/placeholder.jpg'
  })
}
</script>

<template>
  <div>
    <h2>购物车 ({{ totalCount }} 件商品)</h2>

    <!-- 商品列表 -->
    <div v-if="cart.length > 0">
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" width="60" height="60" />

        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>¥{{ item.price.toFixed(2) }}</p>
        </div>

        <div class="item-quantity">
          <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
        </div>

        <button @click="removeItem(item.id)" class="remove-btn">移除</button>
      </div>

      <div class="cart-summary">
        <p>总价：<strong>¥{{ totalPrice.toFixed(2) }}</strong></p>
        <button @click="clearCart">清空购物车</button>
      </div>
    </div>

    <div v-else>
      <p>购物车是空的</p>
    </div>

    <button @click="addSampleItem">添加商品</button>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
}

.item-info {
  flex: 1;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-summary {
  text-align: right;
  padding: 16px;
  border-top: 2px solid #ddd;
}
</style>
```

### 3. 表单自动保存

实现表单数据的自动保存和恢复：

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'
import { watchEffect } from 'vue'

interface ArticleForm {
  title: string
  content: string
  category: string
  tags: string[]
  publishAt: string
  isDraft: boolean
}

// 表单草稿自动保存
const draft = useLocal<ArticleForm>('article-draft', {
  title: '',
  content: '',
  category: '',
  tags: [],
  publishAt: '',
  isDraft: true
})

// 自动保存提示
const showSaveTip = ref(false)

// 监听变化，显示保存提示
watchEffect(() => {
  if (draft.value.title || draft.value.content) {
    showSaveTip.value = true
    setTimeout(() => {
      showSaveTip.value = false
    }, 2000)
  }
})

// 添加标签
const newTag = ref('')
const addTag = () => {
  if (newTag.value && !draft.value.tags.includes(newTag.value)) {
    draft.value.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (tag: string) => {
  draft.value.tags = draft.value.tags.filter(t => t !== tag)
}

// 提交表单
const submitForm = async () => {
  try {
    draft.value.isDraft = false

    const response = await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(draft.value)
    })

    if (response.ok) {
      // 提交成功后清除草稿
      draft.value = {
        title: '',
        content: '',
        category: '',
        tags: [],
        publishAt: '',
        isDraft: true
      }

      alert('发布成功！')
    }
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败')
  }
}

// 清空草稿
const clearDraft = () => {
  if (confirm('确定要清空草稿吗？')) {
    draft.value = {
      title: '',
      content: '',
      category: '',
      tags: [],
      publishAt: '',
      isDraft: true
    }
  }
}

// 字数统计
const wordCount = computed(() => {
  return draft.value.content.length
})
</script>

<template>
  <div class="article-form">
    <h2>写文章</h2>

    <!-- 自动保存提示 -->
    <div v-if="showSaveTip" class="save-tip">
      草稿已自动保存
    </div>

    <!-- 标题 -->
    <div class="form-item">
      <label>标题：</label>
      <input
        v-model="draft.title"
        placeholder="请输入标题"
        maxlength="100"
      />
    </div>

    <!-- 分类 -->
    <div class="form-item">
      <label>分类：</label>
      <select v-model="draft.category">
        <option value="">请选择分类</option>
        <option value="tech">技术</option>
        <option value="life">生活</option>
        <option value="travel">旅行</option>
      </select>
    </div>

    <!-- 内容 -->
    <div class="form-item">
      <label>内容：</label>
      <textarea
        v-model="draft.content"
        placeholder="请输入内容"
        rows="10"
      ></textarea>
      <p class="word-count">字数：{{ wordCount }}</p>
    </div>

    <!-- 标签 -->
    <div class="form-item">
      <label>标签：</label>
      <div class="tags-input">
        <input
          v-model="newTag"
          @keyup.enter="addTag"
          placeholder="输入标签后按回车"
        />
        <button @click="addTag">添加</button>
      </div>
      <div class="tags-list">
        <span
          v-for="tag in draft.tags"
          :key="tag"
          class="tag"
          @click="removeTag(tag)"
        >
          {{ tag }} ×
        </span>
      </div>
    </div>

    <!-- 发布时间 -->
    <div class="form-item">
      <label>发布时间：</label>
      <input
        v-model="draft.publishAt"
        type="datetime-local"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="form-actions">
      <button @click="clearDraft" class="btn-secondary">清空草稿</button>
      <button @click="submitForm" class="btn-primary">发布</button>
    </div>
  </div>
</template>

<style scoped>
.article-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.save-tip {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  animation: fadeIn 0.3s;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-item input,
.form-item textarea,
.form-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.word-count {
  text-align: right;
  color: #666;
  font-size: 14px;
}

.tags-input {
  display: flex;
  gap: 8px;
}

.tags-list {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e0e0e0;
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
}

.tag:hover {
  background: #d0d0d0;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary {
  background: #1976d2;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  padding: 10px 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 4. 多步骤表单

实现多步骤表单的状态持久化：

```vue
<script setup lang="ts">
import { useSession } from '@jhqn/utils/storage/vue'
import { computed } from 'vue'

interface FormData {
  currentStep: number

  // 步骤1：个人信息
  name: string
  email: string
  phone: string

  // 步骤2：地址信息
  province: string
  city: string
  address: string

  // 步骤3：确认信息
  agreed: boolean
}

// 使用 sessionStorage 保存表单状态（关闭浏览器后清除）
const formData = useSession<FormData>('multi-step-form', {
  currentStep: 1,
  name: '',
  email: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  agreed: false
})

const steps = [
  { number: 1, title: '个人信息' },
  { number: 2, title: '地址信息' },
  { number: 3, title: '确认信息' }
]

const currentStepData = computed(() => steps[formData.value.currentStep - 1])

// 下一步
const nextStep = () => {
  if (formData.value.currentStep < 3) {
    formData.value.currentStep += 1
  }
}

// 上一步
const prevStep = () => {
  if (formData.value.currentStep > 1) {
    formData.value.currentStep -= 1
  }
}

// 提交表单
const submitForm = async () => {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData.value)
    })

    if (response.ok) {
      alert('提交成功！')
      // 清空表单
      formData.value = {
        currentStep: 1,
        name: '',
        email: '',
        phone: '',
        province: '',
        city: '',
        address: '',
        agreed: false
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 步骤验证
const canNext = computed(() => {
  switch (formData.value.currentStep) {
    case 1:
      return formData.value.name && formData.value.email && formData.value.phone
    case 2:
      return formData.value.province && formData.value.city && formData.value.address
    case 3:
      return formData.value.agreed
    default:
      return false
  }
})
</script>

<template>
  <div class="multi-step-form">
    <h2>多步骤表单</h2>

    <!-- 步骤指示器 -->
    <div class="steps">
      <div
        v-for="step in steps"
        :key="step.number"
        :class="['step', { active: step.number === formData.currentStep, completed: step.number < formData.currentStep }]"
      >
        <div class="step-number">{{ step.number }}</div>
        <div class="step-title">{{ step.title }}</div>
      </div>
    </div>

    <!-- 步骤1：个人信息 -->
    <div v-if="formData.currentStep === 1" class="step-content">
      <h3>个人信息</h3>

      <div class="form-item">
        <label>姓名：</label>
        <input v-model="formData.name" placeholder="请输入姓名" />
      </div>

      <div class="form-item">
        <label>邮箱：</label>
        <input v-model="formData.email" type="email" placeholder="请输入邮箱" />
      </div>

      <div class="form-item">
        <label>手机：</label>
        <input v-model="formData.phone" placeholder="请输入手机号" />
      </div>
    </div>

    <!-- 步骤2：地址信息 -->
    <div v-if="formData.currentStep === 2" class="step-content">
      <h3>地址信息</h3>

      <div class="form-item">
        <label>省份：</label>
        <input v-model="formData.province" placeholder="请输入省份" />
      </div>

      <div class="form-item">
        <label>城市：</label>
        <input v-model="formData.city" placeholder="请输入城市" />
      </div>

      <div class="form-item">
        <label>详细地址：</label>
        <textarea v-model="formData.address" placeholder="请输入详细地址"></textarea>
      </div>
    </div>

    <!-- 步骤3：确认信息 -->
    <div v-if="formData.currentStep === 3" class="step-content">
      <h3>确认信息</h3>

      <div class="summary">
        <p><strong>姓名：</strong>{{ formData.name }}</p>
        <p><strong>邮箱：</strong>{{ formData.email }}</p>
        <p><strong>手机：</strong>{{ formData.phone }}</p>
        <p><strong>地址：</strong>{{ formData.province }} {{ formData.city }} {{ formData.address }}</p>
      </div>

      <label class="checkbox-label">
        <input v-model="formData.agreed" type="checkbox" />
        我确认以上信息正确
      </label>
    </div>

    <!-- 操作按钮 -->
    <div class="step-actions">
      <button
        v-if="formData.currentStep > 1"
        @click="prevStep"
        class="btn-secondary"
      >
        上一步
      </button>

      <button
        v-if="formData.currentStep < 3"
        @click="nextStep"
        :disabled="!canNext"
        class="btn-primary"
      >
        下一步
      </button>

      <button
        v-if="formData.currentStep === 3"
        @click="submitForm"
        :disabled="!canNext"
        class="btn-primary"
      >
        提交
      </button>
    </div>
  </div>
</template>

<style scoped>
.multi-step-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 60%;
  width: 80%;
  height: 2px;
  background: #ddd;
}

.step.completed::after {
  background: #4caf50;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  font-weight: bold;
}

.step.active .step-number {
  background: #1976d2;
  color: white;
}

.step.completed .step-number {
  background: #4caf50;
  color: white;
}

.step-content {
  min-height: 300px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.summary {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}
</style>
```

## UseStorageOptions 配置

`useLocal` 和 `useSession` 支持 VueUse 的所有配置选项：

```ts
interface UseStorageOptions<T> {
  // 自定义窗口对象（用于 SSR）
  window?: Window | null

  // 自定义序列化器（默认使用 storageStringify/storageParse）
  serializer?: {
    read: (v: any) => T
    write: (v: T) => string
  }

  // 合并默认值
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)
}
```

### 配置示例

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

interface Config {
  theme: string
  language: string
  features: string[]
}

// 合并存储值和默认值
const config = useLocal<Config>('config', {
  theme: 'light',
  language: 'zh-CN',
  features: []
}, false, {
  // 如果存储中有新字段，会与默认值合并
  mergeDefaults: true
})

// SSR 兼容（禁用 window）
const ssrSafeData = useLocal('ssr-data', 'default', false, {
  window: null // 在 SSR 环境下禁用存储
})

// 自定义序列化器
const customData = useLocal('custom', {}, false, {
  serializer: {
    read: (v: any) => JSON.parse(v || '{}'),
    write: (v: any) => JSON.stringify(v)
  }
})
</script>
```

## 最佳实践

### 1. 数据类型选择

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

// ✅ 推荐：使用明确的类型
interface User {
  id: number
  name: string
  email: string
}
const user = useLocal<User>('user', { id: 0, name: '', email: '' })

// ✅ 推荐：使用简单类型
const count = useLocal('count', 0)
const enabled = useLocal('enabled', false)

// ⚠️ 谨慎：大型对象可能影响性能
const largeData = useLocal('large-data', { /* 大量数据 */ })

// ❌ 避免：存储过于复杂的数据结构
const complex = useLocal('complex', {
  // 避免嵌套过深的对象
  level1: {
    level2: {
      level3: {
        level4: {
          // ...
        }
      }
    }
  }
})
</script>
```

### 2. 命名规范

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

// ✅ 推荐：使用命名空间
const userPreferences = useLocal('app:user:preferences', {})
const cartItems = useLocal('app:cart:items', [])

// ✅ 推荐：使用模块前缀
const auth = useLocal('auth:token', '')
const theme = useLocal('settings:theme', 'light')

// ❌ 避免：过于通用的键名
const data = useLocal('data', {}) // 容易冲突
const temp = useLocal('temp', '') // 不明确
```

### 3. 响应式更新

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

const user = useLocal('user', { name: '', age: 0 })

// ✅ 推荐：直接修改属性（响应式）
user.value.name = '张三'
user.value.age = 25

// ✅ 推荐：使用 Object.assign
Object.assign(user.value, { name: '李四', age: 30 })

// ⚠️ 可行但不推荐：整体替换（虽然能工作）
user.value = { name: '王五', age: 35 }

// ✅ 推荐：数组操作
const items = useLocal('items', [])
items.value.push('new item') // ✅
items.value.splice(0, 1) // ✅

// ⚠️ 不推荐：直接赋值新数组
items.value = [...items.value, 'new item'] // 虽然能工作，但不是最佳实践
</script>
```

### 4. 错误处理

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

interface UserData {
  id: number
  name: string
}

// 添加类型保护和默认值
const userData = useLocal<UserData>('user-data', {
  id: 0,
  name: ''
})

// 安全访问
const userName = computed(() => {
  return userData.value?.name || '未知用户'
})

// 数据验证
const isValidUser = computed(() => {
  return userData.value.id > 0 && userData.value.name.length > 0
})
</script>
```

### 5. 性能优化

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

// ✅ 推荐：拆分大数据
const userProfile = useLocal('user:profile', {})
const userSettings = useLocal('user:settings', {})
const userPreferences = useLocal('user:preferences', {})

// ❌ 避免：单一大型对象
const allUserData = useLocal('user:all', {
  profile: { /* ... */ },
  settings: { /* ... */ },
  preferences: { /* ... */ }
})

// ✅ 推荐：使用计算属性缓存
const user = useLocal('user', { name: '', email: '' })
const userDisplayName = computed(() => user.value.name || user.value.email)

// ✅ 推荐：防抖频繁更新
import { useDebounceFn } from '@vueuse/core'

const searchQuery = useLocal('search:query', '')
const debouncedSave = useDebounceFn((value: string) => {
  searchQuery.value = value
}, 300)
</script>
```

## SSR 兼容性

在服务端渲染（SSR）环境中使用需要注意：

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

// 方式1：禁用存储
const data = useLocal('key', 'default', false, {
  window: null // SSR 环境下不使用存储
})

// 方式2：条件性使用
import { inBrowser } from '@jhqn/utils'

const ssrSafeData = inBrowser
  ? useLocal('key', 'default')
  : ref('default')

// 方式3：ClientOnly 组件包裹
// <ClientOnly>
//   <MyComponent />
// </ClientOnly>
</script>
```

## 调试技巧

### 开发工具

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

const user = useLocal('user', { name: '' })

// 在开发环境下添加到 window 对象
if (import.meta.env.DEV) {
  ;(window as any).__storage__ = {
    user
  }
}

// 控制台访问
// window.__storage__.user.value
</script>
```

### 监听变化

```vue
<script setup lang="ts">
import { useLocal } from '@jhqn/utils/storage/vue'

const user = useLocal('user', { name: '' })

// 监听所有变化
watch(user, (newValue, oldValue) => {
  console.log('数据变化:', { newValue, oldValue })
}, { deep: true })

// 监听特定属性
watch(() => user.value.name, (newName) => {
  console.log('名字变化:', newName)
})
</script>
```

## API 参考

| 函数        | 参数                                    | 返回值     | 描述                        |
|:----------|:--------------------------------------|:-------|:--------------------------|
| useLocal  | key, initialValue, crypto?, options?  | Ref\<T\> | localStorage 响应式 Hook    |
| useSession | key, initialValue, crypto?, options?  | Ref\<T\> | sessionStorage 响应式 Hook  |

## 类型定义

```ts
import type { Ref } from 'vue'
import type { MaybeRef } from '@vueuse/shared'
import type { UseStorageOptions } from '@vueuse/core'

export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  crypto?: boolean,
  options?: UseStorageOptions<T>
): Ref<T>

export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  crypto?: boolean,
  options?: UseStorageOptions<T>
): Ref<T>
```

## 特性

- ✅ **响应式**：基于 Vue 3 reactive API
- ✅ **自动同步**：存储值和组件状态自动双向同步
- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **持久化**：页面刷新后数据自动恢复
- ✅ **加密支持**：可选的 AES 加密功能
- ✅ **VueUse 兼容**：基于 @vueuse/core，与 VueUse 生态完美兼容
- ✅ **SSR 友好**：支持 SSR 环境配置
- ✅ **自动序列化**：支持 Map 等特殊类型

## 依赖

- `vue@^3.0.0`
- `@vueuse/core@^10.0.0` (或更高版本)
- `@vueuse/shared` (内部依赖)
- `@jhqn/utils-core` (内部依赖)
- `@jhqn/utils-crypto` (可选，加密功能需要)

::: tip 最佳实践
- **类型安全**：使用 TypeScript 泛型确保类型安全
- **命名规范**：使用命名空间避免键名冲突
- **数据分离**：拆分大型对象，提高性能
- **加密敏感数据**：敏感信息使用加密存储
- **SSR 兼容**：注意 SSR 环境下的兼容性处理
:::

::: warning 注意事项
- **存储大小**：localStorage 有大小限制（通常 5-10MB）
- **响应式更新**：直接修改对象属性会触发更新
- **SSR 环境**：需要特殊处理以避免 SSR 错误
- **加密密钥**：使用加密功能前需要设置密钥
- **性能考虑**：避免存储过于复杂的数据结构
:::
