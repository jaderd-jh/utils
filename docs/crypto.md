---
description: 加密解密工具，基于 CryptoJS 提供 AES、Base64、MD5 等多种加密编码功能
---

# Crypto

加密解密模块，基于 CryptoJS 提供安全的数据加密、解密和编码功能，支持 AES、Base64、Base64URL、MD5 等多种算法。

<llm-only>
Encryption and decryption utilities based on CryptoJS.
Provides AES encryption, Base64/Base64URL encoding, MD5 hashing with configurable keys.
Supports both full package and submodule imports.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils

# 或单独安装子包
npm add @jhqn/utils-crypto
```

## 导入方式

```ts
// 推荐：从主包导入
import { setCryptoKey, aes, base64, md5 } from '@jhqn/utils'

// 可选：从子包导入
import { setCryptoKey, aes, base64, md5 } from '@jhqn/utils-crypto'

// 可选：从子路径导入（按需加载）
import { aes } from '@jhqn/utils-crypto/aes'
import { base64 } from '@jhqn/utils-crypto/base64'
import { base64url } from '@jhqn/utils-crypto/base64url'
import { md5 } from '@jhqn/utils-crypto/md5'
```

## 密钥管理

### setCryptoKey

设置加密密钥（用于 AES 加密）

| 参数 | 类型   | 是否必填 | 描述     |
| :--- | :----- | :------- | :------- |
| key  | string | true     | 加密密钥 |

**用法**

```ts
import { setCryptoKey } from '@jhqn/utils'

// 手动设置加密密钥
setCryptoKey('your-secret-key-12345')

// 推荐使用环境变量
// .env 文件
// VITE_CRYPTO_KEY=your-secret-key-from-env
```

**注意**：

- 密钥应该妥善保管，不要硬编码在代码中
- 推荐使用环境变量管理密钥
- 密钥长度建议 16、24 或 32 字节（对应 AES-128、AES-192、AES-256）

### getCryptoKey

获取当前加密密钥

**返回值**：`CryptoJS.lib.WordArray | undefined`

**用法**

```ts
import { getCryptoKey } from '@jhqn/utils'

const key = getCryptoKey()
if (key) {
  console.log('密钥已设置')
} else {
  console.log('密钥未设置')
}
```

## AES 加密解密

AES（Advanced Encryption Standard）是对称加密算法，适合加密敏感数据。

### aes.encrypt

AES 加密

| 参数 | 类型   | 是否必填 | 描述         |
| :--- | :----- | :------- | :----------- |
| data | string | true     | 待加密的明文 |

**返回值**：`string` - 加密后的密文（Base64 编码）

**用法**

```ts
import { setCryptoKey, aes } from '@jhqn/utils'

// 设置密钥
setCryptoKey('my-secret-key-12345')

// 加密数据
const plaintext = '敏感信息：密码123456'
const encrypted = aes.encrypt(plaintext)
console.log(encrypted) // 'U2FsdGVkX1+7x8y...'

// 加密对象（需先序列化）
const user = { name: '张三', password: '123456' }
const encryptedUser = aes.encrypt(JSON.stringify(user))
console.log(encryptedUser)
```

### aes.decrypt

AES 解密

| 参数      | 类型   | 是否必填 | 描述         |
| :-------- | :----- | :------- | :----------- |
| encrypted | string | true     | 加密后的密文 |

**返回值**：`string` - 解密后的明文

**用法**

```ts
import { setCryptoKey, aes } from '@jhqn/utils'

// 设置密钥（必须与加密时使用的密钥一致）
setCryptoKey('my-secret-key-12345')

// 解密数据
const encrypted = 'U2FsdGVkX1+7x8y...'
const decrypted = aes.decrypt(encrypted)
console.log(decrypted) // '敏感信息：密码123456'

// 解密对象
const encryptedUser = '...'
const userStr = aes.decrypt(encryptedUser)
const user = JSON.parse(userStr)
console.log(user) // { name: '张三', password: '123456' }
```

**错误处理**

```ts
import { aes } from '@jhqn/utils'

