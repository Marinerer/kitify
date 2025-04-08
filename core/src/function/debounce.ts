/**
 * 防抖函数
 * 实现原理: 每次触发事件时都取消之前的延时调用方法
 * 应用场景: 按钮提交、搜索框输入、窗口大小改变事件
 * 实现方式: 利用setTimeout返回的id清除延时调用
 *
 * @example
 * const inputFunc = debounce((e) => {
 *   console.log('input');
 * }, 1000);
 * input.addEventListener('input', inputFunc);
 *
 */

/**
 * 防抖函数
 * @param func 要执行的函数
 * @param wait 等待时间
 * @param immediate 是否立即执行 (true: leading模式，false: trailing模式)
 * @returns 防抖函数
 */
function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate?: boolean
): T & { cancel: () => void } {
	let timeout: ReturnType<typeof setTimeout> | null = null
	let result: ReturnType<T>
	let previous = 0 // 上一次执行的时间戳
	let _ctx: any
	let _args: Parameters<T> | null = null

	// 延迟执行的函数
	const later = () => {
		// 计算距离上次执行的时间间隔
		const passed = Date.now() - previous
		if (wait > passed) {
			// 1. 频繁操作时
			timeout = setTimeout(later, wait - passed)
		} else {
			// 2. 空闲时
			timeout = null
			// 滞后执行函数, trailing模式
			if (!immediate) result = func.apply(_ctx, _args!)
			if (!timeout) _ctx = _args = null
		}
	}

	function debounced(this: any, ...args: Parameters<T>) {
		_ctx = this
		_args = args
		previous = Date.now()

		if (!timeout) {
			timeout = setTimeout(later, wait)
			// 立即执行函数, leading模式
			if (immediate) result = func.apply(_ctx, _args!)
		}

		return result
	}

	debounced.cancel = function () {
		if (timeout) clearTimeout(timeout)
		timeout = null
		_ctx = _args = null
	}

	return debounced as T & { cancel: () => void }
}

export default debounce

/**
 * 防抖函数
 * 
// 1. 非立即执行版 (trailing模式, 滞后执行)
function debounce(func, wait) {
	let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    }
}

// 2. 支持立即执行版
function debounce(func, wait, immediate) {
	let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            // 2.滞后执行, trailing模式
            if (!immediate) func.apply(this, args);
        }, wait);
        if (immediate && !timer) {
            // 1.立即执行, leading模式
            func.apply(this, args);
        }
    }
} */
