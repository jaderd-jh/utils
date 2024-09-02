import { atomWithStorage as _atomWithStorage } from 'jotai/utils'
import type { StorageConfig } from '../types'
import { getStorage, hasStorage, removeStorage, setStorage, storageParse } from './storage'

interface UseStorageConfig extends StorageConfig {
  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean
}

/**
 * 封装同步 Storage 的 atom
 * @param storage
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {StorageConfig} options - 存储配置
 */
const atomWithStorage = <T>(storage: Storage, key: string, defaults: T, options: UseStorageConfig = {}) => {
  const { crypto, expires, writeDefaults = true } = options
  const anAtom = _atomWithStorage(
    key,
    defaults,
    {
      getItem() {
        const serialized = getStorage<T>(storage, key, { crypto, expires })
        if (serialized === null) {
          if (hasStorage(storage, key)) {
            storage.removeItem(key)
            return defaults
          }
        }
        return serialized ?? defaults
      },
      setItem(_, newValue) {
        setStorage<T>(storage, key, newValue, { crypto, expires })
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
              setStorage(storage, key, defaults, { crypto, expires })
            } else {
              callback(storageParse(rawValue, { crypto, expires }) ?? defaults)
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

  anAtom.onMount = () => {
    const serialized = getStorage<T>(storage, key, { crypto, expires })
    if (writeDefaults && serialized === null) {
      setStorage(storage, key, defaults, { crypto, expires })
    }
  }

  return anAtom
}

/**
 * localStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {StorageConfig} options - 存储配置项
 */
export function atomWithLocal<Value>(key: string, defaults: Value, options?: StorageConfig) {
  return atomWithStorage(localStorage, key, defaults, options)
}

/**
 * sessionStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {StorageConfig} options - 存储配置项
 */
export function atomWithSession<Value>(key: string, defaults: Value, options?: StorageConfig) {
  return atomWithStorage(sessionStorage, key, defaults, options)
}
