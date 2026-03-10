---
description: DOM 操作和浏览器环境检测工具
---

# Dom

DOM 操作和浏览器环境检测模块，提供常用的 DOM 操作和设备环境识别功能。

<llm-only>
DOM manipulation utilities and browser environment detection.
Includes functions for iOS input zoom prevention, device/host environment detection,
and async timing utilities.
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
import { inBrowser, getHostEnv, waitTime } from '@jhqn/utils'

// 可选：从子包导入
import { inBrowser, getHostEnv, waitTime } from '@jhqn/utils-core'
```

## 环境检测

### inBrowser

判断当前是否运行在浏览器环境中

**返回值**：`boolean` - 如果在浏览器环境返回 `true`，否则返回 `false`

**用法**
```ts
import { inBrowser } from '@jhqn/utils'

if (inBrowser) {
  console.log('当前在浏览器环境')
  // 可以安全地访问 window、document 等浏览器 API
} else {
  console.log('当前在 Node.js 或其他非浏览器环境')
  // 避免访问浏览器 API
}

// 在通用代码中使用
const storage = inBrowser ? localStorage : null

// 条件性添加浏览器特定的副作用
if (inBrowser) {
  window.addEventListener('resize', handleResize)
}
```

**使用场景**：
- 判断是否可以访问浏览器 API（window、document 等）
- 在 SSR（服务端渲染）中避免访问浏览器 API
- 编写跨平台代码时进行环境判断

### userAgent

获取浏览器的 User Agent 字符串

**返回值**：`string` - User Agent 字符串，非浏览器环境返回空字符串

**用法**
```ts
import { userAgent } from '@jhqn/utils'

console.log(userAgent)
// 在 Chrome 浏览器中:
// 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// 在微信中:
// 'Mozilla/5.0 (Linux; Android 10; ...) AppleWebKit/537.36 ... MicroMessenger/8.0.0'

// 在 Node.js 中:
// ''

// 判断是否包含特定标识
if (userAgent.includes('MicroMessenger')) {
  console.log('在微信环境中')
}

// 判断是否是移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
console.log(isMobile ? '移动设备' : '桌面设备')
```

**使用场景**：
- 获取用户浏览器信息
- 简单的 User Agent 解析
- 日志记录和调试

### getHostEnv

获取宿主环境信息，检测当前运行的设备、操作系统、浏览器以及中国特有的应用环境

**返回值**：`HostEnv` 对象

**HostEnv 接口**
```ts
interface HostEnv {
  // 基础环境信息（来自 detect-browser）
  type: string       // 环境类型：'browser' | 'app'
  name: string       // 浏览器名称：'chrome' | 'firefox' | 'safari' | 'edge' 等
  version: string    // 浏览器版本
  os: string         // 操作系统：'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' 等

  // 中国特有应用环境
  zlb: boolean       // 是否浙里办（浙江政务服务）
  zyd: boolean       // 是否专有钉（政务钉钉）
  zzd: boolean       // 是否浙政钉（浙江政务钉钉）
  wx: boolean        // 是否微信
  zfb: boolean       // 是否支付宝
  mini: boolean      // 是否小程序（微信小程序、支付宝小程序等）
}
```

**用法**
```ts
import { getHostEnv } from '@jhqn/utils'

const env = getHostEnv()

// 基础信息
console.log(env.type)     // 'browser'
console.log(env.name)     // 'chrome'
console.log(env.version)  // '120.0.0.0'
console.log(env.os)       // 'Windows 10'

// 中国特有应用环境
console.log(env.zlb)      // 是否浙里办
console.log(env.zyd)      // 是否专有钉
console.log(env.zzd)      // 是否浙政钉
console.log(env.wx)       // 是否微信
console.log(env.zfb)      // 是否支付宝
console.log(env.mini)     // 是否小程序

// 判断运行环境
if (env.wx) {
  console.log('当前在微信环境')
  // 使用微信 JS-SDK
}

if (env.mini) {
  console.log('当前在小程序环境')
  // 适配小程序特殊逻辑
}

