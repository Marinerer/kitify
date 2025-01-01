import {
	isHexColor,
	isRgbColor,
	isHslColor,
	hexToRgb,
	rgbToHex,
	colorToRGB,
	alphaColor,
	darkenColor,
	lightenColor,
	isDarkColor,
	isLightColor,
	colorContrast,
} from '../color'

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
			expect(isHslColor('hsl(361, 0%, 0%)')).toBe(false)
			expect(isHslColor('hsl(0, 101%, 0%)')).toBe(false)
			expect(isHslColor('hsl(0, 0%, 101%)')).toBe(false)
			expect(isHslColor('hsl(0, 0, 0)')).toBe(false)
			expect(isHslColor('hsla(0, 0%, 0%, 1)')).toBe(false)
		})
	})
})

describe('Color Conversion Functions', () => {
	describe('hexToRgb', () => {
		test('should convert valid hex colors to RGB', () => {
			expect(hexToRgb('#000')).toEqual([0, 0, 0])
			expect(hexToRgb('#fff')).toEqual([255, 255, 255])
			expect(hexToRgb('#000000')).toEqual([0, 0, 0])
			expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255])
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

	describe('colorToRGB', () => {
		test('should convert hex colors to RGB', () => {
			expect(colorToRGB('#000')).toEqual([0, 0, 0])
			expect(colorToRGB('#fff')).toEqual([255, 255, 255])
		})

		test('should parse RGB colors', () => {
			expect(colorToRGB('rgb(0, 0, 0)')).toEqual([0, 0, 0])
			expect(colorToRGB('rgb(255, 255, 255)')).toEqual([255, 255, 255])
		})

		test('should parse RGBA colors', () => {
			expect(colorToRGB('rgba(0, 0, 0, 0)')).toEqual([0, 0, 0, 0])
			expect(colorToRGB('rgba(255, 255, 255, 1)')).toEqual([255, 255, 255, 1])
			expect(colorToRGB('rgba(123, 45, 67, 0.5)')).toEqual([123, 45, 67, 0.5])
		})

		test('should throw error for invalid colors', () => {
			expect(() => colorToRGB('')).toThrow(TypeError)
			expect(() => colorToRGB('invalid')).toThrow(TypeError)
			expect(() => colorToRGB('hsl(0, 0%, 0%)')).toThrow(TypeError)
		})
	})
})

describe('Color Modification Functions', () => {
	describe('alphaColor', () => {
		test('should add alpha value to colors', () => {
			expect(alphaColor('#000', 0.5)).toBe('rgba(0, 0, 0, 0.5)')
			expect(alphaColor('rgb(255, 255, 255)', 1)).toBe('rgba(255, 255, 255, 1)')
		})

		test('should throw error for invalid alpha values', () => {
			expect(() => alphaColor('#000', -0.1)).toThrow(TypeError)
			expect(() => alphaColor('#000', 1.1)).toThrow(TypeError)
		})
	})

	describe('darkenColor', () => {
		test('should darken colors correctly', () => {
			expect(darkenColor('#fff', 0.5)).toBe('rgb(128, 128, 128)')
			expect(darkenColor('rgb(200, 200, 200)', 0.2)).toBe('rgb(160, 160, 160)')
		})

		test('should throw error for invalid amount values', () => {
			expect(() => darkenColor('#000', -0.1)).toThrow(TypeError)
			expect(() => darkenColor('#000', 1.1)).toThrow(TypeError)
		})
	})

	describe('lightenColor', () => {
		test('should lighten colors correctly', () => {
			expect(lightenColor('#000', 0.5)).toBe('rgb(128, 128, 128)')
			expect(lightenColor('rgb(100, 100, 100)', 0.2)).toBe('rgb(131, 131, 131)')
		})

		test('should throw error for invalid amount values', () => {
			expect(() => lightenColor('#000', -0.1)).toThrow(TypeError)
			expect(() => lightenColor('#000', 1.1)).toThrow(TypeError)
		})
	})
})

describe('Color Analysis Functions', () => {
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

	describe('colorContrast', () => {
		test('should calculate correct contrast ratios', () => {
			// 黑白对比度应接近 21:1
			expect(colorContrast('#000', '#fff')).toBeCloseTo(21, 0)
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
})
