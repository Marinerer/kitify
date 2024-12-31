import treeToList from '../treeToList'

describe('treeToList', () => {
	describe('normal cases', () => {
		it('should convert a tree structure to a list', () => {
			const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }, { id: 4 }]
			const result = treeToList(tree)
			expect(result).toEqual([{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }])
		})
	})

	describe('custom options', () => {
		it('should handle custom children key', () => {
			const tree = [{ _id: 1, subItems: [{ _id: 2 }, { _id: 3 }] }, { _id: 4 }]
			const result = treeToList(tree, { childrenKey: 'subItems' })
			expect(result).toEqual([{ _id: 4 }, { _id: 1 }, { _id: 2 }, { _id: 3 }])
		})

		it('should include children when specified', () => {
			const tree = [{ id: 1, children: [{ id: 2 }] }, { id: 3 }]
			const result = treeToList(tree, { removeChildren: false })
			expect(result).toEqual([{ id: 3 }, { id: 1, children: [{ id: 2 }] }, { id: 2 }])
		})

		it('should apply transformation function', () => {
			const tree = [
				{ id: 1, name: 'Node 1' },
				{ id: 2, name: 'Node 2' },
			]
			const result = treeToList(tree, {
				transform: (node) => ({ id: node.id, label: node.name }),
			})
			expect(result).toEqual([
				{ id: 2, label: 'Node 2' },
				{ id: 1, label: 'Node 1' },
			])
		})
	})

	describe('edge cases', () => {
		it('should handle non-array tree', () => {
			const result = treeToList({ id: 1 })
			expect(result).toEqual([{ id: 1 }])
		})

		it('should handle empty tree', () => {
			const result = treeToList([])
			expect(result).toEqual([])
		})

		it('should handle tree with single node', () => {
			const result = treeToList([{ id: 1 }])
			expect(result).toEqual([{ id: 1 }])
		})

		it('should handle tree with single node and children', () => {
			const result = treeToList([{ id: 1, children: [{ id: 2 }] }])
			expect(result).toEqual([{ id: 1 }, { id: 2 }])
		})

		it('should handle a tree with no children', () => {
			const tree = [{ id: 1 }, { id: 2 }]
			const result = treeToList(tree)
			expect(result).toEqual([{ id: 2 }, { id: 1 }])
		})

		it('should handle a tree with nested children', () => {
			const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }]
			const result = treeToList(tree)
			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
		})

		it('should handle a tree with multiple nested children', () => {
			const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }, { id: 4 }] }]
			const result = treeToList(tree)
			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
		})
	})

	describe('error handling', () => {
		it('should throw an error if the tree is not an array', () => {
			expect(() => treeToList(123 as any)).toThrow('tree must be an object or array')
		})

		it('should throw an error if the transform is not a function', () => {
			expect(() => treeToList([], { transform: null as any })).toThrow(
				'transform must be a function'
			)
		})
	})
})
