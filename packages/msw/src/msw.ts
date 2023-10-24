import type { StrictResponse, http } from 'msw'
import { HttpResponse, delay } from 'msw'
import { fakeIntRange } from '@jhqn/utils-faker'
import type { PageRes, Res } from '@jhqn/utils-core'
import type { MaybeFn } from '../types'

export const getMockData = <T>(data: T, code = 200, message = 'success') => {
  return { data, code, message } as Res<T>
}

export const getMockDataList = <T>(data: T[], total: number, code = 200, message = 'success') => {
  return { data: { records: data, total }, code, message } as PageRes<T>
}

const randomDelay = () => delay(fakeIntRange(100, 1000))

const fnRes = <T>(fn: MaybeFn<T>) => (fn instanceof Function ? fn() : fn)

export const commonRes: <T>(fn: MaybeFn<T>) => Promise<StrictResponse<Res<T>>> = async fn => {
  await randomDelay()
  return HttpResponse.json(getMockData(fnRes(fn)))
}

export const commonArrRes: <T>(
  fn: MaybeFn<T>,
  range: [min: number, max: number]
) => Promise<StrictResponse<Res<T[]>>> = async (fn, range) => {
  await randomDelay()
  return HttpResponse.json(getMockData(Array.from({ length: fakeIntRange(range[0], range[1]) }, () => fnRes(fn))))
}

export const commonPageRes: <T>(
  fn: MaybeFn<T>,
  resolver: Parameters<Parameters<typeof http.get>[1]>[0]
) => Promise<StrictResponse<PageRes<T>>> = async (fn, resolver) => {
  await randomDelay()
  const total = 45
  const page = Number(resolver.params.page)
  const count = Number(resolver.params.count)
  let len = count
  if (page * count > total) {
    len = total - (page - 1) * count
  }
  const data = Array.from({ length: len }, () => fnRes(fn))
  return HttpResponse.json(getMockDataList(data, total))
}
