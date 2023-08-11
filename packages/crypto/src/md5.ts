import MD5 from 'crypto-js/md5.js'
import type { CryptoMap } from '../types'

/**
 * MD5加密
 * @param str
 * @class
 */
export function MD5Encrypt(str: string) {
  return MD5(str).toString()
}

export const md5: CryptoMap = {
  encrypt: MD5Encrypt,
  decrypt: () => {
    throw new Error('MD5 is not a decryptable algorithm')
  },
}
