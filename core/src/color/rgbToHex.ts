import { RgbTuple } from './_types'

/**
 * 将 RGB 颜色值转换为十六进制颜色码
 * @param rgb - 颜色值
 * @returns 十六进制颜色码，如 "#ff0000"
 */
function rgbToHex(rgb: string): string
function rgbToHex(rgb: RgbTuple): string
function rgbToHex(r: number, g: number, b: number): string
function rgbToHex(r: string | RgbTuple | number, g?: number, b?: number): string {
	let rgb = Array.isArray(r) ? r : [r, g, b]
	if (typeof r === 'string') {
		rgb = r.match(/\d+/g)?.map(Number) as RgbTuple
	}
	r = parseInt(rgb[0] as string, 10)
	g = parseInt(rgb[1] as string, 10)
	b = parseInt(rgb[2] as string, 10)

	if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
		// return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
	}
	throw new TypeError('Invalid RGB color')
}

export default rgbToHex
