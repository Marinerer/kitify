import { RgbTuple, RgbaTuple } from './_types'
import { RGB_COLOR_REGEX } from './_utils'
import isHexColor from './isHexColor'
import isRgbColor from './isRgbColor'
import hexToRgb from './hexToRgb'

/**
 * 颜色转为 RGB
 * @param color - 颜色值
 * @returns [R, G, B, A]
 */
export default function colorRgb(color: string): RgbTuple | RgbaTuple {
	if (isHexColor(color)) {
		return hexToRgb(color)
	}
	if (isRgbColor(color)) {
		const match = color.match(RGB_COLOR_REGEX)
		const r = parseInt(match![1], 10)
		const g = parseInt(match![2], 10)
		const b = parseInt(match![3], 10)
		const a = match![4]
		return a === undefined ? [r, g, b] : [r, g, b, parseFloat(a)]
	}
	throw new TypeError('Invalid color')
}
