---
description: 数据格式化工具，包括日期、货币、文件路径、JSON 等格式化功能
---

# Format

数据格式化模块，提供日期、货币、数字、文件路径等多种数据格式转换和格式化功能。

<llm-only>
Data formatting utilities including:
- Date formatting with dayjs
- Currency formatting with symbol and thousands separator
- Number formatting with thousands separator
- File URL completion and resource handling
- JSON parsing and object filtering
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils

# 或单独安装子包
npm add @jhqn/utils-core
```

## 导入方式

```ts
// 推荐：从主包导入
import { dateFmt, toThousands, currencyFmt } from '@jhqn/utils'

// 可选：从子包导入
import { dateFmt, toThousands, currencyFmt } from '@jhqn/utils-core'
```

## 日期时间格式化

### dateFmt

格式化时间

| 参数     | 类型                             | 是否必填 | 描述                                 |
|:-------|:-------------------------------|:-----|:-----------------------------------|
| date   | string \| Date \| number \| Dayjs | true | 要转换的时间                              |
| format | string                         | true | 时间格式，支持预设值 'date' 和 'datetime' |

**format 预设值**
- `'date'` → `'YYYY-MM-DD'`
- `'datetime'` → `'YYYY-MM-DD HH:mm:ss'`

**返回值**：`string` - 格式化后的时间字符串

**用法**
```ts
import { dateFmt } from '@jhqn/utils'

// 标准日期时间格式
console.log(dateFmt('2021-01-01', 'YYYY/MM/DD HH:mm:ss'))
// '2021/01/01 00:00:00'

// 使用预设格式
console.log(dateFmt(new Date(), 'date'))
// '2024-01-15'

console.log(dateFmt(new Date(), 'datetime'))
// '2024-01-15 14:30:25'

// 自定义格式
console.log(dateFmt('2024-01-15T14:30:25', 'YYYY年MM月DD日'))
// '2024年01月15日'

// 时间戳
console.log(dateFmt(1705312225000, 'YYYY-MM-DD'))
// '2024-01-15'
```

### dateDuration

计算并格式化时间间隔

| 参数    | 类型                             | 是否必填 | 描述    |
|:------|:-------------------------------|:-----|:------|
| start | string \| Date \| number \| Dayjs | true | 开始时间  |
| end   | string \| Date \| number \| Dayjs | true | 结束时间  |

**返回值**：`string` - 时间间隔描述（如：1年2个月3天）

**用法**
```ts
import { dateDuration } from '@jhqn/utils'

// 计算时间间隔
console.log(dateDuration('2022-01-01', '2023-03-05'))
// '1年2个月3天'

// 不到一个月
console.log(dateDuration('2024-01-01', '2024-01-15'))
// '14天'

// 不到一年
console.log(dateDuration('2024-01-01', '2024-06-15'))
// '5个月14天'
```

### dayjs

导出的 dayjs 实例（已配置中文语言和常用插件）

**已加载的插件**：
- `localeData` - 本地化数据
- `duration` - 时间间隔
- `relativeTime` - 相对时间
- `customParseFormat` - 自定义格式解析
- `objectSupport` - 对象支持

**用法**
```ts
import { dayjs } from '@jhqn/utils'

// 使用 dayjs 实例
const now = dayjs()
console.log(now.format('YYYY-MM-DD'))

// 相对时间
console.log(dayjs().to(dayjs('2024-01-01')))

// 时间间隔
const duration = dayjs.duration(2, 'days')
console.log(duration.asHours()) // 48
```

## 数字格式化

### toThousands

千位分隔符格式化

| 参数  | 类型     | 是否必填 | 描述   |
|:----|:-------|:-----|:-----|
| num | number | true | 目标数字 |

**返回值**：`string` - 格式化后的字符串

**用法**
```ts
import { toThousands } from '@jhqn/utils'

// 整数
console.log(toThousands(123456789))
// '123,456,789'

// 小数
console.log(toThousands(123456789.88))
// '123,456,789.88'

// 小数位数较多
console.log(toThousands(1234.56789))
// '1,234.56789'
```

### currencyFmt

货币格式化（人民币）

| 参数                     | 类型                           | 是否必填 | 描述              |
|:-----------------------|:-----------------------------|:-----|:----------------|
| currency               | number \| string \| bigint   | true | 金额              |
| maximumFractionDigits  | number                       | false | 小数位数，默认为 2 位 |

**返回值**：`string` - 格式化后的货币字符串（带 ¥ 符号）

**用法**
```ts
import { currencyFmt } from '@jhqn/utils'

