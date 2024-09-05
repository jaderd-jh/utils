import { jError, replacer } from '@jhqn/utils-core'
import { type ConfigurableWindow, type StorageLike, defaultWindow, getSSRHandler, useEventListener } from '@vueuse/core'
import {
  type ConfigurableEventFilter,
  type ConfigurableFlush,
  type MaybeRefOrGetter,
  type RemovableRef,
  pausableWatch,
  toValue,
  tryOnMounted,
} from '@vueuse/shared'
import { nextTick, ref, shallowRef } from 'vue'
import type { StorageConfig } from '../types'
import { STORAGE_EVENT_NAME } from './const'
import { aes, dispatchCustomStorageEvent, setStorage, storageParse, storageStringify, validateData } from './storage'

interface StorageEventLike extends Pick<StorageEvent, 'key' | 'oldValue' | 'newValue'> {
  storageArea: StorageLike | null
}

interface UseStorageOptions extends ConfigurableEventFilter, ConfigurableWindow, ConfigurableFlush, StorageConfig {
  /**
   * Watch for deep changes
   *
   * @default true
   */
  deep?: boolean

  /**
   * Listen to storage changes, useful for multiple tabs application
   *
   * @default true
   */
  listenToStorageChanges?: boolean

  /**
   * Write the default value to the storage when it does not exist
   *
   * @default true
   */
  writeDefaults?: boolean

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void

  /**
   * Use shallow ref as reference
   *
   * @default false
   */
  shallow?: boolean

  /**
   * Wait for the component to be mounted before reading the storage.
   *
   * @default false
   */
  initOnMounted?: boolean
}

/**
 * Reactive LocalStorage/SessionStorage.
 *
 * @see https://vueuse.org/useStorage
 */
function useJadeStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions = {}
): RemovableRef<T> {
  // jLog(key, 'useStorage', defaults, storage, options)
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = e => {
      jError(e)
    },
    initOnMounted,
    crypto,
  } = options

  const data = (shallow ? shallowRef : ref)(typeof defaults === 'function' ? defaults() : defaults) as RemovableRef<T>

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)()
    } catch (e) {
      onError(e)
    }
  }

  if (!storage) {
    return data
  }

  const rawInit: T = toValue(defaults)

  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(data, () => write(data.value), {
    flush,
    deep,
    eventFilter,
  })

  if (window && listenToStorageChanges) {
    tryOnMounted(() => {
      /**
       * Attaching event listeners here should be fine since we are in a mounted hook
       *
       * The custom event is needed for same-document syncing when using custom
       * storage backends, but it doesn't work across different documents.
       *
       * TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
       */
      if (storage instanceof Storage) {
        useEventListener(window, 'storage', update)
      } else {
        useEventListener(window, STORAGE_EVENT_NAME, updateFromCustomEvent)
      }
      if (initOnMounted) {
        update()
      }
    })
  }

  // avoid reading immediately to avoid hydration mismatch when doing SSR
  if (!initOnMounted) {
    update()
  }

  function dispatchWriteEvent(oldValue: string | null, newValue: string | null) {
    // send custom event to communicate within same page
    if (window) {
      const payload = {
        key,
        oldValue,
        newValue,
        storageArea: storage as Storage,
        url: window.location.href,
      }
      // We also use a CustomEvent since StorageEvent cannot
      // be constructed with a non-built-in storage area
      if (storage instanceof Storage) {
        window.dispatchEvent(new StorageEvent('storage', payload))
      } else {
        dispatchCustomStorageEvent(payload)
      }
    }
  }

  function write(newValue: unknown) {
    try {
      const oldValueStr = storage!.getItem(key)
      const oldValue = oldValueStr ? validateData(storageParse(oldValueStr, options), options) : null

      if (newValue == null) {
        dispatchWriteEvent(oldValue, null)
        storage!.removeItem(key)
      } else {
        if (JSON.stringify(oldValue, replacer) !== JSON.stringify(newValue, replacer)) {
          const dataStr = storageStringify(newValue, options)
          const newValueStr = crypto ? aes.encrypt(dataStr) : dataStr
          storage!.setItem(key, newValueStr)
          dispatchWriteEvent(oldValueStr, newValueStr)
        }
      }
    } catch (e) {
      onError(e)
    }
  }

  function read(event?: StorageEventLike) {
    const rawValue = event ? event.newValue : storage?.getItem(key)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null) {
        setStorage(storage as Storage, key, rawInit, options)
      }
      return rawInit
    } else {
      return validateData(storageParse<T>(rawValue, options), options)
    }
  }

  function update(event?: StorageEventLike) {
    if (event && event.storageArea !== storage) {
      return
    }

    if (event && event.key == null) {
      data.value = rawInit
      return
    }

    if (event && event.key !== key) {
      return
    }

    pauseWatch()
    try {
      const newValue = event?.newValue ? storageParse<T>(event.newValue, options) : undefined
      const serialized = data.value
      if (JSON.stringify(newValue, replacer) !== JSON.stringify(serialized, replacer)) {
        data.value = read(event)
      }
    } catch (e) {
      onError(e)
    } finally {
      // use nextTick to avoid infinite loop
      if (event) {
        nextTick(resumeWatch)
      } else {
        resumeWatch()
      }
    }
  }

  function updateFromCustomEvent(event: CustomEvent<StorageEventLike>) {
    update(event.detail)
  }

  return data
}

/**
 * storage存储联动
 * @param storage
 * @param key
 * @param defaults
 * @param options
 */
function useWindowStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: 'localStorage' | 'sessionStorage',
  options: UseStorageOptions = {}
): RemovableRef<T> {
  const { window = defaultWindow } = options
  return useJadeStorage<T>(key, defaults, window?.[storage], options)
}

export function useLocal(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  options?: UseStorageOptions
): RemovableRef<string>
export function useLocal(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions
): RemovableRef<boolean>
export function useLocal(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  options?: UseStorageOptions
): RemovableRef<number>
export function useLocal<T>(key: string, defaults: MaybeRefOrGetter<T>, options?: UseStorageOptions): RemovableRef<T>
export function useLocal<T = unknown>(
  key: string,
  defaults: MaybeRefOrGetter<null>,
  options?: UseStorageOptions
): RemovableRef<T>

/**
 * localStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} defaults - 默认值
 * @param {UseStorageOptions} options - 配置项
 */
export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions = {}
) {
  return useWindowStorage<T>(key, defaults, 'localStorage', options)
}

export function useSession(
  key: string,
  defaults: MaybeRefOrGetter<string>,
  options?: UseStorageOptions
): RemovableRef<string>
export function useSession(
  key: string,
  defaults: MaybeRefOrGetter<boolean>,
  options?: UseStorageOptions
): RemovableRef<boolean>
export function useSession(
  key: string,
  defaults: MaybeRefOrGetter<number>,
  options?: UseStorageOptions
): RemovableRef<number>
export function useSession<T>(key: string, defaults: MaybeRefOrGetter<T>, options?: UseStorageOptions): RemovableRef<T>
export function useSession<T = unknown>(
  key: string,
  defaults: MaybeRefOrGetter<null>,
  options?: UseStorageOptions
): RemovableRef<T>

/**
 * sessionStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} defaults - 默认值
 * @param {UseStorageOptions} options - 配置项
 */
export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions = {}
) {
  return useWindowStorage<T>(key, defaults, 'sessionStorage', options)
}
