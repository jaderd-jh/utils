import { expect, test } from 'vitest'
import { dateDuration, dateFmt, dayjs, filterObj, parseToJSON, replacer, reviver, toThousands } from '../src'

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

test('dateFmt', () => {
  expect(dateFmt(null)).toBe('')
  expect(dateFmt(undefined)).toBe('')
  expect(dateFmt('')).toBe('')
  expect(dateFmt(new Date('2020-01-01'))).toBe('2020-01-01 08:00:00')
  expect(dateFmt(dayjs('2020-01-01'))).toBe('2020-01-01 00:00:00')
  expect(dateFmt('2020-01-01')).toBe('2020-01-01 00:00:00')
  expect(dateFmt('2020-01-01 00:00:00')).toBe('2020-01-01 00:00:00')
  expect(dateFmt('2020-01-01 08:00:00')).toBe('2020-01-01 08:00:00')
  expect(dateFmt('2020-01-01 08:00:00', 'YYYY-MM-DD')).toBe('2020-01-01')
  expect(dateFmt('2020-01-01', 'YYYY-MM-DD HH:mm:ss')).toBe('2020-01-01 00:00:00')
  expect(dateFmt('2020-01-01', 'YYYY-MM')).toBe('2020-01')
  expect(dateFmt('2020-01-01 08:00:00', 'date')).toBe('2020-01-01')
  expect(dateFmt('2020-01-01', 'datetime')).toBe('2020-01-01 00:00:00')
})

test('dateDuration', () => {
  expect(dateDuration(null, null)).toBe('')
  expect(dateDuration(undefined, undefined)).toBe('')
  expect(dateDuration('2020', undefined)).toBe('')
  expect(dateDuration('1998-05-23', '2020-01-01')).toBe('21年7个月18天')
  expect(dateDuration('2019-10-29', '2020-01-01')).toBe('2个月零4天')
  expect(dateDuration('2019-12-21', '2020-01-01')).toBe('11天')
  expect(dateDuration('2019-12-29', '2020-01-01')).toBe('3天')
  expect(dateDuration('2018-12-29', '2020-01-01')).toBe('1年零3天')
  expect(dateDuration('2018-01-01', '2020-01-01')).toBe('2年')
})

test('toThousands', () => {
  expect(toThousands(100)).toBe('100')
  expect(toThousands(100000)).toBe('100,000')
  expect(toThousands(1000000.4567)).toBe('1,000,000.4567')
})
