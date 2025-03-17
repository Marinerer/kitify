interface IOptions {
	tag?: 'img' | 'script' | 'link'
	attributes?: Record<string, string>
	async?: boolean
	defer?: boolean
	timeout?: number
	onload?: (el: HTMLElement, clean: () => void, event?: Event) => void
	onerror?: (el: HTMLElement, event?: Event) => void
	checkExist?: boolean
	appendTo?: HTMLElement
}

const LOAD_STATUS = {
	LOADING: 'loading',
	LOADED: 'loaded',
	ERROR: 'error',
} as const

const defaults = {
	tag: 'img', //img, script, link
	attributes: {
		crossorigin: 'anonymous',
	},
	async: true,
	defer: false,
	timeout: 0,
	onload: null,
	onerror: null,
	checkExist: true,
	appendTo: document.body,
}

const handlers = {
	img: {
		get: (u: string) => `img[src="${u}"]`,
		setUrl: (el: HTMLImageElement, url: string) => (el.src = url),
	},
	script: {
		get: (u: string) => `script[src="${u}"]`,
		setUrl: (el: HTMLScriptElement, url: string) => (el.src = url),
	},
	link: {
		get: (u: string) => `link[href="${u}"]`,
		setUrl: (el: HTMLLinkElement, url: string) => (el.href = url),
	},
}

export function loadResource(url: string, options: IOptions = {}) {
	if (!url || typeof url !== 'string') {
		throw new Error('Invalid url')
	}
	if ((options.tag === 'link' || options.tag === 'script') && !options.appendTo) {
		options.appendTo = document.head
	}

	const opts = { ...defaults, ...options }
	const tag = opts.tag.toLowerCase()
	const handler = handlers[tag as keyof typeof handlers]

	if (!handler) {
		throw new Error('Invalid tag')
	}

	// 检查资源是否已存在
	if (opts.checkExist) {
		const existEl = document.querySelector(handler.get(url)) as HTMLElement
		if (existEl) {
			const status = existEl.getAttribute('data-load-status')
			const clean = () => existEl.parentNode?.removeChild(existEl)

			if (!status || status === 'loaded') {
				const result = {
					element: existEl,
					clean,
				}
				opts.onload?.(result.element, result.clean)
				return result
			}
			if (status === 'error') {
				opts.onerror?.(existEl, new Error('Resource previously failed to load'))
				clean()
				return
			}
			if (status === 'loading') return
		}
	}

	let timeoutId
	const suffix = url.split('/').pop().split('?')[0].split('.').pop()
	const el = document.createElement(tag)
	el.setAttribute('data-load-status', 'loading')

	// 设置必须属性
	if (tag === 'link' && suffix === 'css') {
		el.rel = 'stylesheet'
		el.type = 'text/css'
	}
	// 设置自定义属性
	for (const attr in opts.attributes) {
		if (Object.prototype.hasOwnProperty.call(opts.attributes, attr)) {
			el.setAttribute(attr, opts.attributes[attr])
		}
	}
	// 设置 script 加载属性
	if (tag === 'script') {
		if (opts.async) el.async = true
		if (opts.defer) el.defer = true
	}

	function handleLoad(event) {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		el.setAttribute('data-load-status', 'loaded')
		opts.onload?.(el, clean, event)
	}

	function handleError(event) {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		el.setAttribute('data-load-status', 'error')
		opts.onerror?.(el, event)
		clean()
	}

	function clean() {
		el.removeEventListener('load', handleLoad)
		el.removeEventListener('error', handleError)
		const parentEl = el?.parentNode
		if (parentEl) {
			parentEl.removeChild(el)
		} else {
			el?.remove()
		}
	}

	if (opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			if (el.getAttribute('data-load-status') === 'loading') {
				handleError(new Error(`Timeout: ${url}`))
			}
		}, opts.timeout)
	}

	el.addEventListener('load', handleLoad)
	el.addEventListener('error', handleError)
	handler.setUrl(el, url)

	if (opts.appendTo) {
		opts.appendTo.appendChild(el)
	}

	return {
		element: el,
		clean,
	}
}
