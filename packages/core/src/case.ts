/**
 * snake2Kebab
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example snake2Kebab('hello_world') // hello_world => hello-world
 */
export const snake2Kebab = (str: string) => str.replace(/_([a-z])/g, (_, letter) => `-${letter.toLowerCase()}`)

/**
 * snake2Pascal
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example snake2Pascal('hello_world') // hello_world => HelloWorld
 */
export const snake2Pascal = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/^[a-z]/, letter => letter.toUpperCase())

/**
 * snake2Camel
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example snake2Camel('hello_world') // hello_world => helloWorld
 */
export const snake2Camel = (str: string) => str.replace(/(_([a-z]))/g, match => match[1]!.toUpperCase())

/**
 * snake2Title
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example snake2Title('hello_world') // hello_world => Hello World
 */
export const snake2Title = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => ` ${letter.toUpperCase()}`).replace(/^[a-z]/, letter => letter.toUpperCase())

/**
 * kebab2Snake
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example kebab2Snake('hello-world') // hello-world => hello_world
 */
export const kebab2Snake = (str: string) => str.replace(/-([a-z])/g, (_, letter) => `_${letter.toLowerCase()}`)

/**
 * kebab2Pascal
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example kebab2Pascal('hello-world') // hello-world => HelloWorld
 */
export const kebab2Pascal = (str: string) =>
  str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/^[a-z]/, letter => letter.toUpperCase())

/**
 * kebab2Camel
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example kebab2Camel('hello-world') // hello-world => helloWorld
 */
export const kebab2Camel = (str: string) => {
  const [first, ...rest] = str.split('-')
  return [first, ...rest.map(s => s.replace(/^[a-z]/, s[0]!.toUpperCase()))].join('')
}

/**
 * kebab2Title
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example kebab2Title('hello-world') // hello-world => Hello World
 */
export const kebab2Title = (str: string) =>
  str.replace(/-([a-z])/g, (_, letter) => ` ${letter.toUpperCase()}`).replace(/^[a-z]/, letter => letter.toUpperCase())

/**
 * pascal2Snake
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example pascal2Snake('HelloWorld') // HelloWorld => hello_world
 */
export const pascal2Snake = (str: string) =>
  str.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`).replace(/^_/, '')

/**
 * pascal2Kebab
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example pascal2Kebab('HelloWorld') // HelloWorld => hello-world
 */
export const pascal2Kebab = (str: string) =>
  str.replace(/([A-Z])/g, (_, letter) => `-${letter.toLowerCase()}`).replace(/^-/, '')

/**
 * pascal2Camel
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example pascal2Camel('HelloWorld') // HelloWorld => helloWorld
 */
export const pascal2Camel = (str: string) => str.replace(/^[A-Z]/, letter => letter.toLowerCase())

/**
 * pascal2Title
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example pascal2Title('HelloWorld') // HelloWorld => Hello World
 */
export const pascal2Title = (str: string) => str.replace(/([A-Z])/g, (_, letter) => ` ${letter}`).replace(/^ /, '')

/**
 * camel2Snake
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example camel2Snake('helloWorld') // helloWorld => hello_world
 */
export const camel2Snake = (str: string) => str.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`)

/**
 * camel2Kebab
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example camel2Kebab('helloWorld') // helloWorld => hello-world
 */
export const camel2Kebab = (str: string) => str.replace(/([A-Z])/g, (_, letter) => `-${letter.toLowerCase()}`)

/**
 * camel2Pascal
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example camel2Pascal('helloWorld') // helloWorld => HelloWorld
 */
export const camel2Pascal = (str: string) => str.replace(/(^[a-z])|(\s+[a-z])/g, match => match.toUpperCase())

/**
 * camel2Title
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example camel2Title('helloWorld') // helloWorld => Hello World
 */
export const camel2Title = (str: string) =>
  str.replace(/([A-Z])/g, (_, letter) => ` ${letter}`).replace(/^[a-z]/, match => match.toUpperCase())

/**
 * title2Snake
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example title2Snake('Hello World') // Hello World => hello_world
 */
export const title2Snake = (str: string) => str.replace(/([A-Z])/g, match => match.toLowerCase()).replace(/ /g, '_')

/**
 * title2Kebab
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example title2Kebab('Hello World') // Hello World => hello-world
 */
export const title2Kebab = (str: string) => str.replace(/([A-Z])/g, match => match.toLowerCase()).replace(/ /g, '-')

/**
 * title2Pascal
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example title2Pascal('Hello World') // Hello World => HelloWorld
 */
export const title2Pascal = (str: string) => str.replace(/ /g, '')

/**
 * title2Camel
 * @param {string} str 字符串
 * @returns {string} 转换后的字符串
 * @example title2Camel('Hello World') // Hello World => helloWorld
 */
export const title2Camel = (str: string) => str.replace(/ /g, '').replace(/^[A-Z]/, match => match.toLowerCase())
