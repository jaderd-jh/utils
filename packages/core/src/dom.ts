import { detect } from 'detect-browser'
import type { Nullable } from '../types'

/**
 * 判断是否是浏览器环境
 */
export const inBrowser = typeof window !== 'undefined'

/**
 * 等待一段时间
 * @param time
 */
export const waitTime = (time = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/**
 * 防止 iOS 因输入框字体小于16px 而在 focus 时页面缩放变大需要手动回正的情况。
 * iOS 10+ 允许 pinch-zoom， 即使 viewport 是不可伸缩的。
 * 只对这些浏览器添加额外规则
 */
export const fixiOSInputAutoZoomIn = () => {
  if (
    CSS.supports('(font:-apple-system-body) and (-webkit-touch-callout:none) and (-webkit-tap-highlight-color:hotpink)')
  ) {
    const viewport: Nullable<HTMLMetaElement> = document.querySelector('meta[name="viewport"]')
    if (viewport !== null) {
      viewport.content = `${viewport.content}, user-scalable=no`
    }
  }
}

/**
 * 用户代理
 */
export const userAgent = inBrowser ? window.navigator.userAgent : ''

/**
 * 获取宿主环境信息
 */
export const getHostEnv = () => {
  const ua = userAgent.toLowerCase()
  const baseInfo = detect()

  const zlb = ua.includes('@zlb') // 浙里办
  const zyd = ua.includes('saas') // 专有钉
  const zzd = ua.includes('zhejiang') || ua.includes('tauruszjd') // 浙政钉
  const wx = ua.includes('micromessenger') // 微信
  const zfb = ua.includes('alipay') // 支付宝
  const mini = ua.includes('miniprogram') // 小程序

  return {
    ...baseInfo,
    /**
     * 是否是浙里办
     */
    zlb,
    /**
     * 是否是专有钉
     */
    zyd,
    /**
     * 是否是浙政钉
     */
    zzd,
    /**
     * 是否是微信
     */
    wx,
    /**
     * 是否是支付宝
     */
    zfb,
    /**
     * 是否是小程序
     */
    mini,
  }
}

export * from 'detect-browser'
