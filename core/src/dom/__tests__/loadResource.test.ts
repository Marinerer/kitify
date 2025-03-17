//@ts-nocheck

import loadResource from '../loadResource'

describe('loadResource', () => {
	// 在每个测试前重置DOM
	beforeEach(() => {
		document.body.innerHTML = ''
		document.head.innerHTML = ''
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.clearAllTimers()
	})

	test('Should throw an error when the url is invalid', () => {
		expect(() => loadResource('')).toThrow('Invalid url')
		expect(() => loadResource(null)).toThrow('Invalid url')
		expect(() => loadResource(undefined)).toThrow('Invalid url')
		expect(() => loadResource(123)).toThrow('Invalid url')
	})

	test('Should throw an error when the tag is invalid', () => {
		expect(() => loadResource('https://example.com/test.js', { tag: 'invalid' })).toThrow(
			'Invalid tag'
		)
	})

	test('Should load <img>', () => {
		const onload = jest.fn()
		const result = loadResource('https://example.com/image.jpg', {
			tag: 'img',
			onload,
		})

		expect(result.element).toBeInstanceOf(HTMLImageElement)
		expect(result.element.src).toBe('https://example.com/image.jpg')
		expect(result.element.getAttribute('data-load-status')).toBe('loading')
		expect(document.body.contains(result.element)).toBe(true)

		// 模拟加载完成
		result.element.dispatchEvent(new Event('load'))
		expect(result.element.getAttribute('data-load-status')).toBe('loaded')
		expect(onload).toHaveBeenCalledWith(result.element, expect.any(Function), expect.any(Event))
	})

	test('Should load <script>', () => {
		const onload = jest.fn()
		const result = loadResource('https://example.com/script.js', {
			tag: 'script',
			async: true,
			defer: true,
			onload,
		})

		expect(result.element).toBeInstanceOf(HTMLScriptElement)
		expect(result.element.src).toBe('https://example.com/script.js')
		expect(result.element.async).toBe(true)
		expect(result.element.defer).toBe(true)
		expect(result.element.getAttribute('data-load-status')).toBe('loading')
		expect(document.head.contains(result.element)).toBe(true)

		// 模拟加载完成
		result.element.dispatchEvent(new Event('load'))
		expect(onload).toHaveBeenCalled()
		expect(result.element.getAttribute('data-load-status')).toBe('loaded')
	})

	test('Should load <link>', () => {
		const onload = jest.fn()
		const result = loadResource('https://example.com/styles.css', {
			tag: 'link',
			attributes: { id: 'test-css' },
			onload,
		})

		expect(result.element).toBeInstanceOf(HTMLLinkElement)
		expect(result.element.href).toBe('https://example.com/styles.css')
		expect(result.element.rel).toBe('stylesheet')
		expect(result.element.type).toBe('text/css')
		expect(result.element.getAttribute('id')).toBe('test-css')
		expect(result.element.getAttribute('data-load-status')).toBe('loading')
		expect(document.head.contains(result.element)).toBe(true)

		// 模拟加载完成
		result.element.dispatchEvent(new Event('load'))
		expect(onload).toHaveBeenCalled()
	})

	test('Should handle error', () => {
		const onerror = jest.fn()
		const result = loadResource('https://example.com/fail.js', {
			tag: 'script',
			onerror,
		})

		// 模拟加载失败
		result.element.dispatchEvent(new Event('error'))
		expect(onerror).toHaveBeenCalled()
		expect(result.element.getAttribute('data-load-status')).toBe('error')
		expect(document.head.contains(result.element)).toBe(false) // 元素应该被移除
	})

	test('Should handle timeout', () => {
		const onerror = jest.fn()
		const result = loadResource('https://example.com/timeout.js', {
			tag: 'script',
			timeout: 5000,
			onerror,
		})

		expect(result.element.getAttribute('data-load-status')).toBe('loading')

		// 模拟超时
		jest.advanceTimersByTime(5001)
		expect(onerror).toHaveBeenCalled()
		const errorArg = onerror.mock.calls[0][1]
		expect(errorArg.message).toContain('Timeout')
		expect(document.head.contains(result.element)).toBe(false) // 元素应该被移除
	})

	test('Should check for existing resources and return them', () => {
		// 先加载一个资源
		const firstLoad = loadResource('https://example.com/existing.js', { tag: 'script' })
		firstLoad.element.setAttribute('data-load-status', 'loaded')

		const onload = jest.fn()
		// 尝试再次加载同一资源
		const secondLoad = loadResource('https://example.com/existing.js', {
			tag: 'script',
			onload,
		})

		expect(secondLoad.element).toBe(firstLoad.element)
		expect(onload).toHaveBeenCalled()
	})

	test('Should skip that Resources are loading', () => {
		// 先加载一个资源
		const firstLoad = loadResource('https://example.com/loading.js', { tag: 'script' })
		expect(firstLoad.element.getAttribute('data-load-status')).toBe('loading')

		// 尝试再次加载同一资源
		const secondLoad = loadResource('https://example.com/loading.js', { tag: 'script' })
		expect(secondLoad).toBeUndefined() // 应该返回undefined
	})

	test('Should clear the resource of loaded error ', () => {
		// 先加载一个资源并标记为失败
		const firstLoad = loadResource('https://example.com/failed.js', { tag: 'script' })
		firstLoad.element.setAttribute('data-load-status', 'error')

		const onerror = jest.fn()
		// 尝试再次加载同一资源
		const secondLoad = loadResource('https://example.com/failed.js', {
			tag: 'script',
			onerror,
		})

		expect(onerror).toHaveBeenCalled()
		expect(secondLoad).toBeUndefined() // 应该返回undefined，因为资源被清除后重新加载
	})

	test('Should be correctly handle when options‘s type is string', () => {
		const result = loadResource('https://example.com/image.jpg', 'img')
		expect(result.element).toBeInstanceOf(HTMLImageElement)
		expect(result.element.src).toBe('https://example.com/image.jpg')
	})

	test('Should be correctly set custom attributes', () => {
		const result = loadResource('https://example.com/image.jpg', {
			tag: 'img',
			attributes: {
				'data-test': 'test-value',
				alt: 'Test Image',
			},
		})

		expect(result.element.getAttribute('data-test')).toBe('test-value')
		expect(result.element.getAttribute('alt')).toBe('Test Image')
	})

	test('Should be correctly remove element and unbind events when the clean() be called', () => {
		const result = loadResource('https://example.com/image.jpg', { tag: 'img' })

		// 添加spy来检测事件监听器的移除
		const spy = jest.spyOn(result.element, 'removeEventListener')

		result.clean()

		expect(document.body.contains(result.element)).toBe(false)
		expect(spy).toHaveBeenCalledWith('load', expect.any(Function))
		expect(spy).toHaveBeenCalledWith('error', expect.any(Function))

		spy.mockRestore()
	})

	test('should be support appendTo option', () => {
		const customContainer = document.createElement('div')
		document.body.appendChild(customContainer)

		const result = loadResource('https://example.com/image.jpg', {
			tag: 'img',
			appendTo: customContainer,
		})

		expect(customContainer.contains(result.element)).toBe(true)
	})

	test('Should not be checked when checkExist=false', () => {
		// 先加载一个资源
		loadResource('https://example.com/duplicate.js', { tag: 'script' })

		// 使用checkExist=false选项再次加载
		const result = loadResource('https://example.com/duplicate.js', {
			tag: 'script',
			checkExist: false,
		})

		// 应该创建一个新元素而不是复用现有的
		expect(document.querySelectorAll('script[src="https://example.com/duplicate.js"]').length).toBe(
			2
		)
	})
})
