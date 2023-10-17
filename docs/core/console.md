# Console

## jLog
控制台打印，只在开发环境下有效

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jLog } from '@jhqn/utils'

jLog('消息','hello word!')
```

## jDebug
控制台打印

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jDebug } from '@jhqn/utils'

jDebug('消息','hello word!')
```

## jWarn
控制台打印警告信息

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jWarn } from '@jhqn/utils'

jWarn('警告','hello word!')
```


## jError
控制台打印错误信息

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jError } from '@jhqn/utils'

jError('错误','hello word!')
```

## jInfo
控制台打印普通信息

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jInfo } from '@jhqn/utils'

jInfo('消息','hello word!')
```

## jGroupC
控制台打印

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jGroupC } from '@jhqn/utils'

__DEV__ && jGroupC('FieldUploader')
jLog('mergedFieldProps', mergedFieldProps)
jLog('mergedUploaderProps', mergedUploaderProps)
__DEV__ && jGroupE()
```

## jGroupE
控制台打印

| 参数             | 类型  | 是否必填  | 描述 |
|:---------------|:----|:------| :------|
| args        | any | true  | 目标字符串 |

**用法**
```ts
import { jGroupE } from '@jhqn/utils'

__DEV__ && jGroupC('FieldUploader')
jLog('mergedFieldProps', mergedFieldProps)
jLog('mergedUploaderProps', mergedUploaderProps)
__DEV__ && jGroupE()
```
