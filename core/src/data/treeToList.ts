type Options<T, R> = {
	childrenKey?: string
	removeChildren?: boolean
	transform?: (node: T) => R
}

/**
 * 将树形结构转换为列表
 * @param tree 树形结构
 * @param options 配置项
 * @param options.childrenKey 子节点键名，默认为 'children'
 * @param options.removeChildren 是否移除子节点，默认为 true
 * @param options.transform 转换函数，默认为 (node) => ({ ...node })
 * @returns 列表
 */
function treeToList<T extends Record<string, any>, R extends Record<string, any> = T>(
	tree: T[] | T,
	options: Options<T, R> = {}
): R[] {
	const {
		childrenKey = 'children',
		removeChildren = true,
		transform = (node: T) => ({ ...node }) as unknown as R,
	} = options
	if (typeof tree !== 'object' || tree === null) {
		throw new TypeError('tree must be an object or array')
	}
	if (typeof transform !== 'function') {
		throw new TypeError('transform must be a function')
	}
	if (!Array.isArray(tree)) {
		tree = [tree]
	}

	const list: R[] = []
	const stack = [...tree]
	while (stack.length) {
		//深度优先遍历: 从栈中取出最后一个节点
		const node = stack.pop() as T
		const newNode = transform(node)
		if (removeChildren) delete newNode[childrenKey]
		list.push(newNode)

		if (node[childrenKey]) {
			// 从右到左逆序入栈, 保持深度优先遍历的顺序，以及方便在处理列表时跟踪节点的父节点和祖先节点。
			for (let i = node[childrenKey].length - 1; i >= 0; i--) {
				stack.push(node[childrenKey][i])
			}
		}
	}
	return list
}

export default treeToList
