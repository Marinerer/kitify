# Collection

Coollection related utility functions.

集合相关的工具函数。

## usage

```ts
import { clone, cloneDeep, cloneLoop, cloneJSON } from 'kitify'

import clone from 'kitify/clone'
import cloneDeep from 'kitify/cloneDeep'
import cloneLoop from 'kitify/cloneLoop'
import cloneJSON from 'kitify/cloneJSON'
```

## API

### clone

Creates a deep copy of the value.

创建一个深拷贝。

```ts
// Deep copy of the value.
clone<T>(value: T): T;

// Deep copy of the value. Supports Map,Set,ArrayBuffer...
cloneDeep<T>(value: T): T;

// Loop deep copy of the value.
cloneLoop<T>(value: T): T;

// JSON deep copy of the value.
cloneJSON<T>(value: T): T;
```
