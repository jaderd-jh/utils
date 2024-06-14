import { describe, expect, it } from 'vitest'
import { naturalSort, naturalSortBy } from '../src'

const months = ['12月', '3月', '11月', '7月', '4月', '8月', '5月', '1月', '6月', '2月', '9月', '10月']

const sortedMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const years = ['2014年', '2015年', '2012年', '2021年', '2013年', '2018年', '2019年', '2017年', '2016年', '2020年']

const sortedYears = ['2012年', '2013年', '2014年', '2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '2021年']

const days = [
  '2021-12-01',
  '2021-03-01',
  '2021-11-01',
  '2021-07-01',
  '2021-04-01',
  '2021-08-01',
  '2021-05-01',
  '2021-01-01',
  '2021-06-01',
  '2021-02-01',
  '2021-09-01',
  '2021-10-01',
]

const sortedDays = [
  '2021-01-01',
  '2021-02-01',
  '2021-03-01',
  '2021-04-01',
  '2021-05-01',
  '2021-06-01',
  '2021-07-01',
  '2021-08-01',
  '2021-09-01',
  '2021-10-01',
  '2021-11-01',
  '2021-12-01',
]

const maybeUndef = [
  '12月',
  '3月',
  null,
  '11月',
  '7月',
  '4月',
  undefined,
  '8月',
  '5月',
  '1月',
  '6月',
  '2月',
  '9月',
  '10月',
]

const sortedMaybeUndef = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
  null,
  undefined,
]

const chartData = [
  { name: '12月', value: 0 },
  { name: '3月', value: 1 },
  { name: '11月', value: 2 },
  { name: '7月', value: 3 },
  { name: '4月', value: 4 },
  { name: '8月', value: 5 },
  { name: '5月', value: 6 },
  { name: '1月', value: 7 },
  { name: '6月', value: 8 },
  { name: '2月', value: 9 },
  { name: '9月', value: 10 },
  { name: '10月', value: 11 },
]

const sortedChartData = [
  { name: '1月', value: 7 },
  { name: '2月', value: 9 },
  { name: '3月', value: 1 },
  { name: '4月', value: 4 },
  { name: '5月', value: 6 },
  { name: '6月', value: 8 },
  { name: '7月', value: 3 },
  { name: '8月', value: 5 },
  { name: '9月', value: 10 },
  { name: '10月', value: 11 },
  { name: '11月', value: 2 },
  { name: '12月', value: 0 },
]

const chartData1 = [
  { name: '1月', value: 7 },
  { name: '2月', value: 9 },
  { name: '3月', value: 1 },
  { name: '4月', value: null },
  { name: '5月', value: 6 },
  { name: '6月', value: 8 },
  { name: '7月', value: 3 },
  { name: '8月', value: 5 },
  { name: '9月', value: null },
  { name: '10月', value: 11 },
  { name: '11月', value: 2 },
  { name: '12月', value: 0 },
]

const sortedChartData1 = [
  { name: '12月', value: 0 },
  { name: '3月', value: 1 },
  { name: '11月', value: 2 },
  { name: '7月', value: 3 },
  { name: '8月', value: 5 },
  { name: '5月', value: 6 },
  { name: '1月', value: 7 },
  { name: '6月', value: 8 },
  { name: '2月', value: 9 },
  { name: '10月', value: 11 },
  { name: '9月', value: null },
  { name: '4月', value: null },
]

describe('naturalSort', () => {
  it('naturalSort should works for normal array', () => {
    expect(naturalSort(months)).toEqual(sortedMonths)
    expect(naturalSort(years)).toEqual(sortedYears)
    expect(naturalSort(days)).toEqual(sortedDays)
  })
  it('naturalSort undefined or null', () => {
    expect(naturalSort(maybeUndef)).toEqual(sortedMaybeUndef)
  })
})

describe('naturalSortBy', () => {
  it('naturalSortBy should works for normal array', () => {
    expect(naturalSortBy(chartData, 'name')).toEqual(sortedChartData)
    expect(naturalSortBy(sortedChartData, 'value')).toEqual(chartData)
  })
  it('naturalSortBy with undefined or null', () => {
    expect(naturalSortBy(chartData1, 'value')).toEqual(sortedChartData1)
  })
})
