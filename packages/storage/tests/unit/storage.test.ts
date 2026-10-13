import type { StorageObj } from '../../types'
import { setCryptoKey } from '@jhqn/utils-crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  aes,
  getLocal,
  getSession,
  getStorage,
  hasLocal,
  hasSession,
  hasStorage,
  parseStorageData,
  readStorageRaw,
  removeLocal,
  removeLocalAll,
  removeSession,
  removeSessionAll,
  removeStorage,
  removeStorageAll,
  resolveStorageConfig,
  setLocal,
  setSession,
  setStorage,
  STORAGE_VERSION,
  storageParse,
  StorageStatus,
  storageStringify,
} from '../../src'

const CRYPTO_KEY = '0123456789abcdef'
const UNSERIALIZABLE = '需要存储的 data 不支持 JSON.stringify 方法，请检查当前数据'
const NOW = 1_900_000_000_000
// 不能使用 `key` / `length` / `getItem` 这类与 Storage 自身成员重名的 key 做普通用例，
// 它们专门用于验证 `hasStorage` 的重名场景
const KEY = 'jade-setting'

/** 手工写入一条与 `storageStringify` 结构一致的信封，便于精确控制 `expiredAt` / `version` */
function seed(
  storage: Storage,
  key: string,
  data: unknown,
  expiredAt: number | null = null,
  version = STORAGE_VERSION
) {
  storage.setItem(key, JSON.stringify({ data, expiredAt, version }))
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('storage version', () => {
  it('未改动信封结构时保持 0.1.0', () => {
    // 任何对信封结构（字段名/字段含义/字段数量）的改动都必须同步 bump 该版本号并更新此断言：
    // 版本不匹配的旧数据会在读取时被清理，避免旧结构被当成新结构解析
    expect(STORAGE_VERSION).toBe('0.1.0')
  })
})

describe('storageStringify', () => {
  it('wraps the data with the expiry time and the storage version', () => {
    expect(storageStringify({ foo: 1 })).toBe(`{"data":{"foo":1},"expiredAt":null,"version":"${STORAGE_VERSION}"}`)
  })

  it('accepts an absolute expiry time', () => {
    expect(storageStringify('foo', NOW + 1000)).toBe(
      `{"data":"foo","expiredAt":${NOW + 1000},"version":"${STORAGE_VERSION}"}`
    )
  })

  it('serializes Map and Set through the JSON replacer', () => {
    const serialized = (value: unknown) => JSON.parse(storageStringify(value)).data

    expect(serialized(new Map([['foo', 1]]))).toStrictEqual({ dataType: 'Map', value: [['foo', 1]] })
    expect(serialized(new Set([1, 2]))).toStrictEqual({ dataType: 'Set', value: [1, 2] })
  })

  it('serializes Date as a revivable marker', () => {
    // Date 不能直接落库（replacer 拿到的是 toJSON 之后的字符串），因此存成标记对象再由 reviver 还原
    expect(JSON.parse(storageStringify(new Date(NOW))).data).toStrictEqual({
      dataType: 'Date',
      value: new Date(NOW).toISOString(),
    })
  })

  it('throws for values JSON.stringify cannot represent', () => {
    expect(() => storageStringify(undefined)).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify(() => {})).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify(Symbol('foo'))).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify(BigInt(1))).toThrow(UNSERIALIZABLE)
  })

  it('throws for nested values JSON.stringify cannot represent', () => {
    // 嵌套的 BigInt 会让 JSON.stringify 抛原生 TypeError，Symbol / Function 则被静默丢弃，
    // 静默丢数据比直接报错更危险，因此统一抛出与顶层一致的错误
    expect(() => storageStringify({ nested: BigInt(1) })).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify([Symbol('foo')])).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify({ nested: () => {} })).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify(new Map([['foo', BigInt(1)]]))).toThrow(UNSERIALIZABLE)
    expect(() => storageStringify(new Set([Symbol('foo')]))).toThrow(UNSERIALIZABLE)
  })

  it('keeps nested undefined following the JSON semantics', () => {
    // 与 JSON.stringify 保持一致：对象里的 undefined 被丢弃、数组里的变成 null
    expect(JSON.parse(storageStringify({ foo: undefined, bar: 1 })).data).toStrictEqual({ bar: 1 })
    expect(JSON.parse(storageStringify([undefined, 1])).data).toStrictEqual([null, 1])
  })

  it('normalizes a non-finite expiry time to never expire', () => {
    // NaN / ±Infinity 都不是合法时刻，JSON 又会把它们静默写成 null，这里显式归一化以保证读写语义一致
    for (const expiredAt of [NaN, Infinity, -Infinity]) {
      expect(storageParse(storageStringify('foo', expiredAt))?.expiredAt).toBeNull()
    }
  })
})