// 默认格式（2 位小数）
console.log(currencyFmt(123456789.88))
// '¥123,456,789.88'

// 指定小数位数
console.log(currencyFmt(123456789.886, 2))
// '¥123,456,789.89'

console.log(currencyFmt(123456789.88, 0))
// '¥123,456,790'

// 字符串金额
console.log(currencyFmt('1234567.88'))
// '¥1,234,567.88'

// BigInt 金额
console.log(currencyFmt(BigInt(123456789)))
// '¥123,456,789.00'

// 处理无效值
console.log(currencyFmt(undefined)) // ''
console.log(currencyFmt(null)) // ''
console.log(currencyFmt('abc')) // ''
```

## JSON 处理

### parseToJSON

将 JSON 字符串转换为对象

| 参数      | 类型                                                        | 是否必填 | 描述                  |
|:--------|:----------------------------------------------------------|:-----|:--------------------|
| str     | string                                                    | true | JSON 字符串             |
| reviver | (this: any, key: string, value: any) => any               | false | 用于修改解析结果的回调函数 |

**返回值**：`T | null` - 解析后的对象，如果不是有效 JSON 则返回 null

**用法**
```ts
import { parseToJSON } from '@jhqn/utils'

// 解析对象
console.log(parseToJSON('{"name":"张三","age":18}'))
// { name: '张三', age: 18 }

// 解析数组
console.log(parseToJSON('[{"name":"张三"}]'))
// [{ name: '张三' }]

// 无效 JSON 返回 null
console.log(parseToJSON('not json'))
// null

// 使用泛型
interface User {
  name: string
  age: number
}
const user = parseToJSON<User>('{"name":"张三","age":18}')
console.log(user?.name) // '张三'
```

### replacer

JSON.stringify 的 replacer 函数，支持 Map 类型序列化

| 参数    | 类型    | 是否必填 | 描述      |
|:------|:------|:-----|:--------|
| _     | any   | true | key（未使用）|
| value | any   | true | 属性值     |

**返回值**：`any` - 转换后的值

**用法**
```ts
import { replacer, parseToJSON, reviver } from '@jhqn/utils'

// 序列化包含 Map 的对象
const data = {
  name: '张三',
  info: new Map([['age', 18], ['city', '北京']])
}

const jsonStr = JSON.stringify(data, replacer)
console.log(jsonStr)
// {"name":"张三","info":{"dataType":"Map","value":[["age",18],["city","北京"]]}}

// 反序列化
const parsed = parseToJSON(jsonStr, reviver)
console.log(parsed.info instanceof Map) // true
```

### reviver

JSON.parse 的 reviver 函数，支持 Map 类型反序列化

| 参数    | 类型    | 是否必填 | 描述      |
|:------|:------|:-----|:--------|
| _     | any   | true | key（未使用）|
| value | any   | true | 属性值     |

**返回值**：`any` - 转换后的值

**用法**
```ts
import { parseToJSON, reviver } from '@jhqn/utils'

const jsonStr = '{"data":{"dataType":"Map","value":[["key","value"]]}}'

const obj = parseToJSON(jsonStr, reviver)
console.log(obj.data instanceof Map) // true
console.log(obj.data.get('key')) // 'value'
```

### filterObj

过滤对象属性，仅保留指定的键

| 参数      | 类型                   | 是否必填 | 描述                |
|:--------|:---------------------|:-----|:------------------|
| obj     | Record<string, any\> | true | 要过滤的对象             |
| keys    | string[]             | true | 要保留的键名数组          |
| reverse | boolean              | false | 为 true 时反向过滤（排除指定的键）|

**返回值**：`Record<string, any>` - 过滤后的对象

**用法**
```ts
import { filterObj } from '@jhqn/utils'

const user = { name: '张三', age: 18, sex: '男', city: '北京' }

// 只保留 name 和 age
console.log(filterObj(user, ['name', 'age']))
// { name: '张三', age: 18 }

// 反向过滤：排除 name 和 age
console.log(filterObj(user, ['name', 'age'], true))
// { sex: '男', city: '北京' }

