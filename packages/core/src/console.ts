/* eslint-disable no-console */
const sharedStyle = 'color: white; padding: 1px 2px;'

/**
 * jade console.log
 * only for development
 * @param {...any} args
 */
export const jLog = (...args: any[]) =>
  __DEV__
    ? console.log.bind(
        console,
        `%c[${args.length === 1 ? 'LOG' : '%s'}]`,
        `${sharedStyle} background: seagreen;`
      )(...args)
    : () => {}

/**
 * jade console.log
 * @param {...any} args
 */
export const jDebug = (...args: any[]) =>
  console.log.bind(
    console,
    `%c[${args.length === 1 ? 'DEBUG' : '%s'}]`,
    `${sharedStyle} background: linear-gradient(LightSalmon, Tomato); border-radius: 2px; font-weight: bold; border-top: 2px solid Crimson; border-bottom: 2px solid Crimson;`
  )(...args)

/**
 * jade console.warn
 */
export const jWarn = console.error.bind(console, '%c[WARN]', `${sharedStyle} background: tomato;`)

/**
 * jade console.error
 */
export const jError = console.error.bind(console, '%c[ERROR]', `${sharedStyle} background: crimson;`)

/**
 * jade console.error
 * @param {...any} args
 */
export const jInfo = (...args: any[]) =>
  console.info.bind(
    console,
    `%c[${args.length === 1 ? 'INFO' : '%s'}]`,
    `${sharedStyle} background: dodgerblue;`
  )(...args)

/**
 * jade console.group
 */
export const jGroup = console.group.bind(console, '%c[%s]', `${sharedStyle} background: slateblue;`)

/**
 * jade console.groupCollapsed
 */
export const jGroupC = console.groupCollapsed.bind(console, '%c[%s]', `${sharedStyle} background: slateblue;`)

/**
 * jade console.groupEnd
 */
export const jGroupE = console.groupEnd.bind(console)

/**
 * jade console.time
 * @param str
 */
export const jTime = (str: string) => console.time(`[${str}]`)

/**
 * jade console.timeEnd
 * @param str
 */
export const jTimeEnd = (str: string) => console.timeEnd(`[${str}]`)

/**
 * jade console.clear
 */
export const jClear = console.clear.bind(console)
