export function isHexColor(color: string): boolean {
	if (typeof color !== 'string') return false

	const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
	return reg.test(color)
}

export function isRgbColor(color: string): boolean {
	if (typeof color !== 'string') return false

	const reg =
		/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([0]?\.\d+|0|1)\s*)?\)$/
	const match = color.match(reg)
	if (!match) return false

	const alpha = color.indexOf('rgba') === 0
	if (alpha && match[4] === undefined) return false
	if (!alpha && match[4] !== undefined) return false

	// 提取 R, G, B 值并检查是否在 0 到 255 之间
	const r = parseInt(match[1], 10)
	const g = parseInt(match[2], 10)
	const b = parseInt(match[3], 10)
	return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
}

export function isHslColor(color: string) {
	const hslReg = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/
	const match = color.match(hslReg)
	if (!match) return false
	const h = parseInt(match[1], 10)
	const s = parseInt(match[2], 10)
	const l = parseInt(match[3], 10)
	return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100
}

export function hexToRgb(color: string): [number, number, number] {
	if (!isHexColor(color)) throw new TypeError('Invalid hex color')

	if (color.length === 4) {
		color = color.replace(/([0-9a-fA-F])/gi, '$1$1')
	}

	const hex = color.replace('#', '')
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	return [r, g, b]
}

export function rgbToHex(r: number, g: number, b: number): string {
	r = parseInt(r.toString(), 10)
	g = parseInt(g.toString(), 10)
	b = parseInt(b.toString(), 10)

	if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
		// return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
	}
	throw new TypeError('Invalid RGB color')
}

type RGBColor = [number, number, number]
type RGBAColor = [number, number, number, number]
export function colorToRGB(color: string): RGBColor | RGBAColor {
	if (isHexColor(color)) {
		return hexToRgb(color)
	}
	if (isRgbColor(color)) {
		const reg =
			/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([01]?\.\d+|0|1)\s*)?\)$/
		const match = color.match(reg)
		const r = parseInt(match![1], 10)
		const g = parseInt(match![2], 10)
		const b = parseInt(match![3], 10)
		const a = match![4]
		return a ? [r, g, b, parseFloat(a)] : [r, g, b]
	}
	throw new TypeError('Invalid color')
}

export function alphaColor(color: string, alpha: number): string {
	if (alpha < 0 || alpha > 1) {
		throw new TypeError('Invalid alpha value')
	}

	const [r, g, b] = colorToRGB(color)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 增加颜色的暗度
 * @param color - 颜色值
 * @param amount - 暗度增加的百分比，取值范围从 0 到 1
 * @returns 变暗后的颜色值，格式为 rgb 颜色值
 * @throws {TypeError} 如果 amount 参数无效（小于 0 或大于 1）
 */
export function darkenColor(color: string, amount: number): string {
	if (amount < 0 || amount > 1) {
		throw new TypeError('Invalid amount value')
	}
	const [r, g, b] = colorToRGB(color)
	const darken = (c: number) => Math.round(c * (1 - amount))
	return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`
}

/**
 * 增加颜色的亮度
 * @param color - 颜色值
 * @param amount - 亮度增加的百分比，取值范围为 0 到 1
 * @returns 增加亮度后的颜色值
 * @throws {TypeError} 如果 amount 不在 0 到 1 之间
 */
export function lightenColor(color: string, amount: number): string {
	if (amount < 0 || amount > 1) {
		throw new TypeError('Invalid amount value')
	}
	const [r, g, b] = colorToRGB(color)
	const lighten = (c: number) => Math.round(c + (255 - c) * amount)
	return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`
}

/**
 * 检查颜色是否为暗色
 * @param color - 颜色值
 * @returns
 */
export function isDarkColor(color: string): boolean {
	const [r, g, b] = colorToRGB(color)
	// 根据公式计算 YIQ 值，用于判断颜色的亮度
	const yiq = (r * 299 + g * 587 + b * 114) / 1000
	// 如果 YIQ 值小于 128，则认为颜色是暗色
	return yiq < 128
}

export function isLightColor(color: string): boolean {
	return !isDarkColor(color)
}

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
export function colorContrast(color1: string, color2: string): number {
	// 将颜色字符串转换为 RGB 数组
	const [r1, g1, b1] = colorToRGB(color1)
	const [r2, g2, b2] = colorToRGB(color2)
	// 计算两个颜色的相对亮度值，并加上 0.05 的阈值
	const luminance1 = getLuminance(r1, g1, b1) + 0.05
	const luminance2 = getLuminance(r2, g2, b2) + 0.05
	// 返回对比度值，较大的亮度值除以较小的亮度值
	return luminance1 > luminance2 ? luminance1 / luminance2 : luminance2 / luminance1
}
