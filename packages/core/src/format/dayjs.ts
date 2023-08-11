import type { ConfigType, Dayjs } from 'dayjs/esm'
import dayjs from 'dayjs/esm/index.js'
import localeData from 'dayjs/esm/plugin/localeData/index.js'
import duration from 'dayjs/esm/plugin/duration/index.js'
import relativeTime from 'dayjs/esm/plugin/relativeTime/index.js'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index.js'
import objectSupport from 'dayjs/esm/plugin/objectSupport/index.js'
import zhCN from 'dayjs/esm/locale/zh-cn/index.js'
import { isDef } from '../validate'

dayjs.extend(localeData).locale('zh-cn', zhCN)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(objectSupport)

export { dayjs, Dayjs }

/**
 * 格式化时间
 * @param {import('dayjs/esm').ConfigType} date 时间
 * @param {string} format 格式
 * @returns {string} 格式化后的时间
 */
export const dateFmt = (date: ConfigType, format: string | 'date' | 'datetime' = 'YYYY-MM-DD HH:mm:ss'): string => {
  const dd = dayjs(date)
  let fmt = format
  if (!isDef(date) || !dd.isValid()) return ''
  if (format === 'date') fmt = 'YYYY-MM-DD'
  if (format === 'datetime') fmt = 'YYYY-MM-DD HH:mm:ss'

  return dd.format(fmt)
}

/**
 * 格式化时间间隔
 * @param {import('dayjs/esm').ConfigType} start 开始时间
 * @param {import('dayjs/esm').ConfigType} end 结束时间
 */
export const dateDuration = (start: ConfigType, end: ConfigType) => {
  const startDay = dayjs(start)
  const endDay = dayjs(end)
  if (!isDef(start) || !startDay.isValid() || !isDef(end) || !endDay.isValid()) return ''

  const dd = dayjs.duration(endDay.diff(startDay))

  const year = dd.years()
  const month = dd.months()
  const day = dd.days()
  const format = [
    year === 0 ? '' : 'Y年',
    month === 0 ? '' : 'M个月',
    day === 0 ? '' : `${day < 10 && (year !== 0 || month !== 0) ? '零' : ''}D天`,
  ].join('')

  return dd.format(format)
}
