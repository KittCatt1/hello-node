const http = require('http');
const os = require('os');
const PORT = process.env.PORT || 3000;
// The hostname "time" is the name of the other service in
// docker-compose.yml. Docker Compose gives every service its
// own DNS name on the shared network.
const TIME_URL = process.env.TIME_URL || 'http://time:4000/';
function getJson(url) {
return new Promise((resolve, reject) => {
http.get(url, (r) => {
let data = '';
r.on('data', (chunk) => (data += chunk));
r.on('end', () => {
try { resolve(JSON.parse(data)); }
catch (e) { reject(e); }
});
}).on('error', reject);
});
}
const server = http.createServer(async (req, res) => {
res.setHeader('Content-Type', 'application/json');
if (req.url === '/health') {
res.writeHead(200);
res.end(JSON.stringify({ status: 'ok' }));
return;
}
// Ask the time service for the time, then include it in our reply.
let timeReply;
try {
timeReply = await getJson(TIME_URL);
} catch (e) {timeReply = { error: 'could not reach time service' };
}
res.writeHead(200);
res.end(JSON.stringify({
message: 'Hello from the web service!',
hostname: os.hostname(),
timeService: timeReply
}));
});
server.listen(PORT, () => {
console.log(`Web service listening on port ${PORT}`);
});