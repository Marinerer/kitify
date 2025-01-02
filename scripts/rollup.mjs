import { rollup, defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import generateDts from 'rollup-plugin-dts'
import { tag, colors } from 'diy-log'

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

	const buildOptions = defineConfig({
		input,
		plugins: [nodeResolve(), commonjs(), json(), typescript()],
		external: config.external || [],
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
			{
				file: `${filename}.min.js`,
				format: 'iife',
				name: config.name,
				banner,
				plugins: [terser()],
				globals: config.globals || {},
				sourcemap: true,
			},
		],
		cache: true,
	})
	const dtsOptions = defineConfig({
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

		if (config.dts !== false) {
			const dtsBundle = await rollup(dtsOptions)
			await dtsBundle.write(dtsOptions.output)
		}

		tag.success(colors.blue(`[${config.name}] `) + `Build complete. (${Date.now() - startTime}ms)`)
	} catch (error) {
		tag.error(colors.red(`[${config.name}] `) + 'Build failed: ' + error.message)
		throw error // 重新抛出错误以便外部处理
	}
}

export { build as rollupBuild }
