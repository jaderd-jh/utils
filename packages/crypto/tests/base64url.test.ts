import { describe, expect, it } from 'vitest'
import { base64url, base64urlDecrypt, base64urlEncrypt } from '../src/base64url'

describe('base64url', () => {
  it('encrypt', () => {
    expect(base64urlEncrypt('')).toBe('')
    expect(base64urlEncrypt('a')).toBe('YQ')
    expect(base64urlEncrypt('ab')).toBe('YWI')
    expect(base64urlEncrypt('abc')).toBe('YWJj')
    expect(base64urlEncrypt('foo~bar baz??>>')).toBe('Zm9vfmJhciBiYXo_Pz4-')
    expect(base64urlEncrypt('你好世界')).toBe('5L2g5aW95LiW55WM')
  })

  it('produces an url-safe, unpadded string', () => {
    const encoded = base64urlEncrypt('foo~bar baz??>>')
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('decrypt', () => {
    expect(base64urlDecrypt('')).toBe('')
    expect(base64urlDecrypt('YQ')).toBe('a')
    expect(base64urlDecrypt('Zm9vfmJhciBiYXo_Pz4-')).toBe('foo~bar baz??>>')
  })

  it('round-trips a range of payloads', () => {
    for (const value of ['', 'a', 'ab', 'abc', 'foo~bar baz??>>', 'hello world', '你好世界', 'x'.repeat(1000)]) {
      expect(base64url.decrypt(base64url.encrypt(value))).toBe(value)
    }
  })
})
