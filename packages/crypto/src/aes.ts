import AES from 'crypto-js/aes'
import encUTF8 from 'crypto-js/enc-utf8'
import modeECB from 'crypto-js/mode-ecb'
import padPkcs7 from 'crypto-js/pad-pkcs7'
import { getCryptoKey } from './key'
import type { CryptoMap } from '../types'

/**
 * AES加密
 * @param {string} str 需要加密的字符串
 * @returns {string} string 加密后的字符串
 */
export function AESEncrypt(str: string) {
  const key = getCryptoKey()
  if (key === undefined) {
    throw new Error("请先设置加密key 或 define '__CRYPTO_KEY__'")
  }
  return AES.encrypt(encUTF8.parse(str), key, {
    mode: modeECB,
    padding: padPkcs7,
  }).toString()
}

/**
 * AES解密
 * @param {string} str 需要解密的字符串
 * @returns {string} string 解密后的字符串
 */
export function AESDecrypt(str: string) {
  const key = getCryptoKey()
  if (key === undefined) {
    throw new Error("请先设置加密key 或 define '__CRYPTO_KEY__'")
  }
  return encUTF8
    .stringify(
      AES.decrypt(str, key, {
        mode: modeECB,
        padding: padPkcs7,
      })
    )
    .toString()
}

/**
 * AES加密解密
 */
export const aes: CryptoMap = {
  encrypt: AESEncrypt,
  decrypt: AESDecrypt,
}
