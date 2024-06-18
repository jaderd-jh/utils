import { isUndefined } from '@jhqn/utils-core'
import type { MaybeRef } from '@vueuse/shared'
import type { UseStorageOptions } from '@vueuse/core'
import { defaultWindow, useStorage } from '@vueuse/core'
import type { StorageConfig } from '../types'
import { aes, removeStorage, storageParse, storageStringify } from './storage'

/**
 * storage存储联动
 * @param storage
 * @param key
 * @param initialValue
 * @param config
 * @param options
 */
function useWindowStorage<T extends string | number | boolean | object | null>(
  storage: 'localStorage' | 'sessionStorage',
  key: string,
  initialValue: MaybeRef<T>,
  config: StorageConfig = { crypto: false },
  options?: UseStorageOptions<T>
) {
  const internalOptions = { window: defaultWindow, ...options }
  // @ts-expect-error ???
  return useStorage<T>(key, initialValue, internalOptions.window?.[storage], {
    ...internalOptions,
    serializer: {
      read: v => {
        // jLog(`${key}-read`, v)
        let content = storageParse<T>(config.crypto ? aes.decrypt(v) : v)
        if (config.expires && content && new Date().getTime() - content.expires >= config.expires) {
          removeStorage(internalOptions.window![storage], key)
          content = null
        }
        // jLog(`${key}-content`, content)
        return content && !isUndefined(content?.data) ? content.data : null
      },
      write: v => {
        // jLog(`${key}-write`, v)
        const rawData = storageStringify(v, config?.expires)
        // jLog(`${key}-rawData`, rawData)
        return config.crypto ? aes.encrypt(rawData) : rawData
      },
    },
  })
}

/**
 * localStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} initialValue - 初始值
 * @param {StorageConfig} config - 存储配置
 * @param {UseStorageOptions} options - 配置项
 */
export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  config?: StorageConfig,
  options?: UseStorageOptions<T>
) {
  return useWindowStorage<T>('localStorage', key, initialValue, config, options)
}

/**
 * sessionStorage存储联动
 * @param {string} key - 存储键值
 * @param {any} initialValue - 初始值
 * @param {StorageConfig} config - 存储配置
 * @param {UseStorageOptions} options - 配置项
 */
export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  config?: StorageConfig,
  options?: UseStorageOptions<T>
) {
  return useWindowStorage<T>('sessionStorage', key, initialValue, config, options)
}
