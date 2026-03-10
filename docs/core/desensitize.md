---
description: 数据脱敏工具函数，用于隐藏敏感信息如手机号、身份证号、邮箱等
---

# Desensitize

数据脱敏模块提供了一系列用于隐藏敏感信息的工具函数，适用于前端展示场景，保护用户隐私。

<llm-only>
Data desensitization functions for hiding sensitive information like phone numbers,
ID cards, emails, and bank cards. Used for frontend display scenarios.
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
import { hidePhone, hideCardNo, hideEmail } from '@jhqn/utils'

// 可选：从子包导入
import { hidePhone, hideCardNo, hideEmail } from '@jhqn/utils-core'
```

## 脱敏场景

### 为什么需要数据脱敏？

在前端展示用户敏感信息时，直接显示完整信息存在安全隐患和隐私问题：

- **手机号**：直接展示可能被爬虫收集
- **身份证号**：涉及个人身份信息，需保护
- **银行卡号**：金融信息，必须脱敏
- **邮箱地址**：防止邮件地址被收集发送垃圾邮件
- **姓名**：保护用户身份隐私

### 脱敏原则

1. **保留部分信息**：让用户能识别是自己的信息
2. **隐藏关键部分**：核心敏感字符用 `*` 替代
3. **格式保持**：脱敏后保持原有格式（如手机号格式）
4. **不可逆性**：脱敏应该是单向的，无法还原

## 通用隐藏函数

### hideMiddle

隐藏字符串中间部分，保留首尾字符

| 参数  | 类型     | 是否必填 | 描述        |
|:----|:-------|:-----|:----------|
| str | string | true | 需要隐藏的字符串 |

**返回值**：`string` - 首尾保留，中间用 `*` 替换

**隐藏规则**：
- 长度 = 1 → `*`
- 长度 = 2 → `**`
- 长度 > 2 → 首字符 + `*`(n-2个) + 尾字符

**用法**
```ts
import { hideMiddle } from '@jhqn/utils'

console.log(hideMiddle('hello'))
// 'h***o'

console.log(hideMiddle('a'))
// '*'

console.log(hideMiddle('ab'))
// '**'

console.log(hideMiddle('张三丰'))
// '张*丰'

console.log(hideMiddle('123456789'))
// '1*******9'

// undefined 或 null 返回空字符串
console.log(hideMiddle(undefined))
// ''

console.log(hideMiddle(null))
// ''
```

### hideThird

隐藏首尾部分，保留中间 1/3

| 参数  | 类型     | 是否必填 | 描述        |
|:----|:-------|:-----|:----------|
| str | string | true | 需要隐藏的字符串 |

**返回值**：`string` - 中间 1/3 保留，首尾用 `*` 替换

**隐藏规则**：
- 长度 = 1 → `*`
- 长度 = 2 → `**`
- 长度 > 2 → 前1/3 + `*`(中间1/3) + 后1/3

**用法**
```ts
import { hideThird } from '@jhqn/utils'

console.log(hideThird('Tom Holland'))
// 'Tom ***land'

console.log(hideThird('123456789'))
// '123***789'

console.log(hideThird('张三丰李四王五'))
// '张三*王五'

console.log(hideThird('a'))
// '*'

console.log(hideThird('ab'))
// '**'
```

### hideHead

隐藏字符串首部

| 参数    | 类型     | 是否必填 | 描述         |
|:------|:-------|:-----|:-----------|
| str   | string | true | 需要隐藏的字符串   |
| count | number | false | 隐藏的字符数（默认：len-1）|

**返回值**：`string` - 首部用 `*` 替换

**隐藏规则**：
- 不传 `count` → 隐藏除最后一个字符外的所有字符
- `count` = 0 → 不隐藏（返回原字符串）
- `count` > 字符串长度 → 隐藏全部
- `count` < 0 → 视为 0（不隐藏）

**用法**
```ts
import { hideHead } from '@jhqn/utils'

// 不传 count（默认隐藏 len-1 个字符）
console.log(hideHead('hello'))
// '****o'

// count = 0（不隐藏）
console.log(hideHead('hello', 0))
// 'hello'

