interface Options<T, K> {
	/**
	 * 目标属性
	 * @default 'value'
	 */
	key: K

	/**
	 * 子节点属性
	 * @default 'children'
	 */
	children?: keyof T

	/**
	 * 节点数据转换器
	 * @param node 节点数据
	 * @returns 转换后的数据
	 */
	transformer?: (node: T) => any
}

type ValidatorFunc<T> = (node: T) => boolean

/**
 * 递归查找路径
 * @param {array} tree 树形结构数据
 * @param {string|number|function} value 查找目标
 * @param {object} options 配置项
 * @param {String} options.key 目标属性
 * @param {String} options.children 子节点属性
 * @param {String} options.transformer 节点数据转换器
 * @returns {array} 路径
 */
function findPath<T extends Record<string, any>, K extends keyof T>(
	tree: T[],
	value: T[K] | ValidatorFunc<T>,
	options: Options<T, K> | K
) {
	// 参数校验
	if (!Array.isArray(tree)) return []

	// 统一options参数
	if (typeof options === 'string') {
		options = { key: options }
	}
	let { key = 'value', children = 'children', transformer } = (options || {}) as Options<T, K>
	if (typeof transformer !== 'function') {
		transformer = (node) => node[key]
	}

	// 统一查找逻辑
	const validator =
		typeof value === 'function' ? (value as ValidatorFunc<T>) : (node: T) => node[key] === value

	function _findPath(subTree: T[]): any[] {
		for (let node of subTree) {
			// 如果当前节点匹配
			if (validator(node)) {
				return [transformer!(node)]
			}

			// 如果有子节点，递归查找
			const childNodes = node[children]
			if (Array.isArray(childNodes) && childNodes.length) {
				const paths = _findPath(childNodes)
				if (paths.length) {
					paths.unshift(transformer!(node))
					return paths
				}
			}
		}
		//未找到目标节点
		return []
	}

	return _findPath(tree)
}

export default findPath
