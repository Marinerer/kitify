import addInputListener from '../addInputListener'

describe('addInputListener', () => {
	let inputElement: HTMLInputElement
	let callback: jest.Mock<(value: string, event: Event) => void>
	let removeListeners: () => void

	beforeEach(() => {
		// 创建一个新的 input 元素并添加到文档中
		inputElement = document.createElement('input')
		inputElement.id = 'test-input'
		document.body.appendChild(inputElement)

		// 创建一个 jest mock 回调函数
		callback = jest.fn()
	})

	afterEach(() => {
		if (removeListeners) {
			removeListeners()
		}
		// 清理文档中的 input 元素
		document.body.removeChild(inputElement)
	})

	test('should call callback with input value on regular input', () => {
		removeListeners = addInputListener('#test-input', callback)

		inputElement.value = 'test'
		inputElement.dispatchEvent(new Event('input'))

		expect(callback).toHaveBeenCalledWith('test', expect.any(Event))
	})

	test('should call callback with input value on composition input', () => {
		removeListeners = addInputListener('#test-input', callback)

		inputElement.value = '测试'
		inputElement.dispatchEvent(new CompositionEvent('compositionstart'))
		inputElement.dispatchEvent(new CompositionEvent('compositionend'))

		expect(callback).toHaveBeenCalledWith('测试', expect.any(Event))
	})

	test('should not call callback during composition', () => {
		removeListeners = addInputListener('#test-input', callback)

		inputElement.value = '测试'
		inputElement.dispatchEvent(new CompositionEvent('compositionstart'))
		inputElement.dispatchEvent(new Event('input'))

		expect(callback).not.toHaveBeenCalled()
	})

	test('should throw an error if element is not found', () => {
		expect(() => {
			removeListeners = addInputListener('#non-existent-element', callback)
		}).toThrow('Element not found')
	})

	test('should accept a direct HTMLInputElement as argument', () => {
		removeListeners = addInputListener(inputElement, callback)

		inputElement.value = 'test'
		inputElement.dispatchEvent(new Event('input'))

		expect(callback).toHaveBeenCalledWith('test', expect.any(Event))
	})

	test('should remove event listeners on cleanup', () => {
		const removeCompositionStart = jest.spyOn(inputElement, 'removeEventListener')
		const removeCompositionEnd = jest.spyOn(inputElement, 'removeEventListener')
		const removeInput = jest.spyOn(inputElement, 'removeEventListener')

		removeListeners = addInputListener(inputElement, callback)
		removeListeners()

		expect(removeCompositionStart).toHaveBeenCalledWith('compositionstart', expect.any(Function))
		expect(removeCompositionEnd).toHaveBeenCalledWith('compositionend', expect.any(Function))
		expect(removeInput).toHaveBeenCalledWith('input', expect.any(Function))
	})
})
