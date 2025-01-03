import colorToRGB from './colorRgb'

/**
 * 计算颜色的相对亮度值
 * @param r - 红色分量（0-255）
 * @param g - 绿色分量（0-255）
 * @param b - 蓝色分量（0-255）
 * @returns 相对亮度值
 */
export default function colorLuminance(color: string): number {
	const rgb = colorToRGB(color, 'array')
	const a = rgb.slice(0, 3).map((v) => {
		v /= 255 // 归一化到 [0, 1]
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
