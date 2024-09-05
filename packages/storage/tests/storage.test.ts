import { describe, expect, it } from 'vitest'
import { getLocal, getSession, setLocal, setSession, storageParse, storageStringify, validateData } from '../src'

describe('storage', () => {
  it('setLocal', () => {
    const key = 'key'
    const value = { foo: 1 }
    setLocal(key, value, { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() })
    expect(localStorage.getItem(key)).toBe('{"data":{"foo":1},"expiresAt":1919748625666,"version":"0.0.1"}')
  })

  it('getLocal', () => {
    const key = 'key'
    const value = { foo: 1 }
    const config = { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() }
    setLocal(key, value, config)
    expect(getLocal(key, config)).toEqual(value)
  })

  it('setSession', () => {
    const key = 'key'
    const value = { foo: 1 }
    setSession(key, value, { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() })
    expect(localStorage.getItem(key)).toBe('{"data":{"foo":1},"expiresAt":1919748625666,"version":"0.0.1"}')
  })

  it('getSession', () => {
    const key = 'key'
    const value = { foo: 1 }
    const config = { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() }
    setSession(key, value, config)
    expect(getSession(key, config)).toEqual(value)
  })

  it('storageStringify', () => {
    const value = { foo: 1 }
    const config = { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() }
    expect(storageStringify(value, config)).toBe('{"data":{"foo":1},"expiresAt":1919748625666,"version":"0.0.1"}')
  })

  it('storageParse', () => {
    const value = '{"data":{"foo":1},"expiresAt":1919748625666,"version":"0.0.1"}'
    const config = { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() }
    expect(storageParse(value, config)).toStrictEqual({ data: { foo: 1 }, expiresAt: 1919748625666, version: '0.0.1' })
  })

  it('validateData', () => {
    const value = '{"data":{"foo":1},"expiresAt":1919748625666,"version":"0.0.0"}'
    const config = { expiresAt: new Date('2030-11-01 15:30:25:666').getTime() }
    expect(validateData(storageParse(value, config), config)).toBeNull()

    const value2 = '{"data":{"foo":1},"expiresAt":1725519887218,"version":"0.0.1"}'
    const config2 = { expiresAt: new Date('2024-09-05 12:30:25:666').getTime() }
    expect(validateData(storageParse(value2, config2), config2)).toBeNull()
  })
})
