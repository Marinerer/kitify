import setColorBrightness from './setColorBrightness'

/**
 * 调整颜色亮度
 * @param color 颜色值
 * @param amount 调整量, 取值范围为 0 到 1
 */
const lightenColor = (color: string, amount: number): string =>
	setColorBrightness(color, Math.abs(amount))

export default lightenColor