describe('storageParse', () => {
  it('restores the versioned envelope', () => {
    expect(
      storageParse<{ foo: number }>(`{"data":{"foo":1},"expiredAt":null,"version":"${STORAGE_VERSION}"}`)
    ).toStrictEqual({
      data: { foo: 1 },
      expiredAt: null,
      version: STORAGE_VERSION,
    })
  })

  it('revives Map and Set through the JSON reviver', () => {
    const value = { map: new Map([['foo', 1]]), set: new Set([1, 2]) }
    const parsed = storageParse<typeof value>(storageStringify(value))

    expect(parsed?.data.map).toBeInstanceOf(Map)
    expect(parsed?.data.map.get('foo')).toBe(1)
    expect(parsed?.data.set).toBeInstanceOf(Set)
    expect(parsed?.data.set.has(2)).toBe(true)
  })

  it('revives the Date marker through the JSON reviver', () => {
    const parsed = storageParse<Date>(
      `{"data":{"dataType":"Date","value":"${new Date(NOW).toISOString()}"},"expiredAt":null,"version":"${STORAGE_VERSION}"}`
    )

    expect(parsed?.data).toBeInstanceOf(Date)
    expect(parsed?.data.getTime()).toBe(NOW)
  })

  it('returns null for values that are not JSON', () => {
    expect(storageParse('')).toBeNull()
    expect(storageParse('not json')).toBeNull()
  })

  it('returns null for JSON that is not a plain object envelope', () => {
    expect(storageParse('123')).toBeNull()
    expect(storageParse('"foo"')).toBeNull()
    expect(storageParse('[1,2]')).toBeNull()
    expect(storageParse('null')).toBeNull()
  })

  it('parses any plain object, the envelope validation happens later', () => {
    expect(storageParse('{"foo":1}')).toStrictEqual({ foo: 1 })
  })
})

describe('parseStorageData', () => {
  it('returns the data of a valid envelope', () => {
    expect(parseStorageData<string>(storageStringify('foo'))).toBe('foo')
  })

  it('returns null once the expiry time is reached', () => {
    const raw = storageStringify('foo', NOW + 1000)

    vi.setSystemTime(NOW + 999)
    expect(parseStorageData<string>(raw)).toBe('foo')

    vi.setSystemTime(NOW + 1000)
    expect(parseStorageData<string>(raw)).toBeNull()
  })

  it('returns null for an envelope written by another version', () => {
    expect(parseStorageData<string>(JSON.stringify({ data: 'foo', expiredAt: null, version: '0.0.1' }))).toBeNull()
  })

  it('returns null for the legacy envelope shape', () => {
    expect(parseStorageData<string>(JSON.stringify({ data: 'foo', expires: 1000, version: '0.0.1' }))).toBeNull()
  })

  it('returns null for data written by other libraries', () => {
    expect(parseStorageData<string>(JSON.stringify({ foo: 1 }))).toBeNull()
    expect(parseStorageData<string>(JSON.stringify({ version: 1, foo: 1 }))).toBeNull()
    expect(parseStorageData<string>(JSON.stringify({ data: 'foo' }))).toBeNull()
  })

  it('returns null for values that are not an envelope', () => {
    expect(parseStorageData('foo')).toBeNull()
    expect(parseStorageData('123')).toBeNull()
  })

  it('does not touch the underlying storage', () => {
    const raw = JSON.stringify({ data: 'foo', expiredAt: NOW - 1, version: STORAGE_VERSION })
    localStorage.setItem(KEY, raw)

    expect(parseStorageData<string>(localStorage.getItem(KEY) as string)).toBeNull()
    expect(localStorage.getItem(KEY)).toBe(raw)
  })
})

