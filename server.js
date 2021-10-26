//https://www.npmjs.com/package/ws#simple-server
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

console.log("Server running");

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  //ws.send('something');
});