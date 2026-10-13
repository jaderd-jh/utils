import { beforeEach, describe, expect, it } from 'vitest'
import { aes, AESDecrypt, AESEncrypt } from '../src/aes'
import { setCryptoKey } from '../src/key'

const KEY_128 = '0123456789abcdef'
const KEY_192 = '0123456789abcdef01234567'
const KEY_256 = '28a25213fc68550565e13b6ffc3639af'
const WARNING = '请先使用 setCryptoKey 设置加密密钥'

describe('aes', () => {
  it('throws when no key has been configured', () => {
    expect(() => aes.encrypt('foo')).toThrow(WARNING)
    expect(() => aes.decrypt('foo')).toThrow(WARNING)
    expect(() => AESEncrypt('foo')).toThrow(WARNING)
    expect(() => AESDecrypt('foo')).toThrow(WARNING)
  })

  describe('aes-256 (32 byte key)', () => {
    beforeEach(() => setCryptoKey(KEY_256))

    it('encrypts to a deterministic ECB/PKCS7 ciphertext', () => {
      expect(AESEncrypt('')).toBe('o1iWlo3a1TDMCivF5Nc2bA==')
      expect(AESEncrypt('foo')).toBe('EzuN6n3fR/uSjWOKguGpHA==')
      expect(AESEncrypt('你好世界')).toBe('5Bv3DEE5FGekWGn8nD5/xA==')
      expect(AESEncrypt('The quick brown fox jumps over the lazy dog')).toBe(
        'AAOnfy1odKim9e9dnBaL2sQNYofKiaUPX+r9LoT2pklIzoB/+8Oa4OHR5zNUDN/1'
      )
    })

    it('decrypts back to the original plaintext', () => {
      expect(AESDecrypt('o1iWlo3a1TDMCivF5Nc2bA==')).toBe('')
      expect(AESDecrypt('EzuN6n3fR/uSjWOKguGpHA==')).toBe('foo')
      expect(AESDecrypt('5Bv3DEE5FGekWGn8nD5/xA==')).toBe('你好世界')
    })

    it('round-trips a range of payloads', () => {
      for (const value of ['', 'a', 'foo', 'hello world', '你好世界', 'x'.repeat(1000)]) {
        expect(aes.decrypt(aes.encrypt(value))).toBe(value)
      }
    })
  })

  describe('aes-128 (16 byte key)', () => {
    beforeEach(() => setCryptoKey(KEY_128))

    it('encrypts to a deterministic ECB/PKCS7 ciphertext', () => {
      expect(AESEncrypt('')).toBe('N3Ii4GGpJMWRzZwn6hY+1A==')
      expect(AESEncrypt('foo')).toBe('koEKmMNO64IAjCTazuFX/A==')
      expect(AESEncrypt('hello world')).toBe('gWm+1O9JqIdFWcWyANqt5w==')
    })

    it('round-trips a range of payloads', () => {
      for (const value of ['', 'foo', 'hello world', '你好世界']) {
        expect(aes.decrypt(aes.encrypt(value))).toBe(value)
      }
    })
  })

  describe('aes-192 (24 byte key)', () => {
    beforeEach(() => setCryptoKey(KEY_192))

    it('encrypts to a deterministic ECB/PKCS7 ciphertext', () => {
      expect(AESEncrypt('')).toBe('DGdTta4MJQgKttDjLjGNMg==')
      expect(AESEncrypt('foo')).toBe('9+Jcw8aZh3+4MHu6T4dKZw==')
      expect(AESEncrypt('hello world')).toBe('WwewzJCE/LpLGdZR4elkJA==')
    })

    it('round-trips a range of payloads', () => {
      for (const value of ['', 'foo', 'hello world', '你好世界']) {
        expect(aes.decrypt(aes.encrypt(value))).toBe(value)
      }
    })
  })
})
