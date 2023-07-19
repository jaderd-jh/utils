import { expect, test } from 'vitest'
import { base64 } from '../src/base64'
import { aes } from '../src/aes'
import { md5 } from '../src/md5'
import { setCryptoKey } from '../src/key'

test('aes', () => {
  expect(() => aes.encrypt('foo')).toThrowError('请先设置 加密key 或 环境变量VITE_CRYPTO_KEY')
  expect(() => aes.decrypt('foo')).toThrowError('请先设置 加密key 或 环境变量VITE_CRYPTO_KEY')
  setCryptoKey('28a25213fc68550565e13b6ffc3639af')
  expect(aes.decrypt(aes.encrypt('foo'))).toBe('foo')
})

test('base64', () => {
  expect(base64.decrypt(base64.encrypt('foo'))).toBe('foo')
})

test('md5', () => {
  expect(md5.encrypt('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
})
