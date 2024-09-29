import type { PageRes, PageResData, Res } from '@jhqn/utils-core'
import type { http, StrictResponse } from 'msw'
import type { MaybeFn } from '../types'
import { isNumber } from '@jhqn/utils-core'
import { fakeIntRange } from '@jhqn/utils-faker'
import { delay, HttpResponse } from 'msw'

export const getMockData = <T>(data: T, code = 200, message = 'success'): Res<T> => {
  return { data, code, message }
}

export const getMockDataList = <T>(
  data: T[],
  total: number,
  code = 200,
  message = 'success',
  options: Partial<PageResData<T>> = {}
): PageRes<T> => {
  return { data: { records: data, list: data, total, ...options }, code, message } as PageRes<T>
}

const randomDelay = () => delay(fakeIntRange(100, 1000))

const fnRes = <T>(fn: MaybeFn<T>) => (fn instanceof Function ? fn() : fn)

export const commonRes: <T>(fn: MaybeFn<T>) => Promise<StrictResponse<Res<T>>> = async fn => {
  await randomDelay()
  return HttpResponse.json(getMockData(fnRes(fn)))
}

export const commonArrRes: <T>(
  fn: MaybeFn<T>,
  range: [min: number, max: number] | number
) => Promise<StrictResponse<Res<T[]>>> = async (fn, range) => {
  await randomDelay()
  return HttpResponse.json(
    getMockData(Array.from({ length: isNumber(range) ? range : fakeIntRange(range[0], range[1]) }, () => fnRes(fn)))
  )
}

export const commonPageRes: <T>(
  fn: MaybeFn<T>,
  resolver: Parameters<Parameters<typeof http.get>[1]>[0],
  total?: number
) => Promise<StrictResponse<PageRes<T>>> = async (fn, resolver, total = 42) => {
  await randomDelay()
  const url = new URL(resolver.request.url)
  const page = Number(url.searchParams.get('page'))
  const count = Number(url.searchParams.get('count'))
  let len = count
  if (page * count > total) {
    len = total - (page - 1) * count
  }
  const data = Array.from({ length: len }, () => fnRes(fn))
  const pages = count === 0 ? 0 : Math.ceil(total / count)
  return HttpResponse.json(
    getMockDataList(data, total, 200, 'success', { current: page, pages, size: count, searchCount: false })
  )
}