// 保留所有键
console.log(filterObj(user, ['name', 'age', 'sex', 'city']))
// { name: '张三', age: 18, sex: '男', city: '北京' }
```

## 文件路径管理

### setBaseAttachUrl

设置文件基本路径

| 参数      | 类型     | 是否必填 | 描述       |
|:--------|:-------|:-----|:---------|
| baseUrl | string | true | 文件基本 URL |

**用法**
```ts
import { setBaseAttachUrl } from '@jhqn/utils'

// 手动设置
setBaseAttachUrl('https://cdn.example.com')

// 推荐使用环境变量（Vite 项目）
// .env 文件
// VITE_BASE_ATTACH_URL=https://cdn.example.com

// 应用启动时会自动读取
// if (import.meta.env?.VITE_BASE_ATTACH_URL) {
//   setBaseAttachUrl(import.meta.env.VITE_BASE_ATTACH_URL)
// }
```

### getBaseAttachUrl

获取文件基本路径

**返回值**：`string | undefined` - 文件基本 URL

**用法**
```ts
import { getBaseAttachUrl } from '@jhqn/utils'

const baseUrl = getBaseAttachUrl()
console.log(baseUrl) // 'https://cdn.example.com'
```

### resUrl

获取文件完整地址（自动补全 baseUrl）

| 参数  | 类型     | 是否必填 | 描述   |
|:----|:-------|:-----|:-----|
| url | string | true | 文件路径或 URL |

**返回值**：`string | undefined` - 完整的文件 URL

**特殊处理**：
- 如果是完整 URL（`http://` 或 `https://`），直接返回
- 如果是 blob URL（`blob:`），直接返回
- 如果是 data URL（`data:`），直接返回
- 否则拼接 baseUrl

**用法**
```ts
import { setBaseAttachUrl, resUrl } from '@jhqn/utils'

// 设置基础路径
setBaseAttachUrl('https://cdn.example.com')

// 相对路径
console.log(resUrl('logo.png'))
// 'https://cdn.example.com/logo.png'

// 路径有斜杠
console.log(resUrl('/images/logo.png'))
// 'https://cdn.example.com/images/logo.png'

// 完整 URL
console.log(resUrl('https://other.com/file.jpg'))
// 'https://other.com/file.jpg'

// blob URL
console.log(resUrl('blob:http://localhost:3000/abc-123'))
// 'blob:http://localhost:3000/abc-123'

// data URL
console.log(resUrl('data:image/png;base64,iVBORw0KG...'))
// 'data:image/png;base64,iVBORw0KG...'

// undefined 返回 undefined
console.log(resUrl(undefined))
// undefined
```

### recoverFile

统一文件字段内容，补全完整 URL

| 参数       | 类型       | 是否必填 | 描述   |
|:---------|:---------|:-----|:-----|
| resource | Resource | true | 文件资源对象 |

**Resource 类型**
```ts
interface Resource {
  id?: string
  name: string
  uri?: string    // 相对路径
  url?: string    // 完整路径（与 uri 二选一）
  group?: string
  [key: string]: any
}
```

**返回值**：标准化的文件资源对象

**用法**
```ts
import { setBaseAttachUrl, recoverFile } from '@jhqn/utils'

setBaseAttachUrl('https://cdn.example.com')

const file = recoverFile({
  id: '1',
  name: '图片.png',
  uri: 'uploads/logo.png',
  group: 'avatar'
})

console.log(file)
// {
//   id: '1',
//   name: '图片.png',
//   uri: 'uploads/logo.png',
//   group: 'avatar',
//   url: 'https://cdn.example.com/uploads/logo.png',
//   content: 'https://cdn.example.com/uploads/logo.png',
//   status: 'done',
//   percent: 100
// }
```

### attachFmt

附件格式化，统一处理各种格式的文件数据

| 参数   | 类型                                      | 是否必填 | 描述        |
|:-----|:----------------------------------------|:-----|:----------|
| data | MaybeArray\<Resource\> \| string \| undefined | true | 文件数据（多种格式）|

**支持的输入格式**：
- `Resource[]` - 文件资源数组
- `Resource` - 单个文件资源对象
- `string` (JSON 数组字符串) - `'[{...}, {...}]'`
- `string` (JSON 对象字符串) - `'{...}'`
- `string` (单个 URI) - `'uploads/logo.png'`
- `undefined` / `null` - 空数组

