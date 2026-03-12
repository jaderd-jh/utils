---
description: 类型校验工具函数，提供 30+ 个类型判断函数，包括基础类型、特殊类型和业务校验
---

# Validate

类型校验模块提供了丰富的类型判断函数，支持基础类型、特殊类型和业务相关的数据校验。

<llm-only>
Comprehensive type checking functions including:
- Basic types: isNumber, isString, isBoolean, isObject, isArray, etc.
- Special types: isPromise, isMap, isSet, isFile, isBlob, etc.
- Business validation: isPhone (Chinese mobile), isTel, isEmail, isIdCard (Chinese ID).
- API response validation: isValidRes, isValidArrRes, isValidPageRes.
</llm-only>

## getVariableType

检测变量类型

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { getVariableType } from '@jhqn/utils'

console.log(getVariableType(1)) // 'number'
```

## isNumber

是否是数字

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isNumber } from '@jhqn/utils'

console.log(isNumber(1)) // true
console.log(isNumber('1')) // false
```

## isString

是否是字符串

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isString } from '@jhqn/utils'

console.log(isString(1)) // false
console.log(isString('1')) // true
```

## isBoolean

是否是布尔值

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isBoolean } from '@jhqn/utils'

console.log(isBoolean(1)) // false
console.log(isBoolean(true)) // true
```

## isNull

是否是null

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isNull } from '@jhqn/utils'

console.log(isNull(1)) // false
console.log(isNull(null)) // true
```

## isUndefined

是否是undefined

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isUndefined } from '@jhqn/utils'

console.log(isUndefined(1)) // false
console.log(isUndefined(undefined)) // true
```

## isSymbol

是否是symbol

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isSymbol } from '@jhqn/utils'

const mySymbol = Symbol()
console.log(isSymbol(1)) // false
console.log(isSymbol(mySymbol)) // true
```

## isObject

是否是对象

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isObject } from '@jhqn/utils'

console.log(isObject(1)) // false
console.log(isObject({ name: '张三' })) // true
```

## isArray

是否是数组

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isArray } from '@jhqn/utils'

console.log(isArray({ name: '张三' })) // false
console.log(isArray([{ name: '张三' }])) // true
```

## isFunction

是否是函数

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isFunction } from '@jhqn/utils'

const fun = () => 'hello world'
const str = 'hello world'

console.log('结果', isFunction(str)) // false
console.log('结果', isFunction(fun)) // true
```

## isDate

是否是日期

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isDate } from '@jhqn/utils'

const date = new Date()

console.log('结果', isDate('2020-09-09')) // false
console.log('结果', isDate(date)) // true
```

## isRegExp

是否是正则

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isRegExp } from '@jhqn/utils'

const str = /^1[3-9]\d{9}$/
const exp = new RegExp('^\\d*$')

console.log('结果', isRegExp(str)) // true
console.log('结果', isRegExp(exp)) // true
```

## isPromise

是否是期望（Promise）

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isPromise } from '@jhqn/utils'

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})

const fn = async () => {
  return '成功'
}

console.log(isPromise(p)) // true
console.log(isPromise(fn)) // false
```

## isSet

是否是集合（Set）

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isSet } from '@jhqn/utils'

const mySet = new Set()
mySet.add(1)

console.log(isSet(mySet)) // true
console.log(isSet([1, 2, 3])) // false
```

## isMap

是否是映射（Map）

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isMap } from '@jhqn/utils'

const myMap = new Map()
myMap.set('key', 'value')

console.log(isMap(myMap)) // true
console.log(isMap({ key: 'value' })) // false
```

## isWeakSet

是否是弱集合（WeakSet）

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isWeakSet } from '@jhqn/utils'

const obj = {}
const myWeakSet = new WeakSet()
myWeakSet.add(obj)

console.log(isWeakSet(myWeakSet)) // true
console.log(isWeakSet(new Set())) // false
```

## isWeakMap

是否是弱映射（WeakMap）

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isWeakMap } from '@jhqn/utils'

const obj = {}
const myWeakMap = new WeakMap()
myWeakMap.set(obj, 'value')

