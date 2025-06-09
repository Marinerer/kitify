// @ts-nocheck
import findPath from '../findPath'

// 定义测试用的树结构类型
interface TreeNode {
	id: number
	name: string
	children?: TreeNode[]
}

describe('findPath', () => {
	// 构建测试用的树结构
	const buildTestTree = (): TreeNode[] => [
		{
			id: 1,
			name: 'Node 1',
			children: [
				{
					id: 2,
					name: 'Node 1-1',
					children: [
						{ id: 3, name: 'Node 1-1-1' },
						{ id: 4, name: 'Node 1-1-2' },
					],
				},
				{
					id: 5,
					name: 'Node 1-2',
				},
			],
		},
		{
			id: 6,
			name: 'Node 2',
			children: [{ id: 7, name: 'Node 2-1' }],
		},
	]

	// 通过值查找路径
	it('should find path by value', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 3, { key: 'id' })
		expect(result).toEqual([1, 2, 3])
	})

	// 通过函数查找路径
	it('should find path by function', () => {
		const tree = buildTestTree()
		const validator = (node: TreeNode) => node.name.includes('1-1')
		const result = findPath(tree, validator, { key: 'id' })
		expect(result).toEqual([1, 2])
	})

	// 非数组输入应该返回空数组
	it('should return empty array when input is not an array', () => {
		// @ts-ignore
		const result = findPath('not an array', 1, { key: 'id' })
		expect(result).toEqual([])
	})

	// 空数据处理
	it('should handle empty data', () => {
		const result = findPath([], 1, { key: 'id' })
		expect(result).toEqual([])
	})

	// 找不到路径
	it('should return empty array when path not found', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 100, { key: 'id' })
		expect(result).toEqual([])
	})

	// 自定义子节点属性
	it('should support custom child node property', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 'Node 1-1-2', {
			key: 'name',
			children: 'children',
		})
		expect(result).toEqual(['Node 1', 'Node 1-1', 'Node 1-1-2'])
	})

	// 测试自定义转换器
	it('should support data transformer', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 4, {
			key: 'id',
			transformer: (node: TreeNode) => `ID_${node.id}`,
		})
		expect(result).toEqual(['ID_1', 'ID_2', 'ID_4'])
	})

	// 多层嵌套查找应该正常工作
	it('should work with multiple levels of nesting', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 7, { key: 'id' })
		expect(result).toEqual([6, 7])
	})

	// 多个匹配节点时应该返回第一个找到的路径
	it('should return first found path when there are multiple matches', () => {
		const tree = buildTestTree()
		// 添加一个额外的节点使有两个id为2的节点
		tree.push({
			id: 2,
			name: 'Another Node 1-1',
		})

		const result = findPath(tree, 2, { key: 'id' })
		expect(result).toEqual([1, 2]) // 应该返回第一个找到的路径
	})

	// 当options为字符串时应正确解析
	it('should parse options as string correctly', () => {
		const tree = buildTestTree()
		const result = findPath(tree, 'Node 1-1', 'name' as any)
		expect(result).toEqual(['Node 1', 'Node 1-1'])
	})

	// 使用 options 默认值
	it('should use default options correctly', () => {
		// 构建使用默认key(value)和children(children)的树
		const tree = [
			{
				value: 1,
				children: [
					{
						value: 2,
						children: [{ value: 3 }],
					},
				],
			},
		]

		const result = findPath(tree, 3, { key: 'value' })
		expect(result).toEqual([1, 2, 3])
	})
})
