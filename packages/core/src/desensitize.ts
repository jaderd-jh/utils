import type { UnDef } from '../types'
import { cnTelRE, cnTelRE2, isDef, isIdCard, isPhone } from './validate'

/**
 * 隐藏中间部分
 * @param {string} str 需要隐藏的字符串
 * @returns {string} 隐藏后的字符串
 * @example
 * ```ts
 * hideMiddle('A') // '*'
 * hideMiddle('AB') // '**'
 * hideMiddle('ABC') // 'A*C'
 * hideMiddle('ABCD') // 'A**D'
 * hideMiddle('ABCDE') // 'A***E'
 * ```
 */
export const hideMiddle = (str: UnDef<string>): string => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len <= 2) return '*'.repeat(len)
  return str[0] + '*'.repeat(len - 2) + str[len - 1]
}

/**
 * 隐藏首尾仅保留中间3分之1
 * @param {string} str 需要隐藏的字符串
 * @returns {string} 隐藏后的字符串
 * @example
 * ```ts
 * hideThird('A') // '*'
 * hideThird('AB') // '**'
 * hideThird('ABC') // 'A*C'
 * hideThird('ABCD') // 'A**D'
 * hideThird('ABCDE') // 'AB*DE'
 * ```
 */
export const hideThird = (str: UnDef<string>): string => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len <= 2) return '*'.repeat(len)
  const partLen = Math.round(len / 3)
  return str.slice(0, partLen) + '*'.repeat(len - 2 * partLen) + str.slice(len - partLen)
}

/**
 * 隐藏首部
 * @param {string} str 需要隐藏的字符串
 * @param {number} count 隐藏的字符数
 * @returns {string} 隐藏后的字符串
 * @example
 * ```ts
 * hideHead('A') // '*'
 * hideHead('AB') // '*B'
 * hideHead('ABC') // '**C'
 * hideHead('ABC', 1) // '*BC'
 * ```
 */
export const hideHead = (str: UnDef<string>, count?: number): string => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len <= 1) return '*'.repeat(len)
  const cnt = count !== undefined ? Math.max(Math.min(len, count), 0) : len - 1
  return '*'.repeat(cnt) + str.substring(cnt)
}

/**
 * 隐藏尾部
 * @param {string} str 需要隐藏的字符串
 * @param {number} count 隐藏的字符数
 * @returns {string} 隐藏后的字符串
 * @example
 * ```ts
 * hideTail('A') // '*'
 * hideTail('AB') // 'A*'
 * hideTail('ABC') // 'A**'
 * hideTail('ABC', 1) // 'AB*'
 * ```
 */
export const hideTail = (str: UnDef<string>, count?: number): string => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len <= 1) return '*'.repeat(len)
  const cnt = count !== undefined ? Math.max(Math.min(len, count), 0) : len - 1
  return str.substring(0, len - cnt) + '*'.repeat(cnt)
}

/**
 * 隐藏手机号/座机号
 * @param {string} phone 手机号/座机号
 * @returns {string} 隐藏后的手机号/座机号
 * @example
 * ```ts
 * hidePhone('13800138000') // '138****8000'
 * hidePhone('010-12345678') // '010****5678'
 * hidePhone('(010)12345678') // '(010)****5678'
 * ```
 */
export const hidePhone = (phone: UnDef<string>): string => {
  if (phone) {
    const phoneStr = phone.replaceAll(' ', '') // remove all blanks
    if (isPhone(phoneStr)) {
      return phoneStr.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    if (cnTelRE.test(phoneStr)) {
      // eslint-disable-next-line regexp/no-misleading-capturing-group
      return phoneStr.replace(/^(0\d{2,3})-?\d{3,4}(\d{4})$/, '$1****$2')
    }
    if (cnTelRE2.test(phoneStr)) {
      return phoneStr.replace(/^\((0\d{2,3})\)\d{3,4}(\d{4})$/, '$1****$2')
    }
    return phone
  }
  return ''
}

/**
 * 隐藏身份证号
 * @param {string} cardNo 身份证号
 * @param {boolean} strong 是否强化隐藏
 * @returns {string} 隐藏后的身份证号
 * @example
 * ```ts
 * hideCardNo('33072319641008384x') // '3****************x'
 * hideCardNo('33072319641008384x', false) // '3***23196410*****x'
 * ```
 */
export const hideCardNo = (cardNo: UnDef<string>, strong: boolean = true): string => {
  if (cardNo) {
    if (isIdCard(cardNo, false)) {
      return strong ? hideMiddle(cardNo) : cardNo.replace(/^(.)\d{3}(.{8})\d{5}(.)$/, '$1***$2*****$3')
    }
    return cardNo
  }
  return ''
}

/**
 * 隐藏姓氏
 * @param {string} name 姓名
 * @returns {string} 隐藏后的姓名
 * @example
 * ```ts
 * hideSurname('张三') // '*三'
 * hideSurname('司马懿') // '*马懿'
 * ```
 */
export const hideSurname = (name: UnDef<string>): string => {
  return hideHead(name, 1)
}

/**
 * 隐藏名字
 * @param {string} name 姓名
 * @returns {string} 隐藏后的姓名
 * @example
 * ```ts
 * hideFirstName('张三') // '张*'
 * hideFirstName('司马懿') // '司马*'
 * ```
 */
export const hideFirstName = (name: UnDef<string>): string => {
  return hideTail(name)
}

/**
 * 隐藏邮箱
 * @param {string} email 邮箱
 * @returns {string} 隐藏后的邮箱
 * @example
 * ```ts
 * hideEmail('example@hotmail.com') // 'exam***@hotmail.com'
 * ```
 */
export const hideEmail = (email: UnDef<string>): string => {
  if (email) {
    if (!email.includes('@')) return email

    const arr = email.split('@')
    const name = arr[0]
    const domain = arr[1]

    if (!name || !domain) return email

    const len = name.length

    let newName: string
    if (len <= 3) {
      newName = `${name}***`
    } else {
      newName = hideTail(name, 3)
    }

    return `${newName}@${domain}`
  }
  return ''
}

/**
 * 隐藏银行卡号
 * @param {string} bankCard 银行卡号
 * @returns {string} 隐藏后的银行卡号
 * @example
 * ```ts
 * hideBankCard('6222021001123456789') // '622202********6789'
 * ```
 */
export const hideBankCard = (bankCard: UnDef<string>): string => {
  if (bankCard) {
    const len = bankCard.length
    if (len <= 10) return bankCard
    return bankCard.substring(0, 6) + '*'.repeat(len - 10) + bankCard.substring(len - 4, len)
  }
  return ''
}
