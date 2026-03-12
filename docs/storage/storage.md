---
description: 通用存储管理工具，支持 localStorage、sessionStorage 和加密存储
---

# Storage

存储管理模块，提供 localStorage/sessionStorage 的操作函数，支持加密存储、自动序列化和过期时间。

<llm-only>
Storage management utilities for localStorage and sessionStorage.
Provides get/set/has/remove operations with encryption support,
automatic JSON serialization/deserialization, and expiration time.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils

# 或单独安装子包
npm add @jhqn/utils-storage
```

## 导入方式

```ts
// 推荐：从主包导入
import { setLocal, getLocal, setSession, getSession } from '@jhqn/utils'

// 可选：从子包导入
import { setLocal, getLocal, setSession, getSession } from '@jhqn/utils-storage'

// Vue 3 响应式 Hook
import { useLocal, useSession } from '@jhqn/utils/storage/vue'

// React 状态管理 Atom
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'
```

::: tip

- **通用函数**：适用于任何 JavaScript/TypeScript 环境
- **Vue Hook**：需要安装 `@vueuse/core` 作为 peer dependency
- **React Atom**：需要安装 `jotai` 作为 peer dependency
  :::

## 存储机制说明

### 数据结构

所有存储的数据都会被包装成以下结构：

```ts
interface StorageObj<T = any> {
  data: T // 实际存储的数据
  expires: number // 存储时的时间戳（毫秒）
}
```

**示例**：

```ts
// 存储数据
setLocal('user', { name: '张三' })

// 实际存储的内容：
// {
//   "data": { "name": "张三" },
//   "expires": 1705312225000
// }
```

### 自动序列化

存储模块会自动处理 JSON 序列化和反序列化，支持所有 `JSON.stringify` 能处理的数据类型：

**支持的数据类型**：

- ✅ 对象（Object）
- ✅ 数组（Array）
- ✅ 字符串（String）
- ✅ 数字（Number）
- ✅ 布尔值（Boolean）
- ✅ null
- ✅ Map（使用特殊的 replacer/reviver）

**不支持的数据类型**：

- ❌ Function（函数）
- ❌ Symbol（符号）
- ❌ Date（日期对象）
- ❌ undefined

**特殊处理**：

```ts
import { setLocal, getLocal, replacer, reviver } from '@jhqn/utils'

// Map 类型支持（需要使用 replacer 和 reviver）
const map = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
])

// 存储
setLocal('myMap', map)
// 内部使用 replacer 序列化 Map

// 读取
const data = getLocal<Map<string, string>>('myMap')
// 内部使用 reviver 反序列化 Map
```

### 过期机制

存储的数据包含时间戳，可以在读取时检查是否过期：

**过期判断逻辑**：

```ts
// 当前时间 - 存储时间 >= 过期时间
if (Date.now() - storageObj.expires >= expires) {
  // 数据已过期，删除并返回 null
}
```

**示例**：

```ts
import { setLocal, getLocal } from '@jhqn/utils'

// 10:00 存储数据
setLocal('cache', { data: 'test' })

// 10:05 读取（5分钟 = 300000ms）
const data1 = getLocal('cache', { expires: 300000 })
console.log(data1) // { data: 'test' }

// 10:11 读取（10分钟后，超过5分钟过期时间）
const data2 = getLocal('cache', { expires: 300000 })
console.log(data2) // null（已过期并自动删除）
```

## 基础函数

### setStorage

设置存储数据（通用函数）

| 参数    | 类型                 | 是否必填 | 描述                           |
| :------ | :------------------- | :------- | :----------------------------- |
| storage | Storage              | true     | localStorage 或 sessionStorage |
| key     | string               | true     | 存储键名                       |
| value   | any                  | true     | 存储值                         |
| config  | { crypto?: boolean } | false    | 配置项，crypto 是否加密        |

**返回值**：`void`

**用法**

```ts
import { setStorage, setLocal, setSession } from '@jhqn/utils'

// 使用通用函数 - localStorage
setStorage(localStorage, 'user', { name: '张三', age: 18 })

// 使用通用函数 - sessionStorage
setStorage(sessionStorage, 'token', 'abc123')

// 快捷函数 - localStorage
setLocal('user', { name: '张三', age: 18 })

// 快捷函数 - sessionStorage
setSession('token', 'abc123')

// 启用加密存储
setLocal('sensitive', { password: '123456' }, { crypto: true })

