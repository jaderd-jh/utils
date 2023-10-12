/**
 * 数字或字符串
 */
export declare type Numeric = number | string

/**
 * 可 Null
 */
export declare type Nullable<T> = T | null

/**
 * 可 Undefined
 */
export declare type Undefinable<T> = T | undefined

/**
 * 可 Null 或 Undefined
 */
export declare type NullOrUndefinable<T> = Nullable<Undefinable<T>>

/**
 * alias for NullOrUndefinable
 */
export declare type UnDef<T> = NullOrUndefinable<T>

/**
 * 请求结果
 */
export declare type Res<T = any> = Service.Response<T>

/**
 * 分页请求结果数据
 */
export declare type PageResData<T = any> = Service.PageResponseData<T>

/**
 * 分页请求结果
 */
export declare type PageRes<T = any> = Service.PageResponse<T>

/**
 * 可能是数组
 */
export declare type MaybeArray<T = any> = T | Array<T>

export * from './upload'