// count = 1
console.log(hideHead('hello', 1))
// '*ello'

// count = 2
console.log(hideHead('hello', 2))
// '**llo'

// count = 4
console.log(hideHead('hello', 4))
// '****o'

// count = 5（全部隐藏）
console.log(hideHead('hello', 5))
// '*****'

// count = 10（超过字符串长度，全部隐藏）
console.log(hideHead('hello', 10))
// '*****'

// count = -1（负数视为 0）
console.log(hideHead('hello', -1))
// 'hello'

// 单个字符
console.log(hideHead('a'))
// '*'

// undefined 或 null
console.log(hideHead(undefined))
// ''
```

### hideTail

隐藏字符串尾部

| 参数    | 类型     | 是否必填 | 描述         |
|:------|:-------|:-----|:-----------|
| str   | string | true | 需要隐藏的字符串   |
| count | number | false | 隐藏的字符数（默认：len-1）|

**返回值**：`string` - 尾部用 `*` 替换

**隐藏规则**：
- 不传 `count` → 隐藏除第一个字符外的所有字符
- `count` = 0 → 不隐藏（返回原字符串）
- `count` > 字符串长度 → 隐藏全部
- `count` < 0 → 视为 0（不隐藏）

**用法**
```ts
import { hideTail } from '@jhqn/utils'

// 不传 count（默认隐藏 len-1 个字符）
console.log(hideTail('hello'))
// 'h****'

// count = 0（不隐藏）
console.log(hideTail('hello', 0))
// 'hello'

// count = 1
console.log(hideTail('hello', 1))
// 'hell*'

// count = 2
console.log(hideTail('hello', 2))
// 'hel**'

// count = 4
console.log(hideTail('hello', 4))
// 'h****'

// count = 5（全部隐藏）
console.log(hideTail('hello', 5))
// '*****'

// count = 10（超过字符串长度，全部隐藏）
console.log(hideTail('hello', 10))
// '*****'

// count = -1（负数视为 0）
console.log(hideTail('hello', -1))
// 'hello'

// 单个字符
console.log(hideTail('a'))
// '*'

// undefined 或 null
console.log(hideTail(undefined))
// ''
```

## 专用脱敏函数

### hidePhone

隐藏手机号或座机号

| 参数    | 类型     | 是否必填 | 描述    |
|:------|:-------|:-----|:------|
| phone | string | true | 手机号或座机号 |

**返回值**：`string` - 脱敏后的电话号码

**隐藏规则**：
- **手机号**（11位）：`138****1234`（保留前3后4）
- **座机号**（带区号）：`0579****1234`（保留区号后4）
- **无效号码**：返回原字符串

**用法**
```ts
import { hidePhone } from '@jhqn/utils'

// 手机号
console.log(hidePhone('13800138000'))
// '138****8000'

console.log(hidePhone('13454678901'))
// '134****8901'

// 座机号（带区号）
console.log(hidePhone('0579-88909090'))
// '0579****9090'

console.log(hidePhone('010-12345678'))
// '010****5678'

// 座机号（无分隔符）
console.log(hidePhone('057988909090'))
// '0579****9090'

// 无效号码（返回原字符串）
console.log(hidePhone('12345'))
// '12345'

// undefined 或 null
console.log(hidePhone(undefined))
// ''

console.log(hidePhone(null))
// ''
```

### hideCardNo

隐藏身份证号

| 参数     | 类型      | 是否必填 | 描述              |
|:-------|:--------|:-----|:----------------|
| cardNo | string  | true | 身份证号            |
| strong | boolean | false | 是否强化隐藏（默认：true）|

**返回值**：`string` - 脱敏后的身份证号

**隐藏规则**：
- **强隐藏**（`strong = true`）：
  - 15位：`3**************x`（只保留首尾）
  - 18位：`3*****************x`（只保留首尾）
- **弱隐藏**（`strong = false`）：
  - 保留出生日期段：`3***23196410*****x`
- **无效身份证号**：返回原字符串

**用法**
```ts
import { hideCardNo } from '@jhqn/utils'

// 18位身份证号 - 强隐藏（默认）
console.log(hideCardNo('33072319641008384X'))
// '3*****************X'

