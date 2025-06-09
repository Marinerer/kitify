# kitify

[![version][npm-image]][npm-url]
[![CI status][github-action-image]][github-action-url]
[![codecov][codecov-image]][codecov-url]
[![downloads][downloads-image]][npm-url]
[![size][bundlephobia-image]](https://bundlephobia.com/package/kitify)
[![browsers](https://img.shields.io/badge/Browser-IE11-brightgreen?style=flat-square)][github-url]

[github-url]: https://github.com/Marinerer/kitify
[npm-url]: https://www.npmjs.com/package/kitify
[npm-image]: https://img.shields.io/npm/v/kitify?style=flat-square
[github-action-image]: https://img.shields.io/github/actions/workflow/status/Marinerer/kitify/release.yml?style=flat-square
[github-action-url]: https://github.com/Marinerer/kitify/actions/workflows/release.yml
[codecov-image]: https://codecov.io/gh/Marinerer/kitify/graph/badge.svg?token=MILBKA1OO7
[codecov-url]: https://codecov.io/gh/Marinerer/kitify
[downloads-image]: https://img.shields.io/npm/dm/kitify?style=flat-square
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/kitify?style=flat-square

`kitify` (`kit + ify`) is a JavaScript utility library that provides a whole mess of useful helper functions and supports modularity.

`kitify` 是一个 JavaScript 工具函数包，它提供了一大堆有用的辅助工具函数, 并支持模块化。

## Installation

```bash
npm install kitify
```

## Usage

```js
import { isType, clone } from 'kitify'
// or
import isType from 'kitify/isType'
import clone from 'kitify/clone'

isType(123) // 'number'
isType('hello', 'string') // true
clone({ a: 1, b: 2 }) // { a: 1, b: 2 }
```

## API

### [DOM](./docs/dom.md)

DOM Methods

| Method                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `detectMouseDirection` | Detect mouse movement direction in element. |
| `addInputListener`     | handle input event with composition events. |
| `loadResource`         | Static resource load function.              |

### [Type](./docs/type.md)

Provides some methods for interpreting data types.

| Method        | Description                                  |
| ------------- | -------------------------------------------- |
| `isType`      | Check if the value is of the specified type. |
| `isObject`    | Check if the value is an object.             |
| `isFunction`  | Check if the value is a function.            |
| `isString`    | Check if the value is a string.              |
| `isNumber`    | Check if the value is a number.              |
| `isBoolean`   | Check if the value is a boolean.             |
| `isArray`     | Check if the value is an array.              |
| `isSymbol`    | Check if the value is a symbol.              |
| `isUndefined` | Check if the value is undefined.             |
| `isNull`      | Check if the value is null.                  |
| `isBigInt`    | Check if the value is a BigInt.              |
| `isNil`       | Check if the value is null or undefined.     |
| `isEmpty`     | Check if the value is empty.                 |
| `isInvalid`   | Check if the value is invalid.               |

### [Function](./docs/function.md)

Function Methods
| Method | Description |
| ----------- | ------------------------------------------------------------------------------- |
| `debounce` | Debounce a function. |
| `throttle` | Throttle a function. |

### [Collection](./docs/collection.md)

Collection Methods

| Method      | Description                                             |
| ----------- | ------------------------------------------------------- |
| `clone`     | Deep copy of the value.                                 |
| `cloneDeep` | Deep copy of the value. Supports Map,Set,ArrayBuffer... |
| `cloneLoop` | Loop deep copy of the value.                            |
| `cloneJSON` | JSON deep copy of the value.                            |

### [Object](./docs/object.md)

Object Methods

| Method   | Description                      |
| -------- | -------------------------------- |
| `assign` | Merge objects into a new object. |

### [Data](./docs/data.md)

Data Methods

| Method          | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| `listToTree`    | Convert list to tree.                                                    |
| `treeToList`    | Convert tree to list.                                                    |
| `transformTree` | Transform a tree structure by applying a function to each node.          |
| `findPath`      | Find the path from the root node to the target node in a tree structure. |

### [Color](./docs/color.md)

Color Methods

| Method               | Description                        |
| -------------------- | ---------------------------------- |
| `isHexColor`         | Check if the value is a hex color. |
| `isRgbColor`         | Check if the value is a rgb color. |
| `isHslColor`         | Check if the value is a hsl color. |
| `isDarkColor`        | Check if the color is dark.        |
| `isLightColor`       | Check if the color is light.       |
| `hexToRgb`           | Convert hex color to rgb.          |
| `rgbToHex`           | Convert rgb color to hex.          |
| `colorRGB`           | Convert color to `[R,G,B]`.        |
| `setColorOpacity`    | Set the opacity of the color.      |
| `setColorBrightness` | Set the brightness of the color.   |
| `darkenColor`        | Darken the color.                  |
| `lightenColor`       | Lighten the color.                 |
| `mixColors`          | Mix two colors.                    |
| `colorComplementary` | Get the complementary color.       |
| `colorLuminance`     | Get the luminance of the color.    |
| `colorContrast`      | Get the contrast of the color.     |

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/Marinerer/kitify/pulls).
