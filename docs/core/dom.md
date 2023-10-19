# Dom

## waitTime
等待一段时间

| 参数             | 类型     | 是否必填  | 描述     |
|:---------------|:-------|:------|:-------|
| time        | number | false | 要等待的时间 |

**用法**
```ts
import { waitTime } from '@jhqn/utils'

waitTime(300)
```

## fixiOSInputAutoZoomIn
防止 iOS 因输入框字体小于16px 而在 focus 时页面缩放变大需要手动回正的情况。
iOS 10+ 允许 pinch-zoom， 即使 viewport 是不可伸缩的。
只对这些浏览器添加额外规则。

**用法**
```ts
import { fixiOSInputAutoZoomIn } from '@jhqn/utils'

fixiOSInputAutoZoomIn()
```

## getHostEnv
获取宿主环境信息

**用法**
```ts
import { getHostEnv } from '@jhqn/utils'

console.log(getHostEnv())
/** {
 *  name: 'ios',
 *  version: '13.0.3',
 *  os: 'iOS',
 *  type: 'browser',
 *  zlb: false,
 *  zyd: false,
 *  zzd: false,
 *  wx: false,
 *  zfb: false,
 *  mini: false,
 * }
 */
```
