import type { SetStorageConfig } from '../../src'
import { setCryptoKey } from '@jhqn/utils-crypto'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { aes, removeStorageAll, setLocal, storageParse, storageStringify } from '../../src'
import { atomWithLocal, atomWithSession } from '../../src/react'

const PREFIX = 'e2e:react:'
const CRYPTO_KEY = '0123456789abcdef'

const key = (name: string) => `${PREFIX}${name}`
const readValue = (container: HTMLElement) => container.querySelector('[data-testid="value"]')?.textContent ?? null
const click = (container: HTMLElement, testId: string) =>
  container.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)?.click()
const readData = <T,>(storage: Storage, storageKey: string) =>
  storageParse<T>(storage.getItem(storageKey) as string)?.data
const dispatchStorageEvent = (storage: Storage, storageKey: string | null) =>
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: storageKey,
      newValue: storageKey === null ? null : storage.getItem(storageKey),
      oldValue: storageStringify(0),
      storageArea: storage,
      url: window.location.href,
    })
  )

interface CounterProps {
  crypto?: boolean
  expiredAt?: number | null
  storage?: 'local' | 'session'
  storageKey: string
}

function Counter({ crypto = false, expiredAt = null, storage = 'local', storageKey }: CounterProps) {
  const valueAtom = useMemo(() => {
    const config: SetStorageConfig = { crypto, expiredAt }
    return storage === 'local'
      ? atomWithLocal<number | null>(storageKey, 0, config)
      : atomWithSession<number | null>(storageKey, 0, config)
  }, [crypto, expiredAt, storage, storageKey])
  const [value, setValue] = useAtom(valueAtom)

  return (
    <div>
      <span data-testid="value">{String(value)}</span>
      <button data-testid="increment" onClick={() => setValue(prev => (prev ?? 0) + 1)}>
        increment
      </button>
      <button data-testid="reset" onClick={() => setValue(null)}>
        reset
      </button>
    </div>
  )
}

beforeEach(() => {
  removeStorageAll(localStorage, new RegExp(`^${PREFIX}`))
  removeStorageAll(sessionStorage, new RegExp(`^${PREFIX}`))
})

