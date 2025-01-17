/**
 * 判断是否是有效的数字
 */
export const isValidNumber = (num: number) =>
	typeof num === 'number' && !isNaN(num) && isFinite(num)

/**
 * 判断是否是奇数
 */
export function isOdd(num: number): boolean {
	// return num % 2 === 1 || num % 2 === -1
	return num % 2 !== 0
}

/**
 * 判断是否是偶数
 */
export function isEven(num: number): boolean {
	return num % 2 === 0
}

/**
 * 判断是否是质数/素数
 * 在大于1的自然数中，除了1和它本身以外不再有其他因数的数
 */
export function isPrime(num: number): boolean {
	if (num <= 1) return false
	if (num <= 3) return true
	if (num % 2 === 0 || num % 3 === 0) return false
	for (let i = 5; i * i <= num; i += 6) {
		if (num % i === 0 || num % (i + 2) === 0) return false
	}
	return true
}

/**
 * 判断是否是回文数
 * 指一个数从前往后读和从后往前读是一样的。例如：121, 12321, 111 等
 */
export function isPalindrome(num: number): boolean {
	const str = num.toString()
	const len = str.length
	for (let i = 0; i < len / 2; i++) {
		if (str[i] !== str[len - 1 - i]) return false
	}
	return true
}

/**
 * 判断是否是完全平方数
 */
export function isPerfectSquare(num: number): boolean {
	if (num < 0) return false
	const sqrt = Math.sqrt(num)
	return sqrt === Math.floor(sqrt)
}

/**
 * 判断是否是完全立方数
 */
export function isPerfectCube(num: number): boolean {
	if (num < 0) return false
	const cubeRoot = Math.cbrt(num)
	return cubeRoot === Math.floor(cubeRoot)
}

/**
 * 判断是否是2的幂
 */
export function isPowerOfTwo(num: number): boolean {
	return num > 0 && (num & (num - 1)) === 0
}

/**
 * 限制数字在某个区间内
 * @param num 要限制的数字
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max)
}

/**
 * 判断数字是否在某个区间内
 * @param num 要判断的数字
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function inRange(num: number, min: number, max: number): boolean {
	return num >= min && num <= max
}

/**
 * 线性插值
 * @param start 起始值
 * @param end 结束值
 * @param amount 插值比例
 * @returns
 * @example
 * lerp(0, 100, 0.25) // 25
 */
export function lerp(start: number, end: number, amount: number): number {
	return start + (end - start) * amount
}

/**
 * 将数字转换为中文数字表示
 * @param num - 需要转换的数字
 * @returns 返回中文数字字符串
 * @example
 * numberToChinese(12345); // '一万二千三百四十五'
 * numberToChinese(100002); // '十万零二'
 * numberToChinese(10000000); // '一千万'
 */
export function numberToChinese(num: number): string {
	const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
	const chineseUnits = ['', '十', '百', '千']
	const chineseLevels = ['', '万', '亿']

	if (num === 0) return chineseNumbers[0]

	let result = ''
	let str = num.toString()
	let len = str.length

	for (let i = 0; i < len; i++) {
		const n = parseInt(str[i])
		const pos = len - i - 1
		const unit = chineseUnits[pos % 4]
		const level = chineseLevels[Math.floor(pos / 4)]

		// 处理零的情况
		if (n === 0) {
			// 避免重复的零
			if (result[result.length - 1] !== chineseNumbers[0]) {
				result += chineseNumbers[0]
			}
		} else {
			result += chineseNumbers[n] + unit
		}

		// 添加层级单位（万、亿等）
		if (pos % 4 === 0 && pos !== 0) {
			result += level
		}
	}

	// 去除末尾的零
	result = result.replace(/零+$/, '')

	// 处理“一十”开头的特殊情况
	if (result.startsWith('一十')) {
		result = result.replace('一十', '十')
	}

	// 处理“零万”或“零亿”的情况
	result = result.replace(/零(万|亿)/g, '$1')

	return result
}

// 格式化数字为千分位
export function formatNumber(num: number): string {
	// return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return num.toLocaleString('en-US')
}
