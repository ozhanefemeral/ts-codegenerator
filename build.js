const esbuild = require('esbuild')
const { glob } = require('glob')
const { exec } = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

async function build() {
  const entryPoints = await glob('src/**/index.ts')

  // generate .d.ts files first
  await execAsync('tsc --declaration --emitDeclarationOnly')

  const commonConfig = {
    entryPoints,
    platform: 'node',
    target: 'node18',
    bundle: true,
    minify: true,
    external: ['ts-morph', 'typescript', 'fsevents'],
    treeShaking: true,
  }

  // build esm
  await esbuild.build({
    ...commonConfig,
    format: 'esm',
    outdir: 'dist',
    outExtension: { '.js': '.mjs' },
  })

  // build cjs
  await esbuild.build({
    ...commonConfig,
    format: 'cjs',
    outdir: 'dist',
  })
}

build().catch(err => {
  console.error(err)
  process.exit(1)
}) 