describe('atomWithLocal', () => {
  it('renders the initial value without writing to localStorage', async () => {
    const storageKey = key('initial')

    const screen = await render(<Counter storageKey={storageKey} />)

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it('writes the versioned envelope when the atom is updated', async () => {
    const storageKey = key('update')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')

    await vi.waitFor(() => {
      expect(readValue(screen.container)).toBe('1')
      expect(readData<number>(localStorage, storageKey)).toBe(1)
    })
  })

  it('restores the persisted value on a fresh mount', async () => {
    const storageKey = key('restore')

    const first = await render(<Counter storageKey={storageKey} />)
    click(first.container, 'increment')
    await vi.waitFor(() => expect(readData<number>(localStorage, storageKey)).toBe(1))
    await first.unmount()

    const second = await render(<Counter storageKey={storageKey} />)

    expect(readValue(second.container)).toBe('1')
  })

  it('removes the key when the atom is reset to null', async () => {
    const storageKey = key('reset')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')
    await vi.waitFor(() => expect(localStorage.getItem(storageKey)).not.toBeNull())

    click(screen.container, 'reset')

    await vi.waitFor(() => expect(localStorage.getItem(storageKey)).toBeNull())
    expect(readValue(screen.container)).toBe('null')
  })

  it('syncs the value written by another tab', async () => {
    const storageKey = key('sync')

    const screen = await render(<Counter storageKey={storageKey} />)

    localStorage.setItem(storageKey, storageStringify(42))
    dispatchStorageEvent(localStorage, storageKey)

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('42'))
  })

  it('syncs the encrypted value written by another tab', async () => {
    const storageKey = key('crypto-sync')

    setCryptoKey(CRYPTO_KEY)
    const screen = await render(<Counter crypto storageKey={storageKey} />)

    localStorage.setItem(storageKey, aes.encrypt(storageStringify(42)))
    dispatchStorageEvent(localStorage, storageKey)

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('42'))
  })

  it('treats a storage event without a storageArea as the current storage', async () => {
    const storageKey = key('null-storage-area')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')
    await vi.waitFor(() => expect(readValue(screen.container)).toBe('1'))

    // 脚本手工构造的 StorageEvent 可能带 null 的 storageArea，此时只能按当前 storage 处理
    localStorage.setItem(storageKey, storageStringify(7))
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        newValue: storageStringify(7),
        storageArea: null,
        url: window.location.href,
      })
    )

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('7'))
  })

  it('falls back to the initial value and keeps foreign data untouched', async () => {
    const storageKey = key('foreign')
    const raw = JSON.stringify({ foo: 1 })

    localStorage.setItem(storageKey, raw)

    const screen = await render(<Counter storageKey={storageKey} />)

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBe(raw)
  })

  it('resets to the initial value when the storage is cleared in another tab', async () => {
    const storageKey = key('clear')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')
    await vi.waitFor(() => expect(readValue(screen.container)).toBe('1'))

    // clear() 派发的 StorageEvent 的 key 为 null
    localStorage.removeItem(storageKey)
    dispatchStorageEvent(localStorage, null)

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('0'))
  })

  it('ignores storage events of other keys and other storages', async () => {
    const storageKey = key('ignored-events')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')
    await vi.waitFor(() => expect(readValue(screen.container)).toBe('1'))

    sessionStorage.setItem(storageKey, storageStringify(42))
    dispatchStorageEvent(sessionStorage, storageKey)
    localStorage.setItem(key('another-key'), storageStringify(42))
    dispatchStorageEvent(localStorage, key('another-key'))

    await vi.waitFor(() => expect(readValue(screen.container)).toBe('1'))
  })

  it('removes the storage listener when the component unmounts', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const added = () => addSpy.mock.calls.filter(([type]) => type === 'storage').at(-1)?.[1]
    const removed = () => removeSpy.mock.calls.filter(([type]) => type === 'storage').at(-1)?.[1]

    try {
      const screen = await render(<Counter storageKey={key('unmount')} />)
      await screen.unmount()

      expect(added()).toBeTypeOf('function')
      expect(removed()).toBe(added())
    } finally {
      addSpy.mockRestore()
      removeSpy.mockRestore()
    }
  })

  it('logs instead of crashing when the storage cannot be read on a storage event', async () => {
    const storageKey = key('throwing-read')

    const screen = await render(<Counter storageKey={storageKey} />)
    click(screen.container, 'increment')
    await vi.waitFor(() => expect(readValue(screen.container)).toBe('1'))

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // localStorage 读取抛错（例如隐私模式下被禁用）时不该把整个事件回调炸掉
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('boom')
    })

    try {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: storageKey,
          newValue: null,
          storageArea: localStorage,
          url: window.location.href,
        })
      )

      expect(errorSpy).toHaveBeenCalled()
      expect(readValue(screen.container)).toBe('1')
    } finally {
      getItemSpy.mockRestore()
      errorSpy.mockRestore()
    }
  })

  it('stores encrypted values when crypto is enabled', async () => {
    const storageKey = key('crypto')

    setCryptoKey(CRYPTO_KEY)
    const screen = await render(<Counter crypto storageKey={storageKey} />)
    click(screen.container, 'increment')

    await vi.waitFor(() => {
      const ciphertext = localStorage.getItem(storageKey) as string
      expect(ciphertext).not.toContain('"data"')
      expect(storageParse<number>(aes.decrypt(ciphertext))?.data).toBe(1)
    })
  })

  it('writes the expiredAt given by the config', async () => {
    const storageKey = key('write-expired-at')
    const expiredAt = Date.now() + 60_000

    const screen = await render(<Counter expiredAt={expiredAt} storageKey={storageKey} />)
    click(screen.container, 'increment')

    await vi.waitFor(() =>
      expect(storageParse<number>(localStorage.getItem(storageKey) as string)?.expiredAt).toBe(expiredAt)
    )
  })

  it('falls back to the initial value and clears the expired data', async () => {
    const storageKey = key('expired')

    setLocal(storageKey, 42, { expiredAt: Date.now() - 1 })

    const screen = await render(<Counter storageKey={storageKey} />)

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it('falls back to the initial value and clears data written by another version', async () => {
    const storageKey = key('stale-version')

    localStorage.setItem(storageKey, JSON.stringify({ data: 42, expiredAt: null, version: '0.0.1' }))

    const screen = await render(<Counter storageKey={storageKey} />)

    expect(readValue(screen.container)).toBe('0')
    expect(localStorage.getItem(storageKey)).toBeNull()
  })
})

describe('atomWithSession', () => {
  it('stores values in sessionStorage only', async () => {
    const storageKey = key('session')

    const screen = await render(<Counter storage="session" storageKey={storageKey} />)
    click(screen.container, 'increment')

    await vi.waitFor(() => expect(readData<number>(sessionStorage, storageKey)).toBe(1))
    expect(localStorage.getItem(storageKey)).toBeNull()
  })
})