describe('readStorageRaw', () => {
  it('returns the data of a valid envelope', () => {
    expect(readStorageRaw<string>(storageStringify('foo'))).toStrictEqual({ data: 'foo', status: StorageStatus.Ok })
    // 信封里的 data 是 null 时同样算合法数据，由调用方决定怎么用
    expect(readStorageRaw<string>(storageStringify(null))).toStrictEqual({ data: null, status: StorageStatus.Ok })
  })

  it('reports data that is not our envelope as foreign', () => {
    // 其它库写在同名 key 上的数据必须原样保留，因此要和「本库但已失效」区分开
    const foreign = [
      null,
      '',
      'not json',
      '123',
      '[1,2]',
      JSON.stringify({ foo: 1 }),
      JSON.stringify({ data: 'foo' }),
      JSON.stringify({ version: STORAGE_VERSION }),
      JSON.stringify({ data: 'foo', version: 1 }),
    ]

    foreign.forEach(raw => {
      expect(readStorageRaw<string>(raw)).toStrictEqual({ status: StorageStatus.Foreign })
    })
  })

  it('reports our own invalid envelope as stale', () => {
    const stale = [
      // 版本不匹配（结构已变更）
      JSON.stringify({ data: 'foo', expiredAt: null, version: '0.0.1' }),
      // 旧版信封结构
      JSON.stringify({ data: 'foo', expires: NOW, version: '0.0.1' }),
      // 已过期（含刚好到达过期时刻）
      JSON.stringify({ data: 'foo', expiredAt: NOW, version: STORAGE_VERSION }),
      JSON.stringify({ data: 'foo', expiredAt: NOW - 1, version: STORAGE_VERSION }),
    ]

    stale.forEach(raw => {
      expect(readStorageRaw<string>(raw)).toStrictEqual({ status: StorageStatus.Stale })
    })
  })

  it('reports a failed decryption as foreign instead of stale', () => {
    // 解密失败可能只是密钥还没设置，据此删数据会误删（与 getStorage 的处理保持一致）
    expect(readStorageRaw<string>(storageStringify('foo'), { crypto: true })).toStrictEqual({
      status: StorageStatus.Foreign,
    })
    expect(readStorageRaw<string>('not-a-valid-ciphertext', { crypto: true })).toStrictEqual({
      status: StorageStatus.Foreign,
    })
  })
})

describe('storageStatus', () => {
  it('exposes the three read statuses', () => {
    // 枚举取值是 readStorageRaw 的对外契约，改名/改值都要当作破坏性变更处理
    expect(StorageStatus).toStrictEqual({ Ok: 'ok', Stale: 'stale', Foreign: 'foreign' })
  })
})

describe('resolveStorageConfig', () => {
  it('normalizes the boolean shorthand', () => {
    expect(resolveStorageConfig(true)).toStrictEqual({ crypto: true })
    expect(resolveStorageConfig(false)).toStrictEqual({ crypto: false })
  })

  it('passes through config objects and defaults to an empty one', () => {
    expect(resolveStorageConfig({ crypto: true, expiredAt: NOW })).toStrictEqual({ crypto: true, expiredAt: NOW })
    expect(resolveStorageConfig()).toStrictEqual({})
  })
})

