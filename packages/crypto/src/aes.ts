import type { CryptoMap } from '../types'
import { ecb } from '@noble/ciphers/aes.js'
import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js'
import { base64 } from '@scure/base'
import { getCryptoKey } from './key'

const WARNING_MESSAGE = '请先使用 setCryptoKey 设置加密密钥'

/**
 * AES加密
 * @param {string} str 需要加密的字符串
 * @returns {string} string 加密后的字符串
 */
export function AESEncrypt(str: string) {
  const key = getCryptoKey()
  if (key === undefined) {
    throw new Error(WARNING_MESSAGE)
  }
  return base64.encode(ecb(key).encrypt(utf8ToBytes(str)))
}

/**
 * AES解密
 * @param {string} str 需要解密的字符串
 * @returns {string} string 解密后的字符串
 */
export function AESDecrypt(str: string) {
  const key = getCryptoKey()
  if (key === undefined) {
    throw new Error(WARNING_MESSAGE)
  }
  return bytesToUtf8(ecb(key).decrypt(base64.decode(str)))
}

/**
 * AES加密解密
 */
export const aes: CryptoMap = {
  encrypt: AESEncrypt,
  decrypt: AESDecrypt,
}
