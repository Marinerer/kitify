import { RgbResultMap } from './_types'
import { RGB_COLOR_REGEX } from './_utils'
import isHexColor from './isHexColor'
import isRgbColor from './isRgbColor'
import hexToRgb from './hexToRgb'

/**
 * 颜色转为 RGB
 * @param color - 颜色值
 * @returns [R, G, B, A]
 */
export default function colorRgb<K extends keyof RgbResultMap>(
	color: string,
	type: K = 'array' as K
): RgbResultMap[K] {
	if (isHexColor(color)) {
		return hexToRgb(color, type)
	}
	if (isRgbColor(color)) {
		const match = color.match(RGB_COLOR_REGEX)
		const r = parseInt(match![1], 10)
		const g = parseInt(match![2], 10)
		const b = parseInt(match![3], 10)

		if (match![4] === undefined) {
			return (
				type === 'string' ? `rgb(${r}, ${g}, ${b})` : type === 'object' ? { r, g, b } : [r, g, b]
			) as RgbResultMap[K]
		} else {
			const a = parseFloat(match![4])
			return (
				type === 'string'
					? `rgba(${r}, ${g}, ${b}, ${a})`
					: type === 'object'
						? { r, g, b, a }
						: [r, g, b, a]
			) as RgbResultMap[K]
		}
	}
	throw new TypeError('Invalid color')
}
