import isHexColor from './isHexColor'

/**
 * 将十六进制颜色值转换为RGB值
 * @param color 十六进制颜色值
 * @returns [R, G, B]
 */
export default function hexToRgb(color: string): [number, number, number] {
	if (!isHexColor(color)) throw new TypeError('Invalid hex color')

	if (color.length === 4) {
		color = color.replace(/([0-9a-fA-F])/gi, '$1$1')
	}

	const hex = color.slice(1)
	const value = parseInt(hex, 16)
	// 通过位运算提取RGB分量值
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255]

	/* const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)
	return [r, g, b] */
}
