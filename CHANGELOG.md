# kitify

## v0.6.0

### &nbsp;&nbsp;&nbsp;🎉 Features

- Add type checking utility functions &nbsp;-&nbsp; by **Mariner** [<samp>(eaccd)</samp>](https://github.com/Marinerer/kitify/commit/eaccd97)
- Add input listener with composition event support &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/2 [<samp>(63f55)</samp>](https://github.com/Marinerer/kitify/commit/63f5500)
- Add `idlePerformTasks()` functions &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/3 [<samp>(a1c74)</samp>](https://github.com/Marinerer/kitify/commit/a1c7475)
- Add runMicrotask function &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/5 [<samp>(90819)</samp>](https://github.com/Marinerer/kitify/commit/90819a5)
- Add `loadResource` function &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/6 [<samp>(d8158)</samp>](https://github.com/Marinerer/kitify/commit/d815855)

### &nbsp;&nbsp;&nbsp;🚀 Performance

- Optimize directory structure &nbsp;-&nbsp; by **Mariner** [<samp>(b3b40)</samp>](https://github.com/Marinerer/kitify/commit/b3b4052)
- Remove `utils/idlePerformTasks` &nbsp;-&nbsp; by **Mariner** [<samp>(9ef33)</samp>](https://github.com/Marinerer/kitify/commit/9ef332f)

### &nbsp;&nbsp;&nbsp;♻️ Code Refactoring

- Replace idlePerformTasks with performTask &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/4 [<samp>(5bf8b)</samp>](https://github.com/Marinerer/kitify/commit/5bf8b9d)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.5.3...v0.6.0)


## v0.5.3

### &nbsp;&nbsp;&nbsp;🎉 Features

- **random**: Add randomIntList and enhance randomId, randomChar &nbsp;-&nbsp; by **Mariner** [<samp>(2fc12)</samp>](https://github.com/Marinerer/kitify/commit/2fc129c)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **build**:
  - Add SIGINT/SIGTERM handling in build process &nbsp;-&nbsp; by **Mariner** [<samp>(1809b)</samp>](https://github.com/Marinerer/kitify/commit/1809b03)
  - Correct signal handler references in build process &nbsp;-&nbsp; by **Mariner** [<samp>(188d8)</samp>](https://github.com/Marinerer/kitify/commit/188d81f)

### &nbsp;&nbsp;&nbsp;🚀 Performance

- Refactor isType function with overloads &nbsp;-&nbsp; by **Mariner** [<samp>(10df3)</samp>](https://github.com/Marinerer/kitify/commit/10df36a)

### &nbsp;&nbsp;&nbsp;♻️ Code Refactoring

- Default esModule mode &nbsp;-&nbsp; by **Mariner** [<samp>(ba4f9)</samp>](https://github.com/Marinerer/kitify/commit/ba4f912)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.5.2...v0.5.3)


## v0.5.2

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- Import build package error &nbsp;-&nbsp; by **Mariner** [<samp>(262ce)</samp>](https://github.com/Marinerer/kitify/commit/262ce09)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.5.1...v0.5.2)


## v0.5.1

### &nbsp;&nbsp;&nbsp;🎉 Features

- Add random utility functions &nbsp;-&nbsp; by **Mariner** in https://github.com/Marinerer/kitify/issues/1 [<samp>(c57b4)</samp>](https://github.com/Marinerer/kitify/commit/c57b424)
- Add number utility functions &nbsp;-&nbsp; by **Mariner** [<samp>(76d64)</samp>](https://github.com/Marinerer/kitify/commit/76d640d)
- Adds default start date support for randomDate function &nbsp;-&nbsp; by **Mariner** [<samp>(b8e0c)</samp>](https://github.com/Marinerer/kitify/commit/b8e0c7e)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **build**: Dependency module path issue after building index.ts &nbsp;-&nbsp; by **Mariner** [<samp>(d47ba)</samp>](https://github.com/Marinerer/kitify/commit/d47ba90)

### &nbsp;&nbsp;&nbsp;📝 Documentation

- Update README & color document &nbsp;-&nbsp; by **Mariner** [<samp>(23791)</samp>](https://github.com/Marinerer/kitify/commit/237916e)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.5.0...v0.5.1)


## v0.5.0

### &nbsp;&nbsp;&nbsp;🎉 Features

- **color**:
  - Add color validation and conversion functions &nbsp;-&nbsp; by **Mariner** [<samp>(7564a)</samp>](https://github.com/Marinerer/kitify/commit/7564a57)
  - Refactor color utility functions and add new features. &nbsp;-&nbsp; by **Mariner** [<samp>(aab2e)</samp>](https://github.com/Marinerer/kitify/commit/aab2e4b)
  - Extract luminance calculation to separate module &nbsp;-&nbsp; by **Mariner** [<samp>(8cc91)</samp>](https://github.com/Marinerer/kitify/commit/8cc9149)
  - Add type support for RGB conversion functions &nbsp;-&nbsp; by **Mariner** [<samp>(58c6c)</samp>](https://github.com/Marinerer/kitify/commit/58c6ce6)

### &nbsp;&nbsp;&nbsp;🚀 Performance

- **clone**: Remove useless code &nbsp;-&nbsp; by **Mariner** [<samp>(68a7f)</samp>](https://github.com/Marinerer/kitify/commit/68a7f5a)

### &nbsp;&nbsp;&nbsp;📝 Documentation

- Add color utility functions and update documentation &nbsp;-&nbsp; by **Mariner** [<samp>(5586f)</samp>](https://github.com/Marinerer/kitify/commit/5586f0d)

### &nbsp;&nbsp;&nbsp;♻️ Code Refactoring

- **type**: Updated isObject and added isPlainObject. &nbsp;-&nbsp; by **Mariner** [<samp>(98e50)</samp>](https://github.com/Marinerer/kitify/commit/98e50c3)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.4.1...v0.5.0)


## v0.4.1

### &nbsp;&nbsp;&nbsp;🎉 Features

- Add unit tests for listToTree function &nbsp;-&nbsp; by **Mariner** [<samp>(d6959)</samp>](https://github.com/Marinerer/kitify/commit/d69599f)
- Add treeToList utility with tests and documentation &nbsp;-&nbsp; by **Mariner** [<samp>(96f96)</samp>](https://github.com/Marinerer/kitify/commit/96f96d5)

### &nbsp;&nbsp;&nbsp;♻️ Code Refactoring

- Update core default module exports and functions &nbsp;-&nbsp; by **Mariner** [<samp>(30668)</samp>](https://github.com/Marinerer/kitify/commit/3066888)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/v0.4.0...v0.4.1)


## v0.4.0

### &nbsp;&nbsp;&nbsp;🎉 Features

- Add Release-CI (github-action) &nbsp;-&nbsp; by **Mariner** [<samp>(9c9fe)</samp>](https://github.com/Marinerer/kitify/commit/9c9fe98)
- Initial Core (README, package.json, and tsconfig.json) &nbsp;-&nbsp; by **Mariner** [<samp>(d0be5)</samp>](https://github.com/Marinerer/kitify/commit/d0be545)
- Add core library with utility functions and tests. &nbsp;-&nbsp; by **Mariner** [<samp>(af296)</samp>](https://github.com/Marinerer/kitify/commit/af296c9)

### &nbsp;&nbsp;&nbsp;📝 Documentation

- Add README and documentation for utility library &nbsp;-&nbsp; by **Mariner** [<samp>(d178b)</samp>](https://github.com/Marinerer/kitify/commit/d178bb7)

##### &nbsp;&nbsp;&nbsp;&nbsp;[View changes on GitHub](https://github.com/Marinerer/kitify/compare/daddfec391755ae4a98f876334566a1b6a0167b6...v0.4.0)


