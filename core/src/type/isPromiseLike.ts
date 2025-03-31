/**
 * 检查给定的值是否类似于 Promise。
 * 此函数用于确定一个值是否具有 Promise 的特征，即它是一个对象或函数，并且具有 then 方法。
 *
 * @param value - 要检查的值。
 */
export function isPromiseLike(value: any): value is Promise<any> {
	return (
		(typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function'
	)
}
