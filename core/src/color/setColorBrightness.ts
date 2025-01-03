import colorToRGB from './colorRgb'

/**
 * 调整颜色亮度
 * @param color 颜色值
 * @param amount 调整量 (-1 到 1，负值变暗，正值变亮)
 */
export default function setColorBrightness(color: string, amount: number): string {
	if (amount < -1 || amount > 1) {
		throw new TypeError('Amount must be between -1 and 1')
	}
	const rgb = colorToRGB(color, 'array')
	const brighten = (c: number): number =>
		amount < 0 ? Math.round(c * (1 + amount)) : Math.round(c + (255 - c) * amount)

	return `rgb(${rgb.slice(0, 3).map(brighten).join(', ')})`
}
