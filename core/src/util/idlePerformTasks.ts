type SchedulerNext = (time: number) => boolean //是否还有剩余时间继续执行
type SchedulerCallback = (go: SchedulerNext) => void //调度任务
type SchedulerFunc = (callback: SchedulerCallback) => void

/**
 * 创建一个任务调度器，支持不同的运行环境。如果有剩余时间则执行任务。
 * 1.在浏览器环境中，使用requestIdleCallback或requestAnimationFrame来调度任务
 * 2.在非浏览器环境中，使用setImmediate来调度任务
 */
const createScheduler = () => {
	// 浏览器环境,使用 requestAnimationFrame 模拟 requestIdleCallback 的实现
	// 如果当前渲染帧还有剩余时间，则执行任务。返回剩余时间，最多为 16.666 毫秒
	if (typeof window !== 'undefined' && window.document) {
		// requestIdle 函数会在每一帧的空闲时间执行回调函数，并计算剩余时间。
		const requestIdle =
			window.requestIdleCallback ||
			((callback) =>
				window.requestAnimationFrame(() => {
					const start = performance.now()
					callback({
						didTimeout: false,
						timeRemaining: () => Math.max(0, 16.666 - (performance.now() - start)),
					})
				}))

		return (callback: SchedulerCallback) =>
			requestIdle((idle) => callback(() => idle.timeRemaining() > 0))
	} else {
		// node环境
		return (callback: SchedulerCallback) =>
			setImmediate(() => callback((time: number) => time < 16))
	}
}

/**
 * 在空闲时间执行任务,避免阻塞主线程
 * @description 空闲时间执行任务仅在浏览器环境中有效，node环境中不存在空闲时间。node环境中setImmediate用于在当前事件循环的末尾执行任务(相当于分片执行任务)。
 * @param {function} scheduler - 任务调度器
 * @returns {function} - 执行任务的函数
 * @example `scheduler = (cb) => setTimeout(() => cb(t => t < 16), 20);`
 */
function idlePerformTasks(
	scheduler?: SchedulerFunc
): (tasks: Array<(index: Number) => void>) => void {
	if (typeof scheduler !== 'function') {
		scheduler = createScheduler()
	}

	return (tasks) => {
		if (!Array.isArray(tasks) || tasks.length === 0) {
			return
		}

		let i = 0
		function run() {
			// 调度一个任务，在空闲时执行
			// go 是一个函数，表示是否还有剩余时间继续执行任务，传递的参数是剩余时间
			scheduler!((go) => {
				try {
					const start = performance.now()
					// 当调度器允许继续执行且有更多任务时，不断执行任务
					while (go(performance.now() - start) && i < tasks.length) {
						try {
							tasks[i](i)
						} catch (err) {
							//避免错误导致后续任务执行中断
							console.error(`Task at index ${i} failed with error:`, err)
						}
						i++
					}

					// 如果还有未执行的任务，则再次运行
					if (i < tasks.length) {
						run()
					}
				} catch (err) {
					console.error('Scheduler failed with error:', err)
				}
			})
		}

		run()
	}
}

export default idlePerformTasks
