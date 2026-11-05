/**
 * react 联动 atom 在 jsdom（有 localStorage）下的行为
 * - 写盘失败时不能让内存值偷偷改掉
 * - 失效数据要清理，其它库写入的数据要保留
 */
import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { storageParse } from '../../src'
import { atomWithLocal, atomWithSession } from '../../src/react'

const UNSERIALIZABLE = '需要存储的 data 不支持 JSON.stringify 方法，请检查当前数据'
const NOW = 1_900_000_000_000

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('atomWithLocal', () => {
  it('keeps the in-memory value when the storage write fails', () => {
    const store = createStore()
    const atom = atomWithLocal<number | bigint>('atom:unserializable', 1)

    expect(() => store.set(atom, BigInt(1))).toThrow(UNSERIALIZABLE)
    expect(store.get(atom)).toBe(1)
    expect(localStorage.getItem('atom:unserializable')).toBeNull()
  })

  it('removes the key when the atom is set to null', () => {
    const store = createStore()
    const atom = atomWithLocal<number | null>('atom:null', 1)

    store.set(atom, 2)
    expect(storageParse<number>(localStorage.getItem('atom:null') as string)?.data).toBe(2)

    store.set(atom, null)
    expect(store.get(atom)).toBeNull()
    expect(localStorage.getItem('atom:null')).toBeNull()
  })

  it('refreshes the expiry on every write when expiresIn is used', () => {
    // 绑定在创建时就把绝对时刻固定下来会导致后续写入沿用旧时刻，甚至写进「已经过期」的数据；
    // 使用 TTL 时每次写入都必须基于当前时间重新计算
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)

    try {
      const store = createStore()
      const atom = atomWithLocal<number>('atom:ttl', 1, { expiresIn: '1h' })

      store.set(atom, 2)
      expect(storageParse<number>(localStorage.getItem('atom:ttl') as string)?.expiredAt).toBe(NOW + 3_600_000)

      vi.setSystemTime(NOW + 60_000)
      store.set(atom, 3)
      expect(storageParse<number>(localStorage.getItem('atom:ttl') as string)?.expiredAt).toBe(NOW + 60_000 + 3_600_000)
    } finally {
      vi.useRealTimers()
    }
  })

  it('falls back to the initial value and keeps foreign data untouched', () => {
    const raw = JSON.stringify({ foo: 1 })
    localStorage.setItem('atom:foreign', raw)

    const store = createStore()
    const atom = atomWithLocal<number>('atom:foreign', 1)

    expect(store.get(atom)).toBe(1)
    expect(localStorage.getItem('atom:foreign')).toBe(raw)
  })

  it('falls back to the initial value and clears data of another version', () => {
    localStorage.setItem('atom:stale', JSON.stringify({ data: 42, expiredAt: null, version: '0.0.1' }))

    const store = createStore()
    const atom = atomWithLocal<number>('atom:stale', 1)

    expect(store.get(atom)).toBe(1)
    expect(localStorage.getItem('atom:stale')).toBeNull()
  })
})

describe('atomWithSession', () => {
  it('writes to sessionStorage only', () => {
    const store = createStore()
    const atom = atomWithSession<number>('atom:session', 1)

    store.set(atom, 5)

    expect(storageParse<number>(sessionStorage.getItem('atom:session') as string)?.data).toBe(5)
    expect(localStorage.getItem('atom:session')).toBeNull()
  })
})

describe('without a storage (SSR / Node)', () => {
  it('does not attach a storage listener when the storage is gone at mount time', () => {
    const store = createStore()
    const atom = atomWithLocal<number>('atom:no-storage', 1)
    const addSpy = vi.spyOn(window, 'addEventListener')

    vi.stubGlobal('localStorage', undefined)

    try {
      store.sub(atom, () => {})

      expect(addSpy.mock.calls.filter(([type]) => type === 'storage')).toHaveLength(0)
    } finally {
      vi.unstubAllGlobals()
      addSpy.mockRestore()
    }
  })
})
