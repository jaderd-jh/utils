import { describe, expect, it } from 'vitest'
import {
  camel2Kebab,
  camel2Pascal,
  camel2Snake,
  camel2Title,
  kebab2Camel,
  kebab2Pascal,
  kebab2Snake,
  kebab2Title,
  pascal2Camel,
  pascal2Kebab,
  pascal2Snake,
  pascal2Title,
  snake2Camel,
  snake2Kebab,
  snake2Pascal,
  snake2Title,
  title2Camel,
  title2Kebab,
  title2Pascal,
  title2Snake,
} from '../src'

const SNAKE_CASE = 'hello_world'
const KEBAB_CASE = 'hello-world'
const PASCAL_CASE = 'HelloWorld'
const CAMEL_CASE = 'helloWorld'
const TITLE_CASE = 'Hello World'

describe('snake case transform', () => {
  it('snake to kebab', () => {
    expect(snake2Kebab(SNAKE_CASE)).toBe(KEBAB_CASE)
  })

  it('snake to pascal', () => {
    expect(snake2Pascal(SNAKE_CASE)).toBe(PASCAL_CASE)
  })

  it('snake to camel', () => {
    expect(snake2Camel(SNAKE_CASE)).toBe(CAMEL_CASE)
  })

  it('snake to title', () => {
    expect(snake2Title(SNAKE_CASE)).toBe(TITLE_CASE)
  })
})

describe('kebab case transform', () => {
  it('kebab to snake', () => {
    expect(kebab2Snake(KEBAB_CASE)).toBe(SNAKE_CASE)
  })

  it('kebab to pascal', () => {
    expect(kebab2Pascal(KEBAB_CASE)).toBe(PASCAL_CASE)
  })

  it('kebab to camel', () => {
    expect(kebab2Camel(KEBAB_CASE)).toBe(CAMEL_CASE)
  })

  it('kebab to title', () => {
    expect(kebab2Title(KEBAB_CASE)).toBe(TITLE_CASE)
  })
})

describe('pascal case transform', () => {
  it('pascal to snake', () => {
    expect(pascal2Snake(PASCAL_CASE)).toBe(SNAKE_CASE)
  })

  it('pascal to kebab', () => {
    expect(pascal2Kebab(PASCAL_CASE)).toBe(KEBAB_CASE)
  })

  it('pascal to camel', () => {
    expect(pascal2Camel(PASCAL_CASE)).toBe(CAMEL_CASE)
  })

  it('pascal to title', () => {
    expect(pascal2Title(PASCAL_CASE)).toBe(TITLE_CASE)
  })
})

describe('camel case transform', () => {
  it('camel to snake', () => {
    expect(camel2Snake(CAMEL_CASE)).toBe(SNAKE_CASE)
  })

  it('camel to kebab', () => {
    expect(camel2Kebab(CAMEL_CASE)).toBe(KEBAB_CASE)
  })

  it('camel to pascal', () => {
    expect(camel2Pascal(CAMEL_CASE)).toBe(PASCAL_CASE)
  })

  it('camel to title', () => {
    expect(camel2Title(CAMEL_CASE)).toBe(TITLE_CASE)
  })
})

describe('title case transform', () => {
  it('title to snake', () => {
    expect(title2Snake(TITLE_CASE)).toBe(SNAKE_CASE)
  })

  it('title to kebab', () => {
    expect(title2Kebab(TITLE_CASE)).toBe(KEBAB_CASE)
  })

  it('title to pascal', () => {
    expect(title2Pascal(TITLE_CASE)).toBe(PASCAL_CASE)
  })

  it('title to camel', () => {
    expect(title2Camel(TITLE_CASE)).toBe(CAMEL_CASE)
  })
})
