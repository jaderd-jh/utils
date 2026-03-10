---
description: 字符串命名规范转换工具，支持 camelCase、PascalCase、snake_case、kebab-case 等多种格式互转
---

# Case

字符串命名规范转换模块，支持多种编程命名规范之间的相互转换。

<llm-only>
String case conversion utilities supporting multiple naming conventions:
camelCase, PascalCase, snake_case, kebab-case, and Title Case.
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
import { camel2Snake, pascal2Kebab } from '@jhqn/utils'

// 可选：从子包导入
import { camel2Snake, pascal2Kebab } from '@jhqn/utils-core'
```

## 命名规范说明

本模块支持 5 种常见的命名规范：

| 命名规范 | 示例 | 分隔符 | 使用场景 |
|:------|:----|:-----|:------|
| **snake_case** | `hello_world` | `_` 下划线 | Python、Ruby、数据库字段名 |
| **kebab-case** | `hello-world` | `-` 短横线 | CSS 类名、URL 路径、HTML 属性 |
| **PascalCase** | `HelloWorld` | 无（首字母大写） | TypeScript 类名、React 组件、C# 类 |
| **camelCase** | `helloWorld` | 无（首字母小写） | JavaScript 变量、函数名、JSON 属性 |
| **Title Case** | `Hello World` | ` ` 空格 | 标题、显示文本、UI 标签 |

## 转换矩阵

20 个转换函数，覆盖所有命名规范之间的相互转换：

```
              → snake_case  kebab-case  PascalCase  camelCase  Title Case
snake_case    →     -       ✅          ✅          ✅         ✅
kebab-case    →     ✅       -          ✅          ✅         ✅
PascalCase    →     ✅       ✅           -         ✅         ✅
camelCase     →     ✅       ✅          ✅           -         ✅
Title Case    →     ✅       ✅          ✅          ✅          -
```

## 从 snake_case 转换

### snake2Kebab

将 snake_case 转换为 kebab-case

**转换规则**：`_` → `-`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | snake_case 字符串 |

**返回值**：`string` - kebab-case 字符串

**用法**
```ts
import { snake2Kebab } from '@jhqn/utils'

console.log(snake2Kebab('hello_world'))
// 'hello-world'

console.log(snake2Kebab('user_first_name'))
// 'user-first-name'

console.log(snake2Kebab('api_base_url'))
// 'api-base-url'
```

### snake2Pascal

将 snake_case 转换为 PascalCase

**转换规则**：首字母大写，`_` 后的字母大写，删除 `_`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | snake_case 字符串 |

**返回值**：`string` - PascalCase 字符串

**用法**
```ts
import { snake2Pascal } from '@jhqn/utils'

console.log(snake2Pascal('hello_world'))
// 'HelloWorld'

console.log(snake2Pascal('user_first_name'))
// 'UserFirstName'

console.log(snake2Pascal('http_request'))
// 'HttpRequest'
```

### snake2Camel

将 snake_case 转换为 camelCase

**转换规则**：首字母小写，`_` 后的字母大写，删除 `_`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | snake_case 字符串 |

**返回值**：`string` - camelCase 字符串

**用法**
```ts
import { snake2Camel } from '@jhqn/utils'

console.log(snake2Camel('hello_world'))
// 'helloWorld'

console.log(snake2Camel('user_first_name'))
// 'userFirstName'

console.log(snake2Camel('created_at'))
// 'createdAt'
```

### snake2Title

将 snake_case 转换为 Title Case

**转换规则**：`_` → ` `，首字母大写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | snake_case 字符串 |

**返回值**：`string` - Title Case 字符串

**用法**
```ts
import { snake2Title } from '@jhqn/utils'

console.log(snake2Title('hello_world'))
// 'Hello World'

console.log(snake2Title('user_first_name'))
// 'User First Name'