console.log(isWeakMap(myWeakMap)) // true
console.log(isWeakMap(new Map())) // false
```

## isBigInt

是否是任意精度整数

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isBigInt } from '@jhqn/utils'

console.log(isBigInt(123n)) // true
console.log(isBigInt(123)) // false
console.log(isBigInt('123')) // false
```

## isFile

是否是 File 对象

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isFile } from '@jhqn/utils'

const file = new File(['content'], 'test.txt')

console.log(isFile(file)) // true
console.log(isFile(new Blob())) // false
```

## isBlob

是否是 Blob 对象

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isBlob } from '@jhqn/utils'

const blob = new Blob(['content'])

console.log(isBlob(blob)) // true
console.log(isBlob(new File(['content'], 'test.txt'))) // false
```

## isURL

是否是 URL 对象

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isURL } from '@jhqn/utils'

const url = new URL('https://example.com')

console.log(isURL(url)) // true
console.log(isURL('https://example.com')) // false
```

## isError

是否是 Error 对象

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isError } from '@jhqn/utils'

console.log(isError(new Error('错误'))) // true
console.log(isError('错误')) // false
```

## isDef

是否既不是 null 也不是 undefined

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | T    | true     | 检测的目标 |

**用法**

```ts
import { isDef } from '@jhqn/utils'

console.log(isDef(0)) // true
console.log(isDef('')) // true
console.log(isDef(null)) // false
console.log(isDef(undefined)) // false
```

## isJSONStr

判断是否合法 JSON 字符串

| 参数 | 类型                        | 是否必填 | 描述       |
| :--- | :-------------------------- | :------- | :--------- |
| str  | string \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isJSONStr } from '@jhqn/utils'

console.log(isJSONStr('{"name":"张三"}')) // true
console.log(isJSONStr('[1, 2, 3]')) // true
console.log(isJSONStr('hello')) // false
console.log(isJSONStr('')) // false
```

## isArrStr

判断是否合法 JSON 数组字符串

| 参数 | 类型                        | 是否必填 | 描述       |
| :--- | :-------------------------- | :------- | :--------- |
| str  | string \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isArrStr } from '@jhqn/utils'

console.log(isArrStr('[1, 2, 3]')) // true
console.log(isArrStr('[]')) // true
console.log(isArrStr('{"name":"张三"}')) // false
console.log(isArrStr('hello')) // false
```

## isValidKey

判断是否是对象的有效 key

| 参数   | 类型                       | 是否必填 | 描述 |
| :----- | :------------------------- | :------- | :--- |
| key    | string \| number \| symbol | true     | 键名 |
| object | object                     | true     | 对象 |

**用法**

```ts
import { isValidKey } from '@jhqn/utils'

const obj = { a: 1, b: 2 }

console.log(isValidKey('a', obj)) // true
console.log(isValidKey('c', obj)) // false
console.log(isValidKey('toString', obj)) // false (原型链上的不算)
```

## isEmpty

是否是空值/空数组/空对象

支持检测：`null`、`undefined`、`''`、`[]`、`{}`、`Set(0)`、`Map(0)`

| 参数 | 类型 | 是否必填 | 描述       |
| :--- | :--- | :------- | :--------- |
| val  | any  | true     | 检测的目标 |

**用法**

```ts
import { isEmpty } from '@jhqn/utils'

console.log(isEmpty(null)) // true
console.log(isEmpty(undefined)) // true
console.log(isEmpty('')) // true
console.log(isEmpty([])) // true
console.log(isEmpty({})) // true
console.log(isEmpty(new Set())) // true
console.log(isEmpty(new Map())) // true

console.log(isEmpty(0)) // false
console.log(isEmpty('hello')) // false
console.log(isEmpty([1, 2])) // false
```

## isPhone

是否是中国手机号

| 参数 | 类型                                  | 是否必填 | 描述       |
| :--- | :------------------------------------ | :------- | :--------- |
| val  | string \| number \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isPhone } from '@jhqn/utils'

console.log(isPhone('13800138000')) // true
console.log(isPhone('12345678901')) // false
```

## isTel

是否是中国座机号

| 参数 | 类型                                  | 是否必填 | 描述       |
| :--- | :------------------------------------ | :------- | :--------- |
| val  | string \| number \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isTel } from '@jhqn/utils'

console.log(isTel('010-12345678')) // true
console.log(isTel('(010)12345678')) // true
console.log(isTel('010 12345678')) // true
console.log(isTel('12345678')) // false
```

