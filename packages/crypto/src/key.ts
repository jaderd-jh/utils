import encUTF8 from 'crypto-js/enc-utf8'

/**
 * AES加密密钥
 */
// eslint-disable-next-line no-underscore-dangle
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
