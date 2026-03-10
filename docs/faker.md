---
description: 模拟数据生成工具，用于开发和测试环境快速生成测试数据
---

# Faker

模拟数据生成模块，基于 @faker-js/faker 提供中文友好的测试数据生成功能。

<llm-only>
Mock data generation utilities based on @faker-js/faker.
Provides Chinese-friendly fake data including names, phone numbers,
dates, and custom random values for development and testing.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils

# 或单独安装子包
npm add @jhqn/utils-faker
```

## 导入方式

```ts
// 推荐：从主包导入
import { fakeChance, fakeId, fakeName, fakePhone } from '@jhqn/utils'

// 可选：从子包导入
import { fakeChance, fakeId, fakeName, fakePhone } from '@jhqn/utils-faker'
```

## fakeChance

随机可能性（按概率返回布尔值或 undefined）

| 参数         | 类型     | 是否必填 | 描述           |
|:-----------|:-------|:-----|:-------------|
| probability | number | true | 成功概率（0-1） |

**返回值**：`true | undefined`

**用法**
```ts
import { fakeChance } from '@jhqn/utils'

// 50% 概率返回 true
if (fakeChance(0.5)) {
  console.log('50% 概率触发')
}

// 80% 概率返回 true
if (fakeChance(0.8)) {
  console.log('80% 概率触发')
}

// 用于条件渲染
const showAd = fakeChance(0.3) // 30% 概率显示广告
```

## fakeId

生成随机 16 位数字 ID（纯数字字符串）

**返回值**：`string` - 16 位数字字符串

**用法**
```ts
import { fakeId } from '@jhqn/utils'

const id = fakeId()
console.log(id) // '1234567890123456'

// 生成多个 ID
const ids = Array.from({ length: 5 }, () => fakeId())
console.log(ids) // ['1234567890123456', '9876543210987654', ...]
```

## fakeName

生成随机中文姓名

**返回值**：`string` - 中文姓名

**用法**
```ts
import { fakeName } from '@jhqn/utils'

const name = fakeName()
console.log(name) // '张三'

// 生成用户列表
const users = Array.from({ length: 3 }, () => ({
  id: fakeId(),
  name: fakeName()
}))
console.log(users)
// [
//   { id: '1234567890123456', name: '张三' },
//   { id: '9876543210987654', name: '李四' },
//   ...
// ]
```

## fakePhone

生成随机中国手机号（1 开头，11 位）

**返回值**：`string` - 11 位手机号

**用法**
```ts
import { fakePhone } from '@jhqn/utils'

const phone = fakePhone()
console.log(phone) // '13812345678'

// 生成联系人
const contact = {
  name: fakeName(),
  phone: fakePhone()
}
console.log(contact) // { name: '王五', phone: '13912345678' }
```

## fakeEnum

从枚举数组中随机选择一个值

| 参数    | 类型            | 是否必填 | 描述      |
|:------|:--------------|:-----|:--------|
| array | readonly T[] | true | 枚举值数组 |

**返回值**：`T` - 数组中的一个元素

**用法**
```ts
import { fakeEnum } from '@jhqn/utils'

// 使用枚举
enum Status {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive'
}

const status = fakeEnum(Object.values(Status))
console.log(status) // 'active'

// 使用常量数组
const colors = ['red', 'green', 'blue', 'yellow'] as const
const color = fakeEnum(colors)
console.log(color) // 'green'

// 生成随机用户类型
type UserType = 'admin' | 'user' | 'guest'
const userType: UserType = fakeEnum(['admin', 'user', 'guest'] as const)
console.log(userType) // 'user'
```

## fakeDatePast

生成随机过去时间

**返回值**：`string` - ISO 格式时间字符串

**用法**
```ts
import { fakeDatePast } from '@jhqn/utils'

const date = fakeDatePast()
console.log(date) // '2023-05-15T08:30:00.000Z'

// 生成历史订单
const order = {
  id: fakeId(),
  createdAt: fakeDatePast(),
  status: 'completed'
}
console.log(order)
```

## fakeDateFuture

生成随机未来时间

**返回值**：`string` - ISO 格式时间字符串

**用法**
```ts
import { fakeDateFuture } from '@jhqn/utils'

const date = fakeDateFuture()
console.log(date) // '2026-08-20T14:45:00.000Z'

