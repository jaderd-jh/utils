import jhqn from '@jhqn/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default jhqn(
  {
    lessOpinionated: true,
    stylistic: {
      overrides: {
        'style/indent': 'off',
        'style/multiline-ternary': 'off',
        'style/operator-linebreak': 'off',
      },
    },
    unicorn: {
      overrides: {
        'unicorn/no-instanceof-builtins': 'off',
      },
    },
  },
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'jsonc/sort-keys': 'off',
    },
  },
  oxlint.configs['flat/recommended']
)
