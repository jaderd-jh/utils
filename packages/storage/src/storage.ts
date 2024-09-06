import {
  type Nullable,
  dayjs,
  isFunction,
  isSymbol,
  isUndefined,
  jWarn,
  parseToJSON,
  stringifyFromJSON,
} from '@jhqn/utils-core'
import { aes } from '@jhqn/utils-crypto/aes'
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
 * @param {any} data - 需要序列化的数据
 * @param {StorageConfig} [config] - 序列化配置
 * @returns {string} 序列化后的字符串
 */
export function storageStringify(data: any, config: StorageConfig = {}): string {
  const rawData: StorageObj = {
    data,
    expiresAt: config.expiresAt
      ? dayjs(config.expiresAt).valueOf() // 过期时间需大于当前时间
      : Date.now() + +(config.validTime || 0), // 当前时间 + 有效时间 = 过期时间
    version: STORAGE_VERSION,
  }
  if (config.expiresAt && dayjs(config.expiresAt).valueOf() < Date.now()) {
    jWarn('设置的过期时间小于当前时间，数据将立即过期', { expiresAt: config.expiresAt })
  }
  return config?.crypto ? aes.encrypt(stringifyFromJSON(rawData)) : stringifyFromJSON(rawData)
}

/**
 * 用于存储的反序列化方法
 * @template T - 反序列化后的数据类型
 * @param {string} dataStr - 需要反序列化的字符串
 * @param {StorageConfig} config - 存储配置项
 * @returns {T} 返回反序列化后的数据
 */
export function storageParse<T = any>(dataStr: string, config: StorageConfig = {}): Nullable<StorageObj<T>> {
  return parseToJSON<StorageObj<T>>(config.crypto ? aes.decrypt(dataStr) : dataStr)
}

/**
 * 验证数据是否有效
 * @template T - 数据类型
 * @param {Nullable<StorageObj<T>>} rawData - 需要验证的反序列化数据
 * @param {StorageConfig} config - 存储配置项
 * @returns {Nullable<T>} 返回验证后的数据
 */
export function validateData<T = any>(rawData: Nullable<StorageObj<T>>, config: StorageConfig = {}): Nullable<T> {
  let _rawData = rawData
  if (_rawData) {
    // 配置了过期时间或者有效时间 并且数据过期了
    if ((config.expiresAt || config.validTime) && Date.now() - _rawData.expiresAt >= 0) {
      _rawData = null
    }
    // 数据格式版本不一致
    if (rawData?.version !== STORAGE_VERSION) {
      _rawData = null
    }
  }
  return _rawData && !isUndefined(_rawData?.data) ? _rawData.data : null
}

/**
 * 判断Storage存储中是否已经存在
 * @param storage
 * @param key
 */
export function hasStorage(storage: Storage, key: string): boolean {
  return storage.getItem(key) !== null
}

/**
 * 判断localStorage存储中是否已经存在
 * @param key
 */
export const hasLocal = (key: string) => hasStorage(localStorage, key)

/**
 * 判断sessionStorage存储中是否已经存在
 * @param key
 */
export const hasSession = (key: string) => hasStorage(sessionStorage, key)

/**
 * 移除Storage数据
 * @param storage
 * @param key
 */
export function removeStorage(storage: Storage, key: string) {
  storage.removeItem(key)
}

/**
 * 移除全部Storage数据
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
 * 移除localStorage数据
 * @param key
 */
export const removeLocal = (key: string) => removeStorage(localStorage, key)

/**
 * 移除全部localStorage数据
 * @param regex
 */
export const removeLocalAll = (regex?: RegExp) => removeStorageAll(localStorage, regex)

/**
 * 移除sessionStorage数据
 * @param key
 */
export const removeSession = (key: string) => removeStorage(sessionStorage, key)

/**
 * 移除全部sessionStorage数据
 * @param regex
 */
export const removeSessionAll = (regex?: RegExp) => removeStorageAll(sessionStorage, regex)

