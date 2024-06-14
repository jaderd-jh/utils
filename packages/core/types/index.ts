/**
 * 数字或字符串
 */
export type Numeric = number | string

/**
 * 可 Null
 */
export type Nullable<T> = T | null

/**
 * 可 Undefined
 */
export type Undefinable<T> = T | undefined

/**
 * 可 Null 或 Undefined
 */
export type NullOrUndefinable<T> = Nullable<Undefinable<T>>

/**
 * alias for NullOrUndefinable
 */
export type UnDef<T> = NullOrUndefinable<T>

/**
 * 请求结果
 */
export type Res<T = any> = Service.Response<T>

/**
 * 分页请求结果数据
 */
export type PageResData<T = any> = Service.PageResponseData<T>

/**
 * 分页请求结果
 */
export type PageRes<T = any> = Service.PageResponse<T>

/**
 * 分页请求参数
 */
export type PageReq<T extends Record<string, any> = NonNullable<unknown>> = Service.PageRequestParams<T>

/**
 * 可能是数组
 */
export type MaybeArray<T = any> = T | Array<T>

/**
 * 枚举键值对
 */
export type VK<T = string> = Record<string | number, T>

/**
 * 字典
 */
export type Dict<T = string> = Record<string, T>

/**
 * 使某键可选
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
