import debounce from '../debounce'

describe('debounce', () => {
	let mockFn: jest.Mock

	beforeEach(() => {
		jest.useFakeTimers() // 使用假定时器
		mockFn = jest.fn()
	})

	afterEach(() => {
		jest.clearAllTimers() // 清除所有定时器
		jest.useRealTimers() // 恢复真实定时器
		mockFn.mockClear() // 清除mock函数的调用记录
	})

	test('基本防抖功能 - 只在等待时间后执行一次', () => {
		const debouncedFn = debounce(mockFn, 1000)

		// 连续调用多次
		debouncedFn()
		debouncedFn()
		debouncedFn()

		// 验证在等待时间内未执行
		expect(mockFn).not.toHaveBeenCalled()

		// 前进时间
		jest.advanceTimersByTime(1000)

		// 验证只执行一次
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('连续调用时重置等待时间', () => {
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()

		// 前进500ms
		jest.advanceTimersByTime(500)
		expect(mockFn).not.toHaveBeenCalled()

		// 再次调用，重置等待时间
		debouncedFn()

		// 再前进500ms，总共1000ms，但函数不应该被调用
		jest.advanceTimersByTime(500)
		expect(mockFn).not.toHaveBeenCalled()

		// 再前进500ms，总共1500ms
		jest.advanceTimersByTime(500)
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('立即执行模式 (immediate=true)', () => {
		const debouncedFn = debounce(mockFn, 1000, true)

		// 第一次调用应立即执行
		debouncedFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 连续调用不应再次执行
		debouncedFn()
		debouncedFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 等待时间结束后
		jest.advanceTimersByTime(1000)

		// 再次调用应立即执行
		debouncedFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('非立即执行模式 (immediate=false)', () => {
		const debouncedFn = debounce(mockFn, 1000, false)

		debouncedFn()
		expect(mockFn).not.toHaveBeenCalled()

		jest.advanceTimersByTime(1000)
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('传递参数和this上下文', () => {
		const obj = { value: 'test' }
		const contextTestFn = jest.fn(function (this: any, arg1: string, arg2: number) {
			return this.value + arg1 + arg2
		})

		const debouncedFn = debounce(contextTestFn, 1000)

		// 调用时传递this和参数
		debouncedFn.call(obj, 'hello', 123)
		jest.advanceTimersByTime(1000)

		// 验证参数和this上下文正确传递
		expect(contextTestFn).toHaveBeenCalledWith('hello', 123)
		expect(contextTestFn.mock.instances[0]).toBe(obj)
	})

	test('cancel方法取消延迟调用', () => {
		const debouncedFn = debounce(mockFn, 1000)

		debouncedFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 取消调用
		debouncedFn.cancel()

		// 前进时间
		jest.advanceTimersByTime(1000)

		// 验证函数未被调用
		expect(mockFn).not.toHaveBeenCalled()
	})

	test('返回值正确传递', () => {
		const returnFn = jest.fn().mockReturnValue('test-result')
		const debouncedFn = debounce(returnFn, 1000, true)

		// 立即执行模式下应返回原函数的返回值
		const result = debouncedFn()
		expect(result).toBe('test-result')
	})
})
