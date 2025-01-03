// @ts-nocheck
import {
	isHexColor,
	isRgbColor,
	isHslColor,
	isDarkColor,
	isLightColor,
	hexToRgb,
	rgbToHex,
	colorRGB,
	setColorOpacity,
	setColorBrightness,
	darkenColor,
	lightenColor,
	mixColors,
	colorLuminance,
	colorContrast,
	colorComplementary,
} from '../color'

/**
 * 验证颜色函数
 */
describe('Color Validation Functions', () => {
	describe('isHexColor', () => {
		test('should validate correct hex colors', () => {
			expect(isHexColor('#fff')).toBe(true)
			expect(isHexColor('#000')).toBe(true)
			expect(isHexColor('#123456')).toBe(true)
			expect(isHexColor('#ABCDEF')).toBe(true)
		})

		test('should reject invalid hex colors', () => {
			expect(isHexColor('')).toBe(false)
			expect(isHexColor('#12')).toBe(false)
			expect(isHexColor('#1234567')).toBe(false)
			expect(isHexColor('#xyz')).toBe(false)
			expect(isHexColor('123456')).toBe(false)
			expect(isHexColor(123 as any)).toBe(false)
		})
	})

	describe('isRgbColor', () => {
		test('should validate correct rgb colors', () => {
			expect(isRgbColor('rgb(0, 0, 0)')).toBe(true)
			expect(isRgbColor('rgb(255, 255, 255)')).toBe(true)
			expect(isRgbColor('rgb(123, 45, 67)')).toBe(true)
		})

		test('should validate correct rgba colors', () => {
			expect(isRgbColor('rgba(0, 0, 0, 0)')).toBe(true)
			expect(isRgbColor('rgba(255, 255, 255, 1)')).toBe(true)
			expect(isRgbColor('rgba(123, 45, 67, 0.5)')).toBe(true)
		})

		test('should reject invalid rgb/rgba colors', () => {
			expect(isRgbColor('')).toBe(false)
			expect(isRgbColor('rgb(256, 0, 0)')).toBe(false)
			expect(isRgbColor('rgb(0, -1, 0)')).toBe(false)
			expect(isRgbColor('rgb(0, 0)')).toBe(false)
			expect(isRgbColor('rgba(0, 0, 0)')).toBe(false)
			expect(isRgbColor('rgb(0, 0, 0, 0.5)')).toBe(false)
			expect(isRgbColor('rgba(0, 0, 0, 1.1)')).toBe(false)
			expect(isRgbColor(123 as any)).toBe(false)
		})
	})

	describe('isHslColor', () => {
		test('should validate correct hsl colors', () => {
			expect(isHslColor('hsl(0, 0%, 0%)')).toBe(true)
			expect(isHslColor('hsl(360, 100%, 100%)')).toBe(true)
			expect(isHslColor('hsl(180, 50%, 50%)')).toBe(true)
		})

		test('should reject invalid hsl colors', () => {
			expect(isHslColor('')).toBe(false)
			expect(isHslColor(123 as any)).toBe(false)
			expect(isHslColor('hsl(361, 0%, 0%)')).toBe(false)
			expect(isHslColor('hsl(0, 101%, 0%)')).toBe(false)
			expect(isHslColor('hsl(0, 0%, 101%)')).toBe(false)
			expect(isHslColor('hsl(0, 0, 0)')).toBe(false)
			expect(isHslColor('hsla(0, 0%, 0%, 1)')).toBe(false)
		})
	})

	describe('isDarkColor', () => {
		test('should correctly identify dark colors', () => {
			expect(isDarkColor('#000')).toBe(true)
			expect(isDarkColor('rgb(50, 50, 50)')).toBe(true)
			expect(isDarkColor('#444')).toBe(true)
		})

		test('should correctly identify non-dark colors', () => {
			expect(isDarkColor('#fff')).toBe(false)
			expect(isDarkColor('rgb(200, 200, 200)')).toBe(false)
			expect(isDarkColor('#ccc')).toBe(false)
		})
	})

	describe('isLightColor', () => {
		test('should correctly identify light colors', () => {
			expect(isLightColor('#fff')).toBe(true)
			expect(isLightColor('rgb(200, 200, 200)')).toBe(true)
			expect(isLightColor('#ccc')).toBe(true)
		})

		test('should correctly identify non-light colors', () => {
			expect(isLightColor('#000')).toBe(false)
			expect(isLightColor('rgb(50, 50, 50)')).toBe(false)
			expect(isLightColor('#444')).toBe(false)
		})
	})
})

/**
 * 颜色转换函数
 */
