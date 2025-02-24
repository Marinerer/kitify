/**
 * 调度并运行一个微任务。
 *
 * 这个函数旨在尽快执行提供的任务，但不会阻塞当前执行线程。
 * 它会尝试使用现代浏览器和Node.js环境中可用的最高效的微任务调度机制。
 *
 * @param task - 要执行的任务
 */
export default function runMicrotask(task: (...args: any[]) => any) {
	// 内置的微任务调度器，性能更优
	if (typeof queueMicrotask === 'function') {
		queueMicrotask(task)
	} else if (typeof process === 'object' && typeof process.nextTick === 'function') {
		// Node.js环境
		process.nextTick(task)
	} else if (typeof Promise !== 'undefined') {
		// 简单，适用于大多数场景
		Promise.resolve().then(task)
	} else if (typeof MutationObserver === 'function') {
		// 兼容低版本的浏览器
		const div = document.createElement('div')
		const observer = new MutationObserver(() => {
			observer.disconnect()
			task()
		})
		observer.observe(div, { attributes: true })
		div.setAttribute('data', 'data')
	} else {
		// 兜底方案
		setTimeout(task, 0)
	}
}
