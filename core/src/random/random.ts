/**
 * 随机8位Id字符
 * Generates a random 8-character ID using base-36 encoding.
 * @returns A random ID string.
 */
export const randomId = (): string => Math.floor(Math.random() * Date.now()).toString(36)

/**
 * 生成 uuid
 * @returns
 */
export function uuid() {
	let d = Date.now()
	/* if (typeof window !== 'undefined' && window.performance) {
		d += performance.now() //use high-precision timer if available
	} */
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
	return uuid
}

/**
 * 通过 blob生成 uuid
 * const uuid = () => URL.createObjectURL(new Blob()).split('/').pop()
 */

/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

interface RandomIntListOptions {
	min: number
	max: number
	count: number
	unique?: boolean
	sort?: 'asc' | 'desc'
}
/**
 * 生成随机整数列表
 * @param min 最小值
 * @param max 最大值
 * @param count 数量
 * @param unique 是否唯一
 * @param sort 排序
 * @returns
 */
export function randomIntList(
	options: RandomIntListOptions = {} as RandomIntListOptions
): number[] {
	const { min = 0, max = 100, count = 10, unique = true, sort } = options

	if (unique && count > max - min + 1) {
		throw new Error('Count cannot be greater than the range of numbers')
	}

	let result: number[]
	if (unique) {
		const list = new Set<number>()
		while (list.size < count) {
			list.add(randomInt(min, max))
		}
		result = Array.from(list)
	} else {
		result = Array.from({ length: count }, () => randomInt(min, max))
	}

	if (sort) {
		result.sort((a, b) => (sort === 'asc' ? a - b : b - a))
	}
	return result
}

/**
 * 生成随机浮点数
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function randomFloat(min: number, max: number) {
	return Math.random() * (max - min) + min
}

/**
 * 生成随机布尔值
 * @returns
 */
export function randomBool() {
	return Math.random() > 0.5
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param characters 字符集
 * @returns
 */
export function randomChar(length: number, characters?: string) {
	let result = ''
	if (!characters) {
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	}
	const charsLen = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charsLen))
	}
	return result
}

/**
 * 生成随机元素, 支持设置权重
 * @param items 元素列表
 * @param weights 权重列表
 * @returns
 */
export function randomItem<T>(items: T[], weights?: number[]): T {
	if (weights && weights.length !== items.length) {
		throw new Error('Weights length must be equal to items length')
	}

	// 未提供权重，则取均值
	if (!weights) {
		return items[Math.floor(Math.random() * items.length)]
	}

	// 计算累计权重 [2,2,5] = [2,4,9]
	const cumulate = weights.map(
		(
			(sum) => (value) =>
				(sum += value)
		)(0)
	)
	// 取累计权重随机一个值
	const randomValue = Math.random() * cumulate[cumulate.length - 1]
	// 遍历元素列表，找到第一个累计权重大于随机值的元素
	for (let i = 0, length = cumulate.length; i < length; i++) {
		if (randomValue < cumulate[i]) {
			return items[i]
		}
	}
	// 默认返回权重最大的
	return items[items.length - 1]
}

/**
 * 随机打乱数组
 * @param array 数组
 * @returns
 */
export function shuffleArray(array: any[]) {
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
}

/**
 * 生成随机颜色
 * @returns
 */
export function randomColor() {
	return `#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padStart(6, '0')}`
}

/**
 * 生成随机日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns
 */
export function randomDate(end: Date | string | number): Date
export function randomDate(start: Date | string | number, end: Date | string | number): Date
export function randomDate(start: Date | string | number, end?: Date | string | number): Date {
	if (end === undefined) {
		end = start
		start = new Date(0) // 默认从 1970-01-01 开始
	}
	const startTime = new Date(start).getTime()
	const endTime = new Date(end).getTime()
	return new Date(startTime + Math.random() * (endTime - startTime))
}

/*
function testWeighted(fn, count = 10000) {
  const result = {}
  for (let i = 0; i < count; i++) {
    const val = fn()
    result[val] = (result[val] || 0) + 1
  }
  return result
}
 */
