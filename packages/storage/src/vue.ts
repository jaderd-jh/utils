import type { MaybeRef, RemovableRef } from '@vueuse/shared'
import type { UseStorageOptions } from '@vueuse/core'
import { defaultWindow, useStorage } from '@vueuse/core'
import { aes } from '@jhqn/utils-crypto'
import { storageParse, storageStringify } from './storage'

/**
 * localStorage存储联动
 * @param key
 * @param initialValue
 * @param crypto
 * @param options
 */
export function useLocal<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  crypto = false,
  options: UseStorageOptions<T> = { window: defaultWindow }
): RemovableRef<T> {
  return useStorage<T>(key, initialValue, options.window?.localStorage, {
    ...options,
    serializer: {
      read: v => storageParse<T>(crypto ? aes.decrypt(v) : v)!.data,
      write: v => (crypto ? aes.encrypt(storageStringify(v)) : storageStringify(v)),
    },
  })
}

/**
 * sessionStorage存储联动
 * @param key 存储键值
 * @param initialValue 初始值
 * @param crypto 是否加密
 * @param options 配置项
 */
export function useSession<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: MaybeRef<T>,
  crypto = false,
  options: UseStorageOptions<T> = { window: defaultWindow }
): RemovableRef<T> {
  return useStorage<T>(key, initialValue, options.window?.sessionStorage, {
    ...options,
    serializer: {
      read: v => storageParse<T>(crypto ? aes.decrypt(v) : v)!.data,
      write: v => (crypto ? aes.encrypt(storageStringify(v)) : storageStringify(v)),
    },
  })
}
