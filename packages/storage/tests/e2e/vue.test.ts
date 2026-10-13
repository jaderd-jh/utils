import type { SetStorageConfig } from '../../src'
import { setCryptoKey } from '@jhqn/utils-crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, h } from 'vue'
import { aes, removeStorageAll, setLocal, STORAGE_VERSION, storageParse, storageStringify } from '../../src'
import { useLocal, useSession } from '../../src/vue'

const PREFIX = 'e2e:vue:'
const CRYPTO_KEY = '0123456789abcdef'

const key = (name: string) => `${PREFIX}${name}`
const readValue = (container: HTMLElement) => container.querySelector('[data-testid="value"]')?.textContent ?? null
const increment = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>('[data-testid="increment"]')?.click()
const readData = <T>(storage: Storage, storageKey: string) =>
  storageParse<T>(storage.getItem(storageKey) as string)?.data

interface CounterOptions {
  config?: boolean | SetStorageConfig
  storage?: 'local' | 'session'
}

function counter(storageKey: string, options: CounterOptions = {}) {
  const { config = {}, storage = 'local' } = options

  return defineComponent({
    setup() {
      const value =
        storage === 'local' ? useLocal<number>(storageKey, 0, config) : useSession<number>(storageKey, 0, config)

      return () =>
        h('div', [
          h('span', { 'data-testid': 'value' }, String(value.value)),
          h(
            'button',
            {
              'data-testid': 'increment',
              'onClick': () => {
                value.value += 1
              },
            },
            'increment'
          ),
        ])
    },
  })
}

beforeEach(() => {
  removeStorageAll(localStorage, new RegExp(`^${PREFIX}`))
  removeStorageAll(sessionStorage, new RegExp(`^${PREFIX}`))
})

describe('useLocal', () => {
  it('seeds localStorage with the initial value', async () => {
    const storageKey = key('seed')

    const screen = await render(counter(storageKey))

    expect(readValue(screen.container)).toBe('0')
    expect(storageParse<number>(localStorage.getItem(storageKey) as string)).toMatchObject({
      data: 0,
      expiredAt: null,
      version: STORAGE_VERSION,
    })
  })

  it('reflects updates in the DOM and in localStorage', async () => {
    const storageKey = key('update')

    const screen = await render(counter(storageKey))
    increment(screen.container)

    await vi.waitFor(() => {
      expect(readValue(screen.container)).toBe('1')
      expect(readData<number>(localStorage, storageKey)).toBe(1)
    })
  })

  it('restores the persisted value on a fresh mount', async () => {
    const storageKey = key('restore')

    const first = await render(counter(storageKey))
    increment(first.container)
    await vi.waitFor(() => expect(readData<number>(localStorage, storageKey)).toBe(1))
    await first.unmount()

    const second = await render(counter(storageKey))

    expect(readValue(second.container)).toBe('1')
  })

  it('syncs the value written by another tab', async () => {
    const storageKey = key('sync')

    const screen = await render(counter(storageKey))

    localStorage.setItem(storageKey, storageStringify(42))
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        newValue: localStorage.getItem(storageKey),
        oldValue: storageStringify(0),
        storageArea: localStorage,
        url: window.location.href,
      })
    )

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('42'))
  })

  it('stores encrypted values when crypto is enabled', async () => {
    const storageKey = key('crypto')

    setCryptoKey(CRYPTO_KEY)
    await render(counter(storageKey, { config: { crypto: true } }))

    const ciphertext = localStorage.getItem(storageKey) as string
    expect(ciphertext).not.toContain('"data"')
    expect(storageParse<number>(aes.decrypt(ciphertext))?.data).toBe(0)
  })

  it('accepts the boolean shorthand for crypto', async () => {
    const storageKey = key('crypto-shorthand')

    setCryptoKey(CRYPTO_KEY)
    await render(counter(storageKey, { config: true }))

    expect(localStorage.getItem(storageKey)).not.toContain('"data"')
  })

  it('writes the expiredAt given by the config', async () => {
    const storageKey = key('write-expired-at')
    const expiredAt = Date.now() + 60_000

    await render(counter(storageKey, { config: { expiredAt } }))

    expect(storageParse<number>(localStorage.getItem(storageKey) as string)?.expiredAt).toBe(expiredAt)
  })

  it('falls back to the initial value once the stored data has expired', async () => {
    const storageKey = key('expired')

    setLocal(storageKey, 42, { expiredAt: Date.now() - 1 })

    const screen = await render(counter(storageKey))

    expect(readValue(screen.container)).toBe('0')
    // 失效数据顺手清理，避免一直占着存储（与 getStorage / atomWithLocal 行为一致）
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it('falls back to the initial value for data written by another version', async () => {
    const storageKey = key('stale-version')

    localStorage.setItem(storageKey, JSON.stringify({ data: 42, expiredAt: null, version: '0.0.1' }))

    const screen = await render(counter(storageKey))

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it('falls back to the initial value when the stored data is null', async () => {
    const storageKey = key('null-data')

    localStorage.setItem(storageKey, storageStringify(null))

    const screen = await render(counter(storageKey))

    expect(readValue(screen.container)).toBe('0')
  })

  it('keeps data written by other libraries untouched', async () => {
    const storageKey = key('foreign')
    const raw = JSON.stringify({ foo: 1 })

    localStorage.setItem(storageKey, raw)

    const screen = await render(counter(storageKey))

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBe(raw)
  })

  it('falls back to the initial value instead of throwing when the data is not an envelope', async () => {
    const storageKey = key('not-an-envelope')
    // useStorage 会捕获 serializer.read 抛出的异常，因此必须同时断言没有异常被抛出
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    localStorage.setItem(storageKey, 'raw-value')

    try {
      const screen = await render(counter(storageKey))

      expect(readValue(screen.container)).toBe('0')
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      errorSpy.mockRestore()
    }
  })

  it('falls back to the initial value instead of throwing when decryption fails', async () => {
    const storageKey = key('broken-ciphertext')
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    setCryptoKey('1234567890abcdef')
    localStorage.setItem(storageKey, 'not-a-valid-ciphertext')

    try {
      const screen = await render(counter(storageKey, { config: { crypto: true } }))

      expect(readValue(screen.container)).toBe('0')
      expect(errorSpy).not.toHaveBeenCalled()
    } finally {
      errorSpy.mockRestore()
    }
  })
})

describe('useSession', () => {
  it('stores values in sessionStorage only', async () => {
    const storageKey = key('session')

    const screen = await render(counter(storageKey, { storage: 'session' }))

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBeNull()
    expect(readData<number>(sessionStorage, storageKey)).toBe(0)

    increment(screen.container)

    await vi.waitFor(() => expect(readData<number>(sessionStorage, storageKey)).toBe(1))
  })
})
