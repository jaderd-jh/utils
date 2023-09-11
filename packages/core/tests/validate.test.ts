import { expect, test } from 'vitest'
import {
  checkImg,
  isArrStr,
  isDef,
  isEmpty,
  isJSONStr,
  isNumeric,
  isValidArrRes,
  isValidFileType,
  isValidKey,
  isValidPageRes,
  isValidRes,
  isValidResCode,
} from '../src'

test('isDef', () => {
  expect(isDef(1)).toBe(true)
  expect(isDef('')).toBe(true)
  expect(isDef(false)).toBe(true)
  expect(isDef({})).toBe(true)
  expect(isDef(() => {})).toBe(true)
  expect(isDef(null)).toBe(false)
  expect(isDef(undefined)).toBe(false)
})

test('isNumeric', () => {
  expect(isNumeric('')).toBe(false)
  expect(isNumeric(' ')).toBe(false)
  expect(isNumeric('1')).toBe(true)
  expect(isNumeric('0')).toBe(true)
  expect(isNumeric('1.1')).toBe(true)
  expect(isNumeric('1.1.1')).toBe(false)
  expect(isNumeric(1)).toBe(true)
  expect(isNumeric(1.1)).toBe(true)
  expect(isNumeric(-1)).toBe(true)
  expect(isNumeric(null)).toBe(false)
  expect(isNumeric(undefined)).toBe(false)
})

test('checkImg', () => {
  expect(checkImg()).toBe(false)
  expect(checkImg('.jpg')).toBe(true)
  expect(checkImg('.jpeg')).toBe(true)
  expect(checkImg('.png')).toBe(true)
  expect(checkImg('.gif')).toBe(true)
  expect(checkImg('.heic')).toBe(false)
  expect(checkImg('.avif')).toBe(false)
})

test('isJSONStr', () => {
  expect(isJSONStr('{"foo":"bar"}')).toBe(true)
  expect(isJSONStr('{"foo":/"bar"}')).toBe(false)
  expect(isJSONStr('/{/"foo":/"bar"}')).toBe(false)
  expect(isJSONStr('')).toBe(false)
  expect(isJSONStr(null)).toBe(false)
  expect(isJSONStr(undefined)).toBe(false)
})

test('isArrStr', () => {
  expect(isArrStr('{"foo":"bar"}')).toBe(false)
  expect(isArrStr('[{"foo":"bar"}]')).toBe(true)
  expect(isArrStr('[/{"foo":"bar"}]')).toBe(false)
  expect(isArrStr(null)).toBe(false)
  expect(isArrStr(undefined)).toBe(false)
})

test('isValidKey', () => {
  expect(isValidKey('a', { a: 1 })).toBe(true)
  expect(isValidKey('b', { a: 1 })).toBe(false)
})

test('isValidFileType', () => {
  expect(isValidFileType(new File(['foo'], 'foo'), '')).toBe(false)
  expect(isValidFileType(new File(['foo'], 'foo.txt'), '*')).toBe(true)
  expect(isValidFileType(new File(['foo'], 'foo1.txt'), '.txt')).toBe(true)
  expect(isValidFileType(new File(['foo'], 'foo2.txt'), '.webp')).toBe(false)
  expect(isValidFileType(new File(['foo'], 'foo3.txt', { type: 'text/plain' }), '.webp')).toBe(false)
  expect(isValidFileType(new File(['foo'], 'foo4.avif', { type: 'image/avif' }), 'image/*')).toBe(true)
  expect(isValidFileType(new File(['foo'], 'foo5.png', { type: 'image/png' }), 'png*')).toBe(false)
  expect(isValidFileType(new File(['foo'], 'foo6.jpeg', { type: 'image/jpeg' }), '.docx,audio/* , image/jpeg')).toBe(
    true
  )
})

test('isEmpty', () => {
  expect(isEmpty(null)).toBe(true)
  expect(isEmpty(undefined)).toBe(true)
  expect(isEmpty('')).toBe(true)
  expect(isEmpty([])).toBe(true)
  expect(isEmpty({})).toBe(true)
  expect(isEmpty(new Set())).toBe(true)
  expect(isEmpty(new Map())).toBe(true)
  expect(isEmpty('a')).toBe(false)
  expect(isEmpty(['a'])).toBe(false)
  expect(isEmpty({ a: 1 })).toBe(false)
  expect(isEmpty(0)).toBe(false)
  expect(isEmpty(1)).toBe(false)
  expect(isEmpty(NaN)).toBe(false)
  expect(isEmpty(false)).toBe(false)
  expect(isEmpty(true)).toBe(false)
})

test('validateRes', () => {
  expect(isValidResCode({ code: 200, data: '', message: '' })).toBe(true)
  expect(isValidResCode({ code: 0, data: '', message: '' })).toBe(false)
  expect(isValidResCode({ code: 0, data: '', message: '' }, 0)).toBe(true)
  expect(isValidRes({ code: 200, data: '', message: '' })).toBe(true)
  expect(isValidRes({ code: 200, data: null, message: '' })).toBe(false)
  expect(isValidArrRes({ code: 200, data: [], message: '' })).toBe(true)
  expect(
    isValidPageRes({
      code: 200,
      data: {
        current: 1,
        pages: 10,
        list: [],
        records: [],
        searchCount: false,
        size: 10,
        total: 100,
      },
      message: '',
    })
  ).toBe(true)
})
