# Jotter

> Developing some lightweight front-end libraries (build wheels). Mainly "simple, generic, no dependencies".

记录一些轻量级的前端库 (造轮子)。👉 主打 "简洁、通用、无依赖"。

全部来自工作中开发的源码，非常适合项目中实现一些简单功能。

## 📦 Packages

| Package                                                                             | Version                                                                                                                           | Description                                                                         |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [@jotter/websocket](https://github.com/Marinerer/jotter/tree/main/libs/websocket)   | [![version](https://img.shields.io/npm/v/@jotter/websocket?style=flat-square)](https://www.npmjs.com/package/@jotter/websocket)   | Modern and useful WebSocket wrapper, with standard WebSocket API.                   |
| [@jotter/animator](https://github.com/Marinerer/jotter/tree/main/libs/Animator)     | [![version](https://img.shields.io/npm/v/@jotter/animator?style=flat-square)](https://www.npmjs.com/package/@jotter/animator)     | Animator is an animation playback controller.                                       |
| [@jotter/drag](https://github.com/Marinerer/jotter/tree/main/libs/Drag)             | [![version](https://img.shields.io/npm/v/@jotter/drag?style=flat-square)](https://www.npmjs.com/package/@jotter/animator)         | Lightweight "drag-and-drop" library of draggable elements within a specified range. |
| [dom-event-emit](https://github.com/Marinerer/jotter/tree/main/libs/domEmit)        | [![version](https://img.shields.io/npm/v/dom-event-emit?style=flat-square)](https://www.npmjs.com/package/dom-event-emit)         | A type-safe, flexible DOM event emitter for browser environments.                   |
| [@jotter/emitter](https://github.com/Marinerer/jotter/tree/main/libs/emitter)       | [![version](https://img.shields.io/npm/v/@jotter/emitter?style=flat-square)](https://www.npmjs.com/package/@jotter/emitter)       | Simple and modern event emitter library.                                            |
| [@jotter/dateformat](https://github.com/Marinerer/jotter/tree/main/libs/dateFormat) | [![version](https://img.shields.io/npm/v/@jotter/dateformat?style=flat-square)](https://www.npmjs.com/package/@jotter/dateformat) | A date/time formatting function.                                                    |
| [@jotter/from-now](https://github.com/Marinerer/jotter/tree/main/libs/fromNow)      | [![version](https://img.shields.io/npm/v/@jotter/from-now?style=flat-square)](https://www.npmjs.com/package/@jotter/from-now)     | A relative time formatting functions.                                               |
| [@jotter/position](https://github.com/Marinerer/jotter/tree/main/libs/position)     | [![version](https://img.shields.io/npm/v/@jotter/position?style=flat-square)](https://www.npmjs.com/package/@jotter/position)     | Positioning a DOM element relative to another DOM element.                          |

### @jotter/websocket

📚 [Document](./libs/websocket/README.md)

> Modern and useful WebSocket API wrapper class with additional features such as auto-reconnect, message queuing and Keep-alive detection.
>
> 标准且实用的 WebSocket 包装器，具有标准 `WebSocket API`。支持心跳检测，异常消息处理和自动重连机制。

- ⏰ With Standard WebSocket API
- 🧬 Automatic Reconnection
- 💓 Keep-alive (Ping) Support
- 📮 Message Queuing
- 🌐 Flexible Configuration

### @jotter/animator

📚 [Document](./libs/Animator/README.md)

> A lightweight animation controller library for managing time-based animation progress.
>
> 一个轻量级的动画控制库，用于管理基于时间的动画进度。

- ⏯ Pause/Resume support
- 🔄 Loop animation support
- 🚥 Progress Control
- 🚌 Rate Control
- ⏱ Forward/Backward control
- 🎯 Custom Animation

### @jotter/drag

📚 [Document](./libs/Drag/README.md)

> A lightweight, flexible `drag-and-drop` library for making DOM elements draggable with mouse and touch support.
>
> 一个轻量级的拖拽库，允许你快速而轻松地使DOM元素在指定区域内拖动。

- 🎯 Directional constraints (horizontal/vertical/free)
- 📱 Mouse and touch support
- 🔒 Customizable drag boundaries
- 🎨 Position or transform-based movement
- 🎮 Custom drag handles
- 📦 Zero dependencies

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/Marinerer/jotter/pulls).