## isEmail

是否是邮箱

| 参数 | 类型                        | 是否必填 | 描述       |
| :--- | :-------------------------- | :------- | :--------- |
| val  | string \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isEmail } from '@jhqn/utils'

console.log(isEmail('test@example.com')) // true
console.log(isEmail('invalid-email')) // false
```

## isIdCard

是否是身份证号

| 参数       | 类型                        | 是否必填 | 描述                    |
| :--------- | :-------------------------- | :------- | :---------------------- |
| val        | string \| undefined \| null | true     | 身份证号                |
| compatible | boolean                     | false    | 是否兼容15位，默认 true |

**用法**

```ts
import { isIdCard } from '@jhqn/utils'

// 18位身份证
console.log(isIdCard('330102199001011234')) // true

// 15位身份证（兼容模式）
console.log(isIdCard('330102900101123')) // true

// 不兼容15位
console.log(isIdCard('330102900101123', false)) // false
```

## isUSCI

是否是统一社会信用代码

| 参数 | 类型                        | 是否必填 | 描述       |
| :--- | :-------------------------- | :------- | :--------- |
| val  | string \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isUSCI } from '@jhqn/utils'

console.log(isUSCI('91350100M000100Y43')) // true
console.log(isUSCI('123456789')) // false
```

## isNumeric

是否是数字或数字字符串

| 参数 | 类型                                  | 是否必填 | 描述       |
| :--- | :------------------------------------ | :------- | :--------- |
| val  | string \| number \| undefined \| null | true     | 检测的目标 |

**用法**

```ts
import { isNumeric } from '@jhqn/utils'

console.log(isNumeric(123)) // true
console.log(isNumeric('123')) // true
console.log(isNumeric('123.45')) // true
console.log(isNumeric('abc')) // false
```

## checkImg

是否是支持的图片格式

| 参数 | 类型                | 是否必填 | 描述       |
| :--- | :------------------ | :------- | :--------- |
| ext  | string \| undefined | true     | 文件扩展名 |

**用法**

```ts
import { checkImg } from '@jhqn/utils'

console.log(checkImg('.jpg')) // true
console.log(checkImg('.png')) // true
console.log(checkImg('.webp')) // true
console.log(checkImg('.txt')) // false
```

## nonASCII

是否包含非 ASCII 字符

| 参数 | 类型   | 是否必填 | 描述       |
| :--- | :----- | :------- | :--------- |
| text | string | true     | 检测的文本 |

**用法**

```ts
import { nonASCII } from '@jhqn/utils'

console.log(nonASCII('hello')) // false
console.log(nonASCII('你好')) // true
console.log(nonASCII('hello世界')) // true
```

## isValidFileType

校验文件类型

| 参数 | 类型   | 是否必填 | 描述                           |
| :--- | :----- | :------- | :----------------------------- |
| file | File   | true     | 需要校验的文件                 |
| type | string | true     | 文件类型，与 input.accept 一致 |

**用法**

```ts
import { isValidFileType } from '@jhqn/utils'

const file = new File(['content'], 'test.png', { type: 'image/png' })

// 支持格式：MIME类型、扩展名、通配符
console.log(isValidFileType(file, 'image/png')) // true
console.log(isValidFileType(file, '.png')) // true
console.log(isValidFileType(file, 'image/*')) // true
console.log(isValidFileType(file, '.jpg,.png')) // true
console.log(isValidFileType(file, '*')) // true
```

## isValidResCode

校验接口返回 code

| 参数 | 类型   | 是否必填 | 描述                   |
| :--- | :----- | :------- | :--------------------- |
| res  | Res    | true     | 接口响应               |
| code | number | false    | 期望的状态码，默认 200 |

**用法**

```ts
import { isValidResCode } from '@jhqn/utils'

const res = { code: 200, data: null, message: 'success' }

console.log(isValidResCode(res)) // true
console.log(isValidResCode(res, 200)) // true
console.log(isValidResCode(res, 404)) // false
```

