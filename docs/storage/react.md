---
description: React 响应式存储 Atom，基于 Jotai 自动同步 localStorage 和组件状态
---

# React Storage

React 状态管理 Atom，基于 [Jotai](https://jotai.org/) 实现，自动同步 localStorage/sessionStorage 和 React 组件状态。

<llm-only>
React storage atoms based on Jotai state management.
Provides automatic synchronization between localStorage/sessionStorage and React state.
Supports encryption and decryption with @jhqn/utils-crypto.
</llm-only>

## 安装

```bash
# 推荐安装主包
npm add @jhqn/utils jotai

# 或单独安装子包
npm add @jhqn/utils-storage jotai

# pnpm
pnpm add @jhqn/utils jotai

# yarn
yarn add @jhqn/utils jotai
```

::: warning 依赖说明

- **React**：需要 React 18.0.0 或更高版本
- **Jotai**：需要 Jotai 2.0.0 或更高版本
  :::

## 导入方式

```ts
// 推荐：从主包导入
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'

// 可选：从子包导入
import { atomWithLocal, atomWithSession } from '@jhqn/utils-storage/react'
```

::: tip 包路径说明

- **包名**：`@jhqn/utils` 或 `@jhqn/utils-storage`
- **子路径**：`/react`（通过 package.json exports 配置）
- **完整导入路径**：`@jhqn/utils/storage/react`
  :::

## 工作原理

### 核心机制

`atomWithLocal` 和 `atomWithSession` 基于 Jotai 的原子状态管理，提供了以下核心功能：

1. **双向绑定**：原子状态和 localStorage/sessionStorage 自动同步
2. **状态持久化**：页面刷新后自动从存储中恢复状态
3. **跨标签页同步**：自动监听 storage 事件，实现多标签页状态同步
4. **加密支持**：可选的 AES 加密/解密
5. **函数式更新**：支持 `setValue(prev => newValue)` 形式的更新

### 数据流

```
组件状态 (Jotai Atom)
    ↕ (双向绑定)
atomWithStorage
    ↕ (getStorage/setStorage)
localStorage/sessionStorage
    ↕ (可选加密/解密)
磁盘存储
```

### 内部实现

```ts
// 内部使用的 atomWithStorage 实现
const atomWithStorage = <T>(
  storage: Storage,
  key: string,
  initialValue: T,
  crypto?: boolean
): WritableAtom<T, [T | ((prev: T) => T)], void> => {
  // 1. 从存储读取初始值
  const baseAtom = atom(getStorage<T>(storage, key, { crypto }) ?? initialValue)

  // 2. 监听跨标签页同步
  baseAtom.onMount = setSelf => {
    window.addEventListener('storage', e => {
      if (e.storageArea === storage && e.key === key) {
        setSelf(getStorage<T>(storage, key, { crypto }))
      }
    })
    return () => window.removeEventListener('storage', handler)
  }

  // 3. 返回可写原子
  return atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue = update instanceof Function ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      if (nextValue === null) {
        removeStorage(storage, key) // null 时删除存储
      } else {
        setStorage(storage, key, nextValue, { crypto })
      }
    }
  )
}
```

**关键特性**：

- **初始值**：优先从存储读取，不存在则使用提供的初始值
- **存储事件**：监听其他标签页的 storage 事件
- **null 处理**：设置为 null 时自动删除存储项
- **函数式更新**：支持传入更新函数

## atomWithLocal

localStorage 原子状态管理

### 参数

| 参数         | 类型    | 是否必填 | 描述                         |
| :----------- | :------ | :------- | :--------------------------- |
| key          | string  | true     | 存储键名                     |
| initialValue | T       | true     | 初始值（存储中无数据时使用） |
| crypto       | boolean | false    | 是否启用加密，默认 false     |

### 返回值

返回 `WritableAtom<T, [T | ((prev: T) => T)], void>` - Jotai 可写原子

### 类型约束

```ts
T extends any // 支持所有可序列化的类型
```

**支持的数据类型**：

- ✅ 字符串（string）
- ✅ 数字（number）
- ✅ 布尔值（boolean）
- ✅ 对象（object）
- ✅ 数组（Array）
- ✅ null
- ✅ Map（通过 replacer/reviver 支持）

### 基础用法

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal } from '@jhqn/utils/storage/react'

interface User {
  id: number
  name: string
  email: string
}

