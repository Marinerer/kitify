import colorLuminance from './colorLuminance'

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
	// 计算两个颜色的相对亮度值，并加上 0.05 的阈值
	const luminance1 = colorLuminance(color1) + 0.05
	const luminance2 = colorLuminance(color2) + 0.05
	// 返回对比度值，较大的亮度值除以较小的亮度值
	return luminance1 > luminance2 ? luminance1 / luminance2 : luminance2 / luminance1
}