describe('Color Conversion Functions', () => {
	describe('hexToRgb', () => {
		test('should convert valid hex colors to RGB', () => {
			expect(hexToRgb('#000')).toEqual([0, 0, 0])
			expect(hexToRgb('#fff')).toEqual([255, 255, 255])
			expect(hexToRgb('#000000', 'object')).toEqual({ r: 0, g: 0, b: 0 })
			expect(hexToRgb('#FFFFFF', 'string')).toEqual('rgb(255, 255, 255)')
		})

		test('should throw error for invalid hex colors', () => {
			expect(() => hexToRgb('')).toThrow(TypeError)
			expect(() => hexToRgb('#12')).toThrow(TypeError)
			expect(() => hexToRgb('#1234567')).toThrow(TypeError)
		})
	})

	describe('rgbToHex', () => {
		test('should convert valid RGB values to hex', () => {
			expect(rgbToHex(0, 0, 0)).toBe('#000000')
			expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
			expect(rgbToHex(123, 45, 67)).toBe('#7b2d43')
			expect(rgbToHex([123, 45, 67])).toBe('#7b2d43')
			expect(rgbToHex('rgb(123, 45, 67)')).toBe('#7b2d43')
			expect(rgbToHex('rgba(123, 45, 67,0.5)')).toBe('#7b2d43')
		})

		test('should throw error for invalid RGB values', () => {
			expect(() => rgbToHex(-1, 0, 0)).toThrow(TypeError)
			expect(() => rgbToHex(256, 0, 0)).toThrow(TypeError)
			expect(() => rgbToHex(0, -1, 0)).toThrow(TypeError)
			expect(() => rgbToHex(0, 256, 0)).toThrow(TypeError)
			expect(() => rgbToHex(0, 0, -1)).toThrow(TypeError)
			expect(() => rgbToHex(0, 0, 256)).toThrow(TypeError)
		})
	})

	describe('colorRGB', () => {
		test('should convert hex colors to RGB', () => {
			expect(colorRGB('#000')).toEqual([0, 0, 0])
			expect(colorRGB('#fff', 'array')).toEqual([255, 255, 255])
			expect(colorRGB('#ff0000', 'object')).toEqual({ r: 255, g: 0, b: 0 })
			expect(colorRGB('#00f', 'string')).toBe('rgb(0, 0, 255)')
		})

		test('should parse RGB colors', () => {
			expect(colorRGB('rgb(0, 0, 0)')).toEqual([0, 0, 0])
			expect(colorRGB('rgb(255, 255, 255)', 'object')).toEqual({ r: 255, g: 255, b: 255 })
			expect(colorRGB('rgb(255, 0, 0)', 'string')).toBe('rgb(255, 0, 0)')
		})

		test('should parse RGBA colors', () => {
			expect(colorRGB('rgba(0, 0, 0, 0)', 'array')).toEqual([0, 0, 0, 0])
			expect(colorRGB('rgba(0, 0, 0, 0)', 'string')).toBe('rgba(0, 0, 0, 0)')
			expect(colorRGB('rgba(255, 255, 255, 1)', 'object')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
			expect(colorRGB('rgba(123, 45, 67, 0.5)')).toEqual([123, 45, 67, 0.5])
		})

		test('should throw error for invalid colors', () => {
			expect(() => colorRGB('')).toThrow(TypeError)
			expect(() => colorRGB('invalid')).toThrow(TypeError)
			expect(() => colorRGB('hsl(0, 0%, 0%)')).toThrow(TypeError)
		})
	})
})

/**
 * 颜色操作函数
 */
describe('Color Modification Functions', () => {
	describe('setColorOpacity', () => {
		test('should add alpha value to colors', () => {
			expect(setColorOpacity('#000', 0.5)).toBe('rgba(0, 0, 0, 0.5)')
			expect(setColorOpacity('rgb(255, 255, 255)', 1)).toBe('rgba(255, 255, 255, 1)')
		})

		test('should throw error for invalid alpha values', () => {
			expect(() => setColorOpacity('#000', -0.1)).toThrow(TypeError)
			expect(() => setColorOpacity('#000', 1.1)).toThrow(TypeError)
		})
	})

	describe('setColorBrightness', () => {
		test('should throw error for invalid amount', () => {
			expect(() => setColorBrightness('red', -2)).toThrow(TypeError)
			expect(() => setColorBrightness('red', 2)).toThrow(TypeError)
		})

		test('should return correct brightened color', () => {
			expect(setColorBrightness('#f00', 0)).toEqual('rgb(255, 0, 0)')
			expect(setColorBrightness('rgb(255,0,0)', -0.5)).toEqual('rgb(128, 0, 0)')
			expect(setColorBrightness('#f00', 0.5)).toEqual('rgb(255, 128, 128)')
		})
	})

	describe('darkenColor', () => {
		test('should darken colors correctly', () => {
			expect(darkenColor('#fff', 0.5)).toBe('rgb(128, 128, 128)')
			expect(darkenColor('#fff', -0.5)).toBe(darkenColor('#fff', 0.5))
			expect(darkenColor('rgb(200, 200, 200)', 0.2)).toBe('rgb(160, 160, 160)')
		})

		test('should throw error for invalid amount values', () => {
			expect(() => darkenColor('#000', -2)).toThrow(TypeError)
			expect(() => darkenColor('#000', 2)).toThrow(TypeError)
		})
	})

	describe('lightenColor', () => {
		test('should lighten colors correctly', () => {
			expect(lightenColor('#000', 0.5)).toBe('rgb(128, 128, 128)')
			expect(lightenColor('#000', 0.5)).toBe(lightenColor('#000', -0.5))
			expect(lightenColor('rgb(100, 100, 100)', 0.2)).toBe('rgb(131, 131, 131)')
		})

		test('should throw error for invalid amount values', () => {
			expect(() => lightenColor('#000', -1.1)).toThrow(TypeError)
			expect(() => lightenColor('#000', 1.1)).toThrow(TypeError)
		})
	})

	describe('mixColors', () => {
		it('should mix two colors with default weight', () => {
			expect(mixColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)')).toBe('rgb(128, 0, 128)')
			expect(mixColors('#f00', '#00f')).toBe('rgb(128, 0, 128)')
			expect(mixColors('#f00', 'rgb(0, 0, 255)')).toBe('rgb(128, 0, 128)')
		})

		it('should mix two colors with custom weight', () => {
			expect(mixColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 0.25)).toBe('rgb(64, 0, 191)')
			expect(mixColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 1)).toBe('rgb(255, 0, 0)')
			expect(mixColors('rgb(255, 0, 0)', 'rgb(0, 0, 255)', 0)).toBe('rgb(0, 0, 255)')
		})

		it('should throw an error when weight is out of range', () => {
			expect(() => mixColors('#fff', '#000', -0.1)).toThrow('Weight must be between 0 and 1')
			expect(() => mixColors('#fff', '#000', 1.1)).toThrow('Weight must be between 0 and 1')
		})

		it('should handle hex color inputs', () => {
			expect(mixColors('#ff0000', '#0000ff')).toBe('rgb(128, 0, 128)')
		})

		it('should handle invalid color inputs', () => {
			expect(() => mixColors('red', 'blue')).toThrow(TypeError)
		})
	})
})

