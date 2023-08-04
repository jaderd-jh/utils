import type { ConfigType } from 'dayjs/esm'
import dayjs from 'dayjs/esm'
import localeData from 'dayjs/esm/plugin/localeData'
import duration from 'dayjs/esm/plugin/duration'
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat'
import objectSupport from 'dayjs/esm/plugin/objectSupport'
import zhCN from 'dayjs/esm/locale/zh-cn'

dayjs.extend(localeData).locale('zh-cn', zhCN)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(objectSupport)

export { dayjs }

/**
 * 格式化时间
 * @param {import('dayjs/esm').ConfigType} date 时间
 * @param {string} format 格式
 * @returns {string} 格式化后的时间
 */
export const dateFmt = (date: ConfigType, format: string | 'date' | 'datetime' = 'YYYY-MM-DD HH:mm:ss'): string => {
  let fmt = format
  if (!date) return ''
  if (format === 'date') fmt = 'YYYY-MM-DD'
  if (format === 'datetime') fmt = 'YYYY-MM-DD HH:mm:ss'

  return dayjs(date).format(fmt)
}

/**
 * 格式化时间间隔
 * @param {import('dayjs/esm').ConfigType} start 开始时间
 * @param {import('dayjs/esm').ConfigType} end 结束时间
 */
export const dateDuration = (start: ConfigType, end: ConfigType) => {
  if (!start || !end) return ''

  const dd = dayjs.duration(dayjs(end).diff(dayjs(start)))

  return dd.format(`${dd.years() === 0 ? '' : 'Y年'}${dd.months() === 0 ? '' : 'M个月'}${dd.days() === 0 ? '' : 'D天'}`)
}
