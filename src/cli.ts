#! /usr/bin/env node

import sade from 'sade'
import packageJson from '../package.json'
import kleur from 'kleur'

const prog = sade('type-safe-path', true)
prog
  .version(packageJson.version)
  .option('-c, --config', 'config file path. e.g. tsp.config.ts')
  .option('-o, --output', 'output file path e.g. src/path.ts')
  .action(async (opts) => {
    try {
      const { run } = await import('./run')
      run({ configFilePath: opts.config })
    } catch (e: any) {
      console.log(kleur.red(e.message))
    }
  })

prog.parse(process.argv)
