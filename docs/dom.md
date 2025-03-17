# DOM

DOM related utility functions

DOM元素相关工具函数。

## usage

```ts
import { detectMouseDirection, addInputListener } from 'kitify'

import detectMouseDirection from 'kitify/detectMouseDirection'
import addInputListener from 'kitify/addInputListener'
import loadResource from 'kitify/loadResource'
```

## Functions

### detectMouseDirection

Detect the direction of `mouseenter` and `mouseleave` when the mouse moves over element.

检测鼠标移动到指定元素时的移入和移出方向。

```ts
function detectMouseDirection(
	element: HTMLElement,
	onEnter: Callback,
	onLeave: Callback
): () => void

/*
Callback = (
	direction: 'up' | 'down' | 'left' | 'right',
	event: MouseEvent
) => void
*/
```

#### Parameters

- `element` - The element to detect the mouse direction.
- `onEnter` - The callback function when the mouse enters the element.
- `onLeave` - The callback function when the mouse leaves the element.

#### returns

- `() => void` - The function to remove the event listeners.

### addInputListener

handle input event with composition events.

处理输入事件，支持中文输入法。

```ts
function addInputListener(
	inputEl: string | HTMLInputElement,
	callback: (value: string, event: Event) => void
): () => void
```

#### Parameters

- `inputEl` - The input element or the selector of the input element.
- `callback` - The callback function when the input event is triggered.

#### returns

- `() => void` - The function to remove the event listeners.

### loadResource

Static resource loading function, support `img`, `script`, `link` tags.

静态资源加载函数，支持 `img`、`script`、`link` 标签，且智能检测已存在资源，避免重复加载。

```ts
function loadResource(
	url: string,
	options?: T | IOptions<T>
):
	| {
			element: TagElementMap[T]
			clean: () => void
	  }
	| undefined
```

#### Parameters

- `url` (string): The URL of the resource to load
- `options` (Object|string): Configuration options（`'img'|'script'|'link'`）

#### Options

| 选项         | 类型        | 默认值                       | 描述                                             |
| ------------ | ----------- | ---------------------------- | ------------------------------------------------ |
| `tag`        | string      | 'img'                        | Resource Label Type（`'img'、'script'、'link'`） |
| `attributes` | Object      | { crossorigin: 'anonymous' } | HTML attributes                                  |
| `async`      | boolean     | true                         | Whether to load scripts asynchronously           |
| `defer`      | boolean     | false                        | Whether to delay loading scripts                 |
| `timeout`    | number      | 0                            | Load timeout (ms). 0 indicates no timeout        |
| `onload`     | function    | -                            | Success callback                                 |
| `onerror`    | function    | -                            | Failed callback                                  |
| `checkExist` | boolean     | true                         | Whether to check if the resource already exists  |
| `appendTo`   | HTMLElement | document.body/head           | Attach resources to the DOM element              |

#### returns

- `element`: Tag element
- `clean`: Cleanup function