// 存储数组
setLocal('users', [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

// 存储简单类型
setLocal('count', 100)
setLocal('enabled', true)
setLocal('title', '页面标题')
```

### getStorage

获取存储数据（通用函数）

| 参数    | 类型                                   | 是否必填 | 描述                           |
| :------ | :------------------------------------- | :------- | :----------------------------- |
| storage | Storage                                | true     | localStorage 或 sessionStorage |
| key     | string                                 | true     | 存储键名                       |
| config  | { expires?: number; crypto?: boolean } | false    | 配置项                         |

**config 说明**

- `expires`: 过期时间（毫秒），如果超过此时间将返回 null 并删除数据
- `crypto`: 是否解密数据

**返回值**：`T | null` - 存储的数据或 null

**用法**

```ts
import { getStorage, getLocal, getSession } from '@jhqn/utils'

// 使用通用函数
const user = getStorage<{ name: string; age: number }>(localStorage, 'user')

// 快捷函数 - localStorage
const user = getLocal<{ name: string; age: number }>('user')

// 快捷函数 - sessionStorage
const token = getSession<string>('token')

// 带过期时间检查（1小时）
const data = getLocal('data', { expires: 60 * 60 * 1000 })

// 获取加密数据
const sensitive = getLocal('sensitive', { crypto: true })

// 不存在的键返回 null
const notExist = getLocal('not-exist')
console.log(notExist) // null

// 获取数组
const users = getLocal<Array<{ id: number; name: string }>>('users')

// 获取简单类型
const count = getLocal<number>('count')
const enabled = getLocal<boolean>('enabled')
const title = getLocal<string>('title')
```

### hasStorage

判断存储键是否存在（通用函数）

| 参数    | 类型    | 是否必填 | 描述                           |
| :------ | :------ | :------- | :----------------------------- |
| storage | Storage | true     | localStorage 或 sessionStorage |
| key     | string  | true     | 存储键名                       |

**返回值**：`boolean` - 键是否存在

**用法**

```ts
import { hasStorage, hasLocal, hasSession } from '@jhqn/utils'

// 使用通用函数
if (hasStorage(localStorage, 'user')) {
  console.log('用户数据存在')
}

// 快捷函数 - localStorage
if (hasLocal('user')) {
  console.log('用户数据存在')
}

// 快捷函数 - sessionStorage
if (hasSession('token')) {
  console.log('token 存在')
}

// 批量检查
const keys = ['user', 'token', 'settings']
const exists = keys.filter(key => hasLocal(key))
console.log(exists) // 存在的键列表
```

### removeStorage

移除存储数据（通用函数）

| 参数    | 类型    | 是否必填 | 描述                           |
| :------ | :------ | :------- | :----------------------------- |
| storage | Storage | true     | localStorage 或 sessionStorage |
| key     | string  | true     | 存储键名                       |

**返回值**：`void`

**用法**

```ts
import { removeStorage, removeLocal, removeSession } from '@jhqn/utils'

// 使用通用函数
removeStorage(localStorage, 'user')

// 快捷函数 - localStorage
removeLocal('user')

// 快捷函数 - sessionStorage
removeSession('token')

// 条件删除
if (hasLocal('temp')) {
  removeLocal('temp')
}

// 批量删除
const keysToDelete = ['temp1', 'temp2', 'temp3']
keysToDelete.forEach(key => removeLocal(key))
```

### removeStorageAll

批量移除存储数据（通用函数）

| 参数    | 类型    | 是否必填 | 描述                                 |
| :------ | :------ | :------- | :----------------------------------- |
| storage | Storage | true     | localStorage 或 sessionStorage       |
| regex   | RegExp  | false    | 正则表达式，匹配键名。不传则清空所有 |

**返回值**：`void`

**用法**

```ts
import { removeStorageAll, removeLocalAll, removeSessionAll } from '@jhqn/utils'

// 使用通用函数 - 清空所有
removeStorageAll(localStorage)

// 使用通用函数 - 批量删除匹配的键
removeStorageAll(localStorage, /^user_/)

// 快捷函数 - 清空所有 localStorage
removeLocalAll()

// 快捷函数 - 删除所有以 'cache_' 开头的键
removeLocalAll(/^cache_/)

// 快捷函数 - 删除所有包含 'temp' 的键
removeLocalAll(/temp/)

// 快捷函数 - 删除所有以 'user_' 开头，后跟数字的键
removeLocalAll(/^user_\d+$/)

// 快捷函数 - 清空所有 sessionStorage
removeSessionAll()

// 谨慎使用：清空所有会删除所有数据
// removeLocalAll() // 危险操作！
```

## 辅助函数

### storageStringify

序列化存储数据（带时间戳）

| 参数 | 类型 | 是否必填 | 描述             |
| :--- | :--- | :------- | :--------------- |
| data | any  | true     | 需要序列化的数据 |

**返回值**：`string` - 序列化后的 JSON 字符串

**用法**

```ts
import { storageStringify } from '@jhqn/utils'

const serialized = storageStringify({ name: '张三' })
console.log(serialized)
// {"data":{"name":"张三"},"expires":1705312225000}

// 序列化数组
const arrStr = storageStringify([1, 2, 3])
console.log(arrStr)
// {"data":[1,2,3],"expires":1705312225000}

// 序列化带 Map 的数据
const map = new Map([['key', 'value']])
const mapStr = storageStringify({ myMap: map })
console.log(mapStr)
// {"data":{"myMap":{"dataType":"Map","value":[["key","value"]]}},"expires":1705312225000}
```

### storageParse

反序列化存储数据

| 参数 | 类型   | 是否必填 | 描述                 |
| :--- | :----- | :------- | :------------------- |
| data | string | true     | 需要反序列化的字符串 |

**返回值**：`StorageObj<T> | null` - 反序列化后的对象

**用法**

```ts
import { storageParse } from '@jhqn/utils'

const parsed = storageParse<{ name: string }>('{"data":{"name":"张三"},"expires":1705312225000}')
console.log(parsed.data) // { name: '张三' }
console.log(parsed.expires) // 1705312225000

// 反序列化数组
const arr = storageParse<number[]>('{"data":[1,2,3],"expires":1705312225000}')
console.log(arr.data) // [1, 2, 3]

// 无效 JSON 返回 null
const invalid = storageParse('invalid json')
console.log(invalid) // null
```

## 加密存储

配合 `@jhqn/utils-crypto` 实现加密存储。

### 配置加密密钥

```ts
import { setCryptoKey } from '@jhqn/utils'

// 手动设置加密密钥
setCryptoKey('your-secret-key')

// 推荐使用环境变量
// .env 文件
// VITE_CRYPTO_KEY=your-secret-key-from-env

// 应用启动时自动读取
// setCryptoKey 会自动读取 import.meta.env.VITE_CRYPTO_KEY
```

### 使用加密存储

```ts
import { setLocal, getLocal } from '@jhqn/utils'

// 存储加密数据
setLocal('password', '123456', { crypto: true })

// 读取加密数据
const password = getLocal<string>('password', { crypto: true })
console.log(password) // '123456'

// 存储加密的对象
setLocal(
  'credentials',
  {
    username: 'admin',
    password: 'password123',
  },
  { crypto: true }
)

// 读取加密的对象
const credentials = getLocal<{
  username: string
  password: string
}>('credentials', { crypto: true })

// 存储加密的敏感配置
setLocal(
  'apiKeys',
  {
    apiKey: 'sk-xxx',
    apiSecret: 'secret-xxx',
  },
  { crypto: true }
)

const apiKeys = getLocal('apiKeys', { crypto: true })
```

### 加密存储原理

```ts
// 存储（加密）
const data = { password: '123456' }
const serialized = storageStringify(data) // 序列化
const encrypted = aes.encrypt(serialized) // 加密
localStorage.setItem('key', encrypted)

// 读取（解密）
const encrypted = localStorage.getItem('key')
const decrypted = aes.decrypt(encrypted) // 解密
const parsed = storageParse(decrypted) // 反序列化
return parsed.data
```

## 过期时间

支持在读取时检查数据的过期时间。

### 使用场景

1. **API 缓存**：缓存 API 响应，定期刷新
2. **临时数据**：存储临时会话数据
3. **防止数据过时**：确保数据不会太旧

### 示例

```ts
import { setLocal, getLocal } from '@jhqn/utils'

// 存储数据（自动记录时间戳）
setLocal('api-cache', { users: [...] })

// 读取时检查过期（5分钟 = 5 * 60 * 1000 ms）
const cache = getLocal('api-cache', { expires: 5 * 60 * 1000 })

if (!cache) {
  // 缓存过期或不存在，重新获取
  const users = await fetchUsers()
  setLocal('api-cache', { users })
}

// 常用过期时间
const ONE_MINUTE = 60 * 1000
const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

// 1小时过期
const session = getLocal('session', { expires: ONE_HOUR })

// 1天过期
const preferences = getLocal('preferences', { expires: ONE_DAY })

// 1周过期
const cachedData = getLocal('cachedData', { expires: ONE_WEEK })
```

## 完整示例

### 1. 用户认证管理

完整的用户认证状态管理：

```ts
import { setLocal, getLocal, removeLocal, hasLocal } from '@jhqn/utils'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface AuthState {
  user: User
  token: string
  refreshToken: string
  expiresAt: number
}

const AUTH_KEY = 'auth_state'
const ONE_HOUR = 60 * 60 * 1000

// 登录
async function login(email: string, password: string): Promise<User> {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const authState: AuthState = await response.json()

  // 存储认证状态（可选加密）
  setLocal(AUTH_KEY, authState, { crypto: true })

  return authState.user
}

// 获取当前用户
function getCurrentUser(): User | null {
  const authState = getLocal<AuthState>(AUTH_KEY, {
    expires: ONE_HOUR, // 1小时过期
    crypto: true,
  })

  return authState?.user || null
}

// 检查是否已登录
function isAuthenticated(): boolean {
  return hasLocal(AUTH_KEY) && getCurrentUser() !== null
}

// 登出
function logout(): void {
  removeLocal(AUTH_KEY)
}

// 使用
const user = await login('user@example.com', 'password')
console.log('登录成功:', user.name)

if (isAuthenticated()) {
  const currentUser = getCurrentUser()
  console.log('当前用户:', currentUser?.name)
}

logout()
console.log('已登出')
```

### 2. API 数据缓存

实现带过期时间的 API 缓存：

```ts
import { setLocal, getLocal, removeLocal } from '@jhqn/utils'

interface CacheItem<T> {
  data: T
  timestamp: number
}

class ApiCache {
  private prefix = 'api_cache_'
  private defaultExpiry = 5 * 60 * 1000 // 5分钟

  // 获取缓存或请求数据
  async get<T>(key: string, fetcher: () => Promise<T>, expiry?: number): Promise<T> {
    const cacheKey = this.prefix + key

    // 尝试从缓存读取
    const cached = getLocal<CacheItem<T>>(cacheKey, {
      expires: expiry || this.defaultExpiry,
    })

    if (cached) {
      console.log(`缓存命中: ${key}`)
      return cached.data
    }

    // 缓存未命中，请求数据
    console.log(`缓存未命中，请求: ${key}`)
    const data = await fetcher()

    // 存储到缓存
    setLocal(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  }

  // 清除指定缓存
  clear(key: string): void {
    removeLocal(this.prefix + key)
  }

  // 清除所有 API 缓存
  clearAll(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

// 使用
const cache = new ApiCache()

// 获取用户列表（带缓存）
const users = await cache.get(
  'users',
  async () => {
    const response = await fetch('/api/users')
    return response.json()
  },
  10 * 60 * 1000
) // 10分钟过期

// 获取产品列表（带缓存）
const products = await cache.get('products', async () => {
  const response = await fetch('/api/products')
  return response.json()
})

// 清除用户缓存
cache.clear('users')

// 清除所有缓存
cache.clearAll()
```

### 3. 主题和语言设置

持久化用户偏好设置：

```ts
import { setLocal, getLocal } from '@jhqn/utils'

type Theme = 'light' | 'dark' | 'auto'
type Language = 'zh-CN' | 'en-US' | 'ja-JP'

interface UserPreferences {
  theme: Theme
  language: Language
  fontSize: number
  notifications: boolean
}

const PREFERENCES_KEY = 'user_preferences'

// 默认设置
const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'zh-CN',
  fontSize: 14,
  notifications: true,
}

// 获取用户设置
function getPreferences(): UserPreferences {
  const prefs = getLocal<UserPreferences>(PREFERENCES_KEY)
  return prefs || defaultPreferences
}

// 更新用户设置
function updatePreferences(updates: Partial<UserPreferences>): void {
  const current = getPreferences()
  setLocal(PREFERENCES_KEY, { ...current, ...updates })
}

// 应用主题
function applyTheme(theme: Theme): void {
  const root = document.documentElement

  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // auto: 根据系统设置
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
  }
}

// 初始化
function initPreferences(): void {
  const prefs = getPreferences()
  applyTheme(prefs.theme)
  // 应用语言设置
  // 应用字体大小
}

// 使用
initPreferences()

updatePreferences({ theme: 'dark' })
updatePreferences({ language: 'en-US', fontSize: 16 })

const currentPrefs = getPreferences()
console.log('当前主题:', currentPrefs.theme)
```

### 4. 表单自动保存

实现表单数据的自动保存和恢复：

```ts
import { setLocal, getLocal, removeLocal } from '@jhqn/utils'

interface FormData {
  title: string
  content: string
  tags: string[]
  category: string
}

const FORM_KEY = 'form_draft'

// 保存表单草稿
function saveFormDraft(data: FormData): void {
  setLocal(FORM_KEY, {
    ...data,
    savedAt: Date.now(),
  })
}

// 恢复表单草稿
function restoreFormDraft(): FormData | null {
  const draft = getLocal<FormData & { savedAt: number }>(FORM_KEY, {
    expires: 24 * 60 * 60 * 1000, // 1天过期
  })

  if (draft) {
    console.log('恢复草稿，保存时间:', new Date(draft.savedAt).toLocaleString())
    return draft
  }

  return null
}

// 清除草稿
function clearFormDraft(): void {
  removeLocal(FORM_KEY)
}

// 自动保存（防抖）
let saveTimer: number | null = null

function autoSave(data: FormData): void {
  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  saveTimer = window.setTimeout(() => {
    saveFormDraft(data)
    console.log('表单已自动保存')
  }, 1000)
}

// 使用
const form = {
  title: '',
  content: '',
  tags: [],
  category: '',
}

// 恢复草稿
const draft = restoreFormDraft()
if (draft) {
  Object.assign(form, draft)
}

// 监听表单变化，自动保存
form.title = '新文章'
autoSave(form)

form.content = '文章内容...'
autoSave(form)

// 提交成功后清除草稿
async function submitForm() {
  await fetch('/api/articles', {
    method: 'POST',
    body: JSON.stringify(form),
  })

  clearFormDraft()
  console.log('提交成功，草稿已清除')
}
```

### 5. 购物车管理

实现持久化的购物车：

```ts
import { setLocal, getLocal } from '@jhqn/utils'

interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

interface ShoppingCart {
  items: CartItem[]
  updatedAt: number
}

const CART_KEY = 'shopping_cart'

// 获取购物车
function getCart(): ShoppingCart {
  const cart = getLocal<ShoppingCart>(CART_KEY)
  return cart || { items: [], updatedAt: Date.now() }
}

// 保存购物车
function saveCart(cart: ShoppingCart): void {
  setLocal(CART_KEY, {
    ...cart,
    updatedAt: Date.now(),
  })
}

// 添加商品
function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart()
  const existingItem = cart.items.find(i => i.productId === item.productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.items.push({ ...item, quantity: 1 })
  }

  saveCart(cart)
}

// 更新数量
function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart()
  const item = cart.items.find(i => i.productId === productId)

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId)
    } else {
      item.quantity = quantity
    }
    saveCart(cart)
  }
}