describe('hasStorage', () => {
  it('detects keys of any Storage instance', () => {
    setLocal('local-key', 1)
    setSession('session-key', 1)

    expect(hasStorage(localStorage, 'local-key')).toBe(true)
    expect(hasStorage(sessionStorage, 'session-key')).toBe(true)
    expect(hasStorage(localStorage, 'session-key')).toBe(false)
    expect(hasStorage(localStorage, 'missing')).toBe(false)
  })

  it('exposes hasLocal and hasSession helpers', () => {
    expect(hasLocal('local-key')).toBe(false)
    expect(hasSession('session-key')).toBe(false)

    setLocal('local-key', 1)
    setSession('session-key', 1)

    expect(hasLocal('local-key')).toBe(true)
    expect(hasSession('session-key')).toBe(true)
  })

  it('detects keys that shadow Storage members', () => {
    // `key` / `length` / `getItem` 与 Storage 接口成员重名，Web IDL 不会把它们暴露为 own property，
    // 因此判断存在与否只能依赖 getItem
    setLocal('key', 'foo')
    setLocal('length', 3)
    setLocal('getItem', 'bar')

    expect(hasLocal('key')).toBe(true)
    expect(hasLocal('length')).toBe(true)
    expect(hasLocal('getItem')).toBe(true)
    expect(getLocal('key')).toBe('foo')
    expect(getLocal('length')).toBe(3)
    expect(getLocal('getItem')).toBe('bar')
  })
})

