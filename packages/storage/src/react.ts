import { isUndefined } from '@jhqn/utils-core'
import { atomWithStorage as _atomWithStorage } from 'jotai/utils'
import type { StorageConfig } from '../types'
import { aes, getStorage, hasStorage, removeStorage, setStorage, storageParse } from './storage'

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
      getItem() {
        const serialized = getStorage<T>(storage, key, config)
        if (serialized === null) {
          if (hasStorage(storage, key)) {
            storage.removeItem(key)
            return initialValue
          }
        }
        return serialized ?? initialValue
      },
      setItem(_, newValue) {
        setStorage<T>(storage, key, newValue, config)
      },
      removeItem() {
        removeStorage(storage, key)
      },
      subscribe(_key, callback) {
        if (typeof window === 'undefined' || typeof window.addEventListener === 'undefined') {
          return () => {}
        }
        const storageEventCallback = (e: StorageEvent) => {
          if (e.storageArea === storage && e.key === key) {
            const rawValue = e.newValue
            if (rawValue === null) {
              setStorage(storage, key, initialValue, config)
            } else {
              let content = storageParse<T>(config?.crypto ? aes.decrypt(rawValue) : rawValue)
              if (config?.expires && content && new Date().getTime() - content.expires >= 0) {
                content = null
              }
              const serialized = content && !isUndefined(content?.data) ? content.data : null
              callback(serialized ?? initialValue)
            }
          }
        }
        window.addEventListener('storage', storageEventCallback)
        return () => {
          window.removeEventListener('storage', storageEventCallback)
        }
      },
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