**返回值**：`Resource[]` - 统一格式的文件资源数组

**用法**
```ts
import { setBaseAttachUrl, attachFmt } from '@jhqn/utils'

setBaseAttachUrl('https://cdn.example.com')

// 1. JSON 数组字符串
const jsonArr = '[{"id":"01","name":"图片1.png","uri":"01.png","group":"default"},{"id":"02","name":"图片2.png","uri":"02.png","group":"default"}]'

console.log(attachFmt(jsonArr))
// [
//   {
//     id: '01',
//     name: '图片1.png',
//     group: 'default',
//     url: 'https://cdn.example.com/01.png',
//     content: 'https://cdn.example.com/01.png',
//     uri: '01.png',
//     status: 'done',
//     percent: 100
//   },
//   {
//     id: '02',
//     name: '图片2.png',
//     group: 'default',
//     url: 'https://cdn.example.com/02.png',
//     content: 'https://cdn.example.com/02.png',
//     uri: '02.png',
//     status: 'done',
//     percent: 100
//   }
// ]

// 2. 单个对象
console.log(attachFmt({ id: '1', name: 'logo.png', uri: 'logo.png' }))
// [{ id: '1', name: 'logo.png', ... }]

// 3. 单个 URI 字符串
console.log(attachFmt('uploads/avatar.png'))
// [{ id: 'uploads/avatar.png', name: 'name', uri: 'uploads/avatar.png', ... }]

// 4. 对象数组
console.log(attachFmt([
  { id: '1', name: 'file1.png', uri: 'file1.png' },
  { id: '2', name: 'file2.png', uri: 'file2.png' }
]))
// [{ ... }, { ... }]

// 5. null 或 undefined
console.log(attachFmt(null))
// []
console.log(attachFmt(undefined))
// []
```

## 完整示例

### 1. 用户信息格式化

```ts
import { dateFmt, currencyFmt, toThousands } from '@jhqn/utils'

interface UserInfo {
  name: string
  birthday: string
  salary: number
  bonus: number
}

function formatUserInfo(user: UserInfo) {
  return {
    name: user.name,
    birthday: dateFmt(user.birthday, 'date'),
    salary: currencyFmt(user.salary),
    bonus: toThousands(user.bonus)
  }
}

const user = {
  name: '张三',
  birthday: '1990-05-15',
  salary: 15000,
  bonus: 25000.5
}

console.log(formatUserInfo(user))
// {
//   name: '张三',
//   birthday: '1990-05-15',
//   salary: '¥15,000.00',
//   bonus: '25,000.5'
// }
```

### 2. API 数据处理

```ts
import { parseToJSON, filterObj } from '@jhqn/utils'

// 处理 API 响应
async function handleApiResponse(response: Response) {
  const text = await response.text()

  // 安全解析 JSON
  const data = parseToJSON(text)

  if (!data) {
    throw new Error('Invalid JSON response')
  }

  // 过滤敏感字段
  const safeData = filterObj(data, ['password', 'token', 'secret'], true)

  return safeData
}
```

### 3. 文件上传和展示

```ts
import { setBaseAttachUrl, attachFmt, resUrl } from '@jhqn/utils'

// 初始化 CDN 地址
setBaseAttachUrl(import.meta.env.VITE_BASE_ATTACH_URL)

// 上传后处理文件列表
async function handleUpload(files: File[]) {
  const uploaded = await uploadFiles(files)
  // uploaded: [{ id: '1', name: 'photo.jpg', uri: 'uploads/xxx.jpg' }]

  // 格式化为统一格式
  const formatted = attachFmt(uploaded)

  return formatted
}

// 从数据库读取并展示
function displayImages(dataFromDB: string) {
  // dataFromDB 可能是 JSON 字符串、URI 字符串等各种格式
  const images = attachFmt(dataFromDB)

  return images.map(img => ({
    id: img.id,
    name: img.name,
    url: img.url, // 已补全完整 URL
    thumbnail: resUrl(img.uri) + '?w=200&h=200'
  }))
}
```

### 4. 时间统计报表