console.log(snake2Title('created_at'))
// 'Created At'
```

## 从 kebab-case 转换

### kebab2Snake

将 kebab-case 转换为 snake_case

**转换规则**：`-` → `_`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | kebab-case 字符串 |

**返回值**：`string` - snake_case 字符串

**用法**
```ts
import { kebab2Snake } from '@jhqn/utils'

console.log(kebab2Snake('hello-world'))
// 'hello_world'

console.log(kebab2Snake('user-first-name'))
// 'user_first_name'

console.log(kebab2Snake('btn-primary'))
// 'btn_primary'
```

### kebab2Pascal

将 kebab-case 转换为 PascalCase

**转换规则**：首字母大写，`-` 后的字母大写，删除 `-`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | kebab-case 字符串 |

**返回值**：`string` - PascalCase 字符串

**用法**
```ts
import { kebab2Pascal } from '@jhqn/utils'

console.log(kebab2Pascal('hello-world'))
// 'HelloWorld'

console.log(kebab2Pascal('user-profile'))
// 'UserProfile'

console.log(kebab2Pascal('date-picker'))
// 'DatePicker'
```

### kebab2Camel

将 kebab-case 转换为 camelCase

**转换规则**：首字母小写，`-` 后的字母大写，删除 `-`

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | kebab-case 字符串 |

**返回值**：`string` - camelCase 字符串

**用法**
```ts
import { kebab2Camel } from '@jhqn/utils'

console.log(kebab2Camel('hello-world'))
// 'helloWorld'

console.log(kebab2Camel('user-profile'))
// 'userProfile'

console.log(kebab2Camel('background-color'))
// 'backgroundColor'
```

### kebab2Title

将 kebab-case 转换为 Title Case

**转换规则**：`-` → ` `，首字母大写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | kebab-case 字符串 |

**返回值**：`string` - Title Case 字符串

**用法**
```ts
import { kebab2Title } from '@jhqn/utils'

console.log(kebab2Title('hello-world'))
// 'Hello World'

console.log(kebab2Title('user-profile'))
// 'User Profile'

console.log(kebab2Title('background-color'))
// 'Background Color'
```

## 从 PascalCase 转换

### pascal2Snake

将 PascalCase 转换为 snake_case

**转换规则**：大写字母前插入 `_`，全部小写（首字母前的 `_` 删除）

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | PascalCase 字符串 |

**返回值**：`string` - snake_case 字符串

**用法**
```ts
import { pascal2Snake } from '@jhqn/utils'

console.log(pascal2Snake('HelloWorld'))
// 'hello_world'

console.log(pascal2Snake('UserProfile'))
// 'user_profile'

console.log(pascal2Snake('XMLHttpRequest'))
// 'x_m_l_http_request'
```

### pascal2Kebab

将 PascalCase 转换为 kebab-case

**转换规则**：大写字母前插入 `-`，全部小写（首字母前的 `-` 删除）

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | PascalCase 字符串 |

**返回值**：`string` - kebab-case 字符串

**用法**
```ts
import { pascal2Kebab } from '@jhqn/utils'

console.log(pascal2Kebab('HelloWorld'))
// 'hello-world'

console.log(pascal2Kebab('UserProfile'))
// 'user-profile'

console.log(pascal2Kebab('DatePicker'))
// 'date-picker'
```

### pascal2Camel

将 PascalCase 转换为 camelCase

**转换规则**：首字母小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | PascalCase 字符串 |

**返回值**：`string` - camelCase 字符串

**用法**
```ts
import { pascal2Camel } from '@jhqn/utils'

console.log(pascal2Camel('HelloWorld'))
// 'helloWorld'

console.log(pascal2Camel('UserProfile'))
// 'userProfile'

console.log(pascal2Camel('DatePicker'))
// 'datePicker'
```

### pascal2Title

将 PascalCase 转换为 Title Case

**转换规则**：大写字母前插入空格

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | PascalCase 字符串 |

**返回值**：`string` - Title Case 字符串

**用法**
```ts
import { pascal2Title } from '@jhqn/utils'

