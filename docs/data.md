# Data

Processing data related utility functions.

处理数据相关的工具函数。

## usage

```ts
import { listToTree } from 'kitify'

import listToTree from 'kitify/listToTree'
```

## API

### listToTree

Convert a list of objects to a tree structure.

将对象列表转换为树形结构。

```ts
listToTree(list: T[], options?: Options<T, R, K>): TreeNode<R, K>[];
```

#### Parameters

- `list` - The list of objects to convert.
- `options` - The options to use.
  - `idKey` - The key to use for the id. Default: `id`.
  - `parentKey` - The key to use for the parent id. Default: `parentId`.
  - `childrenKey` - The key to use for the children. Default: `children`.
  - `transform` - A function to transform each item. Default: `(item) => item`.
  - `isRoot` - A function to determine if an item is a root. Default: `(item) => !item.parentId`.

```js
const list = [
	{ id: 1, name: 'a', parentId: 0 },
	{ id: 2, name: 'b', parentId: 1 },
	{ id: 3, name: 'c', parentId: 1 },
	{ id: 4, name: 'd', parentId: 2 },
	{ id: 5, name: 'e', parentId: 2 },
]

listToTree(list)

// [{"id":1,"name":"a","parentId":0,"children":[{"id":2,"name":"b","parentId":1,"children":[{"id":4,"name":"d","parentId":2,"children":[]},{"id":5,"name":"e","parentId":2,"children":[]}]},{"id":3,"name":"c","parentId":1,"children":[]}]}]
```

### treeTolist

Convert a tree structure to a list of objects.

将树形结构转换为对象列表。

```ts
treeToList(tree: T[] | T, options?: OptionsM<T, R>): R[];
```

#### Parameters

- `tree`: The tree structure to convert.
- `options`: Optional configuration options.
  - `childrenKey`: The key for the children array. Default is `'children'`.
  - `removeChildren`: Whether to remove the children key from the transformed node. Default is `true`.
  - `transform`: A function to transform each node in the tree. Default is `(node) => node`.