try {
  const decrypted = aes.decrypt(encrypted)
} catch (error) {
  if (error.message.includes('请先设置')) {
    console.error('请先调用 setCryptoKey 设置密钥')
  } else {
    console.error('解密失败：', error)
  }
}
```

**技术细节**：

- **加密模式**：ECB（Electronic Codebook）
- **填充方式**：PKCS7
- **输出格式**：Base64 编码的密文
- **依赖密钥**：必须先调用 `setCryptoKey` 设置密钥

## Base64 编码解码

Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方法，常用于在文本协议中传输二进制数据。

### base64.encrypt

Base64 编码

| 参数 | 类型   | 是否必填 | 描述           |
| :--- | :----- | :------- | :------------- |
| data | string | true     | 待编码的字符串 |

**返回值**：`string` - Base64 编码后的字符串

**用法**

```ts
import { base64 } from '@jhqn/utils'

// 编码字符串
const encoded = base64.encrypt('Hello, World!')
console.log(encoded) // 'SGVsbG8sIFdvcmxkIQ=='

// 编码 JSON
const data = { name: '张三', age: 25 }
const encoded = base64.encrypt(JSON.stringify(data))
console.log(encoded) // 'eyJuYW1lIjoi5byg5LiJIiwiYWdlIjoyNX0='

// 编码 URL 参数
const redirect = base64.encrypt('/user/profile?id=123')
console.log(redirect)
```

### base64.decrypt

Base64 解码

| 参数 | 类型   | 是否必填 | 描述                |
| :--- | :----- | :------- | :------------------ |
| data | string | true     | Base64 编码的字符串 |

**返回值**：`string` - 解码后的原始字符串

**用法**

```ts
import { base64 } from '@jhqn/utils'

// 解码字符串
const encoded = 'SGVsbG8sIFdvcmxkIQ=='
const decoded = base64.decrypt(encoded)
console.log(decoded) // 'Hello, World!'

// 解码 JSON
const encodedData = 'eyJuYW1lIjoi5byg5LiJIiwiYWdlIjoyNX0='
const dataStr = base64.decrypt(encodedData)
const data = JSON.parse(dataStr)
console.log(data) // { name: '张三', age: 25 }

// 解码 URL 参数
const encodedUrl = 'L3VzZXIvcHJvZmlsZT9pZD0xMjM='
const url = base64.decrypt(encodedUrl)
console.log(url) // '/user/profile?id=123'
```

**使用场景**：

- ✅ URL 参数编码
- ✅ 在文本协议中传输二进制数据
- ✅ 简单的数据混淆（非加密）
- ✅ Data URL 生成

**注意**：Base64 编码不是加密，不要用于敏感数据的保护！

## Base64URL 编码解码

Base64URL 是 Base64 的 URL 安全变体，适用于 URL 和文件名。

### base64url.encrypt

Base64URL 编码（URL 安全）

| 参数 | 类型   | 是否必填 | 描述           |
| :--- | :----- | :------- | :------------- |
| data | string | true     | 待编码的字符串 |

**返回值**：`string` - Base64URL 编码后的字符串

**用法**

```ts
import { base64url } from '@jhqn/utils'

// 编码为 URL 安全格式
const token = base64url.encrypt('user:password:timestamp')
console.log(token) // 'dXNlcjpwYXNzd29yZDp0aW1lc3RhbXA'

// 生成 URL 参数
const params = { userId: '123', role: 'admin' }
const encoded = base64url.encrypt(JSON.stringify(params))
const url = `https://example.com?data=${encoded}`
console.log(url)
```

### base64url.decrypt

Base64URL 解码

| 参数 | 类型   | 是否必填 | 描述                   |
| :--- | :----- | :------- | :--------------------- |
| data | string | true     | Base64URL 编码的字符串 |

**返回值**：`string` - 解码后的原始字符串

**用法**

```ts
import { base64url } from '@jhqn/utils'