// 创建原子（在组件外部定义）
const userAtom = atomWithLocal<User>('user', {
  id: 0,
  name: '',
  email: '',
})

function UserProfile() {
  const [user, setUser] = useAtom(userAtom)

  // 直接更新
  const updateName = () => {
    setUser({ ...user, name: '张三' })
  }

  // 函数式更新
  const incrementId = () => {
    setUser(prev => ({ ...prev, id: prev.id + 1 }))
  }

  // 删除存储
  const clearUser = () => {
    setUser(null as any) // 设置为 null 会删除存储
  }

  return (
    <div>
      <p>ID: {user.id}</p>
      <p>用户名：{user.name}</p>
      <p>邮箱：{user.email}</p>

      <button onClick={updateName}>更新名字</button>
      <button onClick={incrementId}>增加 ID</button>
      <button onClick={clearUser}>清除数据</button>
    </div>
  )
}
```

## atomWithSession

sessionStorage 原子状态管理

### 参数

| 参数         | 类型    | 是否必填 | 描述                         |
| :----------- | :------ | :------- | :--------------------------- |
| key          | string  | true     | 存储键名                     |
| initialValue | T       | true     | 初始值（存储中无数据时使用） |
| crypto       | boolean | false    | 是否启用加密，默认 false     |

### 返回值

返回 `WritableAtom<T, [T | ((prev: T) => T)], void>` - Jotai 可写原子

### 基础用法

```tsx
import { useAtom } from 'jotai'
import { atomWithSession } from '@jhqn/utils/storage/react'

// 创建会话令牌原子
const tokenAtom = atomWithSession<string>('token', '')

function AuthComponent() {
  const [token, setToken] = useAtom(tokenAtom)

  const login = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'user', password: 'pass' }),
    })
    const data = await response.json()
    setToken(data.token)
  }

  const logout = () => {
    setToken('') // 清空 token
  }

  return (
    <div>
      {token ? (
        <>
          <p>已登录 (Token: {token.slice(0, 10)}...)</p>
          <button onClick={logout}>登出</button>
        </>
      ) : (
        <button onClick={login}>登录</button>
      )}
    </div>
  )
}
```

## 加密存储

### 配置加密密钥

使用加密功能前需要设置加密密钥：

```tsx
// App.tsx
import { setCryptoKey } from '@jhqn/utils'
import { Provider } from 'jotai'

// 设置加密密钥（推荐使用环境变量）
setCryptoKey(import.meta.env.VITE_CRYPTO_KEY)

function App() {
  return (
    <Provider>
      <YourApp />
    </Provider>
  )
}
```

### 环境变量配置

```env
# .env
VITE_CRYPTO_KEY=your-secret-key-from-env

# .env.production
VITE_CRYPTO_KEY=your-production-secret-key
```

### 使用加密原子

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal } from '@jhqn/utils/storage/react'

interface SensitiveData {
  apiKey: string
  apiSecret: string
  accessToken: string
}

// 创建加密原子（第三个参数为 true）
const credentialsAtom = atomWithLocal<SensitiveData>(
  'credentials',
  {
    apiKey: '',
    apiSecret: '',
    accessToken: '',
  },
  true
)

function ApiKeyManager() {
  const [credentials, setCredentials] = useAtom(credentialsAtom)

  const saveApiKey = (key: string, secret: string) => {
    setCredentials(prev => ({
      ...prev,
      apiKey: key,
      apiSecret: secret,
    }))
    // 数据会自动加密后存储
  }

  const updateToken = (token: string) => {
    setCredentials(prev => ({
      ...prev,
      accessToken: token,
    }))
  }

  const clearCredentials = () => {
    setCredentials({
      apiKey: '',
      apiSecret: '',
      accessToken: '',
    })
  }

  return (
    <div>
      <h2>API 密钥管理</h2>

      <div>
        <label>API Key:</label>
        <input
          type="password"
          value={credentials.apiKey}
          onChange={e =>
            setCredentials(prev => ({
              ...prev,
              apiKey: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label>API Secret:</label>
        <input
          type="password"
          value={credentials.apiSecret}
          onChange={e =>
            setCredentials(prev => ({
              ...prev,
              apiSecret: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label>Access Token:</label>
        <input type="password" value={credentials.accessToken} onChange={e => updateToken(e.target.value)} />
      </div>

      <button onClick={clearCredentials}>清除所有密钥</button>

      <p style={{ color: 'green', fontSize: '12px' }}>✅ 数据已加密存储</p>
    </div>
  )
}
```

