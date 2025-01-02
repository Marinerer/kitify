import isDarkColor from './isDarkColor'

/**
 * 判断颜色是否为浅色
 * @param color 颜色值
 */
export default function isLightColor(color: string): boolean {
	return !isDarkColor(color)
}