// 18位身份证号 - 弱隐藏
console.log(hideCardNo('33072319641008384X', false))
// '3***23196410*****X'

// 15位身份证号 - 强隐藏
console.log(hideCardNo('330723641008384'))
// '3*************4'

// 15位身份证号 - 弱隐藏
console.log(hideCardNo('330723641008384', false))
// '3***236410*****4'

// 无效身份证号（返回原字符串）
console.log(hideCardNo('12345'))
// '12345'

// undefined 或 null
console.log(hideCardNo(undefined))
// ''

console.log(hideCardNo(null))
// ''
```

### hideSurname

隐藏姓氏

| 参数   | 类型     | 是否必填 | 描述   |
|:-----|:-------|:-----|:-----|
| name | string | true | 姓名   |

**返回值**：`string` - 脱敏后的姓名

**隐藏规则**：隐藏第一个字符（姓氏）

**用法**
```ts
import { hideSurname } from '@jhqn/utils'

// 单字名
console.log(hideSurname('张'))
// '*'

// 双字名
console.log(hideSurname('张三'))
// '*三'

// 三字名
console.log(hideSurname('张三丰'))
// '*三丰'

// 四字名（复姓）
console.log(hideSurname('欧阳明日'))
// '*阳明日'

// undefined 或 null
console.log(hideSurname(undefined))
// ''

console.log(hideSurname(null))
// ''
```

### hideFirstName

隐藏名字

| 参数   | 类型     | 是否必填 | 描述   |
|:-----|:-------|:-----|:-----|
| name | string | true | 姓名   |

**返回值**：`string` - 脱敏后的姓名

**隐藏规则**：隐藏除第一个字符外的所有字符（名字）

**用法**
```ts
import { hideFirstName } from '@jhqn/utils'

// 单字名
console.log(hideFirstName('张'))
// '*'

// 双字名
console.log(hideFirstName('张三'))
// '张*'

// 三字名
console.log(hideFirstName('张三丰'))
// '张**'

// 四字名（复姓）
console.log(hideFirstName('欧阳明日'))
// '欧***'

// undefined 或 null
console.log(hideFirstName(undefined))
// ''

console.log(hideFirstName(null))
// ''
```

### hideName

::: warning 已废弃
此函数已废弃，请使用 `hideSurname` 替代。
:::

隐藏姓名第一个字（姓氏）

| 参数   | 类型     | 是否必填 | 描述   |
|:-----|:-------|:-----|:-----|
| name | string | true | 姓名   |

**返回值**：`string` - 脱敏后的姓名

**用法**
```ts
import { hideName } from '@jhqn/utils'

// 已废弃，请使用 hideSurname
console.log(hideName('张三'))
// '*三'

// 推荐
console.log(hideSurname('张三'))
// '*三'
```

### hideEmail

隐藏邮箱地址

| 参数    | 类型     | 是否必填 | 描述  |
|:------|:-------|:-----|:----|
| email | string | true | 邮箱  |

**返回值**：`string` - 脱敏后的邮箱

**隐藏规则**：
- 用户名 ≤ 3字符：`abc***@domain.com`（末尾加3个星号）
- 用户名 > 3字符：`abc****@domain.com`（保留前3，后面用星号替换）
- 无效邮箱：返回原字符串

**用法**
```ts
import { hideEmail } from '@jhqn/utils'

// 短用户名（≤3字符）
console.log(hideEmail('abc@example.com'))
// 'abc***@example.com'

console.log(hideEmail('a@b.com'))
// 'a***@b.com'

// 长用户名（>3字符）
console.log(hideEmail('zhangsan@example.com'))
// 'zha***@example.com'

console.log(hideEmail('test1234@email.com'))
// 'tes****@email.com'

// 无效邮箱（无@符号，返回原字符串）
console.log(hideEmail('notanemail'))
// 'notanemail'

// undefined 或 null
console.log(hideEmail(undefined))
// ''