## 完整示例

### 1. 主题切换系统

实现持久化的主题切换：

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal } from '@jhqn/utils/storage/react'
import { useEffect } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeConfig {
  theme: Theme
  systemPreference: 'light' | 'dark'
}

const themeAtom = atomWithLocal<ThemeConfig>('theme', {
  theme: 'light',
  systemPreference: 'light',
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useAtom(themeAtom)

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({
        ...prev,
        systemPreference: e.matches ? 'dark' : 'light',
      }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setConfig])

  // 应用主题
  useEffect(() => {
    const root = document.documentElement
    const effectiveTheme = config.theme === 'auto' ? config.systemPreference : config.theme

    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [config])

  return <>{children}</>
}

function ThemeToggle() {
  const [config, setConfig] = useAtom(themeAtom)

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(config.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setConfig(prev => ({ ...prev, theme: themes[nextIndex] }))
  }

  const themeLabels: Record<Theme, string> = {
    light: '☀️ 浅色',
    dark: '🌙 深色',
    auto: '🔄 自动',
  }

  return (
    <button onClick={cycleTheme} className="theme-toggle">
      {themeLabels[config.theme]}
    </button>
  )
}

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <header>
          <h1>我的应用</h1>
          <ThemeToggle />
        </header>
        <main>{/* 应用内容 */}</main>
      </div>
    </ThemeProvider>
  )
}
```

### 2. 多语言国际化

实现语言切换和持久化：

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal } from '@jhqn/utils/storage/react'

type Language = 'zh-CN' | 'en-US' | 'ja-JP'

interface I18nConfig {
  language: Language
  fallbackLanguage: Language
}

const i18nAtom = atomWithLocal<I18nConfig>('i18n', {
  language: 'zh-CN',
  fallbackLanguage: 'en-US',
})

// 简化的翻译字典
const translations: Record<Language, Record<string, string>> = {
  'zh-CN': {
    'app.title': '我的应用',
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.contact': '联系我们',
    'button.submit': '提交',
    'button.cancel': '取消',
  },
  'en-US': {
    'app.title': 'My App',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'button.submit': 'Submit',
    'button.cancel': 'Cancel',
  },
  'ja-JP': {
    'app.title': '私のアプリ',
    'nav.home': 'ホーム',
    'nav.about': 'について',
    'nav.contact': 'お問い合わせ',
    'button.submit': '送信',
    'button.cancel': 'キャンセル',
  },
}

function useTranslation() {
  const [config] = useAtom(i18nAtom)

  const t = (key: string): string => {
    return translations[config.language][key] || translations[config.fallbackLanguage][key] || key
  }

  return { t }
}

function LanguageSelector() {
  const [config, setConfig] = useAtom(i18nAtom)

  const languages: { code: Language; label: string }[] = [
    { code: 'zh-CN', label: '中文' },
    { code: 'en-US', label: 'English' },
    { code: 'ja-JP', label: '日本語' },
  ]

  return (
    <select
      value={config.language}
      onChange={e =>
        setConfig(prev => ({
          ...prev,
          language: e.target.value as Language,
        }))
      }
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}

function Navigation() {
  const { t } = useTranslation()

  return (
    <nav>
      <a href="/">{t('nav.home')}</a>
      <a href="/about">{t('nav.about')}</a>
      <a href="/contact">{t('nav.contact')}</a>
      <LanguageSelector />
    </nav>
  )
}
```

### 3. 购物车系统

完整的购物车实现：

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

// 购物车数据持久化到 localStorage
const cartAtom = atomWithLocal<CartItem[]>('shopping-cart', [])

// 会话 ID 存储到 sessionStorage
const sessionIdAtom = atomWithSession<string>('session-id', '')