// 从 URL 参数解码
const urlParams = new URLSearchParams(window.location.search)
const encodedData = urlParams.get('data')
const decoded = base64url.decrypt(encodedData)
const params = JSON.parse(decoded)
console.log(params) // { userId: '123', role: 'admin' }

// 解码 token
const token = 'dXNlcjpwYXNzd29yZDp0aW1lc3RhbXA'
const decodedToken = base64url.decrypt(token)
console.log(decodedToken) // 'user:password:timestamp'
```

**Base64 vs Base64URL**

| 特性         | Base64     | Base64URL   |
| :----------- | :--------- | :---------- |
| **字符 62**  | `+`        | `-`         |
| **字符 63**  | `/`        | `_`         |
| **填充字符** | `=` (可选) | 无填充      |
| **URL 安全** | ❌ 需编码  | ✅ 直接使用 |
| **适用场景** | 通用编码   | URL、文件名 |

**使用场景**：

- ✅ JWT Token 生成
- ✅ URL 参数编码
- ✅ 文件名编码
- ✅ 安全的 URL 传输

## MD5 哈希

MD5（Message Digest Algorithm 5）是一种广泛使用的哈希函数，生成 128 位（16 字节）的哈希值。

### md5.encrypt

MD5 哈希

| 参数 | 类型   | 是否必填 | 描述           |
| :--- | :----- | :------- | :------------- |
| data | string | true     | 待哈希的字符串 |

**返回值**：`string` - 32 位十六进制哈希值

**用法**

```ts
import { md5 } from '@jhqn/utils'

// 计算字符串哈希
const hash = md5.encrypt('hello world')
console.log(hash) // '5eb63bbbe01eeed093cb22bb8f5acdc3'

// 计算文件哈希（需要先读取文件内容）
const fileContent = 'file content here'
const fileHash = md5.encrypt(fileContent)
console.log(fileHash)

// 密码哈希（不推荐，建议使用 bcrypt）
const passwordHash = md5.encrypt('password123')
console.log(passwordHash)

// 数据完整性验证
const data1 = 'important data'
const data2 = 'important data'
const hash1 = md5.encrypt(data1)
const hash2 = md5.encrypt(data2)
console.log(hash1 === hash2) // true，数据一致
```

### md5.decrypt

**⚠️ 不可用！** MD5 是单向哈希算法，无法解密。

```ts
import { md5 } from '@jhqn/utils'

try {
  md5.decrypt('some-hash')
} catch (error) {
  console.error(error.message) // 'MD5 is not a decryptable algorithm'
}
```

**MD5 的特点**：

- ✅ 单向哈希，不可逆
- ✅ 固定长度输出（128 位）
- ✅ 快速计算
- ❌ 不适合密码存储（易被彩虹表破解）
- ❌ 存在碰撞风险

**使用场景**：

- ✅ 文件完整性校验
- ✅ 数据一致性验证
- ✅ 缓存键生成
- ✅ 简单的数据指纹
- ❌ 不适合密码存储（请使用 bcrypt/argon2）
- ❌ 不适合安全签名（请使用 SHA-256+）

## 完整示例

### 1. 用户密码加密存储

```ts
import { setCryptoKey, aes, base64 } from '@jhqn/utils'

// 应用启动时设置密钥
setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)

interface User {
  username: string
  password: string
  email: string
}

// 注册时加密用户数据
function encryptUserData(user: User) {
  return {
    username: user.username,
    password: aes.encrypt(user.password), // AES 加密密码
    email: aes.encrypt(user.email), // AES 加密邮箱
  }
}

// 登录时解密验证
function verifyPassword(encryptedPassword: string, inputPassword: string) {
  const decrypted = aes.decrypt(encryptedPassword)
  return decrypted === inputPassword
}

// 使用
const user = {
  username: 'zhangsan',
  password: 'MyP@ssw0rd',
  email: 'zhangsan@example.com',
}

const encryptedUser = encryptUserData(user)
console.log(encryptedUser)
// {
//   username: 'zhangsan',
//   password: 'U2FsdGVkX1...',
//   email: 'U2FsdGVkX1...'
// }
```

### 2. URL 参数编码

```ts
import { base64url } from '@jhqn/utils'

