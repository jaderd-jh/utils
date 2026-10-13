import type { CryptoMap } from '../types'
import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js'
import { base64 as base64Codec } from '@scure/base'

/**
 * Base64加密
 * @param {string} str 需要加密的字符串
 * @returns {string} string 加密后的字符串
 */
export function base64Encrypt(str: string) {
  return base64Codec.encode(utf8ToBytes(str))
}

/**
 * Base64解密
 * @param {string} str 需要解密的字符串
 * @returns {string} string 解密后的字符串
 */
export function base64Decrypt(str: string) {
  return bytesToUtf8(base64Codec.decode(str))
}

export const base64: CryptoMap = {
  encrypt: base64Encrypt,
  decrypt: base64Decrypt,
}
