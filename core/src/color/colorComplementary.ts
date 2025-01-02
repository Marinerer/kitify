import { RgbTuple } from './_types'
import colorToRGB from './colorRgb'

/**
 * 获取互补色
 */
export default function colorComplementary(color: string): string {
	const rgb = colorToRGB(color)
	const complementary: RgbTuple = rgb.slice(0, 3).map((v) => 255 - v) as RgbTuple
	return `rgb(${complementary.join(', ')})`
}
