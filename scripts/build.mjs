import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rimraf } from 'rimraf'
import fg from 'fast-glob'
import { colors, symbols } from 'diy-log'
import { rollupBuild } from './rollup.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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

async function buildAll() {
	await rimraf('dist')

	const startTime = Date.now()
	const pkg = await readJSON('package.json')
	const banner = generateBanner(pkg)

	const files = await fg(['src/index.ts', 'src/*/*.ts'])
	for (const file of files) {
		const filename = file.split('/').pop().replace('.ts', '')
		const name = filename === 'index' ? pkg.name : filename
		await rollupBuild({ name, input: file, filename: `dist/${filename}` }, { banner, pkg })
	}

	await fs.cp('../README.md', './README.md', { force: true })
	await fs.cp('../docs', 'docs', { recursive: true })

	const endTime = Date.now()
	console.log(
		colors.blue(`[${pkg.name}] `) + `Build success in ${endTime - startTime}ms. ${symbols.done}`
	)
}

;(async () => {
	await buildAll()
})()