console.log(pascal2Title('HelloWorld'))
// 'Hello World'

console.log(pascal2Title('UserProfile'))
// 'User Profile'

console.log(pascal2Title('DatePicker'))
// 'Date Picker'
```

## 从 camelCase 转换

### camel2Snake

将 camelCase 转换为 snake_case

**转换规则**：大写字母前插入 `_`，全部小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | camelCase 字符串 |

**返回值**：`string` - snake_case 字符串

**用法**
```ts
import { camel2Snake } from '@jhqn/utils'

console.log(camel2Snake('helloWorld'))
// 'hello_world'

console.log(camel2Snake('userFirstName'))
// 'user_first_name'

console.log(camel2Snake('backgroundColor'))
// 'background_color'
```

### camel2Kebab

将 camelCase 转换为 kebab-case

**转换规则**：大写字母前插入 `-`，全部小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | camelCase 字符串 |

**返回值**：`string` - kebab-case 字符串

**用法**
```ts
import { camel2Kebab } from '@jhqn/utils'

console.log(camel2Kebab('helloWorld'))
// 'hello-world'

console.log(camel2Kebab('userFirstName'))
// 'user-first-name'

console.log(camel2Kebab('backgroundColor'))
// 'background-color'
```

### camel2Pascal

将 camelCase 转换为 PascalCase

**转换规则**：首字母大写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | camelCase 字符串 |

**返回值**：`string` - PascalCase 字符串

**用法**
```ts
import { camel2Pascal } from '@jhqn/utils'

console.log(camel2Pascal('helloWorld'))
// 'HelloWorld'

console.log(camel2Pascal('userProfile'))
// 'UserProfile'

console.log(camel2Pascal('datePicker'))
// 'DatePicker'
```

### camel2Title

将 camelCase 转换为 Title Case

**转换规则**：大写字母前插入空格，首字母大写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | camelCase 字符串 |

**返回值**：`string` - Title Case 字符串

**用法**
```ts
import { camel2Title } from '@jhqn/utils'

console.log(camel2Title('helloWorld'))
// 'Hello World'

console.log(camel2Title('userFirstName'))
// 'User First Name'

console.log(camel2Title('backgroundColor'))
// 'Background Color'
```

## 从 Title Case 转换

### title2Snake

将 Title Case 转换为 snake_case

**转换规则**：空格 → `_`，全部小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | Title Case 字符串 |

**返回值**：`string` - snake_case 字符串

**用法**
```ts
import { title2Snake } from '@jhqn/utils'

console.log(title2Snake('Hello World'))
// 'hello_world'

console.log(title2Snake('User First Name'))
// 'user_first_name'

console.log(title2Snake('Background Color'))
// 'background_color'
```

### title2Kebab

将 Title Case 转换为 kebab-case

**转换规则**：空格 → `-`，全部小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | Title Case 字符串 |

**返回值**：`string` - kebab-case 字符串

**用法**
```ts
import { title2Kebab } from '@jhqn/utils'

console.log(title2Kebab('Hello World'))
// 'hello-world'

console.log(title2Kebab('User First Name'))
// 'user-first-name'

console.log(title2Kebab('Background Color'))
// 'background-color'
```

### title2Pascal

将 Title Case 转换为 PascalCase

**转换规则**：删除空格

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | Title Case 字符串 |

**返回值**：`string` - PascalCase 字符串

**用法**
```ts
import { title2Pascal } from '@jhqn/utils'

console.log(title2Pascal('Hello World'))
// 'HelloWorld'

console.log(title2Pascal('User First Name'))
// 'UserFirstName'

console.log(title2Pascal('Background Color'))
// 'BackgroundColor'
```

### title2Camel

将 Title Case 转换为 camelCase

**转换规则**：删除空格，首字母小写

| 参数  | 类型     | 是否必填 | 描述     |
|:----|:-------|:-----|:-------|
| str | string | true | Title Case 字符串 |

**返回值**：`string` - camelCase 字符串

**用法**
```ts
import { title2Camel } from '@jhqn/utils'

