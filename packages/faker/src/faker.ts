import { fakerZH_CN as faker } from '@faker-js/faker'
import { customAlphabet } from 'nanoid'

/**
 * 随机可能性
 * @param probability 概率成功百分比
 */
export const fakeChance = (probability: number) => faker.helpers.maybe(() => true, { probability })

/**
 * 随机id
 */
export const fakeId = () => customAlphabet('0123456789', 16)()

/** 随机假名字 */
export const fakeName = () => faker.person.fullName()

/** 随机假手机号码 */
export const fakePhone = () => 1 + faker.string.fromCharacters('3456789', 2) + faker.string.numeric({ length: 8 })

/**
 * 随机假枚举值
 * @param array
 */
export const fakeEnum = <T>(array: readonly T[]) => faker.helpers.arrayElement<T>(array)

/** 随机过去时间 */
export const fakeDatePast = () => faker.date.past().toString()

/** 随机未来时间 */
export const fakeDateFuture = () => faker.date.future().toString()

/**
 * 随机时间段内时间
 * @param from 开始时间
 * @param to 结束时间
 */
export const fakeDateRange = (from: string, to: string) => faker.date.between({ from, to }).toString()

/**
 * 随机整型范围内数字
 * @param min 最小值
 * @param max 最大值
 */
export const fakeIntRange = (min: number, max: number) => faker.number.int({ min, max })

/**
 * 随机浮点数范围内数字
 * @param min 最小值
 * @param max 最大值
 * @param precision 精度
 */
export const fakeFloatRange = (min: number, max: number, precision?: number) =>
  faker.number.float({ min, max, precision })

/**
 * 随机假对象key
 * @param object
 */
export const fakeKey = <T extends Record<string | number, any>>(object: T) => faker.helpers.objectKey(object)

/**
 * 随机假对象value
 * @param object
 */
export const fakeValue = <T extends Record<any, any>>(object: T) => faker.helpers.objectValue(object)