/**
 * 设置Storage数据
 * @param storage
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export function setStorage<T = any>(storage: Storage, key: string, value: T, config: StorageConfig = {}) {
  if (serializable(value)) {
    storage.setItem(key, storageStringify(value, config))
  } else {
    throw new TypeError('待写入数据不支持 JSON.stringify()', { cause: value })
  }
}

/**
 * 设置localStorage数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setLocal = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(localStorage, key, value, config)

/**
 * 设置sessionStorage数据
 * @param {string} key 设置当前存储key
 * @param {any} value 设置当前存储value
 * @param {StorageConfig} config - 存储配置
 */
export const setSession = <T = any>(key: string, value: T, config?: StorageConfig) =>
  setStorage(sessionStorage, key, value, config)

/**
 * 获取Storage数据
 * @param storage
 * @param {string} key 获取当前数据key
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export function getStorage<T = any>(storage: Storage, key: string, config: StorageConfig = {}): Nullable<T> {
  return hasStorage(storage, key) ? validateData(storageParse<T>(<string>storage.getItem(key), config), config) : null
}

/**
 * 获取localStorage数据
 * @param {string} key 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getLocal = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(localStorage, key, config)

/**
 * 获取sessionStorage数据
 * @param {string} key - 当前数据键名
 * @param {StorageConfig} config - 存储配置
 * @returns 存储数据
 */
export const getSession = <T = any>(key: string, config?: StorageConfig) => getStorage<T>(sessionStorage, key, config)

/**
 * @class JadeStorage
 * @description JadeStorage 类
 */
export class JadeStorage<T> {
  private readonly storage: Storage
  private readonly key: string
  private readonly defaults: T
  private readonly options: StorageConfig

  /**
   * JadeStorage 构造函数
   * @param {Storage} storage - 存储对象
   * @param {string} key - 存储键值
   * @param {any} defaults - 默认值
   * @param {StorageConfig} options - 存储配置
   */
  constructor(storage: Storage, key: string, defaults: T, options: StorageConfig = {}) {
    this.storage = storage
    this.key = key
    this.defaults = defaults
    this.options = options
  }

  /**
   * 获取存储对象
   * @returns {Storage} 存储对象
   */
  getStorage() {
    return this.storage
  }

  /**
   * 获取存储键值
   * @returns {string} 存储键值
   */
  getKey() {
    return this.key
  }

  /**
   * 获取默认值
   * @template T - 默认值类型
   * @returns {T} 默认值
   */
  getDefaults() {
    return this.defaults
  }

  /**
   * 获取存储配置
   * @returns {StorageConfig} 存储配置
   */
  getOptions() {
    return this.options
  }

  /**
   * 获取存储数据
   * @template T - 存储数据类型
   * @returns {Nullable<T>} 存储数据
   */
  get() {
    return getStorage<T>(this.storage, this.key, this.options)
  }

  /**
   * 设置存储数据
   * @param {any} value - 存储数据
   * @returns {void}
   */
  set(value: any) {
    setStorage(this.storage, this.key, value, this.options)
  }

  /**
   * 移除存储数据
   * @returns {void}
   */
  remove() {
    removeStorage(this.storage, this.key)
  }

  /**
   * 重置存储数据
   * @returns {void}
   */
  reset() {
    setStorage(this.storage, this.key, this.defaults, this.options)
  }

  /**
   * 序列化存储数据
   * @param {any} data - 存储数据
   * @returns {string} 序列化后的字符串
   */
  stringify(data: any) {
    return storageStringify(data, this.options)
  }

  /**
   * 反序列化存储数据
   * @template T - 反序列化数据类型
   * @param {string} dataStr - 存储字符串
   * @returns {Nullable<StorageObj<T>>} 反序列化后的数据
   */
  parse(dataStr: string) {
    return storageParse<T>(dataStr, this.options)
  }

  /**
   * 验证存储数据有效性
   * @template T - 存储数据类型
   * @param {Nullable<StorageObj<T>>} rawData - 存储数据
   * @returns {Nullable<T>} 验证后的数据
   */
  validate(rawData: Nullable<StorageObj<T>>) {
    return validateData<T>(rawData, this.options)
  }
}