console.log(title2Camel('Hello World'))
// 'helloWorld'

console.log(title2Camel('User First Name'))
// 'userFirstName'

console.log(title2Camel('Background Color'))
// 'backgroundColor'
```

## 完整示例

### 1. 数据库字段映射

将数据库 snake_case 字段转换为前端 camelCase 属性：

```ts
import { snake2Camel, camel2Snake } from '@jhqn/utils'

// API 响应（数据库字段）
const dbUser = {
  user_id: 1,
  first_name: '张三',
  last_name: '李四',
  created_at: '2024-01-15',
  is_active: true
}

// 转换为前端格式
function dbToFrontend<T extends Record<string, any>>(obj: T): any {
  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    result[snake2Camel(key)] = value
  }
  return result
}

// 前端格式
const frontendUser = dbToFrontend(dbUser)
console.log(frontendUser)
// {
//   userId: 1,
//   firstName: '张三',
//   lastName: '李四',
//   createdAt: '2024-01-15',
//   isActive: true
// }

// 反向转换：前端格式 → 数据库格式
function frontendToDb<T extends Record<string, any>>(obj: T): any {
  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    result[camel2Snake(key)] = value
  }
  return result
}

const dbFormat = frontendToDb(frontendUser)
console.log(dbFormat)
// { user_id: 1, first_name: '张三', ... }
```

### 2. CSS 类名生成器

根据组件名生成 CSS 类名：

```ts
import { pascal2Kebab } from '@jhqn/utils'

function createBEMClass(component: string, element?: string, modifier?: string) {
  const baseClass = pascal2Kebab(component)

  if (!element && !modifier) {
    return `.${baseClass}`
  }

  let className = `.${baseClass}`

  if (element) {
    className += `__${element}`
  }

  if (modifier) {
    className += `--${modifier}`
  }

  return className
}

// 使用
console.log(createBEMClass('UserProfile'))
// '.user-profile'

console.log(createBEMClass('UserProfile', 'avatar'))
// '.user-profile__avatar'

console.log(createBEMClass('UserProfile', 'avatar', 'large'))
// '.user-profile__avatar--large'

console.log(createBEMClass('DatePicker', 'header', 'active'))
// '.date-picker__header--active'
```

### 3. React 组件命名转换

在文件名和组件名之间转换：

```ts
import { kebab2Pascal, pascal2Kebab } from '@jhqn/utils'

// 文件名 → 组件名
function fileNameToComponent(fileName: string): string {
  // 移除扩展名
  const name = fileName.replace(/\.(tsx|jsx|ts|js)$/, '')
  return kebab2Pascal(name)
}

console.log(fileNameToComponent('user-profile.tsx'))
// 'UserProfile'

console.log(fileNameToComponent('date-picker.tsx'))
// 'DatePicker'

// 组件名 → 文件名
function componentToFileName(componentName: string): string {
  return `${pascal2Kebab(componentName)}.tsx`
}

console.log(componentToFileName('UserProfile'))
// 'user-profile.tsx'

console.log(componentToFileName('DatePicker'))
// 'date-picker.tsx'

// 批量转换
const componentFiles = [
  'user-avatar.tsx',
  'user-list.tsx',
  'user-form.tsx'
]

const componentNames = componentFiles.map(fileNameToComponent)
console.log(componentNames)
// ['UserAvatar', 'UserList', 'UserForm']
```

### 4. API 路径转换

在 REST API 路径和函数名之间转换：

```ts
import { kebab2Camel, camel2Kebab } from '@jhqn/utils'

