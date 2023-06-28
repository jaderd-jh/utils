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
