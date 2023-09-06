import { expect, test } from 'vitest'
import {
  hideCardNo,
  hideEmail,
  hideFirstName,
  hideHead,
  hideMiddle,
  hideName,
  hidePhone,
  hideSurname,
  hideTail,
  hideThird,
} from '../src'

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
  expect(hideCardNo('12345678901')).toBe('12345678901')
  expect(hideCardNo('134546789017')).toBe('134546789017')
  expect(hideCardNo('33072319641008384x')).toBe('3****************x')
  expect(hideCardNo('33072319641008384x', false)).toBe('3***23196410*****x')
})

test('hideName', () => {
  expect(hideName(null)).toBe('')
  expect(hideName(undefined)).toBe('')
  expect(hideName('小明')).toBe('*明')
  expect(hideName('财神爷')).toBe('*神爷')
  expect(hideName('古力娜扎')).toBe('*力娜扎')
  expect(hideName('Tom Holland')).toBe('*om Holland')
})

test('hideSurname', () => {
  expect(hideSurname(null)).toBe('')
  expect(hideSurname(undefined)).toBe('')
  expect(hideSurname('小明')).toBe('*明')
  expect(hideSurname('财神爷')).toBe('*神爷')
  expect(hideSurname('古力娜扎')).toBe('*力娜扎')
  expect(hideSurname('Tom Holland')).toBe('*om Holland')
})

test('hideFirstName', () => {
  expect(hideFirstName(null)).toBe('')
})

test('hideEmail', () => {
  expect(hideEmail(null)).toBe('')
  expect(hideEmail(undefined)).toBe('')
  expect(hideEmail('1@email.com')).toBe('1***@email.com')
  expect(hideEmail('1')).toBe('1')
  expect(hideEmail('12')).toBe('12')
  expect(hideEmail('1@')).toBe('1@')
  expect(hideEmail('@1')).toBe('@1')
  expect(hideEmail('1@1')).toBe('1***@1')
  expect(hideEmail('12@email.com')).toBe('12***@email.com')
  expect(hideEmail('123@email.com')).toBe('123***@email.com')
  expect(hideEmail('1234@email.com')).toBe('1***@email.com')
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

test('hideHead', () => {
  expect(hideHead(null)).toBe('')
  expect(hideHead(undefined)).toBe('')
  expect(hideHead('鸡')).toBe('*')
  expect(hideHead('小明')).toBe('*明')
  expect(hideHead('财神爷')).toBe('**爷')
  expect(hideHead('古力娜扎')).toBe('***扎')
  expect(hideHead('古力娜扎', 0)).toBe('古力娜扎')
  expect(hideHead('古力娜扎', 1)).toBe('*力娜扎')
  expect(hideHead('古力娜扎', 4)).toBe('****')
  expect(hideHead('古力娜扎', 5)).toBe('****')
})

test('hideTail', () => {
  expect(hideTail(null)).toBe('')
  expect(hideTail(undefined)).toBe('')
  expect(hideTail('鸡')).toBe('*')
  expect(hideTail('小明')).toBe('小*')
  expect(hideTail('财神爷')).toBe('财**')
  expect(hideTail('古力娜扎')).toBe('古***')
})