/**
 * 颜色分析函数
 */
describe('Color Analysis Functions', () => {
	describe('colorLuminance', () => {
		test('should return correct luminance', () => {
			expect(colorLuminance('#000000')).toBeCloseTo(0)
			expect(colorLuminance('#FFFFFF')).toBeCloseTo(1)
			expect(colorLuminance('rgb(255,0,0)')).toBeCloseTo(0.2126)
			expect(colorLuminance('rgb(0,255,0)')).toBeCloseTo(0.7152)
			expect(colorLuminance('rgb(0,0,255)')).toBeCloseTo(0.0722)
			expect(colorLuminance('#010101')).toBeCloseTo(0.004)
			expect(colorLuminance('#FEFEFE')).toBeCloseTo(0.9911)
		})
	})

	describe('colorContrast', () => {
		test('should calculate correct contrast ratios', () => {
			// 黑白对比度应接近 21:1
			expect(colorContrast('#000', '#fff')).toBeCloseTo(21, 0)
			expect(colorContrast('#fff', '#000')).toBeCloseTo(21, 0)
			// 相同颜色对比度应为 1:1
			expect(colorContrast('#fff', '#fff')).toBeCloseTo(1, 0)
			// 灰色与白色的对比度应在中间范围
			expect(colorContrast('#808080', '#fff')).toBeGreaterThan(1)
			expect(colorContrast('#808080', '#fff')).toBeLessThan(21)
		})

		test('should handle different color formats', () => {
			expect(colorContrast('#000', 'rgb(255, 255, 255)')).toBeCloseTo(21, 0)
			expect(colorContrast('rgb(0, 0, 0)', '#ffffff')).toBeCloseTo(21, 0)
		})
	})

	describe('colorComplementary', () => {
		test('should return the complementary color for a valid color', () => {
			const complementaryColor = colorComplementary('rgb(100, 150, 200)')
			expect(complementaryColor).toEqual('rgb(155, 105, 55)')
		})

		test('should handle invalid color format', () => {
			expect(() => colorComplementary('invalidColor')).toThrow(TypeError)
		})
	})
})
