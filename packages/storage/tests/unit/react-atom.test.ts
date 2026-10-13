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

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('atomWithLocal', () => {
  it('keeps the in-memory value when the storage write fails', () => {
    const store = createStore()
    const atom = atomWithLocal<number | bigint>('atom:unserializable', 1)

    expect(() => store.set(atom, BigInt(1))).toThrowError(UNSERIALIZABLE)
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
