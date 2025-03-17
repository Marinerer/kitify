interface TagElementMap {
	img: HTMLImageElement
	script: HTMLScriptElement
	link: HTMLLinkElement
}

interface IOptions<T extends keyof TagElementMap> {
	tag: T
	attributes?: Record<string, string>
	async?: boolean
	defer?: boolean
	timeout?: number
	onload?: (el: TagElementMap[T], clean: () => void, event?: Event) => void
	onerror?: (el: TagElementMap[T], err?: Error) => void
	checkExist?: boolean
	appendTo?: HTMLElement
}

interface TagHandler<T extends keyof TagElementMap> {
	get: (url: string) => string
	setUrl: (el: TagElementMap[T], url: string) => void
}

const LOAD_STATUS = {
	LOADING: 'loading',
	LOADED: 'loaded',
	ERROR: 'error',
} as const

const defaults: IOptions<'img'> = {
	tag: 'img', //img, script, link
	attributes: {
		crossorigin: 'anonymous',
	} as IOptions<'img'>['attributes'],
	async: true,
	defer: false,
	timeout: 0,
	checkExist: true,
	appendTo: document.body,
}

const handlers: {
	[T in keyof TagElementMap]: TagHandler<T>
} = {
	img: {
		get: (u) => `img[src="${u}"]`,
		setUrl: (el, url) => (el.src = url),
	},
	script: {
		get: (u) => `script[src="${u}"]`,
		setUrl: (el, url) => (el.src = url),
	},
	link: {
		get: (u) => `link[href="${u}"]`,
		setUrl: (el, url) => (el.href = url),
	},
}

export function loadResource<T extends keyof TagElementMap>(
	url: string,
	options: IOptions<T> = {} as IOptions<T>
) {
	if (!url || typeof url !== 'string') {
		throw new Error('Invalid url')
	}
	if ((options.tag === 'link' || options.tag === 'script') && !options.appendTo) {
		options.appendTo = document.head
	}

	const opts = { ...defaults, ...options } as IOptions<T>
	const tag = opts.tag.toLowerCase() as T
	const handler = handlers[tag]

	if (!handler) {
		throw new Error('Invalid tag')
	}

	// 检查资源是否已存在
	if (opts.checkExist) {
		const existEl = document.querySelector(handler.get(url)) as TagElementMap[T]
		if (existEl) {
			const status = existEl.getAttribute('data-load-status')
			const clean = () => existEl.parentNode?.removeChild(existEl)

			if (!status || status === LOAD_STATUS.LOADED) {
				const result = {
					element: existEl,
					clean,
				}
				opts.onload?.(result.element, result.clean)
				return result
			}
			if (status === LOAD_STATUS.ERROR) {
				opts.onerror?.(existEl, new Error('Resource previously failed to load'))
				clean()
				return
			}
			if (status === LOAD_STATUS.LOADING) return
		}
	}

	let timeoutId: number | null = null
	const suffix = url.split('/').pop()?.split('?')[0].split('.').pop()
	const el = document.createElement(tag) as TagElementMap[T]
	el.setAttribute('data-load-status', LOAD_STATUS.LOADING)

	// 设置必须属性
	if (tag === 'link' && suffix === 'css') {
		;(el as TagElementMap['link']).rel = 'stylesheet'
		;(el as TagElementMap['link']).type = 'text/css'
	}
	// 设置自定义属性
	for (const attr in opts.attributes) {
		if (Object.prototype.hasOwnProperty.call(opts.attributes, attr)) {
			el.setAttribute(attr, opts.attributes[attr])
		}
	}
	// 设置 script 加载属性
	if (tag === 'script') {
		if (opts.async) (el as TagElementMap['script']).async = true
		if (opts.defer) (el as TagElementMap['script']).defer = true
	}

	function handleLoad(event: Event) {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		el.setAttribute('data-load-status', LOAD_STATUS.LOADED)
		opts.onload?.(el, clean, event)
	}

	// 处理错误事件
	function handleError(event: Event | Error) {
		// 清除定时器
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		// 设置元素状态为加载失败
		el.setAttribute('data-load-status', LOAD_STATUS.ERROR)
		opts.onerror?.(
			el,
			event instanceof Error ? event : new Error(`Failed to load resource: ${url}`)
		)
		// 解绑事件并清除元素
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

	if (opts.timeout! > 0) {
		timeoutId = window.setTimeout(() => {
			if (el.getAttribute('data-load-status') === LOAD_STATUS.LOADING) {
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
