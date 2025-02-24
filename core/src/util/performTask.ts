type TaskFn = (...args: any[]) => any
type TaskSchedulerCallback = (go: (time: number) => boolean) => void
type TaskScheduler = (callback: TaskSchedulerCallback) => number | NodeJS.Timeout

interface IdleDeadline {
	readonly didTimeout: boolean
	timeRemaining(): number
}
type IdleTaskScheduler = (callback: (deadline: IdleDeadline) => void) => number | NodeJS.Timeout

/**
 * 创建一个空闲调度器，用于在浏览器空闲时执行任务,避免阻塞主线程。
 * 空闲时间执行任务仅在浏览器环境中有效，node环境中不存在空闲时间。
 */
function createIdleScheduler(): IdleTaskScheduler {
	// 1.使用requestIdleCallback作为空闲调度的函数
	if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
		return window.requestIdleCallback.bind(window)
	}
	// 2.使用requestAnimationFrame模拟空闲调度的函数
	if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
		return (callback) =>
			window.requestAnimationFrame(() => {
				const start = performance.now()
				callback({
					didTimeout: false,
					timeRemaining: () => Math.max(0, 16.666 - (performance.now() - start)),
				})
			})
	}
	// 3.使用setTimeout模拟空闲调度的函数
	return (callback) =>
		setTimeout(() => {
			const start = performance.now()
			callback({
				didTimeout: false,
				timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
			})
		})
}

/**
 * 创建一个调度任务执行函数，用于执行任务队列中的任务
 * @param {Function} scheduler - 任务调度函数，用于控制任务的执行时机。默认为一个空闲调度器
 * @returns {Object} - 返回一个对象，包含运行任务和添加任务的方法
 * @example
 * scheduler = (cb) => setTimeout(() => cb(t => t < 16), 20);
 * schedule = performTask(scheduler);
 * schedule.addTask(() => {});
 * schedule.run()
 */
function performTask(scheduler: TaskScheduler) {
	const tasks: TaskFn[] = [] // 任务队列
	let running = false // 是否正在执行任务
	let started = false // 是否已启动调度器

	// 创建默认调度器
	if (typeof scheduler !== 'function') {
		const _idleScheduler = createIdleScheduler()
		scheduler = (callback) =>
			_idleScheduler((deadline) =>
				callback(() => deadline.timeRemaining() > 0 || deadline.didTimeout)
			)
	}

	const run = () => {
		// 变更启动状态
		if (!started) started = true
		// 如果没有任务，则直接返回
		if (tasks.length === 0) return
		// 变更执行任务状态
		if (!running) running = true

		// 调度一个任务 (在空闲时执行)
		// go 是一个函数，判断是否还有剩余时间继续执行任务，传递的参数是剩余时间
		scheduler((go) => {
			try {
				const start = performance.now()
				// 当调度器允许继续执行且有更多任务时，不断执行任务
				while (go(performance.now() - start) && tasks.length > 0) {
					try {
						const task = tasks.shift()
						task!()
					} catch (err) {
						//避免错误导致后续任务执行中断
						console.error('Task failed with error:', err)
					}
				}

				// 如果还有未执行的任务，则再次运行
				if (tasks.length > 0) {
					run()
				} else {
					// 所有任务执行完毕，暂停运行
					running = false
				}
			} catch (err) {
				console.error('Scheduler failed with error:', err)
			}
		})
	}

	/**
	 * 添加一个新任务到任务队列中
	 * @param {Function} fn 任务函数
	 */
	const addTask = (fn: TaskFn) => {
		if (typeof fn !== 'function') {
			throw new TypeError('Argument must be a function')
		}

		tasks.push(fn)

		if (started && !running) {
			run()
		}
	}

	return {
		run,
		addTask,
	}
}

export default performTask