// 移除商品
function removeFromCart(productId: number): void {
  const cart = getCart()
  cart.items = cart.items.filter(i => i.productId !== productId)
  saveCart(cart)
}

// 计算总价
function getTotalPrice(): number {
  const cart = getCart()
  return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
}

// 清空购物车
function clearCart(): void {
  saveCart({ items: [], updatedAt: Date.now() })
}

// 使用
addToCart({
  productId: 1,
  name: '商品A',
  price: 99.99,
  image: '/images/product-a.jpg',
})

updateQuantity(1, 2)
console.log('总价:', getTotalPrice())

removeFromCart(1)

clearCart()
```

### 6. 多标签页同步

实现多标签页之间的数据同步：

```ts
import { setLocal, getLocal } from '@jhqn/utils'

interface SyncData {
  value: any
  timestamp: number
  tabId: string
}

const SYNC_KEY = 'sync_data'
const tabId = Math.random().toString(36).substring(7)

// 更新数据并通知其他标签页
function updateSyncData(value: any): void {
  setLocal(SYNC_KEY, {
    value,
    timestamp: Date.now(),
    tabId,
  })
}

// 监听其他标签页的更新
function onSyncDataUpdate(callback: (data: SyncData) => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SYNC_KEY && event.newValue) {
      const data = JSON.parse(event.newValue) as SyncData

      // 忽略自己发出的更新
      if (data.tabId !== tabId) {
        callback(data)
      }
    }
  }

  window.addEventListener('storage', handleStorage)

  return () => window.removeEventListener('storage', handleStorage)
}

