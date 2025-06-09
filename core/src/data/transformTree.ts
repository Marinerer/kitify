interface Options<T> {
	/**
	 * 结果过滤器
	 * @param item 当前节点数据
	 * @returns
	 */
	filter?: (item: any) => boolean

	/**
	 * 结果子节点属性名
	 * @default 'children'
	 */
	childKey?: keyof T

	/**
	 * 数据子节点属性名
	 * @default 'children'
	 */
	childProp?: keyof T
}

/**
 * 转换树形结构数据
 * @param {Array} tree 树形结构数据
 * @param {Object} transformer 数据转换函数
 * @param {Object} options 转换选项
 * @param {String} options.filter filter 结果过滤器
 * @param {String} options.childKey childKey 结果`子节点`属性名
 * @param {String} options.childProp childProp 数据`子节点`属性名
 * @returns {Array} 转换后的树形结构数据
 */
function transformTree<T extends Record<string, any>>(
	tree: T[],
	transformer: (node: T) => any,
	options: Options<T> = {}
) {
	// 参数校验
	if (!Array.isArray(tree)) return []

	if (typeof transformer !== 'function') {
		console.warn('[transformTree]', 'transformer must be a function')
		return tree
	}

	//处理参数
	const { childKey = 'children', childProp = 'children', filter } = options || {}

	function _transform(subTree: T[]) {
		// 递归处理每个节点
		const result = subTree.map((node) => {
			const item = transformer(node)
			if (item && typeof item === 'object') {
				// 如果存在子节点，则递归处理子节点
				if (node[childProp]?.length) {
					item[childKey] = _transform(node[childProp])
				}
			}
			/* else {
        console.warn('[transformTree]', 'The transformer function must return an object')
      } */

			return item
		})

		//结合 transformer 函数对结果进行过滤
		return typeof filter === 'function' ? result.filter(filter) : result
	}

	return _transform(tree)
}

export default transformTree
