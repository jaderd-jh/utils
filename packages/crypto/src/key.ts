import encUTF8 from 'crypto-js/enc-utf8.js'

/**
 * AES加密密钥
 */
let __JADE_CRYPTO_KEY__: CryptoJS.lib.WordArray

/**
 * 设置加密key
 * @param key
 */
export function setCryptoKey(key: string) {
  __JADE_CRYPTO_KEY__ = encUTF8.parse(key)
}

/**
 * 获取加密key
 */
export function getCryptoKey() {
  return __JADE_CRYPTO_KEY__
}
