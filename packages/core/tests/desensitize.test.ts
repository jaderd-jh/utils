import { describe, expect, it } from 'vitest'
import {
  hideBankCard,
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

describe('desensitize', () => {
  it('hidePhone', () => {
    expect(hidePhone(null)).toBe('')
    expect(hidePhone(undefined)).toBe('')
    expect(hidePhone('')).toBe('')
    expect(hidePhone('12345678901')).toBe('12345678901')
    expect(hidePhone('18982398471')).toBe('189****8471')
    expect(hidePhone('189 82398471')).toBe('189****8471')
    expect(hidePhone('189 8239 8471')).toBe('189****8471')
    expect(hidePhone('157988909090')).toBe('157988909090')
    expect(hidePhone('057988909090')).toBe('0579****9090')
    expect(hidePhone('0579-8890909')).toBe('0579****0909')
    expect(hidePhone('0579-88909090')).toBe('0579****9090')
    expect(hidePhone('(0579)88909090')).toBe('0579****9090')
    expect(hidePhone('(0579) 88909090')).toBe('0579****9090')
    expect(hidePhone('(0579) 8890 9090')).toBe('0579****9090')
    expect(hidePhone('0105293382')).toBe('010****3382')
    expect(hidePhone('01052933827')).toBe('0105****3827')
    expect(hidePhone('010-5293382')).toBe('010****3382')
    expect(hidePhone('010-52933827')).toBe('010****3827')
    expect(hidePhone('(010)52933827')).toBe('010****3827')
    expect(hidePhone('(010) 52933827')).toBe('010****3827')
    expect(hidePhone('(010) 5293 3827')).toBe('010****3827')
  })

  it('hideCardNo', () => {
    expect(hideCardNo(null)).toBe('')
    expect(hideCardNo(undefined)).toBe('')
    expect(hideCardNo('')).toBe('')
    expect(hideCardNo('12345678901')).toBe('12345678901')
    expect(hideCardNo('134546789017')).toBe('134546789017')
    expect(hideCardNo('33072319641008384x')).toBe('3****************x')
    expect(hideCardNo('33072319641008384x', false)).toBe('3***23196410*****x')
  })

  it('hideName', () => {
    expect(hideName(null)).toBe('')
    expect(hideName(undefined)).toBe('')
    expect(hideName('小明')).toBe('*明')
    expect(hideName('财神爷')).toBe('*神爷')
    expect(hideName('古力娜扎')).toBe('*力娜扎')
    expect(hideName('Tom Holland')).toBe('*om Holland')
  })

  it('hideSurname', () => {
    expect(hideSurname(null)).toBe('')
    expect(hideSurname(undefined)).toBe('')
    expect(hideSurname('')).toBe('')
    expect(hideSurname('小明')).toBe('*明')
    expect(hideSurname('财神爷')).toBe('*神爷')
    expect(hideSurname('古力娜扎')).toBe('*力娜扎')
    expect(hideSurname('Tom Holland')).toBe('*om Holland')
  })

  it('hideFirstName', () => {
    expect(hideFirstName(null)).toBe('')
  })

  it('hideEmail', () => {
    expect(hideEmail(null)).toBe('')
    expect(hideEmail(undefined)).toBe('')
    expect(hideEmail('')).toBe('')
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

  it('hideMiddle', () => {
    expect(hideMiddle(null)).toBe('')
    expect(hideMiddle(undefined)).toBe('')
    expect(hideMiddle('')).toBe('')
    expect(hideMiddle('鸡')).toBe('*')
    expect(hideMiddle('小明')).toBe('**')
    expect(hideMiddle('财神爷')).toBe('财*爷')
    expect(hideMiddle('古力娜扎')).toBe('古**扎')
    expect(hideMiddle('Tom Holland')).toBe('T*********d')
  })

  it('hideThird', () => {
    expect(hideThird(null)).toBe('')
    expect(hideThird(undefined)).toBe('')
    expect(hideThird('')).toBe('')
    expect(hideThird('鸡')).toBe('*')
    expect(hideThird('小明')).toBe('**')
    expect(hideThird('财神爷')).toBe('财*爷')
    expect(hideThird('古力娜扎')).toBe('古**扎')
    expect(hideThird('完颜阿骨打')).toBe('完颜*骨打')
    expect(hideThird('花和尚鲁智深')).toBe('花和**智深')
    expect(hideThird('Tom Holland')).toBe('Tom ***land')
  })

  it('hideHead', () => {
    expect(hideHead(null)).toBe('')
    expect(hideHead(undefined)).toBe('')
    expect(hideHead('')).toBe('')
    expect(hideHead('鸡')).toBe('*')
    expect(hideHead('小明')).toBe('*明')
    expect(hideHead('财神爷')).toBe('**爷')
    expect(hideHead('古力娜扎')).toBe('***扎')
    expect(hideHead('古力娜扎', -1)).toBe('古力娜扎')
    expect(hideHead('古力娜扎', 0)).toBe('古力娜扎')
    expect(hideHead('古力娜扎', 1)).toBe('*力娜扎')
    expect(hideHead('古力娜扎', 4)).toBe('****')
    expect(hideHead('古力娜扎', 5)).toBe('****')
  })

  it('hideTail', () => {
    expect(hideTail(null)).toBe('')
    expect(hideTail(undefined)).toBe('')
    expect(hideTail('')).toBe('')
    expect(hideTail('鸡')).toBe('*')
    expect(hideTail('小明')).toBe('小*')
    expect(hideTail('财神爷')).toBe('财**')
    expect(hideTail('古力娜扎')).toBe('古***')
    expect(hideTail('古力娜扎', -1)).toBe('古力娜扎')
    expect(hideTail('古力娜扎', 0)).toBe('古力娜扎')
    expect(hideTail('古力娜扎', 1)).toBe('古力娜*')
    expect(hideTail('古力娜扎', 4)).toBe('****')
    expect(hideTail('古力娜扎', 5)).toBe('****')
  })

  it('hideBankCard', () => {
    expect(hideBankCard(null)).toBe('')
    expect(hideBankCard(undefined)).toBe('')
    expect(hideBankCard('')).toBe('')
    expect(hideBankCard('123')).toBe('123')
    expect(hideBankCard('1234567890123')).toBe('123456***0123')
  })
})
