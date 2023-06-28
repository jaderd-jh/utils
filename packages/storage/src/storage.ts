import { aes } from '@jhqn/utils-crypto'
import { parseToJSON, replacer, reviver } from '@jhqn/utils-core'
import type { StorageObj } from '../types'

/**
 * 判断当前类型是否是Symbol
 * @param val 需要判断的值
 * @returns 当前参数是否是symbol
 */
function isSymbol(val: any): boolean {
  return typeof val === 'symbol'
}

/**
 * 判断当前值是否能够呗JSON.stringify识别
 * @param data 需要判断的值
 * @returns 前参数是否可以string化
 */
function hasStringify(data: any): boolean {
  if (data === undefined) {
    return false
  }

  if (data instanceof Function) {
    return false
  }

  if (data instanceof Date) {
    return false
  }

  return !isSymbol(data)
}

/**
 * 用于存储的带时间戳的序列化方法
 * @param {any} data 需要序列化的数据
 * @returns {string} 返回序列化后的字符串
 */
export function storageStringify(data: any): string {
  const saveData: StorageObj = {
    expires: new Date().getTime(),
    data,
  }
  return JSON.stringify(saveData, replacer)
}

/**
 * 用于存储的反序列化方法
 * @param {string} data 需要反序列化的字符串
 * @returns {StorageObj} 返回反序列化后的数据
 */
export function storageParse<T>(data: string): StorageObj<T> | null {
  return parseToJSON<StorageObj<T>>(data, reviver)
}

/**
 * 判断存储中是否已经存在
 * @param key
 * @param storage
 */
export function hasStorage(storage: Storage, key: string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return Object.hasOwn(storage, key) || storage.hasOwnProperty(key)
}

/**
 * 判断存储中是否已经存在
 * @param key
 */
export const hasLocal = (key: string) => hasStorage(localStorage, key)

/**
 * 判断存储中是否已经存在
 * @param key
 */
export const hasSession = (key: string) => hasStorage(sessionStorage, key)

/**
 * 移除数据
 * @param key
 * @param storage
 */
export function removeStorage(storage: Storage, key: string) {
  if (hasStorage(storage, key)) storage.removeItem(key)
}

/**
 * 移除数据
 * @param regex
 * @param storage
 */
export function removeStorageAll(storage: Storage, regex?: RegExp) {
  if (!regex) {
    storage.clear()
    return
  }
  const keys = Object.keys(storage)
  keys.forEach(key => {
    if (regex.test(key)) {
      storage.removeItem(key)
    }
  })
}

/**
 * 移除数据
 * @param key
 */
export const removeLocal = (key: string) => removeStorage(localStorage, key)

/**
 * 移除数据
 * @param regex
 */
export const removeLocalAll = (regex?: RegExp) => removeStorageAll(localStorage, regex)

/**
 * 移除数据
 * @param key
 */
export const removeSession = (key: string) => removeStorage(sessionStorage, key)

/**
 * 移除数据
 * @param regex
 */
export const removeSessionAll = (regex?: RegExp) => removeStorageAll(sessionStorage, regex)

/**
 * 设置数据
 * @param storage
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 */
export function setStorage(storage: Storage, key: string, value: any, config?: { crypto?: boolean }) {
  if (hasStringify(value)) {
    const rawData = storageStringify(value)
    storage.setItem(key, config?.crypto ? aes.encrypt(rawData) : rawData)
  } else {
    throw new Error('需要存储的 data 不支持 JSON.stringify 方法，请检查当前数据')
  }
}

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 */
export const setLocal = (key: string, value: any, config?: { crypto?: boolean }) =>
  setStorage(localStorage, key, value, config)

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param config
 * @param config.crypto 是否使用加密算法
 */
export const setSession = (key: string, value: any, config?: { crypto?: boolean }) =>
  setStorage(sessionStorage, key, value, config)

/**
 * 获取数据
 * @param storage
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.expires expires 过期时间 ms
 * @param config.crypto crypto 是否使用解密算法
 * @returns 存储数据
 */
export function getStorage<T = any>(
  storage: Storage,
  key: string,
  config: { expires?: number; crypto?: boolean } = { crypto: false, expires: undefined }
): T | null {
  let content: StorageObj<T> | null
  if (hasStorage(storage, key)) {
    content = storageParse<T>(config.crypto ? aes.decrypt(<string>storage.getItem(key)) : <string>storage.getItem(key))
    if (config.expires && content && new Date().getTime() - content.expires >= config.expires) {
      removeStorage(storage, key)
      content = null
    }
  } else {
    content = null
  }
  return content && content?.data !== undefined ? content.data : null
}

/**
 * 获取数据
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.expires expires 过期时间 ms
 * @param config.crypto crypto 是否使用解密算法
 * @returns 存储数据
 */
export const getLocal = <T = any>(
  key: string,
  config: { expires?: number; crypto?: boolean } = { crypto: false, expires: undefined }
) => getStorage<T>(localStorage, key, config)

/**
 * 获取数据
 * @param {string} key 获取当前数据key
 * @param config
 * @param config.expires expires 过期时间 ms
 * @param config.crypto crypto 是否使用解密算法
 * @returns 存储数据
 */
export const getSession = <T = any>(
  key: string,
  config: { expires?: number; crypto?: boolean } = { crypto: false, expires: undefined }
) => getStorage<T>(sessionStorage, key, config)
