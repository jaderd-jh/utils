import { atomWithStorage as _atomWithStorage } from 'jotai/utils'
import type { StorageConfig } from '../types'
import { getStorage, removeStorage, setStorage } from './storage'

/**
 * 封装同步 Storage 的 atom
 * @param storage
 * @param {string} key - 存储键值
 * @param {any} initialValue - 初始值
 * @param {StorageConfig} config - 存储配置
 */
const atomWithStorage = <T>(storage: Storage, key: string, initialValue: T, config?: StorageConfig) => {
  return _atomWithStorage(
    key,
    initialValue,
    {
      getItem: () => getStorage<T>(storage, key, config) ?? initialValue,
      setItem: (_, newValue) => setStorage<T>(storage, key, newValue, config),
      removeItem: () => removeStorage(storage, key),
      // subscribe: (key1, callback, initialValue1) => {},
    },
    { getOnInit: true }
  )
}

/**
 * localStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} initialValue - 初始值
 * @param {StorageConfig} config - 存储配置项
 */
export function atomWithLocal<Value>(key: string, initialValue: Value, config?: StorageConfig) {
  return atomWithStorage(localStorage, key, initialValue, config)
}

/**
 * sessionStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} initialValue - 初始值
 * @param {StorageConfig} config - 存储配置项
 */
export function atomWithSession<Value>(key: string, initialValue: Value, config?: StorageConfig) {
  return atomWithStorage(sessionStorage, key, initialValue, config)
}
