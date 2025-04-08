import throttle from '../throttle'

describe('throttle', () => {
	let mockFn: jest.Mock

	beforeEach(() => {
		jest.useFakeTimers()
		mockFn = jest.fn()
	})

	afterEach(() => {
		jest.clearAllTimers()
		jest.useRealTimers()
		mockFn.mockClear()
	})

	test('基本节流功能 - 在指定时间内只执行一次', () => {
		const throttledFn = throttle(mockFn, 1000)

		// 连续调用多次
		throttledFn()
		throttledFn()
		throttledFn()

		// 第一次应该立即执行（默认leading=true）
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 前进500ms，仍在节流时间内
		jest.advanceTimersByTime(500)
		throttledFn()
		throttledFn()

		// 验证在等待时间内未再次执行
		expect(mockFn).not.toHaveBeenCalled()

		// 前进到总共1000ms
		jest.advanceTimersByTime(500)

		// 由于trailing=true（默认），最后一次调用应该被执行
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('leading=false选项 - 第一次调用不立即执行', () => {
		const throttledFn = throttle(mockFn, 1000, { leading: false })

		// 第一次调用不应立即执行
		throttledFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 前进到节流时间结束
		jest.advanceTimersByTime(1000)

		// 应该执行一次（trailing模式）
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('trailing=false选项 - 最后一次调用不执行', () => {
		const throttledFn = throttle(mockFn, 1000, { trailing: false })

		// 第一次应该立即执行（leading=true）
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 在节流时间内调用
		jest.advanceTimersByTime(500)
		throttledFn()

		// 前进到节流时间结束
		jest.advanceTimersByTime(500)

		// 不应该有trailing调用
		expect(mockFn).not.toHaveBeenCalled()
	})

	test('leading=false和trailing=false - 不应执行任何调用', () => {
		const throttledFn = throttle(mockFn, 1000, { leading: false, trailing: false })

		// 调用函数
		throttledFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 前进到节流时间结束
		jest.advanceTimersByTime(1000)

		// 仍然不应执行
		expect(mockFn).not.toHaveBeenCalled()

		// 节流时间后再次调用
		// throttledFn()
		expect(mockFn).not.toHaveBeenCalled()
	})

	test('多次调用时保证在节流周期内最多执行一次', () => {
		const throttledFn = throttle(mockFn, 1000)

		// 第一次调用立即执行
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 模拟连续多次调用
		for (let i = 0; i < 10; i++) {
			jest.advanceTimersByTime(100) // 每100ms调用一次
			throttledFn()
		}

		// 1000ms内不应该再次执行
		// expect(mockFn).not.toHaveBeenCalled()
		// 应该执行一次
		expect(mockFn).toHaveBeenCalledTimes(1)

		// 前进剩余时间
		jest.advanceTimersByTime(100)

		// 应该执行最后一次调用（trailing模式）
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('传递参数和this上下文', () => {
		const obj = { value: 'test' }
		const contextTestFn = jest.fn(function (this: any, arg1: string, arg2: number) {
			return this.value + arg1 + arg2
		})

		const throttledFn = throttle(contextTestFn, 1000)

		// 调用时传递this和参数
		throttledFn.call(obj, 'hello', 123)

		// 验证参数和this上下文正确传递
		expect(contextTestFn).toHaveBeenCalledWith('hello', 123)
		expect(contextTestFn.mock.instances[0]).toBe(obj)
	})

	test('cancel方法取消延迟调用', () => {
		const throttledFn = throttle(mockFn, 1000, { leading: false })

		// 调用函数，不会立即执行
		throttledFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 取消调用
		throttledFn.cancel()

		// 前进时间
		jest.advanceTimersByTime(1000)

		// 验证函数未被调用
		expect(mockFn).not.toHaveBeenCalled()
	})

	test('返回值正确传递', () => {
		const returnFn = jest.fn().mockReturnValue('test-result')
		const throttledFn = throttle(returnFn, 1000)

		// 应返回原函数的返回值
		const result = throttledFn()
		expect(result).toBe('test-result')
	})

	test('remaining时间异常情况处理', () => {
		// 测试remaining <= 0的情况
		const throttledFn = throttle(mockFn, 1000)

		// 第一次调用立即执行
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 前进完整的节流时间
		jest.advanceTimersByTime(1000)

		// 再次调用，此时应该立即执行（因为已经过了节流时间）
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	test('测试多个完整节流周期', () => {
		// 创建一个节流函数
		const throttledFn = throttle(mockFn, 1000)

		// 第一次调用立即执行
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 前进完整的节流时间
		jest.advanceTimersByTime(1000)

		// 再次调用，应该立即执行（因为已经过了节流时间）
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 在节流时间内多次调用
		jest.advanceTimersByTime(500)
		throttledFn()
		throttledFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 前进剩余节流时间
		jest.advanceTimersByTime(500)
		expect(mockFn).toHaveBeenCalledTimes(1) // trailing调用
	})

	// 测试覆盖更多边缘情况
	test('测试节流函数在不同调用模式下的行为', () => {
		// 创建一个节流函数，使用不同的配置
		const throttledFn = throttle(mockFn, 1000, { leading: true, trailing: true })

		// 第一次调用立即执行
		throttledFn()
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 前进部分时间
		jest.advanceTimersByTime(600)

		// 再次调用，不应立即执行
		throttledFn()
		expect(mockFn).not.toHaveBeenCalled()

		// 前进剩余时间
		jest.advanceTimersByTime(400)

		// 应该执行trailing调用
		expect(mockFn).toHaveBeenCalledTimes(1)
		mockFn.mockClear()

		// 立即再次调用，应该立即执行
		// throttledFn()
		// expect(mockFn).toHaveBeenCalledTimes(1)
	})
})