// 使用
updateSyncData({ message: '来自标签页的更新' })

const unsubscribe = onSyncDataUpdate(data => {
  console.log('收到其他标签页的更新:', data.value)
})

// 清理
unsubscribe()
```

## API 速查表

### LocalStorage 快捷函数

| 函数           | 参数                | 返回值    | 描述              |
| :------------- | :------------------ | :-------- | :---------------- |
| setLocal       | key, value, config? | void      | 设置 localStorage |
| getLocal       | key, config?        | T \| null | 获取 localStorage |
| hasLocal       | key                 | boolean   | 判断是否存在      |
| removeLocal    | key                 | void      | 移除单个项        |
| removeLocalAll | regex?              | void      | 批量移除          |

### SessionStorage 快捷函数

| 函数             | 参数                | 返回值    | 描述                |
| :--------------- | :------------------ | :-------- | :------------------ |
| setSession       | key, value, config? | void      | 设置 sessionStorage |
| getSession       | key, config?        | T \| null | 获取 sessionStorage |
| hasSession       | key                 | boolean   | 判断是否存在        |
| removeSession    | key                 | void      | 移除单个项          |
| removeSessionAll | regex?              | void      | 批量移除            |

### 通用函数

| 函数             | 参数                         | 返回值    | 描述           |
| :--------------- | :--------------------------- | :-------- | :------------- |
| setStorage       | storage, key, value, config? | void      | 设置存储数据   |
| getStorage       | storage, key, config?        | T \| null | 获取存储数据   |
| hasStorage       | storage, key                 | boolean   | 判断键是否存在 |
| removeStorage    | storage, key                 | void      | 移除数据       |
| removeStorageAll | storage, regex?              | void      | 批量移除数据   |

### 辅助函数

| 函数             | 参数 | 返回值             | 描述               |
| :--------------- | :--- | :----------------- | :----------------- |
| storageStringify | data | string             | 序列化（带时间戳） |
| storageParse     | data | StorageObj \| null | 反序列化           |

## 类型定义

```ts
// 存储对象结构
interface StorageObj<T = any> {
  data: T
  expires: number // 时间戳
}