if (env.zfb) {
  console.log('当前在支付宝环境')
  // 使用支付宝 JS-SDK
}

if (env.zlb) {
  console.log('当前在浙里办环境')
  // 浙里办特殊适配
}

// 判断操作系统
if (env.os === 'iOS') {
  console.log('iOS 设备')
  // iOS 特定样式或功能
}

if (env.os === 'Android') {
  console.log('Android 设备')
  // Android 特定样式或功能
}

// 判断浏览器
if (env.name === 'safari') {
  console.log('Safari 浏览器')
  // Safari 兼容性处理
}

if (env.name === 'wechat') {
  console.log('微信内置浏览器')
  // 微信浏览器特殊处理
}
```

**检测逻辑**
- **浙里办**：User Agent 包含 `@zlb`
- **专有钉**：User Agent 包含 `saas`
- **浙政钉**：User Agent 包含 `zhejiang` 或 `tauruszjd`
- **微信**：User Agent 包含 `micromessenger`
- **支付宝**：User Agent 包含 `alipay`
- **小程序**：User Agent 包含 `miniprogram`

**使用场景**：
- **移动端适配**：根据设备类型调整布局和交互
- **平台特定逻辑**：针对不同平台执行不同代码
- **SDK 初始化**：根据环境加载对应的 JS-SDK
- **调试和日志**：记录用户设备信息，帮助问题排查
- **功能降级**：根据环境能力启用或禁用某些功能

## 异步工具

### waitTime

异步等待一段时间（Promise 包装的 setTimeout）

| 参数   | 类型     | 是否必填 | 描述              |
|:-----|:-------|:-----|:----------------|
| time | number | false | 等待时间（毫秒），默认 100ms |

**返回值**：`Promise<boolean>` - 始终返回 `true`

**用法**
```ts
import { waitTime } from '@jhqn/utils'

// 等待 100ms（默认）
await waitTime()

// 等待 1 秒
await waitTime(1000)

// 等待 2 秒
await waitTime(2000)

// 在异步函数中使用
async function loadData() {
  showLoading()
  await waitTime(500) // 等待 500ms，让加载动画显示
  const data = await fetchData()
  hideLoading()
  return data
}

// 在循环中使用
async function pollData() {
  for (let i = 0; i < 10; i++) {
    const result = await checkStatus()
    if (result.done) {
      break
    }
    await waitTime(1000) // 每次轮询间隔 1 秒
  }
}

// 延迟执行
async function delayAction() {
  console.log('开始')
  await waitTime(3000)
  console.log('3秒后执行')
}

// 防抖示例
let timer: Promise<any> | null = null
async function debouncedSearch(keyword: string) {
  if (timer) {
    await timer
  }
  await waitTime(300)
  return search(keyword)
}
```

**使用场景**：
- **延迟执行**：在异步流程中延迟执行某些操作
- **轮询间隔**：在轮询 API 状态时添加间隔
- **动画时间**：等待动画完成后再执行操作
- **防抖节流**：实现简单的防抖逻辑
- **测试调试**：模拟网络延迟或异步操作

## iOS 适配

### fixiOSInputAutoZoomIn

防止 iOS 因输入框字体小于 16px 而在 focus 时页面缩放变大

**iOS 自动缩放问题**：
- iOS Safari 对字体小于 16px 的输入框会自动缩放页面
- 即使用户无法手动缩放（viewport 设置了 `user-scalable=no`），iOS 10+ 仍允许 pinch-zoom
- 这导致页面布局错乱，需要手动回正

**解决方案**：
- 检测 iOS 设备
- 动态修改 viewport，添加 `user-scalable=no`

**用法**
```ts
import { fixiOSInputAutoZoomIn } from '@jhqn/utils'

