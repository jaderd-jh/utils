import type { CryptoMap } from '../types'
import { md5 as md5Hash } from '@noble/hashes/legacy.js'
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js'

/**
 * MD5加密
 * @param str
 * @class
 */
export function MD5Encrypt(str: string) {
  return bytesToHex(md5Hash(utf8ToBytes(str)))
}

export const md5: CryptoMap = {
  encrypt: MD5Encrypt,
  decrypt: () => {
    throw new Error('MD5 is not a decryptable algorithm')
  },
}
