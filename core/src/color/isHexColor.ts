import { HEX_COLOR_REGEX } from './_utils'

/**
 * 判断是否是十六进制颜色值
 * @param color 颜色值
 * @returns boolean
 */
export default function isHexColor(color: string): boolean {
	return typeof color === 'string' && HEX_COLOR_REGEX.test(color)
}
