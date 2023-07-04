declare namespace Service {
  /** 响应 */
  interface Response<T = any> {
    code: number
    data: T
    message: string
  }
  /**
   * 分页响应数据
   */
  interface PageResponseData<T = any> {
    current: number
    pages: number
    list: T[]
    records: T[]
    searchCount: boolean
    size: number
    total: number
  }
  /** 分页响应 */
  interface PageResponse<T = any> {
    code: number
    data: PageResponseData<T>
    message: string
  }
}
