import { jLog } from './log-common'

let logged = false

/**
 * 只打印一次
 * @param args
 */
export const jLogOnce = (...args: any[]) => {
  if (logged) return
  jLog(...args)
  logged = true
}
