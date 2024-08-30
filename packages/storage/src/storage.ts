import { aes } from '@jhqn/utils-crypto/aes'
import { type Nullable, isFunction, isSymbol, isUndefined } from '@jhqn/utils-core'
import { parseToJSON, replacer, reviver } from '@jhqn/utils-core'
import type { StorageConfig, StorageObj } from '../types'
import { STORAGE_EVENT_NAME, STORAGE_VERSION } from './const'

export { aes }

/**
 * 触发自定义 storage 事件
 * @param {CustomEvent<Partial<StorageEvent>>['detail']} detail - 自定义事件参数
 */
export function dispatchCustomStorageEvent(detail: CustomEvent<Partial<StorageEvent>>['detail']) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<Partial<StorageEvent>>(STORAGE_EVENT_NAME, { detail }))
  }
}

/**
 * 判断当前值是否能够被 JSON.stringify() 方法序列化
 * @param data 需要判断的值
 * @returns 当前参数是否可以序列化
 */
function serializable(data: any): boolean {
  return !(isSymbol(data) || isFunction(data) || isUndefined(data))
}

/**
 * 用于存储的带时间戳的序列化方法
 * @param {any} data 需要序列化的数据
 * @param {number} expires 过期时间 ms
 * @returns {string} 返回序列化后的字符串
 */
export function storageStringify(data: any, expires?: number): string {
  const saveData: StorageObj = {
    version: STORAGE_VERSION,
    expires: Date.now() + +(expires || 0), // 当前时间 + 过期时间间隔 = 过期时间
    data,
  }
  return JSON.stringify(saveData, replacer)
}

/**
 * 用于存储的反序列化方法
 * @param {string} data 需要反序列化的字符串
 * @returns {StorageObj} 返回反序列化后的数据
 */
export function storageParse<T>(data: string): Nullable<StorageObj<T>> {
  return parseToJSON<StorageObj<T>>(data, reviver)
}

/**
 * 判断存储中是否已经存在
 * @param storage
 * @param key
 */
export function hasStorage(storage: Storage, key: string): boolean {
  return storage.getItem(key) !== null
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
 * @param storage
 * @param key
 */
export function removeStorage(storage: Storage, key: string) {
  storage.removeItem(key)
}

/**
 * 移除数据
 * @param storage
 * @param regex
 */
export function removeStorageAll(storage: Storage, regex?: RegExp) {
  Object.getOwnPropertyNames(storage).forEach(key => {
    if (regex ? regex.test(key) : true) {
      removeStorage(storage, key)
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
 * @param {StorageConfig} config - 存储配置
 */
export function setStorage<T = any>(storage: Storage, key: string, value: T, config: StorageConfig = {}) {
  if (serializable(value)) {
    const rawData = storageStringify(value, config?.expires)
    storage.setItem(key, config?.crypto ? aes.encrypt(rawData) : rawData)
  } else {
    throw new TypeError('待写入数据不支持 JSON.stringify()', { cause: value })
  }
}

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setLocal = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(localStorage, key, value, config)

/**
 * 设置数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setSession = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(sessionStorage, key, value, config)

/**
 * 获取数据
 * @param storage
 * @param {string} key 获取当前数据key
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export function getStorage<T = any>(
  storage: Storage,
  key: string,
  config: StorageConfig = { crypto: false }
): Nullable<T> {
  let content: Nullable<StorageObj<T>> = null
  if (hasStorage(storage, key)) {
    content = storageParse<T>(config.crypto ? aes.decrypt(<string>storage.getItem(key)) : <string>storage.getItem(key))
    if (content) {
      // 配置了过期时间并且数据过期了
      if (config.expires && Date.now() - content.expires >= 0) {
        content = null
      }
      // 数据格式版本不一致
      if (content?.version !== STORAGE_VERSION) {
        content = null
      }
    }
  }
  return content && !isUndefined(content?.data) ? content.data : null
}

/**
 * 获取数据
 * @param {string} key 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getLocal = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(localStorage, key, config)

/**
 * 获取数据
 * @param {string} key - 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getSession = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(sessionStorage, key, config)
