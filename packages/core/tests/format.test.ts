import { expect, test } from 'vitest'
import {
  attachFmt,
  currencyFmt,
  dateDuration,
  dateFmt,
  dayjs,
  filterObj,
  parseToJSON,
  replacer,
  resUrl,
  reviver,
  setBaseAttachUrl,
  toThousands,
} from '../src'

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

test('currencyFmt', () => {
  expect(currencyFmt(null)).toBe('')
  expect(currencyFmt(undefined)).toBe('')
  expect(currencyFmt('100')).toBe('¥100')
  expect(currencyFmt('foo')).toBe('')
  expect(currencyFmt(100)).toBe('¥100')
  expect(currencyFmt(1000)).toBe('¥1,000')
  expect(currencyFmt(1000, 2)).toBe('¥1,000.00')
  expect(currencyFmt(1000.098, 2)).toBe('¥1,000.10')
  expect(currencyFmt(1000000)).toBe('¥1,000,000')
  expect(currencyFmt(BigInt(1000000))).toBe('¥1,000,000')
})

test('resUrl', () => {
  expect(resUrl(undefined)).toBe(undefined)
  expect(() => resUrl('')).toThrowError('import.meta​.env.VITE_BASE_ATTACH_URL')
  setBaseAttachUrl('http://localhost:3000')
  expect(resUrl('')).toBe('http://localhost:3000/')
  expect(resUrl('foo.png')).toBe('http://localhost:3000/foo.png')
  expect(resUrl('http://foo.png')).toBe('http://foo.png')
  expect(resUrl('https://foo.png')).toBe('https://foo.png')
  expect(resUrl('blob:foo.png')).toBe('blob:foo.png')
  expect(resUrl('data:image/png;base64,foo.png')).toBe('data:image/png;base64,foo.png')
  setBaseAttachUrl('http://localhost:3000/')
  expect(resUrl('')).toBe('http://localhost:3000/')
  setBaseAttachUrl('http://localhost:3000////')
  expect(resUrl('')).toBe('http://localhost:3000/')
})

test('attachFmt', () => {
  expect(attachFmt(null)).toStrictEqual([])
  expect(attachFmt(undefined)).toStrictEqual([])
  expect(attachFmt('')).toStrictEqual([])
  expect(attachFmt('[]')).toStrictEqual([])
  expect(attachFmt('{}')).toStrictEqual([
    {
      content: undefined,
      percent: 100,
      status: 'done',
      uri: '',
      url: undefined,
    },
  ])
  expect(attachFmt('[{}]')).toStrictEqual([
    {
      content: undefined,
      percent: 100,
      status: 'done',
      uri: '',
      url: undefined,
    },
  ])
  setBaseAttachUrl('http://localhost:3000/')
  expect(attachFmt('xxxyyyzzz.png')).toStrictEqual([
    {
      content: 'http://localhost:3000/xxxyyyzzz.png',
      group: 'default',
      id: 'xxxyyyzzz.png',
      name: 'name',
      percent: 100,
      status: 'done',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
    },
  ])
  expect(attachFmt('{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}')).toStrictEqual([
    {
      content: 'http://localhost:3000/xxxyyyzzz.png',
      group: 'default',
      id: '123',
      name: 'demo.png',
      percent: 100,
      status: 'done',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
    },
  ])
  expect(attachFmt('[{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}]')).toStrictEqual([
    {
      content: 'http://localhost:3000/xxxyyyzzz.png',
      group: 'default',
      id: '123',
      name: 'demo.png',
      percent: 100,
      status: 'done',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
    },
  ])
  expect(attachFmt({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' })).toStrictEqual([
    {
      content: 'http://localhost:3000/xxxyyyzzz.png',
      group: 'default',
      id: '123',
      name: 'demo.png',
      percent: 100,
      status: 'done',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
    },
  ])
  expect(attachFmt([{ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }])).toStrictEqual([
    {
      content: 'http://localhost:3000/xxxyyyzzz.png',
      group: 'default',
      id: '123',
      name: 'demo.png',
      percent: 100,
      status: 'done',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
    },
  ])
})
