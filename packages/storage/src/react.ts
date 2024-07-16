import type { WritableAtom } from 'jotai'
import { jError } from '@jhqn/utils-core'
import { atom } from 'jotai'
import type { StorageConfig } from '../types'
import { getStorage, removeStorage, setStorage } from './storage'

/**
 * 封装同步 Storage 的 atom
 * @param storage
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {StorageConfig} options - 存储配置
 */
const atomWithStorage = <T>(
  storage: Storage,
  key: string,
  defaults: T,
  options?: StorageConfig
): WritableAtom<T, [T | ((prev: T) => T)], void> => {
  const storageUpdate = (event: StorageEvent, setSelf?: any) => {
    if (event && event.storageArea !== storage) return

    if (event && event.key == null) {
      return
    }

    if (event && event.key !== key) return

    if (event && event.key === key) {
      try {
        setSelf(getStorage<T>(storage, key, options))
      } catch (e) {
        jError(`Storage:${key}`, e)
      }
    }
  }
  const baseAtom = atom(getStorage<T>(storage, key, options) ?? defaults)
  baseAtom.onMount = setSelf => {
    window.addEventListener('storage', e => storageUpdate(e, setSelf))
    return () => {
      window.removeEventListener('storage', storageUpdate)
    }
  }
  return atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue = update instanceof Function ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      if (nextValue === null) {
        removeStorage(storage, key)
      } else {
        setStorage(storage, key, nextValue, options)
      }
    }
  )
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
