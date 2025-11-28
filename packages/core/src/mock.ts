import type { PageRes, PageResData, Res } from '../types'

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