function ShoppingCart() {
  const [cart, setCart] = useAtom(cartAtom)
  const [sessionId, setSessionId] = useAtom(sessionIdAtom)

  // 生成会话 ID
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [sessionId, setSessionId])

  // 添加商品
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // 更新数量
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== id))
    } else {
      setCart(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)))
    }
  }

  // 移除商品
  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  // 计算总价
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 计算总数量
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // 清空购物车
  const clearCart = () => {
    setCart([])
  }

  return (
    <div className="shopping-cart">
      <h2>购物车 ({totalCount} 件商品)</h2>

      {cart.length === 0 ? (
        <p>购物车是空的</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} width="80" />

                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="price">¥{item.price.toFixed(2)}</p>
                </div>

                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <p className="item-total">¥{(item.price * item.quantity).toFixed(2)}</p>

                <button onClick={() => removeItem(item.id)} className="remove-btn">
                  移除
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total">
              <span>总价：</span>
              <strong>¥{totalPrice.toFixed(2)}</strong>
            </div>

            <button onClick={clearCart} className="clear-btn">
              清空购物车
            </button>

            <button className="checkout-btn">去结算</button>
          </div>
        </>
      )}

      {/* 测试：添加商品按钮 */}
      <button
        onClick={() =>
          addItem({
            id: Date.now(),
            name: `商品 ${cart.length + 1}`,
            price: Math.random() * 100,
            image: '/placeholder.jpg',
          })
        }
      >
        添加商品（测试）
      </button>
    </div>
  )
}
```

### 4. 用户认证状态

完整的用户认证流程：

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal, atomWithSession } from '@jhqn/utils/storage/react'

interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  token: string
  refreshToken: string
  expiresAt: number
}

// 认证状态（加密存储）
const authAtom = atomWithLocal<AuthState>(
  'auth',
  {
    user: null,
    token: '',
    refreshToken: '',
    expiresAt: 0,
  },
  true
) // 启用加密

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useAtom(authAtom)

  // 检查 token 是否过期
  const isTokenExpired = () => {
    return auth.expiresAt > 0 && Date.now() > auth.expiresAt
  }

  // 自动刷新 token
  useEffect(() => {
    if (auth.token && isTokenExpired() && auth.refreshToken) {
      refreshAccessToken()
    }
  }, [auth])

  // 刷新 access token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      })
      const data = await response.json()

      setAuth(prev => ({
        ...prev,
        token: data.token,
        expiresAt: Date.now() + data.expiresIn * 1000,
      }))
    } catch (error) {
      // 刷新失败，清除认证状态
      logout()
    }
  }

  // 登录
  const login = async (username: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const data = await response.json()
      setAuth({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      })
      return true
    }

    return false
  }

  // 登出
  const logout = () => {
    setAuth({
      user: null,
      token: '',
      refreshToken: '',
      expiresAt: 0,
    })
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(username, password)
    if (success) {
      console.log('登录成功')
    } else {
      console.log('登录失败')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  )
}
```

### 5. 表单草稿自动保存

自动保存表单草稿：

```tsx
import { useAtom } from 'jotai'
import { atomWithLocal } from '@jhqn/utils/storage/react'

interface ArticleDraft {
  title: string
  content: string
  category: string
  tags: string[]
  lastSaved: number
}

const draftAtom = atomWithLocal<ArticleDraft>('article-draft', {
  title: '',
  content: '',
  category: '',
  tags: [],
  lastSaved: 0,
})

function ArticleEditor() {
  const [draft, setDraft] = useAtom(draftAtom)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)

  // 显示保存提示
  useEffect(() => {
    if (draft.lastSaved > 0) {
      setShowSaveIndicator(true)
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [draft.lastSaved])

  // 更新并自动保存
  const updateDraft = (updates: Partial<ArticleDraft>) => {
    setDraft(prev => ({
      ...prev,
      ...updates,
      lastSaved: Date.now(),
    }))
  }

  // 添加标签
  const [newTag, setNewTag] = useState('')
  const addTag = () => {
    if (newTag && !draft.tags.includes(newTag)) {
      updateDraft({ tags: [...draft.tags, newTag] })
      setNewTag('')
    }
  }

  // 移除标签
  const removeTag = (tag: string) => {
    updateDraft({ tags: draft.tags.filter(t => t !== tag) })
  }

  // 清空草稿
  const clearDraft = () => {
    if (confirm('确定要清空草稿吗？')) {
      setDraft({
        title: '',
        content: '',
        category: '',
        tags: [],
        lastSaved: 0,
      })
    }
  }

  // 提交文章
  const submitArticle = async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: JSON.stringify(draft),
      })

      if (response.ok) {
        alert('发布成功！')
        clearDraft()
      }
    } catch (error) {
      console.error('发布失败:', error)
    }
  }

  // 字数统计
  const wordCount = draft.content.length

  return (
    <div className="article-editor">
      <h2>写文章</h2>

      {/* 保存提示 */}
      {showSaveIndicator && <div className="save-indicator">✓ 草稿已自动保存</div>}

      {/* 标题 */}
      <div className="form-group">
        <label>标题</label>
        <input
          value={draft.title}
          onChange={e => updateDraft({ title: e.target.value })}
          placeholder="请输入标题"
          maxLength={100}
        />
      </div>

      {/* 分类 */}
      <div className="form-group">
        <label>分类</label>
        <select value={draft.category} onChange={e => updateDraft({ category: e.target.value })}>
          <option value="">请选择分类</option>
          <option value="tech">技术</option>
          <option value="life">生活</option>
          <option value="travel">旅行</option>
        </select>
      </div>

      {/* 内容 */}
      <div className="form-group">
        <label>内容</label>
        <textarea
          value={draft.content}
          onChange={e => updateDraft({ content: e.target.value })}
          placeholder="请输入内容"
          rows={15}
        />
        <div className="word-count">字数：{wordCount}</div>
      </div>

      {/* 标签 */}
      <div className="form-group">
        <label>标签</label>
        <div className="tag-input">
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addTag()}
            placeholder="输入标签后按回车"
          />
          <button onClick={addTag}>添加</button>
        </div>
        <div className="tags">
          {draft.tags.map(tag => (
            <span key={tag} className="tag" onClick={() => removeTag(tag)}>
              {tag} ×
            </span>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="actions">
        <button onClick={clearDraft} className="btn-secondary">
          清空草稿
        </button>
        <button onClick={submitArticle} className="btn-primary">
          发布
        </button>
      </div>
    </div>
  )
}
```

