import type { WritableAtom } from 'jotai'
import { jError } from '@jhqn/utils-core'
import { atom } from 'jotai'
import { getStorage, removeStorage, setStorage } from './storage'

/**
 * 封装同步Storage的atom
 * @param storage
 * @param key 键
 * @param initialValue 初始值
 * @param crypto 是否加解密
 */
export const atomWithStorage = <T>(
  storage: Storage,
  key: string,
  initialValue: T,
  crypto?: boolean
): WritableAtom<T, [T | ((prev: T) => T)], void> => {
  const storageUpdate = (event: StorageEvent, setSelf?: any) => {
    if (event && event.storageArea !== storage) return

    if (event && event.key == null) {
      return
    }

    if (event && event.key !== key) return

    if (event && event.key === key) {
      try {
        setSelf(getStorage<T>(storage, key, { crypto }))
      } catch (e) {
        jError(`Storage:${key}`, e)
      }
    }
  }
  const baseAtom = atom(getStorage<T>(storage, key, { crypto }) ?? initialValue)
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
        setStorage(storage, key, nextValue, { crypto })
      }
    }
  )
}

/**
 * localStorage存储联动atom
 * @param key
 * @param initialValue
 * @param crypto
 */
export function atomWithLocal<Value>(key: string, initialValue: Value, crypto?: boolean) {
  return atomWithStorage(localStorage, key, initialValue, crypto)
}

/**
 * sessionStorage存储联动atom
 * @param key
 * @param initialValue
 * @param crypto
 */
export function atomWithSession<Value>(key: string, initialValue: Value, crypto?: boolean) {
  return atomWithStorage(sessionStorage, key, initialValue, crypto)
}
