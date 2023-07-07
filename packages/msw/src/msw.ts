import type { MockedResponse, ResponseFunction, rest } from 'msw'
import { context, createResponseComposition } from 'msw'
import { fakeIntRange } from '@jhqn/utils-faker'
import type { MaybeFn } from '../types'

export const getMockData = <T>(data: T, code = 200, message = 'success') => {
  return { data, code, message }
}

export const getMockDataList = <T>(data: T[], total: number, code = 200, message = 'success') => {
  return { data: { records: data, total }, code, message }
}

export const commonSuccessDelayedRes: ResponseFunction = createResponseComposition({}, [
  context.status(200),
  context.delay(fakeIntRange(100, 1000)),
])

const fnRes = <T>(fn: MaybeFn<T>) => (fn instanceof Function ? fn() : fn)

export const commonRes: <T>(
  fn: MaybeFn<T>,
  ...args: Parameters<Parameters<typeof rest.get | typeof rest.post | typeof rest.put | typeof rest.delete>[1]>
) => Promise<MockedResponse<any>> | MockedResponse<any> = (fn, ...args) =>
  commonSuccessDelayedRes(args[2].json(getMockData(fnRes(fn))))

export const commonArrRes: <T>(
  fn: MaybeFn<T>,
  range: [min: number, max: number],
  ...args: Parameters<Parameters<typeof rest.get | typeof rest.post | typeof rest.put | typeof rest.delete>[1]>
) => Promise<MockedResponse<any>> | MockedResponse<any> = (fn, range, ...args) =>
  commonSuccessDelayedRes(
    args[2].json(getMockData(Array.from({ length: fakeIntRange(range[0], range[1]) }, () => fnRes(fn))))
  )

export const commonPageRes: <T>(
  fn: MaybeFn<T>,
  ...args: Parameters<Parameters<typeof rest.get>[1]>
) => Promise<MockedResponse<any>> | MockedResponse<any> = (fn, ...args) => {
  const total = 45
  const page = Number(args[0].url.searchParams.get('page'))
  const count = Number(args[0].url.searchParams.get('count'))
  let len = count
  if (page * count > total) {
    len = total - (page - 1) * count
  }
  const data = Array.from({ length: len }, () => fnRes(fn))
  return commonSuccessDelayedRes(args[2].json(getMockDataList(data, total)))
}
