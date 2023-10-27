import { jLog } from './log-common'

let prevValue: any

/**
 * 不连续打印相同的值
 * @param args
 */
export const jLogDedupe = (...args: any[]) => {
  if (args.length === 0) return
  if (args.length > 0 && prevValue && JSON.stringify(args) === JSON.stringify(prevValue)) return
  jLog(...args)
  prevValue = args
}
