import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
// import esbuild from 'rollup-plugin-esbuild'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import generateDts from 'rollup-plugin-dts'

function generateBanner(pkg) {
	return (
		'/*!\n' +
		` * ${pkg.name} v${pkg.version}\n` +
		` * Copyright (c) ${new Date().getFullYear()} Mariner<mengqing723@gmail.com>\n` +
		` * Released under the ${pkg.license} License.\n` +
		' */'
	)
}

const extMap = ((mode) => {
	return (format) => {
		return format === 'dts'
			? {
					esm: mode === 'module' ? 'd.ts' : 'd.mts',
					cjs: mode === 'module' ? 'd.cts' : 'd.ts',
				}
			: {
					esm: mode === 'module' ? 'js' : 'mjs',
					cjs: mode === 'module' ? 'cjs' : 'js',
				}
	}
})('module')

/**
 * 生成 output 配置
 * @param {object} options - { filename, dir, banner }
 * @param {string} type 'esm' | 'umd' | 'dts'
 * @returns
 */
function generateOutput(options = {}, type) {
	const { filename, dir = 'dist', banner } = options

	const result = {
		dts: ['esm', 'cjs'].map((format) => {
			const ext = extMap('dts')[format]
			return {
				file: `${dir}/${filename}.${ext}`,
				format,
			}
		}),
		esm: ['esm', 'cjs'].map((format) => {
			const ext = extMap()[format]
			return {
				dir,
				format,
				entryFileNames: `[name].${ext}`,
				chunkFileNames: `[name]-[hash].${ext}`,
			}
		}),
		umd: {
			file: `${dir}/${filename}.min.js`,
			format: 'iife',
			name: filename === 'index' ? 'kitify' : filename,
			banner,
			// globals: config.globals || {},
			sourcemap: true,
		},
	}
	return result[type || 'esm']
}

const buildEsmPlugins = [nodeResolve(), commonjs(), json(), typescript()]
/**
 * 生成 esm/cjs 文件 (多入口)
 */
async function buildEsm({ input, external, dir }) {
	const buildOptions = {
		plugins: buildEsmPlugins,
		input,
		output: generateOutput({ dir }, 'esm'),
		external: external || [],
		cache: true,
	}

	const bundle = await rollup(buildOptions)
	await Promise.all(buildOptions.output.map((options) => bundle.write(options)))
	bundle.close()
}

/**
 * 生成 .d.ts 文件
 */
async function buildDts({ input, filename, dir }) {
	const buildOptions = {
		plugins: [generateDts()],
		input,
		output: generateOutput({ filename, dir }, 'dts'),
		cache: true,
	}
	const bundle = await rollup(buildOptions)
	await Promise.all(buildOptions.output.map((options) => bundle.write(options)))
	bundle.close()
}

const buildUmdPlugins = [
	babel({
		babelHelpers: 'bundled',
		exclude: 'node_modules/**',
	}),
]
/**
 * 基于构建后的 esm 文件生成 iife 包
 */
async function buildUmd({ filename, dir, banner, watch }) {
	const buildOptions = {
		plugins: watch ? buildUmdPlugins : buildUmdPlugins.concat(terser()),
		input: `${dir}/${filename}.js`,
		output: generateOutput({ filename, dir, banner }, 'umd'),
		cache: true,
	}
	const bundle = await rollup(buildOptions)
	await bundle.write(buildOptions.output)
	bundle.close()
}

export { generateBanner, buildEsm, buildDts, buildUmd }
