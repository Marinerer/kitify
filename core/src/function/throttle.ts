/**
 * 节流函数
 * 实现原理: 利用时间戳和定时器
 * 应用场景: 拖拽、缩放、动画等
 * 实现方式: 通过闭包保存一个标记来判断是否需要执行函数
 *
 * @example
 * const resizeFunc = throttle((e) => {
 *   console.log('resize');
 * }, 1000);
 * window.addEventListener('resize', resizeFunc);
 *
 */

/**
 * 节流函数
 * @param func 要执行的函数
 * @param wait 等待时间
 * @param options 选项
 * @param options.leading 是否立即执行 (true: leading模式，false: trailing模式)
 * @param options.trailing 是否在最后一次调用后执行一次 (true: trailing模式，false: 不执行)
 * @returns 节流函数
 */
function throttle<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	options?: { leading?: boolean; trailing?: boolean }
): T & { cancel: () => void } {
	let timeout: ReturnType<typeof setTimeout> | null = null
	let previous = 0 // 上一次执行的时间
	// leading: true/false 表示第一次事件立即执行/等待后执行
	// trailing: true/false 表示最后一次事件是否执行
	const { leading = true, trailing = true } = options || {}
	let result: ReturnType<T>
	let _ctx: any
	let _args: Parameters<T> | null = null

	const later = () => {
		previous = leading === false ? 0 : Date.now()
		timeout = null
		result = func.apply(_ctx, _args!)
		if (!timeout) _ctx = _args = null
	}

	function throttled(this: any, ...args: Parameters<T>) {
		const now = Date.now()
		// 如果是第一次调用，且leading为false，则不执行函数
		if (!previous && !leading) previous = now
		// 计算距离下次执行还需要等待的时间
		const remaining = wait - (now - previous)
		_ctx = this
		_args = args
		// 等待时间<=0 或 异常，则执行函数
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			previous = now
			result = func.apply(_ctx, _args!)
			if (!timeout) _ctx = _args = null
		} else if (!timeout && trailing !== false) {
			// 定时器不存在时且最后一次触发需要执行回调的情况下，设置定时器
			timeout = setTimeout(later, remaining)
		}
		return result
	}

	throttled.cancel = function () {
		clearTimeout(timeout!)
		previous = 0
		timeout = null
		_ctx = _args = null
	}

	return throttled as T & { cancel: () => void }
}

export default throttle

/**
 * 节流函数
 * 
// 1.普通节流
function throttle(func, wait) {
    let timer = null;
    return (...args) => {
        if (timer) return;
        timer = setTimeout(() => {
            func.apply(this, args);
            timer = null;
        }, wait);
    }
}

// 2.立即执行一次
function throttle(func, wait) {
    let timer = null;
    let last = 0; // 上一次执行的时间
    return (...args) => {
        clearTimeout(timer);
        let now = Date.now(); // 当前时间
        // 距离上次执行时间大于等于wait时，执行函数
        if (now - last >= wait) {
            func.apply(this, args);
            last = now; // 更新上一次执行时间
        } else {
            timer = setTimeout(() => {
                func.apply(this, args);
                last = Date.now();
            }, wait);
        }
    }
}
*/
