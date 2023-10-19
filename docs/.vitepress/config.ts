const sidebarReference = () => {
  return [
    {
      text: '介绍',
      items: [
        { text: '什么是utils', link: '/introduction' },
        { text: '快速上手', link: '/getting-started' },
      ],
    },
    {
      text: '工具函数库',
      items: [
        {
          text: 'core',
          collapsed: false,
          items: [
            { text: 'format', link: '/core/format' },
            { text: 'case', link: '/core/case' },
            { text: 'console', link: '/core/console' },
            { text: 'desensitize', link: '/core/desensitize' },
            { text: 'dom', link: '/core/dom' },
            { text: 'validate', link: '/core/validate' },
          ],
        },
        { text: 'crypto', link: '/crypto' },
        { text: 'faker', link: '/faker' },
        { text: 'msw', link: '/msw' },
        {
          text: 'storage',
          collapsed: false,
          items: [
            { text: 'storage', link: '/storage/storage' },
            { text: 'vue', link: '/storage/vue' },
            { text: 'react', link: '/storage/react' },
          ],
        },
      ],
    },
  ]
}

const nav = () => {
  return [
    { text: '指南', link: '/guide' },
    { text: '配置', link: '/configs' },
    { text: '0.0.1-beta.27', link: 'https://github.com' },
  ]
}
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  lang: 'zh-CN',
  title: 'Utils使用文档',
  description: '工具库',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    siteTitle: 'Utils使用文档',
    logo: './logo.png',
    nav: nav(),
    sidebar: sidebarReference(),
  },

  socialLinks: [{ icon: 'github', link: 'https://github.com/jaderd-jh/utils' }],

  footer: {
    copyright: 'Copyright (c) 2022 金华青鸟',
  },
}

export default config
