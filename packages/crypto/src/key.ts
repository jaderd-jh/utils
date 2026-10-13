import { utf8ToBytes } from '@noble/ciphers/utils.js'

/**
 * AES加密密钥(utf8 原始字节)
 */
let __JADE_CRYPTO_KEY__: Uint8Array | undefined

/**
 * 设置加密key
 * @param key
 */
export function setCryptoKey(key: string) {
  __JADE_CRYPTO_KEY__ = utf8ToBytes(key)
}

/**
 * 获取加密key
 */
export function getCryptoKey(): Uint8Array | undefined {
  return __JADE_CRYPTO_KEY__
}
