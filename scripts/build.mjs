import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rimraf } from 'rimraf'
import minimist from 'minimist'
import fg from 'fast-glob'
import { colors, symbols } from 'diy-log'
import { rollupBuild } from './rollup.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const args = minimist(process.argv.slice(2))

async function readJSON(path) {
	const result = await fs.readFile(path, 'utf-8')
	return JSON.parse(result)
}

function generateBanner(pkg) {
	return (
		'/*!\n' +
		` * ${pkg.name} v${pkg.version}\n` +
		` * Copyright (c) ${new Date().getFullYear()} Mariner<mengqing723@gmail.com>\n` +
		` * Released under the ${pkg.license} License.\n` +
		' */'
	)
}

function updatePackage(pkg, libs) {
	const modules = libs.reduce((acc, lib) => {
		const filename = lib.split('/').pop().replace('.ts', '')
		if (filename !== 'index') {
			acc[`./${filename}`] = {
				types: `./dist/${filename}.d.ts`,
				import: `./dist/${filename}.mjs`,
				module: `./dist/${filename}.mjs`,
				require: `./dist/${filename}.js`,
			}
		}
		return acc
	}, {})
	pkg.exports = {
		'.': {
			types: './dist/index.d.ts',
			import: './dist/index.mjs',
			module: './dist/index.mjs',
			require: './dist/index.js',
		},
		...modules,
		'./package.json': './package.json',
		'./*': './*',
	}
	return pkg
}

async function buildAll() {
	try {
		await rimraf('dist')

		const startTime = Date.now()
		const pkg = await readJSON('package.json')
		const banner = generateBanner(pkg)

		const files = await fg(['src/index.ts', 'src/*/*.ts', '!src/**/_*.ts'])
		for (const file of files) {
			const filename = file.split('/').pop().replace('.ts', '')
			const name = filename === 'index' ? pkg.name : filename
			await rollupBuild({ name, input: file, filename: `dist/${filename}` }, { banner, pkg })
		}

		// update package.json
		await fs.writeFile('package.json', JSON.stringify(updatePackage(pkg, files), null, 2))

		// copy README.md and docs
		await fs.cp('../README.md', './README.md', { force: true })
		if (args.docs) {
			await fs.cp('../docs', 'docs', { recursive: true })
		}

		const endTime = Date.now()
		console.log(
			colors.blue(`[${pkg.name}] `) + `Build success in ${endTime - startTime}ms. ${symbols.done}`
		)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

;(async () => {
	await buildAll()
})()
