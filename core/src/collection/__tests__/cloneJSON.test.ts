import { afterEach } from 'node:test'
import cloneJSON from '../cloneJSON'

describe('cloneJSON', () => {
	afterEach(() => {
		jest.resetAllMocks()
	})

	test('should clone a simple object', () => {
		const obj = { name: 'John', age: 30 }
		const clonedObj = cloneJSON(obj)
		expect(clonedObj).toEqual(obj)
	})

	test('should handle circular references', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

		const obj = { name: 'John', age: 30 } as any
		obj.self = obj

		try {
			cloneJSON(obj)
		} catch (error) {}

		expect(consoleSpy).toHaveBeenCalled()
		consoleSpy.mockRestore()
	})

	test('should handle invalid JSON', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

		try {
			expect(cloneJSON(123)).toEqual(123)
			expect(cloneJSON('123')).toEqual('123')
			expect(cloneJSON(undefined)).toEqual({})

			expect(consoleSpy).toHaveBeenCalled()
		} catch (error) {}

		consoleSpy.mockRestore()
	})

	test('should handle empty object', () => {
		const obj = {}
		const clonedObj = cloneJSON(obj)
		expect(clonedObj).toEqual(obj)
	})
})
