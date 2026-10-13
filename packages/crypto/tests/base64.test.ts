import { describe, expect, it } from 'vitest'
import { base64, base64Decrypt, base64Encrypt } from '../src/base64'

describe('base64', () => {
  it('encrypt', () => {
    expect(base64Encrypt('')).toBe('')
    expect(base64Encrypt('a')).toBe('YQ==')
    expect(base64Encrypt('ab')).toBe('YWI=')
    expect(base64Encrypt('abc')).toBe('YWJj')
    expect(base64Encrypt('foo')).toBe('Zm9v')
    expect(base64Encrypt('hello world')).toBe('aGVsbG8gd29ybGQ=')
    expect(base64Encrypt('你好世界')).toBe('5L2g5aW95LiW55WM')
  })

  it('decrypt', () => {
    expect(base64Decrypt('')).toBe('')
    expect(base64Decrypt('YQ==')).toBe('a')
    expect(base64Decrypt('5L2g5aW95LiW55WM')).toBe('你好世界')
  })

  it('round-trips a range of payloads', () => {
    for (const value of ['', 'a', 'ab', 'abc', 'foo', 'hello world', '你好世界', 'x'.repeat(1000)]) {
      expect(base64.decrypt(base64.encrypt(value))).toBe(value)
    }
  })
})
