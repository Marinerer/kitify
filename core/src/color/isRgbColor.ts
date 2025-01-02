import { RGB_COLOR_REGEX } from './_utils'

/**
 * 判断是否为 RGB 颜色
 * @param color 颜色值
 * @returns boolean
 */
export default function isRgbColor(color: string): boolean {
	if (typeof color !== 'string') return false

	const match = color.match(RGB_COLOR_REGEX)
	if (!match) return false

	const hasAlpha = color.indexOf('rgba') === 0
	if (hasAlpha && match[4] === undefined) return false
	if (!hasAlpha && match[4] !== undefined) return false

	// 提取 R, G, B 值并检查是否在 0 到 255 之间
	const r = parseInt(match[1], 10)
	const g = parseInt(match[2], 10)
	const b = parseInt(match[3], 10)
	return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
}
