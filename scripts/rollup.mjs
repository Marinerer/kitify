import { rollup, defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import generateDts from 'rollup-plugin-dts'
import { tag, colors } from 'diy-log'

const createdExternal = (() => {
	const externalMap = {
		all(_, opts) {
			return (id) => {
				// 将第三方依赖和本地模块都设置为 external
				return (
					opts.dependencies.includes(id) ||
					opts.peerDependencies.includes(id) ||
					id.startsWith('./') ||
					id.startsWith('../')
				)
			}
		},
		default(config) {
			return config.external || []
		},
	}

	return (config, options) => {
		return externalMap[options.externalMode || config.externalMode || 'default'](config, options)
	}
})()

/**
 * build
 *
 * @param {object} config 构建配置
 * @param {object} options 构建选项
 * @param {boolean} options.banner banner
 * @param {boolean} options.pkg package.json
 * @returns {Promise}
 */
async function build(config, { banner, pkg }) {
	const startTime = Date.now()
	// log(colors.blue(`[${config.name}] `) + 'Build start ...')

	const { input, filename } = config
	const dependencies = Object.keys(pkg.dependencies || {})
	const peerDependencies = Object.keys(pkg.peerDependencies || {})

	// build esm/cjs bundle
	const buildOptions = defineConfig({
		input,
		plugins: [nodeResolve(), commonjs(), json(), typescript()],
		external: createdExternal(config, { dependencies, peerDependencies }),
		output: [
			{
				file: `${filename}.${pkg.type === 'module' ? 'js' : 'mjs'}`,
				format: 'es',
				banner,
			},
			{
				file: `${filename}.${pkg.type === 'module' ? 'cjs' : 'js'}`,
				format: 'cjs',
				banner,
			},
		],
		cache: true,
	})

	// build umd/iife bundle
	const buildUmdOptions = defineConfig({
		input,
		plugins: [
			nodeResolve(),
			commonjs(),
			json(),
			typescript({ compilerOptions: { target: 'es5' } }),
		],
		external: createdExternal(config, { externalMode: 'default' }),
		output: {
			file: `${filename}.min.js`,
			format: 'iife',
			name: config.name,
			banner,
			plugins: [terser()],
			globals: config.globals || {},
			sourcemap: true,
		},
	})

	// build .d.ts
	const buildDtsOptions = defineConfig({
		input,
		plugins: [generateDts()],
		output: {
			file: `${filename}.d.ts`,
			format: 'es',
		},
	})

	try {
		const bundle = await rollup(buildOptions)
		await Promise.all(buildOptions.output.map((options) => bundle.write(options)))

		const umdBundle = await rollup(buildUmdOptions)
		await umdBundle.write(buildUmdOptions.output)

		if (config.dts !== false) {
			const dtsBundle = await rollup(buildDtsOptions)
			await dtsBundle.write(buildDtsOptions.output)
		}

		tag.success(colors.blue(`[${config.name}] `) + `Build complete. (${Date.now() - startTime}ms)`)
	} catch (error) {
		tag.error(colors.red(`[${config.name}] `) + 'Build failed: ' + error.message)
		throw error // 重新抛出错误以便外部处理
	}
}

export { build as rollupBuild }
