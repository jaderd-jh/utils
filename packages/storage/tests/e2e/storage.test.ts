import { setCryptoKey } from '@jhqn/utils-crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  aes,
  getLocal,
  hasLocal,
  removeLocal,
  removeStorageAll,
  setLocal,
  STORAGE_VERSION,
  storageParse,
  storageStringify,
} from '../../src'

const PREFIX = 'e2e:core:'
const CRYPTO_KEY = '0123456789abcdef'

const key = (name: string) => `${PREFIX}${name}`
const seed = (storage: Storage, name: string, data: unknown, expiredAt: number | null = null) =>
  storage.setItem(name, JSON.stringify({ data, expiredAt, version: STORAGE_VERSION }))

beforeEach(() => {
  removeStorageAll(localStorage, new RegExp(`^${PREFIX}`))
  removeStorageAll(sessionStorage, new RegExp(`^${PREFIX}`))
})

describe('browser Storage interop', () => {
  it('runs against the window storage', () => {
    expect(localStorage).toBe(window.localStorage)
    expect(sessionStorage).toBe(window.sessionStorage)
  })

  it('exposes stored keys as own enumerable properties', () => {
    const storageKey = key('own-property')

    setLocal(storageKey, 'foo')

    expect(Object.hasOwn(localStorage, storageKey)).toBe(true)
    expect(Object.keys(localStorage)).toContain(storageKey)
    expect(storageKey in localStorage).toBe(true)
  })

  it('reads entries written straight into localStorage', () => {
    const storageKey = key('direct-read')

    seed(localStorage, storageKey, 'foo')

    expect(getLocal(storageKey)).toBe('foo')
  })

  it('writes entries other code can read back', () => {
    const storageKey = key('direct-write')

    setLocal(storageKey, { foo: 1 })

    expect(storageParse<{ foo: number }>(window.localStorage.getItem(storageKey) as string)?.data).toStrictEqual({
      foo: 1,
    })
  })

  it('round-trips rich values', () => {
    const storageKey = key('rich')

    setLocal(storageKey, {
      date: new Date('2020-01-01T00:00:00.000Z'),
      map: new Map([['foo', 1]]),
      set: new Set([1, 2]),
    })

    const restored = getLocal<{ date: Date; map: Map<string, number>; set: Set<number> }>(storageKey)

    // Date 以标记对象落库，读取时由 reviver 还原成 Date
    expect(restored?.date).toBeInstanceOf(Date)
    expect(restored?.date.toISOString()).toBe('2020-01-01T00:00:00.000Z')
    expect(restored?.map).toBeInstanceOf(Map)
    expect(restored?.map.get('foo')).toBe(1)
    expect(restored?.set).toBeInstanceOf(Set)
    expect(restored?.set.has(2)).toBe(true)
  })

  it('drops values once the expiry time is reached', () => {
    const storageKey = key('expired-at')

    setLocal(storageKey, 'foo', { expiredAt: Date.now() + 5_000 })
    expect(getLocal(storageKey)).toBe('foo')

    setLocal(storageKey, 'foo', { expiredAt: Date.now() - 1 })
    expect(getLocal(storageKey)).toBeNull()
    expect(window.localStorage.getItem(storageKey)).toBeNull()
  })

  it('drops values written by another storage version', () => {
    const storageKey = key('stale-version')

    window.localStorage.setItem(storageKey, JSON.stringify({ data: 'foo', expires: Date.now(), version: '0.0.1' }))

    expect(getLocal(storageKey)).toBeNull()
    expect(window.localStorage.getItem(storageKey)).toBeNull()
  })

  it('keeps data written by other libraries untouched', () => {
    const storageKey = key('foreign')
    const raw = JSON.stringify({ foo: 1 })

    window.localStorage.setItem(storageKey, raw)

    expect(getLocal(storageKey)).toBeNull()
    expect(window.localStorage.getItem(storageKey)).toBe(raw)
  })

  it('keeps the ciphertext untouched when it cannot be decrypted', () => {
    const storageKey = key('broken-ciphertext')

    window.localStorage.setItem(storageKey, 'not-a-valid-ciphertext')

    expect(getLocal(storageKey, { crypto: true })).toBeNull()
    expect(window.localStorage.getItem(storageKey)).toBe('not-a-valid-ciphertext')
  })

  it('encrypts and decrypts values with the real Aes implementation', () => {
    const storageKey = key('crypto')

    setCryptoKey(CRYPTO_KEY)
    setLocal(storageKey, { foo: 1 }, { crypto: true })

    const ciphertext = window.localStorage.getItem(storageKey) as string
    expect(ciphertext).not.toContain('foo')
    expect(storageParse<{ foo: number }>(aes.decrypt(ciphertext))?.data).toStrictEqual({ foo: 1 })
    expect(getLocal(storageKey, { crypto: true })).toStrictEqual({ foo: 1 })
  })

  it('removes only the keys matching the pattern', () => {
    setLocal(key('a'), 1)
    setLocal(key('b'), 1)
    window.localStorage.setItem(`${PREFIX}untouched`, '1')

    removeStorageAll(localStorage, new RegExp(`^${PREFIX}[ab]$`))

    expect(hasLocal(key('a'))).toBe(false)
    expect(hasLocal(key('b'))).toBe(false)
    expect(hasLocal(`${PREFIX}untouched`)).toBe(true)
  })

  it('keeps sessionStorage separate from localStorage', () => {
    const storageKey = key('separate')

    setLocal(storageKey, 'local-value')

    expect(hasLocal(storageKey)).toBe(true)
    expect(sessionStorage.getItem(storageKey)).toBeNull()
  })
})

describe('key shadowing', () => {
  // Web IDL 不会把与 Storage 接口成员重名的 key 暴露为 own property，
  // 早期基于 `Object.hasOwn` 的实现因此完全读不到这些数据（Chrome 与 jsdom 均可复现）
  it('reaches keys that shadow Storage members', () => {
    setLocal('key', 'foo')
    setLocal('getItem', { foo: 1 })

    expect(Object.hasOwn(window.localStorage, 'key')).toBe(false)
    expect(hasLocal('key')).toBe(true)
    expect(getLocal('key')).toBe('foo')
    expect(getLocal<{ foo: number }>('getItem')).toStrictEqual({ foo: 1 })

    removeLocal('key')
    removeLocal('getItem')

    expect(getLocal('key')).toBeNull()
    expect(hasLocal('getItem')).toBe(false)
  })
})

describe('storage events', () => {
  it('is observable through a manually dispatched StorageEvent', () => {
    const storageKey = key('storage-event')
    const listener = vi.fn()

    window.addEventListener('storage', listener)
    localStorage.setItem(storageKey, storageStringify('foo'))
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        newValue: localStorage.getItem(storageKey),
        storageArea: localStorage,
        url: window.location.href,
      })
    )
    window.removeEventListener('storage', listener)

    expect(listener).toHaveBeenCalledTimes(1)
  })
})
