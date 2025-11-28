import type { PageRes, Res } from '@jhqn/utils-core'
import type { http } from 'msw'
import type { MaybeFn } from '../types'
import { getMockData, getMockDataList, isNumber } from '@jhqn/utils-core'
import { fakeIntRange } from '@jhqn/utils-faker'
import { delay, HttpResponse } from 'msw'

const randomDelay = () => delay(fakeIntRange(100, 1000))

const fnRes = <T>(fn: MaybeFn<T>) => (fn instanceof Function ? fn() : fn)

export const commonRes: <T>(fn: MaybeFn<T>) => Promise<HttpResponse<Res<T>>> = /* #__PURE__ */ async fn => {
  await randomDelay()
  return HttpResponse.json(getMockData(fnRes(fn)))
}

export const commonArrRes: <T>(
  fn: MaybeFn<T>,
  range: [min: number, max: number] | number
) => Promise<HttpResponse<Res<T[]>>> = /* #__PURE__ */ async (fn, range) => {
  await randomDelay()
  return HttpResponse.json(
    getMockData(Array.from({ length: isNumber(range) ? range : fakeIntRange(range[0], range[1]) }, () => fnRes(fn)))
  )
}

export const commonPageRes: <T>(
  fn: MaybeFn<T>,
  resolver: Parameters<Parameters<typeof http.get>[1]>[0],
  total?: number
) => Promise<HttpResponse<PageRes<T>>> = /* #__PURE__ */ async (fn, resolver, total = 42) => {
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
