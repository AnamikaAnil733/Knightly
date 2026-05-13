const { spawn } = require('child_process');
const path = require('path');

const stockfish = spawn('node', [path.join(__dirname, 'node_modules/stockfish/scripts/cli.js')]);

stockfish.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

stockfish.stderr.on('data', (data) => {
    console.log(`STDERR: ${data}`);
});

stockfish.stdin.write('uci\n');

setTimeout(() => {
    stockfish.stdin.write('quit\n');
}, 2000);
