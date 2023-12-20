import encUTF8 from 'crypto-js/enc-utf8'

// eslint-disable-next-line no-underscore-dangle
let __CRYPTO_KEY__: CryptoJS.lib.WordArray

/**
 * 设置加密key
 * @param key
 */
export function setCryptoKey(key: string) {
  __CRYPTO_KEY__ = encUTF8.parse(key)
}

/**
 * 获取加密key
 */
export function getCryptoKey() {
  return __CRYPTO_KEY__
}

if (import.meta.env?.VITE_CRYPTO_KEY) {
  setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)
}
