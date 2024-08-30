import { isUndefined } from '@jhqn/utils-core'
import {
  type ConfigurableEventFilter,
  type ConfigurableFlush,
  type MaybeRefOrGetter,
  type RemovableRef,
  pausableWatch,
  toValue,
  tryOnMounted,
} from '@vueuse/shared'
import { type ConfigurableWindow, type StorageLike, defaultWindow, getSSRHandler, useEventListener } from '@vueuse/core'
import { nextTick, ref, shallowRef } from 'vue'
import type { StorageConfig } from '../types'
import { STORAGE_EVENT_NAME } from './const'
import { aes, getStorage, setStorage, storageParse, storageStringify } from './storage'

interface StorageEventLike {
  storageArea: StorageLike | null
  key: StorageEvent['key']
  oldValue: StorageEvent['oldValue']
  newValue: StorageEvent['newValue']
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
function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  storage: StorageLike | undefined,
  options: UseStorageOptions = {}
): RemovableRef<T> {
  const {
    flush = 'pre',
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window = defaultWindow,
    eventFilter,
    onError = e => {
      console.error(e)
    },
    initOnMounted,
    crypto,
    expires,
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
      }
      // We also use a CustomEvent since StorageEvent cannot
      // be constructed with a non-built-in storage area
      window.dispatchEvent(
        storage instanceof Storage
          ? new StorageEvent('storage', payload)
          : new CustomEvent<StorageEventLike>(STORAGE_EVENT_NAME, {
              detail: payload,
            })
      )
    }
  }

  function write(v: unknown) {
    try {
      const oldValue = getStorage(storage as Storage, key, { crypto, expires })

      if (v == null) {
        dispatchWriteEvent(oldValue, null)
        storage!.removeItem(key)
      } else {
        if (oldValue !== v) {
          const rawData = storageStringify(v, expires)
          const serialized = crypto ? aes.encrypt(rawData) : rawData
          storage!.setItem(key, serialized)
          dispatchWriteEvent(oldValue, serialized)
        }
      }
    } catch (e) {
      onError(e)
    }
  }

  function read(event?: StorageEventLike) {
    const rawValue = event ? event.newValue : storage!.getItem(key)

    if (rawValue == null) {
      if (writeDefaults && rawInit != null) {
        setStorage(storage as Storage, key, rawInit, { crypto, expires })
      }
      return rawInit
    } else {
      let content = storageParse<T>(crypto ? aes.decrypt(rawValue) : rawValue)
      if (expires && content && new Date().getTime() - content.expires >= 0) {
        content = null
      }
      return content && !isUndefined(content?.data) ? content.data : null
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
      const shit = event?.newValue
      const serialized = data.value
      if (shit !== serialized) {
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
  storage: 'localStorage' | 'sessionStorage',
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options?: UseStorageOptions
): RemovableRef<T> {
  const internalOptions = { window: defaultWindow, ...options }
  return useStorage<T>(key, defaults, internalOptions.window?.[storage], internalOptions)
}

/**
 * localStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} defaults - 默认值
 * @param {UseStorageOptions} options - 配置项
 */
export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options?: UseStorageOptions
) {
  return useWindowStorage<T>('localStorage', key, defaults, options)
}

/**
 * sessionStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} defaults - 默认值
 * @param {UseStorageOptions} options - 配置项
 */
export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  defaults: MaybeRefOrGetter<T>,
  options?: UseStorageOptions
) {
  return useWindowStorage<T>('sessionStorage', key, defaults, options)
}
