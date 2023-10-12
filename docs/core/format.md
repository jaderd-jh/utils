# Format

## setBaseAttachUrl
### 参数

设置文件基本路径

| 参数             | 类型           | 是否必填  | 描述 |
|:---------------|:-------------|:------| :------|
| baseUrl        | string       | true  | 文件基本路径 |

### 用法
```ts
import { setBaseAttachUrl } from 'core/format'
setBaseAttachUrl('http://localhost:8080')
```

## getBaseAttachUrl
获取文件基本路径

**返回**：文件基本路径

### 用法
```ts
import { getBaseAttachUrl } from 'core/format'
getBaseAttachUrl()
```

## parseToJSON

将字符串转换为JSON对象

**返回**：解析后的JSON对象

| 参数             | 类型       | 是否必填  | 描述    |
|:---------------|:---------|:------|:------|
| str        | string   | true  | 目标字符串 |
| reviver        | (this: any, key: string, value: any) => any | false | 用于修改解析结果的回调函数 |

### 用法
```ts
import { parseToJSON } from 'core/format'
parseToJSON('{"name":"jhqn"}')
```

## filterObj
过滤obj中仅包括keys的部分

**返回**：过滤后的对象


| 参数             | 类型           | 是否必填  | 描述       |
|:---------------|:-------------|:------|:---------|
| obj        | Record<string,any>       | true  | 要过滤的对象   |
| keys        |string[]       | true  | 要过滤的keys |
| reverse        | boolean      | false | 为true时过滤取反   |

### 用法
```ts
import { filterObj } from 'core/format'
filterObj({name: 'jhqn', age: 18}, ['name'])
```

## toThousands
千位分隔符

**返回**：格式化后的字符串，如：1,234,567,890

| 参数             | 类型           | 是否必填  | 描述  |
|:---------------|:-------------|:------|:----|
| num        | number       | true  | 目标值 |

### 用法
```ts
import { toThousands } from 'core/format'
toThousands(123456789)
```

## dateFmt
格式化时间

**返回**：格式化后的时间，如：2023-01-01 00:00:00

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| date        | date   | true | 要转换的时间 |
| format        | string | true | 要转换格式  |

### 用法
```ts
import { dateFmt } from 'core/format'
dateFmt(new Date(), 'yyyy-MM-dd hh:mm:ss')
```

## dateDuration
格式化时间间隔

**返回**：格式化后的时间间隔，如：1天1小时1分钟1秒

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| start        | date   | true | 开始时间 |
| end        | date | true | 结束时间  |

### 用法
```ts
import { dateDuration } from 'core/format'
dateDuration(new Date(), new Date())
```

## resUrl
补全文件完整地址

**返回**：补全后的文件地址

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| url        | string   | true | 文件地址 |

### 用法
```ts
import { resUrl } from 'core/format'
resUrl('/logo.png')
```

## recoverFile
恢复文件地址

**返回**：恢复后的文件地址

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| resource        | Resource   | true | 要恢复的文件 |

### 用法
```ts
import { recoverFile } from 'core/format'
recoverFile({id: '1', name: 'logo.png'})
```

## attachFmt
附件格式

**返回**：格式化后的附件

| 参数   | 类型           | 是否必填 | 描述     |
|:-----|:-------------|:-----|:-------|
| data | array或string | true | 要格式化的文件 |

### 用法
```ts
import { attachFmt } from 'core/format'
attachFmt({id: '1', name: 'logo.png'})
```
    
