import { type Nullable, dayjs, isDef, jError } from '@jhqn/utils-core'
import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
import type { StorageConfig, StorageEventLike } from '../types'
import { STORAGE_EVENT_NAME, STORAGE_EXPIRES } from './const'
import { JadeStorage } from './storage'

interface UseStorageConfig extends StorageConfig {
  /**
   * 是否监听存储变化
   *
   * @default true
   */
  listenToStorageChanges?: boolean
  /**
   * 当存储中不存在有效值时，是否写入默认值
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
 * @param {UseStorageConfig} options - 存储配置
 */
const atomWithStorage = <T>(storage: Storage, key: string, defaults: T, options: UseStorageConfig = {}) => {
  const { expiresAt, validTime, writeDefaults = true, listenToStorageChanges = true } = options

  const js = new JadeStorage<T>(storage, key, defaults, options)

  let timer: ReturnType<typeof setTimeout> | null = null
  let interval = options.validTime || 0

  function clear() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function start(cb: () => void) {
    clear()
    timer = setTimeout(() => {
      timer = null

      if (interval > STORAGE_EXPIRES.MAX_DELAY) {
        interval -= STORAGE_EXPIRES.MAX_DELAY
        start(cb)
      } else {
        cb()
      }
    }, interval)
  }

  const storageRawValue = js.get()
  const baseAtom = atom(storageRawValue ?? defaults)

  baseAtom.onMount = setAtom => {
    const loop = () => {
      js.reset()
      interval = js.getExpiresAt() - Date.now()
      start(loop)
    }

    function doWhenStorageDataInvalid() {
      if (writeDefaults) {
        if (expiresAt) {
          if (dayjs(expiresAt).valueOf() > Date.now()) {
            js.reset()
            interval = js.getExpiresAt() - Date.now()
            start(() => {
              setAtom(defaults)
              js.remove()
            })
          }
        } else if (validTime) {
          loop()
        } else {
          js.reset()
        }
      }
    }

    // 挂载时存储中有有效值
    if (isDef(storageRawValue)) {
      if (expiresAt) {
        interval = js.getExpiresAt() - Date.now()
        start(() => {
          setAtom(defaults)
          js.remove()
        })
      } else if (validTime) {
        interval = js.getExpiresAt() - Date.now()
        start(() => {
          setAtom(defaults)
          if (writeDefaults) {
            loop()
          }
        })
      }
      // 无有效值
    } else {
      doWhenStorageDataInvalid()
    }

    function storageEventCallback(e: StorageEventLike) {
      if (e.storageArea === storage && e.key === key) {
        if (e.newValue === null) {
          // 删除data，如果writeDefaults就写入默认值，否则就什么都不做
          if (writeDefaults) {
            setAtom(defaults)
            js.reset()
          }
          // 有新值
        } else {
          const rawValue = js.parse(e.newValue)
          // rawValue 为 null 说明数据无法解析，已经损坏
          if (rawValue === null) {
            jError('无法解析的存储数据，将重置', { key, value: e.newValue })
            doWhenStorageDataInvalid()
          } else {
            const validData = js.validate(rawValue)
            // validData 为 null 说明数据已经过期，或者版本不对应
            if (validData === null) {
              doWhenStorageDataInvalid()
            } else {
              setAtom(validData)
              interval = js.getExpiresAt() - Date.now()
              start(() => {
                setAtom(defaults)
                if (writeDefaults) {
                  loop()
                }
              })
            }
          }
        }
      }
    }

    function customStorageCallback(e: CustomEvent<StorageEventLike>) {
      storageEventCallback(e.detail)
    }

    if (listenToStorageChanges) {
      if (storage instanceof Storage) {
        window.addEventListener('storage', storageEventCallback)
      } else {
        window.addEventListener(STORAGE_EVENT_NAME, customStorageCallback)
      }
    }

    return () => {
      if (listenToStorageChanges) {
        if (storage instanceof Storage) {
          window.removeEventListener('storage', storageEventCallback)
        } else {
          window.removeEventListener(STORAGE_EVENT_NAME, customStorageCallback)
        }
      }
      clear()
    }
  }

  return atom(
    get => get(baseAtom),
    (get, set, update: T | ((prev: T) => T) | typeof RESET) => {
      let newValue: Nullable<T>

      if (update instanceof Function) {
        newValue = update(get(baseAtom))
      } else if (update === RESET) {
        newValue = defaults
      } else {
        newValue = update
      }

      const loop = () => {
        js.set(newValue)
        interval = js.getExpiresAt() - Date.now()
        start(loop)
      }

      if (expiresAt && dayjs(expiresAt).valueOf() > Date.now()) {
        set(baseAtom, newValue)
        js.set(newValue)
        interval = dayjs(expiresAt).valueOf() - Date.now()
        start(() => {
          newValue = defaults
          set(baseAtom, newValue)
          js.remove()
        })
      } else if (validTime) {
        set(baseAtom, newValue)
        js.set(newValue)
        interval = js.getExpiresAt() - Date.now()
        start(() => {
          newValue = defaults
          set(baseAtom, newValue)
          loop()
        })
      } else {
        set(baseAtom, newValue)
        js.set(newValue)
      }
    }
  )
}

/**
 * localStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {UseStorageConfig} options - 存储配置项
 */
export function atomWithLocal<Value>(key: string, defaults: Value, options?: UseStorageConfig) {
  return atomWithStorage(localStorage, key, defaults, options)
}

/**
 * sessionStorage 存储联动 atom
 * @param {string} key - 存储键值
 * @param {any} defaults - 初始值
 * @param {UseStorageConfig} options - 存储配置项
 */
export function atomWithSession<Value>(key: string, defaults: Value, options?: UseStorageConfig) {
  return atomWithStorage(sessionStorage, key, defaults, options)
}
