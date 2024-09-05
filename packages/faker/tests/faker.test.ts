import { describe, expect, it } from 'vitest'
import { fakeChance, fakeFloatRange } from '../src'

describe('faker', () => {
  it('fakeChance', () => {
    expect(fakeChance(1)).toBe(true)
    expect(fakeChance(0)).toBeUndefined()
  })

  it('fakeFloatRange', () => {
    expect(fakeFloatRange(0, 10, 3).toString().split('.')[1]!.length).toBeLessThanOrEqual(3)
  })
})
