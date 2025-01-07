import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import generateDts from 'rollup-plugin-dts'
import fg from 'fast-glob'
import pkg from './package.json' with { type: 'json' }

function generateBanner(pkg) {
	return (
		'/*!\n' +
		` * ${pkg.name} v${pkg.version}\n` +
		` * Copyright (c) ${new Date().getFullYear()} Mariner<mengqing723@gmail.com>\n` +
		` * Released under the ${pkg.license} License.\n` +
		' */'
	)
}

const extMap = ((type) => {
	return (fileType) => {
		return fileType === 'dts'
			? {
					esm: type === 'module' ? 'd.ts' : 'd.mts',
					cjs: type === 'module' ? 'd.cts' : 'd.ts',
				}
			: {
					esm: type === 'module' ? 'js' : 'mjs',
					cjs: type === 'module' ? 'cjs' : 'js',
				}
	}
})(pkg.type)

function generateOutput(options = {}) {
	const {
		filename,
		dir = 'dist',
		type, // esm, cjs, iife, umd, dts
		banner,
		plugins,
	} = options

	if (type === 'dts') {
		return ['esm', 'cjs'].map((format) => {
			const ext = extMap('dts')[format]
			return {
				file: `${dir}/${filename}.${ext}`,
				format,
			}
		})
	}

	if (['umd', 'iife'].includes(type)) {
		return {
			file: `${dir}/${filename}.min.js`,
			format: type,
			name: filename === 'index' ? 'kitify' : filename,
			banner,
			plugins: plugins || [],
			// globals: config.globals || {},
			sourcemap: true,
		}
	}

	return ['esm', 'cjs'].map((format) => {
		const ext = extMap()[format]
		return {
			dir,
			format,
			entryFileNames: `[name].${ext}`,
			chunkFileNames: `[name]-[hash].${ext}`,
		}
	})
}

export default defineConfig(async (args) => {
	const results = []
	const banner = generateBanner(pkg)

	let files = args.input
	if (!files || files.length === 0) {
		files = await fg(['src/index.ts', 'src/*/*.ts', '!src/**/_*.ts'])
	}

	const entries = files.reduce((acc, file) => {
		const filename = file.split('/').pop().replace('.ts', '')
		acc[filename] = file
		return acc
	}, {})

	// esm, cjs
	results.push(
		defineConfig({
			plugins: [nodeResolve(), commonjs(), json(), typescript()],
			input: entries,
			output: generateOutput(),
			cache: true,
		})
	)

	// dts, umd, iife 单文件入口
	for (const file of files) {
		const filename = file.split('/').pop().replace('.ts', '')

		// dts
		results.push(
			defineConfig({
				plugins: [generateDts()],
				input: file,
				output: generateOutput({ filename, type: 'dts' }),
				cache: true,
			})
		)

		// iife
		results.push(
			defineConfig({
				plugins: [
					nodeResolve(),
					commonjs(),
					json(),
					typescript({ compilerOptions: { target: 'es5' } }),
				],
				input: file,
				output: generateOutput({
					filename,
					type: 'iife',
					banner,
					plugins: args.watch ? [] : [terser()],
				}),
				cache: true,
			})
		)
	}

	return results
})
