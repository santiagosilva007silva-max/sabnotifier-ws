const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('SabNotifier WS Server rodando!\n');
});
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('[+] Cliente conectado. Total:', wss.clients.size);

    ws.on('message', (message) => {
        const msgStr = message.toString();
        console.log('[MSG]', msgStr.substring(0, 200));

        // Broadcast pra TODOS (incluindo o sender, pra permitir teste com 1 client)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgStr);
            }
        });
    });

    ws.on('close', () => {
        console.log('[-] Cliente desconectado. Total:', wss.clients.size);
    });

    ws.on('error', (err) => {
        console.error('[ERRO]', err);
    });
});

server.listen(PORT, () => {
    console.log('Servidor rodando na porta', PORT);
});