# Desensitize

## hideMiddle
隐藏中间部分

| 参数             | 类型     | 是否必填  | 描述 |
|:---------------|:-------|:------| :------|
| str        | string | true  | 需要隐藏的字符串 |

**用法**
```ts
import { hideMiddle } from '@jhqn/utils'

console.log(hideMiddle('hello')) // h***o
```

## hideThird
隐藏首尾仅保留中间3分之1

| 参数             | 类型     | 是否必填  | 描述 |
|:---------------|:-------|:------| :------|
| str        | string | true  | 需要隐藏的字符串 |

**用法**
```ts
import { hideThird } from '@jhqn/utils'

console.log(hideThird('Tom Holland')) // Tom ***land
```

## hideHead
隐藏首部

| 参数             | 类型     | 是否必填  | 描述 |
|:---------------|:-------|:------| :------|
| str        | string | true  | 需要隐藏的字符串 |
| count        | number | false | 隐藏的字符数 |

**用法**
```ts
import { hideMiddle } from '@jhqn/utils'

console.log(hideMiddle('hello')) // ****o
console.log(hideMiddle('hello',-1)) // hello
console.log(hideMiddle('hello',0)) // hello
console.log(hideMiddle('hello',1)) // *ello
console.log(hideMiddle('hello',4)) // ****o
console.log(hideMiddle('hello',5)) // *****
```

## hideTail
隐藏尾部

| 参数             | 类型     | 是否必填  | 描述 |
|:---------------|:-------|:------| :------|
| str        | string | true  | 需要隐藏的字符串 |
| count        | number | false | 隐藏的字符数 |

**用法**
```ts
import { hideTail } from '@jhqn/utils'

console.log(hideTail('hello')) // ****o
console.log(hideTail('hello',-1)) // hello
console.log(hideTail('hello',0)) // hello
console.log(hideTail('hello',1)) // hell*
console.log(hideTail('hello',4)) // h****
console.log(hideTail('hello',5)) // *****
```

## hidePhone
隐藏手机号

| 参数             | 类型     | 是否必填 | 描述  |
|:---------------|:-------|:-----|:----|
| phone        | string | true | 手机号 |

**用法**
```ts
import { hidePhone } from '@jhqn/utils'

console.log(hidePhone('13454678901')) // 134****8901
console.log(hidePhone('057988909090')) // 0579****9090
```

## hidePhone
隐藏身份证号

| 参数             | 类型      | 是否必填  | 描述  |
|:---------------|:--------|:------|:----|
| cardNo        | string  | true  | 身份证号 |
| strong        | boolean | false | 是否强化隐藏 |

**用法**
```ts
import { hideCardNo } from '@jhqn/utils'

console.log(hideCardNo('33072319641008384x')) // 3****************x
console.log(hideCardNo('33072319641008384x',false)) // 3***23196410*****x
```

## hideSurname
隐藏姓名第一个字

| 参数             | 类型      | 是否必填  | 描述  |
|:---------------|:--------|:------|:----|
| name        | string  | true  | 姓名 |

**用法**
```ts
import { hideSurname } from '@jhqn/utils'

console.log(hideSurname('张三')) // *三
console.log(hideSurname('张三三')) // *三三
```

## hideFirstName
隐藏名字

| 参数             | 类型      | 是否必填  | 描述  |
|:---------------|:--------|:------|:----|
| name        | string  | true  | 姓名 |

**用法**
```ts
import { hideFirstName } from '@jhqn/utils'

console.log(hideFirstName('张三')) // 张*
console.log(hideFirstName('张三三')) // 张**
```

## hideEmail
隐藏邮箱

| 参数             | 类型      | 是否必填  | 描述  |
|:---------------|:--------|:------|:----|
| email        | string  | true  | 邮箱 |

**用法**
```ts
import { hideEmail } from '@jhqn/utils'

console.log(hideEmail('1234@email.com')) // 1***@email.com
```

## hideBankCard
隐藏银行卡号

| 参数             | 类型      | 是否必填  | 描述  |
|:---------------|:--------|:------|:----|
| bankCard        | string  | true  | 银行卡号 |

**用法**
```ts
import { hideBankCard } from '@jhqn/utils'

console.log(hideBankCard('1234567890123')) // 123456***0123m
```
