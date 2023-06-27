import { expect, test } from 'vitest'
import { fakeChance } from '../src'

test('fakeChance', () => {
  expect(fakeChance(1)).toBe(true)
  expect(fakeChance(0)).toBeUndefined()
})
