---
description: 了解 @jhqn/utils 工具库的设计理念和核心特性
---

# 什么是Utils

Utils是我们团队将多年的开发经验总结出来的一套工具库，它包含了我们在开发过程中经常使用的工具函数，以及一些常用的组件。

## 为什么选择 Utils？

- 🎯 **业务导向**: 专注于特定业务场景，提供手机号、身份证、中文姓名等验证和脱敏功能
- 📦 **模块化设计**: 采用 Monorepo 架构，按需引入，支持 Tree-shaking
- 💪 **TypeScript 原生**: 完整的类型定义和类型推导，提供优秀的开发体验
- 🔧 **功能丰富**: 包含类型校验、数据脱敏、字符串转换、格式化、加密、存储等多种工具
- ✅ **测试覆盖**: 使用 Vitest 编写单元测试，保证代码质量

## 核心模块

| 模块                    | 说明                                                   |
| ----------------------- | ------------------------------------------------------ |
| **@jhqn/utils-core**    | 核心工具函数：类型校验、数据脱敏、字符串转换、格式化等 |
| **@jhqn/utils-crypto**  | 加密解密工具，基于 CryptoJS 的 AES 加密                |
| **@jhqn/utils-storage** | 存储管理，支持加密存储和响应式存储                     |
| **@jhqn/utils-faker**   | 模拟数据生成，用于开发和测试                           |
| **@jhqn/utils-msw**     | Mock Service Worker 集成                               |

::: warning
Utils目前处于alpha状态，API仍然可能在版本之间发生变化。欢迎大家使用并完善！
:::

<llm-only>
@jhqn/utils is a comprehensive utility library for JavaScript/TypeScript development,
focused on Chinese business scenarios with modules for validation, desensitization,
formatting, encryption, storage, and mock data generation.
</llm-only>