// 在应用初始化时调用（只调用一次）
fixiOSInputAutoZoomIn()
```

**使用场景**：
- **移动端应用**：主要针对 iOS 设备
- **表单页面**：包含大量输入框的页面
- **SPA 应用**：在应用入口处调用

**注意事项**：
- 此函数会修改 viewport meta 标签
- 只在 iOS 设备上生效
- 建议在应用初始化时调用一次
- 不会影响桌面浏览器

**完整示例**
```ts
// main.ts 或 app.ts
import { fixiOSInputAutoZoomIn, inBrowser } from '@jhqn/utils'

if (inBrowser) {
  // 修复 iOS 输入框自动缩放
  fixiOSInputAutoZoomIn()

  // 其他初始化代码
  initApp()
}
```

**替代方案**：
```css
/* CSS 方案：设置输入框字体大小 >= 16px */
input, textarea, select {
  font-size: 16px;
}

/* 或使用 transform 缩放（不推荐）*/
.small-input {
  font-size: 14px;
  transform: scale(0.875);
  transform-origin: left center;
}
```

## 完整示例

### 1. 应用初始化

在应用入口进行环境检测和初始化：

```ts
import { inBrowser, getHostEnv, fixiOSInputAutoZoomIn } from '@jhqn/utils'

async function initApp() {
  // 非 browser 环境直接返回
  if (!inBrowser) {
    console.log('非浏览器环境，跳过初始化')
    return
  }

  // 修复 iOS 输入框自动缩放
  fixiOSInputAutoZoomIn()

  // 获取环境信息
  const env = getHostEnv()
  console.log('当前环境:', env)

  // 根据环境加载对应的 SDK
  if (env.wx) {
    await loadWeChatSDK()
  } else if (env.zfb) {
    await loadAlipaySDK()
  } else if (env.zlb) {
    await loadZLBSDK()
  }

  // 根据操作系统调整样式
  if (env.os === 'iOS') {
    document.body.classList.add('ios-device')
  } else if (env.os === 'Android') {
    document.body.classList.add('android-device')
  }

  // 根据浏览器调整兼容性
  if (env.name === 'safari') {
    // Safari 特定兼容性处理
    applySafariFixes()
  }

  console.log('应用初始化完成')
}

// 加载微信 SDK
async function loadWeChatSDK() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

// 加载支付宝 SDK
async function loadAlipaySDK() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://appx/web-view.min.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

// 加载浙里办 SDK
async function loadZLBSDK() {
  // 浙里办 SDK 加载逻辑
}

// 启动应用
initApp()
```

### 2. 环境适配组件

创建一个环境适配组件，根据不同环境显示不同内容：

```tsx
import { getHostEnv, inBrowser } from '@jhqn/utils'

interface EnvironmentBadgeProps {
  showInDev?: boolean
}

// React 示例
function EnvironmentBadge({ showInDev = false }: EnvironmentBadgeProps) {
  if (!inBrowser) return null
  if (import.meta.env.PROD && !showInDev) return null

  const env = getHostEnv()
  const badges: string[] = []

  if (env.wx) badges.push('微信')
  if (env.zfb) badges.push('支付宝')
  if (env.mini) badges.push('小程序')
  if (env.zlb) badges.push('浙里办')
  if (env.zyd) badges.push('专有钉')
  if (env.zzd) badges.push('浙政钉')

  return (
    <div className="environment-badge">
      {badges.map(badge => (
        <span key={badge} className="badge">{badge}</span>
      ))}
    </div>
  )
}

// Vue 3 示例
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EnvironmentBadge',
  props: {
    showInDev: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    if (!inBrowser) return () => null
    if (import.meta.env.PROD && !props.showInDev) return () => null

    const env = getHostEnv()
    const badges: string[] = []

    if (env.wx) badges.push('微信')
    if (env.zfb) badges.push('支付宝')
    if (env.mini) badges.push('小程序')
    if (env.zlb) badges.push('浙里办')
    if (env.zyd) badges.push('专有钉')
    if (env.zzd) badges.push('浙政钉')

    return () => (
      <div class="environment-badge">
        {badges.map(badge => (
          <span key={badge} class="badge">{badge}</span>
        ))}
      </div>
    )
  }
})
```

### 3. 分享功能适配

根据不同平台调用不同的分享 API：

```ts
import { getHostEnv, inBrowser } from '@jhqn/utils'

