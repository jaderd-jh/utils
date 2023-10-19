# Validate

## getVariableType
检测变量类型

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { getVariableType } from '@jhqn/utils'

console.log(getVariableType(1)) // 'number' 
```

## isNumber
是否是数字

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isNumber } from '@jhqn/utils'

console.log(isNumber(1)) // true
console.log(isNumber('1')) // false
```

## isNumber
是否是数字

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isString } from '@jhqn/utils'

console.log(isString(1)) // false
console.log(isString('1')) // true
```

## isBoolean
是否是布尔值

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isBoolean } from '@jhqn/utils'

console.log(isBoolean(1)) // false
console.log(isBoolean(true)) // true
```

## isNull
是否是null

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isNull } from '@jhqn/utils'

console.log(isNull(1)) // false
console.log(isNull(null)) // true
```

## isUndefined
是否是undefined

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isUndefined } from '@jhqn/utils'

console.log(isUndefined(1)) // false
console.log(isUndefined(undefined)) // true
```

## isSymbol
是否是symbol

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isSymbol } from '@jhqn/utils'

const mySymbol = Symbol();
console.log(isSymbol(1)) // false
console.log(isSymbol(mySymbol)) // true
```

## isObject
是否是对象

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isObject } from '@jhqn/utils'

console.log(isObject(1)) // false
console.log(isObject({name:'张三'})) // true
```

## isArray
是否是数组

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isArray } from '@jhqn/utils'

console.log(isArray({name:'张三'})) // false
console.log(isArray([{name:'张三'}])) // true
```

## isFunction
是否是函数

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

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

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isDate } from '@jhqn/utils'

const date = new Date()

console.log('结果', isDate('2020-09-09')) // false
console.log('结果', isDate(date)) // true
```

## isRegExp
是否是正则

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

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

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

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

| 参数  | 类型  | 是否必填  | 描述 |
|:----|:----|:------| :------|
| val | any | true  | 检测的目标 |

**用法**
```ts
import { isSet } from '@jhqn/utils'

const mySet = new Set()
mySet.add(1)

console.log(isSet(mySet)) // true
console.log(isSet([1, 2, 3])) // false
```
