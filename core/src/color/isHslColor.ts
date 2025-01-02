import { HSL_COLOR_REGEX } from './_utils'

/**
 * 验证HSL颜色值
 */
export default function isHslColor(color: string): boolean {
	if (typeof color !== 'string') return false

	const match = color.match(HSL_COLOR_REGEX)
	if (!match) return false

	const h = parseInt(match[1], 10)
	const s = parseInt(match[2], 10)
	const l = parseInt(match[3], 10)
	return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100
}
