import MD5 from 'crypto-js/md5'

/**
 * MD5加密
 * @param str
 * @class
 */
export function MD5Encrypt(str: string) {
  return MD5(str).toString()
}
