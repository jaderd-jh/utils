import type { CryptoMap } from '../types'
import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js'
import { base64urlnopad } from '@scure/base'

/**
 * Base64加密
 * @param {string} str 需要加密的字符串
 * @returns {string} string 加密后的字符串
 */
export function base64urlEncrypt(str: string) {
  return base64urlnopad.encode(utf8ToBytes(str))
}

/**
 * Base64解密
 * @param {string} str 需要解密的字符串
 * @returns {string} string 解密后的字符串
 */
export function base64urlDecrypt(str: string) {
  return bytesToUtf8(base64urlnopad.decode(str))
}

export const base64url: CryptoMap = {
  encrypt: base64urlEncrypt,
  decrypt: base64urlDecrypt,
}
