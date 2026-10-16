const http = require('http');
const os = require('os');
const PORT = process.env.PORT || 4000;
const server = http.createServer((req, res) => {
res.setHeader('Content-Type', 'application/json');
res.writeHead(200);
res.end(JSON.stringify({
service: 'time',
hostname: os.hostname(),
time: new Date().toISOString()
}));
});
server.listen(PORT, () => {
console.log(`Time service listening on port ${PORT}`);
});