import type { UseStorageOptions } from '@vueuse/core'
import type { MaybeRef } from 'vue'
import type { SetStorageConfig } from './storage'
import { defaultWindow, useStorage } from '@vueuse/core'
import { toValue } from 'vue'
import { StorageStatus } from './const'
import { aes, readStorageRaw, resolveStorageConfig, storageStringify } from './storage'

/**
 * storage存储联动
 * @param storage
 * @param key
 * @param initialValue
 * @param config 布尔简写代表是否加解密，或传配置对象
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 * @param options
 */
function useWindowStorage<T extends string | number | boolean | object | null>(
  storage: 'localStorage' | 'sessionStorage',
  key: string,
  initialValue: MaybeRef<T>,
  config: boolean | SetStorageConfig = {},
  options: UseStorageOptions<T> = { window: defaultWindow }
) {
  const storageConfig = resolveStorageConfig(config)
  const { crypto } = storageConfig
  const fallback = toValue(initialValue)
  const storageArea = options.window?.[storage]

  return useStorage<T>(key, initialValue, storageArea, {
    ...options,
    serializer: {
      // 非本库信封结构 / 版本不匹配 / 已过期 / 解密失败时回退到初始值，避免非空断言直接抛错
      read: raw => {
        const result = readStorageRaw<T>(raw, storageConfig)
        // 本库信封但版本不匹配或已过期时顺手清理，避免失效数据一直留在存储里（与 getStorage 行为一致）
        if (result.status === StorageStatus.Stale) storageArea?.removeItem(key)

        return result.status === StorageStatus.Ok ? (result.data ?? fallback) : fallback
      },
      write: value => {
        const serialized = storageStringify(value, storageConfig.expiredAt ?? null)
        return crypto ? aes.encrypt(serialized) : serialized
      },
    },
  })
}

/**
 * localStorage存储联动
 * @param key
 * @param initialValue
 * @param config 布尔简写代表是否加解密，或传配置对象
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 * @param options
 */
export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  config: boolean | SetStorageConfig = {},
  options: UseStorageOptions<T> = { window: defaultWindow }
) {
  return useWindowStorage<T>('localStorage', key, initialValue, config, options)
}

/**
 * sessionStorage存储联动
 * @param key 存储键值
 * @param initialValue 初始值
 * @param config 布尔简写代表是否加解密，或传配置对象
 * @param config.crypto 是否使用加解密
 * @param config.expiredAt 数据过期的绝对时刻（ms），`null` 表示永不过期
 * @param options 配置项
 */
export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  config: boolean | SetStorageConfig = {},
  options: UseStorageOptions<T> = { window: defaultWindow }
) {
  return useWindowStorage<T>('sessionStorage', key, initialValue, config, options)
}
