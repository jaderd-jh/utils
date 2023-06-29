import MD5 from 'crypto-js/md5'
import AES from 'crypto-js/aes'
import encUTF8 from 'crypto-js/enc-utf8'
import modeECB from 'crypto-js/mode-ecb'
import padPkcs7 from 'crypto-js/pad-pkcs7'

let KEY: CryptoJS.lib.WordArray

/**
 * 设置加密key
 * @param key
 */
export function setKey(key: string) {
  KEY = encUTF8.parse(key)
}

/**
 * MD5加密
 * @param str
 * @class
 */
export function MD5Encrypt(str: string) {
  return MD5(str).toString()
}

/**
 * AES加密
 * @param str
 * @class
 */
export function AESEncrypt(str: string) {
  if (KEY === undefined) {
    throw new Error('请先设置加密key')
  }
  return AES.encrypt(encUTF8.parse(str), KEY, {
    mode: modeECB,
    padding: padPkcs7,
  }).toString()
}

/**
 * AES解密
 * @param str
 * @class
 */
export function AESDecrypt(str: string) {
  if (KEY === undefined) {
    throw new Error('请先设置加密key')
  }
  return encUTF8
    .stringify(
      AES.decrypt(str, KEY, {
        mode: modeECB,
        padding: padPkcs7,
      })
    )
    .toString()
}

/**
 * AES加密解密
 */
export const aes = {
  encrypt: AESEncrypt,
  decrypt: AESDecrypt,
}