```ts
import { dateFmt, dateDuration } from '@jhqn/utils'

interface Project {
  name: string
  startDate: string
  endDate: string
  budget: number
}

function generateProjectReport(project: Project) {
  return {
    name: project.name,
    period: `${dateFmt(project.startDate, 'date')} 至 ${dateFmt(project.endDate, 'date')}`,
    duration: dateDuration(project.startDate, project.endDate),
    budget: currencyFmt(project.budget),
    createdAt: dateFmt(new Date(), 'datetime')
  }
}

const project = {
  name: '网站重构项目',
  startDate: '2024-01-01',
  endDate: '2024-03-15',
  budget: 500000
}

console.log(generateProjectReport(project))
// {
//   name: '网站重构项目',
//   period: '2024-01-01 至 2024-03-15',
//   duration: '2个月14天',
//   budget: '¥500,000.00',
//   createdAt: '2024-01-15 14:30:25'
// }
```

### 5. 表格数据格式化

```ts
import { currencyFmt, toThousands, dateFmt } from '@jhqn/utils'

interface Order {
  id: string
  product: string
  amount: number
  quantity: number
  createdAt: Date
}

function formatOrderTable(orders: Order[]) {
  return orders.map(order => ({
    '订单ID': order.id,
    '产品': order.product,
    '金额': currencyFmt(order.amount),
    '数量': toThousands(order.quantity),
    '时间': dateFmt(order.createdAt, 'datetime')
  }))
}

const orders = [
  {
    id: '001',
    product: 'MacBook Pro',
    amount: 19999,
    quantity: 10,
    createdAt: new Date()
  },
  {
    id: '002',
    product: 'iPhone 15',
    amount: 8999,
    quantity: 50,
    createdAt: new Date()
  }
]

console.table(formatOrderTable(orders))
```

## 类型定义

```ts
// Resource 类型
interface Resource {
  id?: string
  name: string
  uri?: string
  url?: string
  group?: string
  [key: string]: any
}

// 格式化后的 Resource
interface FormattedResource extends Resource {
  url: string
  content: string
  uri: string
  status: 'done'
  percent: 100
}

// JSON reviver 函数类型
type Reviver = (this: any, key: string, value: any) => any

// JSON replacer 函数类型
type Replacer = (key: string, value: any) => any
```

## 环境变量配置

### Vite 项目

```env
# .env
VITE_BASE_ATTACH_URL=https://cdn.example.com

# .env.production
VITE_BASE_ATTACH_URL=https://cdn-prod.example.com
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // setBaseAttachUrl 会自动读取 import.meta.env.VITE_BASE_ATTACH_URL
})
```

### 其他环境

```ts
import { setBaseAttachUrl } from '@jhqn/utils'

// Webpack
setBaseAttachUrl(process.env.BASE_ATTACH_URL)

// Node.js
setBaseAttachUrl(process.env.BASE_ATTACH_URL)

// 或在应用初始化时手动设置
setBaseAttachUrl('https://cdn.example.com')
```

## API 速查表

| 函数 | 说明 | 返回类型 |
|------|------|---------|
| `dateFmt` | 格式化时间 | `string` |
| `dateDuration` | 时间间隔 | `string` |
| `toThousands` | 千位分隔符 | `string` |
| `currencyFmt` | 货币格式化 | `string` |
| `parseToJSON` | JSON 解析 | `T \| null` |
| `filterObj` | 过滤对象属性 | `Record<string, any>` |
| `setBaseAttachUrl` | 设置文件基础 URL | `void` |
| `getBaseAttachUrl` | 获取文件基础 URL | `string \| undefined` |
| `resUrl` | 补全文件 URL | `string \| undefined` |
| `recoverFile` | 统一文件字段 | `FormattedResource` |
| `attachFmt` | 附件格式化 | `FormattedResource[]` |
| `replacer` | JSON.stringify replacer | `any` |
| `reviver` | JSON.parse reviver | `any` |
| `dayjs` | dayjs 实例 | `Dayjs` |

::: tip
- 所有格式化函数都会处理无效输入，返回空字符串或 null
- 文件路径函数支持自动补全、智能拼接
- dayjs 已配置中文语言和常用插件
:::

::: warning
- 使用 `resUrl`、`recoverFile`、`attachFmt` 前必须先设置 `setBaseAttachUrl`
- `parseToJSON` 对无效 JSON 返回 null，不会抛出错误
- `currencyFmt` 固定使用人民币（CNY）格式
:::
