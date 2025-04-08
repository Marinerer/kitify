# Function Methods

## Usage

```ts
import { debounce, throttle } from 'kitify'

// or

import debounce from 'kitify/debounce'
import throttle from 'kitify/throttle'
```

## API

### debounce

Debounce a function.

防抖函数。

```ts
debounce(func: function, wait: number, immediate?: boolean)

```

### throttle

Throttle a function.

节流函数。

```ts
throttle(func: function, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
})
```
