import { expect, test } from 'vitest'
import { hideCardNo, hideMiddle, hideName, hidePhone, hideThird } from '../src'

test('hidePhone', () => {
  expect(hidePhone(null)).toBe('')
  expect(hidePhone(undefined)).toBe('')
  expect(hidePhone('12345678901')).toBe('12345678901')
  expect(hidePhone('13454678901')).toBe('134****8901')
  expect(hidePhone('134546789017')).toBe('134546789017')
  expect(hidePhone('057988909090')).toBe('0579****9090')
})

test('hideCardNo', () => {
  expect(hideCardNo(null)).toBe('')
  expect(hideCardNo(undefined)).toBe('')
  expect(hideCardNo('12345678901')).toBe('1234*******01')
  expect(hideCardNo('13454678901')).toBe('1345*******01')
  expect(hideCardNo('134546789017')).toBe('1345*******17')
})

test('hideName', () => {
  expect(hideName(null)).toBe('')
  expect(hideName(undefined)).toBe('')
  expect(hideName('小明')).toBe('*明')
  expect(hideName('财神爷')).toBe('*神爷')
  expect(hideName('古力娜扎')).toBe('*力娜扎')
  expect(hideName('Tom Holland')).toBe('*om Holland')
})

test('hideMiddle', () => {
  expect(hideMiddle(null)).toBe('')
  expect(hideMiddle(undefined)).toBe('')
  expect(hideMiddle('鸡')).toBe('*')
  expect(hideMiddle('小明')).toBe('**')
  expect(hideMiddle('财神爷')).toBe('财*爷')
  expect(hideMiddle('古力娜扎')).toBe('古**扎')
  expect(hideMiddle('Tom Holland')).toBe('T*********d')
})

test('hideThird', () => {
  expect(hideThird(null)).toBe('')
  expect(hideThird(undefined)).toBe('')
  expect(hideThird('鸡')).toBe('*')
  expect(hideThird('小明')).toBe('**')
  expect(hideThird('财神爷')).toBe('财*爷')
  expect(hideThird('古力娜扎')).toBe('古**扎')
  expect(hideThird('完颜阿骨打')).toBe('完颜*骨打')
  expect(hideThird('花和尚鲁智深')).toBe('花和**智深')
  expect(hideThird('Tom Holland')).toBe('Tom ***land')
})
