import Base64 from 'crypto-js/enc-base64.js'
import Utf8 from 'crypto-js/enc-utf8.js'
import type { CryptoMap } from '../types'

/**
 * Base64加密
 * @param {string} str 需要加密的字符串
 * @returns {string} string 加密后的字符串
 */
export function base64Encrypt(str: string) {
  return Base64.stringify(Utf8.parse(str))
}

/**
 * Base64解密
 * @param {string} str 需要解密的字符串
 * @returns {string} string 解密后的字符串
 */
export function base64Decrypt(str: string) {
  return Utf8.stringify(Base64.parse(str))
}

export const base64: CryptoMap = {
  encrypt: base64Encrypt,
  decrypt: base64Decrypt,
}
