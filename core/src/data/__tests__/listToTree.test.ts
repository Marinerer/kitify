import listToTree from '../listToTree'

describe('listToTree', () => {
	interface ListItem {
		id: number
		parentId?: number
		name: string
	}

	it('should convert a flat list to a tree structure', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root' },
			{ id: 2, parentId: 1, name: 'Child 1' },
			{ id: 3, parentId: 1, name: 'Child 2' },
		]

		const result = listToTree(list)

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				children: [
					{ id: 2, name: 'Child 1', parentId: 1, children: [] },
					{ id: 3, name: 'Child 2', parentId: 1, children: [] },
				],
			},
		])
	})

	it('should handle empty list', () => {
		const list: ListItem[] = []
		const result = listToTree(list)
		expect(result).toEqual([])
	})

	it('should throw TypeError if list is not an array', () => {
		expect(() => listToTree({} as any)).toThrow(TypeError)
	})

	it('should throw TypeError if transform is not a function', () => {
		const list: ListItem[] = [{ id: 1, name: 'Root' }]
		expect(() => listToTree(list, { transform: 'not a function' } as any)).toThrow(TypeError)
	})

	it('should throw TypeError if isRoot is not a function', () => {
		const list: ListItem[] = [{ id: 1, name: 'Root' }]
		expect(() => listToTree(list, { isRoot: 'not a function' } as any)).toThrow(TypeError)
	})

	it('should use custom idKey, parentKey, and childrenKey', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root' },
			{ id: 2, parentId: 1, name: 'Child 1' },
		]

		const result = listToTree(list, {
			idKey: 'id',
			parentKey: 'parentId',
			childrenKey: 'kids',
		})

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				kids: [{ id: 2, name: 'Child 1', parentId: 1, kids: [] }],
			},
		])
	})

	it('should use custom transform function', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root' },
			{ id: 2, parentId: 1, name: 'Child 1' },
		]

		const result = listToTree(list, {
			transform: (item) => ({ id: item.id, extra: 'extra' }),
		})

		expect(result).toEqual([
			{
				id: 1,
				extra: 'extra',
				children: [{ id: 2, extra: 'extra', children: [] }],
			},
		])
	})

	it('should use custom isRoot function', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root', parentId: 0 },
			{ id: 2, parentId: 1, name: 'Child 1' },
		]

		const result = listToTree(list, {
			isRoot: (item) => item.parentId === 0,
		})

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				parentId: 0,
				children: [{ id: 2, name: 'Child 1', parentId: 1, children: [] }],
			},
		])
	})

	it('should handle nodes with missing parent', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root' },
			{ id: 2, parentId: 999, name: 'Orphan' },
		]

		const result = listToTree(list)

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root',
				children: [],
			},
		])
	})

	it('should handle multiple root nodes', () => {
		const list: ListItem[] = [
			{ id: 1, name: 'Root 1' },
			{ id: 2, name: 'Root 2' },
			{ id: 3, parentId: 1, name: 'Child 1' },
		]

		const result = listToTree(list)

		expect(result).toEqual([
			{
				id: 1,
				name: 'Root 1',
				children: [{ id: 3, name: 'Child 1', parentId: 1, children: [] }],
			},
			{
				id: 2,
				name: 'Root 2',
				children: [],
			},
		])
	})
})
