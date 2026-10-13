import type { WritableAtom } from 'jotai'
import type { SetStorageConfig } from './storage'
import { jError } from '@jhqn/utils-core'
import { atom } from 'jotai'
import { getStorage, removeStorage, resolveStorageConfig, setStorage } from './storage'

/**
 * 延迟获取 localStorage
 * - SSR / Node 等没有 localStorage 的环境返回 undefined，此时 atom 只保留在内存中，不做持久化
 */
const getLocalStorage = (): Storage | undefined => (typeof localStorage === 'undefined' ? undefined : localStorage)

/**
 * 延迟获取 sessionStorage
 * - SSR / Node 等没有 sessionStorage 的环境返回 undefined，此时 atom 只保留在内存中，不做持久化
 */
const getSessionStorage = (): Storage | undefined =>
  typeof sessionStorage === 'undefined' ? undefined : sessionStorage

/**
 * 封装同步Storage的atom
 * @param getStorageArea 延迟获取 Storage，SSR 环境下返回 undefined
 * @param key 键
 * @param initialValue 初始值
 * @param config
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
const atomWithStorage = <T>(
  getStorageArea: () => Storage | undefined,
  key: string,
  initialValue: T,
  config?: boolean | SetStorageConfig
): WritableAtom<T, [T | ((prev: T) => T)], void> => {
  const storageConfig = resolveStorageConfig(config)
  const read = () => {
    const storage = getStorageArea()

    return storage ? (getStorage<T>(storage, key, storageConfig) ?? initialValue) : initialValue
  }

  const baseAtom = atom(read())
  baseAtom.onMount = setSelf => {
    const storage = getStorageArea()
    // SSR / Node 下没有 storage 也没有 window，无需监听
    if (!storage || typeof window === 'undefined') return

    // 必须复用同一个函数引用，否则 removeEventListener 无法移除监听，导致组件卸载后监听器泄漏
    const listener = (event: StorageEvent) => {
      // storageArea 可能为 null（例如由脚本手动构造的事件），此时按当前 storage 处理
      if (event.storageArea && event.storageArea !== storage) return
      // clear() 会派发 key 为 null 的事件，此时该 key 已被清空，回退到初始值
      if (event.key !== null && event.key !== key) return

      try {
        setSelf(read())
      } catch (error) {
        jError(`Storage:${key}`, error)
      }
    }

    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }

  return atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue = update instanceof Function ? update(get(baseAtom)) : update
      const storage = getStorageArea()

      // 先落盘再更新内存：序列化失败（例如不可存储的数据）时会抛错，
      // 内存值保持与存储一致，而不是磁盘没写成功、atom 却已经变了
      if (storage) {
        if (nextValue === null) {
          removeStorage(storage, key)
        } else {
          setStorage(storage, key, nextValue, storageConfig)
        }
      }

      set(baseAtom, nextValue)
    }
  )
}

/**
 * localStorage存储联动atom
 * - SSR / Node 环境下没有 localStorage，此时 atom 只在内存中工作，不会抛错
 * @param key
 * @param initialValue
 * @param config 布尔简写代表是否加解密，或传配置对象
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
export function atomWithLocal<Value>(key: string, initialValue: Value, config?: boolean | SetStorageConfig) {
  return atomWithStorage(getLocalStorage, key, initialValue, config)
}

/**
 * sessionStorage存储联动atom
 * - SSR / Node 环境下没有 sessionStorage，此时 atom 只在内存中工作，不会抛错
 * @param key
 * @param initialValue
 * @param config 布尔简写代表是否加解密，或传配置对象
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 */
export function atomWithSession<Value>(key: string, initialValue: Value, config?: boolean | SetStorageConfig) {
  return atomWithStorage(getSessionStorage, key, initialValue, config)
}