console.log(hideEmail(null))
// ''
```

### hideBankCard

隐藏银行卡号

| 参数       | 类型     | 是否必填 | 描述    |
|:---------|:-------|:-----|:------|
| bankCard | string | true | 银行卡号 |

**返回值**：`string` - 脱敏后的银行卡号

**隐藏规则**：
- 卡号 ≤ 10位：不隐藏（返回原字符串）
- 卡号 > 10位：保留前6后4，中间用 `*` 替换

**用法**
```ts
import { hideBankCard } from '@jhqn/utils'

// 16位银行卡号
console.log(hideBankCard('6222021234567890'))
// '622202******7890'

// 19位银行卡号
console.log(hideBankCard('6222021234567890123'))
// '622202*******0123'

// 18位银行卡号
console.log(hideBankCard('622202123456789012'))
// '622202******9012'

// 短卡号（≤10位，不隐藏）
console.log(hideBankCard('1234567890'))
// '1234567890'

// undefined 或 null
console.log(hideBankCard(undefined))
// ''

console.log(hideBankCard(null))
// ''
```

## 完整示例

### 1. 用户信息展示

在用户列表中展示脱敏后的用户信息：

```ts
import { hidePhone, hideCardNo, hideEmail, hideSurname } from '@jhqn/utils'

interface User {
  id: number
  name: string
  phone: string
  idCard: string
  email: string
}

interface DisplayUser {
  id: number
  name: string
  phone: string
  idCard: string
  email: string
}

// 脱敏用户信息
function desensitizeUser(user: User): DisplayUser {
  return {
    id: user.id,
    name: hideSurname(user.name),
    phone: hidePhone(user.phone),
    idCard: hideCardNo(user.idCard),
    email: hideEmail(user.email)
  }
}

// 使用
const user: User = {
  id: 1,
  name: '张三',
  phone: '13800138000',
  idCard: '33072319641008384X',
  email: 'zhangsan@example.com'
}

const displayUser = desensitizeUser(user)
console.log(displayUser)
// {
//   id: 1,
//   name: '*三',
//   phone: '138****8000',
//   idCard: '3*****************X',
//   email: 'zha***@example.com'
// }

// 批量脱敏
const users: User[] = [
  { id: 1, name: '李四', phone: '13900139000', idCard: '330723199001011234', email: 'lisi@test.com' },
  { id: 2, name: '王五', phone: '15800158000', idCard: '330723198505052345', email: 'wangwu@example.cn' }
]

const displayUsers = users.map(desensitizeUser)
console.log(displayUsers)
// [
//   { id: 1, name: '*四', phone: '139****9000', idCard: '3****************4', email: 'lis***@test.com' },
//   { id: 2, name: '*五', phone: '158****8000', idCard: '3****************5', email: 'wan***@example.cn' }
// ]
```

### 2. 订单信息展示

在订单列表中展示脱敏的用户联系方式：

```ts
import { hidePhone, hideSurname } from '@jhqn/utils'

interface Order {
  orderId: string
  customerName: string
  customerPhone: string
  address: string
  amount: number
}

interface DisplayOrder {
  orderId: string
  customerName: string
  customerPhone: string
  address: string
  amount: number
}

// 脱敏订单信息
function desensitizeOrder(order: Order): DisplayOrder {
  return {
    ...order,
    customerName: hideSurname(order.customerName),
    customerPhone: hidePhone(order.customerPhone)
  }
}

// 使用
const order: Order = {
  orderId: 'ORD20240115001',
  customerName: '张三丰',
  customerPhone: '13800138000',
  address: '北京市朝阳区xxx街道',
  amount: 999.99
}

const displayOrder = desensitizeOrder(order)
console.log(displayOrder)
// {
//   orderId: 'ORD20240115001',
//   customerName: '*三丰',
//   customerPhone: '138****8000',
//   address: '北京市朝阳区xxx街道',
//   amount: 999.99
// }
```

### 3. 银行卡列表展示

在用户银行卡管理页面展示脱敏的银行卡信息：

```ts
import { hideBankCard, hideSurname } from '@jhqn/utils'

interface BankCard {
  id: number
  cardNo: string
  bankName: string
  cardType: 'debit' | 'credit'
  holderName: string
}

interface DisplayBankCard {
  id: number
  cardNo: string
  bankName: string
  cardType: string
  holderName: string
}