// 生成未来事件
const event = {
  title: '会议',
  date: fakeDateFuture()
}
console.log(event)
```

## fakeDateRange

生成指定时间范围内的随机时间

| 参数   | 类型     | 是否必填 | 描述    |
|:-----|:-------|:-----|:------|
| from | string | true | 开始时间  |
| to   | string | true | 结束时间  |

**返回值**：`string` - ISO 格式时间字符串

**用法**
```ts
import { fakeDateRange } from '@jhqn/utils'

// 生成 2023 年内的随机时间
const date = fakeDateRange('2023-01-01', '2023-12-31')
console.log(date) // '2023-07-15T10:30:00.000Z'

// 生成最近 30 天内的随机时间
const now = new Date()
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
const recentDate = fakeDateRange(thirtyDaysAgo.toISOString(), now.toISOString())
console.log(recentDate)

// 生成工作时间段内的会议
const meetingTime = fakeDateRange(
  '2024-01-15T09:00:00',
  '2024-01-15T18:00:00'
)
console.log(meetingTime)
```

## fakeIntRange

生成指定范围内的随机整数

| 参数   | 类型     | 是否必填 | 描述    |
|:-----|:-------|:-----|:------|
| min  | number | true | 最小值（包含） |
| max  | number | true | 最大值（包含） |

**返回值**：`number` - 范围内的整数

**用法**
```ts
import { fakeIntRange } from '@jhqn/utils'

// 生成 1-100 的随机数
const score = fakeIntRange(1, 100)
console.log(score) // 85

// 生成年龄
const age = fakeIntRange(18, 60)
console.log(age) // 35

// 生成库存数量
const stock = fakeIntRange(0, 1000)
console.log(stock) // 456

// 生成订单数量
const orderCount = fakeIntRange(1, 10)
console.log(orderCount) // 7
```

## fakeFloatRange

生成指定范围内的随机浮点数

| 参数       | 类型     | 是否必填 | 描述           |
|:---------|:-------|:-----|:-------------|
| min      | number | true | 最小值（包含）       |
| max      | number | true | 最大值（包含）       |
| precision | number | false | 小数精度（默认不限制） |

**返回值**：`number` - 范围内的浮点数

**用法**
```ts
import { fakeFloatRange } from '@jhqn/utils'

// 生成随机价格
const price = fakeFloatRange(10, 1000)
console.log(price) // 456.78

// 生成指定精度的价格（2 位小数）
const precisePrice = fakeFloatRange(10, 1000, 0.01)
console.log(precisePrice) // 456.78

// 生成温度
const temperature = fakeFloatRange(-10, 40, 0.1)
console.log(temperature) // 23.5

// 生成折扣率
const discount = fakeFloatRange(0.1, 0.9, 0.01)
console.log(discount) // 0.75

// 生成评分
const rating = fakeFloatRange(0, 5, 0.1)
console.log(rating) // 4.5
```

## fakeKey

从对象中随机选择一个键

| 参数      | 类型                          | 是否必填 | 描述    |
|:--------|:----------------------------|:-----|:------|
| object | Record<string \| number, any\> | true | 目标对象  |

**返回值**：`string | number` - 对象的一个键

**用法**
```ts
import { fakeKey } from '@jhqn/utils'

const user = {
  name: '张三',
  age: 25,
  city: '北京'
}

const key = fakeKey(user)
console.log(key) // 'age'

// 随机选择要显示的字段
const displayField = fakeKey(user)
console.log(user[displayField]) // 25

// 配置对象
const config = {
  theme: 'dark',
  language: 'zh-CN',
  fontSize: 14
}

const randomSetting = fakeKey(config)
console.log(randomSetting) // 'language'
```

## fakeValue

从对象中随机选择一个值

| 参数      | 类型                   | 是否必填 | 描述    |
|:--------|:---------------------|:-----|:------|
| object | Record<any, any\> | true | 目标对象  |

**返回值**：`any` - 对象的一个值

**用法**
```ts
import { fakeValue } from '@jhqn/utils'

const statusMap = {
  pending: '待处理',
  active: '激活',
  inactive: '未激活'
}

const status = fakeValue(statusMap)
console.log(status) // '激活'

// 颜色配置
const colors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d'
}

const randomColor = fakeValue(colors)
console.log(randomColor) // '#52c41a'

// 用户角色
const roles = {
  admin: { level: 3, name: '管理员' },
  user: { level: 1, name: '普通用户' },
  guest: { level: 0, name: '访客' }
}

