import type { MaybeRef, RemovableRef } from '@vueuse/shared'
import type { UseStorageOptions } from '@vueuse/core'
import { defaultWindow, useStorage } from '@vueuse/core'
import { aes, storageParse, storageStringify } from './storage'

/**
 * storage存储联动
 * @param storage
 * @param key
 * @param initialValue
 * @param crypto
 * @param options
 */
function useWindowStorage<T extends string | number | boolean | object | null>(
  storage: Storage,
  key: string,
  initialValue: MaybeRef<T>,
  crypto = false,
  options: UseStorageOptions<T> = { window: defaultWindow }
): RemovableRef<T> {
  // @ts-expect-error it works
  return useStorage<T>(key, initialValue, options.window?.[storage], {
    ...options,
    serializer: {
      read: v => storageParse<T>(crypto ? aes.decrypt(v) : v)!.data,
      write: v => (crypto ? aes.encrypt(storageStringify(v)) : storageStringify(v)),
    },
  })
}

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
) {
  return useWindowStorage<T>(localStorage, key, initialValue, crypto, options)
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
) {
  return useWindowStorage<T>(sessionStorage, key, initialValue, crypto, options)
}