// 脱敏银行卡信息
function desensitizeBankCard(card: BankCard): DisplayBankCard {
  return {
    id: card.id,
    cardNo: hideBankCard(card.cardNo),
    bankName: card.bankName,
    cardType: card.cardType === 'debit' ? '储蓄卡' : '信用卡',
    holderName: hideSurname(card.holderName)
  }
}

// 使用
const cards: BankCard[] = [
  {
    id: 1,
    cardNo: '6222021234567890',
    bankName: '工商银行',
    cardType: 'debit',
    holderName: '张三'
  },
  {
    id: 2,
    cardNo: '6217001234567891234',
    bankName: '建设银行',
    cardType: 'credit',
    holderName: '张三'
  }
]

const displayCards = cards.map(desensitizeBankCard)
console.log(displayCards)
// [
//   { id: 1, cardNo: '622202******7890', bankName: '工商银行', cardType: '储蓄卡', holderName: '*三' },
//   { id: 2, cardNo: '621700*******1234', bankName: '建设银行', cardType: '信用卡', holderName: '*三' }
// ]
```

### 4. 日志记录

在日志中记录用户操作，但隐藏敏感信息：

```ts
import { hidePhone, hideEmail, hideCardNo } from '@jhqn/utils'

interface UserAction {
  userId: string
  action: string
  phone?: string
  email?: string
  idCard?: string
  timestamp: Date
}

// 创建安全日志（脱敏敏感信息）
function createSafeLog(action: UserAction): any {
  const safeLog: any = {
    userId: action.userId,
    action: action.action,
    timestamp: action.timestamp
  }

  if (action.phone) {
    safeLog.phone = hidePhone(action.phone)
  }

  if (action.email) {
    safeLog.email = hideEmail(action.email)
  }

  if (action.idCard) {
    safeLog.idCard = hideCardNo(action.idCard)
  }

  return safeLog
}

// 使用
const userAction: UserAction = {
  userId: 'user-001',
  action: 'update_profile',
  phone: '13800138000',
  email: 'user@example.com',
  idCard: '33072319641008384X',
  timestamp: new Date()
}

const safeLog = createSafeLog(userAction)
console.log(safeLog)
// {
//   userId: 'user-001',
//   action: 'update_profile',
//   timestamp: 2024-01-15T10:30:00.000Z,
//   phone: '138****8000',
//   email: 'use***@example.com',
//   idCard: '3*****************X'
// }
```

### 5. 导出数据

导出用户数据到 Excel 或 CSV 时进行脱敏：

```ts
import { hidePhone, hideEmail, hideSurname, hideCardNo } from '@jhqn/utils'

interface ExportUser {
  name: string
  phone: string
  email: string
  idCard: string
}

// 导出前脱敏
function desensitizeForExport(users: ExportUser[]): ExportUser[] {
  return users.map(user => ({
    name: hideSurname(user.name),
    phone: hidePhone(user.phone),
    email: hideEmail(user.email),
    idCard: hideCardNo(user.idCard, false) // 弱隐藏，保留出生日期
  }))
}

// 使用
const users: ExportUser[] = [
  {
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    idCard: '33072319641008384X'
  },
  {
    name: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    idCard: '330723199001011234'
  }
]

const exportData = desensitizeForExport(users)
console.log(exportData)
// [
//   { name: '*三', phone: '138****8000', email: 'zha***@example.com', idCard: '3***23196410*****X' },
//   { name: '*四', phone: '139****9000', email: 'lis***@example.com', idCard: '3***23199010*****4' }
// ]