### 6. 跨组件状态共享

多个组件共享同一状态：

```tsx
import { useAtom } from 'jotai'
import { atomWithSession } from '@jhqn/utils/storage/react'

// 全局通知状态
interface Notification {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
}

const notificationsAtom = atomWithSession<Notification[]>('notifications', [])

// 添加通知的 Hook
function useNotification() {
  const [notifications, setNotifications] = useAtom(notificationsAtom)

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const notification: Notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now(),
    }
    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  }
}

// 通知显示组件
function NotificationDisplay() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="notifications">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span>{notification.message}</span>
          <button>×</button>
        </div>
      ))}
    </div>
  )
}

// 触发通知的组件 A
function ActionButtonA() {
  const { addNotification } = useNotification()

  return <button onClick={() => addNotification('操作 A 完成', 'success')}>执行操作 A</button>
}

// 触发通知的组件 B
function ActionButtonB() {
  const { addNotification } = useNotification()

  return <button onClick={() => addNotification('操作 B 失败', 'error')}>执行操作 B</button>
}

// 应用
function App() {
  return (
    <div>
      <NotificationDisplay />
      <ActionButtonA />
      <ActionButtonB />
    </div>
  )
}
```

## 最佳实践

### 1. 原子定义位置

```tsx
// ✅ 推荐：在组件外部定义原子
const userAtom = atomWithLocal('user', { name: '' })

function MyComponent() {
  const [user, setUser] = useAtom(userAtom)
  // ...
}

// ❌ 避免：在组件内部定义原子
function MyComponent() {
  const userAtom = atomWithLocal('user', { name: '' }) // 每次渲染都创建新原子
  const [user, setUser] = useAtom(userAtom)
  // ...
}
```

### 2. 类型安全

```tsx
// ✅ 推荐：定义明确的接口
interface User {
  id: number
  name: string
  email: string
}

const userAtom = atomWithLocal<User>('user', {
  id: 0,
  name: '',
  email: '',
})

// ✅ 推荐：使用类型保护
function UserComponent() {
  const [user, setUser] = useAtom(userAtom)

  const isValidUser = () => {
    return user.id > 0 && user.name.length > 0
  }

  return <div>{isValidUser() ? <p>欢迎, {user.name}</p> : <p>请登录</p>}</div>
}
```

### 3. 性能优化

```tsx
// ✅ 推荐：拆分大型对象
const userNameAtom = atomWithLocal('user:name', '')
const userEmailAtom = atomWithLocal('user:email', '')
const userRoleAtom = atomWithLocal('user:role', '')

// ❌ 避免：单一大型对象
const userAtom = atomWithLocal('user', {
  name: '',
  email: '',
  role: '',
  preferences: {
    /* ... */
  },
  settings: {
    /* ... */
  },
})

// ✅ 推荐：使用选择器避免不必要的渲染
import { selectAtom } from 'jotai/utils'

const userAtom = atomWithLocal('user', { name: '', email: '' })
const userNameAtom = selectAtom(userAtom, user => user.name)
```