describe('setStorage', () => {
  it('writes the versioned envelope', () => {
    setStorage(localStorage, KEY, { foo: 1 })

    expect(localStorage.getItem(KEY)).toBe(`{"data":{"foo":1},"expiredAt":null,"version":"${STORAGE_VERSION}"}`)
  })

  it('writes the expiredAt given by the config', () => {
    setStorage(localStorage, KEY, 'foo', { expiredAt: NOW + 1000 })

    expect(storageParse(localStorage.getItem(KEY) as string)?.expiredAt).toBe(NOW + 1000)
  })

  it('throws for values JSON.stringify cannot represent', () => {
    const values = [undefined, () => {}, Symbol('foo'), BigInt(1)]

    for (const value of values) {
      expect(() => setStorage(localStorage, KEY, value)).toThrow(UNSERIALIZABLE)
    }

    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('round-trips a Date as a Date', () => {
    setStorage(localStorage, KEY, new Date(NOW))

    const restored = getStorage<Date>(localStorage, KEY)

    expect(restored).toBeInstanceOf(Date)
    expect(restored?.getTime()).toBe(NOW)
  })
})

describe('getStorage', () => {
  it('round-trips every value JSON.stringify can represent', () => {
    const values = ['foo', 0, 1, true, false, null, [1, 'two'], { foo: 1, bar: { baz: [2] } }]

    values.forEach((value, index) => {
      setStorage(localStorage, `key-${index}`, value)

      expect(getStorage(localStorage, `key-${index}`)).toStrictEqual(value)
    })
  })

  it('returns null when the key is missing', () => {
    expect(getStorage(localStorage, 'missing')).toBeNull()
  })

  it('returns null when the stored data is null', () => {
    // `data: null` 与「key 不存在」目前无法区分，两者都返回 null
    seed(localStorage, KEY, null)

    expect(getStorage(localStorage, KEY)).toBeNull()
  })

  it('returns null when the stored value is not JSON', () => {
    localStorage.setItem(KEY, 'raw-value')

    expect(getStorage(localStorage, KEY)).toBeNull()
  })

  it('returns null for a JSON value that is not an envelope', () => {
    localStorage.setItem(KEY, '123')

    expect(getStorage(localStorage, KEY)).toBeNull()
  })

  it('expires the value once the expiry time is reached', () => {
    setStorage(localStorage, KEY, 'foo', { expiredAt: NOW + 1000 })

    vi.setSystemTime(NOW + 999)
    expect(getStorage(localStorage, KEY)).toBe('foo')

    vi.setSystemTime(NOW + 1000)
    expect(getStorage(localStorage, KEY)).toBeNull()
    // 过期数据会被直接清理
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('treats an expiry time in the past as already expired', () => {
    setStorage(localStorage, KEY, 'foo', { expiredAt: NOW - 1 })

    expect(getStorage(localStorage, KEY)).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('keeps the value forever when expiredAt is null or omitted', () => {
    setStorage(localStorage, KEY, 'foo')
    setStorage(localStorage, `${KEY}-explicit`, 'foo', { expiredAt: null })

    vi.setSystemTime(NOW + 10 ** 12)

    expect(getStorage(localStorage, KEY)).toBe('foo')
    expect(getStorage(localStorage, `${KEY}-explicit`)).toBe('foo')
  })

  it('clears data written with another version', () => {
    seed(localStorage, KEY, 'foo', null, '0.0.1')

    expect(getStorage(localStorage, KEY)).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('keeps data written by other libraries untouched', () => {
    // 只有本库写入的信封（带 data 字段且 version 为字符串）才需要校验版本
    const foreign = [
      JSON.stringify({ foo: 1 }),
      JSON.stringify({ version: 1, foo: 1 }),
      JSON.stringify({ data: 'foo' }),
    ]

    foreign.forEach((raw, index) => {
      localStorage.setItem(`${KEY}-${index}`, raw)

      expect(getStorage(localStorage, `${KEY}-${index}`)).toBeNull()
      expect(localStorage.getItem(`${KEY}-${index}`)).toBe(raw)
    })
  })

  it('treats an envelope without the data field as invalid', () => {
    // JSON.stringify 会丢掉对象里的 undefined，落库后信封可能只剩 expiredAt / version
    localStorage.setItem(KEY, JSON.stringify({ expiredAt: null, version: STORAGE_VERSION }))

    expect(getStorage(localStorage, KEY)).toBeNull()
  })

  it('never expires when the expiry time is not a finite number', () => {
    setStorage(localStorage, KEY, 'foo', { expiredAt: NaN })
    setStorage(localStorage, `${KEY}-infinite`, 'foo', { expiredAt: Infinity })

    vi.setSystemTime(NOW + 10 ** 12)

    expect(getStorage(localStorage, KEY)).toBe('foo')
    expect(getStorage(localStorage, `${KEY}-infinite`)).toBe('foo')
  })

  it('clears data written with the legacy envelope shape', () => {
    localStorage.setItem(KEY, JSON.stringify({ data: 'foo', expires: 1000, version: '0.0.1' }))

    expect(getStorage(localStorage, KEY)).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })
})

describe('crypto', () => {
  beforeEach(() => setCryptoKey(CRYPTO_KEY))

  it('encrypts on write and decrypts on read', () => {
    setStorage(localStorage, KEY, { foo: 1 }, { crypto: true })

    const ciphertext = localStorage.getItem(KEY) as string
    expect(ciphertext).not.toContain('foo')

    const envelope = storageParse<{ foo: number }>(aes.decrypt(ciphertext))
    expect(envelope?.data).toStrictEqual({ foo: 1 })
    expect(envelope?.expiredAt).toBeNull()
    expect(envelope?.version).toBe(STORAGE_VERSION)
    expect(getStorage(localStorage, KEY, { crypto: true })).toStrictEqual({ foo: 1 })
  })

  it('applies the expiry time to encrypted values', () => {
    setStorage(localStorage, KEY, 'foo', { crypto: true, expiredAt: NOW + 1000 })

    vi.setSystemTime(NOW + 1000)

    expect(getStorage(localStorage, KEY, { crypto: true })).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('returns null instead of throwing when the data is not encrypted', () => {
    setStorage(localStorage, KEY, 'foo')

    expect(getStorage(localStorage, KEY, { crypto: true })).toBeNull()
    // 解密失败不代表数据已损坏（也可能只是还没设置密钥），因此不应清理原始数据
    expect(localStorage.getItem(KEY)).not.toBeNull()
  })

  it('clears stale envelopes that can be decrypted', () => {
    const stale = aes.encrypt(JSON.stringify({ data: 'foo', expiredAt: null, version: '0.0.1' }))
    localStorage.setItem(KEY, stale)

    expect(getStorage(localStorage, KEY, { crypto: true })).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })
})

describe('removeStorage', () => {
  it('removes a single key', () => {
    setStorage(localStorage, KEY, 'foo')

    removeStorage(localStorage, KEY)

    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('ignores keys that are not stored', () => {
    expect(() => removeStorage(localStorage, 'missing')).not.toThrow()
  })

  it('removes keys that shadow Storage members', () => {
    setLocal('key', 'foo')
    setLocal('getItem', 'bar')

    removeLocal('key')
    removeLocal('getItem')

    expect(hasLocal('key')).toBe(false)
    expect(hasLocal('getItem')).toBe(false)
  })
})

describe('removeStorageAll', () => {
  it('clears the whole storage when no pattern is given', () => {
    setLocal('local-key', 1)
    setSession('session-key', 1)

    removeStorageAll(localStorage)

    expect(localStorage.length).toBe(0)
    expect(getSession('session-key')).toBe(1)
  })

  it('only removes the keys matching the pattern', () => {
    setLocal('foo-1', 1)
    setLocal('foo-2', 1)
    setLocal('bar-1', 1)

    removeStorageAll(localStorage, /^foo/)

    expect(hasLocal('foo-1')).toBe(false)
    expect(hasLocal('foo-2')).toBe(false)
    expect(hasLocal('bar-1')).toBe(true)
  })

  it('removes every match even when the pattern is global', () => {
    // 带 `g` 的 RegExp.test 会保留 lastIndex，逐个 key 测试时会漏掉命中的 key
    setLocal('foo-1', 1)
    setLocal('foo-2', 1)
    setLocal('foo-3', 1)

    removeStorageAll(localStorage, /^foo/g)

    expect(localStorage.length).toBe(0)
  })

  it('removes every match even when the pattern is sticky', () => {
    setLocal('foo-1', 1)
    setLocal('foo-2', 1)
    setLocal('foo-3', 1)

    removeStorageAll(localStorage, /foo-\d/y)

    expect(localStorage.length).toBe(0)
  })

  it('removes keys that shadow Storage members', () => {
    setLocal('key', 1)
    setLocal('getItem', 1)

    removeStorageAll(localStorage, /^(key|getItem)$/)

    expect(hasLocal('key')).toBe(false)
    expect(hasLocal('getItem')).toBe(false)
  })
})

describe('localStorage and sessionStorage helpers', () => {
  it('stores values in the matching storage', () => {
    setLocal('local-key', 'local-value')
    setSession('session-key', 'session-value')

    expect(localStorage.getItem('local-key')).toContain('"local-value"')
    expect(sessionStorage.getItem('session-key')).toContain('"session-value"')
    expect(getLocal('local-key')).toBe('local-value')
    expect(getSession('session-key')).toBe('session-value')
  })

  it('removes values from the matching storage', () => {
    setLocal('local-key', 'local-value')
    setSession('session-key', 'session-value')

    removeLocal('local-key')
    removeSession('session-key')

    expect(getLocal('local-key')).toBeNull()
    expect(getSession('session-key')).toBeNull()
  })

  it('clears values from the matching storage', () => {
    setLocal('local-key', 1)
    setSession('session-key', 1)

    removeLocalAll()
    removeSessionAll()

    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })

  it('shares the envelope shape between storage and helpers', () => {
    setLocal('local-key', { foo: 1 })

    expect(storageParse<StorageObj>(localStorage.getItem('local-key') as string)?.version).toBe(STORAGE_VERSION)
  })

  it('expires values written through the helpers', () => {
    setLocal('local-key', 'local-value', { expiredAt: NOW + 1000 })
    setSession('session-key', 'session-value', { expiredAt: NOW + 1000 })

    vi.setSystemTime(NOW + 1000)

    expect(getLocal('local-key')).toBeNull()
    expect(getSession('session-key')).toBeNull()
  })
})