const role = fakeValue(roles)
console.log(role) // { level: 1, name: '普通用户' }
```

## 完整示例

### 生成模拟用户数据

```ts
import { fakeId, fakeName, fakePhone, fakeIntRange } from '@jhqn/utils'

interface User {
  id: string
  name: string
  phone: string
  age: number
}

// 生成单个用户
const user: User = {
  id: fakeId(),
  name: fakeName(),
  phone: fakePhone(),
  age: fakeIntRange(18, 60)
}

console.log(user)
// {
//   id: '1234567890123456',
//   name: '张三',
//   phone: '13812345678',
//   age: 35
// }

// 生成用户列表
const users: User[] = Array.from({ length: 10 }, () => ({
  id: fakeId(),
  name: fakeName(),
  phone: fakePhone(),
  age: fakeIntRange(18, 60)
}))

console.log(users)
```

### 生成模拟订单数据

```ts
import { fakeId, fakeDatePast, fakeFloatRange, fakeEnum, fakeChance } from '@jhqn/utils'

interface Order {
  id: string
  amount: number
  status: 'pending' | 'paid' | 'shipped' | 'completed'
  createdAt: string
  isPriority: boolean
}

const order: Order = {
  id: fakeId(),
  amount: fakeFloatRange(10, 1000, 0.01),
  status: fakeEnum(['pending', 'paid', 'shipped', 'completed'] as const),
  createdAt: fakeDatePast(),
  isPriority: !!fakeChance(0.2) // 20% 概率为优先订单
}

console.log(order)
// {
//   id: '9876543210987654',
//   amount: 456.78,
//   status: 'paid',
//   createdAt: '2023-06-20T14:30:00.000Z',
//   isPriority: false
// }
```

### 生成模拟商品数据

```ts
import { fakeId, fakeName, fakeFloatRange, fakeIntRange, fakeEnum } from '@jhqn/utils'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

const categories = ['电子产品', '服装', '食品', '图书'] as const

const product: Product = {
  id: fakeId(),
  name: `商品${fakeId().slice(0, 4)}`,
  price: fakeFloatRange(10, 10000, 0.01),
  stock: fakeIntRange(0, 1000),
  category: fakeEnum(categories)
}

console.log(product)
// {
//   id: '1234567890123456',
//   name: '商品1234',
//   price: 599.99,
//   stock: 456,
//   category: '电子产品'
// }
```

## 使用场景

- ✅ **前端开发和原型设计** - 快速生成模拟数据
- ✅ **单元测试和集成测试** - 提供测试数据
- ✅ **API Mock 数据生成** - 配合 MSW 使用
- ✅ **表单自动填充测试** - 生成表单数据
- ✅ **UI 组件演示** - 生成展示数据

## 依赖说明

### 必需依赖

- `@faker-js/faker@^8.0.0` - 核心 faker 库（peer dependency）
- `nanoid@^5.0.0` - 用于生成 ID

### 安装依赖

```bash
# 安装主包（推荐）
npm add @jhqn/utils

# 如果使用子包，需要额外安装依赖
npm add @jhqn/utils-faker @faker-js/faker
```

::: tip
- Faker 模块主要用于开发和测试环境，不建议在生产环境中使用
- 所有生成的数据都是随机模拟数据，不涉及真实用户信息
- 基于 `fakerZH_CN`（中文）locale，生成的姓名符合中文习惯
:::

::: warning
如果只安装 `@jhqn/utils-faker` 子包，需要手动安装 `@faker-js/faker` 作为 peer dependency。
推荐直接安装主包 `@jhqn/utils`，会自动包含所有依赖。
:::

## API 速查表

| 函数 | 说明 | 返回类型 |
|------|------|---------|
| `fakeChance` | 按概率返回 true/undefined | `true \| undefined` |
| `fakeId` | 16 位数字 ID | `string` |
| `fakeName` | 中文姓名 | `string` |
| `fakePhone` | 中国手机号 | `string` |
| `fakeEnum` | 随机枚举值 | `T` |
| `fakeDatePast` | 过去时间 | `string` |
| `fakeDateFuture` | 未来时间 | `string` |
| `fakeDateRange` | 指定范围时间 | `string` |
| `fakeIntRange` | 指定范围整数 | `number` |
| `fakeFloatRange` | 指定范围浮点数 | `number` |
| `fakeKey` | 随机对象键 | `string \| number` |
| `fakeValue` | 随机对象值 | `any` |
