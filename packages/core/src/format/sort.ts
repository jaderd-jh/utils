import type { Numeric, UnDef } from '../../types'
import { isDef } from '../validate'

/**
 * 判断是否为数字数组
 * @param {UnDef<string>[] | UnDef<number>[]} arr - 数字或字符串数组
 * @returns {boolean} - 是否为数字数组
 */
const isNumberArray = (arr: UnDef<string>[] | UnDef<number>[]): arr is number[] =>
  arr.every(item => typeof item === 'number')

/**
 * 判断是否为字符串数组
 * @param {UnDef<string>[] | UnDef<number>[]} arr - 数字或字符串数组
 * @returns {boolean} - 是否为字符串数组
 */
const isStringArray = (arr: UnDef<string>[] | UnDef<number>[]): arr is string[] =>
  arr.every(item => typeof item === 'string')

/**
 * 自然排序
 * @param {UnDef<string>[] | UnDef<number>[]} arr - 数字或字符串数组
 * @returns {UnDef<string>[] | UnDef<number>[]} - 排序后的数组
 */
export const naturalSort = (arr: UnDef<string>[] | UnDef<number>[]): UnDef<string>[] | UnDef<number>[] => {
  if (isNumberArray(arr)) return [...arr].sort((a, b) => a - b)
  if (isStringArray(arr)) {
    return [...arr].sort((a, b) => a.localeCompare(b, 'zh-CN')).sort((a, b) => a.length - b.length)
  }
  const newArr = [...arr].sort()
  const validArr = newArr.filter(a => isDef(a)) as string[] | number[]
  const invalidArr = newArr.filter(a => !isDef(a)) as (null | undefined)[]
  // @ts-expect-error ...
  return naturalSort(validArr as UnDef<string>[] | UnDef<number>[]).concat(invalidArr)
}

/**
 * 根据 key 自然排序
 * @param arr - 数组
 * @param {string} key - 键名
 * @returns {any[]} - 排序后的数组
 */
export const naturalSortBy = <T extends Record<string, UnDef<Numeric>>>(arr: T[], key: keyof T): T[] => {
  // @ts-expect-error ...
  return [...arr].sort((a, b) => (naturalSort([a[key], b[key]])[0] === a[key] ? -1 : 1))
}
