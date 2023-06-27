import { expect, test } from 'vitest'
import { filterObj, parseToJSON, replacer, reviver } from '../src'

test('parseToJSON', () => {
  expect(parseToJSON('')).toStrictEqual(null)
  expect(parseToJSON('{}')).toStrictEqual({})
})

test('replacer', () => {
  expect(JSON.stringify({ foo: 'bar' }, replacer)).toBe('{"foo":"bar"}')
  const map = new Map()
  map.set('foo', 'bar')
  expect(JSON.stringify({ foo: 'bar', map }, replacer)).toBe(
    '{"foo":"bar","map":{"dataType":"Map","value":[["foo","bar"]]}}'
  )
})

test('reviver', () => {
  expect(parseToJSON('{"foo":"bar"}', reviver)).toStrictEqual({ foo: 'bar' })
  const map = new Map()
  map.set('foo', 'bar')
  expect(parseToJSON('{"foo":"bar","map":{"dataType":"Map","value":[["foo","bar"]]}}', reviver)).toStrictEqual({
    foo: 'bar',
    map,
  })
})

test('filterObj', () => {
  expect(filterObj({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toStrictEqual({ a: 1, b: 2 })
  expect(filterObj({ a: 1, b: 2, c: 3 }, ['a', 'b'], true)).toStrictEqual({ c: 3 })
  expect(filterObj({ a: 1, b: 2, c: 3 }, ['a', 'b', 'd'])).toStrictEqual({ a: 1, b: 2 })
  expect(filterObj({ a: 1, b: 2, c: 3 }, ['d'])).toStrictEqual({})
  expect(filterObj({ a: 1, b: 2, c: 3 }, [], true)).toStrictEqual({ a: 1, b: 2, c: 3 })
})
