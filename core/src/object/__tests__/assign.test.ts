import assign from '../assign'

describe('assign()', () => {
	describe('assign', () => {
		it('should merge two objects', () => {
			const target = { a: 1 }
			const source = { b: 2 }
			const result = assign(target, source)

			expect(result).toEqual({ a: 1, b: 2 })
		})

		it('should merge three objects', () => {
			const target = { a: 1 }
			const source1 = { b: 2 }
			const source2 = { c: 3 }
			const result = assign(target, source1, source2)

			expect(result).toEqual({ a: 1, b: 2, c: 3 })
		})

		it('should merge objects with overlapping keys', () => {
			const target = { a: 1, b: 2 }
			const source = { b: 3, c: 4 }
			const result = assign(target, source)

			expect(result).toEqual({ a: 1, b: 3, c: 4 })
		})

		it('should handle empty objects', () => {
			const target = {}
			const source = {}
			const result = assign(target, source)

			expect(result).toEqual({})
		})

		it('should handle null or undefined sources', () => {
			const target = { a: 1 }
			const source1 = null
			const source2 = undefined
			const result = assign(target, source1, source2)

			expect(result).toEqual({ a: 1 })
		})

		it('should handle non-object sources', () => {
			const target = { a: 1 }
			const source1 = 42
			const source2 = 'abc'
			const result = assign(target, source1, source2)

			expect(result).toEqual(expect.objectContaining({ a: 1, '0': 'a', '1': 'b' }))
			expect(result).not.toHaveProperty('42')
			expect(result).toHaveProperty('2')
		})

		it('should handle when Object.assign is not available', () => {
			jest.isolateModulesAsync(async () => {
				const originalAssign = Object.assign
				Object.assign = undefined as any
				const { default: assign2 } = await import('../assign')
				Object.assign = originalAssign // Restore the original Object.assign

				const target = { a: 1 }
				const source = { b: 2 }
				const result = assign2(target, source)

				expect(result).toEqual({ a: 1, b: 2 })
			})
		})

		it('should handle non-object sources when Object.assign is null', () => {
			jest.isolateModulesAsync(async () => {
				const originalAssign = Object.assign
				Object.assign = null as any
				const { default: assign2 } = await import('../assign')
				Object.assign = originalAssign // Restore the original Object.assign

				const target = { a: 1 }
				const source1 = 42
				const source2 = 'abc'
				const result = assign2(target, source1, source2)

				expect(result).toEqual(expect.objectContaining({ a: 1, '0': 'a', '1': 'b' }))
				expect(result).not.toHaveProperty('42')
				expect(result).toHaveProperty('2')
			})
		})
	})
})
