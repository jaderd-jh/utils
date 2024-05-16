import { expect, it } from 'vitest'
import {
  checkImg,
  getVariableType,
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

it('isDef', () => {
  expect(isDef(1)).toBe(true)
  expect(isDef('')).toBe(true)
  expect(isDef(false)).toBe(true)
  expect(isDef({})).toBe(true)
  expect(isDef(() => {})).toBe(true)
  expect(isDef(null)).toBe(false)
  expect(isDef(undefined)).toBe(false)
})

it('getType', () => {
  expect(getVariableType(1)).toBe('number')
  expect(getVariableType('')).toBe('string')
  expect(getVariableType(false)).toBe('boolean')
  expect(getVariableType({})).toBe('object')
  expect(getVariableType([])).toBe('array')
  expect(getVariableType(() => {})).toBe('function')
  expect(getVariableType(new Date())).toBe('date')
  expect(getVariableType(/a/)).toBe('regexp')
  expect(getVariableType(new Error('error'))).toBe('error')
  expect(getVariableType(new Set())).toBe('set')
  expect(getVariableType(new Map())).toBe('map')
  expect(getVariableType(Symbol(''))).toBe('symbol')
  expect(getVariableType(BigInt(1))).toBe('bigint')
  expect(getVariableType(new Promise(() => {}))).toBe('promise')
  expect(getVariableType(new WeakSet())).toBe('weakset')
  expect(getVariableType(new WeakMap())).toBe('weakmap')
  expect(getVariableType(new Int8Array())).toBe('int8array')
  expect(getVariableType(new Uint8Array())).toBe('uint8array')
  expect(getVariableType(new Uint8ClampedArray())).toBe('uint8clampedarray')
  expect(getVariableType(new Int16Array())).toBe('int16array')
  expect(getVariableType(new Uint16Array())).toBe('uint16array')
  expect(getVariableType(new Int32Array())).toBe('int32array')
  expect(getVariableType(new Uint32Array())).toBe('uint32array')
  expect(getVariableType(new Float32Array())).toBe('float32array')
  expect(getVariableType(new Float64Array())).toBe('float64array')
  expect(getVariableType(new BigInt64Array())).toBe('bigint64array')
  expect(getVariableType(new BigUint64Array())).toBe('biguint64array')
  expect(getVariableType(new URL('https://www.baidu.com'))).toBe('url')
  expect(getVariableType(new URLSearchParams())).toBe('urlsearchparams')
  expect(getVariableType(new ArrayBuffer(1))).toBe('arraybuffer')
  expect(getVariableType(new SharedArrayBuffer(1))).toBe('sharedarraybuffer')
  expect(getVariableType(new DataView(new ArrayBuffer(1)))).toBe('dataview')
  expect(getVariableType(new Blob())).toBe('blob')
  expect(getVariableType(new File(['foo'], 'foo.txt'))).toBe('file')
  // expect(getType(new Proxy({}, {}))).toBe('proxy')
  expect(getVariableType(null)).toBe('null')
  expect(getVariableType(undefined)).toBe('undefined')
})

it('isNumeric', () => {
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

it('checkImg', () => {
  expect(checkImg()).toBe(false)
  expect(checkImg('.jpg')).toBe(true)
  expect(checkImg('.jpeg')).toBe(true)
  expect(checkImg('.png')).toBe(true)
  expect(checkImg('.gif')).toBe(true)
  expect(checkImg('.heic')).toBe(false)
  expect(checkImg('.avif')).toBe(false)
})

it('isJSONStr', () => {
  expect(isJSONStr('{"foo":"bar"}')).toBe(true)
  expect(isJSONStr('{"foo":/"bar"}')).toBe(false)
  expect(isJSONStr('/{/"foo":/"bar"}')).toBe(false)
  expect(isJSONStr('')).toBe(false)
  expect(isJSONStr(null)).toBe(false)
  expect(isJSONStr(undefined)).toBe(false)
})

it('isArrStr', () => {
  expect(isArrStr('{"foo":"bar"}')).toBe(false)
  expect(isArrStr('[{"foo":"bar"}]')).toBe(true)
  expect(isArrStr('[/{"foo":"bar"}]')).toBe(false)
  expect(isArrStr(null)).toBe(false)
  expect(isArrStr(undefined)).toBe(false)
})

it('isValidKey', () => {
  expect(isValidKey('a', { a: 1 })).toBe(true)
  expect(isValidKey('b', { a: 1 })).toBe(false)
})

it('isValidFileType', () => {
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

it('isEmpty', () => {
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

it('validateRes', () => {
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
