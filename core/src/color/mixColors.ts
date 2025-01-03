import { RgbTuple } from './_types'
import colorToRGB from './colorRgb'

/**
 * 混合两种颜色
 * @param color1 第一个颜色
 * @param color2 第二个颜色
 * @param weight 混合权重(0-1)，默认0.5
 */
export default function mixColors(color1: string, color2: string, weight: number = 0.5): string {
	if (weight < 0 || weight > 1) {
		throw new TypeError('Weight must be between 0 and 1')
	}

	const rgb1 = colorToRGB(color1, 'array')
	const rgb2 = colorToRGB(color2, 'array')

	const w1 = weight
	const w2 = 1 - weight

	const mixed: RgbTuple = [
		Math.round(rgb1[0] * w1 + rgb2[0] * w2),
		Math.round(rgb1[1] * w1 + rgb2[1] * w2),
		Math.round(rgb1[2] * w1 + rgb2[2] * w2),
	]

	return `rgb(${mixed.join(', ')})`
}
