import encUTF8 from 'crypto-js/enc-utf8'

let KEY: CryptoJS.lib.WordArray

/**
 * 设置加密key
 * @param key
 */
export function setCryptoKey(key: string) {
  KEY = encUTF8.parse(key)
}

/**
 * 获取加密key
 */
export function getCryptoKey() {
  return KEY
}

if (import.meta.env?.VITE_CRYPTO_KEY) {
  setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)
}
