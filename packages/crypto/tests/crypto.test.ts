import { expect, test } from 'vitest'
import { MD5Encrypt, aes, base64, setCryptoKey } from '../src'

test('aes', () => {
  expect(() => aes.encrypt('foo')).toThrowError('请先设置加密key')
  expect(() => aes.decrypt('foo')).toThrowError('请先设置加密key')
  setCryptoKey('28a25213fc68550565e13b6ffc3639af')
  expect(aes.decrypt(aes.encrypt('foo'))).toBe('foo')
})

test('base64', () => {
  expect(base64.decrypt(base64.encrypt('foo'))).toBe('foo')
})

test('md5', () => {
  expect(MD5Encrypt('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
})
