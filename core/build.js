import fs from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { rimraf } from 'rimraf'
import minimist from 'minimist'
import fg from 'fast-glob'
import { tag, symbols } from 'diy-log'

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

const runRollup = (args = []) => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now()
		console.log(`\nStarting build..`)

		// 调用 rollup 命令
		const rollupProcess = spawn('npx', ['rollup', '--config', ...args], {
			stdio: 'inherit', // 直接将子进程的输出继承到主进程
			shell: true, // 使用 shell 执行命令，兼容不同操作系统
		})

		// 监听子进程的关闭事件
		rollupProcess.on('close', (code) => {
			if (code === 0) {
				const endTime = Date.now()
				console.log(`Build success in ${endTime - startTime}ms. ${symbols.done}`)
				resolve()
			} else {
				// console.error(`Build failed with exit code ${code}.`)
				tag.error(`Build failed with exit code ${code}.`)
				reject()
			}
		})

		// 捕获错误
		rollupProcess.on('error', (err) => {
			// console.error('Build error :', err)
			tag.error(err)
			reject(err)
		})
	})
}

;(async () => {
	const args = minimist(process.argv.slice(2))

	if (args.help) {
		console.log('Usage: pnpm run build [options]')
		console.log('Options:')
		console.log('  --clean       Clean the dist directory before building')
		console.log('  --input       Input file for Rollup')
		console.log('  --info        Update package information')
		console.log('  --docs        Generate documentation')
		console.log('  --help        Show this help message')
		process.exit(0)
	}

	if (args.clean) {
		await rimraf('dist')
	}

	await runRollup(args.input ? ['--input', args.input] : [])

	if (args.info) {
		const pkg = await readJSON('package.json')
		const files = await fg(['src/index.ts', 'src/*/*.ts', '!src/**/_*.ts'])
		// update package.json
		await fs.writeFile('./package.json', JSON.stringify(updatePackage(pkg, files), null, 2))

		// copy README.md and docs
		await fs.cp('../README.md', './README.md', { force: true })
		if (args.docs) {
			await fs.cp('../docs', 'docs', { recursive: true })
		}
	}
})()
