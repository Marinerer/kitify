import colorToRGB from './colorRgb'

/**
 * 设置颜色透明度
 * @param color 颜色值
 * @param opacity 透明度
 * @returns
 */
export default function setColorOpacity(color: string, opacity: number): string {
	if (opacity < 0 || opacity > 1) {
		throw new TypeError('Invalid opacity value')
	}

	const [r, g, b] = colorToRGB(color)
	return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
