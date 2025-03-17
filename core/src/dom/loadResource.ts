interface TagElementMap {
	img: HTMLImageElement
	script: HTMLScriptElement
	link: HTMLLinkElement
}

interface IOptions<T extends keyof TagElementMap> {
	/**
	 * 标签类型
	 * @type 'img' | 'script' | 'link'
	 */
	tag: T

	/**
	 * 标签属性
	 */
	attributes?: Record<string, string>

	/**
	 * 是否异步加载
	 * @default false
	 * @see https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#attr-async
	 */
	async?: boolean

	/**
	 * 是否延迟加载
	 * @default false
	 * @see https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script#attr-defer
	 */
	defer?: boolean

	/**
	 * 加载超时时间
	 * @default 0
	 */
	timeout?: number

	/**
	 * 加载成功回调
	 */
	onload?: (el: TagElementMap[T], clean: () => void, event?: Event) => void

	/**
	 * 加载失败回调
	 */
	onerror?: (el: TagElementMap[T], err?: Error) => void

	/**
	 * 是否检查资源是否存在
	 * @default true
	 */
	checkExist?: boolean

	/**
	 * 插入到指定元素中
	 */
	appendTo?: HTMLElement
}

interface TagHandler<T extends keyof TagElementMap> {
	get: (url: string) => string
	setUrl: (el: TagElementMap[T], url: string) => void
}

// 加载状态映射
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

// 资源标签的处理函数
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

/**
 * 加载资源文件
 * 1. 支持 img, link, script 文件标签
 * 2. 检测已存在情况
 * @param {string} url 资源Url
 * @param {IOptions} options 配置项
 * @returns
 */
function loadResource<T extends keyof TagElementMap>(
	url: string,
	options: T | IOptions<T> = {} as IOptions<T>
) {
	if (!url || typeof url !== 'string') {
		throw new Error('Invalid url')
	}
	if (typeof options === 'string') {
		options = { tag: options }
	}
	if ((options.tag === 'link' || options.tag === 'script') && !options.appendTo) {
		options.appendTo = document.head
	}

	const opts = { ...defaults, ...options } as IOptions<T>
	const tag = opts.tag.toLowerCase() as T
	const handler = handlers[tag] // 资源处理函数

	if (!handler) {
		throw new Error('Invalid tag')
	}

	// 检查资源是否已存在
	// 1. 如果不是通过 函数创建的资源，则直接返回
	// 2. 如果通过函数创建的资源，则需要判断加载状态: `loading` 则什么都不做
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

	let timeoutId: number | null = null //超时计时器
	const suffix = url.split('/').pop()?.split('?')[0].split('.').pop()
	const el = document.createElement(tag) as TagElementMap[T]
	el.setAttribute('data-load-status', LOAD_STATUS.LOADING)

	// 1. 设置必要的属性
	if (tag === 'link' && suffix === 'css') {
		;(el as TagElementMap['link']).rel = 'stylesheet'
		;(el as TagElementMap['link']).type = 'text/css'
	}
	// 2. 设置自定义属性
	for (const attr in opts.attributes) {
		if (Object.prototype.hasOwnProperty.call(opts.attributes, attr)) {
			el.setAttribute(attr, opts.attributes[attr])
		}
	}
	// 3. 设置 script 加载属性
	if (tag === 'script') {
		if (opts.async) (el as TagElementMap['script']).async = true
		if (opts.defer) (el as TagElementMap['script']).defer = true
	}

	// 处理加载完成事件
	function handleLoad(event: Event) {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
		el.setAttribute('data-load-status', LOAD_STATUS.LOADED)
		opts.onload?.(el, clean, event)
	}

	// 处理加载失败事件
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
		// 清除处理
		clean()
	}

	// 清除函数: 解绑事件和移除元素
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

	// 加载超时处理
	if (opts.timeout! > 0) {
		timeoutId = window.setTimeout(() => {
			if (el.getAttribute('data-load-status') === LOAD_STATUS.LOADING) {
				handleError(new Error(`Timeout: ${url}`))
			}
		}, opts.timeout)
	}

	// 绑定事件
	el.addEventListener('load', handleLoad)
	el.addEventListener('error', handleError)
	handler.setUrl(el, url)

	// 插入元素
	if (opts.appendTo) {
		opts.appendTo.appendChild(el)
	}

	return {
		element: el,
		clean,
	}
}

export default loadResource
