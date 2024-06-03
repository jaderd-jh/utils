/**
 * 文件基本路径
 */
let __BASE_ATTACH_URL__: string

/**
 * 设置文件基本路径
 * @param baseUrl
 */
export function setBaseAttachUrl(baseUrl: string) {
  __BASE_ATTACH_URL__ = baseUrl
}

/**
 * 获取文件基本路径
 */
export function getBaseAttachUrl() {
  return __BASE_ATTACH_URL__
}
