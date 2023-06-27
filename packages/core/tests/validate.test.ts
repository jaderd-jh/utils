import { expect, test } from 'vitest'
import { checkImg, isArrStr, isDef, isJSONStr, isNumeric, isValidKey } from '../src'

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
})

test('isArrStr', () => {
  expect(isArrStr('{"foo":"bar"}')).toBe(false)
  expect(isArrStr('[{"foo":"bar"}]')).toBe(true)
  expect(isArrStr('[/{"foo":"bar"}]')).toBe(false)
})

test('isValidKey', () => {
  expect(isValidKey('a', { a: 1 })).toBe(true)
  expect(isValidKey('b', { a: 1 })).toBe(false)
})
