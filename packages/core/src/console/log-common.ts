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
 * jade console.debug
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
export const jWarn = (...args: any[]) =>
  console.warn.bind(console, `%c[${args.length === 1 ? 'WARN' : '%s'}]`, `${sharedStyle} background: tomato;`)(...args)

/**
 * jade console.error
 */
export const jError = (...args: any[]) =>
  console.error.bind(
    console,
    `%c[${args.length === 1 ? 'ERROR' : '%s'}]`,
    `${sharedStyle} background: crimson;`
  )(...args)

/**
 * jade console.info
 * @param {...any} args
 */
export const jInfo = (...args: any[]) =>
  console.info.bind(
    console,
    `%c[${args.length === 1 ? 'INFO' : '%s'}]`,
    `${sharedStyle} background: dodgerblue;`
  )(...args)