### 4. 错误处理

```tsx
// ✅ 推荐：添加错误边界
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>出现错误</h1>
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}

// ✅ 推荐：安全的数据访问
function UserComponent() {
  const [user, setUser] = useAtom(userAtom)

  const updateName = (name: string) => {
    try {
      setUser(prev => ({ ...prev, name }))
    } catch (error) {
      console.error('更新失败:', error)
    }
  }
}
```

### 5. 命名规范

```tsx
// ✅ 推荐：使用命名空间
const userPreferencesAtom = atomWithLocal('app:user:preferences', {})
const cartItemsAtom = atomWithLocal('app:cart:items', [])

// ✅ 推荐：模块前缀
const authTokenAtom = atomWithLocal('auth:token', '')
const themeAtom = atomWithLocal('settings:theme', 'light')

// ❌ 避免：通用键名
const dataAtom = atomWithLocal('data', {}) // 容易冲突
const tempAtom = atomWithLocal('temp', '') // 不明确
```

## 调试技巧

### 开发工具

```tsx
// 在开发环境添加到 window 对象
if (import.meta.env.DEV) {
  ;(window as any).__atoms__ = {
    userAtom,
    themeAtom,
    cartAtom,
  }
}

// 控制台访问
// window.__atoms__.userAtom
```

### 监听变化

```tsx
import { useAtom } from 'jotai'

function DebugComponent() {
  const [user, setUser] = useAtom(userAtom)

  // 监听变化
  useEffect(() => {
    console.log('用户数据变化:', user)
  }, [user])

  return null
}
```

### 性能监控

```tsx
import { useAtom } from 'jotai'

function MonitoredComponent() {
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      console.log(`组件渲染时间: ${endTime - startTime}ms`)
    }
  })

  return <div>{user.name}</div>
}
```

## SSR 兼容性

在服务端渲染（SSR）环境中使用：

```tsx
import { useEffect, useState } from 'react'

function SSRSafeComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return <YourComponent />
}

// 或使用动态导入
const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), { ssr: false })
```

## API 参考

### 函数

| 函数            | 参数                       | 返回值 | 描述                        |
| :-------------- | :------------------------- | :----- | :-------------------------- |
| atomWithLocal   | key, initialValue, crypto? | Atom   | localStorage 原子状态管理   |
| atomWithSession | key, initialValue, crypto? | Atom   | sessionStorage 原子状态管理 |

### 类型定义

```ts
import type { WritableAtom } from 'jotai'

export function atomWithLocal<Value>(
  key: string,
  initialValue: Value,
  crypto?: boolean
): WritableAtom<Value, [Value | ((prev: Value) => Value)], void>

export function atomWithSession<Value>(
  key: string,
  initialValue: Value,
  crypto?: boolean
): WritableAtom<Value, [Value | ((prev: Value) => Value)], void>
```

## 特性

- ✅ **响应式**：基于 Jotai 原子状态管理
- ✅ **自动同步**：存储值和 React 状态自动双向同步
- ✅ **类型安全**：完整的 TypeScript 类型支持
- ✅ **持久化**：页面刷新后数据自动恢复
- ✅ **加密支持**：可选的 AES 加密功能
- ✅ **跨标签页同步**：自动监听 storage 事件
- ✅ **函数式更新**：支持 `setValue(prev => newValue)` 形式
- ✅ **自动清理**：设置为 null 时自动删除存储项

## 依赖

- `react@^18.0.0` (或更高版本)
- `jotai@^2.0.0` (或更高版本)
- `@jhqn/utils-core` (内部依赖)
- `@jhqn/utils-crypto` (可选，加密功能需要)

::: tip 最佳实践

- **类型安全**：使用 TypeScript 确保类型安全
- **原子定义**：在组件外部定义原子
- **命名规范**：使用命名空间避免键名冲突
- **性能优化**：拆分大型对象，使用选择器
- **错误处理**：添加错误边界和异常捕获
  :::

::: warning 注意事项

- **存储大小**：localStorage 有大小限制（通常 5-10MB）
- **SSR 环境**：需要特殊处理以避免 SSR 错误
- **加密密钥**：使用加密功能前需要设置密钥
- **null 处理**：设置为 null 会删除存储项
- **跨标签页**：storage 事件只在其他标签页触发
  :::
