import { readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'

const envFile = '.env.local'
const localEnv = {}

for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/)
  if (!match) continue
  const [, name, rawValue] = match
  localEnv[name] = rawValue.replace(/^(['"])(.*)\1$/, '$2')
}

const command = process.platform === 'win32' ? 'vercel.cmd' : 'vercel'
const child = spawn(command, ['dev', '--local', '--listen', '3000'], {
  env: { ...process.env, ...localEnv },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
