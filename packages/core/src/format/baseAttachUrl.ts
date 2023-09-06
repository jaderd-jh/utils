let BASE_ATTACH_URL: string

/**
 * 设置文件基本路径
 * @param key
 * @param baseUrl
 */
export function setBaseAttachUrl(baseUrl: string) {
  BASE_ATTACH_URL = baseUrl
}

/**
 * 获取文件基本路径
 */
export function getBaseAttachUrl() {
  return BASE_ATTACH_URL
}

if (import.meta.env?.VITE_BASE_ATTACH_URL) {
  setBaseAttachUrl(import.meta.env.VITE_BASE_ATTACH_URL)
}
