import { describe, expect, it } from 'vitest'
import { md5, MD5Encrypt } from '../src/md5'

describe('md5', () => {
  it('encrypt', () => {
    expect(MD5Encrypt('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(MD5Encrypt('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
    expect(MD5Encrypt('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(MD5Encrypt('hello world')).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3')
    expect(MD5Encrypt('你好世界')).toBe('65396ee4aad0b4f17aacd1c6112ee364')
    expect(MD5Encrypt('The quick brown fox jumps over the lazy dog')).toBe('9e107d9d372bb6826bd81d3542a419d6')
  })

  it('is not decryptable', () => {
    expect(() => md5.decrypt('d41d8cd98f00b204e9800998ecf8427e')).toThrowError('MD5 is not a decryptable algorithm')
  })
})