// API 路径 → 函数名
function apiPathToFunction(path: string, method: string): string {
  // 移除前导斜杠，分割路径
  const segments = path.replace(/^\//, '').split('/')

  // 转换为 camelCase
  const functionName = segments
    .map((seg, index) => {
      // 如果是路径参数，移除大括号
      if (seg.startsWith(':')) {
        return `By${seg.slice(1)}`
      }
      // 第一个段保持小写，后续使用 Pascal
      if (index === 0) {
        return seg.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      }
      return kebab2Camel(seg)
    })
    .join('')

  // 添加方法前缀
  const methodPrefix = method.toLowerCase()
  return `${methodPrefix}${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}`
}

console.log(apiPathToFunction('/users', 'GET'))
// 'getUsers'

console.log(apiPathToFunction('/user-profiles/:id', 'GET'))
// 'getUserProfilesById'

console.log(apiPathToFunction('/blog-posts/:postId/comments', 'GET'))
// 'getBlogPostsByPostIdComments'

// 函数名 → API 路径
function functionToApiPath(functionName: string, method: string): string {
  // 移除方法前缀
  const nameWithoutMethod = functionName.replace(new RegExp(`^${method.toLowerCase()}`), '')

  // 这里需要更复杂的逻辑来处理路径参数
  // 简化示例
  const segments = nameWithoutMethod.split(/(?=[A-Z])/)

  const path = segments
    .filter(Boolean)
    .map(seg => camel2Kebab(seg.toLowerCase()))
    .join('/')

  return `/${path}`
}

console.log(functionToApiPath('getUsers', 'GET'))
// '/users'

console.log(functionToApiPath('getUserProfiles', 'GET'))
// '/user/profiles'
```

### 5. 表单字段标签生成

自动生成表单字段标签：

```ts
import { camel2Title, snake2Title } from '@jhqn/utils'

interface FormField {
  name: string
  type: string
  required?: boolean
}

interface FormSchema {
  [key: string]: FormField
}

// 从 camelCase 字段生成表单配置
function generateFormLabels(schema: FormSchema) {
  return Object.entries(schema).map(([key, field]) => ({
    name: key,
    label: camel2Title(key),
    type: field.type,
    required: field.required || false
  }))
}

const userFormSchema: FormSchema = {
  firstName: { type: 'text', required: true },
  lastName: { type: 'text', required: true },
  emailAddress: { type: 'email', required: true },
  phoneNumber: { type: 'tel', required: false },
  dateOfBirth: { type: 'date', required: true }
}

const formFields = generateFormLabels(userFormSchema)
console.log(formFields)
// [
//   { name: 'firstName', label: 'First Name', type: 'text', required: true },
//   { name: 'lastName', label: 'Last Name', type: 'text', required: true },
//   { name: 'emailAddress', label: 'Email Address', type: 'email', required: true },
//   { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: false },
//   { name: 'dateOfBirth', label: 'Date Of Birth', type: 'date', required: true }
// ]

// 从数据库字段生成标签
function generateLabelsFromDbFields(dbFields: string[]) {
  return dbFields.map(field => ({
    field,
    label: snake2Title(field)
  }))
}

const dbFields = ['user_id', 'first_name', 'created_at', 'is_active']
const labels = generateLabelsFromDbFields(dbFields)
console.log(labels)
// [
//   { field: 'user_id', label: 'User Id' },
//   { field: 'first_name', label: 'First Name' },
//   { field: 'created_at', label: 'Created At' },
//   { field: 'is_active', label: 'Is Active' }
// ]
```

### 6. URL 参数转换

在 URL 参数和对象属性之间转换：

```ts
import { camel2Kebab, kebab2Camel } from '@jhqn/utils'

// 对象属性 → URL 查询参数
function objectToQueryParams(obj: Record<string, any>): string {
  const params = new URLSearchParams()

  Object.entries(obj).forEach(([key, value]) => {
    // 转换为 kebab-case
    const paramKey = camel2Kebab(key)
    params.set(paramKey, String(value))
  })

  return params.toString()
}

const filters = {
  sortBy: 'date',
  sortOrder: 'desc',
  pageSize: 20,
  includeArchived: true
}

const queryString = objectToQueryParams(filters)
console.log(queryString)
// 'sort-by=date&sort-order=desc&page-size=20&include-archived=true'

// URL 查询参数 → 对象属性
function queryParamsToObject(params: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    // 转换为 camelCase
    const propKey = kebab2Camel(key)
    result[propKey] = value
  })

  return result
}