// 编码复杂的 URL 参数
interface FilterParams {
  category: string
  priceRange: [number, number]
  tags: string[]
}

function encodeFilterParams(params: FilterParams): string {
  const json = JSON.stringify(params)
  return base64url.encrypt(json)
}

function decodeFilterParams(encoded: string): FilterParams {
  const json = base64url.decrypt(encoded)
  return JSON.parse(json)
}

// 使用
const filter: FilterParams = {
  category: 'electronics',
  priceRange: [100, 1000],
  tags: ['sale', 'new'],
}

const encoded = encodeFilterParams(filter)
const url = `https://shop.com/products?filter=${encoded}`
console.log(url)

// 从 URL 解码
const decoded = decodeFilterParams(encoded)
console.log(decoded)
```

### 3. localStorage 加密存储

```ts
import { setCryptoKey, aes } from '@jhqn/utils'

// 设置密钥
setCryptoKey('my-storage-key')

// 加密存储
function setEncryptedItem(key: string, value: any) {
  const json = JSON.stringify(value)
  const encrypted = aes.encrypt(json)
  localStorage.setItem(key, encrypted)
}

// 解密读取
function getDecryptedItem<T>(key: string): T | null {
  const encrypted = localStorage.getItem(key)
  if (!encrypted) return null

  try {
    const json = aes.decrypt(encrypted)
    return JSON.parse(json)
  } catch (error) {
    console.error('解密失败:', error)
    return null
  }
}

// 使用
const sensitiveData = {
  token: 'abc123xyz',
  userId: 'user-001',
  permissions: ['read', 'write'],
}

setEncryptedItem('auth', sensitiveData)
const retrieved = getDecryptedItem<typeof sensitiveData>('auth')
console.log(retrieved)
```

### 4. 文件完整性校验

```ts
import { md5 } from '@jhqn/utils'

interface FileChecksum {
  filename: string
  hash: string
  timestamp: number
}

// 计算文件哈希
function calculateFileHash(content: string): FileChecksum {
  return {
    filename: 'data.json',
    hash: md5.encrypt(content),
    timestamp: Date.now(),
  }
}

// 验证文件完整性
function verifyFileIntegrity(content: string, expectedHash: string): boolean {
  const actualHash = md5.encrypt(content)
  return actualHash === expectedHash
}

// 使用
const fileContent = JSON.stringify({ data: 'important information' })
const checksum = calculateFileHash(fileContent)
console.log(checksum)

// 稍后验证
const isValid = verifyFileIntegrity(fileContent, checksum.hash)
console.log(isValid) // true
```

### 5. API 数据加密传输

```ts
import { setCryptoKey, aes, base64url } from '@jhqn/utils'

// 客户端设置
setCryptoKey('client-server-shared-key')

// 加密请求数据
function encryptRequest(data: any): string {
  const json = JSON.stringify(data)
  return aes.encrypt(json)
}

// 解密响应数据
function decryptResponse(encrypted: string): any {
  const json = aes.decrypt(encrypted)
  return JSON.parse(json)
}

// 使用
async function sendEncryptedRequest(url: string, data: any) {
  const encryptedData = encryptRequest(data)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: encryptedData }),
  })

  const result = await response.json()
  return decryptResponse(result.data)
}

// 调用
const result = await sendEncryptedRequest('/api/user', {
  name: '张三',
  phone: '13812345678',
})
console.log(result)
```

## 环境变量配置

### Vite 项目

```env
# .env
VITE_CRYPTO_KEY=your-secret-key-from-env

# .env.production
VITE_CRYPTO_KEY=your-production-secret-key
```

```ts
// vite.config.ts 中自动注入
import { defineConfig } from 'vite'

