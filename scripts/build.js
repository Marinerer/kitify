import fs from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { rimraf } from 'rimraf'
import minimist from 'minimist'
import fg from 'fast-glob'
import { tag, colors, symbols } from 'diy-log'

import { generateBanner, buildEsm, buildDts, buildUmd } from './rollup.js'

async function readJSON(path) {
	const result = await fs.readFile(path, 'utf-8')
	return JSON.parse(result)
}

function updatePackage(pkg, files) {
	const ext = {
		esm: ['js', 'd.ts'],
		cjs: ['cjs', 'd.cts'],
	}
	const modules = files.reduce((acc, file) => {
		const filename = file.split('/').pop().replace('.ts', '')
		if (filename !== 'index') {
			acc[`./${filename}`] = {
				import: {
					types: `./dist/${filename}.${ext.esm[1]}`,
					default: `./dist/${filename}.${ext.esm[0]}`,
				},
				require: {
					types: `./dist/${filename}.${ext.cjs[1]}`,
					default: `./dist/${filename}.${ext.cjs[0]}`,
				},
			}
		}
		return acc
	}, {})
	pkg.exports = {
		'.': {
			import: {
				types: `./dist/index.${ext.esm[1]}`,
				default: `./dist/index.${ext.esm[0]}`,
			},
			require: {
				types: `./dist/index.${ext.cjs[1]}`,
				default: `./dist/index.${ext.cjs[0]}`,
			},
		},
		...modules,
		'./package.json': './package.json',
		'./*': './*',
	}
	return pkg
}

/**
 * 运行 rollup 命令
 * @example `runRollup(args.input ? ['--input', args.input] : [])`
 */
const runRollup = (args = []) => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now()
		console.log(`\nStarting build..`)

		// 调用 rollup 命令
		const rollupProcess = spawn('npx', ['rollup', '--config', ...args], {
			stdio: 'inherit', // 直接将子进程的输出继承到主进程
			shell: true, // 使用 shell 执行命令，兼容不同操作系统
		})

		// 处理主进程的 SIGINT 信号（Ctrl+C）
		const handleSIGINT = (signal) => {
			console.log(`\nReceived ${signal}, cleaning up...`)
			// 终止子进程
			rollupProcess.kill('SIGTERM')
			// 等待子进程结束后再退出主进程
			process.exit(0)
		}

		// 监听 SIGINT 和 SIGTERM 信号
		process.on('SIGINT', handleSIGINT)
		process.on('SIGTERM', handleSIGINT)

		// 监听子进程的关闭事件
		rollupProcess.on('close', (code) => {
			// 清理信号监听器
			process.off('SIGINT', handleSIGINT)
			process.off('SIGTERM', handleSIGINT)

			if (code === 0) {
				const endTime = Date.now()
				console.log(`Build success in ${endTime - startTime}ms. ${symbols.done}`)
				resolve()
			} else {
				const err = `Build failed with exit code ${code}.`
				tag.error(err)
				reject(new Error(err))
			}
		})

		// 监听子进程的错误事件
		rollupProcess.on('error', (err) => {
			// 清理信号监听器
			process.off('SIGINT', handleSIGINT)
			process.off('SIGTERM', handleSIGINT)

			tag.error(err)
			reject(err)
		})
	})
}

async function buildAll(files, { dir = 'dist', pkg, watch }) {
	const banner = generateBanner(pkg)

	console.time('build')
	const buildStartTime = Date.now()
	await buildEsm({
		input: files.reduce((acc, file) => {
			const filename = file.split('/').pop().replace('.ts', '')
			acc[filename] = file
			return acc
		}, {}),
		dir,
		watch,
	})
	console.log(
		colors.blue(`[kitify] `) + `Build success in ${Date.now() - buildStartTime}ms. ${symbols.done}`
	)

	for (const file of files) {
		const startTime = Date.now()
		const filename = file.split('/').pop().replace('.ts', '')

		await buildDts({ input: file, filename, dir, watch })
		await buildUmd({ filename, dir, banner, watch })

		const endTime = Date.now()
		console.log(
			colors.blue(`[${filename}] `) + `Build success in ${endTime - startTime}ms. ${symbols.done}`
		)
	}
	console.timeEnd('build')
}

;(async () => {
	const args = minimist(process.argv.slice(2))
	const dir = 'dist'

	if (args.help) {
		console.log('Usage: pnpm run build [options]')
		console.log('Options:')
		console.log('  --clean       Clean the dist directory before building')
		console.log('  --input       Input file for Rollup')
		console.log('  --info        Update package information')
		console.log('  --docs        Generate documentation')
		console.log('  --watch       Watch for changes and rebuild')
		console.log('  --help        Show this help message')
		process.exit(0)
	}

	if (args.clean) {
		await rimraf(dir)
	}

	const pkg = await readJSON('package.json')
	const files = args.input
		? await fg(args.input.split(','))
		: await fg(['src/*.ts', 'src/*/*.ts', '!src/**/_*.ts'])

	await buildAll(files, { dir, pkg, watch: args.watch })

	if (args.info && !args.watch) {
		// update package.json
		await fs.writeFile('./package.json', JSON.stringify(updatePackage(pkg, files), null, 2))

		// copy README.md and docs
		await fs.cp('../README.md', './README.md', { force: true })
		if (args.docs) {
			await fs.cp('../docs', 'docs', { recursive: true })
		}
	}
})()