const searchParams = new URLSearchParams(queryString)
const filterObj = queryParamsToObject(searchParams)
console.log(filterObj)
// { sortBy: 'date', sortOrder: 'desc', pageSize: '20', includeArchived: 'true' }
```

## 类型定义

```ts
// 所有转换函数的类型签名
type CaseConverter = (str: string) => string

// snake_case 转换
declare const snake2Kebab: CaseConverter
declare const snake2Pascal: CaseConverter
declare const snake2Camel: CaseConverter
declare const snake2Title: CaseConverter

// kebab-case 转换
declare const kebab2Snake: CaseConverter
declare const kebab2Pascal: CaseConverter
declare const kebab2Camel: CaseConverter
declare const kebab2Title: CaseConverter

// PascalCase 转换
declare const pascal2Snake: CaseConverter
declare const pascal2Kebab: CaseConverter
declare const pascal2Camel: CaseConverter
declare const pascal2Title: CaseConverter

// camelCase 转换
declare const camel2Snake: CaseConverter
declare const camel2Kebab: CaseConverter
declare const camel2Pascal: CaseConverter
declare const camel2Title: CaseConverter

// Title Case 转换
declare const title2Snake: CaseConverter
declare const title2Kebab: CaseConverter
declare const title2Pascal: CaseConverter
declare const title2Camel: CaseConverter
```

## API 速查表

### snake_case 转换

| 函数 | 输入 | 输出 |
|:----|:----|:-----|
| `snake2Kebab` | `hello_world` | `hello-world` |
| `snake2Pascal` | `hello_world` | `HelloWorld` |
| `snake2Camel` | `hello_world` | `helloWorld` |
| `snake2Title` | `hello_world` | `Hello World` |

### kebab-case 转换

| 函数 | 输入 | 输出 |
|:----|:----|:-----|
| `kebab2Snake` | `hello-world` | `hello_world` |
| `kebab2Pascal` | `hello-world` | `HelloWorld` |
| `kebab2Camel` | `hello-world` | `helloWorld` |
| `kebab2Title` | `hello-world` | `Hello World` |

### PascalCase 转换

| 函数 | 输入 | 输出 |
|:----|:----|:-----|
| `pascal2Snake` | `HelloWorld` | `hello_world` |
| `pascal2Kebab` | `HelloWorld` | `hello-world` |
| `pascal2Camel` | `HelloWorld` | `helloWorld` |
| `pascal2Title` | `HelloWorld` | `Hello World` |

### camelCase 转换

| 函数 | 输入 | 输出 |
|:----|:----|:-----|
| `camel2Snake` | `helloWorld` | `hello_world` |
| `camel2Kebab` | `helloWorld` | `hello-world` |
| `camel2Pascal` | `helloWorld` | `HelloWorld` |
| `camel2Title` | `helloWorld` | `Hello World` |

### Title Case 转换

| 函数 | 输入 | 输出 |
|:----|:----|:-----|
| `title2Snake` | `Hello World` | `hello_world` |
| `title2Kebab` | `Hello World` | `hello-world` |
| `title2Pascal` | `Hello World` | `HelloWorld` |
| `title2Camel` | `Hello World` | `helloWorld` |

::: tip
- 所有转换函数都是纯函数，不会修改输入字符串
- 转换函数使用正则表达式，性能良好，适合大部分场景
- 对于连续大写字母（如 `XMLHttpRequest`），会在每个大写字母前插入分隔符
:::

::: warning
- 输入字符串应该是有效的命名格式，否则结果可能不符合预期
- 连续的大写字母会被拆分（如 `XML` → `x_m_l`）
- 转换函数不做格式验证，只进行字符串替换
:::
