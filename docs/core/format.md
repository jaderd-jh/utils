# Format

## setBaseAttachUrl
设置文件基本路径

| 参数             | 类型           | 是否必填  | 描述 |
|:---------------|:-------------|:------| :------|
| baseUrl        | string       | true  | 文件基本路径 |

**用法**
```ts
import { setBaseAttachUrl } from '@jhqn/utils'

setBaseAttachUrl('http://demo')
```

## getBaseAttachUrl
获取文件基本路径

**返回**：文件基本路径

**用法**
```ts
import { getBaseAttachUrl } from '@jhqn/utils'

console.log(getBaseAttachUrl()) // http://demo
```

## parseToJSON

将字符串转换为JSON对象

**返回**：解析后的JSON对象

| 参数             | 类型       | 是否必填  | 描述    |
|:---------------|:---------|:------|:------|
| str        | string   | true  | 目标字符串 |
| reviver        | (this: any, key: string, value: any) => any | false | 用于修改解析结果的回调函数 |

**用法**
```ts
import { parseToJSON } from '@jhqn/utils'

console.log(parseToJSON('{"name":"jhqn"}')) // {name: '张三'}

console.log(parseToJSON('[{"name":"jhqn"}]')) // [{name: '张三'}]
```

## filterObj
过滤obj中仅包括keys的部分

**返回**：过滤后的对象

| 参数             | 类型           | 是否必填  | 描述       |
|:---------------|:-------------|:------|:---------|
| obj        | Record<string,any>       | true  | 要过滤的对象   |
| keys        |string[]       | true  | 要过滤的keys |
| reverse        | boolean      | false | 为true时过滤取反   |

**用法**
```ts
import { filterObj } from '@jhqn/utils'

console.log(filterObj({name: '张三', age: 18,sex:'男'}, ['name'])) // [{name: '张三'}]
```

## toThousands
千位分隔符

**返回**：格式化后的字符串，如：1,234,567,890

| 参数             | 类型           | 是否必填  | 描述  |
|:---------------|:-------------|:------|:----|
| num        | number       | true  | 目标值 |

**用法**
```ts
import { toThousands } from '@jhqn/utils'

console.log(toThousands(123456789.88)) // 123,456,789.88
```

## dateFmt
格式化时间

**返回**：格式化后的时间，如：2023-01-01 00:00:00

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| date        | date   | true | 要转换的时间 |
| format        | string | true | 要转换格式  |

**用法**
```ts
import { dateFmt } from '@jhqn/utils'

console.log(dateFmt('2021-01-01','YYYY/MM/DD HH:mm:ss')) // 2021/01/01 00:00:00
```

## dateDuration
时间间隔

**返回**：时间间天数

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| start        | string | true | 开始时间 |
| end        | string   | true | 结束时间  |

**用法**
```ts
import { dateDuration } from '@jhqn/utils'

console.log(dateFmt('2022-01-01 00:00:00', '2023-01-03 00:00:10')) // 1年零2天
```

## resUrl
补全文件完整地址

**返回**：补全后的文件地址

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| url        | string   | true | 文件地址 |

**用法**
```ts
import { resUrl } from '@jhqn/utils'

console.log( resUrl('logo.png')) // http://demo/logo.png
```

## recoverFile
恢复文件地址

**返回**：恢复后的文件地址

| 参数             | 类型     | 是否必填 | 描述     |
|:---------------|:-------|:-----|:-------|
| resource        | Resource   | true | 要恢复的文件 |

**用法**
```ts
import { recoverFile } from '@jhqn/utils'

console.log(recoverFile({ id: '1', name: '图片.png', uri: 'logo.png' }))
/* {
    id: "1",
    name: "图片.png",
    url: "http://demo/logo.png",
    content: "http://demo/logo.png",
    uri: "logo.png",
    status: "done",
    percent: 100
}
*/
```

## attachFmt
附件格式

**返回**：格式化后的附件

| 参数   | 类型           | 是否必填 | 描述     |
|:-----|:-------------|:-----|:-------|
| data | array或string | true | 要格式化的文件 |

**用法**
```ts
import { attachFmt } from '@jhqn/utils'

const url = '[{\"id\":\"01\",\"name\":\"图片1.png\",\"uri\":\"01.png\",\"group\":\"default\"},{\"id\":\"02\",\"name\":\"图片2.png\",\"uri\":\"02.png\",\"group\":\"default\"}]'

console.log(attachFmt(url))
/* [{
    "id": "01",
    "name": "图片1.png",
    "group": "default",
    "url": ""http://demo/01.png",
    "content": ""http://demo/01.png",
    "uri": "01.png",
    "status": "done",
    "percent": 100
},{
    "id": "02",
    "name": "图片2.png",
    "group": "default",
    "url": ""http://demo/02.png",
    "content": ""http://demo/02.png",
    "uri": "02.png",
    "status": "done",
    "percent": 100
}]
*/
```

