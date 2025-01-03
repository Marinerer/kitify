import isHexColor from './isHexColor'
import { RgbResultMap } from './_types'

/**
 * 将十六进制颜色值转换为RGB值
 * @param color 十六进制颜色值
 * @param type 返回值的类型，可以是 'string', 'array', 或 'object'
 * @returns
 */
function hexToRgb<K extends keyof RgbResultMap>(
	color: string,
	type: K = 'array' as K
): RgbResultMap[K] {
	//! 参数断言: TS认为默认值类型与泛型类型 K 可能不兼容
	if (!isHexColor(color)) throw new TypeError('Invalid hex color')

	if (color.length === 4) {
		color = color.replace(/([0-9a-fA-F])/gi, '$1$1')
	}

	const hex = color.slice(1)
	const value = parseInt(hex, 16)
	// 通过位运算提取RGB分量值
	const r = (value >> 16) & 255
	const g = (value >> 8) & 255
	const b = value & 255

	//!断言: TS不能通过运行时的 type 参数值推断出返回值的具体类型
	return (
		type === 'string' ? `rgb(${r}, ${g}, ${b})` : type === 'object' ? { r, g, b } : [r, g, b]
	) as RgbResultMap[K]

	/* const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)
	return [r, g, b] */
}
export default hexToRgb
