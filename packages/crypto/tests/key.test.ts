import { describe, expect, it } from 'vitest'
import { aes } from '../src/aes'
import { getCryptoKey, setCryptoKey } from '../src/key'

describe('key', () => {
  it('returns undefined before a key has been configured', () => {
    expect(getCryptoKey()).toBeUndefined()
  })

  it('exposes the configured key', () => {
    setCryptoKey('28a25213fc68550565e13b6ffc3639af')
    expect(getCryptoKey()).toBeDefined()
    expect(aes.decrypt(aes.encrypt('foo'))).toBe('foo')
  })
})
