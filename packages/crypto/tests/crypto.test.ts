import { expect, it } from 'vitest'
import { aes } from '../src/aes'
import { base64 } from '../src/base64'
import { setCryptoKey } from '../src/key'
import { md5 } from '../src/md5'

it('aes', () => {
  expect(() => aes.encrypt('foo')).toThrowError('请先使用 setCryptoKey 设置加密密钥')
  expect(() => aes.decrypt('foo')).toThrowError('请先使用 setCryptoKey 设置加密密钥')
  setCryptoKey('28a25213fc68550565e13b6ffc3639af')
  expect(aes.decrypt(aes.encrypt('foo'))).toBe('foo')
})

it('base64', () => {
  expect(base64.decrypt(base64.encrypt('foo'))).toBe('foo')
})

it('md5', () => {
  expect(md5.encrypt('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
})
