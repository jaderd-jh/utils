# 包导入说明

## 📦 安装

```bash
# 推荐安装主包（统一入口）
npm add @jhqn/utils

# 或按需安装子包
npm add @jhqn/utils-core          # 核心工具
npm add @jhqn/utils-crypto        # 加密工具
npm add @jhqn/utils-faker         # 模拟数据
npm add @jhqn/utils-msw           # Mock Service Worker
npm add @jhqn/utils-storage       # 存储管理
```

## 🚀 导入方式

### 方式一：主包导入（推荐）✅

```ts
// 从主包统一导入
import {
  parseToJSON,
  isPhone,
  hidePhone,
  setLocal,
  getLocal,
  aes,
  fakeName
} from '@jhqn/utils'

// 或使用主包的子路径
import { useLocal } from '@jhqn/utils/storage/vue'
import { atomWithLocal } from '@jhqn/utils/storage/react'
```

**优点**：
- ✅ 统一入口，导入更简洁
- ✅ 一次安装，按需使用
- ✅ 自动 Tree-shaking
- ✅ 完整的 TypeScript 支持

### 方式二：子包导入

```ts
// 从各个子包单独导入
import { parseToJSON, isPhone, hidePhone } from '@jhqn/utils-core'
import { setLocal, getLocal } from '@jhqn/utils-storage'
import { aes } from '@jhqn/utils-crypto'
import { fakeName } from '@jhqn/utils-faker'
import { commonRes } from '@jhqn/utils-msw'
```

**优点**：
- ✅ 更精确的依赖控制
- ✅ 减小 node_modules 体积
- ✅ 清晰的模块边界

## 📊 对比

| 特性 | 主包导入 | 子包导入 |
|------|---------|---------|
| **简洁性** | ✅ 更简洁 | ⚠️ 较繁琐 |
| **依赖管理** | ✅ 统一管理 | ⚠️ 手动管理 |
| **Tree-shaking** | ✅ 支持 | ✅ 支持 |
| **TypeScript** | ✅ 完整 | ✅ 完整 |
| **适合场景** | 应用开发 | 库开发 |

## 💡 推荐用法

### 应用开发 → 主包

```ts
import { isPhone, hidePhone, setLocal } from '@jhqn/utils'

// 使用
if (isPhone(phone)) {
  setLocal('phone', hidePhone(phone))
}
```

### 库/工具开发 → 子包

```ts
import { isPhone } from '@jhqn/utils-core'
import { setLocal } from '@jhqn/utils-storage'

// 只依赖需要的包，减小体积
```

## 📦 包结构

```
@jhqn/utils (主包)
├── core      → @jhqn/utils-core
├── crypto    → @jhqn/utils-crypto
├── faker     → @jhqn/utils-faker
├── msw       → @jhqn/utils-msw
└── storage   → @jhqn/utils-storage
    ├── vue
    └── react
```

## ⚠️ 注意事项

1. **二选一即可**：主包和子包功能完全相同，选择一种即可
2. **不要混用**：建议统一使用主包或子包，不要混用
3. **Tree-shaking**：无论哪种方式，未使用的代码都会被移除

## 🔄 示例对比

```ts
// ✅ 推荐：主包导入
import { isPhone, hidePhone } from '@jhqn/utils'

// ✅ 可选：子包导入
import { isPhone, hidePhone } from '@jhqn/utils-core'

// ❌ 不要：混用
import { isPhone } from '@jhqn/utils'
import { hidePhone } from '@jhqn/utils-core' // 混用
```

---

**建议**：大部分场景下使用 **主包导入** `@jhqn/utils`，更简洁统一！