// 导出为 CSV
function toCSV(data: ExportUser[]): string {
  const headers = ['姓名', '手机号', '邮箱', '身份证号']
  const rows = data.map(user => [user.name, user.phone, user.email, user.idCard])
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const csv = toCSV(exportData)
console.log(csv)
// 姓名,手机号,邮箱,身份证号
// *三,138****8000,zha***@example.com,3***23196410*****X
// *四,139****9000,lis***@example.com,3***23199010*****4
```

### 6. 自定义脱敏规则

根据不同场景应用不同的脱敏规则：

```ts
import { hidePhone, hideEmail, hideSurname, hideCardNo } from '@jhqn/utils'

// 脱敏级别
type DesensitizeLevel = 'none' | 'weak' | 'strong'

// 根据级别脱敏手机号
function hidePhoneWithLevel(phone: string, level: DesensitizeLevel): string {
  if (level === 'none') return phone
  if (level === 'weak') {
    // 弱脱敏：只隐藏中间3位
    return phone.replace(/(\d{4})\d{3}(\d{4})/, '$1***$2')
  }
  // 强脱敏：默认规则
  return hidePhone(phone)
}

// 根据用户权限决定脱敏级别
function desensitizeByRole(data: any, userRole: 'admin' | 'manager' | 'viewer'): any {
  const level: DesensitizeLevel = userRole === 'admin' ? 'none' : userRole === 'manager' ? 'weak' : 'strong'

  return {
    ...data,
    phone: hidePhoneWithLevel(data.phone, level),
    email: level === 'none' ? data.email : hideEmail(data.email)
  }
}

// 使用
const userData = {
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com'
}

// 管理员 - 不脱敏
console.log(desensitizeByRole(userData, 'admin'))
// { name: '张三', phone: '13800138000', email: 'zhangsan@example.com' }

// 经理 - 弱脱敏
console.log(desensitizeByRole(userData, 'manager'))
// { name: '张三', phone: '1380***8000', email: 'zha***@example.com' }

// 普通用户 - 强脱敏
console.log(desensitizeByRole(userData, 'viewer'))
// { name: '张三', phone: '138****8000', email: 'zha***@example.com' }
```

## 类型定义

```ts
// 通用隐藏函数
declare function hideMiddle(str: string | undefined | null): string
declare function hideThird(str: string | undefined | null): string
declare function hideHead(str: string | undefined | null, count?: number): string
declare function hideTail(str: string | undefined | null, count?: number): string

// 专用脱敏函数
declare function hidePhone(phone: string | undefined | null): string
declare function hideCardNo(cardNo: string | undefined | null, strong?: boolean): string
declare function hideSurname(name: string | undefined | null): string
declare function hideFirstName(name: string | undefined | null): string
declare function hideEmail(email: string | undefined | null): string
declare function hideBankCard(bankCard: string | undefined | null): string

// 已废弃
/** @deprecated 请使用 hideSurname */
declare function hideName(name: string | undefined | null): string
```

## API 速查表

### 通用隐藏函数

| 函数 | 说明 | 输入示例 | 输出示例 |
|:----|:----|:------|:------|
| `hideMiddle` | 隐藏中间 | `hello` | `h***o` |
| `hideThird` | 隐藏首尾 | `123456789` | `123***789` |
| `hideHead` | 隐藏首部 | `hello` (count=2) | `**llo` |
| `hideTail` | 隐藏尾部 | `hello` (count=2) | `hel**` |

### 专用脱敏函数

| 函数 | 说明 | 输入示例 | 输出示例 |
|:----|:----|:------|:------|
| `hidePhone` | 隐藏手机号 | `13800138000` | `138****8000` |
| `hideCardNo` | 隐藏身份证号 | `33072319641008384X` | `3*****************X` |
| `hideSurname` | 隐藏姓氏 | `张三` | `*三` |
| `hideFirstName` | 隐藏名字 | `张三` | `张*` |
| `hideEmail` | 隐藏邮箱 | `abc@example.com` | `abc***@example.com` |
| `hideBankCard` | 隐藏银行卡号 | `6222021234567890` | `622202******7890` |

::: tip 最佳实践
- **展示优先**：前端展示时始终进行脱敏处理
- **权限控制**：根据用户权限决定脱敏级别
- **日志安全**：日志中不要记录完整的敏感信息
- **导出脱敏**：导出数据时必须脱敏
- **测试数据**：开发和测试环境也应该使用脱敏数据
:::

::: warning 安全提示
- 脱敏**不是加密**，无法提供绝对的安全保证
- 后端 API 也应该进行脱敏处理，不要依赖前端
- 不要将完整敏感信息存储在前端（localStorage、sessionStorage）
- 脱敏规则应该根据业务需求和法规要求制定
- 定期审查脱敏规则，确保符合最新的隐私保护要求
:::