export default defineConfig({
  // CryptoJS 会自动读取 import.meta.env.VITE_CRYPTO_KEY
})
```

### Webpack 项目

```env
# .env
VUE_APP_CRYPTO_KEY=your-secret-key
```

```ts
// webpack.config.js
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'import.meta.env.VITE_CRYPTO_KEY': JSON.stringify(process.env.VUE_APP_CRYPTO_KEY),
    }),
  ],
}
```

### Node.js 项目

```ts
import { setCryptoKey } from '@jhqn/utils'

// 从环境变量读取
setCryptoKey(process.env.CRYPTO_KEY || 'default-key')
```

## 最佳实践

### 1. 密钥管理

```ts
// ✅ 推荐：使用环境变量
setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)

// ✅ 推荐：从服务器动态获取
const key = await fetchEncryptionKey()
setCryptoKey(key)

// ❌ 不推荐：硬编码
setCryptoKey('hardcoded-secret-key') // 不安全！
```

### 2. 错误处理

```ts
import { aes } from '@jhqn/utils'

function safeEncrypt(data: string): string | null {
  try {
    return aes.encrypt(data)
  } catch (error) {
    if (error.message.includes('请先设置')) {
      console.error('密钥未设置，请先调用 setCryptoKey')
      // 重新设置密钥或提示用户
    }
    return null
  }
}

function safeDecrypt(encrypted: string): string | null {
  try {
    return aes.decrypt(encrypted)
  } catch (error) {
    console.error('解密失败，可能是密钥不匹配或数据被篡改')
    return null
  }
}
```

### 3. 数据序列化

```ts
import { aes } from '@jhqn/utils'

// ✅ 正确：序列化后再加密
const data = { name: '张三', age: 25 }
const encrypted = aes.encrypt(JSON.stringify(data))

// ✅ 正确：解密后反序列化
const decrypted = aes.decrypt(encrypted)
const parsed = JSON.parse(decrypted)

// ❌ 错误：直接加密对象
// aes.encrypt(data) // 类型错误
```

### 4. 选择正确的算法

| 场景           | 推荐算法      | 原因                     |
| -------------- | ------------- | ------------------------ |
| 敏感数据加密   | AES           | 可逆，对称加密，安全性高 |
| URL 参数编码   | Base64URL     | URL 安全，无需编码       |
| 文件完整性校验 | MD5           | 快速，固定输出           |
| 密码存储       | bcrypt/argon2 | 专门的密码哈希算法       |
| 数据签名       | SHA-256+      | 更安全，碰撞概率更低     |

## 依赖说明

### 必需依赖

- `crypto-js@^4.1.1` - 核心加密库

### 安装

```bash
# 安装主包（推荐）
npm add @jhqn/utils

# 或单独安装子包
npm add @jhqn/utils-crypto

# 如果使用子包，需要确保安装了 peer dependency
npm add crypto-js
```

## API 速查表

| 功能           | 方法                      | 说明          | 可逆 |
| -------------- | ------------------------- | ------------- | ---- |
| 密钥管理       | `setCryptoKey(key)`       | 设置 AES 密钥 | -    |
| 密钥管理       | `getCryptoKey()`          | 获取当前密钥  | -    |
| AES 加密       | `aes.encrypt(data)`       | AES 加密      | ✅   |
| AES 解密       | `aes.decrypt(data)`       | AES 解密      | ✅   |
| Base64 编码    | `base64.encrypt(data)`    | Base64 编码   | ✅   |
| Base64 解码    | `base64.decrypt(data)`    | Base64 解码   | ✅   |
| Base64URL 编码 | `base64url.encrypt(data)` | URL 安全编码  | ✅   |
| Base64URL 解码 | `base64url.decrypt(data)` | URL 安全解码  | ✅   |
| MD5 哈希       | `md5.encrypt(data)`       | MD5 哈希      | ❌   |

::: warning 安全提示

- 加密密钥应该妥善保管，不要提交到代码仓库
- MD5 不适合密码存储和数字签名
- Base64 不是加密，只是编码
- 建议定期更换加密密钥
  :::

::: tip 性能提示

- Base64/Base64URL 性能最好，适合大量数据
- AES 加密性能中等，适合敏感数据
- MD5 哈希性能好，适合完整性校验
  :::
