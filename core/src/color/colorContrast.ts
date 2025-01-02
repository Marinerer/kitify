import colorToRGB from './colorRgb'

/**
 * 计算颜色的相对亮度值
 * @param r - 红色分量（0-255）
 * @param g - 绿色分量（0-255）
 * @param b - 蓝色分量（0-255）
 * @returns 相对亮度值
 */
function getLuminance(r: number, g: number, b: number): number {
	const a = [r, g, b].map((v) => {
		v /= 255 // 将 RGB 值转换为 0 到 1 的范围
		// 根据 sRGB 标准，判断颜色值是否小于 0.03928
		// 如果小于 0.03928，则直接除以 12.92
		// 否则，使用公式 ((v + 0.055) / 1.055) ^ 2.4 进行伽马校正
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	})
	// 计算相对亮度值
	// 使用加权和公式：0.2126 * R + 0.7152 * G + 0.0722 * B
	// 这些权重是基于人眼对不同颜色敏感度的研究得出的
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * 计算两种颜色之间的对比度 (相对亮度计算)
 *
 * 返回对比度比率，是一个大于 1 的浮点数。比如 1 表示无对比度，21 表示最大对比度。
 * 根据 WCAG 2.0 标准，对比度应至少为 4.5:1 才能确保文本的可读性。
 * 对比度值越大，表示两个颜色之间的差异越明显，可读性越好。
 *
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @returns 对比度值
 */
export default function colorContrast(color1: string, color2: string): number {
	// 将颜色字符串转换为 RGB 数组
	const [r1, g1, b1] = colorToRGB(color1)
	const [r2, g2, b2] = colorToRGB(color2)
	// 计算两个颜色的相对亮度值，并加上 0.05 的阈值
	const luminance1 = getLuminance(r1, g1, b1) + 0.05
	const luminance2 = getLuminance(r2, g2, b2) + 0.05
	// 返回对比度值，较大的亮度值除以较小的亮度值
	return luminance1 > luminance2 ? luminance1 / luminance2 : luminance2 / luminance1
}
