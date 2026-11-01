import { spawn } from 'node:child_process';
const index = process.argv.indexOf('--port');
const port = index >= 0 ? process.argv[index + 1] : process.env.PORT || '3000';
const python = process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3';
const child = spawn(python, ['scripts/dev_server.py'], { stdio: 'inherit', env: { ...process.env, PORT: port } });
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code || 0));
