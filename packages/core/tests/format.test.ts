import { expect, test } from 'vitest'
import {
  attachFmt,
  attachToArray,
  currencyFmt,
  dateDuration,
  dateFmt,
  dayjs,
  filterObj,
  parseToJSON,
  recoverFile,
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
  expect(dateDuration('1998-05-23', '2020-01-01')).toBe('21年7个月15天')
  expect(dateDuration('2019-10-29', '2020-01-01')).toBe('2个月零3天')
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
  expect(currencyFmt('100')).toBe('¥100.00')
  expect(currencyFmt('foo')).toBe('')
  expect(currencyFmt(100)).toBe('¥100.00')
  expect(currencyFmt(1000)).toBe('¥1,000.00')
  expect(currencyFmt(1000, 2)).toBe('¥1,000.00')
  expect(currencyFmt(1000.098, 1)).toBe('¥1,000.1')
  expect(currencyFmt(1000.098, 2)).toBe('¥1,000.10')
  expect(currencyFmt(1000.098, 3)).toBe('¥1,000.098')
  expect(currencyFmt(1000000)).toBe('¥1,000,000.00')
  expect(currencyFmt(BigInt(1000000))).toBe('¥1,000,000.00')
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

test('recoverFile', () => {
  expect(recoverFile({})).toStrictEqual({
    uri: undefined,
    url: undefined,
    uid: undefined,
    percent: 100,
    thumbUrl: undefined,
    status: 'done',
  })
  setBaseAttachUrl('http://localhost:3000/')
  expect(recoverFile({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' })).toStrictEqual({
    group: 'default',
    id: '123',
    name: 'demo.png',
    uri: 'xxxyyyzzz.png',
    url: 'http://localhost:3000/xxxyyyzzz.png',
    uid: 'xxxyyyzzz.png',
    percent: 100,
    thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
    status: 'done',
  })
  expect(recoverFile({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }, 'vant')).toStrictEqual({
    group: 'default',
    id: '123',
    name: 'demo.png',
    uri: 'xxxyyyzzz.png',
    url: 'http://localhost:3000/xxxyyyzzz.png',
    isImage: true,
    deletable: true,
    reupload: false,
    status: 'done',
  })
  expect(recoverFile({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }, 'el')).toStrictEqual({
    group: 'default',
    id: '123',
    name: 'demo.png',
    uri: 'xxxyyyzzz.png',
    url: 'http://localhost:3000/xxxyyyzzz.png',
    percentage: 100,
    status: 'success',
  })
})

test('attachToArray', () => {
  expect(attachToArray(null)).toStrictEqual([])
  expect(attachToArray(undefined)).toStrictEqual([])
  expect(attachToArray('')).toStrictEqual([])
  expect(attachToArray('[]')).toStrictEqual([])
  expect(attachToArray('{}')).toStrictEqual([])
  expect(attachToArray('[{}]')).toStrictEqual([])
  expect(attachToArray([])).toStrictEqual([])
  expect(attachToArray({})).toStrictEqual([])
  expect(attachToArray([{}])).toStrictEqual([])
  setBaseAttachUrl('http://localhost:3000/')
  expect(attachToArray('xxxyyyzzz.png')).toStrictEqual([
    {
      group: 'default',
      id: 'xxxyyyzzz.png',
      name: 'xxxyyyzzz.png',
      uri: 'xxxyyyzzz.png',
    },
  ])
  expect(attachToArray('{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
    },
  ])
  expect(attachToArray('[{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}]')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
    },
  ])
  expect(attachToArray({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' })).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
    },
  ])
  expect(attachToArray([{ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }])).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
    },
  ])
})

test('attachFmt', () => {
  expect(attachFmt(null)).toStrictEqual([])
  expect(attachFmt(undefined)).toStrictEqual([])
  expect(attachFmt('')).toStrictEqual([])
  expect(attachFmt('[]')).toStrictEqual([])
  expect(attachFmt('{}')).toStrictEqual([])
  expect(attachFmt('[{}]')).toStrictEqual([])
  expect(attachFmt([])).toStrictEqual([])
  expect(attachFmt({})).toStrictEqual([])
  expect(attachFmt([{}])).toStrictEqual([])
  setBaseAttachUrl('http://localhost:3000/')

  expect(attachFmt('xxxyyyzzz.png')).toStrictEqual([
    {
      group: 'default',
      id: 'xxxyyyzzz.png',
      name: 'xxxyyyzzz.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      uid: 'xxxyyyzzz.png',
      percent: 100,
      thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
      status: 'done',
    },
  ])
  expect(attachFmt('{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      uid: 'xxxyyyzzz.png',
      percent: 100,
      thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
      status: 'done',
    },
  ])
  expect(attachFmt('[{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}]')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      uid: 'xxxyyyzzz.png',
      percent: 100,
      thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
      status: 'done',
    },
  ])
  expect(attachFmt({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' })).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      uid: 'xxxyyyzzz.png',
      percent: 100,
      thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
      status: 'done',
    },
  ])
  expect(attachFmt([{ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }])).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      uid: 'xxxyyyzzz.png',
      percent: 100,
      thumbUrl: 'http://localhost:3000/xxxyyyzzz.png',
      status: 'done',
    },
  ])

  expect(attachFmt('xxxyyyzzz.png', 'vant')).toStrictEqual([
    {
      group: 'default',
      id: 'xxxyyyzzz.png',
      name: 'xxxyyyzzz.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      isImage: true,
      deletable: true,
      reupload: false,
      status: 'done',
    },
  ])
  expect(attachFmt('{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}', 'vant')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      isImage: true,
      deletable: true,
      reupload: false,
      status: 'done',
    },
  ])
  expect(attachFmt('[{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}]', 'vant')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      isImage: true,
      deletable: true,
      reupload: false,
      status: 'done',
    },
  ])
  expect(attachFmt({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }, 'vant')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      isImage: true,
      deletable: true,
      reupload: false,
      status: 'done',
    },
  ])
  expect(attachFmt([{ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }], 'vant')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      isImage: true,
      deletable: true,
      reupload: false,
      status: 'done',
    },
  ])

  expect(attachFmt('xxxyyyzzz.png', 'el')).toStrictEqual([
    {
      group: 'default',
      id: 'xxxyyyzzz.png',
      name: 'xxxyyyzzz.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      percentage: 100,
      status: 'success',
    },
  ])
  expect(attachFmt('{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}', 'el')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      percentage: 100,
      status: 'success',
    },
  ])
  expect(attachFmt('[{"id":"123","name":"demo.png","uri":"xxxyyyzzz.png","group":"default"}]', 'el')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      percentage: 100,
      status: 'success',
    },
  ])
  expect(attachFmt({ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }, 'el')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      percentage: 100,
      status: 'success',
    },
  ])
  expect(attachFmt([{ id: '123', name: 'demo.png', uri: 'xxxyyyzzz.png', group: 'default' }], 'el')).toStrictEqual([
    {
      group: 'default',
      id: '123',
      name: 'demo.png',
      uri: 'xxxyyyzzz.png',
      url: 'http://localhost:3000/xxxyyyzzz.png',
      percentage: 100,
      status: 'success',
    },
  ])
})