// 存储配置
interface StorageConfig {
  crypto?: boolean // 是否启用加密
  expires?: number // 过期时间（毫秒）
}

// 存储函数类型
type SetStorage = (storage: Storage, key: string, value: any, config?: StorageConfig) => void
type GetStorage<T> = (storage: Storage, key: string, config?: StorageConfig) => T | null
type HasStorage = (storage: Storage, key: string) => boolean
type RemoveStorage = (storage: Storage, key: string) => void
type RemoveStorageAll = (storage: Storage, regex?: RegExp) => void

// 快捷函数类型
type SetLocal = (key: string, value: any, config?: StorageConfig) => void
type GetLocal<T> = (key: string, config?: StorageConfig) => T | null
type HasLocal = (key: string) => boolean
type RemoveLocal = (key: string) => void
type RemoveLocalAll = (regex?: RegExp) => void
```

## 特性

- ✅ 自动 JSON 序列化/反序列化
- ✅ 支持加密存储（配合 crypto 模块）
- ✅ 支持过期时间检查
- ✅ 批量删除操作
- ✅ TypeScript 类型支持
- ✅ 统一的 API 设计
- ✅ 支持 Map 类型序列化
- ✅ 自动时间戳管理

::: tip 最佳实践

- **加密敏感数据**：敏感信息（密码、token）使用加密存储
- **设置过期时间**：API 缓存、临时数据设置合理的过期时间
- **统一键名规范**：使用统一的命名规范（如 `app_module_key`）
- **定期清理**：定期清理过期的缓存数据
- **类型安全**：使用 TypeScript 泛型确保类型安全
  :::

::: warning 注意事项

- **存储大小限制**：localStorage/sessionStorage 有大小限制（通常 5-10MB）
- **不要存储大量数据**：避免存储大对象或长列表
- **加密需要密钥**：加密功能需要先设置加密密钥
- **过期不是自动的**：过期检查只在读取时进行，需要手动或定期清理
- **浏览器隐私模式**：在隐私模式下 localStorage 可能不可用
  :::