interface ShareConfig {
  title: string
  desc: string
  link: string
  imgUrl: string
}

async function share(config: ShareConfig) {
  if (!inBrowser) {
    console.warn('非浏览器环境，无法分享')
    return
  }

  const env = getHostEnv()

  if (env.wx && env.mini) {
    // 微信小程序
    await shareInWeChatMini(config)
  } else if (env.wx) {
    // 微信 H5
    await shareInWeChatH5(config)
  } else if (env.zfb && env.mini) {
    // 支付宝小程序
    await shareInAlipayMini(config)
  } else if (env.zfb) {
    // 支付宝 H5
    await shareInAlipayH5(config)
  } else {
    // 其他环境，使用原生分享 API
    await shareNative(config)
  }
}

// 微信小程序分享
async function shareInWeChatMini(config: ShareConfig) {
  if (wx?.miniProgram) {
    wx.miniProgram.postMessage({
      data: config
    })
  }
}

// 微信 H5 分享（需要先配置 JS-SDK）
async function shareInWeChatH5(config: ShareConfig) {
  if (wx) {
    wx.ready(() => {
      wx.updateAppMessageShareData(config)
      wx.updateTimelineShareData(config)
    })
  }
}

// 支付宝小程序分享
async function shareInAlipayMini(config: ShareConfig) {
  if (my?.postMessage) {
    my.postMessage({
      share: config
    })
  }
}

// 支付宝 H5 分享
async function shareInAlipayH5(config: ShareConfig) {
  if (AlipayJSBridge) {
    AlipayJSBridge.call('share', config)
  }
}

// 原生分享 API（Web Share API）
async function shareNative(config: ShareConfig) {
  if (navigator.share) {
    await navigator.share({
      title: config.title,
      text: config.desc,
      url: config.link
    })
  } else {
    // 降级方案：复制链接
    await navigator.clipboard.writeText(config.link)
    alert('链接已复制到剪贴板')
  }
}

// 使用
async function handleShare() {
  await share({
    title: '分享标题',
    desc: '分享描述',
    link: window.location.href,
    imgUrl: 'https://example.com/share.jpg'
  })
}
```

### 4. 数据加载动画

使用 waitTime 实现优雅的加载动画：

```ts
import { waitTime } from '@jhqn/utils'

async function loadUserData(userId: string) {
  // 显示加载状态
  showLoading()

  try {
    // 确保加载动画至少显示 300ms，避免闪烁
    const [data] = await Promise.all([
      fetchUserData(userId),
      waitTime(300)
    ])

    return data
  } finally {
    hideLoading()
  }
}

// 模拟进度条
async function loadDataWithProgress() {
  showProgressBar(0)

  await waitTime(100)
  showProgressBar(20)

  const step1 = await fetchDataStep1()
  showProgressBar(40)

  await waitTime(100)
  const step2 = await fetchDataStep2()
  showProgressBar(60)

  await waitTime(100)
  const step3 = await fetchDataStep3()
  showProgressBar(80)

  await waitTime(100)
  const result = combineData(step1, step2, step3)
  showProgressBar(100)

  await waitTime(200)
  hideProgressBar()

  return result
}

// 优雅的错误提示
async function submitForm(data: FormData) {
  try {
    showSubmitting()
    await submitToServer(data)
    showSuccess()
    await waitTime(1500) // 让用户看到成功提示
    redirectToSuccessPage()
  } catch (error) {
    showError(error.message)
    await waitTime(2000) // 让用户阅读错误信息
    hideError()
  }
}
```

### 5. 轮询 API 状态

使用 waitTime 实现优雅的轮询：

```ts
import { waitTime } from '@jhqn/utils'

interface TaskStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: any
}

