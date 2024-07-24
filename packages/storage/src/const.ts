// const MINUTE = 60 * 1000
// const HOUR = 60 * MINUTE
// const DAY = 24 * HOUR
// const WEEK = 7 * DAY
// const MONTH = 30 * DAY
// const YEAR = 365 * DAY

export enum STORAGE_EXPIRES {
  MINUTE = 60_000,
  HOUR = 3_600_000,
  DAY = 86_400_000,
  WEEK = 604_800_000,
  MONTH = 2_592_000_000,
  YEAR = 31_536_000_000,
  /**
   * 2 ** 31 - 1 [ref](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value)
   */
  MAX_DELAY = 2_147_483_647,
}
