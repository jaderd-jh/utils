import { isDef } from './core'
import type { PageRes, Res } from '../../types'

/**
 * 校验接口返回code
 * @param res
 * @param code
 */
export const isValidResCode = (res: Res, code = 200) => res.code === code

/**
 * 校验接口返回内容
 * @param res
 * @param code
 */
export const isValidRes = (res: Res, code?: number) => isValidResCode(res, code) && isDef(res.data)

/**
 * 校验接口数组返回内容
 * @param res
 * @param code
 */
export const isValidArrRes = (res: Res<any[]>, code?: number) => isValidResCode(res, code) && Array.isArray(res.data)

/**
 * 校验接口分页返回内容
 * @param res
 * @param code
 */
export const isValidPageRes = (res: PageRes, code?: number) =>
  isValidResCode(res, code) && isDef(res.data) && Array.isArray(res.data.list || res.data.records)
