// @ts-nocheck
import transformTree from '../transformTree'

// 定义测试类型
interface TestNode {
	id: number
	name: string
	children?: TestNode[]
}

describe('transformTree', () => {
	// 测试基础参数校验
	it('should return empty array if input is not an array', () => {
		expect(transformTree<any>({} as any, jest.fn())).toEqual([])
		expect(transformTree<any>(null as any, jest.fn())).toEqual([])
		expect(transformTree<any>(undefined as any, jest.fn())).toEqual([])
	})

	it('should return original tree and warn if transformer is not a function', () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

		const inputTree = [{ id: 1, name: 'test' }]
		const result = transformTree<any>(inputTree as any, 'not a function' as any)

		expect(result).toEqual(inputTree)
		expect(warnSpy).toHaveBeenCalledWith('[transformTree]', 'transformer must be a function')

		warnSpy.mockRestore()
	})

	// 测试基础转换功能
	it('should transform nodes correctly with basic transformer', () => {
		const inputTree = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
		]

		const transformer = (node: TestNode) => ({
			value: node.id,
			label: node.name.toUpperCase(),
		})

		const result = transformTree(inputTree, transformer)

		expect(result).toEqual([
			{ value: 1, label: 'ALICE' },
			{ value: 2, label: 'BOB' },
		])
	})

	// 测试子节点处理
	it('should handle nested children correctly', () => {
		const inputTree = [
			{
				id: 1,
				name: 'Parent',
				children: [{ id: 2, name: 'Child' }],
			},
		]

		const transformer = (node: TestNode) => ({
			key: node.id,
			title: node.name,
		})

		const result = transformTree(inputTree, transformer)

		expect(result).toEqual([
			{
				key: 1,
				title: 'Parent',
				children: [
					{
						key: 2,
						title: 'Child',
					},
				],
			},
		])
	})

	// 测试过滤功能
	it('should apply filter to remove nodes', () => {
		const inputTree = [
			{ id: 1, name: 'A' },
			{ id: 2, name: 'B' },
			{ id: 3, name: 'C' },
		]

		const transformer = (node: TestNode) => ({ id: node.id, name: node.name })
		const filter = (item: { id: number }) => item.id % 2 === 0

		const result = transformTree(inputTree, transformer, { filter })

		expect(result).toEqual([{ id: 2, name: 'B' }])
	})

	// 测试自定义childKey
	it('should use custom childKey when provided', () => {
		const inputTree = [
			{
				id: 1,
				name: 'Root',
				children: [{ id: 2, name: 'Child' }],
			},
		]

		const transformer = (node: TestNode) => ({
			value: node.id,
			text: node.name,
		})

		const result = transformTree(inputTree, transformer, { childKey: 'subItems' })

		expect(result).toEqual([
			{
				value: 1,
				text: 'Root',
				subItems: [
					{
						value: 2,
						text: 'Child',
					},
				],
			},
		])
	})

	// 测试自定义childProp
	it('should use custom childProp when provided', () => {
		const inputTree = [
			{
				id: 1,
				name: 'Root',
				subNodes: [{ id: 2, name: 'Child' }],
			},
		]

		const transformer = (node: any) => ({
			value: node.id,
			label: node.name,
		})

		const result = transformTree(inputTree, transformer, { childProp: 'subNodes' })

		expect(result).toEqual([
			{
				value: 1,
				label: 'Root',
				children: [
					{
						value: 2,
						label: 'Child',
					},
				],
			},
		])
	})

	// 测试复杂嵌套结构
	it('should handle deeply nested structures', () => {
		const inputTree = [
			{
				id: 1,
				name: 'Level1',
				children: [
					{
						id: 2,
						name: 'Level2',
						children: [{ id: 3, name: 'Level3' }],
					},
				],
			},
		]

		const transformer = (node: TestNode) => ({
			key: node.id,
			title: node.name,
		})

		const result = transformTree(inputTree, transformer)

		expect(result).toEqual([
			{
				key: 1,
				title: 'Level1',
				children: [
					{
						key: 2,
						title: 'Level2',
						children: [{ key: 3, title: 'Level3' }],
					},
				],
			},
		])
	})

	// 测试带过滤的复杂结构
	it('should apply filter at all levels', () => {
		const inputTree = [
			{
				id: 1,
				name: 'A',
				children: [
					{ id: 2, name: 'B' },
					{ id: 3, name: 'C' },
				],
			},
			{
				id: 4,
				name: 'D',
				children: [{ id: 5, name: 'E' }],
			},
		]

		const transformer = (node: TestNode) => ({ id: node.id, name: node.name })
		const filter = (item: { id: number }) => item.id % 2 === 1

		const result = transformTree(inputTree, transformer, { filter })

		expect(result).toEqual([
			{
				id: 1,
				name: 'A',
				children: [{ id: 3, name: 'C' }],
			},
		])
	})
})