async function pollTaskStatus(taskId: string): Promise<any> {
  const maxAttempts = 30 // 最多轮询 30 次
  const interval = 2000 // 每 2 秒轮询一次

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status: TaskStatus = await fetchTaskStatus(taskId)

    console.log(`任务状态: ${status.status}, 进度: ${status.progress}%`)

    // 更新进度条
    updateProgress(status.progress)

    if (status.status === 'completed') {
      return status.result
    }

    if (status.status === 'failed') {
      throw new Error('任务执行失败')
    }

    // 等待一段时间后继续轮询
    await waitTime(interval)
  }

  throw new Error('任务超时')
}

// 使用指数退避的轮询
async function pollWithBackoff(taskId: string): Promise<any> {
  let interval = 1000 // 初始间隔 1 秒
  const maxInterval = 10000 // 最大间隔 10 秒
  const maxAttempts = 20

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await fetchTaskStatus(taskId)

    if (status.status === 'completed') {
      return status.result
    }

    if (status.status === 'failed') {
      throw new Error('任务失败')
    }

    // 指数退避：每次增加等待时间
    await waitTime(interval)
    interval = Math.min(interval * 1.5, maxInterval)
  }

  throw new Error('轮询超时')
}
```

### 6. SSR 环境判断

在服务端渲染（SSR）项目中安全地使用浏览器 API：

```ts
import { inBrowser, userAgent } from '@jhqn/utils'

// 安全地访问 localStorage
function getStoredToken(): string | null {
  if (!inBrowser) {
    return null
  }
  return localStorage.getItem('token')
}

function setStoredToken(token: string): void {
  if (!inBrowser) {
    return
  }
  localStorage.setItem('token', token)
}

// 安全地访问 window
function getViewportSize() {
  if (!inBrowser) {
    return { width: 0, height: 0 }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// 安全地添加事件监听
function addResizeListener(handler: () => void) {
  if (!inBrowser) {
    return () => {}
  }
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}

// 日志记录（服务端和客户端）
function logEnvironment() {
  if (inBrowser) {
    console.log('客户端环境')
    console.log('User Agent:', userAgent)
  } else {
    console.log('服务端环境')
  }
}
```

## 类型定义

```ts
// 环境常量
declare const inBrowser: boolean
declare const userAgent: string

// 宿主环境信息
interface HostEnv {
  // 基础信息（来自 detect-browser）
  type: string       // 环境类型
  name: string       // 浏览器名称
  version: string    // 浏览器版本
  os: string         // 操作系统

  // 中国特有应用环境
  zlb: boolean       // 浙里办
  zyd: boolean       // 专有钉
  zzd: boolean       // 浙政钉
  wx: boolean        // 微信
  zfb: boolean       // 支付宝
  mini: boolean      // 小程序
}

// 函数签名
declare function waitTime(time?: number): Promise<boolean>
declare function getHostEnv(): HostEnv
declare function fixiOSInputAutoZoomIn(): void
```

## API 速查表

| 函数/变量 | 说明 | 返回类型 |
|:------|:----|:--------|
| `inBrowser` | 是否浏览器环境 | `boolean` |
| `userAgent` | User Agent 字符串 | `string` |
| `waitTime(time?)` | 异步等待 | `Promise<boolean>` |
| `getHostEnv()` | 获取环境信息 | `HostEnv` |
| `fixiOSInputAutoZoomIn()` | 修复 iOS 输入缩放 | `void` |

::: tip 最佳实践
- **SSR 兼容**：使用 `inBrowser` 判断后再访问浏览器 API
- **环境适配**：使用 `getHostEnv()` 获取环境信息，针对不同平台适配
- **SDK 加载**：根据环境按需加载对应的 JS-SDK
- **优雅加载**：使用 `waitTime` 确保加载动画显示足够时间
- **轮询优化**：使用指数退避避免频繁轮询
:::

::: warning 注意事项
- **环境检测**：某些特殊浏览器或 WebView 可能检测不准确
- **User Agent**：User Agent 可以被伪造，不要用于安全验证
- **iOS 适配**：`fixiOSInputAutoZoomIn()` 会修改 viewport，只在 iOS 生效
- **等待时间**：`waitTime` 是异步的，必须使用 `await` 或 `.then()`
:::