## isValidRes

校验接口返回内容（code 正确且 data 存在）

| 参数 | 类型   | 是否必填 | 描述         |
| :--- | :----- | :------- | :----------- |
| res  | Res    | true     | 接口响应     |
| code | number | false    | 期望的状态码 |

**用法**

```ts
import { isValidRes } from '@jhqn/utils'

const res = { code: 200, data: { name: '张三' }, message: 'success' }

console.log(isValidRes(res)) // true

const emptyRes = { code: 200, data: null, message: 'success' }
console.log(isValidRes(emptyRes)) // false
```

## isValidArrRes

校验接口数组返回内容

| 参数 | 类型         | 是否必填 | 描述         |
| :--- | :----------- | :------- | :----------- |
| res  | Res\<any[]\> | true     | 接口响应     |
| code | number       | false    | 期望的状态码 |

**用法**

```ts
import { isValidArrRes } from '@jhqn/utils'

const res = { code: 200, data: [{ name: '张三' }], message: 'success' }

console.log(isValidArrRes(res)) // true

const objRes = { code: 200, data: { name: '张三' }, message: 'success' }
console.log(isValidArrRes(objRes)) // false
```

## isValidPageRes

校验接口分页返回内容

| 参数 | 类型    | 是否必填 | 描述         |
| :--- | :------ | :------- | :----------- |
| res  | PageRes | true     | 接口响应     |
| code | number  | false    | 期望的状态码 |

**用法**

```ts
import { isValidPageRes } from '@jhqn/utils'

const res = {
  code: 200,
  data: {
    list: [{ name: '张三' }],
    records: [{ name: '张三' }],
    total: 1,
  },
  message: 'success',
}

console.log(isValidPageRes(res)) // true
```

## API 速查表

### 基础类型检测

| 函数            | 描述               |
| :-------------- | :----------------- |
| getVariableType | 获取变量类型       |
| isNumber        | 是否是数字         |
| isBigInt        | 是否是任意精度整数 |
| isString        | 是否是字符串       |
| isBoolean       | 是否是布尔值       |
| isNull          | 是否是 null        |
| isUndefined     | 是否是 undefined   |
| isSymbol        | 是否是 Symbol      |
| isObject        | 是否是对象         |
| isArray         | 是否是数组         |
| isFunction      | 是否是函数         |
| isDate          | 是否是日期         |
| isRegExp        | 是否是正则         |

### 特殊类型检测

| 函数      | 描述           |
| :-------- | :------------- |
| isPromise | 是否是 Promise |
| isSet     | 是否是 Set     |
| isMap     | 是否是 Map     |
| isWeakSet | 是否是 WeakSet |
| isWeakMap | 是否是 WeakMap |
| isFile    | 是否是 File    |
| isBlob    | 是否是 Blob    |
| isURL     | 是否是 URL     |
| isError   | 是否是 Error   |

### 通用检测

| 函数       | 描述                             |
| :--------- | :------------------------------- |
| isDef      | 是否既不是 null 也不是 undefined |
| isEmpty    | 是否是空值/空数组/空对象         |
| isJSONStr  | 是否是合法 JSON 字符串           |
| isArrStr   | 是否是合法 JSON 数组字符串       |
| isValidKey | 是否是对象的有效 key             |
| isNumeric  | 是否是数字或数字字符串           |

### 业务校验

| 函数            | 描述                   |
| :-------------- | :--------------------- |
| isPhone         | 是否是中国手机号       |
| isTel           | 是否是中国座机号       |
| isEmail         | 是否是邮箱             |
| isIdCard        | 是否是身份证号         |
| isUSCI          | 是否是统一社会信用代码 |
| checkImg        | 是否是支持的图片格式   |
| nonASCII        | 是否包含非 ASCII 字符  |
| isValidFileType | 校验文件类型           |

### API 响应校验

| 函数           | 描述                 |
| :------------- | :------------------- |
| isValidResCode | 校验接口返回 code    |
| isValidRes     | 校验接口返回内容     |
| isValidArrRes  | 校验接口数组返回内容 |
| isValidPageRes | 校验接口分页返回内容 |
