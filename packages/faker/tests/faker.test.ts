import { expect, test } from 'vitest'
import { fakeChance, fakeFloatRange } from '../src'

test('fakeChance', () => {
  expect(fakeChance(1)).toBe(true)
  expect(fakeChance(0)).toBeUndefined()
})

test('fakeFloatRange', () => {
  expect(fakeFloatRange(0, 10, 3).toString().split('.')[1]!.length).toBeLessThanOrEqual(3)
})
