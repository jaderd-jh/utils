import { beforeAll, expect, test } from 'vitest'
import { MD5Encrypt, aes, setKey } from '../src'

beforeAll(() => {
  setKey('28a25213fc68550565e13b6ffc3639af')
})

test('aes', () => {
  expect(aes.decrypt(aes.encrypt('1'))).toBe('1')
})

test('md5', () => {
  expect(MD5Encrypt('1')).toBe('c4ca4238a0b923820dcc509a6f75849b')
})
