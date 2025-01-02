import colorToRGB from './colorRgb'

/**
 * 判断颜色是否为暗色
 * @param color - 颜色值
 * @returns
 */
export default function isDarkColor(color: string): boolean {
	const [r, g, b] = colorToRGB(color)
	// 根据公式计算 YIQ 值，用于判断颜色的亮度
	const yiq = (r * 299 + g * 587 + b * 114) / 1000
	// 如果 YIQ 值小于 128，则认为颜色是暗色
	return yiq < 128
}
