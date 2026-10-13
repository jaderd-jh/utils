/**
 * react 联动 atom 在 SSR（Node 环境，没有 window / localStorage）下的行为
 * - 导入期与渲染期都不能访问 localStorage，否则 SSR 直接抛 ReferenceError
 * - 没有 storage 时 atom 只在内存中工作
 * @vitest-environment node
 */
import { createStore, useAtom } from 'jotai'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { atomWithLocal, atomWithSession } from '../../src/react'

// 故意放在模块顶层：模块求值阶段（SSR 的导入期）就不能碰 localStorage
const localAtom = atomWithLocal<number>('ssr:local', 1)
const sessionAtom = atomWithSession<number>('ssr:session', 2)

function Counter() {
  const [local] = useAtom(localAtom)
  const [session] = useAtom(sessionAtom)

  return <span>{`${local}-${session}`}</span>
}

describe('react ssr', () => {
  it('runs in an environment without window and storage', () => {
    expect(typeof window).toBe('undefined')
    expect(typeof localStorage).toBe('undefined')
    expect(typeof sessionStorage).toBe('undefined')
  })

  it('reads the initial value when there is no storage', () => {
    const store = createStore()

    expect(store.get(localAtom)).toBe(1)
    expect(store.get(sessionAtom)).toBe(2)
  })

  it('keeps values in memory when writing without a storage', () => {
    const store = createStore()

    expect(() => store.set(localAtom, 5)).not.toThrow()
    expect(store.get(localAtom)).toBe(5)
  })

  it('renders on the server without a storage', () => {
    expect(renderToString(<Counter />)).toBe('<span>1-2</span>')
  })
})
