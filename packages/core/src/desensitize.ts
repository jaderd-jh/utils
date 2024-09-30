import type { UnDef } from '../types'
import { isDef, isIdCard, isPhone, isTel } from './validate'

/**
 * 隐藏中间部分
 * @param {string} str 需要隐藏的字符串
 */
export const hideMiddle = (str: UnDef<string>) => {
  if (!isDef(str)) return ''
  const len = str.length
  if (len === 0) return ''
  if (len === 1) return '*'
  if (len === 2) return '**'
  return str[0] + '*'.repeat(len - 2) + str[len - 1]
}

/**
 * 隐藏首尾仅保留中间3分之1
 * @param {string} str 需要隐藏的字符串
 */
export const hideThird = (str: UnDef<string>) => {
  if (!isDef(str)) return ''
  const len = str.length
  const partLen = Math.round(len / 3)
  if (len === 1) return '*'
  if (len === 2) return '**'
  return str.slice(0, partLen) + '*'.repeat(len - 2 * partLen) + str.slice(len - partLen)
}

/**
 * 隐藏首部
 * @param {string} str 需要隐藏的字符串
 * @param {number} count 隐藏的字符数
 */
export const hideHead = (str: UnDef<string>, count?: number) => {
  if (!isDef(str)) return ''
  const len = str.length
  const cnt = count !== undefined ? Math.max(Math.min(len, count), 0) : len - 1
  if (len === 0) return ''
  if (len === 1) return '*'
  return '*'.repeat(cnt) + str.substring(cnt)
}

/**
 * 隐藏尾部
 * @param {string} str 需要隐藏的字符串
 * @param {number} count 隐藏的字符数
 */
export const hideTail = (str: UnDef<string>, count?: number) => {
  if (!isDef(str)) return ''
  const len = str.length
  const cnt = count !== undefined ? Math.max(Math.min(len, count), 0) : len - 1
  if (len === 0) return ''
  if (len === 1) return '*'
  return str.substring(0, len - cnt) + '*'.repeat(cnt)
}

/**
 * 隐藏手机号
 * @param {string} phone 手机号
 */
export const hidePhone = (phone: UnDef<string>) => {
  if (phone) {
    if (isPhone(phone)) {
      return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    if (isTel(phone)) {
      // eslint-disable-next-line regexp/no-misleading-capturing-group
      return phone.replace(/^(\d{3,4})-?\d{3,4}(\d{4})$/, '$1****$2')
    }
    return phone
  }
  return ''
}

/**
 * 隐藏身份证号
 * @param {string} cardNo 身份证号
 * @param {boolean} strong 是否强化隐藏
 */
export const hideCardNo = (cardNo: UnDef<string>, strong = true) => {
  if (cardNo) {
    if (isIdCard(cardNo, false)) {
      return strong ? hideMiddle(cardNo) : cardNo.replace(/^(.)\d{3}(.{8})\d{5}(.)$/, '$1***$2*****$3')
    }
    return cardNo
  }
  return ''
}

/**
 * 隐藏姓名第一个字
 * @param {string} name 姓名
 * @deprecated 请使用 hideSurname
 */
export const hideName = (name: UnDef<string>) => {
  if (name) {
    let res = ''
    for (let i = 0; i < name.length; i += 1) {
      if (i === 0) {
        res += '*'
      } else {
        res += name[i]
      }
    }
    return res
  }
  return ''
}

/**
 * 隐藏姓氏
 * @param {string} name 姓名
 */
export const hideSurname = (name: UnDef<string>) => {
  return hideHead(name, 1)
}

/**
 * 隐藏名字
 * @param {string} name 姓名
 */
export const hideFirstName = (name: UnDef<string>) => {
  return hideTail(name)
}

/**
 * 隐藏邮箱
 * @param {string} email 邮箱
 */
export const hideEmail = (email: UnDef<string>) => {
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
 */
export const hideBankCard = (bankCard: UnDef<string>) => {
  if (bankCard) {
    const len = bankCard.length
    if (len <= 10) return bankCard
    return bankCard.substring(0, 6) + '*'.repeat(len - 10) + bankCard.substring(len - 4, len)
  }
  return ''
}
